from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class AIInteraction(db.Model):
    __tablename__ = "ai_interactions"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    prompt = db.Column(db.Text, nullable=False)
    response = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Optional association with an entry
    entry_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("entries.id")), nullable=True)
    entry = db.relationship("Entry", backref="ai_interactions")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "prompt": self.prompt,
            "response": self.response,
            "entry_id": self.entry_id,
            "created_at": self.created_at.isoformat(),
        }