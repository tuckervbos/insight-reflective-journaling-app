from flask import Blueprint, request, jsonify, current_app  # Import current_app
from app.models import Tag, db
from flask_login import login_required

tag_routes = Blueprint('tags', __name__)

@tag_routes.route('/', methods=['GET'])
@login_required
def get_tags():
    tags = Tag.query.all()
    return jsonify([tag.to_dict() for tag in tags])

@tag_routes.route('/<int:id>', methods=['GET'])
@login_required
def get_tag(id):
    tag = Tag.query.get_or_404(id)
    return jsonify(tag.to_dict())

@tag_routes.route('/', methods=['POST'])
@login_required
def create_tag():
    """Create a tag with unique, case-insensitive names."""
    data = request.json
    tag_name = data.get('name', '').strip().lower()
    
    if not tag_name:
        return jsonify({'error': 'Tag name cannot be empty.'}), 400
    
    existing_tag = Tag.query.filter_by(name=tag_name).first()
    
    if existing_tag:
        return jsonify({'error': 'Tag with this name already exists.'}), 400
    
    tag = Tag(name=tag_name, color=data.get('color'), is_default=False)
    db.session.add(tag)
    db.session.commit()
    
    return jsonify(tag.to_dict()), 201

@tag_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_tag(id):
    tag = Tag.query.get_or_404(id)
    db.session.delete(tag)
    db.session.commit()
    return jsonify({'message': 'Tag deleted successfully'}), 200