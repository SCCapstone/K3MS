from flask import Blueprint

blueprint = Blueprint('evalupload', __name__)

from app.eval_upload_module import routes
