# This file can be ignored, it is just a temporary file to test the frontend

import flask
from app.tmp_module import blueprint
from flask import request
from flask_login import login_required, current_user
from app.models import User


@blueprint.route('/tmp_get_expen', methods=['GET'])
@login_required
def tmp_get_expen():
    email = current_user.email

    # TODO query database for all expenditures with current users email save its columns as json
    expends = [
        dict(title='expen1', calendar_year='2021', reporting_department='csce', pi_name='Johnny Appleseed', amount='1000'),
        dict(title='expen2', calendar_year='2022', reporting_department='csce', pi_name='Johnny Appleseed', amount='2000'),
        dict(title='expen3', calendar_year='2023', reporting_department='csce', pi_name='Johnny Appleseed', amount='3000')
    ]

    return expends, 200