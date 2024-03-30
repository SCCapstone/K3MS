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
import numpy as np
from scipy import stats

def get_team_assessments_controller():
    try:
        if current_user.position != 'chair':
            return dict(error='You do not have authority access info about other users'), HTTPStatus.UNAUTHORIZED

        # Get all course and intructor ratings to find percentile
        all_course_ratings = db.session.query(Eval.course_rating_mean).all()
        all_instructor_ratings = db.session.query(Eval.instructor_rating_mean).all()

        all_course_ratings = np.array([rating[0] for rating in all_course_ratings])
        all_instructor_ratings = np.array([rating[0] for rating in all_instructor_ratings])

        # Get team members
        team = db.session.query(
            User.email, 
            User.first_name, 
            User.last_name,
            User.position
        ).filter(
            User.email != current_user.email
        ).filter(
            User.position != 'chair'
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
                'courses': []
            }

            courses = db.session.query(
                Eval.email, 
                Eval.course, 
                db.func.avg(Eval.course_rating_mean).label('ave_course_rating_mean'), 
                db.func.avg(Eval.instructor_rating_mean).label('ave_instructor_rating_mean'),
                db.func.max(Eval.year).label('latest_year')
            ).filter(
                Eval.email == user.email
            ).group_by(
                Eval.email,
                Eval.course 
            ).all()

            # Add courses
            if courses:
                ave_all_course_rating_mean = round(np.mean([course.ave_course_rating_mean for course in courses]), 2)
                ave_all_instructor_rating_mean = round(np.mean([course.ave_instructor_rating_mean for course in courses]), 2)
                user_assessment['ave_all_course_rating_mean'] = ave_all_course_rating_mean
                user_assessment['ave_all_instructor_rating_mean'] = ave_all_instructor_rating_mean
                user_assessment['course_percentile'] = round(stats.percentileofscore(all_course_ratings, ave_all_course_rating_mean))
                user_assessment['instructor_percentile'] = round(stats.percentileofscore(all_instructor_ratings, ave_all_instructor_rating_mean))
                for course in courses:
                    user_assessment['courses'].append({
                        'course': course.course,
                        'latest_year': course.latest_year
                    })

            team_assessments.append(user_assessment)

        return team_assessments, HTTPStatus.OK
    
    except Exception as e:
        return dict(error="Error retrieving data"), HTTPStatus.INTERNAL_SERVER_ERROR