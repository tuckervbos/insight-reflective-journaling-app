import pytest
from app.models import User, db
from app.tests.utils import authenticate_user


@pytest.fixture
def user_data():
    return {
        "username": "testuser",
        "email": "testuser@example.com",
        "hashed_password": "hashed_test_password"
    }


def test_get_users(client, user_data):
    """
    Test retrieving all users.
    """
    # Add additional users to the database
    user1 = User(username="user1", email="user1@example.com", hashed_password="password1")
    user2 = User(username="user2", email="user2@example.com", hashed_password="password2")
    db.session.add_all([user1, user2])
    db.session.commit()

    csrf_token, _ = authenticate_user(client, user_data)
    response = client.get("/api/users/", headers={"X-CSRF-Token": csrf_token})

    # Expect 200 and check all users in the database
    assert response.status_code == 200
    assert "users" in response.json
    # Verify that all users are returned
    assert len(response.json["users"]) == 3
    returned_usernames = {user["username"] for user in response.json["users"]}
    expected_usernames = {"testuser", "user1", "user2"}
    assert returned_usernames == expected_usernames


def test_get_users_empty_db(client):
    User.query.delete()
    db.session.commit()
    assert User.query.count() == 0

    # Authenticate without creating a user
    csrf_token, _ = authenticate_user(client, user_data, create_user=False)
    response = client.get("/api/users/", headers={"X-CSRF-Token": csrf_token})

    assert response.status_code == 404
    assert response.json == {"message": "No users found"}

def test_get_user_by_id(client, user_data):
    """
    Test retrieving a single user by ID.
    """
    # Add a user to the database
    user = User(username="uniqueuser", email="unique@example.com", hashed_password="test_password")
    db.session.add(user)
    db.session.commit()

    csrf_token, _ = authenticate_user(client, user_data)
    response = client.get(f"/api/users/{user.id}", headers={"X-CSRF-Token": csrf_token})
    assert response.status_code == 200
    assert response.json["username"] == "uniqueuser"


def test_get_user_not_found(client, user_data):
    """
    Test retrieving a non-existent user by ID.
    """
    csrf_token, _ = authenticate_user(client, user_data)
    response = client.get("/api/users/9999", headers={"X-CSRF-Token": csrf_token})
    assert response.status_code == 404
    assert response.json == {"message": "User not found"}