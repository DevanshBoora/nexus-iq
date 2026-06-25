from fastapi import APIRouter
from app.api.endpoints import auth, workspaces, webhooks, telemetry

api_router = APIRouter()

# Include routers with prefixes
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(workspaces.router, prefix="/workspaces", tags=["workspaces"])
api_router.include_router(webhooks.router, prefix="/webhooks", tags=["webhooks"])
api_router.include_router(telemetry.router, prefix="/telemetry", tags=["telemetry"])
