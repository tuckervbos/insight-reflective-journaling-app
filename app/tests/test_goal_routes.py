import pytest
from app.models import User, Goal, db, GoalStatus
from werkzeug.security import generate_password_hash


@pytest.fixture
def user_data():
    return {"username": "testuser", "email": "testuser@example.com", "hashed_password": "testpassword"}


@pytest.fixture
def goal_data():
    return {
        "title": "Test Goal",
        "description": "A test goal",
        "status": GoalStatus.IN_PROGRESS.value 
    }

def authenticate_user(client, user_data):
    existing_user = User.query.filter_by(email=user_data["email"]).first()
    if existing_user:
        db.session.delete(existing_user)
        db.session.commit()

    user_data["hashed_password"] = generate_password_hash(user_data["hashed_password"])
    user = User(**user_data)
    db.session.add(user)
    db.session.commit()

    csrf_response = client.get("/api/auth/csrf/restore")
    csrf_token = csrf_response.json["csrf_token"]

    client.post(
        "/api/auth/login",
        json={"email": user_data["email"], "password": "testpassword"},
        headers={"X-CSRF-Token": csrf_token},
    )
    return csrf_token, user.id


def test_get_goals(client, user_data, goal_data):
    csrf_token, user_id = authenticate_user(client, user_data)

    goal = Goal(**goal_data, user_id=user_id)
    db.session.add(goal)
    db.session.commit()

    response = client.get("/api/goals/")
    assert response.status_code == 200
    assert any(g["title"] == goal_data["title"] for g in response.json)


def test_get_goal(client, user_data, goal_data):
    csrf_token, user_id = authenticate_user(client, user_data)

    goal = Goal(**goal_data, user_id=user_id)
    db.session.add(goal)
    db.session.commit()

    response = client.get(f"/api/goals/{goal.id}")
    assert response.status_code == 200
    assert response.json["title"] == goal_data["title"]


def test_create_goal(client, user_data, goal_data):
    csrf_token, _ = authenticate_user(client, user_data)

    # Add all required fields to goal_data
    response = client.post(
        "/api/goals/",
        json=goal_data,
        headers={"X-CSRF-Token": csrf_token},
    )
    assert response.status_code == 201, f"Unexpected status code: {response.status_code}. Response: {response.json}"
    assert response.json["title"] == goal_data["title"]


def test_update_goal(client, user_data, goal_data):
    csrf_token, user_id = authenticate_user(client, user_data)

    # Create the initial goal
    goal = Goal(**goal_data, user_id=user_id)
    db.session.add(goal)
    db.session.commit()

    # Define valid update payload
    updated_data = {
        "title": "Updated Goal",
        "description": "Updated description",
        "status": GoalStatus.COMPLETED.value,  # Use enum value
    }
    response = client.put(
        f"/api/goals/{goal.id}",
        json=updated_data,
        headers={"X-CSRF-Token": csrf_token},
    )
    assert response.status_code == 200, f"Unexpected status code: {response.status_code}. Response: {response.json}"
    assert response.json["title"] == updated_data["title"]
    assert response.json["status"] == updated_data["status"]


def test_delete_goal(client, user_data, goal_data):
    csrf_token, user_id = authenticate_user(client, user_data)

    goal = Goal(**goal_data, user_id=user_id)
    db.session.add(goal)
    db.session.commit()

    response = client.delete(
        f"/api/goals/{goal.id}",
        headers={"X-CSRF-Token": csrf_token},
    )
    assert response.status_code == 200
    assert response.json["message"] == "Goal deleted successfully"
    assert Goal.query.get(goal.id) is None