"""add section primary keys

Revision ID: 429299e07aee
Revises: 533145b1977c
Create Date: 2024-02-10 12:42:55.940612

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '429299e07aee'
down_revision = '533145b1977c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('evaluation_details', schema=None) as batch_op:
        batch_op.add_column(sa.Column('section', sa.String(length=100), nullable=False))

    with op.batch_alter_table('evaluations', schema=None) as batch_op:
        batch_op.add_column(sa.Column('section', sa.String(length=100), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('evaluations', schema=None) as batch_op:
        batch_op.drop_column('section')

    with op.batch_alter_table('evaluation_details', schema=None) as batch_op:
        batch_op.drop_column('section')

    # ### end Alembic commands ###
