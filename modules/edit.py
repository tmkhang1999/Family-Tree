from flask import Blueprint, render_template

edit = Blueprint('edit', __name__)


@edit.route('/editTree/<name>')
def edit_tree(name):
    return render_template('edit_tree.html', name_tree=name)


@edit.route('/members/<name>')
def members(name):
    return render_template('members.html', name_tree=name)


