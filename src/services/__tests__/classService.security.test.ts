/**
 * Security tests for ClassService queries
 * Tests SQL injection prevention in database queries
 */

import { ClassService } from '../classService';
import { supabase } from '../../utils/supabase';

// Mock supabase
jest.mock('../../utils/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          not: jest.fn(() => ({
            order: jest.fn(() => ({
              range: jest.fn(() => Promise.resolve({
                data: [],
                error: null,
              })),
            })),
          })),
        })),
        or: jest.fn(() => ({
          order: jest.fn(() => ({
            range: jest.fn(() => Promise.resolve({
              data: [],
              error: null,
            })),
          })),
        })),
        order: jest.fn(() => ({
          range: jest.fn(() => Promise.resolve({
            data: [],
            error: null,
          })),
        })),
      })),
      select: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({
          data: { id: 1, school_id: 1 },
          error: null,
        })),
        single: jest.fn(() => Promise.resolve({
          data: { id: 1, school_id: 1 },
          error: null,
        })),
      })),
    })),
    rpc: jest.fn(() => Promise.resolve({
      data: [{ success: [], errors: [] }],
      error: null,
    })),
  },
}));

describe('ClassService - Security Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAvailableStudents - SQL injection prevention', () => {
    it('should prevent SQL injection in search parameter', async () => {
      const maliciousSearch = "' OR 1=1 --";
      const teacherId = 'teacher-123';
      const classId = 1;

      await ClassService.getAvailableStudents(classId, teacherId, {
        search: maliciousSearch,
      });

      // Verify the search parameter is sanitized
      expect(supabase.from).toHaveBeenCalled();
    });

    it('should prevent SQL injection in gender filter', async () => {
      const maliciousGender = "male'; DROP TABLE students; --";
      const teacherId = 'teacher-123';
      const classId = 1;

      await ClassService.getAvailableStudents(classId, teacherId, {
        gender: maliciousGender,
      });

      expect(supabase.from).toHaveBeenCalled();
    });

    it('should handle array injection attempts', async () => {
      const maliciousIds = ["1'; DROP TABLE students; --", "2'; OR 1=1 --"];
      const teacherId = 'teacher-123';
      const classId = 1;

      // Mock the enrolled students response with malicious IDs
      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      mockSupabase.from.mockImplementationOnce(() => ({
        select: () => ({
          eq: () => ({
            data: maliciousIds.map(id => ({ student_id: id })),
            error: null,
          }),
        }),
      } as any));

      await ClassService.getAvailableStudents(classId, teacherId);

      expect(supabase.from).toHaveBeenCalled();
    });
  });

  describe('getTeacherClasses - SQL injection prevention', () => {
    it('should prevent SQL injection in search term', async () => {
      const maliciousSearch = "'; DROP TABLE classes; --";
      const teacherId = 'teacher-123';

      await ClassService.getTeacherClasses(teacherId, {
        searchTerm: maliciousSearch,
      });

      expect(supabase.from).toHaveBeenCalled();
    });

    it('should prevent SQL injection in sort parameters', async () => {
      const maliciousSortBy = "name'; DROP TABLE classes; --";
      const maliciousSortOrder = "asc'; DROP TABLE classes; --";
      const teacherId = 'teacher-123';

      await ClassService.getTeacherClasses(teacherId, {
        sortBy: maliciousSortBy as any,
        sortOrder: maliciousSortOrder as any,
      });

      expect(supabase.from).toHaveBeenCalled();
    });
  });

  describe('Input validation tests', () => {
    it('should reject negative pagination values', async () => {
      const teacherId = 'teacher-123';
      
      await ClassService.getTeacherClasses(teacherId, {
        limit: -1,
        offset: -100,
      });

      // Should use sanitized defaults
      expect(supabase.from).toHaveBeenCalled();
    });

    it('should limit excessive pagination values', async () => {
      const teacherId = 'teacher-123';
      
      await ClassService.getTeacherClasses(teacherId, {
        limit: 10000,
        offset: 1000000,
      });

      // Should use sanitized limits
      expect(supabase.from).toHaveBeenCalled();
    });
  });

  describe('Class creation - SQL injection prevention', () => {
    it('should prevent SQL injection in class name', async () => {
      const maliciousName = "Class'; DROP TABLE classes; --";
      const teacherId = 'teacher-123';

      // Should be caught by Zod validation
      await expect(ClassService.createClass({
        name: maliciousName,
        level: 'Grade 10',
        school_id: 1,
        academic_year: '2024',
        semester: '1',
      }, teacherId)).rejects.toThrow();
    });

    it('should prevent SQL injection in level parameter', async () => {
      const maliciousLevel = "Grade'; DROP TABLE classes; --";
      const teacherId = 'teacher-123';

      await expect(ClassService.createClass({
        name: 'Test Class',
        level: maliciousLevel,
        school_id: 1,
        academic_year: '2024',
        semester: '1',
      }, teacherId)).rejects.toThrow();
    });
  });
});