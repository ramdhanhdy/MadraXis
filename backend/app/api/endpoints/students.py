import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

# Adjust imports based on your project structure
from app.crud import crud_student
from app.models import student as student_models # Pydantic models
# Note: We use the Pydantic models (schemas) for request/response validation,
# and the CRUD functions return ORM models which FastAPI handles via orm_mode.
from app.db.database import get_db

router = APIRouter()

@router.post("/", response_model=student_models.Student, status_code=status.HTTP_201_CREATED)
async def create_student_endpoint(
    student_in: student_models.StudentCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new student.
    """
    # Optional: Add checks like email existence if needed
    created_student = await crud_student.create_student(db=db, student=student_in)
    return created_student # FastAPI will convert ORM model to Pydantic response_model

@router.get("/", response_model=List[student_models.Student])
async def read_students_endpoint(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieve a list of students.
    """
    students = await crud_student.get_students(db=db, skip=skip, limit=limit)
    return students # FastAPI handles list of ORM models

@router.get("/{student_id}", response_model=student_models.Student)
async def read_student_endpoint(
    student_id: uuid.UUID,
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieve a single student by ID.
    """
    db_student = await crud_student.get_student(db=db, student_id=student_id)
    if db_student is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
    return db_student

@router.put("/{student_id}", response_model=student_models.Student)
async def update_student_endpoint(
    student_id: uuid.UUID,
    student_in: student_models.StudentUpdate,
    db: AsyncSession = Depends(get_db)
):
    """
    Update a student by ID.
    """
    # First check if student exists
    db_student = await crud_student.get_student(db=db, student_id=student_id)
    if db_student is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")

    # Optional: Add other validation checks if needed

    updated_student = await crud_student.update_student(db=db, student_id=student_id, student=student_in)
    return updated_student

@router.delete("/{student_id}", response_model=student_models.Student)
async def delete_student_endpoint(
    student_id: uuid.UUID,
    db: AsyncSession = Depends(get_db)
):
    """
    Delete a student by ID.
    """
    deleted_student = await crud_student.delete_student(db=db, student_id=student_id)
    if deleted_student is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
    # Return the data of the deleted student
    return deleted_student 