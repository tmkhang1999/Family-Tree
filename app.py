import os

from modules import create_app
from utils.config import config
from utils import database

if __name__ == '__main__':
    # Set up database
    database.Database().setup()

    # Initialize app
    app = create_app()

    # Running
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = "1"
    host, port = config['app']['host'], config['app']['port']
    app.run(debug=True, host=host, port=port, threaded=True)
