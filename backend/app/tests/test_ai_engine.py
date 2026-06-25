import pytest
import uuid
import json
from unittest.mock import patch, MagicMock

from app.database.models import WebhookEvent, Workspace
from app.ai_engine.core.orchestrator import AIOrchestrator
from app.ai_engine.schemas.outputs import EngineeringInsight

@pytest.mark.asyncio
async def test_ai_orchestrator_cache_hit_and_miss(db_session):
    # Setup test workspace and event
    workspace = Workspace(name="AI Test Workspace")
    db_session.add(workspace)
    await db_session.commit()

    event = WebhookEvent(
        workspace_id=workspace.id,
        event_type="github.push",
        payload={"ref": "refs/heads/main", "commits": [{"message": "fix: bug"}]},
        status="PENDING"
    )
    db_session.add(event)
    await db_session.commit()
    await db_session.refresh(event)

    # Mock the LLM Provider generate_structured
    mock_insight = EngineeringInsight(
        insight_type="SUMMARY",
        title="Test Insight",
        reasoning_summary="Because it is a test.",
        confidence_score=0.9,
        supporting_evidence=["mocked evidence"],
        actionable_steps=["none"]
    )

    with patch("app.ai_engine.providers.gemini.GeminiProvider.generate_structured") as mock_generate:
        mock_generate.return_value = mock_insight

        orchestrator = AIOrchestrator(session=db_session)

        # 1. First call should be a cache miss, thus calling the LLM Provider
        insight1 = await orchestrator.analyze_event(str(event.id))
        
        assert insight1.title == "Test Insight"
        assert mock_generate.call_count == 1

        # 2. Second call should be a cache hit, NOT calling the LLM Provider again
        insight2 = await orchestrator.analyze_event(str(event.id))
        
        assert insight2.title == "Test Insight"
        assert mock_generate.call_count == 1 # Still 1! Cache hit successfully!
