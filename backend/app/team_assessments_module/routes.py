from flask_login import login_required
from flask import request
from app.team_assessments_module import blueprint
from app.team_assessments_module.controller import (
    get_team_assessments_controller
)

@blueprint.route('/team_assessments', methods=['GET'])
@login_required
def get_team_assessments():
    return get_team_assessments_controller()
