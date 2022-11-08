import os
from modules import create_app
from utils.config import config

if __name__ == '__main__':
    app = create_app()
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = "1"
    host, port = config['app']['host'], config['app']['port']
    app.run(debug=True, host=host, port=port, threaded=True)
    # app.run(debug=True, ssl_context="adhoc", threaded=True)
