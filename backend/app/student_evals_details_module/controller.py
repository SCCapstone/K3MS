from app.models.student_evaluations import Evaluations as Eval
from app.models.student_evaluations.evaluation_details import EvaluationDetails as EvalDetails
from flask_login import current_user
from http import HTTPStatus
from datetime import datetime
from app.extensions import db
from flask import jsonify

def get_student_evals_details_controller(course_name):
    email = current_user.email
    
    course_evals = db.session.query(
        Eval.email, 
        Eval.course,
        Eval.year,
        Eval.semester,
        Eval.instructor_type,
        Eval.participants_count,
        Eval.number_of_returns,
        Eval.course_rating_mean,
        Eval.instructor_rating_mean,
    ).filter_by(email=email, course=course_name).group_by(
        Eval.email, 
        Eval.course,
        Eval.year,
        Eval.semester
    ).all()

    course_eval_details = db.session.query(
        EvalDetails.email, 
        EvalDetails.course,
        EvalDetails.year,
        EvalDetails.semester,
        EvalDetails.question_id,
        EvalDetails.mean,
        EvalDetails.std,
        EvalDetails.median,
        EvalDetails.returns
    ).filter_by(email=email, course=course_name).group_by(
        EvalDetails.email, 
        EvalDetails.course,
        EvalDetails.year,
        EvalDetails.semester
    ).all()

    # Create dictionaries to store data from each dataset
    eval_dict      = {(row.email, row.course, row.year, row.semester): row for row in course_evals}
    eval_dets_dict = {(row.email, row.course, row.year, row.semester): row for row in course_eval_details}

    courses = []

    # Iterate through each key in the Eval dictionary
    for key in eval_dict:
        # Check if the key exists in both dictionaries
        if key in eval_dets_dict:
            # If the key exists in both dictionaries, combine the data
            eval_row = eval_dict[key]
            eval_dets_row = eval_dets_dict[key]

            combined_data = {
                'email'                     : eval_row.email,
                'course'                    : eval_row.course                ,
                'year'                      : eval_row.year                  ,
                'semester'                  : eval_row.semester              ,
                'instructor_type'           : eval_row.instructor_type       ,
                'participants_count'        : eval_row.participants_count    ,
                'number_of_returns'         : eval_row.number_of_returns     ,
                'course_rating_mean'        : eval_row.course_rating_mean    ,
                'instructor_rating_mean'    : eval_row.instructor_rating_mean,
                'question_id'               : eval_dets_row.question_id,
                'mean'                      : eval_dets_row.mean      ,
                'std'                       : eval_dets_row.std       ,
                'median'                    : eval_dets_row.median    ,
                'returns'                   : eval_dets_row.returns   ,
                # Add more fields as needed
            }
            courses.append(combined_data)
        else:
            eval_row = eval_dict[key]
            combined_data = {
                'email'                     : eval_row.email,
                'course'                    : eval_row.course                ,
                'year'                      : eval_row.year                  ,
                'semester'                  : eval_row.semester              ,
                'instructor_type'           : eval_row.instructor_type       ,
                'participants_count'        : eval_row.participants_count    ,
                'number_of_returns'         : eval_row.number_of_returns     ,
                'course_rating_mean'        : eval_row.course_rating_mean    ,
                'instructor_rating_mean'    : eval_row.instructor_rating_mean,
            }
            courses.append(combined_data)



    if not courses:
        return {'error': 'No courses found for this user.'}, HTTPStatus.NOT_FOUND
    
    return [{
        'course'                : course.get('course'                , 'N/A'),
        'year'                  : course.get('year'                  , 'N/A'),
        'semester'              : course.get('semester'              , 'N/A'),
        'instructor_type'       : course.get('instructor_type'       , 'N/A'),
        'participants_count'    : course.get('participants_count'    , 'N/A'),
        'number_of_returns'     : course.get('number_of_returns'     , 'N/A'),
        'course_rating_mean'    : course.get('course_rating_mean'    , 'N/A'),
        'instructor_rating_mean': course.get('instructor_rating_mean', 'N/A'),
        'question_id'           : course.get('question_id'           , 'N/A'),
        'mean'                  : course.get('mean'                  , 'N/A'),
        'std'                   : course.get('std'                   , 'N/A'),
        'median'                : course.get('median'                , 'N/A'),
        'returns'               : course.get('returns'               , 'N/A'),
        # 'ave_course_rating_mean': course.ave_course_rating_mean,
        # 'ave_instructor_rating_mean': course.ave_instructor_rating_mean
    } for course in courses], HTTPStatus.OK