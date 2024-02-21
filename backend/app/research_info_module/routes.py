from app.research_info_module import blueprint
from app.research_info_module.controller import (
    grants_controller,
    limited_grants_controller,
    publications_controller,
    limited_publications_controller
)
from flask_login import login_required

@blueprint.route('/grants', methods=['GET'])
@login_required
def grants():
    return grants_controller()

@blueprint.route('/limited_grants', methods=['GET'])
@login_required
def limited_grants():
    return limited_grants_controller()

@blueprint.route('/publications', methods=['GET'])
@login_required
def publications():
    return publications_controller()

@blueprint.route('/limited_publications', methods=['GET'])
@login_required
def limited_publications():
    return limited_publications_controller()



