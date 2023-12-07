from flask import Blueprint

blueprint = Blueprint('login', __name__)

from app.login_module import routes
