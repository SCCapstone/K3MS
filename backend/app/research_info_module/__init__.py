from flask import Blueprint

blueprint = Blueprint('research_info', __name__)

from app.research_info_module import routes