import logging
from os import path
from pyaml_env import parse_config

log = logging.getLogger(__name__)

config_path = path.join(path.dirname(path.dirname(__file__)), "config.yml")
if not path.isfile(config_path):
    log.error("Unable to load config.yml, exiting...")
    raise SystemExit

config = parse_config(config_path)
