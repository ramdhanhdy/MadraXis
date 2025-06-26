from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import date, datetime
from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID 
from sqlalchemy.sql import func
from app.db.database import Base
import uuid 
from .classes import class_students

# SQLAlchemy Model Definition
class Student(Base):
    __tablename__ = "students"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4())) 
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    date_of_birth = Column(Date, nullable=True)
    email = Column(String, nullable=True) 
    enrollment_date = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    classes = relationship("SchoolClass", secondary=class_students, back_populates="students")
    incidents = relationship("Incident", back_populates="student")


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
        orm_mode = True 

# Properties to return to client
class StudentSchema(StudentInDBBase):
    pass

# Properties stored in DB
class StudentInDBSchema(StudentInDBBase):
    pass 