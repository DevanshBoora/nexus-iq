import asyncio
import traceback
from datetime import datetime
import uuid
from celery.exceptions import Ignore
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.celery_app import celery_app
from app.core.logger import logger, correlation_id_ctx_var, task_id_ctx_var
from app.database.session import async_session
from app.database.models import WebhookEvent, Insight
from app.ai_engine.core.orchestrator import AIOrchestrator

async def async_process_event(event_id: str, retries: int, max_retries: int) -> None:
    async with async_session() as session:
        # Load event
        event_uuid = uuid.UUID(event_id)
        result = await session.execute(select(WebhookEvent).where(WebhookEvent.id == event_uuid))
        event = result.scalar_one_or_none()
        
        if not event:
            logger.error(f"Event {event_id} not found in database.")
            return
            
        if event.status == "PROCESSED":
            logger.info(f"Event {event_id} is already processed. Skipping.")
            return

        # Claim the event
        event.status = "PROCESSING"
        event.last_retry_at = datetime.utcnow()
        await session.commit()
        
        try:
            # ---------------------------------------------------------
            # BUSINESS LOGIC & PARSERS GO HERE
            # e.g., parser = get_parser_for_event(event.event_type)
            # parsed_data = parser.parse(event.payload)
            # save_to_db(parsed_data)
            # ---------------------------------------------------------
            
            # Call AI Orchestrator to analyze the webhook event payload
            logger.info(f"Processing event type: {event.event_type} with AI Engine")
            orchestrator = AIOrchestrator(session)
            insight_dto = await orchestrator.analyze_event(event_id)
            
            # Save the AI insight to the database
            db_insight = Insight(
                id=uuid.uuid4(),
                workspace_id=event.workspace_id,
                insight_type="RISK_ANALYSIS",
                title=insight_dto.title,
                reasoning_summary=insight_dto.reasoning_summary,
                confidence_score=insight_dto.confidence_score,
                supporting_evidence=insight_dto.supporting_evidence,
                actionable_steps=insight_dto.actionable_steps,
                created_at=datetime.utcnow()
            )
            session.add(db_insight)
            
            # Mark as processed
            event.status = "PROCESSED"
            event.processed_at = datetime.utcnow()
            event.error_message = None
            await session.commit()
            logger.info(f"Successfully processed event {event_id}")
            
        except Exception as e:
            await session.rollback()
            error_details = traceback.format_exc()
            logger.error(f"Error processing event {event_id}: {e}")
            
            # Update DLQ state
            event.retry_count = retries + 1
            event.error_message = str(e)
            
            if event.retry_count >= max_retries:
                event.status = "FAILED"
                logger.error(f"Event {event_id} reached max retries. Moved to DLQ.")
            else:
                event.status = "PENDING"
                
            await session.commit()
            raise e # Re-raise for Celery retry

@celery_app.task(bind=True, max_retries=3, queue="github_events_queue")
def process_webhook_event(self, event_id: str, correlation_id: str = None):
    # Set tracing contexts
    if correlation_id:
        correlation_id_ctx_var.set(correlation_id)
    task_id_ctx_var.set(self.request.id)
    
    logger.info(f"Worker received event {event_id}")
    
    try:
        asyncio.run(async_process_event(
            event_id=event_id,
            retries=self.request.retries,
            max_retries=self.max_retries
        ))
    except Exception as exc:
        # Exponential backoff: 2^retries * 10 seconds
        backoff = (2 ** self.request.retries) * 10
        logger.warning(f"Retrying event {event_id} in {backoff} seconds...")
        raise self.retry(exc=exc, countdown=backoff)
