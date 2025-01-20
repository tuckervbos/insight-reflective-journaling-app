import pytest
from app.models import Tag, db
from app.tests.utils import authenticate_user

@pytest.fixture
def tag_data():
    return {"name": "Test Tag", "color": "blue"}

@pytest.fixture
def auth_headers(client):
    # Assuming a CSRF token is returned on login
    login_response = client.post('/api/auth/login', json={
        'email': 'test@example.com',
        'password': 'password'
    })
    assert login_response.status_code == 200
    csrf_token = login_response.json.get('csrf_token', 'test-csrf-token')

    return {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": csrf_token
    }

def test_get_tags(client):
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "hashed_password": "test_password"
    }
    csrf_token, _ = authenticate_user(client, user_data)

    response = client.get("/api/tags/", headers={"X-CSRF-Token": csrf_token})
    assert response.status_code == 200

def test_get_tag_by_id(client, tag_data):
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "hashed_password": "test_password"
    }
    csrf_token, _ = authenticate_user(client, user_data)

    # Create a tag
    tag = Tag(**tag_data)
    db.session.add(tag)
    db.session.commit()

    # Fetch the tag by ID
    response = client.get(f'/api/tags/{tag.id}', headers={"X-CSRF-Token": csrf_token})
    assert response.status_code == 200
    assert response.json['name'] == tag_data['name']

def test_create_tag(client):
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "hashed_password": "test_password"
    }
    csrf_token, _ = authenticate_user(client, user_data)

    response = client.post(
        "/api/tags/",
        json={"name": "test tag", "color": "blue", "is_default": False},
        headers={"X-CSRF-Token": csrf_token}
    )
    assert response.status_code == 201
    assert response.json["name"] == "test tag"

def test_delete_tag(client, tag_data):
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "hashed_password": "test_password"
    }
    csrf_token, _ = authenticate_user(client, user_data)

    # Create a tag
    tag = Tag(**tag_data)
    db.session.add(tag)
    db.session.commit()

    # Delete the tag
    response = client.delete(f'/api/tags/{tag.id}', headers={"X-CSRF-Token": csrf_token})
    assert response.status_code == 200
    assert response.json['message'] == 'Tag deleted successfully'
    assert Tag.query.get(tag.id) is None