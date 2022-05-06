from config import Config
from flask import Blueprint, flash, redirect, url_for, render_template, request, make_response, jsonify
from flask_login import login_required, current_user
from flask_mail import Message
from itsdangerous import URLSafeTimedSerializer
from . import mail
from .user import User

email = Blueprint("email", __name__)


@email.route("/send_email", methods=["POST"])
@login_required
def send_email():
    req = request.get_json()
    tree_id, receiver_email = req[0], req[1]

    # check if email in the system
    if not User.get(receiver_email):
        res = make_response(jsonify({"message": "Sorry! This email does not exist in our application"}), 200)
        return res

    # check if this user owns this tree
    _, _, user_emails, _ = User.get_tree(tree_id)
    if receiver_email in user_emails:
        res = make_response(jsonify({"message": "Sorry! This user already owns this tree"}), 200)
        return res

    # check if this user has been invited to collaborate on this tree
    if User.check_waiting(tree_id, receiver_email):
        res = make_response(jsonify({"message": "Sorry! This user has been already invited to collaborate on this tree"}), 200)
        return res

    # convert tree id and receiver email into tokens
    tree_token = generate_confirmation_token(tree_id)
    email_token = generate_confirmation_token(receiver_email)

    # sending
    confirm_url = url_for("email.confirm_email", tree_token=tree_token, email_token=email_token, _external=True)
    html = render_template("invitation.html", confirm_url=confirm_url)
    subject = f"Collaboration Invitation from {current_user.name}"
    sending(receiver=receiver_email, subject=subject, template=html)

    # add waiting
    User.add_waiting(tree_id=tree_id, email=receiver_email)

    res = make_response(jsonify({"message": "OK"}), 200)
    return res


@email.route("/confirm/<tree_token>/<email_token>")
def confirm_email(tree_token, email_token):
    tree_id = confirm_token(tree_token)
    receiver_email = confirm_token(email_token)
    if not receiver_email:
        flash("The invitation link is invalid or has expired.", "alert-danger")

    user = User.check_waiting(tree_id=tree_id, email=receiver_email)
    if user["confirmed"]:
        flash("You have already accepted the invitation to collaborate. Please login.", "alert-primary")
    else:
        User.update_collaboration(tree_id, receiver_email)
        flash("You have accepted the invitation. Thanks!", "alert-success")
    return redirect(url_for("main.index"))


def generate_confirmation_token(content):
    serializer = URLSafeTimedSerializer(Config.SECRET_KEY)
    return serializer.dumps(content, salt=Config.SECURITY_PASSWORD_SALT)


def confirm_token(token, expiration=3600):
    serializer = URLSafeTimedSerializer(Config.SECRET_KEY)
    content = serializer.loads(
        token,
        salt=Config.SECURITY_PASSWORD_SALT,
        max_age=expiration
    )

    if not content:
        return False

    return content


def sending(receiver, subject, template):
    msg = Message(
        recipients=[receiver],
        subject=subject,
        html=template,
    )
    mail.send(msg)
