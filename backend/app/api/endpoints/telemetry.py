from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

from app.api.deps import get_db
from app.database.models import APITelemetry

router = APIRouter()

class TelemetryPayload(BaseModel):
    workspace_id: UUID
    endpoint: str = Field(..., description="API endpoint path")
    status_code: int = Field(..., description="HTTP status code returned")
    latency_ms: int = Field(..., description="Latency in milliseconds")
    timestamp: datetime = Field(default_factory=datetime.utcnow)

@router.post("/", status_code=status.HTTP_202_ACCEPTED)
async def ingest_telemetry(
    payloads: List[TelemetryPayload],
    db: AsyncSession = Depends(get_db)
):
    """
    Ingests batch API telemetry logs.
    """
    telemetry_records = [
        APITelemetry(
            workspace_id=p.workspace_id,
            endpoint=p.endpoint,
            status_code=p.status_code,
            latency_ms=p.latency_ms,
            timestamp=p.timestamp
        )
        for p in payloads
    ]
    
    db.add_all(telemetry_records)
    await db.commit()
    
    return {"message": f"Successfully ingested {len(telemetry_records)} telemetry records"}
