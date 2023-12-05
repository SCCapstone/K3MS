from http import HTTPStatus
from app.models import User
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import db
from flask import request
import os

def eval_upload_controller(request):
    try:
        # Check if the request contains a file
        if 'file' not in request.files:
            return dict(error='No file part'), HTTPStatus.BAD_REQUEST

        file = request.files['file']

        # Check if the file is present and has an allowed extension (if needed)
        if file.filename == '':
            return dict(error='No selected file'), HTTPStatus.BAD_REQUEST

        # Save the file to a desired location

        # Specify the folder name where you want to save the file
        folder_name = 'evaluploads'

        # Construct the full path to the specific folder in the same directory
        save_path = os.path.join(os.getcwd(), folder_name, file.filename)

        # Save the file to the specified folder (in this director FOR TESTING)
        file.save(save_path)

        return dict(mssg='Eval File uploaded successfully'), HTTPStatus.OK

    except Exception as e:
        return dict(error=str(e)), HTTPStatus.INTERNAL_SERVER_ERROR

