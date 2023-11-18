from flask import Flask
from config import Config
from app.extensions import db, migrate, login_manager
from app.dashboard_module import blueprint as dashboard_bp
from flask_cors import CORS, cross_origin

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Enable Cross Origin
    cors = CORS(app)
    app.config['CORS_HEADERS'] = 'Content-Type'

    # Initialize Flask extensions
    app.secret_key = app.config['SESSION_SECRET_KEY']
    db.init_app(app)
    login_manager.init_app(app)
    migrate.init_app(app, db)

    # Register blueprints
    app.register_blueprint(dashboard_bp)

    return app
