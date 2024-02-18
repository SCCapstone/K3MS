from app.models.student_evaluations import (
    Evaluations as Eval, 
    EvaluationDetails as EvalDetails, 
    EvaluationQuestions as EvalQuestions
)
from app.models.student_evaluations import EvaluationDetails
from app.models.user import User
from flask_login import current_user
from http import HTTPStatus
from datetime import datetime
from app.extensions import db
from flask import jsonify, current_app
from werkzeug.utils import secure_filename
import pandas as pd
from io import BytesIO
from collections import defaultdict

def eval_upload_controller(request):
    try:
        # Make sure current user is a chair
        if current_user.position != 'chair':
            return dict(error='You do not have authority to upload student evaluations'), HTTPStatus.UNAUTHORIZED
        
        # Check if the request contains a file
        if 'file' not in request.files:
            return dict(error='No file part'), HTTPStatus.BAD_REQUEST

        file = request.files['file']

        # Check if the file is present and has an allowed extension (if needed)
        if file.filename == '':
            return dict(error='No selected file'), HTTPStatus.BAD_REQUEST
        
        fn = file.filename
        if ('.' not in fn or fn.split('.')[-1].lower() not in 
            current_app.config['ALLOWED_EVAL_EXTENSIONS']):

            return dict(error='File extension not allowed'), HTTPStatus.BAD_REQUEST

        # Parse the file
        fbytes = BytesIO(file.stream.read())
        evals, eval_details, skipped_rows = parse_and_upload_excel(fbytes)

        db.session.add_all(evals)
        db.session.add_all(eval_details)
        db.session.commit()

        if skipped_rows:
            return dict(mssg='Eval File uploaded successfully - skipped rows', skipped_rows=skipped_rows), HTTPStatus.OK
        return dict(mssg='Eval File uploaded successfully'), HTTPStatus.OK

    except Exception as e:
        print(e)
        return dict(error=str(e)), HTTPStatus.INTERNAL_SERVER_ERROR

def get_student_evals_controller(limit=False):
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

    if limit:
        courses = courses[:4]

    if not courses:
        return {'error': 'No courses found for this user.'}, HTTPStatus.NOT_FOUND
    
    return [{
        'course': course.course,
        'ave_course_rating_mean': course.ave_course_rating_mean,
        'ave_instructor_rating_mean': course.ave_instructor_rating_mean
    } for course in courses], HTTPStatus.OK


def get_student_evals_details_controller(course_name):
    email = current_user.email
    
    course_evals = db.session.query(
        Eval.email, 
        Eval.course,
        Eval.year,
        Eval.semester,
        Eval.section,
        Eval.instructor_type,
        Eval.participants_count,
        Eval.number_of_returns,
        Eval.course_rating_mean,
        Eval.instructor_rating_mean,
    ).filter_by(email=email, course=course_name).group_by(
        Eval.email, 
        Eval.course,
        Eval.year,
        Eval.semester,
        Eval.section
    ).all()

    course_eval_details = db.session.query(
        EvalDetails.email, 
        EvalDetails.course,
        EvalDetails.year,
        EvalDetails.semester,
        EvalDetails.section,
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
        EvalDetails.section,
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
    eval_dict = {(row.email, row.course, row.year, row.semester, row.section): row for row in course_evals}
    
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

        key = (row.email, row.course, row.year, row.semester, row.section)
        eval_dets_dict[key].append({
            'question'    : question,
            'question_id' : row.question_id,
            'mean'        : row.mean,      
            'std'         : row.std,       
            'median'      : row.median,    
            'returns'     : row.returns   
        })

    courses = []

    # Iterate through each key in the Eval dictionary
    for key in eval_dict:

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
            'section'                   : eval_row.section               ,
            'instructor_type'           : eval_row.instructor_type       ,
            'participants_count'        : eval_row.participants_count    ,
            'number_of_returns'         : eval_row.number_of_returns     ,
            'course_rating_mean'        : eval_row.course_rating_mean    ,
            'instructor_rating_mean'    : eval_row.instructor_rating_mean,
            'details'                   : details
        }
        courses.append(combined_data)

    if not courses:
        return {'error': 'No courses found for this user.'}, HTTPStatus.NOT_FOUND
    
    return [{
        'course'                : course.get('course'                , 'N/A'),
        'year'                  : course.get('year'                  , 'N/A'),
        'semester'              : course.get('semester'              , 'N/A'),
        'section'               : course.get('section'               , 'N/A'),
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



def parse_and_upload_excel(fbytes):
    df = pd.read_excel(fbytes)
    df.columns = [c.lower() for c in df.columns]

    evals = []
    details_rows = []
    skipped_entries = []

    questions = current_app.config['QUESTIONS']

    # loop through rows in excel sheet
    for i in range(len(df)):
        row = df.iloc[i].to_dict()

        # Get first few fields
        try:
            first_name = row['first name']
            last_name = row['last name']
            semester = row['period'].split(' ')[0]
            year = row['period'].split(' ')[-1]
            course = row['course'].split('-')[0]
            section = row['course'].split('-')[1]
            instructor_type = row['form of address']
            participants_count = row['participants']
            number_of_returns = row['no. of returns']
            course_rating_mean = row[f"{questions[current_app.config['COURSE_MEAN_KEY']]}(mean)"]
            instructor_rating_mean = row[f"{questions[current_app.config['INSTRUCTOR_MEAN_KEY']]}(mean)"]
        except KeyError:
            skipped_entries.append(dict(
                email=None, 
                first_name=None, 
                last_name=None, 
                year=None, 
                section=None,
                semester=None, 
                course=None, 
                reason='Fields are missing'
            ))
            continue
        
        # Save row info for skipped entries
        row_info = dict(
            email=None,
            first_name=first_name,
            last_name=last_name,
            year=year,
            semester=semester,
            course=course,
            section=section
        )

        # Get email from user table
        row_user = User.query.filter_by(first_name=first_name, last_name=last_name).first()
        if not row_user:
            skipped_entries.append(dict(**row_info, reason='No email found for this user'))
            continue

        email = row_user.email
        row_info['email'] = email    

        # Check if entry exists in database already
        row_exists = Eval.query.filter_by(
            email=email,
            year=year,
            semester=semester,
            course=course,
            section=section
        ).first()
        details_row_exists = EvaluationDetails.query.filter_by(
            email=email,
            year=year,
            semester=semester,
            course=course,
            section=section
        ).first()
        if row_exists or details_row_exists:
            skipped_entries.append(dict(**row_info, reason='This entry already exists in the database'))
            continue

        # Evaluation
        evals.append(Eval(
            email=email,
            year=year,
            semester=semester,
            course=course,
            section=section,
            instructor_type=instructor_type,
            participants_count=participants_count,
            number_of_returns=number_of_returns,
            course_rating_mean=course_rating_mean,
            instructor_rating_mean=instructor_rating_mean
        ))

        # Get Evaluation details

        skipped = False
        for i,q in questions.items():
            try:
                mean = row[f'{q}(mean)']
                std = row[f'{q}(standard deviation)']
                median = row[f'{q}(median)']
                returns = row[f'{q}(returns per question)']
            except KeyError:
                skipped = True
                break
                
            eval_details = EvaluationDetails(
                email=email,
                year=year,
                semester=semester,
                course=course,
                section=section,
                question_id=i,
                mean=mean,
                std=std,
                median=median,
                returns=returns                
            )
            details_rows.append(eval_details)

        if skipped:
            skipped_entries.append(dict(**row_info, reason='Fields are missing'))
            continue
    
    return evals, details_rows, skipped_entries