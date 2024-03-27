from flask import Blueprint

blueprint = Blueprint('deletedata', __name__)

from app.delete_data_module import routes
