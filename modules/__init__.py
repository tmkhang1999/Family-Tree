from flask import Flask
from flask_login import LoginManager
from .db import Database
from config import Config


def create_app():
    # Flask app setup
    app = Flask(__name__, template_folder="../templates", static_folder="../static")
    app.secret_key = Config.SECRET_KEY

    # User session management setup
    login_manager = LoginManager()
    login_manager.init_app(app)

    with app.app_context():
        from .user import User
        from .auth import auth as auth_blueprint
        from .main import main as main_blueprint
        from .edit import edit as edit_blueprint

        # Database setup
        Database().setup()

        @login_manager.user_loader
        def load_user(user_id):
            return User.get(user_id)

        # Add Blueprints
        app.register_blueprint(auth_blueprint)
        app.register_blueprint(main_blueprint)
        app.register_blueprint(edit_blueprint)

    return app
