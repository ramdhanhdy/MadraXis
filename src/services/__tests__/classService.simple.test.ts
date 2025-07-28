/**
 * Simplified ClassService tests focusing on core functionality
 * This test file provides basic coverage while avoiding complex mock setups
 */

import { ClassService } from '../classService';
import { supabase } from '../../utils/supabase';

// Mock supabase
jest.mock('../../utils/supabase', () => ({
  supabase: {
    from: jest.fn(),
    rpc: jest.fn(),
  },
}));

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('ClassService - Simplified Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Bulk Enrollment Operations', () => {
    it('should handle successful bulk enrollment', async () => {
      let callCount = 0;
      
      // Mock queries to handle multiple sequential calls
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockImplementation(() => {
          callCount++;
          if (callCount === 1) {
            // First call: teacher profile
            return Promise.resolve({
              data: { school_id: 'school-123' },
              error: null
            });
          } else if (callCount === 2) {
            // Second call: class data
            return Promise.resolve({
              data: { school_id: 'school-123' },
              error: null
            });
          }
          return Promise.resolve({ data: null, error: null });
        })
      };

      mockSupabase.from.mockReturnValue(mockQuery as any);
      
      // Mock RPC for bulk enrollment
      mockSupabase.rpc.mockResolvedValue({
        data: [{
          success: ['student-1', 'student-2'],
          errors: []
        }],
        error: null,
        count: null,
        status: 200,
        statusText: 'OK'
      });

      const result = await ClassService.bulkEnrollStudents(
        1, 
        { student_ids: ['student-1', 'student-2'] }, 
        'teacher-123'
      );

      expect(result.results).toEqual(['student-1', 'student-2']);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle enrollment errors', async () => {
      let callCount = 0;
      
      // Mock queries to handle multiple sequential calls
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockImplementation(() => {
          callCount++;
          if (callCount === 1) {
            // First call: teacher profile
            return Promise.resolve({
              data: { school_id: 'school-123' },
              error: null
            });
          } else if (callCount === 2) {
            // Second call: class data
            return Promise.resolve({
              data: { school_id: 'school-123' },
              error: null
            });
          }
          return Promise.resolve({ data: null, error: null });
        })
      };

      mockSupabase.from.mockReturnValue(mockQuery as any);
      
      // Mock RPC with errors
      mockSupabase.rpc.mockResolvedValue({
        data: [{
          success: ['student-1'],
          errors: [{ student_id: 'student-2', error: 'Student already enrolled' }]
        }],
        error: null,
        count: null,
        status: 200,
        statusText: 'OK'
      });

      const result = await ClassService.bulkEnrollStudents(
        1, 
        { student_ids: ['student-1', 'student-2'] }, 
        'teacher-123'
      );

      expect(result.results).toEqual(['student-1']);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].studentId).toBe('student-2');
    });
  });

  describe('Bulk Removal Operations', () => {
    it('should handle successful bulk removal', async () => {
      // Mock access control queries
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { user_id: 'teacher-123', classes: { school_id: 'school-123' } },
          error: null
        }),
        delete: jest.fn().mockReturnThis(),
        then: jest.fn().mockResolvedValue({ error: null })
      };

      mockSupabase.from.mockReturnValue(mockQuery as any);

      const result = await ClassService.bulkRemoveStudents(
        1, 
        ['student-1', 'student-2'], 
        'teacher-123'
      );

      expect(result.results).toEqual(['student-1', 'student-2']);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle teacher not found errors', async () => {
      // Mock teacher profile query to return null
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Teacher not found' }
        })
      };

      mockSupabase.from.mockReturnValue(mockQuery as any);

      await expect(
        ClassService.bulkEnrollStudents(1, { student_ids: ['student-1'] }, 'invalid-teacher')
      ).rejects.toThrow('Teacher profile not found');
    });

    it('should handle cross-school enrollment errors', async () => {
      let callCount = 0;
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockImplementation(() => {
          callCount++;
          if (callCount === 1) {
            // Teacher profile
            return Promise.resolve({
              data: { school_id: 'school-a' },
              error: null
            });
          } else {
            // Class data
            return Promise.resolve({
              data: { school_id: 'school-b' },
              error: null
            });
          }
        })
      };

      mockSupabase.from.mockReturnValue(mockQuery as any);

      await expect(
        ClassService.bulkEnrollStudents(1, { student_ids: ['student-1'] }, 'teacher-123')
      ).rejects.toThrow('Cannot enroll students in classes from different schools');
    });
  });

  describe('Access Control', () => {
    it('should validate teacher access', async () => {
      // Mock access control to deny access
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null, // No access
          error: { code: 'PGRST116' }
        })
      };

      mockSupabase.from.mockReturnValue(mockQuery as any);

      await expect(
        ClassService.getAvailableStudents(1, 'unauthorized-teacher')
      ).rejects.toThrow('You do not have permission to view students for this class');
    });
  });

  describe('Class Retrieval', () => {
    it('should retrieve teacher classes', async () => {
      const mockClasses = [
        {
          id: 1,
          name: 'Class A',
          class_teachers: [{ user_id: 'teacher-123', role: 'primary', profiles: { full_name: 'Teacher Name' } }],
          class_students: [],
          class_subjects: []
        }
      ];

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        then: jest.fn().mockResolvedValue({
          data: mockClasses,
          error: null
        })
      };

      mockSupabase.from.mockReturnValue(mockQuery as any);

      const result = await ClassService.getClasses('teacher-123');

      expect(result.classes).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });
});