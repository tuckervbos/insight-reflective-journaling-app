from .db import db, environment, SCHEMA, add_prefix_for_prod

class EntryTag(db.Model):
    __tablename__ = "entry_tags"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    entry_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("entries.id")), primary_key=True)
    tag_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("tags.id")), primary_key=True)

    entry = db.relationship("Entry", back_populates="entry_tags")
    tag = db.relationship("Tag", back_populates="entry_tags")

    def to_dict(self):
        return {
            "entry_id": self.entry_id,
            "tag_id": self.tag_id,
        }