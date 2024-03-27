from http import HTTPStatus
from app.models import User, UserTmp, Grants, Publications, Expenditures, Evaluations, EvaluationDetails
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import db
from flask_login import login_user, logout_user, current_user
from flask import jsonify
import re
import smtplib
from email.message import EmailMessage
from flask import current_app

create_user_fields = [
    'email', 
    'first_name', 
    'last_name',
    'position',
]

manual_create_user_fields = create_user_fields + ['password']

login_fields = [    
    'email',
    'password'
]

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
    try:
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
        db.session.delete(user)

        # Delete all user's grants, publications, and expenditures
        Grants.query.filter_by(email=email).delete()
        Publications.query.filter_by(email=email).delete()
        Expenditures.query.filter_by(email=email).delete()

        # Delete all evaluations and evaluation details associated with user
        Evaluations.query.filter_by(email=email).delete()
        EvaluationDetails.query.filter_by(email=email).delete()

        db.session.commit()
        return dict(mssg='User deleted'), HTTPStatus.OK

    except:
        return dict(error='Error deleting user'), HTTPStatus.INTERNAL_SERVER_ERROR


def update_user_controller(req):
    try:
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

        user.first_name = first_name if first_name else user.first_name
        user.last_name = last_name if last_name else user.last_name
        user.position = position if position else user.position
        db.session.commit()

        return dict(mssg='User Update'), HTTPStatus.OK

    except:
        return dict(error='Error updating user'), HTTPStatus.INTERNAL_SERVER_ERROR

def create_user_controller(req):
    try:
        # if user is not a chair, they cant create new users
        if current_user.position != 'chair':
            return dict(error='You do not have authority to create new users'), HTTPStatus.UNAUTHORIZED

        # Validate request
        ret = validate_request(req, create_user_fields)
        
        if isinstance(ret, tuple):
            return ret

        json_data = ret

        # Get fields
        email = json_data.get(create_user_fields[0])
        first_name = json_data.get(create_user_fields[1])
        last_name = json_data.get(create_user_fields[2])
        position = json_data.get(create_user_fields[3])

        if position not in ['chair', 'professor', 'instructor']:
            return dict(error='Invalid position'), HTTPStatus.BAD_REQUEST
        if not re.match(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
            return dict(error='Invalid email'), HTTPStatus.BAD_REQUEST
        if len(first_name.split()) > 1 or len(last_name.split()) > 1:
            return dict(error='First and last name must be one word'), HTTPStatus.BAD_REQUEST
        
        # Make sure user with email doesn't already exist
        user = User.query.filter_by(email=email).first()
        if user:
            return dict(error='User already exists'), HTTPStatus.BAD_REQUEST
        
        # Make sure user with same first and last name doesn't already exist
        user = User.query.filter_by(first_name=first_name, last_name=last_name).first()
        if user:
            return dict(error='User with same first and last name already exists'), HTTPStatus.BAD_REQUEST

        # Create new tmp user
        link_hash = generate_password_hash(email, method='scrypt')
        new_user = UserTmp(
            email=email, 
            first_name=first_name, 
            last_name=last_name,
            position=position,
            link_hash=link_hash
        )

        # delete tmp user if it already exists
        UserTmp.query.filter_by(email=email).delete()

        # Send email to user to set password
        try:
            msg = EmailMessage()
            msg.set_content((
                f"Hello {first_name} {last_name},\n\n"
                f"Please click the link below to set your password.\n\n"
                f"{current_app.config['FRONTEND_SET_PASSWORD_URL']}?email={email}&hash={link_hash}\n\n"
            ))
            msg['Subject'] = 'USC Dashboard Account Created - Set Password'
            msg['From'] = current_app.config['EMAIL']
            msg['To'] = email
            s = smtplib.SMTP('smtp-mail.outlook.com', 587)
            s.starttls()
            s.login(current_app.config['EMAIL'], current_app.config['EMAIL_PASSWORD'])
            s.send_message(msg)
            s.quit()
        except Exception as e:
            print(e)
            return dict(error='Error sending email'), HTTPStatus.INTERNAL_SERVER_ERROR

        # Add user to database
        db.session.add(new_user)
        db.session.commit()

        return [new_user], HTTPStatus.CREATED
    
    except Exception as e:
        print(e)
        return dict(error='Error creating user'), HTTPStatus.INTERNAL_SERVER_ERROR

def set_password_controller(req):
    try:
        # Validate request
        ret = validate_request(req, ['email', 'password', 'hash'])
        if isinstance(ret, tuple):
            return ret
        json_data = ret

        # Get fields
        email = json_data.get('email')
        password = json_data.get('password')
        hash = json_data.get('hash')

        # check that user with email doesn't already exist
        if User.query.filter_by(email=email).first():
            return dict(error='User already exists'), HTTPStatus.BAD_REQUEST

        # Make sure user is in the tmp table
        user = UserTmp.query.filter_by(email=email).first()
        if not user:
            return dict(error='User does not exist or password already set'), HTTPStatus.BAD_REQUEST
        if not user.link_hash == hash:
            return dict(error='Invalid hash'), HTTPStatus.BAD_REQUEST

        # Check password
        if (bad_password := is_bad_password(password)):
            return bad_password, HTTPStatus.BAD_REQUEST
        
        # Create new user - hash password
        new_user = User(
            email=email, 
            first_name=user.first_name, 
            last_name=user.last_name,
            position=user.position,
            password_hash=generate_password_hash(password, method='scrypt')
        )

        # Delete tmp user
        db.session.delete(user)

        # Add user to database
        db.session.add(new_user)
        db.session.commit()

        return [user], HTTPStatus.OK

    except:
        return dict(error='Error verifying hash'), HTTPStatus.INTERNAL_SERVER_ERROR

def manual_create_user_controller(req):
    try:
        # if user is not a chair, they cant create new users
        if current_user.position != 'chair':
            return dict(error='You do not have authority to create new users'), HTTPStatus.UNAUTHORIZED

        # Validate request
        ret = validate_request(req, manual_create_user_fields)
        
        if isinstance(ret, tuple):
            return ret

        json_data = ret

        # Get fields
        email = json_data.get(manual_create_user_fields[0])
        first_name = json_data.get(manual_create_user_fields[1])
        last_name = json_data.get(manual_create_user_fields[2])
        position = json_data.get(manual_create_user_fields[3])
        password = json_data.get(manual_create_user_fields[4])

        if position not in ['chair', 'professor', 'instructor']:
            return dict(error='Invalid position'), HTTPStatus.BAD_REQUEST
        
        if not re.match(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
            return dict(error='Invalid email'), HTTPStatus.BAD_REQUEST
        
        if len(first_name.split()) > 1 or len(last_name.split()) > 1:
            return dict(error='First and last name must be one word'), HTTPStatus.BAD_REQUEST
        
        # Make sure user with email doesn't already exist
        user = User.query.filter_by(email=email).first()
        if user:
            return dict(error='User already exists'), HTTPStatus.BAD_REQUEST
        
        # Make sure user with same first and last name doesn't already exist
        user = User.query.filter_by(first_name=first_name, last_name=last_name).first()
        if user:
            return dict(error='User with same first and last name already exists'), HTTPStatus.BAD_REQUEST
        
        # Check password
        if (bad_password := is_bad_password(password)):
            return bad_password, HTTPStatus.BAD_REQUEST
        
        # Create new user
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
    
    except Exception as e:
        print(e)
        return dict(error='Error creating user'), HTTPStatus.INTERNAL_SERVER_ERROR

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

def is_bad_password(password):
    if len(password) < 8:
        return dict(error='Password must be at least 8 characters long')
    if not re.search("[A-Z]", password):
        return dict(error='Password must contain at least one uppercase letter')
    if not re.search("[a-z]", password):
        return dict(error='Password must contain at least one lowercase letter')
    if not re.search("[0-9]", password):
        return dict(error='Password must contain at least one number')
    return None
    