from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, join
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.deps import get_current_user, check_user_role
from app.db.database import get_db
from app.models.incident import Incident, IncidentComment
from app.models.user import User
from app.models.student import Student
from app.schemas.incident import Incident as IncidentSchema, IncidentCreate, IncidentUpdate, IncidentComment as IncidentCommentSchema

router = APIRouter()

@router.get("/", response_model=List[IncidentSchema])
async def get_incidents(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    incident_type: Optional[str] = None
) -> Any:
    """
    Get all incidents.
    Management can see all incidents.
    Teachers can see incidents related to their students.
    Parents and students can see incidents they reported.
    """
    query = select(Incident)
    
    # Add filters
    if status:
        query = query.filter(Incident.status == status)
    
    if incident_type:
        query = query.filter(Incident.incident_type == incident_type)
    
    # Apply role-based filtering
    if current_user.role == "management":
        # Management can see all incidents in their school
        if current_user.school_id:
            query = query.filter(Incident.school_id == current_user.school_id)
    elif current_user.role == "teacher":
        # Teachers can see incidents related to students they teach
        # This is a simplification - in a real app, would need to join through classes
        if current_user.school_id:
            query = query.filter(Incident.school_id == current_user.school_id)
    elif current_user.role in ["parent", "student"]:
        # Parents and students can only see incidents they reported
        query = query.filter(Incident.reporter_id == current_user.id)
    
    # Apply pagination
    query = query.offset(skip).limit(limit)
    
    # Execute query with comments loaded
    query = query.options(selectinload(Incident.comments))
    result = await db.execute(query)
    incidents = result.scalars().all()
    
    # Enhance incidents with reporter and student names
    incident_list = []
    for incident in incidents:
        # Get reporter name
        reporter = await db.execute(select(User).filter(User.id == incident.reporter_id))
        reporter = reporter.scalars().first()
        
        # Get student name if applicable
        student = None
        if incident.student_id:
            student_query = await db.execute(select(Student).filter(Student.id == incident.student_id))
            student = student_query.scalars().first()
        
        # Create incident schema with additional info
        incident_schema = IncidentSchema.model_validate(incident)
        
        # Add reporter name unless anonymous
        if not incident.is_anonymous and reporter:
            incident_schema.reporter_name = reporter.full_name
        
        # Add student name
        if student:
            incident_schema.student_name = f"{student.first_name} {student.last_name}"
        
        # Add comment user names
        for comment in incident_schema.comments:
            user_query = await db.execute(select(User).filter(User.id == comment.user_id))
            comment_user = user_query.scalars().first()
            if comment_user:
                comment.user_name = comment_user.full_name
        
        incident_list.append(incident_schema)
    
    return incident_list

@router.post("/", response_model=IncidentSchema)
async def create_incident(
    *,
    db: AsyncSession = Depends(get_db),
    incident_in: IncidentCreate,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Create a new incident report.
    """
    # Validate student_id if provided
    if incident_in.student_id:
        student_query = await db.execute(select(Student).filter(Student.id == incident_in.student_id))
        student = student_query.scalars().first()
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
    
    # Create the incident
    db_incident = Incident(
        incident_type=incident_in.incident_type,
        description=incident_in.description,
        location=incident_in.location,
        incident_date=incident_in.incident_date,
        status="pending",  # Default status
        is_anonymous=incident_in.is_anonymous,
        reporter_id=current_user.id,
        student_id=incident_in.student_id,
        school_id=current_user.school_id or incident_in.school_id,
    )
    db.add(db_incident)
    await db.commit()
    await db.refresh(db_incident)
    
    # Return incident with additional data
    incident_schema = IncidentSchema.model_validate(db_incident)
    
    # Add reporter name unless anonymous
    if not db_incident.is_anonymous:
        incident_schema.reporter_name = current_user.full_name
    
    # Add student name if applicable
    if incident_in.student_id:
        student = await db.execute(select(Student).filter(Student.id == incident_in.student_id))
        student = student.scalars().first()
        if student:
            incident_schema.student_name = f"{student.first_name} {student.last_name}"
    
    return incident_schema

@router.get("/{incident_id}", response_model=IncidentSchema)
async def get_incident(
    *,
    db: AsyncSession = Depends(get_db),
    incident_id: int,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Get a specific incident by ID.
    """
    # Get incident with comments
    query = select(Incident).filter(Incident.id == incident_id).options(
        selectinload(Incident.comments)
    )
    
    result = await db.execute(query)
    incident = result.scalars().first()
    
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    # Check permissions
    if current_user.role not in ["management", "teacher"]:
        # Parents and students can only view their own incidents
        if incident.reporter_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to access this incident")
    elif current_user.role == "teacher":
        # Teachers can only view incidents in their school
        if incident.school_id != current_user.school_id:
            raise HTTPException(status_code=403, detail="Not authorized to access this incident")
    
    # Create incident schema with additional info
    incident_schema = IncidentSchema.model_validate(incident)
    
    # Add reporter name unless anonymous
    if not incident.is_anonymous:
        reporter = await db.execute(select(User).filter(User.id == incident.reporter_id))
        reporter = reporter.scalars().first()
        if reporter:
            incident_schema.reporter_name = reporter.full_name
    
    # Add student name
    if incident.student_id:
        student_query = await db.execute(select(Student).filter(Student.id == incident.student_id))
        student = student_query.scalars().first()
        if student:
            incident_schema.student_name = f"{student.first_name} {student.last_name}"
    
    # Add comment user names
    for comment in incident_schema.comments:
        user_query = await db.execute(select(User).filter(User.id == comment.user_id))
        comment_user = user_query.scalars().first()
        if comment_user:
            comment.user_name = comment_user.full_name
    
    return incident_schema

@router.put("/{incident_id}", response_model=IncidentSchema)
async def update_incident(
    *,
    db: AsyncSession = Depends(get_db),
    incident_id: int,
    incident_in: IncidentUpdate,
    current_user: User = Depends(check_user_role(["management", "teacher"])),
) -> Any:
    """
    Update an incident status. Only management and teachers can update incidents.
    """
    # Get the incident
    result = await db.execute(select(Incident).filter(Incident.id == incident_id))
    incident = result.scalars().first()
    
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    # Check permissions for teachers (management can update any incident)
    if current_user.role == "teacher" and incident.school_id != current_user.school_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this incident")
    
    # Update fields
    update_data = incident_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(incident, field, value)
    
    await db.commit()
    await db.refresh(incident)
    
    # Return updated incident with additional info
    incident_schema = IncidentSchema.model_validate(incident)
    
    # Add reporter name unless anonymous
    if not incident.is_anonymous:
        reporter = await db.execute(select(User).filter(User.id == incident.reporter_id))
        reporter = reporter.scalars().first()
        if reporter:
            incident_schema.reporter_name = reporter.full_name
    
    # Add student name
    if incident.student_id:
        student_query = await db.execute(select(Student).filter(Student.id == incident.student_id))
        student = student_query.scalars().first()
        if student:
            incident_schema.student_name = f"{student.first_name} {student.last_name}"
    
    return incident_schema 