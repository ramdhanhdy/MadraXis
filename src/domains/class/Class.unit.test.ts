import { ClassService, ClassRepository, ClassAccessControl, ClassEnrollmentService } from './api';
import { ClassServiceError } from './types';

// Mock the dependencies
jest.mock('@lib/utils/supabase');
jest.mock('@lib/utils/logger');
jest.mock('@lib/utils/retry');
jest.mock('@lib/utils/sanitization');

describe('Class Domain', () => {
  const mockTeacherId = 'teacher-123';
  const mockClassId = 1;
  const mockSchoolId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ClassService', () => {
    describe('createClass', () => {
      it('should create a class successfully', async () => {
        const mockClassData = {
          name: 'Test Class',
          level: 'Grade 1',
          school_id: mockSchoolId,
          academic_year: '2024',
          semester: '1' as const
        };

        const mockCreatedClass = {
          id: mockClassId,
          ...mockClassData,
          student_count: 0,
          subject_count: 0,
          teacher_count: 1,
          teachers: []
        };

        jest.spyOn(ClassRepository, 'create').mockResolvedValue(mockCreatedClass);

        const result = await ClassService.createClass(mockClassData, mockTeacherId);

        expect(ClassRepository.create).toHaveBeenCalledWith(mockClassData, mockTeacherId);
        expect(result).toEqual(mockCreatedClass);
      });

      it('should throw error for invalid input', async () => {
        const invalidClassData = {
          name: '', // Invalid: empty name
          level: 'Grade 1',
          school_id: mockSchoolId,
          academic_year: '2024',
          semester: '1' as const
        };

        jest.spyOn(ClassRepository, 'create').mockRejectedValue(
          ClassServiceError.create('VALIDATION_ERROR', 'Invalid class data')
        );

        await expect(ClassService.createClass(invalidClassData, mockTeacherId))
          .rejects.toThrow(ClassServiceError);
      });
    });

    describe('getClasses', () => {
      it('should fetch teacher classes successfully', async () => {
        const mockClasses = [
          {
            id: 1,
            name: 'Class A',
            level: 'Grade 1',
            school_id: mockSchoolId,
            student_count: 5,
            subject_count: 3,
            teacher_count: 1,
            teachers: []
          }
        ];

        const mockResult = { classes: mockClasses, total: 1 };
        jest.spyOn(ClassRepository, 'getByTeacher').mockResolvedValue(mockResult);

        const result = await ClassService.getClasses(mockTeacherId);

        expect(ClassRepository.getByTeacher).toHaveBeenCalledWith(mockTeacherId, undefined);
        expect(result).toEqual(mockResult);
      });

      it('should apply filters correctly', async () => {
        const options = {
          status: 'active' as const,
          searchTerm: 'Math',
          limit: 5
        };

        const mockResult = { classes: [], total: 0 };
        jest.spyOn(ClassRepository, 'getByTeacher').mockResolvedValue(mockResult);

        await ClassService.getClasses(mockTeacherId, options);

        expect(ClassRepository.getByTeacher).toHaveBeenCalledWith(mockTeacherId, options);
      });
    });

    describe('getClassById', () => {
      it('should fetch class by ID with access validation', async () => {
        const mockClass = {
          id: mockClassId,
          name: 'Test Class',
          level: 'Grade 1',
          school_id: mockSchoolId,
          student_count: 0,
          subject_count: 0,
          teacher_count: 1,
          teachers: []
        };

        jest.spyOn(ClassAccessControl, 'validateTeacherAccess').mockResolvedValue();
        jest.spyOn(ClassRepository, 'getById').mockResolvedValue(mockClass);

        const result = await ClassService.getClassById(mockClassId, mockTeacherId);

        expect(ClassAccessControl.validateTeacherAccess)
          .toHaveBeenCalledWith(mockClassId, mockTeacherId, 'view');
        expect(ClassRepository.getById).toHaveBeenCalledWith(mockClassId);
        expect(result).toEqual(mockClass);
      });

      it('should throw error for unauthorized access', async () => {
        jest.spyOn(ClassAccessControl, 'validateTeacherAccess')
          .mockRejectedValue(ClassServiceError.create('ACCESS_DENIED', 'Unauthorized'));

        await expect(ClassService.getClassById(mockClassId, mockTeacherId))
          .rejects.toThrow(ClassServiceError);

        expect(ClassRepository.getById).not.toHaveBeenCalled();
      });
    });

    describe('updateClass', () => {
      it('should update class successfully', async () => {
        const updateData = { name: 'Updated Class Name' };
        const mockUpdatedClass = {
          id: mockClassId,
          name: 'Updated Class Name',
          level: 'Grade 1',
          school_id: mockSchoolId,
          student_count: 0,
          subject_count: 0,
          teacher_count: 1,
          teachers: []
        };

        jest.spyOn(ClassAccessControl, 'validateTeacherAccess').mockResolvedValue();
        jest.spyOn(ClassRepository, 'update').mockResolvedValue(mockUpdatedClass);

        const result = await ClassService.updateClass(mockClassId, updateData, mockTeacherId);

        expect(ClassAccessControl.validateTeacherAccess)
          .toHaveBeenCalledWith(mockClassId, mockTeacherId, 'update');
        expect(ClassRepository.update)
          .toHaveBeenCalledWith(mockClassId, updateData, mockTeacherId);
        expect(result).toEqual(mockUpdatedClass);
      });
    });

    describe('deleteClass', () => {
      it('should delete class successfully', async () => {
        jest.spyOn(ClassAccessControl, 'validateTeacherAccess').mockResolvedValue();
        jest.spyOn(ClassAccessControl, 'validateClassDeletion').mockResolvedValue();
        jest.spyOn(ClassRepository, 'softDelete').mockResolvedValue();

        await ClassService.deleteClass(mockClassId, mockTeacherId);

        expect(ClassAccessControl.validateTeacherAccess)
          .toHaveBeenCalledWith(mockClassId, mockTeacherId, 'delete');
        expect(ClassAccessControl.validateClassDeletion)
          .toHaveBeenCalledWith(mockClassId);
        expect(ClassRepository.softDelete)
          .toHaveBeenCalledWith(mockClassId, mockTeacherId);
      });

      it('should throw error if class has students', async () => {
        jest.spyOn(ClassAccessControl, 'validateTeacherAccess').mockResolvedValue();
        jest.spyOn(ClassAccessControl, 'validateClassDeletion')
          .mockRejectedValue(ClassServiceError.create('CLASS_HAS_STUDENTS', 'Cannot delete class with students'));

        await expect(ClassService.deleteClass(mockClassId, mockTeacherId))
          .rejects.toThrow(ClassServiceError);

        expect(ClassRepository.softDelete).not.toHaveBeenCalled();
      });
    });
  });

  describe('ClassAccessControl', () => {
    describe('verifyClassAccess', () => {
      it('should return true for valid access', async () => {
        // Mock successful access verification
        const mockSupabase = require('@lib/utils/supabase').supabase;
        mockSupabase.from.mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: { school_id: mockSchoolId },
                error: null
              })
            })
          })
        });

        const result = await ClassAccessControl.verifyClassAccess(mockClassId, mockTeacherId);
        expect(result).toBe(true);
      });

      it('should return false for invalid access', async () => {
        const mockSupabase = require('@lib/utils/supabase').supabase;
        mockSupabase.from.mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: { message: 'Not found' }
              })
            })
          })
        });

        const result = await ClassAccessControl.verifyClassAccess(mockClassId, mockTeacherId);
        expect(result).toBe(false);
      });
    });

    describe('validateTeacherAccess', () => {
      it('should pass for valid access', async () => {
        jest.spyOn(ClassAccessControl, 'verifyClassAccess').mockResolvedValue(true);

        await expect(ClassAccessControl.validateTeacherAccess(mockClassId, mockTeacherId, 'view'))
          .resolves.not.toThrow();
      });

      it('should throw error for invalid access', async () => {
        jest.spyOn(ClassAccessControl, 'verifyClassAccess').mockResolvedValue(false);

        await expect(ClassAccessControl.validateTeacherAccess(mockClassId, mockTeacherId, 'view'))
          .rejects.toThrow(ClassServiceError);
      });
    });
  });

  describe('ClassEnrollmentService', () => {
    describe('getAvailableStudents', () => {
      it('should fetch available students successfully', async () => {
        const mockStudents = [
          {
            id: 'student-1',
            full_name: 'John Doe',
            nis: '12345',
            gender: 'male' as const,
            boarding: 'day' as const
          }
        ];

        const mockSupabase = require('@lib/utils/supabase').supabase;
        mockSupabase.from.mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: { school_id: mockSchoolId },
                error: null
              })
            })
          })
        });

        // Mock the students query
        mockSupabase.from.mockReturnValueOnce({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              not: jest.fn().mockReturnValue({
                order: jest.fn().mockReturnValue({
                  range: jest.fn().mockResolvedValue({
                    data: mockStudents,
                    error: null,
                    count: 1
                  })
                })
              })
            })
          })
        });

        const result = await ClassEnrollmentService.getAvailableStudents(
          mockClassId,
          mockTeacherId
        );

        expect(result.students).toHaveLength(1);
        expect(result.total).toBe(1);
      });
    });

    describe('enrollStudent', () => {
      it('should enroll student successfully', async () => {
        const enrollmentData = {
          student_id: 'student-1',
          enrollment_date: '2024-01-01',
          notes: 'Test enrollment'
        };

        const mockSupabase = require('@lib/utils/supabase').supabase;
        
        // Mock teacher profile query
        mockSupabase.from.mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: { school_id: mockSchoolId },
                error: null
              })
            })
          })
        });

        // Mock RPC call
        mockSupabase.rpc.mockResolvedValue({
          data: [{ success: true, student_id: 'student-1' }],
          error: null
        });

        await expect(ClassEnrollmentService.enrollStudent(
          mockClassId,
          enrollmentData,
          mockTeacherId
        )).resolves.not.toThrow();

        expect(mockSupabase.rpc).toHaveBeenCalledWith('add_students_to_class_atomic', {
          p_class_id: mockClassId,
          p_student_ids: [enrollmentData.student_id],
          p_teacher_id: mockTeacherId,
          p_school_id: mockSchoolId
        });
      });

      it('should throw error for failed enrollment', async () => {
        const enrollmentData = {
          student_id: 'student-1'
        };

        const mockSupabase = require('@lib/utils/supabase').supabase;
        
        // Mock teacher profile query
        mockSupabase.from.mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: { school_id: mockSchoolId },
                error: null
              })
            })
          })
        });

        // Mock failed RPC call
        mockSupabase.rpc.mockResolvedValue({
          data: null,
          error: { message: 'Enrollment failed' }
        });

        await expect(ClassEnrollmentService.enrollStudent(
          mockClassId,
          enrollmentData,
          mockTeacherId
        )).rejects.toThrow(ClassServiceError);
      });
    });
  });

  describe('ClassServiceError', () => {
    it('should create error with code and context', () => {
      const error = ClassServiceError.create(
        'TEST_ERROR',
        'Test error message',
        { testContext: 'value' }
      );

      expect(error).toBeInstanceOf(ClassServiceError);
      expect(error.code).toBe('TEST_ERROR');
      expect(error.message).toBe('Test error message');
      expect(error.context).toEqual({ testContext: 'value' });
    });

    it('should create error without context', () => {
      const error = ClassServiceError.create('TEST_ERROR', 'Test error message');

      expect(error.code).toBe('TEST_ERROR');
      expect(error.message).toBe('Test error message');
      expect(error.context).toBeUndefined();
    });
  });
});
