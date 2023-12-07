from flask import Blueprint

blueprint = Blueprint('student_evaluations', __name__)

from app.student_evals_module import routes