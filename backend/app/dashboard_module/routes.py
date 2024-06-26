from flask_login import login_required
from app.dashboard_module import blueprint
from app.dashboard_module.controller import (
    dashboard_controller
)
from flask import request

# Define all routes that are related to the dashboard page

@blueprint.route('/dashboard', methods=['GET'])
@login_required
def dashboard():
    return dashboard_controller()