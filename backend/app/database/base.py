# Import all models so that Base has them registered before Alembic imports it.
from app.database.base_class import Base # noqa
from app.database.models import User, Workspace, WorkspaceMember, Repository, WebhookEvent # noqa
