from flask import session, request
from app.login_module import blueprint
from app.login_module.controller import (
    signup_controller,
    login_controller
)

@blueprint.route('/signup', methods=['POST'])
def signup():
    return signup_controller(request)

@blueprint.route('/login', methods=['POST'])
def login():
    return login_controller(request)