from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
import os

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS origins - can be overridden via environment variable
# Format: comma-separated list of origins
cors_origins_env = os.getenv("CORS_ORIGINS", "")
if cors_origins_env:
    cors_origins = [origin.strip() for origin in cors_origins_env.split(",")]
else:
    cors_origins = [
        "https://www.kanhakishori.in",
        "https://kanhakishori.in",  # Also allow without www
        "https://kanhakishorijewels-production.up.railway.app",
        "http://localhost:3000",
        "http://localhost:8000"
    ]

# Set all CORS enabled origins - MUST be added before routers
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,  # Cache preflight requests for 1 hour
)

@app.get("/")
def root():
    return {"message": "Welcome to JewelE Backend API (v2)"}

# We will import and include the API router here later
from app.api.v1.api import api_router
app.include_router(api_router, prefix=settings.API_V1_STR)

