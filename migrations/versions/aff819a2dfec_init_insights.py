"""init insights

Revision ID: aff819a2dfec
Revises: 
Create Date: 2025-03-24 15:25:32.047708
"""

from alembic import op
import sqlalchemy as sa
from app.models.db import SCHEMA, environment

# revision identifiers, used by Alembic.
revision = 'aff819a2dfec'
down_revision = None
branch_labels = None
depends_on = None

schema_arg = {'schema': SCHEMA} if environment == "production" else {}

def upgrade():
    if environment == "production":
        op.execute(f"CREATE SCHEMA IF NOT EXISTS {SCHEMA}")

    op.create_table('tags',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('color', sa.String(length=50), nullable=True),
        sa.Column('is_default', sa.Boolean(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name'),
        **schema_arg
    )
    op.create_table('users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('username', sa.String(length=40), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
        sa.UniqueConstraint('username'),
        **schema_arg
    )
    op.create_table('entries',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('body', sa.Text(), nullable=True),
        sa.Column('sentiment', sa.String(length=50), nullable=True),
        sa.Column('weather', sa.String(length=50), nullable=True),
        sa.Column('moon_phase', sa.String(length=50), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['%s.users.id' % SCHEMA if environment == "production" else 'users.id']),
        sa.PrimaryKeyConstraint('id'),
        **schema_arg
    )
    op.create_table('goals',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('status', sa.Enum('in_progress', 'completed', 'on_hold', 'cancelled', name='goalstatus'), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['%s.users.id' % SCHEMA if environment == "production" else 'users.id']),
        sa.PrimaryKeyConstraint('id'),
        **schema_arg
    )
    op.create_table('entry_goals',
        sa.Column('entry_id', sa.Integer(), nullable=False),
        sa.Column('goal_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['entry_id'], ['%s.entries.id' % SCHEMA if environment == "production" else 'entries.id']),
        sa.ForeignKeyConstraint(['goal_id'], ['%s.goals.id' % SCHEMA if environment == "production" else 'goals.id']),
        sa.PrimaryKeyConstraint('entry_id', 'goal_id'),
        **schema_arg
    )
    op.create_table('entry_tags',
        sa.Column('entry_id', sa.Integer(), nullable=False),
        sa.Column('tag_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['entry_id'], ['%s.entries.id' % SCHEMA if environment == "production" else 'entries.id']),
        sa.ForeignKeyConstraint(['tag_id'], ['%s.tags.id' % SCHEMA if environment == "production" else 'tags.id']),
        sa.PrimaryKeyConstraint('entry_id', 'tag_id'),
        **schema_arg
    )
    op.create_table('insights',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('prompt', sa.Text(), nullable=False),
        sa.Column('response', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('entry_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['entry_id'], ['%s.entries.id' % SCHEMA if environment == "production" else 'entries.id']),
        sa.ForeignKeyConstraint(['user_id'], ['%s.users.id' % SCHEMA if environment == "production" else 'users.id']),
        sa.PrimaryKeyConstraint('id'),
        **schema_arg
    )
    op.create_table('milestones',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('milestone_name', sa.String(length=255), nullable=False),
        sa.Column('is_completed', sa.Boolean(), nullable=False),
        sa.Column('goal_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['goal_id'], ['%s.goals.id' % SCHEMA if environment == "production" else 'goals.id']),
        sa.ForeignKeyConstraint(['user_id'], ['%s.users.id' % SCHEMA if environment == "production" else 'users.id']),
        sa.PrimaryKeyConstraint('id'),
        **schema_arg
    )

def downgrade():
    op.drop_table('milestones', **schema_arg)
    op.drop_table('insights', **schema_arg)
    op.drop_table('entry_tags', **schema_arg)
    op.drop_table('entry_goals', **schema_arg)
    op.drop_table('goals', **schema_arg)
    op.drop_table('entries', **schema_arg)
    op.drop_table('users', **schema_arg)
    op.drop_table('tags', **schema_arg)