from app.models.student_evaluations import (
    Evaluations as Eval, 
    EvaluationDetails as EvalDetails, 
    EvaluationQuestions as EvalQuestions
)
from app.models.user import User
from app.models.grants import Grants
from app.models.publications import Publications
from flask_login import current_user
from http import HTTPStatus
from datetime import datetime
from app.extensions import db
from flask import jsonify, current_app
from werkzeug.utils import secure_filename
import pandas as pd
from io import BytesIO
from collections import defaultdict

def get_team_assessments_controller():
    if current_user.position != 'chair':
        return dict(error='You do not have authority access info about other users'), HTTPStatus.UNAUTHORIZED
    # SELECT email, course, AVG(course_rating_mean) AS ave_course_rating_mean, AVG(instructor_rating_mean) AS avg_instructor_rating_mean FROM evaluations GROUP BY email, year;
    courses = db.session.query(
        Eval.email, 
        Eval.course, 
        db.func.avg(Eval.course_rating_mean).label('ave_course_rating_mean'), 
        db.func.avg(Eval.instructor_rating_mean).label('ave_instructor_rating_mean')
    ).group_by(
        Eval.email, 
        Eval.course
    ).all()

    team = db.session.query(
        User.email, 
        User.first_name, 
        User.last_name,
        User.position
    ).all()

    team_assessments = []

    for user in team:
        user_assessment = {
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'position': user.position,
            'ave_all_course_rating_mean': None,
            'ave_all_instructor_rating_mean': None,
        }

        # Add courses
        user_courses = [course for course in courses if course.email == user.email]
        
        if user_courses:
            ave_all_course_rating_mean = round(sum(course.ave_course_rating_mean for course in user_courses) / len(user_courses), 2)
            user_assessment['ave_all_course_rating_mean'] = ave_all_course_rating_mean

            ave_all_instructor_rating_mean = round(sum(course.ave_instructor_rating_mean for course in user_courses) / len(user_courses), 2)
            user_assessment['ave_all_instructor_rating_mean'] = ave_all_instructor_rating_mean

        team_assessments.append(user_assessment)

    return team_assessments, HTTPStatus.OK