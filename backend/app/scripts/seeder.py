import asyncio
import uuid
from datetime import datetime, timedelta
from passlib.context import CryptContext

from app.database.session import SessionLocal
from app.database.models import User, Workspace, WorkspaceMember, Repository, WebhookEvent, AICache
from app.ai_engine.cache.manager import AICacheManager

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def seed_demo_environment():
    """
    Seeds the database with realistic demo data so the application is fully
    functional without external integrations. Ideal for resume/portfolio viewing.
    """
    async with SessionLocal() as session:
        print("Starting Database Seed...")
        
        # 1. Create Demo User
        demo_email = "demo@nexusiq.dev"
        hashed_password = pwd_context.hash("demo123!")
        
        demo_user = User(
            id=uuid.uuid4(),
            email=demo_email,
            hashed_password=hashed_password,
            is_active=True
        )
        session.add(demo_user)
        
        # 2. Create Workspace
        demo_workspace = Workspace(
            id=uuid.uuid4(),
            name="NexusIQ Demo Engineering"
        )
        session.add(demo_workspace)
        
        # 3. Add User to Workspace
        member = WorkspaceMember(
            user_id=demo_user.id,
            workspace_id=demo_workspace.id,
            role="OWNER"
        )
        session.add(member)
        
        # 4. Create Repositories
        repo1 = Repository(
            id=uuid.uuid4(),
            workspace_id=demo_workspace.id,
            name="nexus-api",
            url="https://github.com/demo/nexus-api"
        )
        repo2 = Repository(
            id=uuid.uuid4(),
            workspace_id=demo_workspace.id,
            name="nexus-frontend",
            url="https://github.com/demo/nexus-frontend"
        )
        session.add_all([repo1, repo2])
        
        # 5. Create Realistic Webhook Events
        event1 = WebhookEvent(
            id=uuid.uuid4(),
            workspace_id=demo_workspace.id,
            event_type="github.push",
            payload={
                "ref": "refs/heads/main",
                "commits": [
                    {"id": "a1b2c3d4", "message": "feat(auth): implement JWT refresh token"},
                    {"id": "b2c3d4e5", "message": "fix(db): resolve N+1 query issue in dashboard"}
                ],
                "repository": {"name": "nexus-api"}
            },
            status="PROCESSED",
            created_at=datetime.utcnow() - timedelta(hours=2)
        )
        
        event2 = WebhookEvent(
            id=uuid.uuid4(),
            workspace_id=demo_workspace.id,
            event_type="github.pull_request",
            payload={
                "action": "opened",
                "pull_request": {
                    "title": "Migrate from Redis to PostgreSQL for AI Cache",
                    "body": "This PR migrates our caching layer to avoid Redis memory limits on free tiers.",
                    "merged": False
                },
                "repository": {"name": "nexus-api"}
            },
            status="PROCESSED",
            created_at=datetime.utcnow() - timedelta(hours=1)
        )
        session.add_all([event1, event2])
        
        await session.commit()
        
        # 6. Pre-seed AI Insights in the Cache
        # This allows the demo to show AI insights without actually invoking the Gemini API
        cache_manager = AICacheManager(session)
        
        # Mock Context Builder logic manually for the seed
        prompt_pr = "Analyze the following event and provide a structured insight...\n" \
                    f"Event Type: github.pull_request\nWorkspace ID: {demo_workspace.id}\n" \
                    "Payload Data: {\"action\": \"opened\", \"pull_request\": ...}"
        
        pr_insight_json = {
            "insight_type": "OPTIMIZATION",
            "title": "Database Caching Migration",
            "reasoning_summary": "Migrating from Redis to PostgreSQL for caching is a strong optimization for free-tier deployments, ensuring memory limits aren't exceeded while persisting long-term AI insights.",
            "confidence_score": 0.95,
            "supporting_evidence": ["Migrate from Redis to PostgreSQL for AI Cache"],
            "actionable_steps": ["Ensure database indexes exist on the cache lookup keys.", "Monitor Postgres connection limits."]
        }
        
        await cache_manager.set_cached_response(prompt_pr, pr_insight_json)
        
        print("Demo Environment Seeded Successfully!")
        print(f"Login: {demo_email}")
        print("Password: demo123!")

if __name__ == "__main__":
    asyncio.run(seed_demo_environment())
