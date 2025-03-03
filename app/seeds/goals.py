from app.models import db, Goal, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime, timedelta

def seed_goals():
    base_date = datetime.utcnow()
    goals_data = [
        {
            "user_id": 1,
            "title": "Daily Reflection",
            "description": "Reflect on daily achievements.",
            "status": "in_progress",
            "created_at": base_date - timedelta(days=2),
        },
        {
            "user_id": 1,
            "title": "Weekly Planning",
            "description": "Plan and prioritize tasks for the week ahead.",
            "status": "on_hold",
            "created_at": base_date - timedelta(days=10),
        },
        {
            "user_id": 1,
            "title": "Monthly Review",
            "description": "Evaluate progress and set new objectives for the month.",
            "status": "completed",
            "created_at": base_date - timedelta(days=30),
        },
        {
            "user_id": 1,
            "title": "Self-Care Challenge",
            "description": "Incorporate one self-care activity each day.",
            "status": "in_progress",
            "created_at": base_date - timedelta(days=5),
        },
        {
            "user_id": 1,
            "title": "Exercise Routine",
            "description": "Establish a consistent workout schedule.",
            "status": "completed",
            "created_at": base_date - timedelta(days=15),
        },
        {
            "user_id": 1,
            "title": "Reading Challenge",
            "description": "Read at least one book per month.",
            "status": "on_hold",
            "created_at": base_date - timedelta(days=20),
        },
        {
            "user_id": 1,
            "title": "Learn a New Skill",
            "description": "Complete an online course in a new topic.",
            "status": "cancelled",
            "created_at": base_date - timedelta(days=25),
        },
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