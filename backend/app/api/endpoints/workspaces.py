from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.database.repositories.workspace_repo import WorkspaceRepository
from app.api.schemas import WorkspaceCreate, WorkspaceResponse
from app.api.deps import get_current_user
from app.database.models import User

router = APIRouter()

@router.post("/", response_model=WorkspaceResponse, status_code=status.HTTP_201_CREATED)
async def create_workspace(
    schema: WorkspaceCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new workspace and assign ownership to the current user."""
    workspace_repo = WorkspaceRepository(db)
    workspace = await workspace_repo.create(schema, owner_id=current_user.id)
    await db.commit()
    await db.refresh(workspace)
    return workspace

@router.get("/", response_model=List[WorkspaceResponse])
async def list_workspaces(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List all workspaces that the current user belongs to."""
    workspace_repo = WorkspaceRepository(db)
    workspaces = await workspace_repo.get_workspaces_for_user(current_user.id)
    return workspaces
