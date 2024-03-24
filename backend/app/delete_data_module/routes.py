from flask import request
from flask_login import login_required
from app.delete_data_module import blueprint
from app.delete_data_module.controller import (
    delete_evals_controller
)

@blueprint.route('/delete_evals', methods=['DELETE'])
@login_required
def delete_evals():
    return delete_evals_controller(request)