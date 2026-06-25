from __future__ import annotations
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.models import User
from app.api.schemas import UserCreate
from app.core.security import get_password_hash

class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_email(self, email: str) -> User | None:
        """Fetch user by email using async select query."""
        stmt = select(User).where(User.email == email)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_id(self, user_id: UUID) -> User | None:
        """Fetch user by ID."""
        stmt = select(User).where(User.id == user_id)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def create(self, schema: UserCreate) -> User:
        """Hash password and persist a new User."""
        db_user = User(
            email=schema.email,
            hashed_password=get_password_hash(schema.password),
            role="DEVELOPER"
        )
        self.db.add(db_user)
        await self.db.flush() # flush commits locally to get auto-generated IDs before commit
        return db_user
