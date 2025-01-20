from flask import Blueprint, request, jsonify
from app.models import Entry, db
from flask_login import login_required, current_user

entry_routes = Blueprint('entries', __name__)

@entry_routes.route('/', methods=['GET'])
@login_required
def get_entries():
    """Retrieve all entries for the authenticated user."""
    entries = Entry.query.filter_by(user_id=current_user.id).all()
    return jsonify([entry.to_dict() for entry in entries])

@entry_routes.route('/<int:id>', methods=['GET'])
@login_required
def get_entry(id):
    """Retrieve a specific entry by ID."""
    entry = Entry.query.get_or_404(id)
    if entry.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    return jsonify(entry.to_dict())

@entry_routes.route('/', methods=['POST'])
@login_required
def create_entry():
    """Create a new journal entry."""
    data = request.json
    entry = Entry(**data, user_id=current_user.id)
    db.session.add(entry)
    db.session.commit()
    return jsonify(entry.to_dict()), 201

@entry_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_entry(id):
    """Update an existing journal entry."""
    entry = Entry.query.get_or_404(id)
    if entry.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    for key, value in request.json.items():
        setattr(entry, key, value)
    db.session.commit()
    return jsonify(entry.to_dict())

@entry_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_entry(id):
    """Delete a journal entry."""
    entry = Entry.query.get_or_404(id)
    if entry.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    db.session.delete(entry)
    db.session.commit()
    return jsonify({'message': 'Entry deleted successfully'})