from __future__ import annotations
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.database.session import get_db
from app.database.repositories.user_repo import UserRepository
from app.database.models import User
from app.api.schemas import TokenPayload

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    """Dependency to retrieve and validate the currently logged-in user from the JWT."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        user_id_str: str = payload.get("sub")
        if user_id_str is None:
            raise credentials_exception
        token_data = TokenPayload(sub=user_id_str)
    except jwt.PyJWTError:
        raise credentials_exception
    user_repo = UserRepository(db)
    from uuid import UUID
    try:
        user_uuid = UUID(token_data.sub)
    except ValueError:
        raise credentials_exception

    user = await user_repo.get_by_id(user_uuid)
    if user is None:
        raise credentials_exception
    return user
