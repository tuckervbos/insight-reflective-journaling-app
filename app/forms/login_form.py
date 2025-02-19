from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import User


def user_exists(form, field):
    email = field.data
    user = User.query.filter(User.email == email).first()
    if not user:
        raise ValidationError('Email provided not found.')


def password_matches(form, field):
    password = field.data
    email = form.email.data  # Access `email` directly from the form
    user = User.query.filter(User.email == email).first()
    if not user:
        return  # Prevent duplicate error messages
    if not user.check_password(password):  # Assuming `check_password` exists on the User model
        raise ValidationError('Password was incorrect.')


class LoginForm(FlaskForm):  # Change Form to FlaskForm
    
    email = StringField('Email', validators=[DataRequired(), Email(), user_exists])
    password = PasswordField('Password', validators=[DataRequired(), password_matches])
    # Flask-WTF automatically handles CSRF tokens internally.