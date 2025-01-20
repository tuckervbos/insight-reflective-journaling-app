from app.models import User
from werkzeug.security import generate_password_hash
from app import db


def authenticate_user(client, user_data, create_user=True):
    """
    Authenticate a user for tests.
    Creates the user if it doesn't exist, logs them in, and retrieves the CSRF token.
    """
    user = None
    if create_user:
        user = User.query.filter_by(email=user_data["email"]).first()
        if not user:
            hashed_password = generate_password_hash(user_data["hashed_password"])
            user = User(
                username=user_data["username"],
                email=user_data["email"],
                hashed_password=hashed_password,
            )
            db.session.add(user)
            db.session.commit()

    csrf_response = client.get('/api/auth/csrf/restore')
    assert csrf_response.status_code == 200, "Failed to retrieve CSRF token"
    csrf_token = csrf_response.json.get('csrf_token')

    if create_user:
        login_response = client.post(
            "/api/auth/login",
            json={"email": user_data["email"], "password": user_data["hashed_password"]},
            headers={"X-CSRF-Token": csrf_token},
        )
        assert login_response.status_code == 200, "Authentication failed"

    return csrf_token, user.id if user else None