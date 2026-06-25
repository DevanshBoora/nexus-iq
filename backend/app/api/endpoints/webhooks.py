from __future__ import annotations
import json
from uuid import UUID
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.logger import logger, correlation_id_ctx_var
from app.database.session import get_db
from app.database.models import WebhookEvent
from app.integrations.github.adapter import GithubAdapter
from app.core.celery_app import celery_app

router = APIRouter()
github_adapter = GithubAdapter()

@router.post("/github", status_code=status.HTTP_202_ACCEPTED)
async def github_webhook(
    workspace_id: UUID,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Secure receiver endpoint for GitHub Webhook events."""
    body = await request.body()
    
    if not await github_adapter.verify_signature(request, body):
        logger.warning(f"Failed signature verification for workspace {workspace_id}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid signature"
        )
    
    try:
        payload = json.loads(body)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Malformed JSON payload"
        )
        
    event_type = github_adapter.parse_event_type(request)
    normalized = github_adapter.normalize_payload(payload)
    
    webhook_event = WebhookEvent(
        workspace_id=workspace_id,
        event_type=event_type,
        payload=normalized,
        status="PENDING"
    )
    db.add(webhook_event)
    await db.commit()
    await db.refresh(webhook_event)
    
    logger.info(f"Ingested GitHub event '{event_type}' for workspace {workspace_id}")
    
    # Enqueue Celery task with correlation ID
    celery_app.send_task(
        "app.workers.events.process_webhook_event",
        args=[str(webhook_event.id)],
        kwargs={"correlation_id": correlation_id_ctx_var.get()}
    )
    
    return {
        "status": "accepted",
        "event_id": str(webhook_event.id)
    }
