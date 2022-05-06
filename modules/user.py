from flask_login import UserMixin, current_user
from .db import Database

db = Database().get()
users = db["users"]
trees = db["trees"]
emails = db["emails"]


class User(UserMixin):
    def __init__(self, id, name, email, tree_ids):
        self.id = id
        self.name = name
        self.email = email
        self.tree_ids = tree_ids

    @staticmethod
    def create(user_id, name, email):
        users.insert(dict(user_id=user_id, name=name, email=email, tree_ids=[]))

    def get(self, user_id: str = None, email: str = None):
        if all(arg is None for arg in (user_id, email)):
            raise ValueError("Expected 1 argument, received 2.")

        if all(arg is not None for arg in (user_id, email)):
            raise ValueError("Expected 1 argument, received 0.")

        if user_id:
            user = users.find_one(user_id=user_id)

        if email:
            user = users.find_one(email=email)

        self.id = user["user_id"]
        self.name = user["name"]
        self.email = user["email"]
        self.tree_ids = user["tree_ids"]
        return self

    @staticmethod
    def add_tree(tree_id, tree_name):
        # Add the new tree's ID to the tree_ids array of the current user
        tree_ids = current_user.tree_ids
        tree_ids.append(tree_id)

        # Update the db
        users.update(dict(user_id=current_user.id, tree_ids=tree_ids), ['user_id'])
        trees.insert(dict(tree_id=tree_id, name=tree_name, status=None, user_emails=[current_user.email], content=dict()))

    @staticmethod
    def get_tree(tree_id):
        tree = trees.find_one(tree_id=tree_id)
        return tree["name"], tree["status"], tree["user_emails"], tree["content"]

    @staticmethod
    def update_tree_status(tree_id, user_id):
        trees.update(dict(tree_id=tree_id, status=user_id), ["tree_id"])

    @staticmethod
    def delete_tree(tree_id):
        tree = trees.find_one(tree_id=tree_id)
        for user_email in tree["user_emails"]:
            user = users.find_one(email=user_email)
            tree_ids = user["tree_ids"]
            tree_ids.remove(tree_id)
            users.update(dict(user_id=user["user_id"], tree_ids=tree_ids), ["user_id"])

        trees.delete(tree_id=tree_id)

    @staticmethod
    def rename_tree(tree_id, new_name):
        trees.update(dict(tree_id=tree_id, name=new_name), ["tree_id"])

    @staticmethod
    def save_tree(tree_id, new_content):
        trees.update(dict(tree_id=tree_id, content=new_content), ["tree_id"])

    @staticmethod
    def add_waiting(tree_id, email):
        emails.insert(dict(tree_id=tree_id, email=email, confirmed=False))

    @staticmethod
    def check_waiting(tree_id, email):
        user = emails.find_one(tree_id=tree_id, email=email)
        return user

    @staticmethod
    def update_collaboration(tree_id, email):
        # prepare the new tree_ids list
        user = users.find_one(email=email)
        tree_ids = user["tree_ids"]
        tree_ids.append(tree_id)

        # prepare the new user_emails list
        tree = trees.find_one(tree_id=tree_id)
        user_emails = tree["user_emails"]
        user_emails.append(email)

        # Update
        users.update(dict(email=email, tree_ids=tree_ids), ["email"])
        trees.update(dict(tree_id=tree_id, user_emails=user_emails), ["tree_id"])
        emails.update(dict(tree_id=tree_id, email=email, confirmed=True), ["tree_id", "email"])
