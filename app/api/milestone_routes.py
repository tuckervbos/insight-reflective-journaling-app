from flask import Blueprint, request, jsonify
from app.models import Milestone, db
from flask_login import login_required, current_user

milestone_routes = Blueprint('milestones', __name__)

@milestone_routes.route('/', methods=['GET'])
@login_required
def get_milestones():
    """Retrieve all milestones for the current user."""
    milestones = Milestone.query.filter_by(user_id=current_user.id).all()
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
    data = request.json
    existing_milestone = Milestone.query.filter_by(user_id=current_user.id, milestone_name=data["milestone_name"]).first()
    
    if existing_milestone:
        return jsonify({"error": "Milestone with this name already exists."}), 400
    
    if data.get("goal_id") and not Goal.query.get(data["goal_id"]):
        return jsonify({"error": "Goal not found."}), 404
    
    milestone = Milestone(
        user_id=current_user.id,
        milestone_name=data["milestone_name"],
        is_completed=False,
        goal_id=data.get("goal_id"),
        created_at=datetime.utcnow()
    )
    
    db.session.add(milestone)
    db.session.commit()
    
    return jsonify(milestone.to_dict()), 201


@milestone_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_milestone(id):
    """Update a specific milestone."""
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