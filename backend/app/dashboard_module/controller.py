from app.extensions import db
from app.models import User, Profile # import models
from http import HTTPStatus
from flask_login import current_user

# Define all functions to be called by routes for dashboard page

def dashboard_controller():
    return dict(mssg='dashboard', user=str(current_user)), HTTPStatus.OK