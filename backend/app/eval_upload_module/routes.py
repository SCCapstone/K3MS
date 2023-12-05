from flask import session, request
from app.eval_upload_module import blueprint

from app.eval_upload_module.controller import (
    eval_upload_controller
)

@blueprint.route('/evalupload', methods=['POST'])
def eval_upload():
    return eval_upload_controller(request)
