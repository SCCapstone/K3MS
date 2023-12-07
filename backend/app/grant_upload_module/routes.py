from flask import session, request
from app.grant_upload_module import blueprint
from flask_login import login_required

from app.grant_upload_module.controller import (
    grant_upload_controller
)

@blueprint.route('/grantupload', methods=['POST'])
@login_required
def grant_upload():
    return grant_upload_controller(request)
