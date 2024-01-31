from app.models.student_evaluations import Evaluations as Eval
from flask_login import current_user
from http import HTTPStatus
from datetime import datetime
from app.extensions import db
from flask import jsonify, current_app
from werkzeug.utils import secure_filename


def eval_upload_controller(request):
    try:
        # Check if the request contains a file
        if 'file' not in request.files:
            return dict(error='No file part'), HTTPStatus.BAD_REQUEST

        file = request.files['file']

        # Check if the file is present and has an allowed extension (if needed)
        if file.filename == '':
            return dict(error='No selected file'), HTTPStatus.BAD_REQUEST

        # Save the file to a desired location

        # Specify the folder name where you want to save the file
        folder_name = 'evaluploads'

        # Construct the full path to the specific folder in the same directory
        save_path = os.path.join(os.getcwd(), folder_name, secure_filename(file.filename))

        # Save the file to the specified folder (in this director FOR TESTING)
        # file.save(save_path) # no need to actually save file and make a mess of the cwd

        return dict(mssg='Eval File uploaded successfully'), HTTPStatus.OK

    except Exception as e:
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

def parse_csv(file):
    df = pd.DataFrame() # read excel from "file"
    df.columns = [c.lower() for c in df.columns]

    # loop through rows
    for i in range(len(df)):
        row = df.iloc[i].to_dict()
        print(row)

        first_name = row['first name']
        last_name = row['last name']
        semester = row['period'].split(' ')[0]
        year = row['period'].split(' ')[-1]
        course = row['course'].split('-')[0]
        instructor_type = row['form of address']
        participants_count = row['participants']
        number_of_returns = row['no. of returns']
        # course_rating_mean = 
        # instructor_rating_mean =

        # Evaluation details
        details_start_idx = 14
        questions = current_app.config['QUESTIONS']
        details_rows = []

        for i,q in enumerate(questions):
            mean = row[f'{questions[str(i+1)]}(mean)']
            std = row[f'{questions[str(i+1)]}(standard deviation)']
            median = row[f'{questions[str(i+1)]}(median)']
            returns = row[f'{questions[str(i+1)]}(returns per question)']
            details_rows.append(dict(question_id=i+1, mean=mean, std=std, median=median, returns=returns, question_text=questions[str(i+1)]))

        email = 'someemail@email.sc.edu' # query db to find match with first and last name