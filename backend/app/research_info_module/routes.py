from app.research_info_module import blueprint
from app.research_info_module.controller import (
    grants_controller,
    publications_controller
)

@blueprint.route('/grants', methods=['GET'])
def grants():
    return grants_controller()

@blueprint.route('/publications', methods=['GET'])
def publications():
    return publications_controller()

