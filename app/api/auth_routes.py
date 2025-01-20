from flask import Blueprint, request, current_app
from flask_wtf.csrf import generate_csrf
from app.models import User, db
from app.forms import LoginForm, SignUpForm
from flask_login import current_user, login_user, logout_user, login_required
from werkzeug.security import check_password_hash, generate_password_hash

auth_routes = Blueprint('auth', __name__)

@auth_routes.route('/csrf/restore', methods=['GET'])
def restore_csrf():
    return {'csrf_token': generate_csrf()}, 200

@auth_routes.route('/', methods=['GET'])
def authenticate():
    """
    Check if the user is authenticated.
    If authenticated, return the user's data.
    Otherwise, return a 401 Unauthorized response.
    """
    if current_user.is_authenticated:
        return current_user.to_dict(), 200
    return {'errors': {'message': 'Unauthorized'}}, 401

@auth_routes.route('/login', methods=['POST'])
def login():
    form = LoginForm()
    if not current_app.config.get("TESTING"):  # Skip CSRF check in test
        form['csrf_token'].data = request.cookies.get('csrf_token', None)

    if form.validate_on_submit():
        user = User.query.filter(User.email == form.data['email']).first()
        if user and check_password_hash(user.hashed_password, form.data['password']):
            login_user(user)
            return user.to_dict(), 200
        return {'errors': {'message': 'Invalid credentials'}}, 401
    return {'errors': form.errors}, 401

@auth_routes.route('/logout', methods=['POST'])
def logout():
    logout_user()
    return {'message': 'User logged out'}

@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    form = SignUpForm()
    if not current_app.config.get("TESTING"):
        form['csrf_token'].data = request.cookies.get('csrf_token', None)

    if form.validate_on_submit():
        user = User(
            username=form.data['username'],
            email=form.data['email'],
            password=form.data['password']
        )
        db.session.add(user)
        db.session.commit()
        login_user(user)
        return user.to_dict(), 201
    return form.errors, 401

@auth_routes.route('/unauthorized')
def unauthorized():
    return {'errors': {'message': 'Unauthorized'}}, 401

@auth_routes.route('/change-password', methods=['POST'])
@login_required
def change_password():
    data = request.json
    if not check_password_hash(current_user.hashed_password, data['current_password']):
        return {"message": "Incorrect current password"}, 401
    current_user.hashed_password = generate_password_hash(data['new_password'])
    db.session.commit()
    return {"message": "Password changed successfully"}, 200