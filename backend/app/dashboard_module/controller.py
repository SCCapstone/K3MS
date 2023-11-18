from app.extensions import db
from app.models import User # import models

# Define all functions to be called by routes for dashboard

def home_controller():
    return {'text': 'hello'}, 200
