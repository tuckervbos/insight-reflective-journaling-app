from .db import db, environment, SCHEMA, add_prefix_for_prod

class Tag(db.Model):
    __tablename__ = "tags"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    color = db.Column(db.String(50), nullable=True)
    is_default = db.Column(db.Boolean, nullable=False, default=False)

    entry_tags = db.relationship("EntryTag", back_populates="tag", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "color": self.color,
            "is_default": self.is_default,
        }