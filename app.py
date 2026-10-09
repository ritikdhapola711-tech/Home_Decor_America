from flask import Flask, jsonify, request, send_from_directory
import mysql.connector

app = Flask(__name__)


def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="home_decor_db"
    )


@app.route("/")
def home():
    return send_from_directory("static", "index.html")


@app.route("/api/buyers")
def get_buyers():
    location = request.args.get("location", "")
    interest = request.args.get("interest", "")

    db = None
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        query = """
            SELECT * FROM buyers
            WHERE (city LIKE %s OR state LIKE %s OR %s = '')
            AND (interest LIKE %s OR %s = '')
        """

        loc_param = f"%{location}%" if location else ""
        int_param = f"%{interest}%" if interest else ""

        cursor.execute(query, (loc_param, loc_param, location, int_param, interest))
        buyers = cursor.fetchall()

        cursor.close()
        return jsonify(buyers)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if db and db.is_connected():
            db.close()


if __name__ == "__main__":
    app.run(debug=True)
