from flask import Flask
from config import Config
from app.extensions import db, migrate, login_manager
from app.dashboard_module import blueprint as dashboard_bp
from app.login_module import blueprint as login_bp
from app.research_info_module import blueprint as research_info_bp
from app.student_evals_module import blueprint as student_evals_bp
from app.team_assessments_module import blueprint as team_assessments_bp
from app.course_analytics_module import blueprint as course_analytics_bp
from app.grant_upload_module import blueprint as grantupload_bp
from app.pub_upload_module import blueprint as pubupload_bp
from app.expen_upload_module import blueprint as expenupload_bp
from app.account_settings_module import blueprint as account_settings_bp
from app.delete_data_module import blueprint as delete_data_bp
from app.login_module.manager import load_user, unauthorized
from flask_cors import CORS
from http import HTTPStatus

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    @app.route('/')
    def home():
        return dict(mssg='Welcome to the backrooms'), HTTPStatus.OK

    # Enable Cross Origin
    CORS(app, supports_credentials=True)

    # Initialize Flask extensions
    app.secret_key = app.config['SESSION_SECRET_KEY']
    db.init_app(app)
    login_manager.init_app(app)
    migrate.init_app(app, db)

    # Register blueprints
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(login_bp)
    app.register_blueprint(research_info_bp)
    app.register_blueprint(student_evals_bp)
    app.register_blueprint(team_assessments_bp)
    app.register_blueprint(course_analytics_bp)
    app.register_blueprint(grantupload_bp)
    app.register_blueprint(pubupload_bp)
    app.register_blueprint(expenupload_bp)
    app.register_blueprint(account_settings_bp)
    app.register_blueprint(delete_data_bp)

    return app
