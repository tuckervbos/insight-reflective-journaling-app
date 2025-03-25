from app.models import db, Insight, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime, timedelta

def seed_insights():
    base_date = datetime.utcnow()
    insights_data = [
        {
            "user_id": 1,
            "prompt": "How can I stay focused during long work sessions?",
            "response": "To stay focused during long work sessions, consider using time-blocking, taking regular short breaks, minimizing distractions, and setting specific goals for each session.",
            "entry_id": 1,
            "created_at": base_date - timedelta(days=2),
        },
        {
            "user_id": 1,
            "prompt": "What are some strategies for handling critical feedback?",
            "response": "Handling critical feedback effectively involves listening openly, asking clarifying questions, reflecting before responding, and using the feedback to improve your performance or perspective.",
            "entry_id": 2,
            "created_at": base_date - timedelta(days=5),
        },
        {
            "user_id": 1,
            "prompt": "What’s the benefit of journaling regularly?",
            "response": "Journaling helps clarify thoughts, process emotions, track personal growth, and develop self-awareness. It can also improve mental clarity and focus.",
            "entry_id": 3,
            "created_at": base_date - timedelta(days=7),
        },
        {
            "user_id": 1,
            "prompt": "How can I improve communication in team meetings?",
            "response": "Improving team communication involves active listening, encouraging input from all members, staying on topic, and summarizing action items at the end.",
            "entry_id": 4,
            "created_at": base_date - timedelta(days=10),
        },
        {
            "user_id": 1,
            "prompt": "What’s one way to reflect on personal growth?",
            "response": "One approach is to revisit previous journal entries and identify patterns, challenges overcome, and moments of progress or change in mindset.",
            "entry_id": 6,
            "created_at": base_date - timedelta(days=18),
        },
    ]

    insights = [Insight(**data) for data in insights_data]
    db.session.add_all(insights)
    db.session.commit()

def undo_insights():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.insights RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM insights"))
    db.session.commit()