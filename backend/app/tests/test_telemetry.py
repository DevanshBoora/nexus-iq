import pytest
import uuid
import json
from unittest.mock import patch, AsyncMock
from datetime import datetime, timedelta

from app.database.models import APITelemetry, WebhookEvent, Workspace
from app.workers.telemetry import async_analyze_telemetry

@pytest.mark.asyncio
async def test_telemetry_anomaly_detection_and_correlation(db_session):
    # Setup test workspace
    workspace = Workspace(name="Telemetry Test Workspace")
    db_session.add(workspace)
    await db_session.commit()
    
    # 1. Add recent webhook event
    event = WebhookEvent(
        workspace_id=workspace.id,
        event_type="github.push",
        payload={"commits": [{"message": "break everything"}]},
        status="PROCESSED"
    )
    db_session.add(event)
    
    # 2. Add telemetry data
    base_time = datetime.utcnow() - timedelta(minutes=10)
    
    # 5 successful requests
    for i in range(5):
        db_session.add(APITelemetry(
            workspace_id=workspace.id,
            endpoint="/api/test",
            status_code=200,
            latency_ms=50,
            timestamp=base_time + timedelta(seconds=i)
        ))
        
    # 2 failing slow requests (error rate = 2/7 > 5%)
    for i in range(2):
        db_session.add(APITelemetry(
            workspace_id=workspace.id,
            endpoint="/api/test",
            status_code=500,
            latency_ms=2500,
            timestamp=base_time + timedelta(seconds=i + 5)
        ))
        
    await db_session.commit()

    # 3. Mock AI Orchestrator to prevent real LLM call
    with patch("app.workers.telemetry.AIOrchestrator") as MockOrchestrator:
        mock_instance = MockOrchestrator.return_value
        # Mock the provider inside the orchestrator
        from app.ai_engine.schemas.outputs import EngineeringInsight
        mock_insight = EngineeringInsight(
            insight_type="INCIDENT",
            title="Test Anomaly",
            reasoning_summary="Because tests.",
            confidence_score=0.9,
            supporting_evidence=["a"],
            actionable_steps=["b"]
        )
        # Fix mock nesting for async
        mock_instance.provider.generate_structured = AsyncMock(return_value=mock_insight)
        
        # Run telemetry analysis
        await async_analyze_telemetry(db_session)
        
        # Verify Orchestrator was called, which means anomaly was detected
        assert mock_instance.provider.generate_structured.call_count == 1
        
        # Check if Insight was saved to DB
        from app.database.models import Insight
        from sqlalchemy.future import select
        result = await db_session.execute(select(Insight).where(Insight.workspace_id == workspace.id))
        saved_insight = result.scalar_one_or_none()
        
        assert saved_insight is not None
        assert saved_insight.title == "Test Anomaly"
        assert saved_insight.insight_type == "INCIDENT"
