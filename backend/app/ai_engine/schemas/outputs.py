from pydantic import BaseModel, Field
from typing import List, Literal, Optional

class EngineeringInsight(BaseModel):
    """
    Standardized schema for all AI-generated engineering insights.
    This enforces structured outputs from the LLM provider.
    """
    insight_type: Literal["RISK", "OPTIMIZATION", "SUMMARY", "DEBT", "SECURITY", "INCIDENT"] = Field(
        description="The category of the insight generated."
    )
    title: str = Field(
        description="A concise, readable title for the insight."
    )
    reasoning_summary: str = Field(
        description="A paragraph explaining why this insight was generated based on the context."
    )
    confidence_score: float = Field(
        ge=0.0, le=1.0,
        description="Confidence score between 0.0 and 1.0 of the AI's assertion."
    )
    supporting_evidence: List[str] = Field(
        description="List of direct quotes, file names, or data points from the context that support the insight."
    )
    actionable_steps: List[str] = Field(
        default_factory=list,
        description="Concrete steps the engineering team should take."
    )
