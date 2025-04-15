from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field

# Class Schedule Schemas
class ClassScheduleBase(BaseModel):
    day_of_week: str
    start_time: str
    end_time: str
    subject: Optional[str] = None
    location: Optional[str] = None

class ClassScheduleCreate(ClassScheduleBase):
    class_id: int

class ClassScheduleUpdate(ClassScheduleBase):
    pass

class ClassScheduleInDBBase(ClassScheduleBase):
    id: int
    class_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class ClassSchedule(ClassScheduleInDBBase):
    pass

# Class Schemas
class ClassBase(BaseModel):
    name: str
    level: str
    description: Optional[str] = None
    school_id: int

class ClassCreate(ClassBase):
    pass

class ClassUpdate(BaseModel):
    name: Optional[str] = None
    level: Optional[str] = None
    description: Optional[str] = None

class ClassInDBBase(ClassBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class ClassSimple(ClassInDBBase):
    pass

class Class(ClassInDBBase):
    schedules: List[ClassSchedule] = []
    
    # For UI display
    student_count: Optional[int] = 0 