import os
import logging

from flask import Flask
from flask_login import LoginManager
from flask_mail import Mail

from utils.database import Database
from utils.config import config
from utils.user import User

log = logging.getLogger(__name__)

# Set up login and mail
login_manager = LoginManager()
mail = Mail()


def create_app():
    # Flask app setup
    app = Flask(__name__, template_folder="../templates", static_folder="../static")
    load_flask_config(app)
    login_manager.init_app(app)
    mail.init_app(app)

    with app.app_context():
        from modules.auth import auth as auth_blueprint
        from modules.main import main as main_blueprint
        from modules.edit import edit as edit_blueprint
        from modules.email import email as email_blueprint

        # Database setup
        Database().setup()

        # History setup
        if not os.path.exists(config['app']['history_path']):
            os.mkdir(config['app']['history_path'])

        @login_manager.user_loader
        def load_user(user_id):
            return User.get(user_id)

        # Add Blueprints
        app.register_blueprint(auth_blueprint)
        app.register_blueprint(main_blueprint)
        app.register_blueprint(edit_blueprint)
        app.register_blueprint(email_blueprint)

    return app


def load_flask_config(app: Flask):
    app.config['SECRET_KEY'] = config['app']['secret_key']
    app.config['MAIL_SERVER'] = config['email']['MAIL_SERVER']
    app.config['MAIL_PORT'] = config['email']['MAIL_PORT']
    app.config['MAIL_USERNAME'] = config['email']['MAIL_USERNAME']
    app.config['MAIL_PASSWORD'] = config['email']['MAIL_PASSWORD']
    app.config['MAIL_USE_TLS'] = config['email']['MAIL_USE_TLS']
    app.config['MAIL_USE_SSL'] = config['email']['MAIL_USE_SSL']
