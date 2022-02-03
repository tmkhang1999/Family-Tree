from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

db = SQLAlchemy()


def create_app():
    app = Flask(__name__, template_folder="../templates")

    # App Configuration
    app.config.from_object('config.Config')

    # Initialize Plugins
    db.init_app(app)

    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)

    with app.app_context():
        from .models import User
        from .auth import auth as auth_blueprint
        from .main import main as main_blueprint

        @login_manager.user_loader
        def load_user(user_id):
            # since the user_id is just the primary key of our user table, use it in the query for the user
            return User.query.get(int(user_id))

        # Add Blueprints
        app.register_blueprint(auth_blueprint)
        app.register_blueprint(main_blueprint)

        # Create database
        db.create_all()

    return app
