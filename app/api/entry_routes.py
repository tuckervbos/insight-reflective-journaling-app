from flask import Blueprint, request, jsonify, session
from app.models import Entry, db
from flask_login import login_required, current_user
from datetime import datetime
from time import time
import os
from dotenv import load_dotenv
import requests

load_dotenv()
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")
WEATHER_API_URL = os.getenv("WEATHER_API_URL")
MOON_API_URL = os.getenv("MOON_API_URL")

entry_routes = Blueprint('entries', __name__)

@entry_routes.route("/weather", methods=["GET"])
def get_weather():
    """Fetch real-time weather data based on city or coordinates"""
    api_key = WEATHER_API_KEY
    city = request.args.get("city")
    lat = request.args.get("lat")
    lon = request.args.get("lon")

    if not api_key:
        return jsonify({"error": "Weather API Key Missing"}), 500

    if city:
        url = f"{WEATHER_API_URL}?q={city}&appid={api_key}&units=imperial"
    elif lat and lon:
        url = f"{WEATHER_API_URL}?lat={lat}&lon={lon}&appid={api_key}&units=imperial"
    else:
        return jsonify({"error": "Location required"}), 400

    try:
        response = requests.get(url)
        if response.status_code != 200:
            return jsonify({"error": "Failed to fetch weather"}), response.status_code
        return jsonify(response.json())
    except Exception as e:
        print(f"Error fetching weather: {e}")
        return jsonify({"error": "Weather service unavailable"}), 500
    
@entry_routes.route("/moon-phase", methods=["GET"])
def get_moon_phase():
    """Fetch moon phase data from API using correct date format"""
    try:
        unix_timestamp = int(time())  # Generate current Unix timestamp
        api_url = f"{MOON_API_URL}{unix_timestamp}"  # Append timestamp to API URL
        response = requests.get(api_url)
        data = response.json()
        print(f"Moon phase API response: {data}")  # Debugging log

        if data and isinstance(data, list) and "Phase" in data[0]:
            phase = data[0].get("Phase", "").strip()
            return jsonify({"phase": phase if phase else "Unknown"})  # Avoid empty responses

        return jsonify({"phase": "Unknown"})
    except Exception as e:
        print(f"Error fetching moon phase: {e}")
        return jsonify({"phase": "Unknown"}), 500

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