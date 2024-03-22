from http import HTTPStatus
from app.models import Expens
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import db
from flask_login import current_user

form_fields = [  
    'title',
    'amount',
    'year',
    'reporting_department',
    'pi_name'
]

def expen_upload_controller(req):
    
    ret = validate_request(req, form_fields)

    if isinstance(ret, tuple):
        return ret
    
    json_data = ret

    # Get Expenditure fields
    title = json_data.get(form_fields[0])
    amount = json_data.get(form_fields[1])
    year = json_data.get(form_fields[2])
    reporting_department = json_data.get(form_fields[3])
    pi_name = json_data.get(form_fields[4])

    # Make sure expen with title doesn't already exist for this user
    expen = Expens.query.filter_by(email=current_user.email, title=title).first()
    if expen:
        return dict(error='Expenditure already exists'), HTTPStatus.BAD_REQUEST

    new_expen = Expens(
        email=current_user.email, 
        title=title, 
        year=year,
        amount=amount,
        reporting_department=reporting_department,
        pi_name=pi_name
    )

    # Add expen to database
    db.session.add(new_expen)
    db.session.commit()

    return [new_expen], HTTPStatus.CREATED

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