from flask_login import login_required
from app.student_evals_module import blueprint
from app.student_evals_module.controller import (
    eval_upload_controller,
    get_student_evals_controller,
    get_student_eval_details_controller
)

@blueprint.route('/student_evals', methods=['POST'])
@login_required
def eval_upload():
    return eval_upload_controller(request)

@blueprint.route('/student_evals', methods=['GET'])
@login_required
def get_student_evals():
    return get_student_evals_controller()

@blueprint.route('/student_evals/<course>/<year>/<semester>', methods=['GET'])
@login_required
def get_student_eval_details(course, year, semester):
    return get_student_eval_details_controller(course, year, semester)