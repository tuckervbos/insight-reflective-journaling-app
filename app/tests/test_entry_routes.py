import pytest
from app.models import User, Entry, db
from werkzeug.security import generate_password_hash


# Fixture to provide user data
@pytest.fixture
def user_data():
    return {"username": "testuser", "email": "testuser@example.com", "hashed_password": "testpassword"}


# Fixture to provide entry data
@pytest.fixture
def entry_data():
    return {"title": "Test Entry", "body": "This is a test entry."}


def authenticate_user(client, user_data):
    """Helper function to authenticate a user and return a valid CSRF token."""
    # Ensure user cleanup
    existing_user = User.query.filter_by(email=user_data["email"]).first()
    if existing_user:
        db.session.delete(existing_user)
        db.session.commit()

    # Hash the password
    user_data["hashed_password"] = generate_password_hash(user_data["hashed_password"])

    # Create and save the user
    user = User(**user_data)
    db.session.add(user)
    db.session.commit()

    # Fetch CSRF token
    csrf_response = client.get("/api/auth/csrf/restore")
    assert csrf_response.status_code == 200, "Failed to fetch CSRF token"
    csrf_token = csrf_response.json.get("csrf_token")
    assert csrf_token, "No CSRF token received"

    # Log in the user
    login_response = client.post(
        "/api/auth/login",
        json={"email": user_data["email"], "password": "testpassword"},
        headers={"X-CSRF-Token": csrf_token},
    )
    assert login_response.status_code == 200, f"Login failed: {login_response.json}"
    return csrf_token, user.id


def test_get_entries(client, user_data, entry_data):
    csrf_token, user_id = authenticate_user(client, user_data)

    # Create an entry for the user
    entry = Entry(**entry_data, user_id=user_id)
    db.session.add(entry)
    db.session.commit()

    # Test retrieving entries
    response = client.get("/api/entries/")
    assert response.status_code == 200
    assert any(e["title"] == entry_data["title"] for e in response.json), "Expected entry not found"


def test_get_entry(client, user_data, entry_data):
    csrf_token, user_id = authenticate_user(client, user_data)

    # Create an entry for the user
    entry = Entry(**entry_data, user_id=user_id)
    db.session.add(entry)
    db.session.commit()

    # Test retrieving the specific entry
    response = client.get(f"/api/entries/{entry.id}")
    assert response.status_code == 200
    assert response.json["title"] == entry_data["title"]


def test_create_entry(client, user_data, entry_data):
    csrf_token, _ = authenticate_user(client, user_data)

    # Test creating an entry
    response = client.post(
        "/api/entries/",
        json=entry_data,
        headers={"X-CSRF-Token": csrf_token},
    )
    assert response.status_code == 201, f"Entry creation failed: {response.json}"
    assert response.json["title"] == entry_data["title"]


def test_update_entry(client, user_data, entry_data):
    csrf_token, user_id = authenticate_user(client, user_data)

    # Create an entry for the user
    entry = Entry(**entry_data, user_id=user_id)
    db.session.add(entry)
    db.session.commit()

    updated_data = {"title": "Updated Test Entry", "body": "Updated test entry body"}

    # Test updating the entry
    response = client.put(
        f"/api/entries/{entry.id}",
        json=updated_data,
        headers={"X-CSRF-Token": csrf_token},
    )
    assert response.status_code == 200, f"Entry update failed: {response.json}"
    assert response.json["title"] == updated_data["title"]


def test_delete_entry(client, user_data, entry_data):
    csrf_token, user_id = authenticate_user(client, user_data)

    # Create an entry for the user
    entry = Entry(**entry_data, user_id=user_id)
    db.session.add(entry)
    db.session.commit()

    # Test deleting the entry
    response = client.delete(
        f"/api/entries/{entry.id}",
        headers={"X-CSRF-Token": csrf_token},
    )
    assert response.status_code == 200, f"Entry deletion failed: {response.json}"
    assert response.json["message"] == "Entry deleted successfully"

    # Ensure the entry is no longer in the database
    assert Entry.query.get(entry.id) is None