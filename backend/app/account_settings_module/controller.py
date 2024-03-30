from http import HTTPStatus
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import db
from flask_login import current_user
from io import BytesIO
from app.models.user import User
from app.models.profile import Profile
from flask import send_file

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

def update_profile_picture_controller(req):

    # Backend used to take in file, convert to varbinary, and store in db
    try:
        # Validate data
        if 'file' not in req.files:
            return dict(error='No file part'), HTTPStatus.BAD_REQUEST
        
        file = req.files['file']

        # Check if file is present and has an allowed extension (if needed)
        if file.filename == '':
            return dict(error='No selected file'), HTTPStatus.BAD_REQUEST
        
        fn = file.filename
        file_type = fn.split('.')[-1].lower()

        if ('.' not in fn) or (file_type not in ['jpg', 'jpeg', 'png']):
            return dict(error='Invalid file type'), HTTPStatus.BAD_REQUEST
        
        # Based on the type of file, convert to varbinary and store in db
        # file_bytes = file.read()
        # file_content = BytesIO(file_bytes).readlines()
        file_content = file.read()


        # Save file to db
        # Check if profile exists - if not, create one

        if not Profile.query.get(current_user.email):
            profile = Profile(
                email=current_user.email,
                first_name=current_user.first_name,
                last_name=current_user.last_name,
                profile_picture=file_content,
                file_type=file_type
            )
            db.session.add(profile)
            db.session.commit()
            return dict(mssg='Profile Picture Added Successfully!'), HTTPStatus.OK
        
        else:
            profile = Profile.query.get(current_user.email)
            profile.profile_picture = file_content
            profile.file_type = file_type
            db.session.commit()
            return dict(mssg='Profile Picture Updated Successfully!'), HTTPStatus.OK

    except:
        return dict(error='Error Updating Profile Picture'), HTTPStatus.INTERNAL_SERVER_ERROR

def get_profile_picture_controller():
    try:
        # Get the profile picture for the user
        profile = Profile.query.get(current_user.email)

        if not profile:
            return dict(error='Profile picture not found'), HTTPStatus.NOT_FOUND

        # Get the binary data from the database
        file_content = profile.profile_picture
        file_type = profile.file_type

        # Create a BytesIO object from the binary data
        image_io = BytesIO(file_content)

        # Send the image as a response
        return send_file(image_io, mimetype=f'image/{file_type}')
    except:
        return dict(error='Error Getting Profile Picture'), HTTPStatus.INTERNAL_SERVER_ERROR

