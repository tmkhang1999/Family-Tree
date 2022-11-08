import os
import logging

from flask import Blueprint, render_template, request, make_response, jsonify
from flask_login import current_user, login_required

from utils.user import User
from utils.config import config

log = logging.getLogger(__name__)
main = Blueprint('main', __name__)


@main.route('/')
def index():
    return render_template('index.html')


@main.route('/profile')
@login_required
def profile():
    tree_ids = current_user.tree_ids
    tree_keys = []
    for id in tree_ids:
        name, _, user_emails, _ = User.get_tree(id)
        user_emails.remove(current_user.email)
        tree_keys.append([id, name, user_emails])

    return render_template('profile.html', name=current_user.name, tree_keys=tree_keys)


@main.route("/profile/add", methods=["POST"])
@login_required
def add_tree():
    req = request.get_json()
    User.add_tree(tree_id=req[0], tree_name=req[1])

    # check user folder
    user_path = os.path.join("static/images/history", current_user.id)
    if not os.path.exists(user_path):
        os.mkdir(user_path)

    # check tree folder
    tree_path = os.path.join(user_path, req[0])
    if not os.path.exists(tree_path):
        os.mkdir(tree_path)

    res = make_response(jsonify({"message": "OK"}), 200)
    return res


@main.route("/profile/rename", methods=["POST"])
@login_required
def rename_tree():
    req = request.get_json()
    User.rename_tree(tree_id=req[0], new_name=req[1])
    res = make_response(jsonify({"message": "OK"}), 200)
    return res


@main.route("/profile/delete", methods=["POST"])
@login_required
def delete_tree():
    tree_id = request.get_json()
    User.delete_tree(tree_id=tree_id)
    os.rmdir(os.path.join(config['app']["history_path"], current_user.id, tree_id))

    res = make_response(jsonify({"message": "OK"}), 200)
    return res