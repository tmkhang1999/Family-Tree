from flask_login import UserMixin
from .db import Database


class User(UserMixin):
    def __init__(self, id, name, email):
        self.id = id
        self.name = name
        self.email = email

    @staticmethod
    def get(user_id):
        db = Database().get()
        table = db['users']
        user = table.find_one(id=user_id)
        if not user:
            return None

        current_user = User(id=user['id'], name=user['name'], email=user['email'])
        return current_user

    @staticmethod
    def create(user_id, name, email):
        db = Database().get()
        table = db['users']
        table.insert(dict(id=user_id, name=name, email=email))
        db.commit()
