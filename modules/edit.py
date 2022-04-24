import os
import string
import random

from flask import Blueprint, render_template, request, jsonify, make_response
from .user import User
from flask_login import current_user

edit = Blueprint('edit', __name__)


@edit.route('/editTree/<id>')
def edit_tree(id):
    name, content = User.get_tree(id)
    return render_template('edit_tree.html', tree_id=id, tree_name=name, tree_content=content)


@edit.route('/saveTree/<tree_id>', methods=["POST"])
def save_tree(tree_id):
    content = request.get_json()
    User.save_tree(tree_id=tree_id, new_content=content)
    res = make_response(jsonify({"message": "OK"}), 200)
    return res


@edit.route('/saveImage/<tree_id>', methods=["POST"])
def save_image(tree_id):
    file = request.files['image']
    if file:
        file_type = file.filename.split('.')[-1]

        # check user folder
        user_path = os.path.join("static/images/history", current_user.id)
        if not os.path.exists(user_path):
            os.mkdir(user_path)

        # check tree folder
        tree_path = os.path.join(user_path, tree_id)
        if not os.path.exists(tree_path):
            os.mkdir(tree_path)

        # save image
        image_id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
        image_path = os.path.join(tree_path, image_id + "." + file_type)
        file.save(image_path)
    else:
        image_path = None

    res = make_response(jsonify({"message": "OK", "image_path": image_path}), 200)
    return res



