from flask import Blueprint

blueprint = Blueprint('grantupload', __name__)

from app.grant_upload_module import routes
