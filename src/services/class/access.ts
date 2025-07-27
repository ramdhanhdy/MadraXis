import { logger } from '../../utils/logger';
import { supabase } from '../../utils/supabase';
import { ClassServiceError } from './types';
import { ClassRepository } from './repository';

/**
 * ClassAccessControl handles permission checks and access validation
 */
export class ClassAccessControl {
  /**
   * Verify if a teacher has access to a specific class
   * @param classId - The class ID to check access for
   * @param teacherId - The teacher's user ID
   * @param validateSchool - Whether to validate that the class belongs to the same school as the teacher (default: true)
   */
  static async verifyClassAccess(
  classId: number,
  teacherId: string,
  validateSchool: boolean = true)
  : Promise<boolean> {
    try {
      if (validateSchool) {
        // First get the teacher's school_id
        const { data: teacherProfile, error: teacherError } = await supabase.
        from('profiles').
        select('school_id').
        eq('id', teacherId).
        single();

        if (teacherError || !teacherProfile) {
          // Teacher profile not found - this is expected when teacher doesn't exist or has no access
          return false;
        }

        // Then check class access with school validation
        const { data: classTeacher, error } = await supabase.
        from('class_teachers').
        select(`
            user_id,
            classes!inner(
              school_id
            )
          `).
        eq('class_id', classId).
        eq('user_id', teacherId).
        eq('classes.school_id', teacherProfile.school_id).
        single();

        if (error && error.code !== 'PGRST116') {
          logger.error('Error checking class access with school validation:', error);
          return false;
        }

        return !!classTeacher;
      } else {
        // Original logic without school validation
        const { data: classTeacher, error } = await supabase.
        from('class_teachers').
        select('user_id').
        eq('class_id', classId).
        eq('user_id', teacherId).
        single();

        if (error && error.code !== 'PGRST116') {
          logger.error('Error checking class access:', error);
          return false;
        }

        return !!classTeacher;
      }
    } catch (error) {
      logger.error('Unexpected error in verifyClassAccess', {
        error: error instanceof Error ? error.message : String(error)
      });
      return false;
    }
  }

  /**
   * Validate teacher access and throw error if denied
   * @param classId - The class ID to validate access for
   * @param teacherId - The teacher's user ID
   * @param operation - The operation being performed (for error context)
   * @param validateSchool - Whether to validate that the class belongs to the same school as the teacher (default: true)
   */
  static async validateTeacherAccess(
  classId: number,
  teacherId: string,
  operation: string = 'access',
  validateSchool: boolean = true)
  : Promise<void> {
    const hasAccess = await ClassAccessControl.verifyClassAccess(classId, teacherId, validateSchool);
    if (!hasAccess) {
      throw ClassServiceError.create(
        'ACCESS_DENIED',
        'You do not have access to this class',
        { operation, classId, teacherId }
      );
    }
  }

  /**
   * Check if a teacher can perform bulk operations on multiple classes
   * @param classIds - Array of class IDs to validate access for
   * @param teacherId - The teacher's user ID
   * @param operation - The operation being performed (for error context)
   * @param validateSchool - Whether to validate that classes belong to the same school as the teacher (default: true)
   */
  static async validateBulkAccess(
  classIds: number[],
  teacherId: string,
  operation: string = 'bulk_operation',
  validateSchool: boolean = true)
  : Promise<void> {
    const accessChecks = await Promise.all(
      classIds.map((classId) => ClassAccessControl.verifyClassAccess(classId, teacherId, validateSchool))
    );

    const deniedClasses = classIds.filter((_, index) => !accessChecks[index]);

    if (deniedClasses.length > 0) {
      throw ClassServiceError.create(
        'BULK_ACCESS_DENIED',
        `Access denied to classes: ${deniedClasses.join(', ')}`,
        {
          operation,
          teacherId,
          additionalContext: {
            classIds: deniedClasses
          }
        }
      );
    }
  }

  /**
   * Check if a class exists and teacher has access
   * @param classId - The class ID to validate
   * @param teacherId - The teacher's user ID
   * @param operation - The operation being performed (for error context)
   * @param validateSchool - Whether to validate that the class belongs to the same school as the teacher (default: true)
   */
  static async validateClassExists(
  classId: number,
  teacherId: string,
  operation: string = 'access',
  validateSchool: boolean = true)
  : Promise<void> {
    const classData = await ClassRepository.getById(classId);

    if (!classData) {
      throw ClassServiceError.create(
        'CLASS_NOT_FOUND',
        'Class not found',
        { operation, classId, teacherId }
      );
    }

    await ClassAccessControl.validateTeacherAccess(classId, teacherId, operation, validateSchool);
  }

  /**
   * Check if a class can be deleted (no enrolled students)
   */
  static async validateClassDeletion(classId: number): Promise<void> {
    const enrolledCount = await ClassRepository.getEnrolledStudentCount(classId);

    if (enrolledCount > 0) {
      throw ClassServiceError.create(
        'CLASS_HAS_STUDENTS',
        `Cannot delete class with ${enrolledCount} enrolled students`,
        {
          classId,
          additionalContext: {
            enrolledCount
          }
        }
      );
    }
  }

  /**
   * Check if a class exists
   */
  static async checkClassExists(classId: number): Promise<boolean> {
    const classData = await ClassRepository.getById(classId);
    return !!classData;
  }

  /**
   * Check if a class name is unique within the school
   */
  static async validateUniqueClassName(
  className: string,
  schoolId: number,
  excludeClassId?: number)
  : Promise<void> {
    const isDuplicate = await ClassRepository.checkDuplicateClassName(className, schoolId, excludeClassId);

    if (isDuplicate) {
      throw ClassServiceError.create(
        'DUPLICATE_CLASS_NAME',
        'A class with this name already exists',
        {
          additionalContext: {
            className,
            schoolId,
            excludeClassId
          }
        }
      );
    }
  }

  /**
   * Create class-teacher relationship
   */
  static async assignTeacherToClass(
  classId: number,
  teacherId: string,
  role: string = 'primary')
  : Promise<void> {
    try {
      // Validate that teacher and class belong to the same school
      const { data: teacherProfile, error: teacherError } = await supabase.
      from('profiles').
      select('school_id').
      eq('id', teacherId).
      single();

      if (teacherError || !teacherProfile) {
        throw ClassServiceError.create(
          'SCHOOL_MISMATCH',
          'Teacher profile not found or invalid',
          { classId, teacherId }
        );
      }

      const { data: classData, error: classError } = await supabase.
      from('classes').
      select('school_id').
      eq('id', classId).
      single();

      if (classError || !classData) {
        throw ClassServiceError.create(
          'SCHOOL_MISMATCH',
          'Class not found or invalid',
          { classId, teacherId }
        );
      }

      if (teacherProfile.school_id !== classData.school_id) {
        throw ClassServiceError.create(
          'SCHOOL_MISMATCH',
          'Teacher and class must belong to the same school',
          {
            classId,
            teacherId,
            additionalContext: {
              teacherSchoolId: teacherProfile.school_id,
              classSchoolId: classData.school_id
            }
          }
        );
      }

      // Create the assignment
      const { error: assignmentError } = await supabase.
      from('class_teachers').
      insert({
        class_id: classId,
        user_id: teacherId,
        role: role,
        assigned_date: new Date().toISOString()
      });

      if (assignmentError) {
        logger.error('Teacher assignment failed', {
          error: assignmentError.message
        });

        throw ClassServiceError.create(
          'TEACHER_ASSIGNMENT_FAILED',
          `Failed to assign teacher to class: ${assignmentError.message}`,
          { classId, teacherId }
        );
      }
    } catch (error) {
      if (error instanceof ClassServiceError) {
        throw error;
      }

      logger.error('Unexpected error in assignTeacherToClass', {
        error: error instanceof Error ? error.message : String(error)
      });
      throw ClassServiceError.create(
        'TEACHER_ASSIGNMENT_FAILED',
        'Unexpected error during teacher assignment',
        { classId, teacherId }
      );
    }
  }

  /**
   * Remove teacher from class
   */
  static async removeTeacherFromClass(
  classId: number,
  teacherId: string)
  : Promise<void> {
    const { error } = await supabase.
    from('class_teachers').
    delete().
    eq('class_id', classId).
    eq('user_id', teacherId);

    if (error) {
      throw ClassServiceError.create(
        'TEACHER_REMOVAL_FAILED',
        'Failed to remove teacher from class',
        { originalError: error, classId, teacherId }
      );
    }
  }
}