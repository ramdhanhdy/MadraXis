from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    role = Column(String, nullable=False)  # teacher, student, parent, management
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # For school management
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=True)
    school = relationship("School", back_populates="users")
    
    # Relationships
    classes = relationship("SchoolClass", secondary="class_teachers", back_populates="teachers")
    
    # A user can submit multiple incident reports
    incidents_reported = relationship("Incident", back_populates="reporter")


class School(Base):
    __tablename__ = "schools"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    npsn = Column(String, unique=True, index=True)  # Indonesian school identification number
    address = Column(String)
    phone = Column(String)
    email = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    users = relationship("User", back_populates="school")
    classes = relationship("SchoolClass", back_populates="school") 