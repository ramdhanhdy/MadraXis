from fastapi import APIRouter

from app.api.endpoints import auth, classes, students, incidents

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(classes.router, prefix="/classes", tags=["classes"])
api_router.include_router(students.router, prefix="/students", tags=["students"])
api_router.include_router(incidents.router, prefix="/incidents", tags=["incidents"]) 