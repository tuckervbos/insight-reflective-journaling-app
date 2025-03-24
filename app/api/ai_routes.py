from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, AIInteraction
from openai import OpenAI
import os

client = OpenAI(api_key=os.environ.get("OPEN_API_KEY"))

ai_routes = Blueprint('ai', __name__)

@ai_routes.route("/", methods=["GET"])
@login_required
def get_all_ai_interactions():
    interactions = AIInteraction.query.filter_by(user_id=current_user.id).all()
    return jsonify([i.to_dict() for i in interactions]), 200

@ai_routes.route("/<int:id>", methods=["GET"])
@login_required
def get_ai_interaction(id):
    interaction = AIInteraction.query.get(id)
    if not interaction or interaction.user_id != current_user.id:
        return jsonify({"message": "Interaction not found"}), 404
    return interaction.to_dict(), 200

@ai_routes.route("/", methods=["POST"])
@login_required
def create_ai_interaction():
    data = request.json
    prompt = data.get("prompt")
    entry_id = data.get("entry_id")

    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    try:
        # OpenAI Chat Completion
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )
        ai_reply = response.choices[0].message.content 

        new_interaction = AIInteraction(
            user_id=current_user.id,
            prompt=prompt,
            response=ai_reply,
            entry_id=entry_id
        )
        db.session.add(new_interaction)
        db.session.commit()
        return new_interaction.to_dict(), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@ai_routes.route("/<int:id>", methods=["PUT"])
@login_required
def update_ai_interaction(id):
    interaction = AIInteraction.query.get(id)
    if not interaction or interaction.user_id != current_user.id:
        return jsonify({"message": "Not found"}), 404

    data = request.json
    interaction.prompt = data.get("prompt", interaction.prompt)
    interaction.response = data.get("response", interaction.response)
    interaction.entry_id = data.get("entry_id", interaction.entry_id)

    db.session.commit()
    return interaction.to_dict(), 200

@ai_routes.route("/<int:id>", methods=["DELETE"])
@login_required
def delete_ai_interaction(id):
    interaction = AIInteraction.query.get(id)
    if not interaction or interaction.user_id != current_user.id:
        return jsonify({"message": "Not found"}), 404
    db.session.delete(interaction)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200