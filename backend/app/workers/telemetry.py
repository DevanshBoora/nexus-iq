import logging
import pandas as pd
import uuid
from datetime import datetime, timedelta
from typing import List, Dict, Any

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc

from app.database.models import APITelemetry, WebhookEvent, Insight
from app.database.session import async_session
from app.core.celery_app import celery_app
from app.ai_engine.core.orchestrator import AIOrchestrator
from app.ai_engine.schemas.outputs import EngineeringInsight

logger = logging.getLogger("nexus-iq")

async def _correlate_anomaly(session: AsyncSession, anomaly_desc: str, workspace_id: str):
    """
    Triggers the AI Engine to correlate the anomaly with recent repository events.
    """
    workspace_uuid = uuid.UUID(workspace_id)
    # Fetch recent deployments/commits (WebhookEvents)
    result = await session.execute(
        select(WebhookEvent)
        .where(WebhookEvent.workspace_id == workspace_uuid)
        .order_by(desc(WebhookEvent.created_at))
        .limit(5)
    )
    recent_events = result.scalars().all()
    
    context_str = ""
    for ev in recent_events:
        context_str += f"- [{ev.created_at}] {ev.event_type}\nPayload: {ev.payload}\n\n"
        
    orchestrator = AIOrchestrator(session)
    prompt = orchestrator.prompt_manager.render(
        "incident_correlation_v1", 
        {
            "anomaly_description": anomaly_desc,
            "recent_commits_context": context_str or "No recent webhook events found."
        }
    )
    
    # Generate Insight
    insight_output = await orchestrator.provider.generate_structured(
        prompt=prompt,
        response_schema=EngineeringInsight
    )
    
    # Save the Insight to DB
    insight_record = Insight(
        workspace_id=workspace_uuid,
        insight_type=insight_output.insight_type,
        title=insight_output.title,
        reasoning_summary=insight_output.reasoning_summary,
        confidence_score=insight_output.confidence_score,
        supporting_evidence=insight_output.supporting_evidence,
        actionable_steps=insight_output.actionable_steps
    )
    session.add(insight_record)
    await session.commit()
    
    logger.info(f"Anomaly Correlated! Generated insight: {insight_output.title}")

async def async_analyze_telemetry(session: AsyncSession = None):
    """
    Analyzes telemetry from the past hour using Pandas to detect anomalies.
    """
    time_threshold = datetime.utcnow() - timedelta(hours=1)
    
    if session:
        await _run_analysis_with_session(session, time_threshold)
    else:
        async with async_session() as new_session:
            await _run_analysis_with_session(new_session, time_threshold)

async def _run_analysis_with_session(session: AsyncSession, time_threshold: datetime):
    result = await session.execute(
        select(APITelemetry).where(APITelemetry.timestamp >= time_threshold)
    )
    telemetry_records = result.scalars().all()
    if not telemetry_records:
        logger.info("No telemetry data to analyze in the last hour.")
        return

    # Load into Pandas DataFrame
    data = [
        {
            "workspace_id": str(r.workspace_id),
            "endpoint": r.endpoint,
            "status_code": r.status_code,
            "latency_ms": r.latency_ms
        }
        for r in telemetry_records
    ]
    df = pd.DataFrame(data)
    
    # Group by workspace and endpoint
    grouped = df.groupby(["workspace_id", "endpoint"])
    
    for (workspace_id, endpoint), group in grouped:
        total_requests = len(group)
        error_count = len(group[group['status_code'] >= 500])
        error_rate = error_count / total_requests
        
        p99_latency = group['latency_ms'].quantile(0.99)
        
        anomaly_detected = False
        anomaly_desc = ""
        
        # Simple static thresholds for demo purposes
        if error_rate > 0.05:
            anomaly_detected = True
            anomaly_desc += f"Error rate spiked to {error_rate*100:.2f}% ({error_count}/{total_requests}). "
        if p99_latency > 2000:
            anomaly_detected = True
            anomaly_desc += f"P99 Latency degraded to {p99_latency:.2f}ms. "
            
        if anomaly_detected:
            logger.warning(f"Anomaly detected for workspace {workspace_id} on endpoint {endpoint}: {anomaly_desc}")
            await _correlate_anomaly(session, f"Endpoint: {endpoint}. {anomaly_desc}", workspace_id)

@celery_app.task(name="analyze_telemetry_metrics")
def trigger_telemetry_analysis():
    """
    Celery task that runs periodically to trigger the async analysis.
    """
    import asyncio
    loop = asyncio.get_event_loop()
    loop.run_until_complete(async_analyze_telemetry())
