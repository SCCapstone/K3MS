from http import HTTPStatus
from app.models import Publications
from flask_login import current_user
from app.extensions import db

form_fields = [  
    'title',
    'authors',
    'publication_year',
    'isbn'
]

def pub_upload_controller(req):
    try:
        ret = validate_request(req, form_fields)

        if isinstance(ret, tuple):
            return ret
        
        json_data = ret

        # Get Publication Fields
        title = str(json_data.get(form_fields[0]))
        authors = str(json_data.get(form_fields[1]))
        publication_year = str(json_data.get(form_fields[2]))
        isbn = str(json_data.get(form_fields[3]))

        if publication_year.isnumeric() == False:
            return dict(error='Publication Year must be an integer'), HTTPStatus.BAD_REQUEST
        if int(publication_year) < 1800:
            return dict(error='Year must be greater than 1800'), HTTPStatus.BAD_REQUEST

        # Make Sure Publication With Title Doesn't Already Exist For The Current Sser
        publication = Publications.query.filter_by(email=current_user.email, title=title).first()
        if publication:
            return dict(error='Publication Already Exists'), HTTPStatus.BAD_REQUEST
        
        # Set isbn To None, If It Is Null
        if isbn is None:
            isbn = None

        new_publication = Publications(
            email = current_user.email, 
            title = title, 
            authors = authors,
            publication_year = publication_year,
            isbn = isbn
        )

        # Add user to database
        db.session.add(new_publication)
        db.session.commit()

        return [new_publication], HTTPStatus.CREATED
    
    except Exception as e:
        print(f"Error uploading publication: {e}")
        return dict(error='Internal Server Error'), HTTPStatus.INTERNAL_SERVER_ERROR
    
def validate_request(req, fields):
    # Make Sure Request Is JSON
    content_type = req.headers.get('Content-Type')
    if content_type != 'application/json':
        return dict(error='Content-Type not supported'), HTTPStatus.BAD_REQUEST

    # Make Sure Request Has JSON Data
    json_data = req.get_json()
    if not json_data:
        return dict(error='Missing JSON data'), HTTPStatus.BAD_REQUEST

    # Make Sure All Fields Are Filled In
    empty_fields = [] # Track Any Missing Fields
    for field in fields:
        # Skip isbn, Because It Can Be Null
        if field == 'isbn':
            continue
        if not json_data.get(field):
            empty_fields.append(field)
    
    # If Any Fields Are Missing, Return Error
    if len(empty_fields) > 0:
        return dict(
            error='Please fill in all fields',
            empty_fields=empty_fields
        ), HTTPStatus.BAD_REQUEST

    return json_data

