from flask import request
from flask_login import login_required
from app.student_evals_details_module import blueprint
from app.student_evals_details_module.controller import (
    get_student_evals_details_controller
)

@blueprint.route('/student_evals_details/<course_name>', methods=['GET'])
@login_required
def get_student_evals_details(course_name):

    # Get the 'course_name' parameter from the URL query string
    # course_name = request.args.get('course_name')

    return get_student_evals_details_controller(course_name=course_name)