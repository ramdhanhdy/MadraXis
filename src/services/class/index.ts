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
    return ClassRepository.update(classId, updateData, teacherId);
  }

  /**
   * Soft delete a class
   */
  static async deleteClass(
    classId: number,
    teacherId: string
  ): Promise<void> {
    return ClassRepository.softDelete(classId, teacherId);
  }

  /**
   * Restore a deleted class
   */
  static async restoreClass(
    classId: number,
    teacherId: string
  ): Promise<ClassWithDetails> {
    return ClassRepository.restore(classId, teacherId);
  }

  // ==================== STUDENT ENROLLMENT OPERATIONS ====================

  /**
   * Get available students for enrollment
   */
  static async getAvailableStudents(
    classId: number,
    teacherId: string,
    options?: GetAvailableStudentsOptions
  ): Promise<{ students: StudentWithDetails[]; total: number }> {
    return ClassEnrollmentService.getAvailableStudents(classId, teacherId, options);
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
    return ClassEnrollmentService.enrollStudent(classId, enrollmentData, teacherId);
  }

  /**
   * Bulk enroll multiple students
   */
  static async bulkEnrollStudents(
    classId: number,
    enrollmentData: BulkEnrollStudentsRequest,
    teacherId: string
  ): Promise<{
    results: string[];
    errors: Array<{ studentId: string; error: string }>;
  }> {
    return ClassEnrollmentService.bulkEnrollStudents(classId, enrollmentData, teacherId);
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
    errors: Array<{ studentId: string; error: string }>;
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
    errors: Array<{ classId: number; error: string }>;
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
    errors: Array<{ classId: number; error: string }>;
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
    errors: Array<{ classId: number; error: string }>;
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
    errors: Array<{ classId: number; error: string }>;
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
    schoolId: string,
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
    audits: Array<{
      id: number;
      action_type: string;
      old_values: any;
      new_values: any;
      performed_by: string;
      performed_at: string;
      metadata: any;
    }>;
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
    schoolId: string,
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