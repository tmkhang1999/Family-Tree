import os
import logging

from flask import Flask
from flask_login import LoginManager
from flask_mail import Mail

from modules.db import Database
from utils.config import config

log = logging.getLogger(__name__)

# Set up login and mail
login_manager = LoginManager()
mail = Mail()


def create_app():
    # Flask app setup
    app = Flask(__name__, template_folder="../templates", static_folder="../static")
    app.config.from_object(config)
    login_manager.init_app(app)
    mail.init_app(app)

    with app.app_context():
        from .user import User
        from .auth import auth as auth_blueprint
        from .main import main as main_blueprint
        from .edit import edit as edit_blueprint
        from .email import email as email_blueprint

        # Database setup
        Database().setup()

        # History setup
        history_path = "./static/images/history"
        if not os.path.exists(history_path):
            os.mkdir(history_path)

        @login_manager.user_loader
        def load_user(user_id):
            return User.get(user_id)

        # Add Blueprints
        app.register_blueprint(auth_blueprint)
        app.register_blueprint(main_blueprint)
        app.register_blueprint(edit_blueprint)
        app.register_blueprint(email_blueprint)

    return app
