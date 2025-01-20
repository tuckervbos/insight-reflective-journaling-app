from app.models import db, Tag, environment, SCHEMA
from sqlalchemy.sql import text

def seed_tags():
    tags_data = [
        {"name": "Reflection"},
        {"name": "Exercise"},
        {"name": "Work"},
        {"name": "Personal"},
        {"name": "Goals"}
    ]
    tags = [Tag(**tag_data) for tag_data in tags_data]
    db.session.add_all(tags)
    db.session.commit()

def undo_tags():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.tags RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM tags"))
    db.session.commit()