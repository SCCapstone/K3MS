from app.models.student_evaluations import Evaluations as Eval
from app.models.user import User
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

    print(evals)
    if not evals:
        return {'error': 'No courses found'}, HTTPStatus.NOT_FOUND
    

    years = [course.year for course in evals]
    course_ratings = [course.course_rating_mean for course in evals]
    instructor_ratings = [course.instructor_rating_mean for course in evals]

    mean_of_all_course_ratings = np.mean(course_ratings)
    mean_of_all_instructor_ratings = np.mean(instructor_ratings)
    median_of_all_course_ratings = np.median(course_ratings)
    median_of_all_instructor_ratings = np.median(instructor_ratings)
    course_ratings_75th_percentile = np.percentile(course_ratings, 75)
    instructor_ratings_75th_percentile = np.percentile(instructor_ratings, 75)\
    
    # TODO create a plot with plotly and return the html

    return dict(
        mean_of_all_course_ratings=mean_of_all_course_ratings,
        mean_of_all_instructor_ratings=mean_of_all_instructor_ratings,
        median_of_all_course_ratings=median_of_all_course_ratings,
        median_of_all_instructor_ratings=median_of_all_instructor_ratings,
        course_ratings_75th_percentile=course_ratings_75th_percentile,
        instructor_ratings_75th_percentile=instructor_ratings_75th_percentile,
        all_data=[dict(
            year=course.year,
            course_rating=course.course_rating_mean,
            instructor_rating=course.instructor_rating_mean
        ) for course in evals]
    ), HTTPStatus.OK

def get_all_courses_in_db_controller():
    courses = db.session.query(
        Eval.course
    ).distinct().all()

    if not courses:
        return {'error': 'No courses found in the database'}, HTTPStatus.NOT_FOUND
    
    return [course.course for course in courses], HTTPStatus.OK

def get_users_in_chairs_dept_controller():
    if current_user.position != 'chair':
        return dict(error='You do not have authority to access this information'), HTTPStatus.UNAUTHORIZED
    
    # TODO add a department field to the user model, get current user's dept, and filter query by that dept

    users = db.session.query(
        User.email,
        User.first_name,
        User.last_name
    ).all()

    if not users:
        return {'error': 'No users found in the database'}, HTTPStatus.NOT_FOUND
    
    return [
        dict(
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name
        ) for user in users
    ], HTTPStatus.OK