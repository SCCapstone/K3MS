from app.models.student_evaluations import Evaluations as Eval
from app.models.user import User
from flask_login import current_user
from http import HTTPStatus
from datetime import datetime
from app.extensions import db
from flask import jsonify
from sqlalchemy import cast, Integer
import numpy as np
import plotly.figure_factory as ff
import plotly.express as px
import plotly.io as pio

def get_oldest_year_from_period(period):
    current_year = datetime.now().year
    oldest_year = current_year - int(period)
    return oldest_year

def get_courses_for_user_controller(user_email, period):
    if current_user.email != user_email:
        if current_user.position != 'chair':
            return dict(error='You do not have authority access info about other users'), HTTPStatus.UNAUTHORIZED
        
        # make sure provided user is not a chair
        if User.query.filter_by(email=user_email, position='chair').first():
            return dict(error='You do not have authority to access this information'), HTTPStatus.UNAUTHORIZED
    
    oldest_year = get_oldest_year_from_period(period)

    courses = db.session.query(
        Eval.email, 
        Eval.course, 
        db.func.avg(Eval.course_rating_mean).label('ave_course_rating_mean'), 
        db.func.avg(Eval.instructor_rating_mean).label('ave_instructor_rating_mean')
    ).filter_by(email=user_email).group_by(
        Eval.email, 
        Eval.course
    ).filter(
        cast(Eval.year, Integer) >= oldest_year
    ).all()

    if not courses:
        return dict(error='No courses found for this user for given time period'), HTTPStatus.NOT_FOUND
    
    return [{
        'email': user_email,
        'course': course.course,
        'ave_course_rating_mean': course.ave_course_rating_mean,
        'ave_instructor_rating_mean': course.ave_instructor_rating_mean
    } for course in courses], HTTPStatus.OK

def get_course_analytics_controller(course_name, period):
    # Get all evaluations for the course over the period
    # Do not return email addresses associated with the evaluations
    try:
        oldest_year = get_oldest_year_from_period(period)

        evals = db.session.query(
            Eval.email,
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
            return {'error': 'No courses found for given time period'}, HTTPStatus.NOT_FOUND

        course_ratings = [course.course_rating_mean for course in evals]
        instructor_ratings = [course.instructor_rating_mean for course in evals]
        emails = set([course.email for course in evals])

        # Can't anonymize data if there are less than three users
        if len(emails) < 3 and current_user.position != 'chair':
            return {'error': 'Not enough data to anonymize'}, HTTPStatus.NOT_FOUND

        mean_of_all_course_ratings = np.mean(course_ratings)
        mean_of_all_instructor_ratings = np.mean(instructor_ratings)
        median_of_all_course_ratings = np.median(course_ratings)
        median_of_all_instructor_ratings = np.median(instructor_ratings)
        course_ratings_75th_percentile = np.percentile(course_ratings, 75)
        instructor_ratings_75th_percentile = np.percentile(instructor_ratings, 75)
        
        if len(course_ratings) > 1:
            try:
                plots = {
                    'course_rating_plot': plot(course_ratings, 'Course'),
                    'instructor_rating_plot': plot(instructor_ratings, 'Instructor')
                }
            except Exception as e:
                print(e)
                plots = {'error': 'Error Plotting Data'}
        else:
            plots = {'error': 'Not enough data to plot'}

        return dict(
            mean_of_all_course_ratings=mean_of_all_course_ratings,
            mean_of_all_instructor_ratings=mean_of_all_instructor_ratings,
            median_of_all_course_ratings=median_of_all_course_ratings,
            median_of_all_instructor_ratings=median_of_all_instructor_ratings,
            course_ratings_75th_percentile=course_ratings_75th_percentile,
            instructor_ratings_75th_percentile=instructor_ratings_75th_percentile,
            plots=plots
        ), HTTPStatus.OK
    except Exception as e:
        return {'error': str(e)}, HTTPStatus.INTERNAL_SERVER_ERROR

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
    ).filter(
        User.email != current_user.email
    ).filter(
        User.position != 'chair'
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

def plot(data, metric):
    if len(data) < 2:
        return
    
    mean = np.mean(data)
    std_dev = np.std(data)
    fig = ff.create_distplot([data], group_labels=[f'{metric} Ratings'], bin_size=0.05, show_hist=False)
    fig.add_vline(x=mean, line_dash="dash", line_color="red", name="Mean", showlegend=True)
    fig.add_vline(x=mean + 1 * std_dev, line_dash="dash", line_color="green", name="+1 Std Dev", showlegend=True)
    fig.add_vline(x=mean - 1 * std_dev, line_dash="dash", line_color="green", name="-1 Std Dev", showlegend=True)
    fig.update_layout(
        title=f"Distribution Plot of {metric} Ratings for each Section Taught",
        xaxis_title=f'Mean {metric} Rating',
        yaxis_title="Density",
        legend=dict(
            yanchor="top",
            y=-0.35,
            xanchor="center",
            x=0.5,
            orientation="h",
            borderwidth=2,
        )
    )

    return pio.to_json(fig, pretty=True)