from app.models import db, Goal, environment, SCHEMA
from sqlalchemy.sql import text

def seed_goals():
    goals_data = [
        {"user_id": 1, "title": "Daily Reflection", "description": "Reflect on daily achievements.", "status": "in_progress"},
        {"user_id": 2, "title": "Weekly Planning", "description": "Plan priorities for the week.", "status": "on_hold"},
        {"user_id": 3, "title": "Yearly Goals", "description": "Set yearly objectives.", "status": "completed"},
        {"user_id": 4, "title": "Personal Growth", "description": "Focus on self-improvement.", "status": "cancelled"},
    ]
    goals = [Goal(**data) for data in goals_data]
    db.session.add_all(goals)
    db.session.commit()

def undo_goals():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.goals RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM goals"))
    db.session.commit()