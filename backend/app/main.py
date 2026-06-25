import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router

# Setup basic logging config
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("nexus-iq")

app = FastAPI(
    title="NexusIQ API",
    description="AI-Powered Engineering Intelligence Platform API",
    version="1.0.0"
)

# CORS Middleware to allow requests from local frontend container
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust to specific frontend host in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include main API router
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"status": "healthy", "service": "NexusIQ Backend"}
