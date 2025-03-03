from app.models import db, Entry, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime, timedelta
import random


def seed_entries():
    weather_options = ["Sunny", "Rainy", "Cloudy", "Windy", "Snowy", "Stormy", "Clear"]
    moon_phases = ["New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous", 
                   "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent"]
    base_date = datetime.utcnow()

    entries_data = [
        {
            "user_id": 1,
            "title": "Project Kickoff Meeting",
            "body": "Today we outlined the project goals and assigned tasks to the team.",
            "created_at": base_date - timedelta(days=2),
            "sentiment": "Positive",
            "weather": random.choice(weather_options),
            "moon_phase": random.choice(moon_phases),
        },
        {
            "user_id": 1,
            "title": "Client Feedback Session",
            "body": "Received mixed feedback from the client. Need to adjust the project scope.",
            "created_at": base_date - timedelta(days=5),
            "sentiment": "Neutral",
            "weather": random.choice(weather_options),
            "moon_phase": random.choice(moon_phases),
        },
        {
            "user_id": 1,
            "title": "Weekly Team Check-in",
            "body": "Team is progressing well, but there are a few blockers to address.",
            "created_at": base_date - timedelta(days=7),
            "sentiment": "Positive",
            "weather": random.choice(weather_options),
            "moon_phase": random.choice(moon_phases),
        },
        {
            "user_id": 1,
            "title": "Mid-Sprint Review",
            "body": "Fell behind schedule. Need to prioritize tasks for next week.",
            "created_at": base_date - timedelta(days=10),
            "sentiment": "Negative",
            "weather": random.choice(weather_options),
            "moon_phase": random.choice(moon_phases),
        },
        {
            "user_id": 1,
            "title": "Completed First Milestone",
            "body": "Successfully delivered the initial prototype to the client.",
            "created_at": base_date - timedelta(days=14),
            "sentiment": "Positive",
            "weather": random.choice(weather_options),
            "moon_phase": random.choice(moon_phases),
        },
        {
            "user_id": 1,
            "title": "Reflecting on Personal Growth",
            "body": "I've been feeling more confident in leading meetings and sharing ideas.",
            "created_at": base_date - timedelta(days=18),
            "sentiment": "Positive",
            "weather": random.choice(weather_options),
            "moon_phase": random.choice(moon_phases),
        },
        {
            "user_id": 1,
            "title": "Handling Stressful Situations",
            "body": "Had a difficult conversation with a team member, but resolved it professionally.",
            "created_at": base_date - timedelta(days=20),
            "sentiment": "Neutral",
            "weather": random.choice(weather_options),
            "moon_phase": random.choice(moon_phases),
        },
        {
            "user_id": 1,
            "title": "End of Month Review",
            "body": "Evaluated progress on goals and identified areas for improvement.",
            "created_at": base_date - timedelta(days=30),
            "sentiment": "Neutral",
            "weather": random.choice(weather_options),
            "moon_phase": random.choice(moon_phases),
        },
        {
            "user_id": 1,
            "title": "Prepared Presentation for Stakeholders",
            "body": "Felt nervous, but the presentation went smoothly.",
            "created_at": base_date - timedelta(days=35),
            "sentiment": "Positive",
            "weather": random.choice(weather_options),
            "moon_phase": random.choice(moon_phases),
        },
        {
            "user_id": 1,
            "title": "Learning New Tools",
            "body": "Started using a new project management tool. It seems promising.",
            "created_at": base_date - timedelta(days=40),
            "sentiment": "Positive",
            "weather": random.choice(weather_options),
            "moon_phase": random.choice(moon_phases),
        },
    ]
    entries = [Entry(**entry_data) for entry_data in entries_data]
    db.session.add_all(entries)
    db.session.commit()

def undo_entries():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.entries RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM entries"))
    db.session.commit()