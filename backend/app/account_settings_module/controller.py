from http import HTTPStatus
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import db
from flask_login import current_user
import re

update_password_fields = [
    'new_password',
    'confirm_new_password'
]

def update_password_controller(req):

    # Validate Request
    ret = validate_request(req, update_password_fields)

    if isinstance(ret, tuple):
        return ret
    
    json_data = ret

    # Get Update Password Fields
    new_password = json_data.get(update_password_fields[0])
    confirm_new_password = json_data.get(update_password_fields[1])

    # Error If new_password and confirm_new_password Aren't The Same
    if confirm_new_password != new_password:
        return dict(error='New Password Cannot Be Confirmed'), HTTPStatus.BAD_REQUEST
    
    if len(new_password) < 8:
        return dict(error='Password must be at least 8 characters long'), HTTPStatus.BAD_REQUEST
    if not re.search("[A-Z]", new_password):
        return dict(error='Password must contain at least one uppercase letter'), HTTPStatus.BAD_REQUEST
    if not re.search("[a-z]", new_password):
        return dict(error='Password must contain at least one lowercase letter'), HTTPStatus.BAD_REQUEST
    if not re.search("[0-9]", new_password):
        return dict(error='Password must contain at least one number'), HTTPStatus.BAD_REQUEST
    
    try:
        # Reset current_user's Password In The DB
        current_user.password_hash = generate_password_hash(new_password, method='scrypt')

        # Commit Changes To The DB
        db.session.commit()
    except:
        return dict(error='Error Updating Password'), HTTPStatus.INTERNAL_SERVER_ERROR

    return dict(mssg='Password Updated Successfully!'), HTTPStatus.OK

def validate_request(req, fields):
    # Make sure request is JSON
    content_type = req.headers.get('Content-Type')
    if content_type != 'application/json':
        return dict(error='Content-Type not supported'), HTTPStatus.BAD_REQUEST

    # Make sure request has JSON data
    json_data = req.get_json()
    if not json_data:
        return dict(error='Missing JSON data'), HTTPStatus.BAD_REQUEST

    # Make sure all fields are filled in
    empty_fields = [] # track any missing fields
    for field in fields:
        if not json_data.get(field):
            empty_fields.append(field)
    
    # If any fields are missing, return error
    if len(empty_fields) > 0:
        return dict(
            error='Please fill in all fields',
            empty_fields=empty_fields
        ), HTTPStatus.BAD_REQUEST

    return json_data