from app.models.student_evaluations import (
    Evaluations as Eval, 
    EvaluationDetails as EvalDetails, 
    EvaluationQuestions as EvalQuestions,
    EvaluationDetailsTmp,
    EvaluationsTmp
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
import numpy as np
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
        evals, eval_details, skipped_rows, existing_rows = parse_and_upload_excel(fbytes)

        # Clear old rows from tmp tables
        db.session.query(EvaluationsTmp).delete()
        db.session.query(EvaluationDetailsTmp).delete()

        # Add existing rows to the temporary tables in database
        if skipped_rows:
            db.session.add_all(existing_rows[0]) # evals
            db.session.add_all(existing_rows[1]) # eval_details

        # Add the evals to the database
        db.session.add_all(evals)
        db.session.add_all(eval_details)
        db.session.commit()

        if skipped_rows:
            return dict(mssg='Eval File uploaded successfully - skipped rows', skipped_rows=skipped_rows), HTTPStatus.OK
        return dict(mssg='Eval File uploaded successfully'), HTTPStatus.OK

    except Exception as e:
        print(e)
        if e == 'Error reading excel file':
            return dict(error='Excel file incorrectly formatted'), HTTPStatus.BAD_REQUEST
        return dict(error="Error uploading file. Please try again."), HTTPStatus.INTERNAL_SERVER_ERROR

def overwrite_evals_rows_controller(request):
    try:
        # Make sure current user is a chair
        if current_user.position != 'chair':
            return dict(error='You do not have authority to modify student evaluations'), HTTPStatus.UNAUTHORIZED
        
        # Get rows to overwrite from request
        content_type = request.headers.get('Content-Type')
        if content_type != 'application/json':
            return dict(error='Content-Type not supported'), HTTPStatus.BAD_REQUEST
        
        rows = request.get_json().get('rows')
        if rows is None:
            return dict(error='rows field missing'), HTTPStatus.BAD_REQUEST
        
        # If no rows provided, return no change
        if not rows:
            # Clear rows from tmp tables
            db.session.query(EvaluationsTmp).delete()
            db.session.query(EvaluationDetailsTmp).delete()
            return dict(mssg='No rows overwritten'), HTTPStatus.OK

        # Get the rows from the temporary database
        for row in rows:
            eval = EvaluationsTmp.query.filter_by(
                email=row['email'],
                year=row['year'],
                semester=row['semester'],
                course=row['course'],
                section=row['section']
            ).first()

            eval_details = EvaluationDetailsTmp.query.filter_by(
                email=row['email'],
                year=row['year'],
                semester=row['semester'],
                course=row['course'],
                section=row['section']
            ).all()

            # Entries were found in tmp tables, update the main tables
            if eval and eval_details:
                # Update the main tables
                Eval.query.filter_by(
                    email=row['email'],
                    year=row['year'],
                    semester=row['semester'],
                    course=row['course'],
                    section=row['section']
                ).update(eval.get_attr())

                EvalDetails.query.filter_by(
                    email=row['email'],
                    year=row['year'],
                    semester=row['semester'],
                    course=row['course'],
                    section=row['section']
                ).delete()

                db.session.add_all([EvaluationDetails(**d.get_attr()) for d in eval_details])
            else:
                return dict(error='Error Overwriting Evaluations. Please reupload file and try again'), HTTPStatus.BAD_REQUEST
        
        db.session.commit()
        return {'mssg': f'{len(rows)} Rows Overwritten '}, HTTPStatus.OK
    except Exception as e:
        print(e)
        return dict(error="Error overwriting rows. Please try again."), HTTPStatus.INTERNAL_SERVER_ERROR


def get_student_evals_controller(user_email=None, limit=False):
    # Get Current User's Email
    email = current_user.email

    # If user_email is provided, use it to query the database
    if user_email:
        if current_user.position != 'chair':
            return dict(error='You do not have authority to access this information'), HTTPStatus.UNAUTHORIZED
        email = user_email

        # make sure provided user is not a chair
        if User.query.filter_by(email=email, position='chair').first():
            return dict(error='You do not have authority to access this information'), HTTPStatus.UNAUTHORIZED

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


def get_student_evals_details_controller(course_name, user_email=None):
    email = current_user.email
    if user_email:
        if current_user.position != 'chair':
            return dict(error='You do not have authority to access this information'), HTTPStatus.UNAUTHORIZED
        email = user_email

        # make sure provided user is not a chair
        if User.query.filter_by(email=email, position='chair').first():
            return dict(error='You do not have authority to access this information'), HTTPStatus.UNAUTHORIZED
    
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
        'email'                 : course.get('email'                , 'N/A'),
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
    try:
        df = pd.read_excel(fbytes)
    except Exception:
        raise Exception('Error reading excel file')
        
    df.columns = [c.lower() for c in df.columns]

    evals = []
    details_rows = []
    skipped_entries = []
    existing_entries = ([],[])
    seen_sections = set()

    questions = current_app.config['QUESTIONS']

    # loop through rows in excel sheet
    for i in range(len(df)):
        row = df.iloc[i].to_dict()

        # Get first few fields
        keyerror = False
        try:
            first_name = str(row['first name'])
            last_name = str(row['last name'])
            period = str(row['period'])
            course_info = str(row['course'])
            instructor_type = str(row['form of address'])
            participants_count = str(row['participants'])
            number_of_returns = str(row['no. of returns'])
            course_rating_mean = str(row[f"{questions[current_app.config['COURSE_MEAN_KEY']]}(mean)"])
            instructor_rating_mean = str(row[f"{questions[current_app.config['INSTRUCTOR_MEAN_KEY']]}(mean)"])
        except KeyError:
            keyerror = True

        # If fields were missing or incorrect, skip this entry
        if (keyerror or 
            not first_name or not last_name or 
            len(period.split(' ')) != 2 or
            len(course_info.split('-')) != 4
        ):
            skipped_entries.append(dict(
                row_index=i+1,
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

        semester, year = period.split(' ')
        course, section,_,_ = course_info.split('-')
        semester = semester.title()

        # Temporarily Save row info
        row_info = dict(
            row_index=i+1,
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

        # Check that fields are the correct values
        try:
            participants_count = int(float(participants_count))
            number_of_returns = int(float(number_of_returns))
            course_rating_mean = float(course_rating_mean)
            instructor_rating_mean = float(instructor_rating_mean)
            if not section.isnumeric():
                raise ValueError
        except ValueError:
            skipped_entries.append(dict(**row_info, reason='Row meta data missing or incorrect type'))
            continue
        
        # Check that semester is correct
        if semester not in ['Fall', 'Spring', 'Summer']:
            skipped_entries.append(dict(**row_info, reason='Semester is not one of Fall, Spring, or Summer'))
            continue

        if f"{email}{year}{semester}{course}{section}" in seen_sections:
            skipped_entries.append(dict(**row_info, reason='This row is a duplicate (based on name, year, semester, course, and section)'))
            continue

        # Check if entry exists in database already
        row_exists = Eval.query.filter_by(
            email=email,
            year=year,
            semester=semester,
            course=course,
            section=section
        ).first()

        # Get Evaluation details from the row
        skipped = False
        for j,q in questions.items():
            # Get the mean, std, median, and returns for each question
            # If fields are missing or incorrect, skip this entry
            try:
                mean = float(row[f'{q}(mean)'])
                std = float(row[f'{q}(standard deviation)'])
                median = float(row[f'{q}(median)'])
                returns = float(row[f'{q}(returns per question)'])
            except KeyError:
                # Value is missing
                skipped = True
                break
            except ValueError:
                # Value is not a number
                skipped = True
                break
            if np.isnan(mean) or np.isnan(std) or np.isnan(median) or np.isnan(returns):
                skipped = True
                break
                
            eval_details = EvaluationDetails(
                email=email,
                year=year,
                semester=semester,
                course=course,
                section=section,
                question_id=j,
                mean=mean,
                std=std,
                median=median,
                returns=returns                
            )
            # If row already exists, add to tmp table. If not, add to list of details
            if row_exists:
                existing_entries[1].append(EvaluationDetailsTmp(**eval_details.get_attr()))
            else:
                details_rows.append(eval_details)

        if skipped:
            skipped_entries.append(dict(**row_info, reason='Value fields are missing or incorrect types'))
            continue

        # Add this section to list of seen sections
        seen_sections.add(f"{email}{year}{semester}{course}{section}")

        # Create Evaluation Table Row
        eval = Eval(
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
        )

        if row_exists:
            skipped_entries.append(dict(**row_info, reason='This entry already exists in the database'))
            # Add the eval to the list of existing evals
            existing_entries[0].append(EvaluationsTmp(**eval.get_attr()))
            continue

        # Add the eval to the list of evals
        evals.append(eval)
    
    return evals, details_rows, skipped_entries, existing_entries