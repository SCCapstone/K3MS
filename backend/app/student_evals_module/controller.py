from app.models.student_evaluations import Evaluations
from flask_login import current_user
from http import HTTPStatus

def get_student_evals_controller():
    email = current_user.email
    courses = Evaluations.query.filter_by(email=email).all()


    if not courses():
        return {'error': 'No evaluations found for this user.'}, HTTPStatus.NOT_FOUND
    
    return courses, HTTPStatus.OK

def get_student_eval_details_controller(course, year, semester):
    return {'mssg': 'get_student_eval_details - not implemented'}, HTTPStatus.OK