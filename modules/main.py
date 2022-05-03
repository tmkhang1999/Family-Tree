from flask import Blueprint, render_template, request, make_response, jsonify, redirect, url_for
from flask_login import current_user, login_required

from .user import User

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

    res = make_response(jsonify({"message": "OK"}), 200)
    return res