from flask import Blueprint

blueprint = Blueprint('student_evaluations_details', __name__)

from app.student_evals_details_module import routes