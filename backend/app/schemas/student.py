from typing import Optional, List
from datetime import datetime, date
from pydantic import BaseModel

# Student Schemas
class StudentBase(BaseModel):
    student_id: str
    birth_date: Optional[date] = None
    address: Optional[str] = None
    parent_name: Optional[str] = None
    parent_phone: Optional[str] = None

class StudentCreate(StudentBase):
    user_id: int

class StudentUpdate(BaseModel):
    student_id: Optional[str] = None
    birth_date: Optional[date] = None
    address: Optional[str] = None
    parent_name: Optional[str] = None
    parent_phone: Optional[str] = None

class StudentInDBBase(StudentBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class Student(StudentInDBBase):
    # Include user's full name for display purposes
    full_name: Optional[str] = None 