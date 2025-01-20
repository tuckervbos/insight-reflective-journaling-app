from sqlalchemy import Enum
from enum import Enum as PyEnum

from .db import db, environment, SCHEMA, add_prefix_for_prod

class GoalStatus(PyEnum):
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    ON_HOLD = "on_hold"
    CANCELLED = "cancelled"

    # Ensures Enum's string representation matches its value
    def __str__(self):
        return self.value

class Goal(db.Model):
    __tablename__ = "goals"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(Enum(GoalStatus, values_callable=lambda x: [e.value for e in x]), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())

    user = db.relationship("User", back_populates="goals")
    entry_goals = db.relationship("EntryGoal", back_populates="goal", cascade="all, delete-orphan")
    milestones = db.relationship("Milestone", back_populates="goal", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "description": self.description,
            "status": self.status.value,  # Convert enum to string
            "created_at": self.created_at,
        }