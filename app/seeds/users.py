from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
# def seed_users():
#     demo = User(
#         username='Demo', email='demo@aa.io', password='password')
#     marnie = User(
#         username='marnie', email='marnie@aa.io', password='password')
#     bobbie = User(
#         username='bobbie', email='bobbie@aa.io', password='password')

#     db.session.add(demo)
#     db.session.add(marnie)
#     db.session.add(bobbie)
#     db.session.commit()

def seed_users():
    users_data = [
        {"username": "demo", "email": "demo@example.com", "password": "password123"},
        {"username": "johndoe", "email": "johndoe@example.com", "password": "password123"},
        {"username": "janedoe", "email": "janedoe@example.com", "password": "password123"},
        {"username": "alice", "email": "alice@example.com", "password": "password123"},
        {"username": "bob", "email": "bob@example.com", "password": "password123"},
    ]
    users = [User(username=user['username'], email=user['email'], hashed_password=user['password']) for user in users_data]
    db.session.add_all(users)
    db.session.commit()



# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))
        
    db.session.commit()
