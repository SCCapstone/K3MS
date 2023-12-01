"""Test Migration

Revision ID: 3707d75090e9
Revises: 
Create Date: 2023-11-18 14:10:17.457016

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3707d75090e9'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('course_data', schema=None) as batch_op:
        batch_op.add_column(sa.Column('crn', sa.String(length=10), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('course_data', schema=None) as batch_op:
        batch_op.drop_column('crn')

    # ### end Alembic commands ###