import logging
import os
import dataset
from sqlalchemy import create_engine
from sqlalchemy_utils import database_exists, create_database

log = logging.getLogger(__name__)


class Database:
    def __init__(self) -> None:
        self.url = f"sqlite:///{os.path.join(os.path.dirname(os.path.abspath(__file__)), 'sqlite_db')}"

    def get(self) -> dataset.Database:
        """Returns the dataset database object."""
        return dataset.connect(url=self.url)

    def setup(self) -> None:
        """Sets up the tables needed."""
        # Create the database if it doesn't already exist.
        engine = create_engine(self.url)
        if not database_exists(engine.url):
            create_database(engine.url)

        # Open a connection to the database.
        db = self.get()

        # Create user_info table and columns to store the user-related variables as a JSON object.
        if "user" not in db:
            users = db.create_table("user")
            users.create_column("id", db.types.text)
            users.create_column("name", db.types.text)
            users.create_column("email", db.types.text)
            users.create_column("tree_ids", db.types.json)
            log.info("Created missing table: users")

        if "tree" not in db:
            trees = db.create_table("tree")
            trees.create_column("id", db.types.text)
            trees.create_column("name", db.types.text)
            trees.create_column("content", db.types.json)
            log.info("Created missing table: trees")

        db.commit()
        db.close()
