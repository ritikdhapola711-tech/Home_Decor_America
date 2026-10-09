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
    location = request.args.get("location", "").strip()
    interest = request.args.get("interest", "").strip()

    db = None
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        # SQL Query that handles optional search parameters dynamically
        query = """
            SELECT * FROM buyers
            WHERE (%s = '' OR city LIKE %s OR state LIKE %s)
            AND (%s = '' OR interest LIKE %s)
        """

        loc_param = f"%{location}%"
        int_param = f"%{interest}%"

        cursor.execute(query, (location, loc_param, loc_param, interest, int_param))
        buyers = cursor.fetchall()

        cursor.close()
        return jsonify(buyers)

    except Exception as e:
        print("Database Error:", str(e))
        return jsonify({"error": "Failed to fetch buyers from database."}), 500

    finally:
        if db and db.is_connected():
            db.close()


if __name__ == "__main__":
    app.run(debug=True)
