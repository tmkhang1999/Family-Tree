from flask import Blueprint, render_template, request, jsonify, make_response
from .user import User

edit = Blueprint('edit', __name__)


@edit.route('/editTree/<id>')
def edit_tree(id):
    name, content = User.get_tree(id)
    return render_template('edit_tree.html', tree_id=id, tree_name=name, tree_content=content)


@edit.route('/members/<name>')
def members(name):
    return render_template('members.html', tree_name=name)


@edit.route('/saveTree/<tree_id>', methods=["POST"])
def save_tree(tree_id):
    content = request.get_json()
    User.save_tree(tree_id=tree_id, new_content=content)
    res = make_response(jsonify({"message": "OK"}), 200)
    return res
