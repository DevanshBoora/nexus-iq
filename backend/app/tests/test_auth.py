import pytest
from datetime import timedelta
import uuid
from httpx import AsyncClient
from app.core.security import create_access_token

@pytest.mark.asyncio
async def test_register_user(client: AsyncClient):
    """Test successful user registration."""
    payload = {"email": "test@nexusiq.com", "password": "securepassword123"}
    response = await client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@nexusiq.com"
    assert "id" in data
    assert "role" in data

@pytest.mark.asyncio
async def test_register_user_duplicate(client: AsyncClient):
    """Test registration blocks duplicate emails."""
    payload = {"email": "duplicate@nexusiq.com", "password": "securepassword123"}
    # First registration
    response1 = await client.post("/api/v1/auth/register", json=payload)
    assert response1.status_code == 201

    # Second registration
    response2 = await client.post("/api/v1/auth/register", json=payload)
    assert response2.status_code == 400
    assert response2.json()["detail"] == "User with this email already exists"

@pytest.mark.asyncio
async def test_login_user(client: AsyncClient):
    """Test user login returns a valid JWT token."""
    # Register
    payload = {"email": "login@nexusiq.com", "password": "securepassword123"}
    await client.post("/api/v1/auth/register", json=payload)

    # Login
    login_data = {"username": "login@nexusiq.com", "password": "securepassword123"}
    response = await client.post("/api/v1/auth/login", data=login_data)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

@pytest.mark.asyncio
async def test_login_user_invalid(client: AsyncClient):
    """Test login fails with incorrect credentials."""
    login_data = {"username": "wrong@nexusiq.com", "password": "wrongpassword"}
    response = await client.post("/api/v1/auth/login", data=login_data)
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"

@pytest.mark.asyncio
async def test_get_me(client: AsyncClient):
    """Test retrieving current user via Authorization header."""
    # Register
    payload = {"email": "me@nexusiq.com", "password": "securepassword123"}
    await client.post("/api/v1/auth/register", json=payload)

    # Login to get token
    login_data = {"username": "me@nexusiq.com", "password": "securepassword123"}
    login_resp = await client.post("/api/v1/auth/login", data=login_data)
    token = login_resp.json()["access_token"]

    # Call /me
    headers = {"Authorization": f"Bearer {token}"}
    response = await client.get("/api/v1/auth/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "me@nexusiq.com"

@pytest.mark.asyncio
async def test_expired_token(client: AsyncClient):
    """Test accessing routes with an expired token is blocked (401)."""
    expired_token = create_access_token("test-subject", expires_delta=timedelta(minutes=-5))
    headers = {"Authorization": f"Bearer {expired_token}"}
    response = await client.get("/api/v1/auth/me", headers=headers)
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_malformed_token(client: AsyncClient):
    """Test accessing routes with a malformed token string is blocked (401)."""
    headers = {"Authorization": "Bearer malformedjwtstringhere"}
    response = await client.get("/api/v1/auth/me", headers=headers)
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_user_not_found_token(client: AsyncClient):
    """Test token with valid signature but pointing to non-existent user returns 401."""
    random_uuid = str(uuid.uuid4())
    token = create_access_token(random_uuid)
    headers = {"Authorization": f"Bearer {token}"}
    response = await client.get("/api/v1/auth/me", headers=headers)
    assert response.status_code == 401
