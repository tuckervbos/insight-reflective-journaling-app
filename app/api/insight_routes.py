from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Insight
from openai import OpenAI
import os

client = OpenAI(api_key=os.environ.get("OPEN_API_KEY"))

insight_routes = Blueprint('insights', __name__)  # updated blueprint name

@insight_routes.route("/", methods=["GET"])
@login_required
def get_all_insights():
    insights = Insight.query.filter_by(user_id=current_user.id).all()
    return jsonify([i.to_dict() for i in insights]), 200

@insight_routes.route("/<int:id>", methods=["GET"])
@login_required
def get_insight(id):
    insight = Insight.query.get(id)
    if not insight or insight.user_id != current_user.id:
        return jsonify({"message": "Insight not found"}), 404
    return insight.to_dict(), 200

@insight_routes.route("/", methods=["POST"])
@login_required
def create_insight():
    data = request.json
    prompt = data.get("prompt")
    entry_id = data.get("entry_id")

    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )
        ai_reply = response.choices[0].message.content 

        new_insight = Insight(
            user_id=current_user.id,
            prompt=prompt,
            response=ai_reply,
            entry_id=entry_id
        )
        db.session.add(new_insight)
        db.session.commit()
        return new_insight.to_dict(), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@insight_routes.route("/<int:id>", methods=["PUT"])
@login_required
def update_insight(id):
    insight = Insight.query.get(id)
    if not insight or insight.user_id != current_user.id:
        return jsonify({"message": "Not found"}), 404

    data = request.json
    insight.prompt = data.get("prompt", insight.prompt)
    insight.response = data.get("response", insight.response)
    insight.entry_id = data.get("entry_id", insight.entry_id)

    db.session.commit()
    return insight.to_dict(), 200

@insight_routes.route("/<int:id>", methods=["DELETE"])
@login_required
def delete_insight(id):
    insight = Insight.query.get(id)
    if not insight or insight.user_id != current_user.id:
        return jsonify({"message": "Not found"}), 404
    db.session.delete(insight)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200

@insight_routes.route("/analyze", methods=["POST"])
@login_required
def analyze_user_data():
    data = request.get_json()
    entries = data.get("entries", [])
    goals = data.get("goals", [])
    milestones = data.get("milestones", [])

    prompt = (
    "You are a supportive journaling assistant. The user has granted permission "
    "to analyze their private data to provide encouragement, identify themes, and give helpful feedback. "
    "Speak directly to the user. Be warm, kind, and constructive.\n\n"
    f"User Entries: {entries}\n\nUser Goals: {goals}\n\nUser Milestones: {milestones}"
    )

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )
        ai_reply = response.choices[0].message.content
        new_insight = Insight(
            user_id=current_user.id,
            prompt="Analyze user data for trends and support",
            response=ai_reply,
        )
        db.session.add(new_insight)
        db.session.commit()
        return jsonify(new_insight.to_dict()), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500