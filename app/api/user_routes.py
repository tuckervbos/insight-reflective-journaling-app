from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, db

user_routes = Blueprint('users', __name__)


@user_routes.route('/', methods=['GET'])
def get_users():
    """
    Retrieve all users.
    If no users are found, return a 404 status with an appropriate message.
    """
    users = User.query.all()
    if not users:
        return {"message": "No users found"}, 404
    return {"users": [user.to_dict() for user in users]}, 200


@user_routes.route('/<int:id>', methods=['GET'])
@login_required
def get_user_by_id(id):
    """
    Query for a user by ID and return their data as a dictionary.
    """
    user = User.query.get(id)
    if not user:
        return {"message": "User not found"}, 404
    return user.to_dict(), 200

@user_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_user(id):
    user = User.query.get_or_404(id)
    # Authorization check to ensure current_user can only update their data
    if user.id != current_user.id:
        return {"message": "Unauthorized"}, 403
    data = request.json
    user.username = data.get("username", user.username)
    user.email = data.get("email", user.email)
    db.session.commit()
    return user.to_dict(), 200

@user_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_user(id):
    user = User.query.get_or_404(id)
    if user.id != current_user.id:
        return {"message": "Unauthorized"}, 403
    db.session.delete(user)
    db.session.commit()
    return {"message": "User deleted successfully"}, 200