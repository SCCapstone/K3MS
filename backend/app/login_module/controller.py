from http import HTTPStatus
from app.models import User
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import db
from flask_login import login_user, logout_user, current_user
from flask import jsonify

signup_fields = [
    'email', 
    'first_name', 
    'last_name',
    'position',
    'password'
]

login_fields = [    
    'email',
    'password'
]

def signup_controller(req):
    # if user is not a chair, they cant create new users
    if current_user.position != 'chair':
        return dict(error='You do not have authority to create new users'), HTTPStatus.UNAUTHORIZED

    # Validate request
    ret = validate_request(req, signup_fields)
    
    if isinstance(ret, tuple):
        return ret

    json_data = ret

    # Get fields
    email = json_data.get(signup_fields[0])
    first_name = json_data.get(signup_fields[1])
    last_name = json_data.get(signup_fields[2])
    position = json_data.get(signup_fields[3])
    password = json_data.get(signup_fields[4])

    # Make sure user with email doesn't already exist
    user = User.query.filter_by(email=email).first()
    if user:
        return dict(error='User already exists'), HTTPStatus.BAD_REQUEST
    
    # Create new user - hash password
    new_user = User(
        email=email, 
        first_name=first_name, 
        last_name=last_name,
        position=position,
        password_hash=generate_password_hash(password, method='scrypt')
    )

    # Add user to database
    db.session.add(new_user)
    db.session.commit()

    return [new_user], HTTPStatus.CREATED

def login_controller(req):
    
    ret = validate_request(req, login_fields)

    if isinstance(ret, tuple):
        return ret
    
    json_data = ret

    # Get fields
    email = json_data.get(login_fields[0])
    password = json_data.get(login_fields[1])

    # Make sure user exists
    user = User.query.filter_by(email=email).first()
    if not user:
        return dict(error='User does not exist'), HTTPStatus.BAD_REQUEST
    
    # Make sure password is correct
    if not check_password_hash(user.password_hash, password):
        return dict(error='Incorrect password'), HTTPStatus.BAD_REQUEST
    
    # Log user in
    login_user(user) # remember=True to remember user 

    return [user], HTTPStatus.OK

def logout_controller():
    logout_user()
    return dict(mssg='Logged out'), HTTPStatus.OK

def check_auth_controller():
    return [dict(
        email=current_user.email, 
        first_name=current_user.first_name,
        last_name=current_user.last_name,
        position=current_user.position,
        date_added=current_user.date_added
    )], HTTPStatus.OK

def delete_user_controller(req):
    # Make sure current user is a chair
    if current_user.position != 'chair':
        return dict(error='You do not have authority to delete users'), HTTPStatus.UNAUTHORIZED

    # Get email from request
    ret = validate_request(req, ['email'])
    if isinstance(ret, tuple):
        return ret
    json_data = ret
    email = json_data.get('email')

    # Make sure user exists
    user = User.query.filter_by(email=email).first()
    if not user:
        return dict(error='User does not exist'), HTTPStatus.BAD_REQUEST
    
    # Make sure user is not a chair
    if user.position == 'chair':
        return dict(error='You do not have authority to delete this user'), HTTPStatus.BAD_REQUEST
    
    # Delete user
    try:
        db.session.delete(user)
        db.session.commit()
    except:
        return dict(error='Error deleting user'), HTTPStatus.INTERNAL_SERVER_ERROR

    return dict(mssg='User deleted'), HTTPStatus.OK

def update_user_controller(req):
    # Make sure current user is a chair
    if current_user.position != 'chair':
        return dict(error='You do not have authority to update users'), HTTPStatus.UNAUTHORIZED

    # Get email from request
    ret = validate_request(req, ['email'])
    if isinstance(ret, tuple):
        return ret
    json_data = ret

    # get fields
    email = json_data.get('email')
    first_name = json_data.get('first_name')
    last_name = json_data.get('last_name')
    position = json_data.get('position')

    # Make sure user exists
    user = User.query.filter_by(email=email).first()
    if not user:
        return dict(error='User does not exist'), HTTPStatus.BAD_REQUEST

    # Make sure user is not a chair
    if user.position == 'chair':
        return dict(error='You do not have authority to update this user'), HTTPStatus.BAD_REQUEST

    # if no fields are filled in, return no update
    if not first_name and not last_name and not position:
        return dict(mssg='No update'), HTTPStatus.OK
    # Update User

    try:
        user.first_name = first_name if first_name else user.first_name
        user.last_name = last_name if last_name else user.last_name
        user.position = position if position else user.position
        db.session.commit()
    except:
        return dict(error='Error updating user'), HTTPStatus.INTERNAL_SERVER_ERROR

    return dict(mssg='User Update'), HTTPStatus.OK


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