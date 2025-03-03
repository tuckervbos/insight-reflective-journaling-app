from flask import Blueprint, request, make_response, jsonify, current_app, session
from flask_wtf.csrf import generate_csrf
from flask_login import current_user, login_user, logout_user, login_required
from werkzeug.security import check_password_hash, generate_password_hash
from app.models import User, db
from app.forms import LoginForm, SignUpForm
from sqlalchemy.exc import IntegrityError

auth_routes = Blueprint('auth', __name__)

@auth_routes.route('/demo', methods=['POST'])
def demo_login():
    """Logs in the demo user"""
    demo_user = User.query.filter_by(email="demo@example.com").first()

    if not demo_user:
        return jsonify({"error": "Demo user not found"}), 404

    login_user(demo_user)  # Ensure user is properly logged in
    session["user_id"] = demo_user.id  # Set session manually

    return jsonify(demo_user.to_dict())  # Ensure full user data is returned

@auth_routes.route('/csrf/restore', methods=['GET'])
def restore_csrf():
    csrf_token = generate_csrf()
    response = make_response({'csrf_token': csrf_token}, 200)
    response.set_cookie('csrf_token', csrf_token, httponly=False, path='/')
    # session['csrf_token'] = csrf_token 
    return response

@auth_routes.route("/", methods=["GET"])
def get_authenticated_user():
    if not current_user.is_authenticated:
        print("No user authenticated.")
        return jsonify({"error": "Unauthorized"}), 401  # Return JSON instead of redirect
    return jsonify(current_user.to_dict())

# Login User
@auth_routes.route('/login', methods=['POST'])
def login():
    """
    Logs a user in
    """
    form = LoginForm()
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        user = User.query.filter(User.email == form.data['email']).first()
        login_user(user)
       
        return user.to_dict()
    return form.errors, 401


# Sign Up User
@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    form = SignUpForm(csrf_token=request.cookies.get("csrf_token"))
    form.username.data = request.json.get('username')
    form.email.data = request.json.get('email')
    form.password.data = request.json.get('password')

    if form.validate_on_submit():
        user = User(
            username=form.username.data,
            email=form.email.data,
            hashed_password=generate_password_hash(form.password.data),
        )
        try:
            db.session.add(user)
            db.session.commit()
            login_user(user)
            return jsonify(user.to_dict()), 201

        except IntegrityError as e:
            db.session.rollback()

            if 'username' in str(e.orig):
                return jsonify({'errors': {'username': 'Username already taken.'}}), 400
            if 'email' in str(e.orig):
                return jsonify({'errors': {'email': 'Email already in use.'}}), 400

            return jsonify({'errors': {'general': 'Signup failed. Please try again.'}}), 400

    return jsonify({'errors': form.errors}), 400


# Logout User
@auth_routes.route('/logout', methods=['POST'])
def logout():
    logout_user()
    return jsonify({'message': 'User logged out successfully'}), 200

# Change Password
@auth_routes.route('/change-password', methods=['POST'])
@login_required
def change_password():
    data = request.json
    if not check_password_hash(current_user.hashed_password, data['current_password']):
        return jsonify({"errors": {"message": "Incorrect current password"}}), 401
    current_user.hashed_password = generate_password_hash(data['new_password'])
    db.session.commit()
    return jsonify({"message": "Password changed successfully"}), 200

# Unauthorized route
@auth_routes.route("/unauthorized")
def unauthorized():
    return jsonify({"error": "Unauthorized access"}), 401 