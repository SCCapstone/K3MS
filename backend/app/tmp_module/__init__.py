from flask import Blueprint

blueprint = Blueprint('tmp', __name__)

from app.tmp_module import routes
