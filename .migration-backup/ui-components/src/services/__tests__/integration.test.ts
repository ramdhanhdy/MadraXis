/**
 * Integration tests for the complete "Add Students to Classes" workflow
 * Tests end-to-end scenarios and complex interactions between services
 */

import { ClassService } from '../classService';
import { ClassEnrollmentService } from '../class/enrollment';
import { ClassAccessControl } from '../class/access';
import { supabase } from '../../utils/supabase';
import { createMockStudent, createMockClass, createMockTeacher, generateLargeStudentList } from './testHelpers';

// Mock supabase
jest.mock('../../utils/supabase', () => ({
  supabase: {
    from: jest.fn(),
    rpc: jest.fn(),
  },
}));

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('Add Students to Classes - Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Complete workflow integration', () => {
    it('should complete full enrollment workflow from class creation to student addition', async () => {
      const teacher = createMockTeacher();
      const student = createMockStudent();
      const classData = createMockClass({ teacher_id: teacher.id });

      // Mock all necessary queries
      const teacherProfileQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { school_id: teacher.school_id },
          error: null
        })
      };

      const classQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { ...classData, school_id: teacher.school_id },
          error: null
        })
      };

      const availableStudentsQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        not: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValue({
          data: [student],
          count: 1,
          error: null
        })
      };

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'profiles') return teacherProfileQuery as any;
        if (table === 'classes') return classQuery as any;
        if (table === 'students') return availableStudentsQuery as any;
        return { select: jest.fn().mockReturnThis(), eq: jest.fn().mockReturnThis() } as any;
      });

      mockSupabase.rpc.mockResolvedValue({
        data: [{
          success: [student.id],
          errors: []
        }],
        error: null
      } as any);

      // Test the complete workflow
      const availableStudentsResult = await ClassEnrollmentService.getAvailableStudents(classData.id, teacher.id);
      expect(availableStudentsResult.students).toHaveLength(1);

      const enrollmentResult = await ClassService.bulkEnrollStudents(classData.id, { student_ids: [student.id] }, teacher.id);
      expect(enrollmentResult.results).toContain(student.id);
    });

    it('should handle concurrent enrollment requests with proper validation', async () => {
      const teacher = createMockTeacher();
      const students = generateLargeStudentList(50);
      const classData = createMockClass({
        teacher_id: teacher.id,
        max_students: 30
      });

      const teacherProfileQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { school_id: teacher.school_id },
          error: null
        })
      };

      const classQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { ...classData, school_id: teacher.school_id },
          error: null
        })
      };

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'profiles') return teacherProfileQuery as any;
        if (table === 'classes') return classQuery as any;
        return { select: jest.fn().mockReturnThis(), eq: jest.fn().mockReturnThis() } as any;
      });

      // Simulate race condition where capacity is reached
      mockSupabase.rpc.mockResolvedValue({
        data: [{
          results: students.slice(0, 30).map(s => s.id),
          errors: students.slice(30).map(s => ({ student_id: s.id, error: 'Class capacity exceeded' })),
          enrolled_count: 30
        }],
        error: null
      } as any);

      const concurrentRequests = [
        ClassService.bulkEnrollStudents(classData.id, { student_ids: students.slice(0, 20).map(s => s.id) }, teacher.id),
        ClassService.bulkEnrollStudents(classData.id, { student_ids: students.slice(20, 40).map(s => s.id) }, teacher.id),
        ClassService.bulkEnrollStudents(classData.id, { student_ids: students.slice(40, 50).map(s => s.id) }, teacher.id)
      ];

      const results = await Promise.allSettled(concurrentRequests);

      // Verify atomic behavior
      const successfulEnrollments = results.filter(r => r.status === 'fulfilled');
      const totalEnrolled = successfulEnrollments.reduce((sum, r) =>
        sum + (r.status === 'fulfilled' ? r.value.results.length : 0), 0
      );

      expect(totalEnrolled).toBeLessThanOrEqual(30);
    });
  });

  describe('Cross-school validation integration', () => {
    it('should prevent enrollment across different schools', async () => {
      const teacherFromSchoolA = createMockTeacher({ school_id: 'school-a' });
      const classFromSchoolB = createMockClass({ school_id: 'school-b' });
      const studentFromSchoolA = createMockStudent({ school_id: 'school-a' });

      const teacherProfileQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { school_id: teacherFromSchoolA.school_id },
          error: null
        })
      };

      const classQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { ...classFromSchoolB, school_id: classFromSchoolB.school_id },
          error: null
        })
      };

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'profiles') return teacherProfileQuery as any;
        if (table === 'classes') return classQuery as any;
        return { select: jest.fn().mockReturnThis(), eq: jest.fn().mockReturnThis() } as any;
      });

      await expect(ClassService.bulkEnrollStudents(
        classFromSchoolB.id,
        { student_ids: [studentFromSchoolA.id] },
        teacherFromSchoolA.id
      )).rejects.toThrow('CROSS_SCHOOL_ENROLLMENT');
    });

    it('should validate school consistency across all operations', async () => {
      const teacher = createMockTeacher();
      const classData = createMockClass({ school_id: teacher.school_id });
      const student = createMockStudent({ school_id: 'different-school' });

      const teacherProfileQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { school_id: teacher.school_id },
          error: null
        })
      };

      const classQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { ...classData, school_id: teacher.school_id },
          error: null
        })
      };

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'profiles') return teacherProfileQuery as any;
        if (table === 'classes') return classQuery as any;
        return { select: jest.fn().mockReturnThis(), eq: jest.fn().mockReturnThis() } as any;
      });

      mockSupabase.rpc.mockResolvedValue({
        data: [{
          results: [],
          errors: [{
            student_id: student.id,
            error: 'Student belongs to different school'
          }],
          enrolled_count: 0
        }],
        error: null
      } as any);

      const result = await ClassService.bulkEnrollStudents(classData.id, { student_ids: [student.id] }, teacher.id);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].error).toContain('different school');
    });
  });

  describe('Performance and scalability tests', () => {
    it('should handle large dataset queries efficiently', async () => {
      const teacher = createMockTeacher();
      const students = generateLargeStudentList(1000);
      const classData = createMockClass({ school_id: teacher.school_id });

      const teacherProfileQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { school_id: teacher.school_id },
          error: null
        })
      };

      const availableStudentsQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        not: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValue({
          data: students.slice(0, 50),
          count: 1000,
          error: null
        })
      };

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'profiles') return teacherProfileQuery as any;
        if (table === 'students') return availableStudentsQuery as any;
        return { select: jest.fn().mockReturnThis(), eq: jest.fn().mockReturnThis() } as any;
      });

      const startTime = Date.now();
      const result = await ClassEnrollmentService.getAvailableStudents(classData.id, teacher.id, {
        limit: 50,
        page: 1
      });
      const endTime = Date.now();

      expect(result.students).toHaveLength(50);
      expect(result.total).toBe(1000);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });

    it('should handle bulk enrollment with pagination', async () => {
      const teacher = createMockTeacher();
      const students = generateLargeStudentList(500);
      const classData = createMockClass({ school_id: teacher.school_id });

      const teacherProfileQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { school_id: teacher.school_id },
          error: null
        })
      };

      const classQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { ...classData, school_id: teacher.school_id },
          error: null
        })
      };

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'profiles') return teacherProfileQuery as any;
        if (table === 'classes') return classQuery as any;
        return { select: jest.fn().mockReturnThis(), eq: jest.fn().mockReturnThis() } as any;
      });

      // Process in batches of 50
      const batchSize = 50;
      const batches = [];
      for (let i = 0; i < students.length; i += batchSize) {
        batches.push(students.slice(i, i + batchSize).map(s => s.id));
      }

      const results = await Promise.all(
        batches.map(batch =>
          ClassService.bulkEnrollStudents(classData.id, { student_ids: batch }, teacher.id)
        )
      );

      const totalEnrolled = results.reduce((sum: number, result: any) => sum + result.results.length, 0);
      expect(totalEnrolled).toBe(500);
    });
  });

  describe('Error recovery and resilience tests', () => {
    it('should recover from network failures with retry logic', async () => {
      const teacher = createMockTeacher();
      const student = createMockStudent();
      const classData = createMockClass({ school_id: teacher.school_id });

      let accessCheckAttempt = 0;
      let enrollmentAttempt = 0;

      // Mock access control to succeed
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'teacher_profiles') {
          accessCheckAttempt++;
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: { school_id: teacher.school_id },
              error: null
            })
          } as any;
        }

        if (table === 'classes') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: { ...classData, school_id: teacher.school_id },
              error: null
            })
          } as any;
        }

        if (table === 'class_teachers') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: { class_id: classData.id, teacher_id: teacher.id },
              error: null
            })
          } as any;
        }

        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: null, error: null })
        } as any;
      });

      // Mock RPC to fail twice, then succeed (testing retry logic)
      mockSupabase.rpc.mockImplementation(() => {
        enrollmentAttempt++;
        if (enrollmentAttempt <= 2) {
          // Simulate network timeout for first two attempts
          const networkError = new Error('Network timeout');
          (networkError as any).code = 'NETWORK_ERROR';
          return Promise.reject(networkError) as any;
        }
        // Third attempt succeeds
        return Promise.resolve({
          data: [{
            results: [student.id],
            errors: [],
            enrolled_count: 1
          }],
          error: null
        }) as any;
      });

      // The service should now succeed after retries
      const result = await ClassService.bulkEnrollStudents(classData.id, { student_ids: [student.id] }, teacher.id);

      expect(result.results).toContain(student.id);
      expect(result.errors).toHaveLength(0);
      expect(enrollmentAttempt).toBe(3); // Should have retried twice before succeeding
    });

    it('should fail after exhausting all retry attempts', async () => {
      const teacher = createMockTeacher();
      const student = createMockStudent();
      const classData = createMockClass({ school_id: teacher.school_id });

      // Mock access control to succeed
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'teacher_profiles') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: { school_id: teacher.school_id },
              error: null
            })
          } as any;
        }

        if (table === 'classes') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: { ...classData, school_id: teacher.school_id },
              error: null
            })
          } as any;
        }

        if (table === 'class_teachers') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: { class_id: classData.id, teacher_id: teacher.id },
              error: null
            })
          } as any;
        }

        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: null, error: null })
        } as any;
      });

      // Mock RPC to always fail (testing retry exhaustion)
      mockSupabase.rpc.mockImplementation(() => {
        const networkError = new Error('Network timeout');
        (networkError as any).code = 'NETWORK_ERROR';
        return Promise.reject(networkError) as any;
      });

      // Should fail with NETWORK_ERROR after all retries are exhausted
      await expect(ClassService.bulkEnrollStudents(classData.id, { student_ids: [student.id] }, teacher.id))
        .rejects.toThrow('Network connection failed after retries');
    });

    it('should maintain data consistency during partial failures', async () => {
      const teacher = createMockTeacher();
      const students = generateLargeStudentList(100);
      const classData = createMockClass({ school_id: teacher.school_id });

      const teacherProfileQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { school_id: teacher.school_id },
          error: null
        })
      };

      const classQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { ...classData, school_id: teacher.school_id },
          error: null
        })
      };

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'profiles') return teacherProfileQuery as any;
        if (table === 'classes') return classQuery as any;
        return { select: jest.fn().mockReturnThis(), eq: jest.fn().mockReturnThis() } as any;
      });

      // Simulate partial failure - some students succeed, some fail
      const successfulStudents = students.slice(0, 75).map(s => s.id);
      const failedStudents = students.slice(75).map(s => s.id);

      mockSupabase.rpc.mockResolvedValue({
        data: [{
          results: successfulStudents,
          errors: failedStudents.map(id => ({ student_id: id, error: 'Database constraint violation' }))
        }],
        error: null
      } as any);

      const result = await ClassService.bulkEnrollStudents(
        classData.id,
        { student_ids: students.map(s => s.id) },
        teacher.id
      );

      expect(result.results).toHaveLength(75);
      expect(result.errors).toHaveLength(25);
    });
  });
});