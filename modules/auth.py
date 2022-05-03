import json
import requests
from flask import Blueprint, redirect, request, url_for
from flask_login import current_user, login_user, logout_user, login_required
from oauthlib.oauth2 import WebApplicationClient
from .user import User
from config import Config

auth = Blueprint('auth', __name__)

# Configuration
client = WebApplicationClient(Config.GOOGLE_CLIENT_ID)


def get_google_provider_cfg():
    return requests.get(Config.GOOGLE_DISCOVERY_URI).json()


@auth.route("/login")
def login():
    # URL for Google login
    google_provider_cfg = get_google_provider_cfg()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]

    # the request for Google login
    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=request.base_url + "/callback",
        scope=["openid", "email", "profile"],
    )
    return redirect(request_uri)


@auth.route("/login/callback")
def callback():
    # Get authorization code from Google
    code = request.args.get("code")

    # URL to get tokens
    google_provider_cfg = get_google_provider_cfg()
    token_endpoint = google_provider_cfg["token_endpoint"]

    # Prepare and send a request to get tokens
    token_url, headers, body = client.prepare_token_request(
        token_endpoint,
        authorization_response=request.url,
        redirect_url=request.base_url,
        code=code
    )
    token_response = requests.post(
        token_url,
        headers=headers,
        data=body,
        auth=(Config.GOOGLE_CLIENT_ID, Config.GOOGLE_CLIENT_SECRET),
    )

    # Parse the tokens
    client.parse_request_body_response(json.dumps(token_response.json()))

    # Getting the user's profile information
    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = client.add_token(userinfo_endpoint)
    userinfo_response = requests.get(uri, headers=headers, data=body)

    # Check if their email is verified
    if userinfo_response.json().get("email_verified"):
        unique_id = userinfo_response.json()["sub"]
        users_email = userinfo_response.json()["email"]
        users_name = userinfo_response.json()["given_name"]
    else:
        return "User email not available or not verified by Google.", 400

    # Check if this account is in the database
    if not User.get(unique_id):
        User.create(unique_id, users_name, users_email)

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
