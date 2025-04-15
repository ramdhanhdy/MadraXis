import uuid
from sqlalchemy import Column, String, Date, TIMESTAMP, func
from sqlalchemy.dialects.postgresql import UUID
from app.db.database import Base # Import Base from your database setup

class Student(Base):
    __tablename__ = "students"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    date_of_birth = Column(Date, nullable=True)
    email = Column(String, unique=True, index=True, nullable=True)
    enrollment_date = Column(TIMESTAMP(timezone=True), server_default=func.now())
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    # Use server_default for updated_at if not using DB triggers
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships can be defined here later, e.g.:
    # enrollments = relationship("Enrollment", back_populates="student")
    # parents = relationship("Parent", secondary="student_parent", back_populates="students") 