from flask import Blueprint

blueprint = Blueprint('account_settings', __name__)

from app.account_settings_module import routes