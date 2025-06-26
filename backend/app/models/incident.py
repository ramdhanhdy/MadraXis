from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.db.database import Base

class Incident(Base):
    __tablename__ = "incidents"
    
    id = Column(Integer, primary_key=True, index=True)
    incident_type = Column(String, nullable=False)  # bullying, safety, property, other
    description = Column(Text, nullable=False)
    location = Column(String, nullable=False)
    incident_date = Column(DateTime, nullable=False)
    status = Column(String, nullable=False, default="pending")  # pending, in_progress, resolved, closed
    is_anonymous = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Who reported the incident
    reporter_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    reporter = relationship("User", back_populates="incidents_reported")
    
    # Student involved in the incident (if applicable)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=True)
    student = relationship("Student", back_populates="incidents")
    
    # School where the incident occurred
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=False)
    
    # Relationships
    comments = relationship("IncidentComment", back_populates="incident", cascade="all, delete-orphan")

class IncidentComment(Base):
    __tablename__ = "incident_comments"
    
    id = Column(Integer, primary_key=True, index=True)
    comment = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Who made the comment
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Which incident this comment belongs to
    incident_id = Column(Integer, ForeignKey("incidents.id"), nullable=False)
    incident = relationship("Incident", back_populates="comments") 