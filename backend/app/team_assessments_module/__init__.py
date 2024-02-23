from flask import Blueprint

blueprint = Blueprint('team_assessments', __name__)

from app.team_assessments_module import routes