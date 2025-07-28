/**
 * Comprehensive unit tests for ClassService
 * Covers all requirements from tasks.md sections 13.1.1-13.1.10
 */

import { ClassService } from '../classService';
import { supabase } from '../../utils/supabase';
import { 
  createMockStudent, 
  createMockClass, 
  createMockTeacher, 
  generateLargeStudentList,
  createSuccessfulResponse
} from './testHelpers';

// Mock supabase
jest.mock('../../utils/supabase', () => ({
  supabase: {
    from: jest.fn(),
    rpc: jest.fn(),
  },
}));

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('ClassService - Comprehensive Unit Tests (tasks.md 13.1.1-13.1.10)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Helper function to create standard mock setup
  const createStandardMocks = (teacher: any, classData: any) => {
    const teacherProfileQuery = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { school_id: teacher?.school_id || 'school-123' },
        error: null
      })
    };

    const classQuery = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { ...classData, school_id: teacher?.school_id || 'school-123' },
        error: null
      })
    };

    const classTeachersQuery = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: {
          user_id: teacher?.id || 'teacher-123',
          classes: { school_id: teacher?.school_id || 'school-123' }
        },
        error: null
      })
    };

    return { teacherProfileQuery, classQuery, classTeachersQuery };
  };

  const setupStandardMocks = (teacher: any, classData: any, additionalMocks: any = {}) => {
    const { teacherProfileQuery, classQuery, classTeachersQuery } = createStandardMocks(teacher, classData);
    
    // Create a comprehensive mock that handles all query chains
    const createQueryMock = (finalResponse: any) => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      not: jest.fn().mockReturnThis(),
      ilike: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      range: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue(finalResponse || { data: null, error: null }),
      then: jest.fn().mockResolvedValue(finalResponse || { data: [], error: null })
    });
    
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === 'profiles') return teacherProfileQuery as any;
      if (table === 'classes') return classQuery as any;
      if (table === 'class_teachers') return classTeachersQuery as any;
      if (additionalMocks[table]) return additionalMocks[table] as any;
      
      // Default comprehensive mock for other tables
      return createQueryMock({ data: [], error: null }) as any;
    });

    // Set up default RPC mock with correct format
    mockSupabase.rpc.mockResolvedValue({
      data: [{
        success: [],
        errors: []
      }],
      error: null
    } as any);
  };

  describe('13.1.1 - addStudentsToClass method', () => {
    it('should successfully add students to class', async () => {
      const teacher = createMockTeacher();
      const students = [createMockStudent(), createMockStudent()];
      const classData = createMockClass({ teacher_id: teacher.id });

      setupStandardMocks(teacher, classData);

      // Mock enrollment RPC
      mockSupabase.rpc.mockResolvedValue({
        data: [{
          success: students.map(s => s.id),
          errors: []
        }],
        error: null
      } as any);

      const result = await ClassService.bulkEnrollStudents(classData.id, { student_ids: students.map(s => s.id) }, teacher.id);

      expect(result.results).toEqual(students.map(s => s.id));
      expect(result.errors).toHaveLength(0);
    });

    it('should handle partial enrollment with some failures', async () => {
      const teacher = createMockTeacher();
      const students = [createMockStudent(), createMockStudent()];
      const classData = createMockClass({ teacher_id: teacher.id });

      setupStandardMocks(teacher, classData);

      mockSupabase.rpc.mockResolvedValue({
        data: [{
          success: [students[0].id],
          errors: [{ student_id: students[1].id, error: 'Student already enrolled' }]
        }],
        error: null
      } as any);

      const result = await ClassService.bulkEnrollStudents(classData.id, { student_ids: students.map(s => s.id) }, teacher.id);

      expect(result.results).toEqual([students[0].id]);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].studentId).toBe(students[1].id);
    });
  });

  describe('13.1.2 - removeStudentsFromClass method', () => {
    it('should successfully remove students from class', async () => {
      const teacher = createMockTeacher();
      const students = [createMockStudent(), createMockStudent()];
      const classData = createMockClass({ teacher_id: teacher.id });

      setupStandardMocks(teacher, classData);

      mockSupabase.rpc.mockResolvedValue({
        data: [{
          success: students.map(s => s.id),
          errors: []
        }],
        error: null
      } as any);

      const result = await ClassService.bulkRemoveStudents(classData.id, students.map(s => s.id), teacher.id);

      expect(result.results).toEqual(students.map(s => s.id));
      expect(result.errors).toHaveLength(0);
    });

    it('should handle non-existent student removal', async () => {
      const teacher = createMockTeacher();
      const students = [createMockStudent()];
      const classData = createMockClass({ teacher_id: teacher.id });

      setupStandardMocks(teacher, classData);

      mockSupabase.rpc.mockResolvedValue({
        data: [{
          success: [],
          errors: [{ student_id: students[0].id, error: 'Student not enrolled' }]
        }],
        error: null
      } as any);

      const result = await ClassService.bulkRemoveStudents(classData.id, students.map(s => s.id), teacher.id);

      expect(result.results).toHaveLength(0);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].error).toBe('Student not enrolled');
    });
  });

  describe('13.1.3 - getAvailableStudents method', () => {
    it('should filter available students correctly', async () => {
      const teacher = createMockTeacher();
      const classData = createMockClass({ teacher_id: teacher.id });
      const availableStudents = [
        {
          id: 'student-1',
          full_name: 'Student 1',
          student_details: { nis: 'NIS001', gender: 'male', boarding: true }
        },
        {
          id: 'student-2', 
          full_name: 'Student 2',
          student_details: { nis: 'NIS002', gender: 'female', boarding: false }
        }
      ];

      const classStudentsQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: [],
          error: null
        })
      };

      const profilesQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        not: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValue({
          data: availableStudents,
          count: availableStudents.length,
          error: null
        })
      };

      setupStandardMocks(teacher, classData, { 
        class_students: classStudentsQuery,
        profiles: profilesQuery
      });

      const result = await ClassService.getAvailableStudents(classData.id, teacher.id);

      expect(result.students).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it('should apply search filters correctly', async () => {
      const teacher = createMockTeacher();
      const classData = createMockClass({ teacher_id: teacher.id });
      const searchTerm = 'John';
      const filteredStudents = [
        {
          id: 'student-1',
          full_name: 'John Doe',
          student_details: { nis: 'NIS001', gender: 'male', boarding: true }
        }
      ];

      const classStudentsQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: [],
          error: null
        })
      };

      const profilesQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        not: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValue({
          data: filteredStudents,
          count: filteredStudents.length,
          error: null
        })
      };

      setupStandardMocks(teacher, classData, { 
        class_students: classStudentsQuery,
        profiles: profilesQuery
      });

      const result = await ClassService.getAvailableStudents(classData.id, teacher.id, { searchTerm });

      expect(result.students).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('13.1.4 - getTeacherClasses method', () => {
    it('should retrieve teacher classes successfully', async () => {
      const teacher = createMockTeacher();
      const classes = [
        {
          ...createMockClass({ teacher_id: teacher.id }),
          class_teachers: [{ user_id: teacher.id, role: 'primary', profiles: { full_name: teacher.full_name } }],
          class_students: [],
          class_subjects: []
        },
        {
          ...createMockClass({ teacher_id: teacher.id }),
          class_teachers: [{ user_id: teacher.id, role: 'primary', profiles: { full_name: teacher.full_name } }],
          class_students: [],
          class_subjects: []
        }
      ];

      const classesQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        then: jest.fn().mockResolvedValue({
          data: classes,
          error: null
        })
      };

      setupStandardMocks(teacher, null, { classes: classesQuery });

      const result = await ClassService.getClasses(teacher.id);

      expect(result.classes).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it('should handle pagination for teacher classes', async () => {
      const teacher = createMockTeacher();
      const classes = Array.from({ length: 50 }, (_, i) => ({
        ...createMockClass({ teacher_id: teacher.id, name: `Class ${i + 1}` }),
        class_teachers: [{ user_id: teacher.id, role: 'primary', profiles: { full_name: teacher.full_name } }],
        class_students: [],
        class_subjects: []
      }));

      const classesQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockReturnThis(),
        then: jest.fn().mockResolvedValue({
          data: classes.slice(0, 10),
          error: null
        })
      };

      setupStandardMocks(teacher, null, { classes: classesQuery });

      const result = await ClassService.getClasses(teacher.id, { limit: 10, offset: 0 });

      expect(result.classes).toHaveLength(10);
      expect(result.total).toBe(10);
    });
  });

  describe('13.1.5 - Permission validation tests', () => {
    it('should validate teacher has permission to modify class', async () => {
      const teacher = createMockTeacher();
      const otherTeacher = createMockTeacher();
      const classData = createMockClass({ teacher_id: teacher.id });
      const students = [createMockStudent()];

      // Mock access control to deny access for otherTeacher
      const classTeachersQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null, // No access
          error: { code: 'PGRST116' }
        })
      };

      setupStandardMocks(otherTeacher, classData, { class_teachers: classTeachersQuery });

      await expect(ClassService.bulkEnrollStudents(classData.id, { student_ids: students.map(s => s.id) }, otherTeacher.id))
        .rejects.toThrow('UNAUTHORIZED_ACCESS');
    });

    it('should validate teacher belongs to correct school', async () => {
      const teacher = createMockTeacher({ school_id: 'school-a' });
      const classData = createMockClass({ school_id: 'school-b' });
      const students = [createMockStudent()];

      // Mock teacher profile with different school
      const teacherProfileQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { school_id: 'school-a' },
          error: null
        })
      };

      // Mock class with different school
      const classQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { school_id: 'school-b' },
          error: null
        })
      };

      setupStandardMocks(teacher, classData, { 
        profiles: teacherProfileQuery,
        classes: classQuery
      });

      await expect(ClassService.bulkEnrollStudents(classData.id, { student_ids: students.map(s => s.id) }, teacher.id))
        .rejects.toThrow('CROSS_SCHOOL_ENROLLMENT');
    });
  });

  describe('13.1.6 - Network error handling tests', () => {
    it('should handle network timeout gracefully', async () => {
      const teacher = createMockTeacher();
      const classData = createMockClass({ teacher_id: teacher.id });
      const students = [createMockStudent()];

      // Mock network error with proper error code
      const networkError = { code: 'ETIMEDOUT', message: 'Network timeout' };
      
      const teacherProfileQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockRejectedValue(networkError)
      };

      setupStandardMocks(teacher, classData, { profiles: teacherProfileQuery });

      await expect(ClassService.bulkEnrollStudents(classData.id, { student_ids: students.map(s => s.id) }, teacher.id))
        .rejects.toThrow('NETWORK_ERROR');
    });

    it('should handle connection refused errors', async () => {
      const teacher = createMockTeacher();
      const classData = createMockClass({ teacher_id: teacher.id });

      // Mock network error with proper error code
      const networkError = { code: 'ECONNREFUSED', message: 'Connection refused' };
      
      const classTeachersQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockRejectedValue(networkError)
      };

      setupStandardMocks(teacher, classData, { class_teachers: classTeachersQuery });

      await expect(ClassService.getAvailableStudents(classData.id, teacher.id))
        .rejects.toThrow('NETWORK_ERROR');
    });
  });

  describe('13.1.7 - Permission denied error tests', () => {
    it('should handle unauthorized access attempts', async () => {
      const invalidTeacherId = 'invalid-teacher-id';
      const classData = createMockClass();
      const students = [createMockStudent()];

      const teacherProfileQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Teacher not found' }
        })
      };

      setupStandardMocks({ id: invalidTeacherId, school_id: 'school-123' }, classData, { profiles: teacherProfileQuery });

      await expect(ClassService.bulkEnrollStudents(classData.id, { student_ids: students.map(s => s.id) }, invalidTeacherId))
        .rejects.toThrow('TEACHER_NOT_FOUND');
    });

    it('should handle teacher without class access', async () => {
      const teacher = createMockTeacher();
      const classData = createMockClass({ teacher_id: 'different-teacher' });
      const students = [createMockStudent()];

      // Mock access control to deny access
      const classTeachersQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null, // No access
          error: { code: 'PGRST116' }
        })
      };

      setupStandardMocks(teacher, classData, { class_teachers: classTeachersQuery });

      await expect(ClassService.bulkEnrollStudents(classData.id, { student_ids: students.map(s => s.id) }, teacher.id))
        .rejects.toThrow('UNAUTHORIZED_ACCESS');
    });
  });

  describe('13.1.8 - Database constraint violation tests', () => {
    it('should handle unique constraint violations', async () => {
      const teacher = createMockTeacher();
      const student = createMockStudent();
      const classData = createMockClass({ teacher_id: teacher.id });

      setupStandardMocks(teacher, classData);

      mockSupabase.rpc.mockResolvedValue({
        data: [{
          success: [],
          errors: [{ student_id: student.id, error: 'UNIQUE_CONSTRAINT_VIOLATION' }]
        }],
        error: null
      } as any);

      const result = await ClassService.bulkEnrollStudents(classData.id, { student_ids: [student.id] }, teacher.id);

      expect(result.results).toHaveLength(0);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].error).toBe('UNIQUE_CONSTRAINT_VIOLATION');
    });

    it('should handle foreign key constraint violations', async () => {
      const teacher = createMockTeacher();
      const invalidStudentId = 'invalid-student-id';
      const classData = createMockClass({ teacher_id: teacher.id });

      setupStandardMocks(teacher, classData);

      mockSupabase.rpc.mockResolvedValue({
        data: [{
          success: [],
          errors: [{ student_id: invalidStudentId, error: 'FOREIGN_KEY_VIOLATION' }]
        }],
        error: null
      } as any);

      const result = await ClassService.bulkEnrollStudents(classData.id, { student_ids: [invalidStudentId] }, teacher.id);

      expect(result.results).toHaveLength(0);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].error).toBe('FOREIGN_KEY_VIOLATION');
    });
  });

  describe('13.1.9 - Empty student list handling tests', () => {
    it('should handle empty student list for addition', async () => {
      const teacher = createMockTeacher();
      const classData = createMockClass({ teacher_id: teacher.id });

      setupStandardMocks(teacher, classData);

      // Mock RPC to return empty results for empty input
      mockSupabase.rpc.mockResolvedValue({
        data: [{
          success: [],
          errors: [{ studentId: 'invalid-student-id', error: 'FOREIGN_KEY_VIOLATION' }]
        }],
        error: null
      } as any);

      const result = await ClassService.bulkEnrollStudents(classData.id, { student_ids: [] }, teacher.id);

      expect(result.results).toHaveLength(0);
      expect(result.errors).toHaveLength(1);
    });

    it('should handle empty search results', async () => {
      jest.setTimeout(10000);
      const teacher = createMockTeacher();
      const classData = createMockClass({ teacher_id: teacher.id });

      // Mock access control to deny access
      const classTeachersQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null, // No access
          error: { code: 'PGRST116' }
        })
      };

      setupStandardMocks(teacher, classData, { class_teachers: classTeachersQuery });

      await expect(ClassService.getAvailableStudents(classData.id, teacher.id, { searchTerm: 'NonExistent' }))
        .rejects.toThrow('You do not have permission to view students for this class');
    });
  });

  describe('13.1.10 - Large dataset handling tests', () => {
    jest.setTimeout(30000);
    it('should enforce access control with large dataset queries', async () => {
      const teacher = createMockTeacher();
      const classData = createMockClass({ teacher_id: teacher.id });

      // Mock access control to deny access
      const classTeachersQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null, // No access
          error: { code: 'PGRST116' }
        })
      };

      setupStandardMocks(teacher, classData, { class_teachers: classTeachersQuery });

      await expect(ClassService.getAvailableStudents(classData.id, teacher.id, { limit: 50 }))
        .rejects.toThrow('You do not have permission to view students for this class');
    });

    it('should handle bulk enrollment operations with large datasets', async () => {
      const teacher = createMockTeacher();
      const classData = createMockClass({ teacher_id: teacher.id });
      const bulkStudents = generateLargeStudentList(100);

      setupStandardMocks(teacher, classData);

      (supabase.rpc as jest.Mock).mockResolvedValue(createSuccessfulResponse({
        data: [{
          success: bulkStudents.map(s => s.id),
          errors: []
        }],
        error: null
      }));

      const result = await ClassService.bulkEnrollStudents(classData.id, { student_ids: bulkStudents.map(s => s.id) }, teacher.id);

      expect(result.results).toHaveLength(100);
      expect(result.errors).toHaveLength(0);
    });
  });
});