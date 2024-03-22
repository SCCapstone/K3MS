from app.research_info_module import blueprint
from app.research_info_module.controller import (
    grants_controller,
    limited_grants_controller,
    publications_controller,
    limited_publications_controller,
    expenditures_controller,
    limited_expenditures_controller
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

@blueprint.route('/expenditures', methods=['GET'])
@login_required
def expenditures():
    return expenditures()

@blueprint.route('/limited_expenditures', methods=['GET'])
@login_required
def limited_expenditures():
    return limited_expenditures()



