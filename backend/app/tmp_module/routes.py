import flask
from app.tmp_module import blueprint
from flask import request
from flask_login import login_required, current_user
from app.models import User

@blueprint.route('/tmp_get_grants', methods=['GET'])
@login_required
def tmp():
    email = current_user.email

    # TODO query database for all grants with current users email save its columns as json
    grants = [
        dict(title='grant1', amount='100000', grant_year='2021'),
        dict(title='grant2', amount='200000', grant_year='2022'),
        dict(title='grant3', amount='300000', grant_year='2023'),
    ]

    return grants, 200
