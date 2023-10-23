from flask import Blueprint

blueprint = Blueprint('dashboard', __name__)

from app.dashboard import routes
