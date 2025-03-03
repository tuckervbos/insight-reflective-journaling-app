from app.models import db, EntryGoal, environment, SCHEMA
from sqlalchemy.sql import text

def seed_entry_goals():
    entry_goals_data = [
        {"entry_id": 1, "goal_id": 1},
        {"entry_id": 2, "goal_id": 2},
        {"entry_id": 3, "goal_id": 3},
        {"entry_id": 4, "goal_id": 4},
        {"entry_id": 5, "goal_id": 5},
        {"entry_id": 6, "goal_id": 6},
        {"entry_id": 7, "goal_id": 7},
        {"entry_id": 8, "goal_id": 1},
        {"entry_id": 9, "goal_id": 2},
        {"entry_id": 10, "goal_id": 3},
    ]
    entry_goals = [EntryGoal(**entry_goal_data) for entry_goal_data in entry_goals_data]
    db.session.add_all(entry_goals)
    db.session.commit()

def undo_entry_goals():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.entry_goals RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM entry_goals"))
    db.session.commit()