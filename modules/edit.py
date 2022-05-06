import os
from flask import Blueprint, render_template, request, jsonify, make_response, redirect, url_for, flash
from flask_login import current_user, login_required
from .user import User

edit = Blueprint('edit', __name__)


@edit.route('/status_profile/<tree_id>')
@login_required
def status_profile(tree_id):
    User.update_tree_status(tree_id, None)
    return redirect(url_for('main.profile'))


@edit.route('/editTree/<tree_id>')
@login_required
def edit_tree(tree_id):
    name, status, _, content = User.get_tree(tree_id)
    if not status:
        User.update_tree_status(tree_id, current_user.id)
        return render_template('edit_tree.html', tree_id=tree_id, tree_name=name, tree_content=content)
    elif status == current_user.id:
        return render_template('edit_tree.html', tree_id=tree_id, tree_name=name, tree_content=content)
    elif status != current_user.id:
        flash('Someone is editing this tree. Please come back later', 'alert-warning')
        return redirect(url_for('main.profile'))


@edit.route('/help_page')
@login_required
def help_page():
    return render_template('help_page.html')


@edit.route('/saveTree/<tree_id>', methods=["POST"])
@login_required
def save_tree(tree_id):
    content = request.get_json()
    User.save_tree(tree_id=tree_id, new_content=content)
    res = make_response(jsonify({"message": "OK"}), 200)
    return res


@edit.route('/saveImage/<tree_id>/<member_id>', methods=["POST"])
@login_required
def save_image(tree_id, member_id):
    file = request.files['image']
    tree_path = os.path.join("static/images/history", current_user.id, tree_id)

    if file:
        file_type = file.filename.split('.')[-1]
        image_path = os.path.join(tree_path, member_id + "." + file_type)
        file.save(image_path)
    else:
        image_path = check_exist(tree_path, member_id)

    res = make_response(jsonify({"message": "OK", "image_path": image_path}), 200)
    return res


def check_exist(folder, name):
    for file in os.listdir(folder):
        if name.split(".")[1] == file.split(".")[1]:
            return os.path.join(folder, file)
    return None