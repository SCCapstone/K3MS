from flask_login import login_required
from app.course_analytics_module import blueprint
from app.course_analytics_module.controller import (
    get_course_analytics_controller
)

@blueprint.route('/course_analytics', methods=['GET'])
@login_required
def get_course_analytics():
    return get_course_analytics_controller()