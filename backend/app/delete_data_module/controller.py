from app.models import Evaluations, EvaluationDetails
from http import HTTPStatus
from flask_login import current_user
from app.extensions import db

def delete_evals_controller(req):
    try:
        # if user is not a chair, they cant delete evaluations
        if current_user.position != 'chair':
            return dict(error='You do not have authority to delete evaluations'), HTTPStatus.UNAUTHORIZED
        
        # Make sure request is JSON
        content_type = req.headers.get('Content-Type')
        if content_type != 'application/json':
            print('json')
            return dict(error='Content-Type not supported'), HTTPStatus.BAD_REQUEST
        
        # Make sure request has JSON data
        json_data = req.get_json()
        if not json_data:
            return dict(error='Missing JSON data'), HTTPStatus.BAD_REQUEST
        
        # Make sure confirmation text is correct
        confirmation = json_data.get('confirmText')
        if not confirmation or confirmation != 'I want to delete all student evaluations in the database':
            return dict(error='Confirmation text is incorrect'), HTTPStatus.BAD_REQUEST
        
        # Delete all evaluations
        Evaluations.query.delete()
        EvaluationDetails.query.delete()

        db.session.commit()

        return dict(message='All evaluations have been deleted'), HTTPStatus.OK

    except:
        return dict(error='Error deleting evaluations'), HTTPStatus.INTERNAL_SERVER_ERROR