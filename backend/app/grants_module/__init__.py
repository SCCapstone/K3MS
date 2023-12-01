from flask import Blueprint

blueprint = Blueprint('grants', __name__)

from app.grants_module import routes