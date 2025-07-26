import { supabase } from '../../utils/supabase';
import { ClassServiceError } from './types';
import { ClassRepository } from './repository';

/**
 * ClassAccessControl handles permission checks and access validation
 */
export class ClassAccessControl {
  /**
   * Verify if a teacher has access to a specific class
   */
  static async verifyClassAccess(classId: number, teacherId: string): Promise<boolean> {
    try {
      const { data: classTeacher, error } = await supabase
        .from('class_teachers')
        .select('user_id')
        .eq('class_id', classId)
        .eq('user_id', teacherId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking class access:', error);
        return false;
      }

      return !!classTeacher;
    } catch (error) {
      console.error('Unexpected error in verifyClassAccess:', error);
      return false;
    }
  }

  /**
   * Validate teacher access and throw error if denied
   */
  static async validateTeacherAccess(
    classId: number,
    teacherId: string,
    operation: string = 'access'
  ): Promise<void> {
    const hasAccess = await ClassAccessControl.verifyClassAccess(classId, teacherId);
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
   */
  static async validateBulkAccess(
    classIds: number[],
    teacherId: string,
    operation: string = 'bulk_operation'
  ): Promise<void> {
    const accessChecks = await Promise.all(
      classIds.map(classId => ClassAccessControl.verifyClassAccess(classId, teacherId))
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
   */
  static async validateClassExists(
    classId: number,
    teacherId: string,
    operation: string = 'access'
  ): Promise<void> {
    const classData = await ClassRepository.getById(classId);
    
    if (!classData) {
      throw ClassServiceError.create(
        'CLASS_NOT_FOUND',
        'Class not found',
        { operation, classId, teacherId }
      );
    }

    await ClassAccessControl.validateTeacherAccess(classId, teacherId, operation);
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
    schoolId: string,
    excludeClassId?: number
  ): Promise<void> {
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
    role: string = 'primary'
  ): Promise<void> {
    console.log('Creating class-teacher relationship:', {
      class_id: classId,
      user_id: teacherId,
      role: role,
      assigned_date: new Date().toISOString(),
    });
    
    const { error: teacherError } = await supabase
      .from('class_teachers')
      .insert({
        class_id: classId,
        user_id: teacherId,
        role: role,
        assigned_date: new Date().toISOString(),
      });

    if (teacherError) {
      console.error('Teacher assignment failed - Full error details:', {
        error: teacherError,
        errorCode: teacherError.code,
        errorMessage: teacherError.message,
        errorDetails: teacherError.details,
        errorHint: teacherError.hint,
        classId: classId,
        teacherId: teacherId,
        teacherIdType: typeof teacherId,
        insertData: {
          class_id: classId,
          user_id: teacherId,
          role: role,
          assigned_date: new Date().toISOString(),
        }
      });
      
      throw ClassServiceError.create(
        'TEACHER_ASSIGNMENT_FAILED',
        `Failed to assign teacher to class: ${teacherError.message}`,
        { originalError: teacherError, classId, teacherId }
      );
    }
    
    console.log('Teacher assignment successful for class:', classId);
  }

  /**
   * Remove teacher from class
   */
  static async removeTeacherFromClass(
    classId: number,
    teacherId: string
  ): Promise<void> {
    const { error } = await supabase
      .from('class_teachers')
      .delete()
      .eq('class_id', classId)
      .eq('user_id', teacherId);

    if (error) {
      throw ClassServiceError.create(
        'TEACHER_REMOVAL_FAILED',
        'Failed to remove teacher from class',
        { originalError: error, classId, teacherId }
      );
    }
  }
}