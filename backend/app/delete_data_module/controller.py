from app.models import User, Evaluations, EvaluationDetails, Grants, Publications, Expenditures
from http import HTTPStatus
from flask_login import current_user
from app.extensions import db

def delete_evals_controller(req):
    try:
        # if user is not a chair, they cant delete evaluations
        if current_user.position != 'chair':
            return dict(error='You do not have authority to delete evaluations'), HTTPStatus.UNAUTHORIZED
        
        ret = validate_request(req, 'I want to delete all student evaluations in the database')
        if ret:
            return ret
        
        # Delete all evaluations
        Evaluations.query.delete()
        EvaluationDetails.query.delete()

        db.session.commit()

        return dict(message='All evaluations have been deleted'), HTTPStatus.OK

    except:
        return dict(error='Error deleting evaluations'), HTTPStatus.INTERNAL_SERVER_ERROR
    
def delete_all_grants_controller(req):
    try:
        ret = validate_request(req, 'I want to delete all my grants')
        if ret:
            return ret
        
        # Delete all grants for this user
        Grants.query.filter_by(email=current_user.email).delete()
        db.session.commit()

        return dict(message='All evaluations have been deleted'), HTTPStatus.OK
    
    except:
        return dict(error='Error deleting evaluations'), HTTPStatus.INTERNAL_SERVER_ERROR

def delete_all_pubs_controller(req):
    try:
        ret = validate_request(req, 'I want to delete all my publications')
        if ret:
            return ret
        
        # Delete all publications for this user
        Publications.query.filter_by(email=current_user.email).delete()
        db.session.commit()

        return dict(message='All evaluations have been deleted'), HTTPStatus.OK
    
    except:
        return dict(error='Error deleting evaluations'), HTTPStatus.INTERNAL_SERVER_ERROR
    
def delete_all_expens_controller(req):
    try:
        ret = validate_request(req, 'I want to delete all my expenditures')
        if ret:
            return ret
        
        # Delete all expenditures for this user
        Expenditures.query.filter_by(email=current_user.email).delete()
        db.session.commit()

        return dict(message='All evaluations have been deleted'), HTTPStatus.OK
    
    except:
        return dict(error='Error deleting evaluations'), HTTPStatus.INTERNAL_SERVER_ERROR

def validate_request(req, confirmation_text):
    # Make sure request is JSON
    content_type = req.headers.get('Content-Type')
    if content_type != 'application/json':
        return dict(error='Content-Type not supported'), HTTPStatus.BAD_REQUEST
    
    # Make sure request has JSON data
    json_data = req.get_json()
    if not json_data:
        return dict(error='Missing JSON data'), HTTPStatus.BAD_REQUEST
    
    # Make sure confirmation text is correct
    confirmation = json_data.get('confirmText')
    if not confirmation or confirmation != confirmation_text: 
        return dict(error='Confirmation text is incorrect'), HTTPStatus.BAD_REQUEST
    
    return None


# Individual delete grant controller
def delete_entry_controller(req):
    try:
        # Get JSON data
        content_type = req.headers.get('Content-Type')
        if content_type != 'application/json':
            return dict(error='Content-Type not supported'), HTTPStatus.BAD_REQUEST
        
        json_data = req.get_json()

        if not json_data:
            return dict(error='Missing JSON data'), HTTPStatus.BAD_REQUEST
        
        # Get type of entry
        type = json_data.get('type')
        if type not in ['grant', 'pub', 'expen']:
            return dict(error='Invalid type'), HTTPStatus.BAD_REQUEST
        
        # Get entry title from request
        entry_title = json_data.get('title')
        if not entry_title:
            return dict(error='Missing title'), HTTPStatus.BAD_REQUEST

        # Get entry email
        entry_email = json_data.get('email')
        if not entry_email:
            return dict(error='Missing email'), HTTPStatus.BAD_REQUEST

        # Get entry position
        entry_position = User.query.filter_by(email=entry_email).first().position

        # entry_position = json_data.get('position')
        # if not entry_position:
        #     return dict(error='Missing position'), HTTPStatus.BAD_REQUEST

        # Get entry year
        entry_year = json_data.get('year')
        if not entry_year:
            return dict(error='Missing year'), HTTPStatus.BAD_REQUEST

        if entry_email != current_user.email:
            if current_user.position != 'chair' or entry_position == 'chair':
                return dict(error='You do not have authority to delete this entry'), HTTPStatus.UNAUTHORIZED

        if type == 'grant':
            # Delete all grants for this user
            Grants.query.filter_by(email=entry_email, title=entry_title, year=entry_year).delete()
            db.session.commit()
        elif type == 'pub':
            # Delete all publications for this user
            Publications.query.filter_by(email=entry_email, title=entry_title, publication_year=entry_year).delete()
            db.session.commit()
        elif type == 'expen':
            # Delete all expenditures for this user
            Expenditures.query.filter_by(email=entry_email, pi_name=entry_title, year=entry_year).delete()
            db.session.commit()

        return dict(message=f'{type}: {entry_title} has been deleted'), HTTPStatus.OK
    
    except:
        return dict(error=f'Error deleting: {req.get_json()}'), HTTPStatus.INTERNAL_SERVER_ERROR