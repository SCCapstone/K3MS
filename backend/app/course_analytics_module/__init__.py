from flask import Blueprint

blueprint = Blueprint('course_analytics', __name__)

from app.course_analytics_module import routes