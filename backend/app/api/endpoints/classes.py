# Import necessary models and schemas for class operations

# Standard library imports
from typing import Any, List, Optional

# Third-party imports
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

# Local application imports
from app.core.deps import get_current_user, check_user_role
from app.db.database import get_db
from app.models.classes import SchoolClass as SchoolClassModel, ClassSchedule, class_students
from app.db.models.student import Student
from app.models.user import User
from app.schemas.classes import Class as ClassSchema, ClassCreate, ClassSimple, ClassUpdate

router = APIRouter()

@router.get("/", response_model=List[ClassSimple])
async def get_classes(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
    name: Optional[str] = None
) -> Any:
    """
    Get all classes.
    """
    query = select(SchoolClassModel)
    
    # Add filters
    if name:
        query = query.filter(SchoolClassModel.name.ilike(f"%{name}%"))
    
    # Apply role-based filtering
    if current_user.role == "teacher":
        # Get classes where the teacher is assigned
        query = query.join(SchoolClassModel.teachers).filter(User.id == current_user.id)
    elif current_user.role == "student":
        # Get classes where the student is enrolled
        student = await db.execute(
            select(Student).filter(Student.user_id == current_user.id)
        )
        student = student.scalars().first()
        if student:
            query = query.join(SchoolClassModel.students).filter(Student.id == student.id)
        else:
            return []
    
    # School-based filtering
    if current_user.school_id:
        query = query.filter(SchoolClassModel.school_id == current_user.school_id)
    
    # Apply pagination
    query = query.offset(skip).limit(limit)
    
    # Execute query
    result = await db.execute(query)
    classes = result.scalars().all()
    
    # Count students in each class
    class_list = []
    for cls in classes:
        # Count students in the class
        student_count_query = select(func.count(class_students.c.student_id)).where(
            class_students.c.class_id == cls.id
        )
        result = await db.execute(student_count_query)
        student_count = result.scalar() or 0
        
        # Create class schema with student count
        class_schema = ClassSimple.model_validate(cls)
        class_schema.student_count = student_count
        class_list.append(class_schema)
    
    return class_list

@router.post("/", response_model=ClassSchema)
async def create_class(
    *,
    db: AsyncSession = Depends(get_db),
    class_in: ClassCreate,
    current_user: User = Depends(check_user_role(["teacher", "management"])),
) -> Any:
    """
    Create a new class. Only teachers and management can create classes.
    """
    # Create the class
    db_class = SchoolClassModel(
        name=class_in.name,
        level=class_in.level,
        description=class_in.description,
        school_id=current_user.school_id,  # Assign to the user's school
    )
    db.add(db_class)
    await db.commit()
    await db.refresh(db_class)
    
    # If created by a teacher, add them as a teacher for this class
    if current_user.role == "teacher":
        await db.execute(
            "INSERT INTO class_teachers (class_id, user_id) VALUES (:class_id, :user_id)",
            {"class_id": db_class.id, "user_id": current_user.id}
        )
        await db.commit()
    
    return db_class

@router.get("/{class_id}", response_model=ClassSchema)
async def get_class(
    *,
    db: AsyncSession = Depends(get_db),
    class_id: int,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Get a specific class by ID.
    """
    # Get class with schedules
    query = select(SchoolClassModel).where(SchoolClassModel.id == class_id).options(
        selectinload(SchoolClassModel.schedules)
    )
    
    # Apply role-based access control
    if current_user.role == "teacher":
        query = query.join(SchoolClassModel.teachers).filter(User.id == current_user.id)
    elif current_user.role == "student":
        student = await db.execute(
            select(Student).filter(Student.user_id == current_user.id)
        )
        student = student.scalars().first()
        if student:
            query = query.join(SchoolClassModel.students).filter(Student.id == student.id)
    
    # Execute query
    result = await db.execute(query)
    db_class = result.scalars().first()
    
    if not db_class:
        raise HTTPException(status_code=404, detail="Class not found")
    
    # Count students
    student_count_query = select(func.count(class_students.c.student_id)).where(
        class_students.c.class_id == db_class.id
    )
    result = await db.execute(student_count_query)
    student_count = result.scalar() or 0
    
    # Create class schema with student count
    class_schema = ClassSchema.model_validate(db_class)
    class_schema.student_count = student_count
    
    return class_schema 