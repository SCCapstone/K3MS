from flask import request
from app.account_settings_module import blueprint
from flask_login import login_required

from app.account_settings_module.controller import (
    update_password_controller,
    update_profile_picture_controller,
    get_profile_picture_controller,
    delete_profile_picture_controller
)

@blueprint.route('/update_password', methods=['POST'])
@login_required
def update_password():
    return update_password_controller(request)

@blueprint.route('/update_profile_picture', methods=['POST'])
@login_required
def update_profile_picture():
    return update_profile_picture_controller(request)

@blueprint.route('/get_profile_picture', methods=['GET'])
@login_required
def get_profile_picture():
    return get_profile_picture_controller()

@blueprint.route('/delete_profile_picture', methods=['DELETE'])
@login_required
def delete_profile_picture():
    return delete_profile_picture_controller()