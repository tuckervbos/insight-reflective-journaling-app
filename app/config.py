import os


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    WEATHER_API_KEY = os.environ.get('WEATHER_API_KEY')
    WEATHER_API_URL = os.environ.get('WEATHER_API_URL')
    MOON_API_URL = os.environ.get('MOON_API_URL')
    FLASK_RUN_PORT = os.environ.get('FLASK_RUN_PORT')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # SQLAlchemy 1.4 no longer supports url strings that start with 'postgres'
    # (only 'postgresql') but heroku's postgres add-on automatically sets the
    # url in the hidden config vars to start with postgres.
    # so the connection uri must be updated here (for production)
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL').replace('postgres://', 'postgresql://')
    SQLALCHEMY_ECHO = True
    # WTF_CSRF_ENABLED = True
    # WTF_CSRF_CHECK_DEFAULT = True
    # SESSION_COOKIE_SECURE = False
    # SESSION_COOKIE_HTTPONLY = True
    # SESSION_COOKIE_SAMESITE = None