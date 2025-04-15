from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel

# Incident Comment Schemas
class IncidentCommentBase(BaseModel):
    comment: str

class IncidentCommentCreate(IncidentCommentBase):
    incident_id: int
    user_id: int

class IncidentCommentInDBBase(IncidentCommentBase):
    id: int
    incident_id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class IncidentComment(IncidentCommentInDBBase):
    # Include user's name for display
    user_name: Optional[str] = None

# Incident Schemas
class IncidentBase(BaseModel):
    incident_type: str
    description: str
    location: str
    incident_date: datetime
    is_anonymous: Optional[bool] = False
    student_id: Optional[int] = None

class IncidentCreate(IncidentBase):
    reporter_id: int
    school_id: int

class IncidentUpdate(BaseModel):
    status: Optional[str] = None
    description: Optional[str] = None

class IncidentInDBBase(IncidentBase):
    id: int
    status: str
    reporter_id: int
    school_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class Incident(IncidentInDBBase):
    # For display purposes
    reporter_name: Optional[str] = None
    student_name: Optional[str] = None
    comments: List[IncidentComment] = [] 