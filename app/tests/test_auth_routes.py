import pytest
from app.models import User, db
from uuid import uuid4

def generate_unique_email(base="testuser"):
    return f"{base}_{uuid4().hex[:8]}@example.com"

def generate_unique_username(base="testuser"):
    return f"{base}_{uuid4().hex[:8]}"

def test_authenticate(client):
    response = client.get('/api/auth/')
    assert response.status_code == 401
    assert response.json == {'errors': {'message': 'Unauthorized'}}

def test_login(client):
    # Create a user with a hashed password
    from werkzeug.security import generate_password_hash
    user = User(
        username=generate_unique_username(),
        email=generate_unique_email(),
        hashed_password=generate_password_hash('test_password')
    )
    db.session.add(user)
    db.session.commit()

    # Perform login
    response = client.post('/api/auth/login', json={
        'email': user.email,
        'password': 'test_password'  # Plain text password for login
    })

    # Assertions
    assert response.status_code == 200
    assert response.json['username'] == user.username
    
def test_signup(client):
    response = client.post('/api/auth/signup', json={
        'username': generate_unique_username(),
        'email': generate_unique_email(),
        'password': 'test_password'
    })
    assert response.status_code == 201
    assert 'username' in response.json

def test_logout(client):
    user = User(
        username=generate_unique_username(),
        email=generate_unique_email(),
        hashed_password='test_password'
    )
    db.session.add(user)
    db.session.commit()
    client.post('/api/auth/login', json={'email': user.email, 'password': 'test_password'})

    response = client.post('/api/auth/logout')
    assert response.status_code == 200
    assert response.json == {'message': 'User logged out'}

def test_unauthorized(client):
    response = client.get('/api/auth/unauthorized')
    assert response.status_code == 401
    assert response.json == {'errors': {'message': 'Unauthorized'}}