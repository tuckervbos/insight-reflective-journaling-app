import pytest
from app.models import User, Goal, Milestone, db, GoalStatus
from werkzeug.security import generate_password_hash
from app.tests.utils import authenticate_user
import uuid

@pytest.fixture
def milestone_data():
    return {
        "milestone_name": "Complete half of the goal",
        "is_completed": False,
    }

@pytest.fixture
def user_data():
    import uuid
    unique_suffix = uuid.uuid4().hex[:8]
    return {
        "username": f"testuser_{unique_suffix}",
        "email": f"testuser_{unique_suffix}@example.com",
        "hashed_password": "testpassword",
    }

@pytest.fixture
def goal_data():
    """Fixture to provide test goal data."""
    return {
        "title": "Test Goal",
        "description": "This is a test goal.",
        "status": "in_progress",  # Match enum definition
    }


def test_get_milestones(client, user_data, goal_data, milestone_data):
    # Authenticate user
    csrf_token, user_id = authenticate_user(client, user_data)

    # Create a goal and milestones
    goal = Goal(**goal_data, user_id=user_id)
    db.session.add(goal)
    db.session.commit()

    milestone = Milestone(**milestone_data, goal_id=goal.id, user_id=user_id)
    db.session.add(milestone)
    db.session.commit()

    # Test GET /api/milestones/
    response = client.get("/api/milestones/", headers={"X-CSRF-Token": csrf_token})
    assert response.status_code == 200
    assert any(m["milestone_name"] == milestone_data["milestone_name"] for m in response.json)


def test_create_milestone(client, user_data, goal_data, milestone_data):
    # Authenticate user
    csrf_token, user_id = authenticate_user(client, user_data)

    # Create a goal
    goal = Goal(**goal_data, user_id=user_id)
    db.session.add(goal)
    db.session.commit()

    # Test POST /api/milestones/
    milestone_data["goal_id"] = goal.id
    response = client.post(
        "/api/milestones/",
        json=milestone_data,
        headers={"X-CSRF-Token": csrf_token},
    )
    assert response.status_code == 201
    assert response.json["milestone_name"] == milestone_data["milestone_name"]

def test_update_milestone(client, user_data, goal_data, milestone_data):
    csrf_token, user_id = authenticate_user(client, user_data)

    # Create a goal and a milestone
    goal = Goal(**goal_data, user_id=user_id)
    db.session.add(goal)
    db.session.commit()

    milestone = Milestone(**milestone_data, goal_id=goal.id, user_id=user_id)
    db.session.add(milestone)
    db.session.commit()

    # Test PUT /api/milestones/<id>
    updated_data = {
        "milestone_name": "Updated milestone",
        "is_completed": True,
    }
    response = client.put(
        f"/api/milestones/{milestone.id}",
        json=updated_data,
        headers={"X-CSRF-Token": csrf_token},
    )
    assert response.status_code == 200
    assert response.json["milestone_name"] == updated_data["milestone_name"]
    assert response.json["is_completed"] == updated_data["is_completed"]


def test_delete_milestone(client, user_data, goal_data, milestone_data):
    csrf_token, user_id = authenticate_user(client, user_data)

    # Create a goal and a milestone
    goal = Goal(**goal_data, user_id=user_id)
    db.session.add(goal)
    db.session.commit()

    milestone = Milestone(**milestone_data, goal_id=goal.id, user_id=user_id)
    db.session.add(milestone)
    db.session.commit()

    # Test DELETE /api/milestones/<id>
    response = client.delete(
        f"/api/milestones/{milestone.id}",
        headers={"X-CSRF-Token": csrf_token},
    )
    assert response.status_code == 200
    assert response.json["message"] == "Milestone deleted successfully"
    assert Milestone.query.get(milestone.id) is None