#!/usr/bin/env python3
"""
Concurrent enrollment test using the atomic database function
This script tests race condition prevention in class enrollment
"""

import asyncio
import asyncpg
import uuid
import time
from typing import List, Dict, Any

class ConcurrentEnrollmentTest:
    def __init__(self, db_url: str):
        self.db_url = db_url
        self.test_class_id = None
        self.test_teacher_id = None
        self.test_school_id = None
        
    async def setup_test_data(self, conn):
        """Setup test data for concurrent enrollment test"""
        
        # Create test school
        school_result = await conn.fetchrow("""
            INSERT INTO schools (name, npsn, address, phone, email)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        """, "Test School for Concurrent Enrollment", "TEST123", "Test Address", "12345", "test@school.com")
        
        self.test_school_id = school_result['id']
        
        # Create test teacher
        teacher_result = await conn.fetchrow("""
            INSERT INTO profiles (id, full_name, role, school_id)
            VALUES ($1, $2, $3, $4)
            RETURNING id
        """, str(uuid.uuid4()), "Test Teacher", "teacher", self.test_school_id)
        
        self.test_teacher_id = teacher_result['id']
        
        # Create test class with small capacity
        class_result = await conn.fetchrow("""
            INSERT INTO classes (name, level, student_capacity, school_id, academic_year, semester, status, created_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id
        """, "Test Class Concurrent", "Test Level", 5, self.test_school_id, "2023-2024", "1", "active", self.test_teacher_id)
        
        self.test_class_id = class_result['id']
        
        # Create test students
        test_students = []
        for i in range(10):
            student_id = str(uuid.uuid4())
            await conn.execute("""
                INSERT INTO profiles (id, full_name, role, school_id)
                VALUES ($1, $2, $3, $4)
            """, student_id, f"Test Student {i+1}", "student", self.test_school_id)
            
            await conn.execute("""
                INSERT INTO student_details (user_id, nis, date_of_birth, gender, boarding)
                VALUES ($1, $2, $3, $4, $5)
            """, student_id, f"NIS{i+1:03d}", "2000-01-01", "M" if i % 2 == 0 else "F", False)
            test_students.append(student_id)
            
        return test_students
    
    async def concurrent_enrollment_task(self, student_id: str) -> Dict[str, Any]:
        """Single concurrent enrollment task"""
        conn = await asyncpg.connect(self.db_url)
        try:
            start_time = time.time()
            
            result = await conn.fetchrow("""
                SELECT * FROM add_students_to_class_atomic(
                    $1, $2, $3, $4
                )
            """, self.test_class_id, [student_id], self.test_teacher_id, self.test_school_id)
            
            end_time = time.time()
            
            return {
                "student_id": student_id,
                "success": len(result["success"] or []) > 0,
                "errors": result["errors"],
                "total_added": result["total_added"],
                "execution_time": end_time - start_time
            }
            
        finally:
            await conn.close()
    
    async def run_concurrent_test(self, num_concurrent: int = 8) -> Dict[str, Any]:
        """Run concurrent enrollment test"""
        
        # Setup
        conn = await asyncpg.connect(self.db_url)
        try:
            test_students = await self.setup_test_data(conn)
            
            # Get initial enrollment count
            initial_count = await conn.fetchval("""
                SELECT COUNT(*) FROM class_students WHERE class_id = $1
            """, self.test_class_id)
            
            # Run concurrent enrollments
            start_time = time.time()
            
            # Limit concurrent tasks to available students
            tasks = test_students[:min(num_concurrent, len(test_students))]
            results = await asyncio.gather(
                *[self.concurrent_enrollment_task(student_id) for student_id in tasks],
                return_exceptions=True
            )
            
            end_time = time.time()
            
            # Get final enrollment count
            final_count = await conn.fetchval("""
                SELECT COUNT(*) FROM class_students WHERE class_id = $1
            """, self.test_class_id)
            
            # Process results
            successful = [r for r in results if isinstance(r, dict) and r["success"]]
            failed = [r for r in results if isinstance(r, dict) and not r["success"]]
            errors = [r for r in results if isinstance(r, Exception)]
            
            return {
                "initial_count": initial_count,
                "final_count": final_count,
                "capacity": 5,
                "concurrent_attempts": len(tasks),
                "successful_enrollments": len(successful),
                "failed_enrollments": len(failed),
                "errors": len(errors),
                "total_time": end_time - start_time,
                "individual_results": results,
                "capacity_exceeded": final_count > 5
            }
            
        finally:
            await conn.close()
    
    async def verify_no_over_enrollment(self) -> bool:
        """Verify that no over-enrollment occurred"""
        conn = await asyncpg.connect(self.db_url)
        try:
            enrollment_count = await conn.fetchval("""
                SELECT COUNT(*) FROM class_students WHERE class_id = $1
            """, self.test_class_id)
            
            class_capacity = await conn.fetchval("""
                SELECT student_capacity FROM classes WHERE id = $1
            """, self.test_class_id)
            
            return enrollment_count <= class_capacity
            
        finally:
            await conn.close()
    
    async def cleanup_test_data(self):
        """Clean up test data"""
        conn = await asyncpg.connect(self.db_url)
        try:
            # Clean up in reverse order to respect foreign keys
            await conn.execute("""
                DELETE FROM class_students WHERE class_id = $1
            """, self.test_class_id)
            
            await conn.execute("""
                DELETE FROM classes WHERE id = $1
            """, self.test_class_id)
            
            await conn.execute("""
                DELETE FROM student_details WHERE user_id IN (
                    SELECT id FROM profiles WHERE school_id = $1
                )
            """, self.test_school_id)
            
            await conn.execute("""
                DELETE FROM profiles WHERE school_id = $1
            """, self.test_school_id)
            
            await conn.execute("""
                DELETE FROM schools WHERE id = $1
            """, self.test_school_id)
            
        finally:
            await conn.close()

async def main():
    """Main test runner"""
    import os
    
    # Get database URL from environment
    db_url = os.getenv('DATABASE_URL', 'postgresql://postgres:your-password@db.bsjbixlueqoxpxbeygoi.supabase.co:5432/postgres')
    
    test = ConcurrentEnrollmentTest(db_url)
    
    try:
        print("🧪 Starting Concurrent Enrollment Test...")
        
        # Run the concurrent test
        results = await test.run_concurrent_test(num_concurrent=8)
        
        print(f"\n📊 Test Results:")
        print(f"   Initial enrollment: {results['initial_count']}")
        print(f"   Final enrollment: {results['final_count']}")
        print(f"   Class capacity: {results['capacity']}")
        print(f"   Concurrent attempts: {results['concurrent_attempts']}")
        print(f"   Successful enrollments: {results['successful_enrollments']}")
        print(f"   Failed enrollments: {results['failed_enrollments']}")
        print(f"   Total execution time: {results['total_time']:.2f}s")
        print(f"   Capacity exceeded: {results['capacity_exceeded']}")
        
        # Verify no over-enrollment
        no_over_enrollment = await test.verify_no_over_enrollment()
        print(f"\n✅ No over-enrollment occurred: {no_over_enrollment}")
        
        if results['capacity_exceeded']:
            print("❌ ERROR: Capacity was exceeded!")
        else:
            print("✅ SUCCESS: Atomic function prevented over-enrollment")
        
        # Print individual results
        print(f"\n📋 Individual Results:")
        for i, result in enumerate(results['individual_results']):
            if isinstance(result, Exception):
                print(f"   Task {i+1}: ERROR - {str(result)}")
            else:
                status = "✅ SUCCESS" if result['success'] else "❌ FAILED"
                print(f"   Task {i+1}: {status} - {result['student_id'][:8]}... ({result['execution_time']:.3f}s)")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        
    finally:
        # Clean up test data
        print("\n🧹 Cleaning up test data...")
        await test.cleanup_test_data()
        print("✅ Cleanup completed")

if __name__ == "__main__":
    asyncio.run(main())