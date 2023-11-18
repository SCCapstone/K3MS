from flask import session, request
from app.login_module import blueprint
from app.login_module.controller import (
    signup
)

@blueprint.route('/signup', methods=['POST'])
def signup():
    signup(request)

@blueprint.route('/login')
def login():
    # login_user(remember=True)
    # session['logged_in'] = True
    return 'You are logged in'