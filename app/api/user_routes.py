from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, db
from werkzeug.security import generate_password_hash, check_password_hash

user_routes = Blueprint('users', __name__)

@user_routes.route('/', methods=['GET'])
def get_users():
    """
    Retrieve all users.
    If no users are found, return a 404 status with an appropriate message.
    """
    users = User.query.all()
    if not users:
        return jsonify({"message": "No users found"}), 404
    return jsonify({"users": [user.to_dict() for user in users]}), 200


# @user_routes.route('/<int:id>', methods=['GET'])
# @login_required
# def get_user_by_id(id):
#     """
#     Query for a user by ID and return their data as a dictionary.
#     """
#     user = User.query.get(id)
#     if not user:
#         return {"message": "User not found"}, 404
#     return user.to_dict(), 200

@user_routes.route('/<int:id>', methods=['GET'])
@login_required
def get_user_by_id(id):
    """Retrieve a user by ID."""
    user = User.query.get(id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    return jsonify(user.to_dict()), 200

@user_routes.route('/', methods=['POST'])
def create_user():
    """Register a new user."""
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    # Validate input fields
    if not username or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already in use"}), 400

    new_user = User(
        username=username,
        email=email,
        hashed_password=generate_password_hash(password)
    )

    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.to_dict()), 201


@user_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_user(id):
    """Update a user's details (username or email)."""
    if id != current_user.id:
        return jsonify({"message": "Unauthorized"}), 403

    data = request.get_json()
    user = User.query.get_or_404(id)

    username = data.get("username")
    email = data.get("email")

    if not username or not email:
        return jsonify({"error": "Username and Email are required"}), 400

    # Avoiding duplicates for username and email
    if User.query.filter(User.username == username, User.id != id).first():
        return jsonify({"error": "Username already exists"}), 400

    if User.query.filter(User.email == email, User.id != id).first():
        return jsonify({"error": "Email already exists"}), 400

    try:
        user.username = username
        user.email = email
        db.session.commit()
        return jsonify(user.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error updating profile: {e}")
        return jsonify({"error": "Failed to update profile"}), 500


@user_routes.route('/<int:id>/password', methods=['PUT'])
@login_required
def update_password(id):
    """Update user password."""
    if id != current_user.id:
        return jsonify({"message": "Unauthorized"}), 403

    data = request.json
    old_password = data.get("old_password")
    new_password = data.get("new_password")

    if not old_password or not new_password:
        return jsonify({"error": "Both old and new passwords are required"}), 400

    user = User.query.get_or_404(id)

    if not check_password_hash(user.hashed_password, old_password):
        return jsonify({"error": "Old password is incorrect"}), 403

    user.hashed_password = generate_password_hash(new_password)
    db.session.commit()

    return jsonify({"message": "Password updated successfully"}), 200


@user_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_user(id):
    """Delete a user account."""
    if id != current_user.id:
        return jsonify({"message": "Unauthorized"}), 403

    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully"}), 200