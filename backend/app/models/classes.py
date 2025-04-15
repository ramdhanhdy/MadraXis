from sqlalchemy import Column, Integer, String, ForeignKey, Table, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.database import Base

# Association table for many-to-many relationship between Class and Teacher
class_teachers = Table(
    "class_teachers",
    Base.metadata,
    Column("class_id", Integer, ForeignKey("classes.id"), primary_key=True),
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
)

# Association table for many-to-many relationship between Class and Student
class_students = Table(
    "class_students",
    Base.metadata,
    Column("class_id", Integer, ForeignKey("classes.id"), primary_key=True),
    Column("student_id", Integer, ForeignKey("students.id"), primary_key=True),
)

# Rename Class to SchoolClass
class SchoolClass(Base):
    __tablename__ = "classes"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    level = Column(String, nullable=False)  # e.g., Beginner, Intermediate, Advanced
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # School relationship
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=False)
    school = relationship("School", back_populates="classes")
    
    # Many-to-many relationships
    teachers = relationship("User", secondary=class_teachers, back_populates="classes")
    students = relationship("Student", secondary=class_students, back_populates="classes")
    
    # Update relationship name and back_populates reference
    schedules = relationship("ClassSchedule", back_populates="school_class")

class ClassSchedule(Base):
    __tablename__ = "class_schedules"
    
    id = Column(Integer, primary_key=True, index=True)
    day_of_week = Column(String, nullable=False)  # Monday, Tuesday, etc.
    start_time = Column(String, nullable=False)   # Format: "HH:MM"
    end_time = Column(String, nullable=False)     # Format: "HH:MM"
    subject = Column(String, nullable=True)
    location = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Foreign key to Class
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=False)
    # Update relationship name and back_populates reference
    school_class = relationship("SchoolClass", back_populates="schedules") 