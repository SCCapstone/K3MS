from flask import session, request
from app.expen_upload_module import blueprint
from flask_login import login_required

from app.expen_upload_module.controller import (
    expen_upload_controller
)

@blueprint.route('/expenupload', methods=['POST'])
@login_required
def expen_upload():
    return expen_upload_controller(request)


