from app.research_info_module import blueprint
from app.research_info_module.controller import (
    grants_controller,
    publications_controller
)
from flask_login import login_required

@blueprint.route('/grants', methods=['GET'])
@login_required
def grants():
    return grants_controller()

@blueprint.route('/publications', methods=['GET'])
@login_required
def publications():
    return publications_controller()

