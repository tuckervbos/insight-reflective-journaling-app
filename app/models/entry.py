from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Entry(db.Model):
    __tablename__ = "entries"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    body = db.Column(db.Text)
    sentiment = db.Column(db.String(50))
    weather = db.Column(db.String(50))
    moon_phase = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())
    
    user = db.relationship("User", back_populates="entries")
    entry_goals = db.relationship("EntryGoal", back_populates="entry", cascade="all, delete-orphan")
    entry_tags = db.relationship("EntryTag", back_populates="entry", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "body": self.body,
            "sentiment": self.sentiment,
            "weather": self.weather,
            "moon_phase": self.moon_phase,
            "created_at": self.created_at,
        }