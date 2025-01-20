from app.models import db, Milestone, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

def seed_milestones():
    milestones_data = [
        {
            "user_id": 1,
            "milestone_name": "Finish reading a book",
            "is_completed": False,
            "goal_id": 1,  # Assuming goal_id 1 exists in your seed data
            "created_at": datetime.utcnow(),
        },
        {
            "user_id": 2,
            "milestone_name": "Submit project proposal",
            "is_completed": True,
            "goal_id": 2,  # Assuming goal_id 2 exists
            "created_at": datetime.utcnow(),
        },
        {
            "user_id": 1,
            "milestone_name": "Run 5 miles",
            "is_completed": False,
            "goal_id": 3,  # Assuming goal_id 3 exists
            "created_at": datetime.utcnow(),
        },
    ]

    milestones = [Milestone(**milestone_data) for milestone_data in milestones_data]
    db.session.add_all(milestones)
    db.session.commit()

def undo_milestones():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.milestones RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM milestones"))
    db.session.commit()