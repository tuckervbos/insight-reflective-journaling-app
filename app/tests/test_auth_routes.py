import pytest
from app.models import User, db
from uuid import uuid4

def generate_unique_email(base="testuser"):
    return f"{base}_{uuid4().hex[:8]}@example.com"

def generate_unique_username(base="testuser"):
    return f"{base}_{uuid4().hex[:8]}"

def fetch_csrf_token(client):
    """Fetch CSRF token from the API"""
    csrf_response = client.get("/api/auth/csrf/restore")
    assert csrf_response.status_code == 200
    return csrf_response.json["csrf_token"]

def test_authenticate(client):
    response = client.get('/api/auth/')
    assert response.status_code == 401
    assert response.json == {'error': 'Unauthorized'}  # Adjust error message format

def test_login(client):
    from werkzeug.security import generate_password_hash

    user = User(
        username="testuser",
        email="testuser@example.com",
        hashed_password=generate_password_hash("test_password"),
    )
    db.session.add(user)
    db.session.commit()

    csrf_token = fetch_csrf_token(client)

    response = client.post(
        "/api/auth/login",
        json={"email": "testuser@example.com", "password": "test_password"},
        headers={"X-CSRF-TOKEN": csrf_token},
    )
    assert response.status_code == 200
    assert response.json["username"] == "testuser"

def test_login_invalid_credentials(client):
    csrf_token = fetch_csrf_token(client)

    response = client.post(
        "/api/auth/login",
        json={"email": "wronguser@example.com", "password": "wrong_password"},
        headers={"X-CSRF-TOKEN": csrf_token},
    )
    assert response.status_code == 401
    assert response.json == {"errors": {"message": "Invalid email or password"}}

def test_signup(client):
    csrf_token = fetch_csrf_token(client)

    response = client.post('/api/auth/signup', json={
        'username': generate_unique_username(),
        'email': generate_unique_email(),
        'password': 'test_password'
    }, headers={"X-CSRF-TOKEN": csrf_token})
    assert response.status_code == 201
    assert 'username' in response.json

def test_logout(client):
    from werkzeug.security import generate_password_hash

    user = User(
        username=generate_unique_username(),
        email=generate_unique_email(),
        hashed_password=generate_password_hash('test_password'),
    )
    db.session.add(user)
    db.session.commit()

    csrf_token = fetch_csrf_token(client)

    client.post(
        '/api/auth/login',
        json={'email': user.email, 'password': 'test_password'},
        headers={"X-CSRF-TOKEN": csrf_token},
    )

    response = client.post('/api/auth/logout', headers={"X-CSRF-TOKEN": csrf_token})
    assert response.status_code == 200
    assert response.json == {'message': 'User logged out successfully'}  # Match actual response