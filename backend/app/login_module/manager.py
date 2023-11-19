from app.extensions import db, login_manager
from app.models import User
from http import HTTPStatus
from flask import abort

@login_manager.user_loader
def load_user(user_email):
    return User.query.filter_by(email=user_email).first()

@login_manager.unauthorized_handler
def unauthorized():
    # If user tries to access a page that requires login send error
    return dict(error='Must be logged in'), HTTPStatus.UNAUTHORIZED