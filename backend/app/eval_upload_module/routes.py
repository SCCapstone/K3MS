from flask import session, request
from app.eval_upload_module import blueprint
# from app.login_module.controller import (
#     signup_controller,
#     login_controller,
#     logout_controller
# )
from app.eval_upload_module.controller import (
    eval_upload_controller
)

@blueprint.route('/evalupload', methods=['POST'])
def eval_upload():
    return eval_upload_controller(request)


# @blueprint.route('/eval_upload', methods=['POST'])
# def eval_upload():
#     return login_controller(request)
