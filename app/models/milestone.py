from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Milestone(db.Model):
    __tablename__ = "milestones"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    milestone_name = db.Column(db.String(255), nullable=False)
    is_completed = db.Column(db.Boolean, nullable=False, default=False)
    goal_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("goals.id")), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())

    user = db.relationship("User", back_populates="milestones")
    goal = db.relationship("Goal", back_populates="milestones")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "milestone_name": self.milestone_name,
            "is_completed": self.is_completed,
            "goal_id": self.goal_id,
            "created_at": self.created_at,
        }