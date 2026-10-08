from flask import Flask, jsonify, send_from_directory
import mysql.connector
from flask import request
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

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM buyers")

    buyers = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify(buyers)


if __name__ == "__main__":
    app.run(debug=True)
app = Flask(__name__)


@app.route("/")
def home():
    return send_from_directory("static", "index.html")


if __name__ == "__main__":
    app.run(debug=True) 
@app.route("/api/buyers")
def get_buyers():

    location = request.args.get("location", "")
    interest = request.args.get("interest", "")

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    query = """
        SELECT * FROM buyers
        WHERE city LIKE %s
        AND interest LIKE %s
    """

    cursor.execute(query, (f"%{location}%", f"%{interest}%"))

    buyers = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify(buyers)
