import asyncio
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

from app.core.config import settings
from app.core.security import get_password_hash
from app.db.database import Base, engine, AsyncSessionLocal
from app.models.user import User, School
from app.models.class import Class, ClassSchedule, Student
from app.models.incident import Incident, IncidentComment

async def init_db() -> None:
    async with engine.begin() as conn:
        # Create tables
        logging.info("Creating database tables")
        await conn.run_sync(Base.metadata.create_all)
    
    # Create a session
    async with AsyncSessionLocal() as session:
        # Check if we already have users
        result = await session.execute("SELECT COUNT(*) FROM users")
        user_count = result.scalar()
        
        if user_count == 0:
            # Create a sample school
            school = School(
                name="Pondok Pesantren Tahfidz ZAID BIN TSAABIT",
                npsn="12345678",
                address="123 Main St",
                phone="123-456-7890",
                email="info@zaidapp.com"
            )
            session.add(school)
            await session.commit()
            await session.refresh(school)
            
            # Create a superadmin user
            admin_user = User(
                email="admin@zaidapp.com",
                hashed_password=get_password_hash("admin123"),
                full_name="Admin User",
                role="management",
                school_id=school.id
            )
            session.add(admin_user)
            
            # Create a teacher user
            teacher_user = User(
                email="teacher@zaidapp.com",
                hashed_password=get_password_hash("teacher123"),
                full_name="Teacher User",
                role="teacher",
                school_id=school.id
            )
            session.add(teacher_user)
            
            # Create a student user
            student_user = User(
                email="student@zaidapp.com",
                hashed_password=get_password_hash("student123"),
                full_name="Student User",
                role="student",
                school_id=school.id
            )
            session.add(student_user)
            
            # Create a parent user
            parent_user = User(
                email="parent@zaidapp.com",
                hashed_password=get_password_hash("parent123"),
                full_name="Parent User",
                role="parent",
                school_id=school.id
            )
            session.add(parent_user)
            
            # Commit the users
            await session.commit()
            
            # Refresh the users to get their IDs
            await session.refresh(admin_user)
            await session.refresh(teacher_user)
            await session.refresh(student_user)
            
            # Create a student profile for the student user
            student = Student(
                student_id="ST12345",
                user_id=student_user.id,
                parent_name="Parent Name",
                parent_phone="123-456-7890"
            )
            session.add(student)
            
            # Create a class
            class_obj = Class(
                name="Tahfidz Al-Baqarah",
                level="Intermediate",
                description="Class focused on memorizing Surah Al-Baqarah with emphasis on tajwid and meaning.",
                school_id=school.id
            )
            session.add(class_obj)
            
            # Commit changes
            await session.commit()
            
            # Refresh to get IDs
            await session.refresh(class_obj)
            await session.refresh(student)
            
            # Add the teacher to the class
            await session.execute(
                "INSERT INTO class_teachers (class_id, user_id) VALUES (:class_id, :user_id)",
                {"class_id": class_obj.id, "user_id": teacher_user.id}
            )
            
            # Add the student to the class
            await session.execute(
                "INSERT INTO class_students (class_id, student_id) VALUES (:class_id, :student_id)",
                {"class_id": class_obj.id, "student_id": student.id}
            )
            
            # Create class schedule
            schedule = ClassSchedule(
                class_id=class_obj.id,
                day_of_week="Monday",
                start_time="08:00",
                end_time="10:00",
                subject="Tahfidz",
                location="Room 101"
            )
            session.add(schedule)
            
            # Create a sample incident
            incident = Incident(
                incident_type="bullying",
                description="Student reported being bullied during break time",
                location="School Playground",
                incident_date=datetime.now(),
                status="pending",
                reporter_id=parent_user.id,
                student_id=student.id,
                school_id=school.id
            )
            session.add(incident)
            
            # Commit all remaining changes
            await session.commit()
            
            logging.info("Initial data created successfully") 