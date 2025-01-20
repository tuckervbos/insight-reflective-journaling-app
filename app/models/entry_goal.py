from .db import db, environment, SCHEMA, add_prefix_for_prod

class EntryGoal(db.Model):
    __tablename__ = "entry_goals"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    entry_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("entries.id")), primary_key=True)
    goal_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("goals.id")), primary_key=True)

    entry = db.relationship("Entry", back_populates="entry_goals")
    goal = db.relationship("Goal", back_populates="entry_goals")

    def to_dict(self):
        return {
            "entry_id": self.entry_id,
            "goal_id": self.goal_id,
        }