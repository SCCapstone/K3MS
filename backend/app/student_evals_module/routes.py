from flask_login import login_required
from flask import request
from app.student_evals_module import blueprint
from app.student_evals_module.controller import (
    eval_upload_controller,
    get_student_evals_controller,
    get_student_evals_details_controller,
    overwrite_evals_rows_controller
)

@blueprint.route('/evalupload', methods=['POST'])
@login_required
def eval_upload():
    return eval_upload_controller(request)

@blueprint.route('/student_evals', methods=['GET'])
@login_required
def get_student_evals():
    return get_student_evals_controller()

@blueprint.route('/student_evals/<user_email>', methods=['GET'])
@login_required
def get_student_evals_by_user(user_email):
    return get_student_evals_controller(user_email=user_email)

@blueprint.route('/student_evals_details/<course_name>', methods=['GET'])
@login_required
def get_student_evals_details(course_name):
    return get_student_evals_details_controller(course_name=course_name)

@blueprint.route('/student_evals_details/<course_name>/<user_email>', methods=['GET'])
@login_required
def get_student_evals_details_by_user(course_name, user_email):
    return get_student_evals_details_controller(course_name=course_name, user_email=user_email)

@blueprint.route('/limited_student_evals', methods=['GET'])
@login_required
def get_limited_student_evals():
    return get_student_evals_controller(limit=True)

@blueprint.route('/overwrite_evals', methods=['POST'])
@login_required
def overwrite_evals_rows():
    return overwrite_evals_rows_controller(request)