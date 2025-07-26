import { supabase } from '../../utils/supabase';
import {
  BulkUpdateClassesRequest,
  ClassServiceError,
  BulkUpdateClassSchema
} from './types';
import { ClassAccessControl } from './access';
import { ClassAuditService } from './audit';
import { ClassRepository } from './repository';

/**
 * ClassBulkOperations handles batch operations for classes
 */
export class ClassBulkOperations {
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
    // Validate input
    const validatedData = BulkUpdateClassSchema.parse(updateData);
    
    const results: number[] = [];
    const errors: Array<{ classId: number; error: string }> = [];

    for (const classId of validatedData.class_ids) {
      try {
        // Validate teacher access for each class
        await ClassAccessControl.validateTeacherAccess(classId, teacherId, 'bulk_update');

        // Get current class data for audit
        const currentClass = await ClassRepository.getById(classId);
        if (!currentClass) {
          throw ClassServiceError.create(
            'CLASS_NOT_FOUND',
            'Class not found',
            { classId, teacherId }
          );
        }

        // Prepare update data
        const updateFields: any = {};
        if (validatedData.updates.name !== undefined) {
          updateFields.name = validatedData.updates.name;
        }
        if (validatedData.updates.description !== undefined) {
          updateFields.description = validatedData.updates.description;
        }
        if (validatedData.updates.academic_year !== undefined) {
          updateFields.academic_year = validatedData.updates.academic_year;
        }
        if (validatedData.updates.semester !== undefined) {
          updateFields.semester = validatedData.updates.semester;
        }
        if (validatedData.updates.student_capacity !== undefined) {
          updateFields.student_capacity = validatedData.updates.student_capacity;
        }
        if (validatedData.updates.status !== undefined) {
          updateFields.status = validatedData.updates.status;
        }

        // Add metadata
        updateFields.updated_at = new Date().toISOString();
        updateFields.updated_by = teacherId;

        // Perform update
        const { error } = await supabase
          .from('classes')
          .update(updateFields)
          .eq('id', classId);

        if (error) {
          throw ClassServiceError.create(
            'UPDATE_FAILED',
            'Failed to update class',
            { originalError: error, classId, teacherId }
          );
        }

        // Log update action
        const changedFields = Object.keys(updateFields);
        const newData = { ...currentClass, ...updateFields };
        await ClassAuditService.logClassUpdate(
          classId,
          changedFields,
          currentClass,
          newData,
          teacherId
        );

        results.push(classId);
      } catch (error) {
        errors.push({
          classId,
          error: error instanceof ClassServiceError ? error.message : 'Unknown error',
        });
      }
    }

    return { results, errors };
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
    const results: number[] = [];
    const errors: Array<{ classId: number; error: string }> = [];

    for (const classId of classIds) {
      try {
        // Validate teacher access
        await ClassAccessControl.validateTeacherAccess(classId, teacherId, 'bulk_delete');

        // Validate class can be deleted (no enrolled students)
        await ClassAccessControl.validateClassDeletion(classId);

        // Get current class data for audit
        const currentClass = await ClassRepository.getById(classId);
        if (!currentClass) {
          throw ClassServiceError.create(
            'CLASS_NOT_FOUND',
            'Class not found',
            { classId, teacherId }
          );
        }

        // Perform soft delete
        const { error } = await supabase
          .from('classes')
          .update({
            deleted_at: new Date().toISOString(),
            deleted_by: teacherId,
            updated_at: new Date().toISOString(),
            updated_by: teacherId,
          })
          .eq('id', classId);

        if (error) {
          throw ClassServiceError.create(
            'DELETE_FAILED',
            'Failed to delete class',
            { originalError: error, classId, teacherId }
          );
        }

        // Log deletion action
        await ClassAuditService.logClassDeletion(classId, currentClass, teacherId);

        results.push(classId);
      } catch (error) {
        errors.push({
          classId,
          error: error instanceof ClassServiceError ? error.message : 'Unknown error',
        });
      }
    }

    return { results, errors };
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
    const results: number[] = [];
    const errors: Array<{ classId: number; error: string }> = [];

    for (const classId of classIds) {
      try {
        // Get current class data (including deleted ones)
        const { data: currentClass, error: fetchError } = await supabase
          .from('classes')
          .select('*')
          .eq('id', classId)
          .single();

        if (fetchError || !currentClass) {
          throw ClassServiceError.create(
            'CLASS_NOT_FOUND',
            'Class not found',
            { classId, teacherId }
          );
        }

        // Check if class is actually deleted
        if (!currentClass.deleted_at) {
          throw ClassServiceError.create(
            'CLASS_NOT_DELETED',
            'Class is not deleted',
            { classId, teacherId }
          );
        }

        // Validate teacher has access to this school
        const { data: teacherProfile } = await supabase
          .from('profiles')
          .select('school_id')
          .eq('id', teacherId)
          .single();

        if (!teacherProfile || teacherProfile.school_id !== currentClass.school_id) {
          throw ClassServiceError.create(
            'ACCESS_DENIED',
            'You do not have permission to restore this class',
            { classId, teacherId }
          );
        }

        // Perform restore
        const { error } = await supabase
          .from('classes')
          .update({
            deleted_at: null,
            deleted_by: null,
            updated_at: new Date().toISOString(),
            updated_by: teacherId,
          })
          .eq('id', classId);

        if (error) {
          throw ClassServiceError.create(
            'RESTORE_FAILED',
            'Failed to restore class',
            { originalError: error, classId, teacherId }
          );
        }

        // Log restoration action
        await ClassAuditService.logClassRestoration(classId, currentClass, currentClass, teacherId);

        results.push(classId);
      } catch (error) {
        errors.push({
          classId,
          error: error instanceof ClassServiceError ? error.message : 'Unknown error',
        });
      }
    }

    return { results, errors };
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
    const results: number[] = [];
    const errors: Array<{ classId: number; error: string }> = [];

    for (const classId of classIds) {
      try {
        // Validate current teacher access
        await ClassAccessControl.validateTeacherAccess(classId, currentTeacherId, 'assign_teacher');

        // Validate new teacher exists and is in same school
        const { data: newTeacher, error: teacherError } = await supabase
          .from('profiles')
          .select('id, school_id, role')
          .eq('id', newTeacherId)
          .eq('role', 'teacher')
          .single();

        if (teacherError || !newTeacher) {
          throw ClassServiceError.create(
            'TEACHER_NOT_FOUND',
            'New teacher not found or invalid',
            { 
              classId, 
              additionalContext: { 
                newTeacherId, 
                currentTeacherId 
              } 
            }
          );
        }

        // Get class to verify school match
        const classData = await ClassRepository.getById(classId);
        if (!classData) {
          throw ClassServiceError.create(
            'CLASS_NOT_FOUND',
            'Class not found',
            { 
              classId, 
              additionalContext: { 
                currentTeacherId 
              } 
            }
          );
        }

        if (newTeacher.school_id !== classData.school_id) {
          throw ClassServiceError.create(
            'SCHOOL_MISMATCH',
            'Teacher must be from the same school as the class',
            { 
              classId, 
              additionalContext: { 
                newTeacherId, 
                currentTeacherId 
              } 
            }
          );
        }

        // Update class teacher
        const { error } = await supabase
          .from('classes')
          .update({
            teacher_id: newTeacherId,
            updated_at: new Date().toISOString(),
            updated_by: currentTeacherId,
          })
          .eq('id', classId);

        if (error) {
          throw ClassServiceError.create(
            'ASSIGNMENT_FAILED',
            'Failed to assign teacher to class',
            { 
              originalError: error, 
              classId, 
              additionalContext: { 
                newTeacherId, 
                currentTeacherId 
              } 
            }
          );
        }

        // Log teacher assignment
        await ClassAuditService.logClassUpdate(
          classId,
          ['teacher_id'],
          classData,
          { teacher_id: newTeacherId },
          currentTeacherId
        );

        results.push(classId);
      } catch (error) {
        errors.push({
          classId,
          error: error instanceof ClassServiceError ? error.message : 'Unknown error',
        });
      }
    }

    return { results, errors };
  }

  /**
   * Get bulk operation status/summary
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
    try {
      const summary = {
        total: classIds.length,
        accessible: 0,
        withStudents: 0,
        deleted: 0,
        active: 0,
      };

      for (const classId of classIds) {
        try {
          // Check access
          await ClassAccessControl.validateTeacherAccess(classId, teacherId, 'view');
          summary.accessible++;

          // Get class details
          const classData = await ClassRepository.getById(classId);
          if (classData) {
            if (classData.deleted_at) {
              summary.deleted++;
            } else if (classData.status === 'active') {
              summary.active++;
            }

            // Check for enrolled students
            const studentCount = await ClassRepository.getEnrolledStudentCount(classId);
            if (studentCount > 0) {
              summary.withStudents++;
            }
          }
        } catch {
          // Class not accessible, skip
        }
      }

      return summary;
    } catch (error) {
      throw ClassServiceError.create(
        'SUMMARY_FAILED',
        'Failed to get bulk operation summary',
        { 
          originalError: error, 
          teacherId,
          additionalContext: {
            classIds
          }
        }
      );
    }
  }
}