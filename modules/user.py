from flask_login import UserMixin
from .db import Database
import json

class User(UserMixin):
    def __init__(self, id, name, email, tree_ids):
        self.id = id
        self.name = name
        self.email = email
        self.tree_ids = tree_ids

    @staticmethod
    def get(user_id):
        db = Database().get()
        table = db['users']
        user = table.find_one(id=user_id)
        if not user:
            return None

        current_user = User(id=user['id'], name=user['name'], email=user['email'], tree_ids=user['tree_ids'])
        return current_user

    @staticmethod
    def get_tree_by_id(tree_id):
        db = Database().get()
        table = db['trees']
        tree = table.find_one(tree_id=tree_id)
        if not tree:
            return None

        return tree['name'], tree['content']

    # @staticmethod
    # def get_tree_by_name(tree_id):
    #     db = Database().get()
    #     table = db['trees']
    #     tree = table.find(tree_id=tree_id)
    #     if not tree:
    #         return None
    #
    #     return tree['name'], tree['content']

    @staticmethod
    def create(user_id, name, email, tree_ids):
        db = Database().get()
        table = db['users']
        if tree_ids is None:
            tree_ids = json.dumps(list())
        table.insert(dict(id=user_id, name=name, email=email, tree_ids=tree_ids))
        db.commit()
