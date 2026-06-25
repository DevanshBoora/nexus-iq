import json
import uuid
from typing import Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc

from app.database.models import WebhookEvent

class ContextBuilder:
    """
    Constructs the context payloads for the AI Engine.
    Fetches raw events, historical data, and compresses it.
    """
    
    def __init__(self, session: AsyncSession):
        self.session = session
        
    async def build_event_context(self, event_id: str) -> Dict[str, Any]:
        """
        Builds the context dictionary needed for the 'analyze_event_v1' prompt template.
        """
        event_uuid = uuid.UUID(event_id)
        result = await self.session.execute(
            select(WebhookEvent).where(WebhookEvent.id == event_uuid)
        )
        event = result.scalar_one_or_none()
        
        if not event:
            raise ValueError(f"Event {event_id} not found for context building.")
            
        # Fetch last 3 events in this workspace as historical context (simplified RAG stub)
        hist_result = await self.session.execute(
            select(WebhookEvent)
            .where(WebhookEvent.workspace_id == event.workspace_id)
            .where(WebhookEvent.id != event.id)
            .order_by(desc(WebhookEvent.created_at))
            .limit(3)
        )
        recent_events = hist_result.scalars().all()
        
        historical_context = "Recent events in workspace:\n"
        for idx, re in enumerate(recent_events):
            historical_context += f"- {re.created_at}: {re.event_type}\n"
            
        if not recent_events:
            historical_context = "No recent events found."

        # Strip sensitive or massive fields from payload if necessary
        # For now, we serialize it safely.
        safe_payload = json.dumps(event.payload, indent=2)

        return {
            "event_type": event.event_type,
            "workspace_id": str(event.workspace_id),
            "payload": safe_payload,
            "historical_context": historical_context
        }
