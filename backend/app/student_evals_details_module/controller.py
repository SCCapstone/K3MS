from app.models.student_evaluations import Evaluations as Eval
from app.models.student_evaluations.evaluation_details import EvaluationDetails as EvalDetails
from app.models.student_evaluations.evaluation_questions import EvaluationQuestions as EvalQuestions
from flask_login import current_user
from http import HTTPStatus
from datetime import datetime
from app.extensions import db
from flask import jsonify
from collections import defaultdict

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
        EvalDetails.semester,
        EvalDetails.question_id
    ).all()

    course_eval_questions = db.session.query(
        EvalQuestions.question_id, 
        EvalQuestions.question_text
    ).group_by(
        EvalQuestions.question_id, 
        EvalQuestions.question_text
    )

    # Create dictionaries to store data from each dataset
    eval_dict      = {(row.email, row.course, row.year, row.semester): row for row in course_evals}
    # eval_dets_dict = {(row.email, row.course, row.year, row.semester): row for row in course_eval_details}

    # START try code ----------------
    # Stores details for each course
    eval_dets_dict = defaultdict(list)

    # Create a dictionary to store question_id as key and question_text as value
    questions_dict = {}

    # Iterate through the query result and construct the dictionary
    for question_id, question_text in course_eval_questions:
        questions_dict[question_id] = question_text

    # Add each question to the details
    for row in course_eval_details:
        
        # Get question string
        if row.question_id in questions_dict:
            question = questions_dict[row.question_id]
        else:
            question = "Fake Question"

        key = (row.email, row.course, row.year, row.semester)
        eval_dets_dict[key].append({
            'question'    : question,
            'question_id' : row.question_id,
            'mean'        : row.mean,      
            'std'         : row.std,       
            'median'      : row.median,    
            'returns'     : row.returns   
        })
    # END try code ----------------


    courses = []

    # Iterate through each key in the Eval dictionary
    for key in eval_dict:
        
        # START try code  ----------------
        eval_row = eval_dict[key]

        if key in eval_dets_dict:
            details = eval_dets_dict[key]
        else:
            details = []
        

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
            'details'                   : details
        }
        courses.append(combined_data)
        # END try code  ----------------

        # # Check if the key exists in both dictionaries
        # if key in eval_dets_dict:
        #     # If the key exists in both dictionaries, combine the data
        #     eval_row = eval_dict[key]
        #     eval_dets_row = eval_dets_dict[key]

        #     combined_data = {
        #         'email'                     : eval_row.email,
        #         'course'                    : eval_row.course                ,
        #         'year'                      : eval_row.year                  ,
        #         'semester'                  : eval_row.semester              ,
        #         'instructor_type'           : eval_row.instructor_type       ,
        #         'participants_count'        : eval_row.participants_count    ,
        #         'number_of_returns'         : eval_row.number_of_returns     ,
        #         'course_rating_mean'        : eval_row.course_rating_mean    ,
        #         'instructor_rating_mean'    : eval_row.instructor_rating_mean,
        #         'question_id'               : eval_dets_row.question_id,
        #         'mean'                      : eval_dets_row.mean      ,
        #         'std'                       : eval_dets_row.std       ,
        #         'median'                    : eval_dets_row.median    ,
        #         'returns'                   : eval_dets_row.returns   ,
        #         # Add more fields as needed
        #     }
        #     courses.append(combined_data)
        # else:
        #     eval_row = eval_dict[key]
        #     combined_data = {
        #         'email'                     : eval_row.email,
        #         'course'                    : eval_row.course                ,
        #         'year'                      : eval_row.year                  ,
        #         'semester'                  : eval_row.semester              ,
        #         'instructor_type'           : eval_row.instructor_type       ,
        #         'participants_count'        : eval_row.participants_count    ,
        #         'number_of_returns'         : eval_row.number_of_returns     ,
        #         'course_rating_mean'        : eval_row.course_rating_mean    ,
        #         'instructor_rating_mean'    : eval_row.instructor_rating_mean,
        #     }
        #     courses.append(combined_data)



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
        'details': [{
            'question'          : detail.get('question'             , 'N/A'),
            'question_id'       : detail.get('question_id'          , 'N/A'),
            'mean'              : detail.get('mean'                 , 'N/A'),
            'std'               : detail.get('std'                  , 'N/A'),
            'median'            : detail.get('median'               , 'N/A'),
            'returns'           : detail.get('returns'              , 'N/A')
        } for detail in course.get('details', [])]
    } for course in courses], HTTPStatus.OK