from __future__ import annotations
import hashlib
import hmac
import json
import logging
from uuid import UUID
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Header, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.database.session import get_db
from app.database.models import WebhookEvent

logger = logging.getLogger("nexus-iq.webhooks")
router = APIRouter()

def verify_signature(payload: bytes, secret: str, signature_header: Optional[str]) -> bool:
    """Verify that the webhook signature matches GitHub's payload HMAC."""
    if not signature_header:
        return False
    if not signature_header.startswith("sha256="):
        return False
    
    sha_name, signature = signature_header.split("=", 1)
    mac = hmac.new(
        secret.encode("utf-8"),
        msg=payload,
        digestmod=hashlib.sha256
    )
    return hmac.compare_digest(mac.hexdigest(), signature)

@router.post("/github", status_code=status.HTTP_202_ACCEPTED)
async def github_webhook(
    workspace_id: UUID,
    request: Request,
    db: AsyncSession = Depends(get_db),
    x_github_event: str = Header(...),
    x_hub_signature_256: Optional[str] = Header(None)
):
    """Secure receiver endpoint for GitHub Webhook events."""
    # 1. Fetch raw payload body bytes (necessary for cryptographic signature verification)
    body = await request.body()
    
    # 2. Cryptographic signature check
    if not verify_signature(body, settings.GITHUB_WEBHOOK_SECRET, x_hub_signature_256):
        logger.warning(f"Failed signature verification for workspace {workspace_id}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid signature"
        )
    
    # 3. Parse JSON payload
    try:
        payload = json.loads(body)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Malformed JSON payload"
        )
        
    # 4. Log event in database (ingested, not yet processed)
    webhook_event = WebhookEvent(
        workspace_id=workspace_id,
        event_type=x_github_event,
        payload=payload,
        processed=False
    )
    db.add(webhook_event)
    await db.commit()
    await db.refresh(webhook_event)
    
    logger.info(f"Ingested GitHub event '{x_github_event}' for workspace {workspace_id}")
    
    # 5. Return 202 Accepted immediately
    return {
        "status": "accepted",
        "event_id": str(webhook_event.id)
    }
