import asyncio
import logging
from app.db.init_db import init_db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def init() -> None:
    logger.info("Initializing database")
    await init_db()
    logger.info("Database initialized successfully")

if __name__ == "__main__":
    logger.info("Creating initial data")
    asyncio.run(init()) 