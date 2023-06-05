import os
import psycopg2
from datetime import datetime, timezone
from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template
import re

CREATE_USERS_TABLE = (
    "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name TEXT, email TEXT);"
)

CREATE_PASSWORDS_TABLE = (
    "CREATE TABLE IF NOT EXISTS passwords (id SERIAL PRIMARY KEY, user_id INTEGER, password TEXT, FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE);"
)
                                                
INSERT_USER_RETURN_ID = "INSERT INTO users (name, email) VALUES (%s, %s) RETURNING id;"

INSERT_PASSWORD = "INSERT INTO passwords (user_id, password) VALUES (%s, %s);"

load_dotenv()
app = Flask(__name__)
url = os.getenv("DATABASE_URL")
connection = psycopg2.connect(url)

@app.post("/api/user")
def create_user():
    data = request.get_json()
    name = data["name"]
    email = data["email"]

    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return {"error": "Invalid email address."}, 400


    with connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT id FROM users WHERE name = %s", (name,))
            existing_user_name = cursor.fetchone()
        
    with connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
            existing_user_email = cursor.fetchone()

    if existing_user_name and existing_user_email:
        return {"error": "Username and email are already taken."}, 400
    elif existing_user_name:
        return {"error": "Username is already taken."}, 400
    elif existing_user_email:
        return {"error": "Email is already taken."}, 400
    
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_USERS_TABLE)
            cursor.execute(INSERT_USER_RETURN_ID, (name, email,))
            user_id = cursor.fetchone()[0]
            
    return {"id": user_id, "message": f"User {name} created."}, 201


@app.post("/api/password")
def add_password():
    data = request.get_json()
    user_id = data["user"]
    password = data["password"]
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_PASSWORDS_TABLE)
            cursor.execute(INSERT_PASSWORD, (user_id, password,))
    return {"message": "Password added."}, 201

        
#def delete_post(post_id):
    with connection:
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM users WHERE id = %s", (post_id,))
    
    print("Post deleted successfully!")

# Usage example: delete post with ID 44 from the "rooms" table
#delete_post(44)

def delete_all_users():
    with connection:
        with connection.cursor() as cursor:
            # Execute the DELETE statement without conditions
            cursor.execute("DELETE FROM users;")
    
    print("All posts deleted successfully!")
# Usage example: delete all posts from the "posts" table

def delete_all_passwords():
    with connection:
        with connection.cursor() as cursor:
            # Execute the DELETE statement without conditions
            cursor.execute("DELETE FROM passwords;")
    
    print("All posts deleted successfully!")
# Usage example: delete all posts from the "posts" table

def reset_id_sequence(table_name):
    with connection:
        with connection.cursor() as cursor:
            # Get the maximum ID value
            cursor.execute(f"SELECT MAX(id) FROM {table_name};")
            max_id = cursor.fetchone()[0]

            # Reset the sequence with the next value
            if max_id:
                cursor.execute(f"ALTER SEQUENCE {table_name}_id_seq RESTART WITH {max_id + 1};")
            else:
                cursor.execute(f"ALTER SEQUENCE {table_name}_id_seq RESTART WITH 1;")

    print(f"ID sequence for {table_name} reset successfully!")

#delete_all_users()
#reset_id_sequence("users")
#delete_all_passwords()
#reset_id_sequence("passwords")

@app.route('/')
def home():
    return render_template('page2.html')

@app.route('/Practice')
def index():
    return render_template('index.html')

if __name__ == "__main__":
    app.run(debug=True)

