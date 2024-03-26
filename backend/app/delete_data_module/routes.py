from flask import request
from flask_login import login_required
from app.delete_data_module import blueprint
from app.delete_data_module.controller import (
    delete_evals_controller,
    delete_all_grants_controller,
    delete_all_pubs_controller,
    delete_all_expens_controller,
    delete_entry_controller,
)

@blueprint.route('/delete_evals', methods=['DELETE'])
@login_required
def delete_evals():
    return delete_evals_controller(request)

@blueprint.route('/delete_all_my_grants', methods=['DELETE'])
@login_required
def delete_all_grants():
    return delete_all_grants_controller(request)

@blueprint.route('/delete_all_my_pubs', methods=['DELETE'])
@login_required
def delete_all_pubs():
    return delete_all_pubs_controller(request)

@blueprint.route('/delete_all_my_expens', methods=['DELETE'])
@login_required
def delete_all_expens():
    return delete_all_expens_controller(request)

@blueprint.route('/delete_entry', methods=['DELETE'])
@login_required
def delete_entry():
    return delete_entry_controller(request)