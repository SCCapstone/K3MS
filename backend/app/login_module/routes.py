from flask import session, request
from flask_login import login_required, current_user
from app.login_module import blueprint
from app.login_module.controller import (
    signup_controller,
    login_controller,
    logout_controller,
    check_auth_controller,
    delete_user_controller,
    update_user_controller
)

@blueprint.route('/signup', methods=['POST'])
@login_required
def signup():
    return signup_controller(request)

@blueprint.route('/login', methods=['POST'])
def login():
    return login_controller(request)

@blueprint.route('/logout', methods=['GET'])
@login_required
def logout():
    return logout_controller()

@blueprint.route('/delete_user', methods=['DELETE'])
@login_required
def delete_user():
    return delete_user_controller(request)

@blueprint.route('/update_user', methods=['PATCH'])
@login_required
def update_user():
    return update_user_controller(request)

@blueprint.route('/check_auth', methods=['GET'])
@login_required
def check_auth():
    return check_auth_controller()