import logging
import dataset

from sqlalchemy import create_engine
from sqlalchemy_utils import database_exists, create_database

from utils.config import config
import os

log = logging.getLogger(__name__)


class Database:
    def __init__(self) -> None:
        self.host = config["database"]["host"]
        self.database = config["database"]["database"]
        self.user = config["database"]["user"]
        self.password = config["database"]["password"]

        if not all([self.host, self.database, self.user, self.password]):
            log.error("One or more database variables are missing, exiting...")
            raise SystemExit

        self.url = f"mysql://{self.user}:{self.password}@{self.host}/{self.database}"

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

        # Create tables and columns to store the user-related variables as a JSON object.
        if "users" not in db:
            users = db.create_table("users")
            users.create_column("user_id", db.types.text)
            users.create_column("name", db.types.text)
            users.create_column("email", db.types.text)
            users.create_column("tree_ids", db.types.json)
            log.info("Created missing table: users")

        if "trees" not in db:
            trees = db.create_table("trees")
            trees.create_column("tree_id", db.types.text)
            trees.create_column("name", db.types.text)
            trees.create_column("status", db.types.text)
            trees.create_column("user_emails", db.types.json)
            trees.create_column("content", db.types.json)
            log.info("Created missing table: trees")

        if "emails" not in db:
            emails = db.create_table("emails")
            emails.create_column("tree_id", db.types.text)
            emails.create_column("email", db.types.text)
            emails.create_column("confirmed", db.types.boolean)
            log.info("Created missing table: emails")

        # Commit the changes to the database and close the connection.
        db.commit()
        db.close()
