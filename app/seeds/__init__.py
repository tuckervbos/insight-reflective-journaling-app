from flask.cli import AppGroup
from .users import seed_users, undo_users
from .goals import seed_goals, undo_goals
from .tags import seed_tags, undo_tags
from .entries import seed_entries, undo_entries
from .milestones import seed_milestones, undo_milestones
from .entry_goals import seed_entry_goals, undo_entry_goals
from .entry_tags import seed_entry_tags, undo_entry_tags

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo 
        # command, which will  truncate all tables prefixed with 
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_users()
        undo_goals()
        undo_tags()
        undo_entries()
        undo_entry_goals()
        undo_entry_tags()
        undo_milestones()
    seed_users()
    seed_goals()
    seed_tags()
    seed_entries()
    seed_entry_goals()
    seed_entry_tags()
    seed_milestones()


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_goals()
    undo_tags()
    undo_entries()
    undo_entry_goals()
    undo_entry_tags()
    undo_milestones()
    # Add other undo functions here
