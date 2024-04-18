from flask import session, request
from flask_login import login_required, current_user
from app.login_module import blueprint
from app.login_module.controller import (
    login_controller,
    logout_controller,
    check_auth_controller,
    delete_user_controller,
    update_user_controller,
    create_user_controller,
    set_password_controller,
    manual_create_user_controller,
    reset_password_email_controller,
    reset_password_controller
)

@blueprint.route('/signup', methods=['POST'])
@login_required
def signup():
    return create_user_controller(request)

@blueprint.route('/manual_signup', methods=['POST'])
@login_required
def manual_signup():
    return manual_create_user_controller(request)

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

@blueprint.route('/set_password', methods=['POST'])
def set_password():
    return set_password_controller(request)

@blueprint.route('/reset_password_email', methods=['POST'])
def reset_password_email():
    return reset_password_email_controller(request)

@blueprint.route('/reset_password', methods=['POST'])
def reset_password():
    return reset_password_controller(request)