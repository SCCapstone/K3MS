from flask import session, request
from app.pub_upload_module import blueprint
# from app.login_module.controller import (
#     signup_controller,
#     login_controller,
#     logout_controller
# )
from app.pub_upload_module.controller import (
    pub_upload_controller
)

@blueprint.route('/pubupload', methods=['POST'])
def pub_upload():
    return pub_upload_controller(request)


# @blueprint.route('/pub_upload', methods=['POST'])
# def pub_upload():
#     return login_controller(request)
