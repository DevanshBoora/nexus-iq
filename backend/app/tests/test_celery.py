import pytest
import uuid
import json
from unittest.mock import patch, MagicMock
from sqlalchemy.future import select
from app.database.models import WebhookEvent, Workspace
from app.workers.events import async_process_event

@pytest.mark.asyncio
async def test_worker_idempotency_and_success(db_session):
    # Setup test workspace and event
    workspace = Workspace(name="Test Workspace")
    db_session.add(workspace)
    await db_session.commit()

    event = WebhookEvent(
        workspace_id=workspace.id,
        event_type="github.push",
        payload={"ref": "refs/heads/main"},
        status="PENDING"
    )
    db_session.add(event)
    await db_session.commit()
    await db_session.refresh(event)

    # Patch async_session in the worker to use our test DB session factory
    class MockSessionFactory:
        async def __aenter__(self):
            return db_session
        async def __aexit__(self, exc_type, exc_val, exc_tb):
            pass
            
    with patch("app.workers.events.async_session", return_value=MockSessionFactory()):
        # First process
        await async_process_event(str(event.id), retries=0, max_retries=3)
        
        # Verify status is PROCESSED
        result = await db_session.execute(select(WebhookEvent).where(WebhookEvent.id == event.id))
        updated_event = result.scalar_one()
        assert updated_event.status == "PROCESSED"
        assert updated_event.processed_at is not None
        assert updated_event.error_message is None

        # Second process (should be idempotent and not fail)
        await async_process_event(str(event.id), retries=0, max_retries=3)
        
        result2 = await db_session.execute(select(WebhookEvent).where(WebhookEvent.id == event.id))
        event2 = result2.scalar_one()
        assert event2.status == "PROCESSED"

@pytest.mark.asyncio
async def test_worker_retry_and_dlq(db_session):
    workspace = Workspace(name="Test Workspace")
    db_session.add(workspace)
    await db_session.commit()

    event = WebhookEvent(
        workspace_id=workspace.id,
        event_type="github.push",
        payload={"ref": "refs/heads/main"},
        status="PENDING"
    )
    db_session.add(event)
    await db_session.commit()
    await db_session.refresh(event)

    class MockSessionFactory:
        async def __aenter__(self):
            return db_session
        async def __aexit__(self, exc_type, exc_val, exc_tb):
            pass

    # Patch to simulate an exception during processing
    with patch("app.workers.events.async_session", return_value=MockSessionFactory()):
        with patch("app.workers.events.asyncio.sleep", side_effect=Exception("Simulated processing error")):
            # First attempt (retries = 0)
            with pytest.raises(Exception):
                await async_process_event(str(event.id), retries=0, max_retries=3)
                
            await db_session.refresh(event)
            assert event.status == "PENDING"
            assert event.retry_count == 1
            assert event.error_message == "Simulated processing error"

            # Final attempt (retries = 3)
            with pytest.raises(Exception):
                await async_process_event(str(event.id), retries=3, max_retries=3)
                
            await db_session.refresh(event)
            assert event.status == "FAILED"
            assert event.retry_count == 4
