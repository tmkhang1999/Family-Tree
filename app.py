import os

from modules import create_app
from utils.config import config
from utils import database

# Set up database
database.Database().setup()

if __name__ == '__main__':
    # Initialize app
    app = create_app()

    # Running
    host, port = config['app']['host'], config['app']['port']
    app.run(debug=True, host=host, port=port, threaded=True)
else:
    gunicorn_app = create_app()
