from http import HTTPStatus
from app.models import User

def signup(req):

    # Make sure request is JSON
    content_type = req.headers.get('Content-Type')
    if content_type != 'application/json':
        return 'Content-Type not supported', HTTPStatus.BAD_REQUEST

    # Make sure request has JSON data
    json_data = req.get_json()
    if not json_data:
        return 'Missing JSON data', HTTPStatus.BAD_REQUEST

    # Make sure all fields are filled in
    empty_fields = [] # track any missing fields
    for field in [
        'username', 
        'email', 
        'first_name', 
        'last_name',
        'password'
    ]:
        if not field in json_data:
            empty_fields.append(field)
    
    # If any fields are missing, return error
    if len(empty_fields) > 0:
        return dict(
            error='Please fill in all fields',
            empty_fields=empty_fields
        ), HTTPStatus.BAD_REQUEST

    # Get fields
    username = json_data.get('username')
    email = json_data.get('email')
    first_name = json_data.get('first_name')
    last_name = json_data.get('last_name')
    password = json_data.get('password')

    # Make sure user with email doesn't already exist
    user = User.query.filter_by(email=email).first()