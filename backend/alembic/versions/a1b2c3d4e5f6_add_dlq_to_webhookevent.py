"""Add DLQ state to WebhookEvent

Revision ID: a1b2c3d4e5f6
Revises: e3d7494532b2
Create Date: 2026-06-25 16:42:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'a1b2c3d4e5f6'
down_revision = 'e3d7494532b2'
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Drop the old 'processed' column
    op.drop_column('webhook_event', 'processed')
    
    # Add new DLQ and retry columns
    op.add_column('webhook_event', sa.Column('status', sa.String(length=50), server_default='PENDING', nullable=False))
    op.add_column('webhook_event', sa.Column('retry_count', sa.Integer(), server_default='0', nullable=False))
    op.add_column('webhook_event', sa.Column('processed_at', sa.DateTime(), nullable=True))
    op.add_column('webhook_event', sa.Column('last_retry_at', sa.DateTime(), nullable=True))
    op.add_column('webhook_event', sa.Column('error_message', sa.String(length=4000), nullable=True))
    
    # Create new index for status
    op.create_index('idx_webhook_event_status', 'webhook_event', ['status'], unique=False)

def downgrade() -> None:
    # Drop new columns
    op.drop_index('idx_webhook_event_status', table_name='webhook_event')
    op.drop_column('webhook_event', 'error_message')
    op.drop_column('webhook_event', 'last_retry_at')
    op.drop_column('webhook_event', 'processed_at')
    op.drop_column('webhook_event', 'retry_count')
    op.drop_column('webhook_event', 'status')
    
    # Re-add 'processed' column
    op.add_column('webhook_event', sa.Column('processed', sa.BOOLEAN(), autoincrement=False, nullable=False, server_default='false'))
