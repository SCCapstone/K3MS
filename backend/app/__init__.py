from flask import Flask
from config import Config
from app.extensions import db, migrate, login_manager
from app.dashboard_module import blueprint as dashboard_bp
from app.login_module import blueprint as login_bp
from app.login_module.manager import load_user, unauthorized
from flask_cors import CORS

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

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

    return app
