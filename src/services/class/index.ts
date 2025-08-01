import {
  CreateClassRequest,
  UpdateClassRequest,
  GetClassesOptions,
  GetAvailableStudentsOptions,
  GetClassStudentsOptions,
  EnrollStudentRequest,
  BulkEnrollStudentsRequest,
  BulkUpdateClassesRequest,
  ClassWithDetails,
  StudentWithDetails,
  ClassServiceError
} from './types';
import { ClassRepository } from './repository';
import { ClassAccessControl } from './access';
import { ClassAuditService } from './audit';
import { ClassEnrollmentService } from './enrollment';
import { ClassBulkOperations } from './bulk';
import { withRetry } from '../../utils/retry';

/**
 * Main ClassService orchestrator that provides a unified interface
 * for all class-related operations
 */
export class ClassService {
  // ==================== CLASS CRUD OPERATIONS ====================

  /**
   * Create a new class
   */
  static async createClass(
    classData: CreateClassRequest,
    teacherId: string
  ): Promise<ClassWithDetails> {
    return ClassRepository.create(classData, teacherId);
  }

  /**
   * Get classes for a teacher with filtering and pagination
   */
  static async getClasses(
    teacherId: string,
    options?: GetClassesOptions
  ): Promise<{ classes: ClassWithDetails[]; total: number }> {
    return ClassRepository.getByTeacher(teacherId, options);
  }

  /**
   * Get a specific class by ID
   */
  static async getClassById(
    classId: number,
    teacherId: string
  ): Promise<ClassWithDetails | null> {
    // Verify access first
    await ClassAccessControl.validateTeacherAccess(classId, teacherId, 'view');
    return ClassRepository.getById(classId);
  }

  /**
   * Update a class
   */
  static async updateClass(
    classId: number,
    updateData: UpdateClassRequest,
    teacherId: string
  ): Promise<ClassWithDetails> {
    // Validate teacher access first
    await ClassAccessControl.validateTeacherAccess(classId, teacherId, 'update');
    return ClassRepository.update(classId, updateData, teacherId);
  }

  /**
   * Soft delete a class
   */
  static async deleteClass(
    classId: number,
    teacherId: string
  ): Promise<void> {
    // Validate teacher access first
    await ClassAccessControl.validateTeacherAccess(classId, teacherId, 'delete');
    // Validate class can be deleted (no enrolled students)
    await ClassAccessControl.validateClassDeletion(classId);
    return ClassRepository.softDelete(classId, teacherId);
  }

  /**
   * Restore a deleted class
   */
  static async restoreClass(
    classId: number,
    teacherId: string
  ): Promise<ClassWithDetails> {
    // Validate teacher access first
    await ClassAccessControl.validateTeacherAccess(classId, teacherId, 'restore');
    return ClassRepository.restore(classId, teacherId);
  }

  // ==================== STUDENT ENROLLMENT OPERATIONS ====================

  /**
   * Get available students for enrollment with retry logic
   */
  static async getAvailableStudents(
    classId: number,
    teacherId: string,
    options?: GetAvailableStudentsOptions
  ): Promise<{ students: StudentWithDetails[]; total: number }> {
    try {
      // Validate teacher access first (no retry needed for access validation)
      await ClassAccessControl.validateTeacherAccess(classId, teacherId, 'view_students');
      
      // Use retry logic for the actual data retrieval
      const retryResult = await withRetry(
        () => ClassEnrollmentService.getAvailableStudents(classId, teacherId, options),
        {
          maxAttempts: 3,
          baseDelay: 1000,
          maxDelay: 5000,
          backoffFactor: 2
        }
      );
      
      return retryResult.result;
    } catch (error) {
      if (error instanceof ClassServiceError) {
        // Map ACCESS_DENIED to UNAUTHORIZED_ACCESS for consistency with tests
        if (error.code === 'ACCESS_DENIED') {
          throw ClassServiceError.create(
            'UNAUTHORIZED_ACCESS',
            'You do not have permission to view students for this class',
            { classId, teacherId, operation: 'view_students' }
          );
        }
        throw error;
      }
      // Handle network errors
      if (error && typeof error === 'object' && 'code' in error) {
        const errorCode = (error as any).code;
        if (errorCode === 'NETWORK_ERROR' || errorCode === 'ECONNREFUSED' || errorCode === 'ETIMEDOUT') {
          throw ClassServiceError.create(
            'NETWORK_ERROR',
            'Network connection failed after retries',
            { originalError: error, classId, teacherId }
          );
        }
      }
      throw ClassServiceError.create(
        'UNEXPECTED_ERROR',
        'An unexpected error occurred',
        { originalError: error, classId, teacherId }
      );
    }
  }

  /**
   * Get students enrolled in a class
   */
  static async getClassStudents(
    classId: number,
    teacherId: string,
    options?: GetClassStudentsOptions
  ): Promise<{ students: StudentWithDetails[]; total: number }> {
    return ClassEnrollmentService.getClassStudents(classId, teacherId, options);
  }

  /**
   * Enroll a student in a class
   */
  static async enrollStudent(
    classId: number,
    enrollmentData: EnrollStudentRequest,
    teacherId: string
  ): Promise<void> {
    try {
      // Validate teacher access first
      await ClassAccessControl.validateTeacherAccess(classId, teacherId, 'enroll_student');
      return ClassEnrollmentService.enrollStudent(classId, enrollmentData, teacherId);
    } catch (error) {
      if (error instanceof ClassServiceError) {
        // Map ACCESS_DENIED to UNAUTHORIZED_ACCESS for consistency with tests
        if (error.code === 'ACCESS_DENIED') {
          throw ClassServiceError.create(
            'UNAUTHORIZED_ACCESS',
            'You do not have permission to enroll students in this class',
            { classId, teacherId, operation: 'enroll_student' }
          );
        }
        throw error;
      }
      // Handle network errors
      if (error && typeof error === 'object' && 'code' in error) {
        const errorCode = (error as any).code;
        if (errorCode === 'NETWORK_ERROR' || errorCode === 'ECONNREFUSED' || errorCode === 'ETIMEDOUT') {
          throw ClassServiceError.create(
            'NETWORK_ERROR',
            'Network connection failed',
            { originalError: error, classId, teacherId }
          );
        }
      }
      throw ClassServiceError.create(
        'UNEXPECTED_ERROR',
        'An unexpected error occurred',
        { originalError: error, classId, teacherId }
      );
    }
  }

  /**
   * Bulk enroll multiple students with retry logic
   */
  static async bulkEnrollStudents(
    classId: number,
    enrollmentData: BulkEnrollStudentsRequest,
    teacherId: string
  ): Promise<{
    results: string[];
    errors: { studentId: string; error: string }[];
  }> {
    try {
      // Validate teacher access first (no retry needed for access validation)
      await ClassAccessControl.validateTeacherAccess(classId, teacherId, 'enroll_students');
      
      // Use retry logic for the actual enrollment operation
      const retryResult = await withRetry(
        () => ClassEnrollmentService.bulkEnrollStudents(classId, enrollmentData, teacherId),
        {
          maxAttempts: 3,
          baseDelay: 1000,
          maxDelay: 5000,
          backoffFactor: 2
        }
      );
      
      return retryResult.result;
    } catch (error) {
      if (error instanceof ClassServiceError) {
        // Map ACCESS_DENIED to UNAUTHORIZED_ACCESS for consistency with tests
        if (error.code === 'ACCESS_DENIED') {
          throw ClassServiceError.create(
            'UNAUTHORIZED_ACCESS',
            'You do not have permission to enroll students in this class',
            { classId, teacherId, operation: 'enroll_students' }
          );
        }
        throw error;
      }
      // Handle network errors
      if (error && typeof error === 'object' && 'code' in error) {
        const errorCode = (error as any).code;
        if (errorCode === 'NETWORK_ERROR' || errorCode === 'ECONNREFUSED' || errorCode === 'ETIMEDOUT') {
          throw ClassServiceError.create(
            'NETWORK_ERROR',
            'Network connection failed after retries',
            { originalError: error, classId, teacherId }
          );
        }
      }
      throw ClassServiceError.create(
        'UNEXPECTED_ERROR',
        'An unexpected error occurred',
        { originalError: error, classId, teacherId }
      );
    }
  }

  /**
   * Remove a student from a class
   */
  static async removeStudent(
    classId: number,
    studentId: string,
    teacherId: string
  ): Promise<void> {
    return ClassEnrollmentService.removeStudent(classId, studentId, teacherId);
  }

  /**
   * Bulk remove multiple students
   */
  static async bulkRemoveStudents(
    classId: number,
    studentIds: string[],
    teacherId: string
  ): Promise<{
    results: string[];
    errors: { studentId: string; error: string }[];
  }> {
    return ClassEnrollmentService.bulkRemoveStudents(classId, studentIds, teacherId);
  }

  // ==================== BULK OPERATIONS ====================

  /**
   * Bulk update multiple classes
   */
  static async bulkUpdateClasses(
    updateData: BulkUpdateClassesRequest,
    teacherId: string
  ): Promise<{
    results: number[];
    errors: { classId: number; error: string }[];
  }> {
    return ClassBulkOperations.bulkUpdateClasses(updateData, teacherId);
  }

  /**
   * Bulk delete multiple classes
   */
  static async bulkDeleteClasses(
    classIds: number[],
    teacherId: string
  ): Promise<{
    results: number[];
    errors: { classId: number; error: string }[];
  }> {
    return ClassBulkOperations.bulkDeleteClasses(classIds, teacherId);
  }

  /**
   * Bulk restore multiple classes
   */
  static async bulkRestoreClasses(
    classIds: number[],
    teacherId: string
  ): Promise<{
    results: number[];
    errors: { classId: number; error: string }[];
  }> {
    return ClassBulkOperations.bulkRestoreClasses(classIds, teacherId);
  }

  /**
   * Bulk assign teacher to multiple classes
   */
  static async bulkAssignTeacher(
    classIds: number[],
    newTeacherId: string,
    currentTeacherId: string
  ): Promise<{
    results: number[];
    errors: { classId: number; error: string }[];
  }> {
    return ClassBulkOperations.bulkAssignTeacher(classIds, newTeacherId, currentTeacherId);
  }

  /**
   * Get bulk operation summary
   */
  static async getBulkOperationSummary(
    classIds: number[],
    teacherId: string
  ): Promise<{
    total: number;
    accessible: number;
    withStudents: number;
    deleted: number;
    active: number;
  }> {
    return ClassBulkOperations.getBulkOperationSummary(classIds, teacherId);
  }

  // ==================== ACCESS CONTROL OPERATIONS ====================

  /**
   * Validate teacher access to a class
   */
  static async validateTeacherAccess(
    classId: number,
    teacherId: string,
    operation: string
  ): Promise<void> {
    return ClassAccessControl.validateTeacherAccess(classId, teacherId, operation);
  }

  /**
   * Check if class exists
   */
  static async checkClassExists(classId: number): Promise<boolean> {
    return ClassAccessControl.checkClassExists(classId);
  }

  /**
   * Validate class name uniqueness
   */
  static async validateUniqueClassName(
    className: string,
    schoolId: number,
    excludeClassId?: number
  ): Promise<void> {
    return ClassAccessControl.validateUniqueClassName(className, schoolId, excludeClassId);
  }

  // ==================== AUDIT OPERATIONS ====================

  /**
   * Get audit history for a class
   */
  static async getClassAuditHistory(
    classId: number,
    teacherId: string,
    options?: {
      limit?: number;
      offset?: number;
      action_type?: string;
      start_date?: string;
      end_date?: string;
    }
  ): Promise<{
    audits: {
      id: number;
      action_type: string;
      old_values: any;
      new_values: any;
      performed_by: string;
      performed_at: string;
      metadata: any;
    }[];
    total: number;
  }> {
    // Verify access first
    await ClassAccessControl.validateTeacherAccess(classId, teacherId, 'view_audit');
    return ClassAuditService.getClassAuditHistory(classId, options);
  }

  // ==================== UTILITY OPERATIONS ====================

  /**
   * Get enrolled student count for a class
   */
  static async getEnrolledStudentCount(
    classId: number,
    teacherId: string
  ): Promise<number> {
    // Verify access first
    await ClassAccessControl.validateTeacherAccess(classId, teacherId, 'view');
    return ClassRepository.getEnrolledStudentCount(classId);
  }

  /**
   * Check for duplicate class name
   */
  static async checkDuplicateClassName(
    className: string,
    schoolId: number,
    excludeClassId?: number
  ): Promise<boolean> {
    return ClassRepository.checkDuplicateClassName(className, schoolId, excludeClassId);
  }
}

// Export all types and error class for external use
export {
  CreateClassRequest,
  UpdateClassRequest,
  BulkUpdateRequest,
  GetClassesOptions,
  GetAvailableStudentsOptions,
  GetClassStudentsOptions,
  EnrollStudentRequest,
  BulkEnrollStudentsRequest,
  BulkUpdateClassesRequest,
  ClassWithDetails,
  StudentWithDetails,
  ClassServiceError
} from './types';

// Export individual service classes for advanced use cases
export {
  ClassRepository,
  ClassAccessControl,
  ClassAuditService,
  ClassEnrollmentService,
  ClassBulkOperations
};