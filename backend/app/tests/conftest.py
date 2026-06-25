from typing import AsyncGenerator
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.main import app
from app.database.session import get_db
from app.database.base_class import Base
from unittest.mock import patch

# Setup in-memory SQLite database for fast, isolated test runs
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

engine = create_async_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = async_sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
    class_=AsyncSession
)

@pytest_asyncio.fixture(scope="session", autouse=True)
def mock_celery_send_task():
    with patch("app.api.endpoints.webhooks.celery_app.send_task") as mock_send_task:
        yield mock_send_task

@pytest_asyncio.fixture(scope="function", autouse=True)
async def init_db():
    """Create tables before each test and drop them after."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest_asyncio.fixture(scope="function")
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """Provide a clean database session for test verification."""
    async with TestingSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

@pytest_asyncio.fixture(scope="function")
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """Provide an HTTPX async client with overridden database dependency."""
    async def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    
    # Use ASGITransport as recommended in modern httpx versions
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac
        
    app.dependency_overrides.clear()
