from __future__ import annotations
import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, DateTime, ForeignKey, Table, Column, Index, JSON, Integer, Float
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base_class import Base

# Association table for User and Workspace (Many-to-Many)
class WorkspaceMember(Base):
    __tablename__ = "workspace_member"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    workspace_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("workspace.id", ondelete="CASCADE"), nullable=False)
    role: Mapped[str] = mapped_column(String(50), default="MEMBER")  # OWNER, ADMIN, MEMBER
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Indexes
    __table_args__ = (
        Index("idx_workspace_member_user_id", "user_id"),
        Index("idx_workspace_member_workspace_id", "workspace_id"),
    )

class User(Base):
    __tablename__ = "user"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(50), default="DEVELOPER")  # ADMIN, DEVELOPER
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    workspaces: Mapped[List["Workspace"]] = relationship(
        "Workspace",
        secondary="workspace_member",
        back_populates="members"
    )

class Workspace(Base):
    __tablename__ = "workspace"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    members: Mapped[List["User"]] = relationship(
        "User",
        secondary="workspace_member",
        back_populates="workspaces"
    )
    repositories: Mapped[List["Repository"]] = relationship(
        "Repository",
        back_populates="workspace",
        cascade="all, delete-orphan"
    )

class Repository(Base):
    __tablename__ = "repository"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("workspace.id", ondelete="CASCADE"), nullable=False)
    github_repo_id: Mapped[int] = mapped_column(nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    workspace: Mapped["Workspace"] = relationship("Workspace", back_populates="repositories")

class WebhookEvent(Base):
    __tablename__ = "webhook_event"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("workspace.id", ondelete="CASCADE"))
    event_type: Mapped[str] = mapped_column(String)
    payload: Mapped[dict] = mapped_column(JSON)
    
    # DLQ / Retry Pipeline Fields
    status: Mapped[str] = mapped_column(String, default="PENDING")  # PENDING, PROCESSING, PROCESSED, FAILED
    retry_count: Mapped[int] = mapped_column(Integer, default=0)
    processed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    last_retry_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    error_message: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    # Indexes
    __table_args__ = (
        Index("idx_webhook_event_workspace_id", "workspace_id"),
        Index("idx_webhook_event_created_at", "created_at"),
        Index("idx_webhook_event_status", "status"),
    )

class AICache(Base):
    __tablename__ = "ai_cache"
    
    prompt_hash: Mapped[str] = mapped_column(String, primary_key=True)
    response_json: Mapped[dict] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

class APITelemetry(Base):
    __tablename__ = "api_telemetry"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("workspace.id", ondelete="CASCADE"))
    endpoint: Mapped[str] = mapped_column(String)
    status_code: Mapped[int] = mapped_column(Integer)
    latency_ms: Mapped[int] = mapped_column(Integer)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

class Insight(Base):
    __tablename__ = "insight"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("workspace.id", ondelete="CASCADE"))
    insight_type: Mapped[str] = mapped_column(String)  # RISK, INCIDENT, OPTIMIZATION, SUMMARY
    title: Mapped[str] = mapped_column(String)
    reasoning_summary: Mapped[str] = mapped_column(String)
    confidence_score: Mapped[float] = mapped_column(Float)
    supporting_evidence: Mapped[dict] = mapped_column(JSON)
    actionable_steps: Mapped[dict] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
