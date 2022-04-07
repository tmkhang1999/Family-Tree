from flask import Blueprint, render_template, request, make_response, jsonify
from flask_login import current_user
from .user import User
import json

main = Blueprint('main', __name__)


@main.route('/')
def index():
    return render_template('index.html')


@main.route('/profile')
def profile():
    tree_ids = json.loads(current_user.tree_ids)
    tree_names = []
    for id in tree_ids:
        name, _ = User.get_tree(id)
        tree_names.append(name)
    tree_keys = [[tree_ids[i], tree_names[i]] for i in range(len(tree_ids))]

    return render_template('profile.html', name=current_user.name, tree_keys=tree_keys)


@main.route("/profile/add", methods=["POST"])
def add_tree():
    req = request.get_json()

    # Add the new tree's ID to the tree_ids array of the current user
    tree_ids = json.loads(current_user.tree_ids)
    tree_ids.append(req[0])

    # Add the new tree to the DB
    User.add_tree(user_id=current_user.id, tree_ids=tree_ids, tree_id=req[0], tree_name=req[1])

    res = make_response(jsonify({"message": "OK"}), 200)
    return res


@main.route("/profile/delete", methods=["POST"])
def delete_tree():
    tree_id = request.get_json()

    # Add the new tree's ID to the tree_ids array of the current user
    tree_ids = json.loads(current_user.tree_ids)
    tree_ids.remove(tree_id)

    # Add the new tree to the DB
    User.delete_tree(user_id=current_user.id, tree_ids=tree_ids, tree_id=tree_id)

    res = make_response(jsonify({"message": "OK"}), 200)
    return res


@main.route("/profile/rename", methods=["POST"])
def rename_tree():
    req = request.get_json()
    User.rename_tree(tree_id=req[0], new_name=req[1])
    res = make_response(jsonify({"message": "OK"}), 200)
    return res
