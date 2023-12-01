"""added position to user model

Revision ID: 06a4e316efb8
Revises: b74792695b29
Create Date: 2023-12-01 18:09:03.905548

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '06a4e316efb8'
down_revision = 'b74792695b29'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('position', sa.String(length=64), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('position')

    # ### end Alembic commands ###
