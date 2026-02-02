from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request as StarletteRequest
from app.core.config import settings
import os
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
        "https://kanhakishori.in",
        "https://www.kanhakishori.in/",
        "https://kanhakishori.in/", # Also allow without www
        "https://kanhakishorijewels-production.up.railway.app",
        "http://localhost:3000",
        "http://localhost:8000"
    ]


class AddCORSHeadersMiddleware(BaseHTTPMiddleware):
    """Ensure CORS headers are on every response (runs first on response path)."""
    ALLOWED_ORIGINS = set(cors_origins)

    async def dispatch(self, request: StarletteRequest, call_next):
        response = await call_next(request)
        origin = request.headers.get("origin")
        if origin and origin in self.ALLOWED_ORIGINS:
            response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
        response.headers["Access-Control-Allow-Headers"] = "*"
        response.headers["Access-Control-Expose-Headers"] = "*"
        response.headers["Access-Control-Max-Age"] = "3600"
        return response


# Add custom CORS header middleware FIRST (so it runs last on response = headers always set)
app.add_middleware(AddCORSHeadersMiddleware)

# Then FastAPI CORS middleware for OPTIONS preflight
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

# Global exception handlers to ensure CORS headers are always included
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """Handle HTTP exceptions with CORS headers"""
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors with CORS headers"""
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle all other exceptions with CORS headers and logging"""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )

# We will import and include the API router here later
from app.api.v1.api import api_router
app.include_router(api_router, prefix=settings.API_V1_STR)

