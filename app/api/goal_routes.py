from flask import Blueprint, request, jsonify
from app.models import Goal, db, GoalStatus
from flask_login import login_required, current_user
from sqlalchemy.exc import ArgumentError  # Import to handle conversion errors
from datetime import datetime
from sqlalchemy.exc import IntegrityError

goal_routes = Blueprint('goals', __name__)

@goal_routes.route('/', methods=['GET'])
@login_required
def get_goals():
    """Retrieve all goals for the authenticated user with pagination."""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    goals = Goal.query.filter_by(user_id=current_user.id).paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        "goals": [goal.to_dict() for goal in goals.items],
        "total": goals.total,
        "pages": goals.pages
    })

@goal_routes.route('/<int:id>', methods=['GET'])
@login_required
def get_goal(id):
    """Retrieve a specific goal by ID."""
    goal = Goal.query.get_or_404(id)
    if goal.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    return jsonify(goal.to_dict())
    
@goal_routes.route('/', methods=['POST'])
@login_required
def create_goal():
    """Create a new goal, prevent duplicate titles per user."""
    data = request.json
    try:
        status = GoalStatus(data.get('status', 'in_progress').lower())  # Ensure case-insensitive
        goal = Goal(
            user_id=current_user.id,
            title=data['title'].strip(),
            description=data.get('description', ''),
            status=status,
            created_at=datetime.utcnow()
        )
        db.session.add(goal)
        db.session.commit()
        return jsonify(goal.to_dict()), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'Goal with this title already exists for this user.'}), 400
    except ValueError:
        return jsonify({'error': f"Invalid status. Valid values: {[s.value for s in GoalStatus]}"}), 400


@goal_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_goal(id):
    """Update a specific goal."""
    goal = Goal.query.get_or_404(id)
    if goal.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    data = request.json
    try:
        # Normalize input to lowercase to match the enum and database
        if 'status' in data:
            goal.status = GoalStatus(data['status'].lower())
        goal.title = data.get('title', goal.title)
        goal.description = data.get('description', goal.description)
        db.session.commit()
        return jsonify(goal.to_dict())
    except ValueError:
        return jsonify({
            'error': f"Invalid status value: {data.get('status')}. Valid values are: {[s.value for s in GoalStatus]}"
        }), 400

@goal_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_goal(id):
    """Delete a goal."""
    goal = Goal.query.get_or_404(id)
    if goal.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    db.session.delete(goal)
    db.session.commit()
    return jsonify({'message': 'Goal deleted successfully'})