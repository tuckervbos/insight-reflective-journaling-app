import pytest
from app import create_app, db
from app.models import User
import logging
from werkzeug.security import generate_password_hash

@pytest.fixture(scope="function")
def client():
    app = create_app()
    app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "WTF_CSRF_ENABLED": False,  # Disable CSRF for tests
        "LOGIN_DISABLED": False,  # Ensure Flask-Login is active
    })

    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.session.remove()
            db.drop_all()

@pytest.fixture(scope="module")
def runner(app):
    """
    Provides a CLI runner for testing Flask commands.
    """
    return app.test_cli_runner()

# Suppress verbose SQLAlchemy logs during tests
logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)