from http import HTTPStatus
from app.models import User
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import db
from flask_login import login_user, logout_user, current_user
from flask import jsonify

update_password_fields = [    
    'old_password',
    'new_password',
    'confirm_new-password'
]

def update_password_controller(req):

    return None