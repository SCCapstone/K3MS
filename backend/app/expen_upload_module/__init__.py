from flask import Blueprint

blueprint = Blueprint('expenupload', __name__)

from app.expen_upload_module import routes
