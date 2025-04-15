import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

from app.api.api import api_router
from app.core.config import settings
from app.db.database import Base, engine # Import Base and engine for potential use (e.g., migrations)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# Define allowed origins (where the frontend is running)
# IMPORTANT: Adjust origins if your frontend runs on different ports/domains
origins = [
    "http://localhost:8081",  # Expo web
    "http://localhost",       # Sometimes used by browsers
    # Add the IP if testing directly via Expo Go on device might be needed
    # "http://192.168.0.105:8081", # Replace with your machine's actual local IP if needed
]

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,  # Allow cookies if needed in the future
    allow_methods=["*"],  # Allow all standard methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)


app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": "Welcome to ZaidApp API. Go to /docs for API documentation."}

@app.on_event("startup")
async def startup_db_client():
    try:
        async with engine.connect() as connection:
            result = await connection.execute(text("SELECT 1"))
            logger.info("Successfully connected to Supabase database.")
    except Exception as e:
        logger.error(f"Failed to connect to Supabase: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
    pass # Added pass to ensure block is not empty if uvicorn code was commented out 