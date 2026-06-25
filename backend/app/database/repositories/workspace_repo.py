from __future__ import annotations
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.models import Workspace, WorkspaceMember
from app.api.schemas import WorkspaceCreate

class WorkspaceRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, workspace_id: UUID) -> Workspace | None:
        """Fetch workspace by ID."""
        stmt = select(Workspace).where(Workspace.id == workspace_id)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def create(self, schema: WorkspaceCreate, owner_id: UUID) -> Workspace:
        """Create a workspace and associate it with the owner user."""
        workspace = Workspace(name=schema.name)
        self.db.add(workspace)
        await self.db.flush() # Populate ID

        member = WorkspaceMember(
            user_id=owner_id,
            workspace_id=workspace.id,
            role="OWNER"
        )
        self.db.add(member)
        await self.db.flush()
        return workspace

    async def get_workspaces_for_user(self, user_id: UUID) -> list[Workspace]:
        """Fetch all workspaces that a user belongs to."""
        stmt = (
            select(Workspace)
            .join(WorkspaceMember, WorkspaceMember.workspace_id == Workspace.id)
            .where(WorkspaceMember.user_id == user_id)
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())
