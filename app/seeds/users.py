from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text
from werkzeug.security import generate_password_hash

def seed_users():
    db.session.query(User).delete()  # This deletes all rows in the 'users' table

    users_data = [
        {"username": "demo", "email": "demo@example.com", "password": "password123"},
        {"username": "johndoe", "email": "johndoe@example.com", "password": "password123"},
        {"username": "janedoe", "email": "janedoe@example.com", "password": "password123"},
        {"username": "alice", "email": "alice@example.com", "password": "password123"},
        {"username": "bob", "email": "bob@example.com", "password": "password123"},
    ]
    # Hash passwords before inserting them into the database
    users = [
        User(
            username=user['username'],
            email=user['email'],
            hashed_password=generate_password_hash(user['password'])
        )
        for user in users_data
    ]
    db.session.add_all(users)
    db.session.commit()

def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))
    db.session.commit()