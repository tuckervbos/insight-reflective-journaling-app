from app.models import db, Entry, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

def seed_entries():
    entries_data = [
        {"user_id": 1, "title": "Daily Reflection", "body": "Today was productive.", "created_at": datetime.utcnow()},
        {"user_id": 2, "title": "Workout Log", "body": "Ran 5 miles.", "created_at": datetime.utcnow()},
        {"user_id": 1, "title": "Meeting Notes", "body": "Discussed project deadlines.", "created_at": datetime.utcnow()},
    ]
    entries = [Entry(**entry_data) for entry_data in entries_data]
    db.session.add_all(entries)
    db.session.commit()

def undo_entries():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.entries RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM entries"))
    db.session.commit()