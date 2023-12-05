from flask import session, request
from app.pub_upload_module import blueprint

from app.pub_upload_module.controller import (
    pub_upload_controller
)

@blueprint.route('/pubupload', methods=['POST'])
def pub_upload():
    return pub_upload_controller(request)