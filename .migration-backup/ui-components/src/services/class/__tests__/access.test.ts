import { ClassAccessControl } from '../access';
import { supabase } from '../../../utils/supabase';

// Mock supabase
jest.mock('../../../utils/supabase', () => ({
  supabase: {
    from: jest.fn()
  }
}));

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('ClassAccessControl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('verifyClassAccess', () => {
    it('should validate school_id when validateSchool is true (default)', async () => {
      // Mock teacher profile response
      const mockTeacherProfile = { school_id: 1 };
      const mockClassTeacher = { user_id: 'teacher123' };

      // Setup mock chain for teacher profile query
      const teacherProfileQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockTeacherProfile, error: null })
      };

      // Setup mock chain for class access query
      const classAccessQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockClassTeacher, error: null })
      };

      // Mock supabase.from to return different queries based on table
      mockSupabase.from
        .mockReturnValueOnce(teacherProfileQuery as any)
        .mockReturnValueOnce(classAccessQuery as any);

      const result = await ClassAccessControl.verifyClassAccess(1, 'teacher123');

      expect(result).toBe(true);
      expect(mockSupabase.from).toHaveBeenCalledWith('profiles');
      expect(mockSupabase.from).toHaveBeenCalledWith('class_teachers');
    });

    it('should skip school validation when validateSchool is false', async () => {
      const mockClassTeacher = { user_id: 'teacher123' };

      const classAccessQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockClassTeacher, error: null })
      };

      mockSupabase.from.mockReturnValue(classAccessQuery as any);

      const result = await ClassAccessControl.verifyClassAccess(1, 'teacher123', false);

      expect(result).toBe(true);
      // Should only call supabase.from once (for class_teachers, not profiles)
      expect(mockSupabase.from).toHaveBeenCalledTimes(1);
      expect(mockSupabase.from).toHaveBeenCalledWith('class_teachers');
    });

    it('should return false when teacher profile is not found', async () => {
      const teacherProfileQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } })
      };

      mockSupabase.from.mockReturnValue(teacherProfileQuery as any);

      const result = await ClassAccessControl.verifyClassAccess(1, 'teacher123');

      expect(result).toBe(false);
    });

    it('should return false when class access is denied', async () => {
      const mockTeacherProfile = { school_id: 1 };

      const teacherProfileQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockTeacherProfile, error: null })
      };

      const classAccessQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } })
      };

      mockSupabase.from
        .mockReturnValueOnce(teacherProfileQuery as any)
        .mockReturnValueOnce(classAccessQuery as any);

      const result = await ClassAccessControl.verifyClassAccess(1, 'teacher123');

      expect(result).toBe(false);
    });
  });

  describe('assignTeacherToClass', () => {
    it('should successfully assign teacher when both belong to same school', async () => {
      // Mock teacher profile fetch
      const teacherQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { school_id: 'school-123' },
          error: null
        })
      };

      // Mock class data fetch
      const classQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { school_id: 'school-123' },
          error: null
        })
      };

      // Mock successful assignment
      const insertQuery = {
        insert: jest.fn().mockResolvedValue({
          error: null
        })
      };

      mockSupabase.from
        .mockReturnValueOnce(teacherQuery as any)
        .mockReturnValueOnce(classQuery as any)
        .mockReturnValueOnce(insertQuery as any);

      await expect(ClassAccessControl.assignTeacherToClass(1, 'teacher-123')).resolves.not.toThrow();
    });

    it('should throw SCHOOL_MISMATCH when teacher and class belong to different schools', async () => {
      // Mock teacher profile fetch
      const teacherQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { school_id: 'school-123' },
          error: null
        })
      };

      // Mock class data fetch with different school
      const classQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { school_id: 'school-456' },
          error: null
        })
      };

      mockSupabase.from
        .mockReturnValueOnce(teacherQuery as any)
        .mockReturnValueOnce(classQuery as any);

      await expect(ClassAccessControl.assignTeacherToClass(1, 'teacher-123'))
        .rejects.toThrow('Teacher and class must belong to the same school');
    });

    it('should throw SCHOOL_MISMATCH when teacher profile is not found', async () => {
      // Mock teacher profile not found
      const teacherQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Not found' }
        })
      };

      mockSupabase.from.mockReturnValueOnce(teacherQuery as any);

      await expect(ClassAccessControl.assignTeacherToClass(1, 'teacher-123'))
        .rejects.toThrow('Teacher profile not found or invalid');
    });

    it('should throw SCHOOL_MISMATCH when class is not found', async () => {
      // Mock teacher profile fetch
      const teacherQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { school_id: 'school-123' },
          error: null
        })
      };

      // Mock class not found
      const classQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Not found' }
        })
      };

      mockSupabase.from
        .mockReturnValueOnce(teacherQuery as any)
        .mockReturnValueOnce(classQuery as any);

      await expect(ClassAccessControl.assignTeacherToClass(1, 'teacher-123'))
        .rejects.toThrow('Class not found or invalid');
    });
  });
});