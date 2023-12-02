from app.models.student_evaluations import Evaluations as Eval
from flask_login import current_user
from http import HTTPStatus
from datetime import datetime
from app.extensions import db
from flask import jsonify

def get_student_evals_controller():
    email = current_user.email

    # SELECT email, course, AVG(course_rating_mean) AS ave_course_rating_mean, AVG(instructor_rating_mean) AS avg_instructor_rating_mean FROM evaluations WHERE email = 'email' GROUP BY email, year;
    courses = db.session.query(
        Eval.email, 
        Eval.course, 
        db.func.avg(Eval.course_rating_mean).label('ave_course_rating_mean'), 
        db.func.avg(Eval.instructor_rating_mean).label('ave_instructor_rating_mean')
    ).filter_by(email=email).group_by(
        Eval.email, 
        Eval.course
    ).all()

    if not courses:
        return {'error': 'No courses found for this user.'}, HTTPStatus.NOT_FOUND
    
    return [{
        'course': course.course,
        'ave_course_rating_mean': course.ave_course_rating_mean,
        'ave_instructor_rating_mean': course.ave_instructor_rating_mean
    } for course in courses], HTTPStatus.OK

def get_student_eval_details_controller(course, year, semester):
    return {'mssg': 'get_student_eval_details - not implemented'}, HTTPStatus.OK