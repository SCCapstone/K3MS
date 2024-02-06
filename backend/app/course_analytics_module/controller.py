from app.models.student_evaluations import Evaluations as Eval
from flask_login import current_user
from http import HTTPStatus
from datetime import datetime
from app.extensions import db
from flask import jsonify
from sqlalchemy import cast, Integer
import numpy as np

def get_courses_for_user_controller(user_email):
    if current_user.position != 'chair' and current_user.email != user_email:
        return dict(error='You do not have authority access info about other users'), HTTPStatus.UNAUTHORIZED
    
    courses = db.session.query(
        Eval.email, 
        Eval.course, 
        db.func.avg(Eval.course_rating_mean).label('ave_course_rating_mean'), 
        db.func.avg(Eval.instructor_rating_mean).label('ave_instructor_rating_mean')
    ).filter_by(email=user_email).group_by(
        Eval.email, 
        Eval.course
    ).all()

    if not courses:
        return dict(error='No courses found for this user'), HTTPStatus.NOT_FOUND
    
    return [{
        'email': user_email,
        'course': course.course,
        'ave_course_rating_mean': course.ave_course_rating_mean,
        'ave_instructor_rating_mean': course.ave_instructor_rating_mean
    } for course in courses], HTTPStatus.OK

def get_course_analytics_controller(course_name, period):
    # Get all evaluations for the course over the period
    # Do not return email addresses associated with the evaluations
    current_year = datetime.now().year
    oldest_year = current_year - int(period)

    evals = db.session.query(
        Eval.course, 
        Eval.year,
        Eval.course_rating_mean,
        Eval.instructor_rating_mean,
    ).filter(
        Eval.course==course_name
    ).filter(
        cast(Eval.year, Integer) >= oldest_year
    ).all()


    if not evals:
        return {'error': 'No courses found for this user.'}, HTTPStatus.NOT_FOUND
    
    years = [course.year for course in evals]
    course_ratings = [course.course_rating_mean for course in evals]
    instructor_ratings = [course.instructor_rating_mean for course in evals]

    mean_of_all_course_ratings = np.mean(course_ratings)
    mean_of_all_instructor_ratings = np.mean(instructor_ratings)
    course_ratings_mean = np.median(course_ratings)
    instructor_ratings_mean = np.median(instructor_ratings)
    course_ratings_75th_percentile = np.percentile(course_ratings, 75)
    instructor_ratings_75th_percentile = np.percentile(instructor_ratings, 75)

    return [{
        'year': course.year,
        'course_ratings': course.course_rating_mean,
        'instructor_ratings': course.instructor_rating_mean
    } for course in evals], HTTPStatus.OK

def get_student_eval_details_controller(course, year, semester):
    return {'mssg': 'get_student_eval_details - not implemented'}, HTTPStatus.OK