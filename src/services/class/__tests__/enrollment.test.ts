/**
 * Tests for ClassEnrollmentService
 * Focuses on the enrollStudent method and its use of atomic enrollment
 * Also includes tests for SQL injection prevention in getClassStudents
 */

import { ClassEnrollmentService } from '../enrollment';
import { supabase } from '../../../utils/supabase';

// Mock supabase
jest.mock('../../../utils/supabase', () => ({
  supabase: {
    from: jest.fn(),
    rpc: jest.fn(),
  },
}));

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('ClassEnrollmentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getClassStudents', () => {
    const classId = 1;
    const teacherId = 'teacher-123';

    it('should properly escape malicious search terms to prevent SQL injection', async () => {
      // Mock the query builder chain
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValue({
          data: [],
          count: 0,
          error: null
        }),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: null
        })
      };

      mockSupabase.from.mockReturnValue(mockQuery as any);

      // Search term with SQL injection attempt
      const maliciousSearchTerm = '";\'--; DROP TABLE students;';
      
      await ClassEnrollmentService.getClassStudents(classId, teacherId, {
        searchTerm: maliciousSearchTerm
      });

      // Verify the or method was called with properly escaped parameters
      expect(mockQuery.or).toHaveBeenCalled();
      const orCallArg = mockQuery.or.mock.calls[0][0];
      
      // Instead of checking the exact string which causes escaping issues,
      // verify key aspects of proper escaping
      
      // 1. Verify the malicious content is present but properly escaped
      expect(orCallArg).toContain('DROP TABLE students');
      
      // 2. Verify double quotes are doubled (" becomes "")
      expect(orCallArg).toContain('""');
      
      // 3. Verify the pattern is wrapped in double quotes (indicating proper escaping)
      expect(orCallArg).toMatch(/\.ilike\.".*"/);
      
      // Verify the structure of the OR condition
      expect(orCallArg.split(',').length).toBe(2); // Should have two conditions
      expect(orCallArg).toMatch(/profiles\.full_name\.ilike\./); // Should have full_name condition
      expect(orCallArg).toMatch(/profiles\.student_details\.nis\.ilike\./); // Should have nis condition
    });

    it('should handle empty search terms gracefully', async () => {
      // Mock the query builder chain
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValue({
          data: [],
          count: 0,
          error: null
        }),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: null
        })
      };

      mockSupabase.from.mockReturnValue(mockQuery as any);
      
      // Empty search term
      await ClassEnrollmentService.getClassStudents(classId, teacherId, {
        searchTerm: ''
      });

      // Verify the or method was NOT called for empty search term
      expect(mockQuery.or).not.toHaveBeenCalled();
    });
  });
  
  describe('enrollStudent', () => {
    const classId = 1;
    const teacherId = 'teacher-123';
    const enrollmentData = {
      student_id: 'student-456',
      enrollment_date: '2024-01-15T10:00:00.000Z',
      notes: 'Test enrollment'
    };

    it('should successfully enroll student using atomic function', async () => {
      // Mock teacher profile query
      const teacherQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { school_id: 'school-1' },
          error: null
        })
      };
      mockSupabase.from.mockReturnValue(teacherQuery as any);

      // Mock atomic function call
      mockSupabase.rpc.mockResolvedValue({
        data: [{
          success: ['student-456'],
          errors: [],
          enrolled_count: 1
        }],
        error: null,
        count: null,
        status: 200,
        statusText: 'OK'
      } as any);

      await ClassEnrollmentService.enrollStudent(classId, enrollmentData, teacherId);

      // Verify atomic function was called with correct parameters
      expect(mockSupabase.rpc).toHaveBeenCalledWith('add_students_to_class_atomic', {
        p_class_id: classId,
        p_student_ids: [enrollmentData.student_id],
        p_teacher_id: teacherId,
        p_school_id: 'school-1'
      });
    });

    it('should throw CLASS_CAPACITY_EXCEEDED when capacity is exceeded', async () => {
      // Mock teacher profile query
      const teacherQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { school_id: 'school-1' },
          error: null
        })
      };
      mockSupabase.from.mockReturnValue(teacherQuery as any);

      // Mock atomic function call with capacity error
      mockSupabase.rpc.mockResolvedValue({
        data: [{
          success: [],
          errors: [{
            student_id: 'student-456',
            error: 'Class capacity exceeded'
          }],
          enrolled_count: 0
        }],
        error: null,
        count: null,
        status: 200,
        statusText: 'OK'
      } as any);

      await expect(
        ClassEnrollmentService.enrollStudent(classId, enrollmentData, teacherId)
      ).rejects.toMatchObject({
        code: 'CLASS_CAPACITY_EXCEEDED'
      });
    });

    it('should throw STUDENT_ALREADY_ENROLLED when student is already enrolled', async () => {
      // Mock teacher profile query
      const teacherQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { school_id: 'school-1' },
          error: null
        })
      };
      mockSupabase.from.mockReturnValue(teacherQuery as any);

      // Mock atomic function call with already enrolled error
      mockSupabase.rpc.mockResolvedValue({
        data: [{
          success: [],
          errors: [{
            student_id: 'student-456',
            error: 'Student already enrolled in this class'
          }],
          enrolled_count: 0
        }],
        error: null,
        count: null,
        status: 200,
        statusText: 'OK'
      } as any);

      await expect(
        ClassEnrollmentService.enrollStudent(classId, enrollmentData, teacherId)
      ).rejects.toMatchObject({
        code: 'STUDENT_ALREADY_ENROLLED'
      });
    });

    it('should throw TEACHER_NOT_FOUND when teacher profile is not found', async () => {
      // Mock teacher profile query returning null
      const teacherQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: null
        })
      };
      mockSupabase.from.mockReturnValue(teacherQuery as any);

      await expect(
        ClassEnrollmentService.enrollStudent(classId, enrollmentData, teacherId)
      ).rejects.toMatchObject({
        code: 'TEACHER_NOT_FOUND'
      });
    });

    it('should throw ENROLLMENT_FAILED when atomic function fails', async () => {
      // Mock teacher profile query
      const teacherQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { school_id: 'school-1' },
          error: null
        })
      };
      mockSupabase.from.mockReturnValue(teacherQuery as any);

      // Mock atomic function call with database error
      mockSupabase.rpc.mockResolvedValue({
        data: null,
        error: {
          message: 'Database connection failed',
          details: 'Connection timeout',
          hint: 'Check network connectivity',
          code: 'CONNECTION_ERROR'
        },
        count: null,
        status: 500,
        statusText: 'Internal Server Error'
      } as any);

      await expect(
        ClassEnrollmentService.enrollStudent(classId, enrollmentData, teacherId)
      ).rejects.toMatchObject({
        code: 'ENROLLMENT_FAILED'
      });
    });
  });
});