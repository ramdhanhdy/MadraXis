import uuid
from typing import List, Optional

from sqlalchemy import update, delete
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession

# Use the ORM model and Pydantic schemas
from app.models.student import Student as StudentDBModel
from app.models.student import StudentCreate, StudentUpdate

# Remove unused imports
# from databases import Database
# from app.db.base import students_table

async def create_student(db: AsyncSession, student: StudentCreate) -> StudentDBModel:
    """Creates a new student record using SQLAlchemy ORM."""
    # Create an instance of the ORM model
    db_student = StudentDBModel(**student.dict())
    db.add(db_student) # Add the instance to the session
    await db.commit() # Commit the transaction
    await db.refresh(db_student) # Refresh to get DB-generated values (like ID, timestamps)
    return db_student

async def get_student(db: AsyncSession, student_id: uuid.UUID) -> Optional[StudentDBModel]:
    """Retrieves a single student by their ID using SQLAlchemy ORM."""
    result = await db.execute(select(StudentDBModel).filter(StudentDBModel.id == student_id))
    return result.scalar_one_or_none() # Get a single result or None

async def get_students(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[StudentDBModel]:
    """Retrieves a list of students with pagination using SQLAlchemy ORM."""
    result = await db.execute(
        select(StudentDBModel).offset(skip).limit(limit)
    )
    return result.scalars().all() # Get all results

async def update_student(db: AsyncSession, student_id: uuid.UUID, student: StudentUpdate) -> Optional[StudentDBModel]:
    """Updates an existing student record using SQLAlchemy ORM."""
    # Exclude unset fields from the update payload
    update_data = student.dict(exclude_unset=True)
    # Note: updated_at is handled by server_default/onupdate or DB trigger

    if not update_data:
        # If nothing to update, fetch and return the existing student
        return await get_student(db, student_id)

    # Execute the update statement
    await db.execute(
        update(StudentDBModel)
        .where(StudentDBModel.id == student_id)
        .values(**update_data)
    )
    await db.commit() # Commit the changes

    # Fetch the updated student to return it
    return await get_student(db, student_id)

async def delete_student(db: AsyncSession, student_id: uuid.UUID) -> Optional[StudentDBModel]:
    """Deletes a student record by their ID using SQLAlchemy ORM."""
    # First, get the student to potentially return it
    student_to_delete = await get_student(db, student_id)
    if not student_to_delete:
        return None # Student not found

    # Execute the delete statement
    await db.execute(
        delete(StudentDBModel).where(StudentDBModel.id == student_id)
    )
    await db.commit() # Commit the deletion
    return student_to_delete # Return the deleted student data 