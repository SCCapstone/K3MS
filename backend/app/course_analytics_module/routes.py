from flask_login import login_required
from app.course_analytics_module import blueprint
from app.course_analytics_module.controller import (
    get_course_analytics_controller,
    get_courses_for_user_controller,
    get_all_courses_in_db_controller,
    get_users_in_chairs_dept_controller
)

@blueprint.route('/course_analytics/<course_name>/<period>', methods=['GET'])
@login_required
def get_course_analytics(course_name, period):
    return get_course_analytics_controller(course_name, period)

@blueprint.route('/get_courses_for_user/<user_email>', methods=['GET'])
@login_required
def get_courses_for_user(user_email):
    return get_courses_for_user_controller(user_email)

@blueprint.route('/get_all_courses_in_db', methods=['GET'])
@login_required
def get_all_courses_in_db():
    return get_all_courses_in_db_controller()

@blueprint.route('/get_users_in_chairs_dept', methods=['GET'])
@login_required
def get_users_in_chairs_dept():
    return get_users_in_chairs_dept_controller()