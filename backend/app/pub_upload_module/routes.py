from flask import session, request
from app.pub_upload_module import blueprint
from flask_login import login_required

from app.pub_upload_module.controller import (
    pub_upload_controller
)

@blueprint.route('/pubupload', methods=['POST'])
@login_required
def pub_upload():
    return pub_upload_controller(request)