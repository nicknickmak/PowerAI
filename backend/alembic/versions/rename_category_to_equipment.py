"""Rename 'category' column to 'equipment' in exercises table

Revision ID: 'rename_category_to_equipment'
Revises: '0eb08a90408b'
Create Date: 2025-09-07
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'rename_category_to_equipment'
down_revision = '0eb08a90408b'
branch_labels = None
depends_on = None

def upgrade():
    op.alter_column('exercises', 'category', new_column_name='equipment', existing_type=sa.String())

def downgrade():
    op.alter_column('exercises', 'equipment', new_column_name='category', existing_type=sa.String())
