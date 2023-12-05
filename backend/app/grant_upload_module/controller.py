from http import HTTPStatus
from app.models import User
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import db
from flask_login import login_user, logout_user

# signup_fields = [
#     'email', 
#     'first_name', 
#     'last_name',
#     'position',
#     'password'
# ]

# login_fields = [    
#     'email',
#     'password'
# ]

form_fields = [  
    'email',  
    'title',
    'amount',
    'year'
]

def grant_upload_controller(req):
    
    ret = validate_request(req, form_fields)

    if isinstance(ret, tuple):
        return ret
    
    # json_data = req.get_json()
    json_data = ret

    # Get fields
    # email = json_data.get(login_fields[0])
    # password = json_data.get(login_fields[1])

    # Get Grant fields
    email = json_data.get(form_fields[0])
    title = json_data.get(form_fields[1])
    amount = json_data.get(form_fields[2])
    year = json_data.get(form_fields[3])

    print(email, title, amount, year)
    grant = f'{email} : {title} {amount} >> $ {year}'
    return dict(mssg=grant), HTTPStatus.OK


    # # Make sure user exists
    # user = User.query.filter_by(email=email).first()
    # if not user:
    #     return dict(error='User does not exist'), HTTPStatus.BAD_REQUEST
    
    # # Make sure password is correct
    # if not check_password_hash(user.password_hash, password):
    #     return dict(error='Incorrect password'), HTTPStatus.BAD_REQUEST
    
    # # Log user in
    # login_user(user) # remember=True to remember user 

    # return [user], HTTPStatus.OK

    # Accept info

# def logout_controller():
#     logout_user()
#     return dict(mssg='Logged out'), HTTPStatus.OK


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



#-------------------------------------------------------------------------------
## For Spring semester: base off this sign up to add info to database:
# def signup_controller(req):
#     # Validate request
#     ret = validate_request(req, signup_fields)
    
#     if isinstance(ret, tuple):
#         return ret

#     json_data = ret

#     # Get fields
#     email = json_data.get(signup_fields[0])
#     first_name = json_data.get(signup_fields[1])
#     last_name = json_data.get(signup_fields[2])
#     position = json_data.get(signup_fields[3])
#     password = json_data.get(signup_fields[4])

#     # Make sure user with email doesn't already exist
#     user = User.query.filter_by(email=email).first()
#     if user:
#         return dict(error='User already exists'), HTTPStatus.BAD_REQUEST
    
#     # Create new user - hash password
#     print("LENGTH:", len(generate_password_hash(password, method='scrypt')))
#     new_user = User(
#         email=email, 
#         first_name=first_name, 
#         last_name=last_name,
#         position=position,
#         password_hash=generate_password_hash(password, method='scrypt')
#     )

#     # Add user to database
#     db.session.add(new_user)
#     db.session.commit()

#     return [new_user], HTTPStatus.CREATED