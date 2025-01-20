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
    if not current_app.config.get("TESTING"):
        csrf_token = request.headers.get("X-CSRF-TOKEN")
        if not csrf_token or csrf_token != request.cookies.get('csrf_token'):
            return {'message': 'CSRF token missing or invalid'}, 400

    data = request.json
    tag = Tag(**data)
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