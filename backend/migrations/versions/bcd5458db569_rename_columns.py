"""rename columns'


Revision ID: bcd5458db569
Revises: dbe5a5b4f78a
Create Date: 2023-12-02 15:00:48.112238

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bcd5458db569'
down_revision = 'dbe5a5b4f78a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('evaluation_details', schema=None) as batch_op:
        batch_op.add_column(sa.Column('question_id', sa.Integer(), nullable=False))
        batch_op.drop_column('questionId')

    with op.batch_alter_table('evaluation_questions', schema=None) as batch_op:
        batch_op.add_column(sa.Column('question_id', sa.Integer(), autoincrement=True, nullable=False))
        batch_op.add_column(sa.Column('question_text', sa.String(length=500), nullable=False))
        batch_op.drop_column('questionId')
        batch_op.drop_column('questionText')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('evaluation_questions', schema=None) as batch_op:
        batch_op.add_column(sa.Column('questionText', sa.VARCHAR(length=500), nullable=False))
        batch_op.add_column(sa.Column('questionId', sa.INTEGER(), nullable=False))
        batch_op.drop_column('question_text')
        batch_op.drop_column('question_id')

    with op.batch_alter_table('evaluation_details', schema=None) as batch_op:
        batch_op.add_column(sa.Column('questionId', sa.INTEGER(), nullable=False))
        batch_op.drop_column('question_id')

    # ### end Alembic commands ###