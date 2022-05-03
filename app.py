from modules import create_app
import os

if __name__ == '__main__':
    app = create_app()
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = "1"
    # app.run(debug=True, host="0.0.0.0", port=5000, threaded=True)
    app.run(debug=True, ssl_context="adhoc", threaded=True)
