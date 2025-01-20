from app.models import db, EntryTag, environment, SCHEMA
from sqlalchemy.sql import text

def seed_entry_tags():
    entry_tags_data = [
        {"entry_id": 1, "tag_id": 1},
        {"entry_id": 2, "tag_id": 2},
        {"entry_id": 2, "tag_id": 3},
        {"entry_id": 3, "tag_id": 1}
    ]
    entry_tags = [EntryTag(**entry_tag_data) for entry_tag_data in entry_tags_data]
    db.session.add_all(entry_tags)
    db.session.commit()

def undo_entry_tags():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.entry_tags RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM entry_tags"))
    db.session.commit()