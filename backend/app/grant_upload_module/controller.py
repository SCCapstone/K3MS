from http import HTTPStatus
from app.models import Grants
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
    # return dict(mssg=grant), HTTPStatus.OK

    # 
    # Make sure grant with title doesn't already exist
    grant = Grants.query.filter_by(title=title).first()
    if grant:
        return dict(error='Grant already exists'), HTTPStatus.BAD_REQUEST
    
    # Create new user - hash password
    # print("LENGTH:", len(generate_password_hash(password, method='scrypt')))
    new_grant = Grants(
        email=email, 
        title=title, 
        year=year,
        amount=amount
    )

    # Add user to database
    db.session.add(new_grant)
    db.session.commit()

    return [new_grant], HTTPStatus.CREATED

    return dict(mssg=grant), HTTPStatus.OK







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
# For Spring semester: base off this sign up to add info to database:
# def signup_controller(req):
#     # Validate request
#     # ret = validate_request(req, signup_fields)
    
#     # if isinstance(ret, tuple):
#     #     return ret

#     json_data = ret

#     # Get fields
#     email = json_data.get(form_fields[0])
#     title = json_data.get(form_fields[1])
#     amount = json_data.get(form_fields[2])
#     year = json_data.get(form_fields[3])

#     # Make sure user with email doesn't already exist
#     grant = Grants.query.filter_by(email=email).first()
#     if grant:
#         return dict(error='Grant already exists'), HTTPStatus.BAD_REQUEST
    
#     # Create new user - hash password
#     # print("LENGTH:", len(generate_password_hash(password, method='scrypt')))
#     new_grant = Grants(
#         email=email, 
#         title=title, 
#         year=year,
#         amount=amount
#     )

#     # Add user to database
#     db.session.add(new_grant)
#     db.session.commit()

#     return [new_grant], HTTPStatus.CREATED