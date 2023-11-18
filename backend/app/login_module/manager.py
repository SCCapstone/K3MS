from app.extensions import db, login_manager
from app.models import User
from http import HTTPStatus
from flask import abort

@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)
    # return None if user is not valid

@login_manager.unauthorized_handler
def unauthorized():
    # If user tries to access a page that requires login send error
    abort(HTTPStatus.UNAUTHORIZED)
    return None # error message