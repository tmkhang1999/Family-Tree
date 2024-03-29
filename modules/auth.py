import logging

from flask import Blueprint, redirect, request, url_for, session
from flask_login import current_user, login_user, logout_user, login_required
from requests_oauthlib import OAuth2Session

from utils.config import config
from utils.user import User

log = logging.getLogger(__name__)
auth = Blueprint('auth', __name__)

# Credentials from registering a new application
client_id = config['google']['client_id']
client_secret = config['google']['client_secret']

# URLs given in the Google API documentation
authorization_base_url = config['google']['authorization_base_url']
token_url = config['google']['token_url']
user_info_url = config['google']['user_info_url']


@auth.route("/login")
def login():
    # Create a new session
    redirect_uri = request.base_url + "/callback"
    scope = ["openid", "email", "profile"]
    google = OAuth2Session(client_id, scope=scope, redirect_uri=redirect_uri)

    # Redirect user to Google for authorization
    authorization_url, state = google.authorization_url(authorization_base_url,
                                                        access_type="offline", prompt="select_account")
    session['oauth_state'] = state
    return redirect(authorization_url)


@auth.route("/login/callback")
def callback():
    # Fetch the access token
    google = OAuth2Session(client_id, state=session['oauth_state'], redirect_uri=request.base_url)
    google.fetch_token(token_url, client_secret=client_secret, authorization_response=request.url)

    # Check if their email is verified
    user_info = google.get(user_info_url).json()
    if user_info["verified_email"]:
        unique_id = user_info["id"]
        user_email = user_info["email"]
        user_name = user_info["name"]
    else:
        return "User email not available or not verified by Google.", 400

    # Check if this account exists in the database
    if not User.get(unique_id):
        User.create(unique_id, user_name, user_email)

    # Begin user session
    user = User.get(unique_id)
    login_user(user)

    if current_user.is_authenticated:
        return redirect(url_for('main.profile'))
    else:
        return redirect(url_for('main.index'))


@auth.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.index'))
