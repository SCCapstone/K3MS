from flask import Blueprint

blueprint = Blueprint('pubupload', __name__)

from app.pub_upload_module import routes
