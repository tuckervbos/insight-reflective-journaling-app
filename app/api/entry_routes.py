from flask import Blueprint, request, jsonify, session
from app.models import Entry, db
from flask_login import login_required, current_user
from datetime import datetime
import requests

entry_routes = Blueprint('entries', __name__)

WEATHER_API_URL = "https://api.weatherapi.com/v1/current.json?key=149609775956c3c703692329fd6d8f03&q="
MOON_API_URL = "https://api.farmsense.net/v1/moonphases/"

def get_weather(location="auto:ip"):
    """Fetch real-time weather data from the API"""
    try:
        response = requests.get(f"{WEATHER_API_URL}{location}")
        data = response.json()
        return data["current"]["condition"]["text"] if "current" in data else "Unknown"
    except Exception:
        return "Unknown"

def get_moon_phase():
    """Fetch moon phase data from API"""
    try:
        response = requests.get(MOON_API_URL)
        data = response.json()
        return data[0]["Phase"] if data else "Unknown"
    except Exception:
        return "Unknown"


@entry_routes.route("/", methods=["GET"], strict_slashes=False)
@login_required
def get_entries():
    # Debugging logs to check session and authentication
    print("\n---- Debugging /api/entries ----")
    print(f"Session contents before fetching entries: {session}")
    print(f"Is user authenticated? {current_user.is_authenticated}")

    if not current_user.is_authenticated:
        print("User is not authenticated. Returning 401.")
        return jsonify({"error": "Unauthorized"}), 401  # Ensure correct response

    # Fetch entries for the current user
    entries = Entry.query.filter_by(user_id=current_user.id).all()
    print(f"Entries fetched: {len(entries)}")  # Print number of entries found

    return jsonify([entry.to_dict() for entry in entries]), 200

@entry_routes.route('/<int:id>', methods=['GET'])
@login_required
def get_entry(id):
    """Retrieve a specific entry by ID."""
    entry = Entry.query.get_or_404(id)
    if entry.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    return jsonify(entry.to_dict())

@entry_routes.route('/', methods=['POST'])
@login_required
def create_entry():
    """Create a new journal entry and store weather & moon phase"""
    data = request.json
    title = data.get("title", "").strip()
    body = data.get("body", "").strip()
    location = data.get("location", "auto:ip")  # Manual or auto location

    if not title or not body:
        return jsonify({"error": "Title and body are required."}), 400

    weather = data.get("weather") or get_weather(location)  # Use provided or fetch new
    moon_phase = get_moon_phase()

    new_entry = Entry(
        user_id=current_user.id,
        title=title,
        body=body,
        weather=weather,
        moon_phase=moon_phase,
        sentiment=None,  # Placeholder for AI sentiment analysis
        created_at=datetime.utcnow(),
    )

    db.session.add(new_entry)
    db.session.commit()

    return jsonify(new_entry.to_dict()), 201

@entry_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_entry(id):
    """Update an existing journal entry."""
    entry = Entry.query.get_or_404(id)
    if entry.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    for key, value in request.json.items():
        setattr(entry, key, value)
    db.session.commit()
    return jsonify(entry.to_dict())

@entry_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_entry(id):
    """Delete a journal entry."""
    entry = Entry.query.get_or_404(id)
    if entry.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    db.session.delete(entry)
    db.session.commit()
    return jsonify({'message': 'Entry deleted successfully'})


# @entry_routes.route("/entries", methods=["POST"])
# @login_required
# def create_entry():
#     """Create a new journal entry"""
#     data = request.json
#     title = data.get("title", "").strip()
#     body = data.get("body", "").strip()

#     if not title or not body:
#         return jsonify({"error": "Title and body are required."}), 400

#     weather = get_weather()  # Fetch weather data
#     moon_phase = get_moon_phase()  # Fetch moon phase

#     new_entry = Entry(
#         user_id=current_user.id,
#         title=title,
#         body=body,
#         weather=weather,
#         moon_phase=moon_phase,
#         sentiment=None,  # Placeholder for AI sentiment
#         created_at=datetime.utcnow(),
#     )

#     db.session.add(new_entry)
#     db.session.commit()
    
#     return jsonify(new_entry.to_dict()), 201