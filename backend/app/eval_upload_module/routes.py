from flask import session, request
from app.eval_upload_module import blueprint
from flask_login import login_required

from app.eval_upload_module.controller import (
    eval_upload_controller
)

@blueprint.route('/evalupload', methods=['POST'])
@login_required
def eval_upload():
    return eval_upload_controller(request)
