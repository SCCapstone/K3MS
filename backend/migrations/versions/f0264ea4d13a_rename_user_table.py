"""rename user table

Revision ID: f0264ea4d13a
Revises: 3707d75090e9
Create Date: 2023-11-18 16:23:24.238386

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f0264ea4d13a'
down_revision = '3707d75090e9'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user',
    sa.Column('username', sa.String(length=64), nullable=False),
    sa.Column('email', sa.String(length=64), nullable=False),
    sa.Column('first_name', sa.String(length=64), nullable=False),
    sa.Column('last_name', sa.String(length=64), nullable=False),
    sa.Column('date_added', sa.DateTime(), nullable=True),
    sa.Column('password_hash', sa.String(length=2000), nullable=True),
    sa.PrimaryKeyConstraint('username'),
    sa.UniqueConstraint('email')
    )
    op.drop_table('user_data')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user_data',
    sa.Column('username', sa.VARCHAR(length=50), nullable=False),
    sa.Column('email', sa.VARCHAR(length=50), nullable=False),
    sa.Column('first_name', sa.VARCHAR(length=50), nullable=False),
    sa.Column('last_name', sa.VARCHAR(length=50), nullable=False),
    sa.Column('date_added', sa.DATETIME(), nullable=True),
    sa.Column('password_hash', sa.VARCHAR(length=2000), nullable=True),
    sa.PrimaryKeyConstraint('username'),
    sa.UniqueConstraint('email')
    )
    op.drop_table('user')
    # ### end Alembic commands ###