from app.grants_module import blueprint
from app.grants_module.controller import grants_controller

@blueprint.route('/grants', methods=['GET'])
def grants():
    return grants_controller()