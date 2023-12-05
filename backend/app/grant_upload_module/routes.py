from flask import session, request
from app.grant_upload_module import blueprint
# from app.login_module.controller import (
#     signup_controller,
#     login_controller,
#     logout_controller
# )
from app.grant_upload_module.controller import (
    grant_upload_controller
)

@blueprint.route('/grantupload', methods=['POST'])
def grant_upload():
    return grant_upload_controller(request)


# @blueprint.route('/grant_upload', methods=['POST'])
# def grant_upload():
#     return login_controller(request)
