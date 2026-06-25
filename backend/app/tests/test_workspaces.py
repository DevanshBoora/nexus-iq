import pytest
from httpx import AsyncClient

async def get_auth_headers(client: AsyncClient, email: str) -> dict:
    """Helper to register, login and return headers."""
    payload = {"email": email, "password": "securepassword123"}
    await client.post("/api/v1/auth/register", json=payload)
    
    login_data = {"username": email, "password": "securepassword123"}
    login_resp = await client.post("/api/v1/auth/login", data=login_data)
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.mark.asyncio
async def test_create_workspace(client: AsyncClient):
    """Test creating a workspace with valid authentication."""
    headers = await get_auth_headers(client, "owner@nexusiq.com")
    
    payload = {"name": "My Engineering Workspace"}
    response = await client.post("/api/v1/workspaces/", json=payload, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "My Engineering Workspace"
    assert "id" in data

@pytest.mark.asyncio
async def test_list_workspaces(client: AsyncClient):
    """Test listing workspaces for authenticated user."""
    headers = await get_auth_headers(client, "member@nexusiq.com")
    
    # Initially should be empty
    response = await client.get("/api/v1/workspaces/", headers=headers)
    assert response.status_code == 200
    assert len(response.json()) == 0

    # Create one
    await client.post("/api/v1/workspaces/", json={"name": "Workspace A"}, headers=headers)
    
    # Retrieve again
    response = await client.get("/api/v1/workspaces/", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Workspace A"

@pytest.mark.asyncio
async def test_create_workspace_unauthorized(client: AsyncClient):
    """Test workspace creation is blocked without auth token."""
    response = await client.post("/api/v1/workspaces/", json={"name": "Hack Workspace"})
    assert response.status_code == 401
