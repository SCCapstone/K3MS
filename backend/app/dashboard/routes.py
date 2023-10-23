from app.dashboard import blueprint
from app.dashboard.controller import (
    home_controller
)
from flask import request

# Define all routes that are related to the dashboard page

@blueprint.route('/', methods=['GET'])
def home():
    return home_controller()
