import hashlib
import hmac
import json
import uuid
import pytest
from httpx import AsyncClient
from app.core.config import settings
from app.database.models import WebhookEvent
from sqlalchemy import select

def compute_signature(payload_bytes: bytes, secret: str) -> str:
    """Compute signature matching GitHub webhook signature header."""
    mac = hmac.new(secret.encode("utf-8"), msg=payload_bytes, digestmod=hashlib.sha256)
    return f"sha256={mac.hexdigest()}"

@pytest.mark.asyncio
async def test_github_webhook_success(client: AsyncClient, db_session):
    """Test successful webhook ingestion with valid HMAC signature."""
    workspace_id = str(uuid.uuid4())
    payload = {"ref": "refs/heads/main", "commits": [{"id": "c1", "message": "feat: init"}]}
    payload_bytes = json.dumps(payload).encode("utf-8")
    
    signature = compute_signature(payload_bytes, settings.GITHUB_WEBHOOK_SECRET)
    
    headers = {
        "X-GitHub-Event": "push",
        "X-Hub-Signature-256": signature
    }
    
    response = await client.post(
        f"/api/v1/webhooks/github?workspace_id={workspace_id}",
        content=payload_bytes,
        headers=headers
    )
    
    assert response.status_code == 202
    data = response.json()
    assert data["status"] == "accepted"
    assert "event_id" in data
    
    # Verify database insertion
    event_id = uuid.UUID(data["event_id"])
    stmt = select(WebhookEvent).where(WebhookEvent.id == event_id)
    result = await db_session.execute(stmt)
    event = result.scalar_one_or_none()
    assert event is not None
    assert event.event_type == "push"
    assert event.processed is False
    assert event.payload["ref"] == "refs/heads/main"

@pytest.mark.asyncio
async def test_github_webhook_invalid_signature(client: AsyncClient):
    """Test webhook fails with invalid HMAC signature."""
    workspace_id = str(uuid.uuid4())
    payload = {"ref": "refs/heads/main"}
    payload_bytes = json.dumps(payload).encode("utf-8")
    
    headers = {
        "X-GitHub-Event": "push",
        "X-Hub-Signature-256": "sha256=invalidsignaturevalue"
    }
    
    response = await client.post(
        f"/api/v1/webhooks/github?workspace_id={workspace_id}",
        content=payload_bytes,
        headers=headers
    )
    
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid signature"

@pytest.mark.asyncio
async def test_github_webhook_missing_headers(client: AsyncClient):
    """Test webhook fails if required event header is missing."""
    workspace_id = str(uuid.uuid4())
    payload = {"ref": "refs/heads/main"}
    
    # Missing X-GitHub-Event
    response = await client.post(
        f"/api/v1/webhooks/github?workspace_id={workspace_id}",
        json=payload
    )
    assert response.status_code == 422 # Pydantic/FastAPI validation error for missing header

@pytest.mark.asyncio
async def test_github_webhook_malformed_json(client: AsyncClient):
    """Test webhook fails if payload signature matches but body is not valid JSON."""
    workspace_id = str(uuid.uuid4())
    malformed_body = b"not-valid-json-string"
    
    signature = compute_signature(malformed_body, settings.GITHUB_WEBHOOK_SECRET)
    
    headers = {
        "X-GitHub-Event": "push",
        "X-Hub-Signature-256": signature
    }
    
    response = await client.post(
        f"/api/v1/webhooks/github?workspace_id={workspace_id}",
        content=malformed_body,
        headers=headers
    )
    
    assert response.status_code == 400
    assert response.json()["detail"] == "Malformed JSON payload"
