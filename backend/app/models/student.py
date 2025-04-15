import uuid
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import date, datetime

# Properties to receive via API on creation
class StudentCreate(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: Optional[date] = None
    email: Optional[EmailStr] = None

# Properties to receive via API on update
class StudentUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    email: Optional[EmailStr] = None

# Properties shared by models stored in DB
class StudentInDBBase(BaseModel):
    id: uuid.UUID
    first_name: str
    last_name: str
    date_of_birth: Optional[date] = None
    email: Optional[EmailStr] = None
    enrollment_date: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True # Compatibility with ORMs / database objects

# Properties to return to client
class Student(StudentInDBBase):
    pass

# Properties stored in DB
class StudentInDB(StudentInDBBase):
    pass 