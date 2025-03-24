from flask import Blueprint, request, jsonify
from app.models import Milestone, db, Goal
from flask_login import login_required, current_user
from datetime import datetime

milestone_routes = Blueprint('milestones', __name__)

@milestone_routes.route('/', methods=['GET'])
@login_required
def get_milestones():
    """Retrieve milestones for the current user, with optional status filter."""
    status = request.args.get('status')  # 'completed' or 'pending'
    query = Milestone.query.filter_by(user_id=current_user.id)
    
    if status == 'completed':
        query = query.filter_by(is_completed=True)
    elif status == 'pending':
        query = query.filter_by(is_completed=False)

    milestones = query.all()
    return jsonify([milestone.to_dict() for milestone in milestones])

@milestone_routes.route('/<int:id>', methods=['GET'])
@login_required
def get_milestone(id):
    """Retrieve a specific milestone by ID."""
    milestone = Milestone.query.get_or_404(id)
    if milestone.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    return jsonify(milestone.to_dict())

@milestone_routes.route('/', methods=['POST'])
@login_required
def create_milestone():
    """Create a milestone, ensuring goal exists & preventing duplicate names."""
    print("📌 [milestone_routes] create_milestone endpoint called")
    print("Request JSON:", request.json)

    data = request.json
    milestone_name = data.get("milestone_name", "").strip()
    if not milestone_name:
        return jsonify({"error": "Milestone name is required."}), 400
    # if a goal_id is provided, validate:
    goal_id = data.get("goal_id")

    existing_milestone = Milestone.query.filter_by(
        user_id=current_user.id, 
        milestone_name=milestone_name
    ).first()

    if existing_milestone:
            return jsonify({"error": "Milestone with this name already exists."}), 400

    is_completed = data.get("is_completed")

    if is_completed is None and goal_id:
        goal = Goal.query.get(goal_id)
        if not goal:
            return jsonify({"error": "Goal not found."}), 404
        is_completed = goal.status == "completed"

    milestone = Milestone(
        user_id=current_user.id,
        milestone_name=milestone_name,
        is_completed=is_completed,
        goal_id=goal_id,
        created_at=datetime.utcnow()
    )
    
    db.session.add(milestone)
    db.session.commit()
    
    return jsonify(milestone.to_dict()), 201


@milestone_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_milestone(id):
    """Update a specific milestone, including its completion status."""
    milestone = Milestone.query.get_or_404(id)
    if milestone.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    data = request.json
    milestone.milestone_name = data.get('milestone_name', milestone.milestone_name)
    milestone.is_completed = data.get('is_completed', milestone.is_completed)
    milestone.goal_id = data.get('goal_id', milestone.goal_id)
    db.session.commit()
    return jsonify(milestone.to_dict())

@milestone_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_milestone(id):
    """Delete a milestone."""
    milestone = Milestone.query.get_or_404(id)
    db.session.delete(milestone)
    db.session.commit()
    return jsonify({'message': 'Milestone deleted successfully'})