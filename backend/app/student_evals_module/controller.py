from app.models.student_evaluations import Evaluations as Eval, EvaluationDetails
from app.models.user import User
from flask_login import current_user
from http import HTTPStatus
from datetime import datetime
from app.extensions import db
from flask import jsonify, current_app
from werkzeug.utils import secure_filename
import pandas as pd
from io import BytesIO


def eval_upload_controller(request):
    try:
        print("Recieved Request")
        # Check if the request contains a file
        if 'file' not in request.files:
            print("Code fails here")
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


def parse_and_upload_excel(fbytes):
    df = pd.read_excel(fbytes)
    df.columns = [c.lower() for c in df.columns]

    evals = []
    details_rows = []
    skipped_entries = []

    # loop through rows in excel sheet
    for i in range(len(df)):
        row = df.iloc[i].to_dict()

        # Get first few fields
        first_name = row['first name']
        last_name = row['last name']
        semester = row['period'].split(' ')[0]
        year = row['period'].split(' ')[-1]
        course = row['course'].split('-')[0]
        instructor_type = row['form of address']
        participants_count = row['participants']
        number_of_returns = row['no. of returns']
        course_rating_mean = None
        instructor_rating_mean = None

        # Save row info for skipped entries
        row_info  = dict(
            email=None,
            first_name=first_name,
            last_name=last_name,
            year=year,
            semester=semester,
            course=course
        )

        # Get email from user table
        row_user = User.query.filter_by(first_name=first_name, last_name=last_name).first()
        if not row_user:
            skipped_entries.append(dict(**row_info, reason='No email found for this user'))
            continue

        email = row_user.first().email
        row_info['email'] = email    

        # Check if entry exists in database already
        row_exists = Eval.query.filter_by(
            email=email,
            year=year,
            semester=semester,
            course=course
        ).first()
        details_row_exists = EvaluationDetails.query.filter_by(
            email=email,
            year=year,
            semester=semester,
            course=course
        ).first()
        if row_exists or details_row_exists:
            skipped_entries.append(dict(**row_info, reason='This entry already exists in the database'))
            continue

        # Get Evaluation details
        questions = current_app.config['QUESTIONS']

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
                question_id=i,
                mean=mean,
                std=std,
                median=median,
                returns=returns                
            )
            details_rows.append(eval_details)

            # for these two questions, save in eval table also
            if i == 20:
                course_rating_mean = mean
            elif i == 28:
                instructor_rating_mean = mean

        if skipped:
            skipped_entries.append(dict(**row_info, reason='Fields are missing'))
            continue

        # Evaluation
        evals.append(Eval(
            email=email,
            year=year,
            semester=semester,
            course=course,
            instructor_type=instructor_type,
            participants_count=participants_count,
            number_of_returns=number_of_returns,
            course_rating_mean=course_rating_mean,
            instructor_rating_mean=instructor_rating_mean
        ))

    return evals, details_rows, skipped_entries
        