import { supabase } from '../utils/supabase';
import { z } from 'zod';
import { Class } from '../types/class';

// Validation schemas
const CreateClassSchema = z.object({
  name: z.string().min(1, 'Class name is required').max(100, 'Class name too long'),
  level: z.string().min(1, 'Class level is required'),
  description: z.string().optional(),
  school_id: z.number().int().positive('Invalid school ID'),
  student_capacity: z.number().int().positive().default(30),
  academic_year: z.string().min(1, 'Academic year is required'),
  semester: z.enum(['1', '2']),
});

const UpdateClassSchema = z.object({
  name: z.string().min(1, 'Class name is required').max(100, 'Class name too long').optional(),
  level: z.string().min(1, 'Class level is required').optional(),
  description: z.string().optional(),
  student_capacity: z.number().int().positive().optional(),
  academic_year: z.string().optional(),
  semester: z.enum(['1', '2']).optional(),
  status: z.enum(['active', 'inactive', 'archived']).optional(),
});

const BulkUpdateClassSchema = z.object({
  class_ids: z.array(z.number().int().positive()),
  updates: UpdateClassSchema.partial(),
});

// Type definitions
export interface CreateClassRequest {
  name: string;
  level: string;
  description?: string;
  school_id: number;
  student_capacity?: number;
  academic_year: string;
  semester: '1' | '2';
}

export interface UpdateClassRequest {
  name?: string;
  level?: string;
  description?: string;
  student_capacity?: number;
  academic_year?: string;
  semester?: '1' | '2';
  status?: 'active' | 'inactive' | 'archived';
}

export interface BulkUpdateRequest {
  class_ids: number[];
  updates: Partial<UpdateClassRequest>;
}

export interface ClassWithDetails extends Class {
  student_count: number;
  subject_count: number;
  teacher_count: number;
  teachers: Array<{
    user_id: string;
    role: string;
    full_name: string;
  }>;
}

export class ClassServiceError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ClassServiceError';
  }
}

/**
 * ClassService provides comprehensive CRUD operations for class management
 * with validation, authorization, and audit trail support
 */
export class ClassService {
  /**
   * Create a new class with validation and authorization
   */
  static async createClass(classData: CreateClassRequest, teacherId: string): Promise<Class> {
    try {
      // Validate input data
      const validatedData = CreateClassSchema.parse(classData);
      
      // Check for duplicate class name within teacher's scope
      const existingClass = await ClassService.checkDuplicateClassName(
        validatedData.name,
        teacherId,
        validatedData.school_id
      );
      
      if (existingClass) {
        throw new ClassServiceError(
          'DUPLICATE_CLASS_NAME',
          'A class with this name already exists'
        );
      }

      // Insert class record with proper user attribution
      const { data: newClass, error: insertError } = await supabase
        .from('classes')
        .insert({
          ...validatedData,
          created_by: teacherId,
          updated_by: teacherId,
          status: 'active',
        })
        .select()
        .single();

      if (insertError) {
        throw new ClassServiceError(
          'CREATE_FAILED',
          'Failed to create class',
          insertError
        );
      }

      // Create class-teacher relationship record
      const { error: teacherError } = await supabase
        .from('class_teachers')
        .insert({
          class_id: newClass!.id,
          user_id: teacherId,
          role: 'primary',
          assigned_date: new Date().toISOString(),
        });

      if (teacherError) {
        // Rollback class creation if teacher assignment fails
        await supabase.from('classes').delete().eq('id', newClass!.id);
        throw new ClassServiceError(
          'TEACHER_ASSIGNMENT_FAILED',
          'Failed to assign teacher to class',
          teacherError
        );
      }

      // Log creation in audit trail
      await ClassService.logAuditTrail(
        newClass!.id,
        'create',
        null,
        null,
        newClass,
        teacherId
      );

      return newClass!;
    } catch (error) {
      if (error instanceof ClassServiceError) {
        throw error;
      }
      throw new ClassServiceError(
        'UNEXPECTED_ERROR',
        'An unexpected error occurred',
        error
      );
    }
  }

  /**
   * Get all classes for a specific teacher
   */
  static async getTeacherClasses(
    teacherId: string,
    options?: {
      status?: 'active' | 'inactive' | 'archived';
      searchTerm?: string;
      sortBy?: 'name' | 'level' | 'student_count' | 'created_at';
      sortOrder?: 'asc' | 'desc';
      limit?: number;
      offset?: number;
    }
  ): Promise<ClassWithDetails[]> {
    try {
      let query = supabase
        .from('classes')
        .select(`
          *,
          class_teachers!inner(
            user_id,
            role,
            profiles!inner(full_name)
          ),
          class_students!left(student_id),
          class_subjects!left(id)
        `)
        .eq('class_teachers.user_id', teacherId);

      // Apply filters
      if (options?.status) {
        query = query.eq('status', options.status);
      }

      if (options?.searchTerm) {
        query = query.ilike('name', `%${options.searchTerm}%`);
      }

      // Apply sorting
      const sortBy = options?.sortBy || 'created_at';
      const sortOrder = options?.sortOrder || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
      }

      const { data: classes, error } = await query;

      if (error) {
        throw new ClassServiceError(
          'FETCH_FAILED',
          'Failed to fetch classes',
          error
        );
      }

      // Transform data to include counts and teacher details
      const transformedClasses = classes!.map((classItem) => {
        return {
          ...classItem,
          student_count: classItem.class_students?.length || 0,
          subject_count: classItem.class_subjects?.length || 0,
          teachers: classItem.class_teachers || [],
        };
      });

      return transformedClasses;
    } catch (error) {
      if (error instanceof ClassServiceError) {
        throw error;
      }
      throw new ClassServiceError(
        'UNEXPECTED_ERROR',
        'An unexpected error occurred',
        error
      );
    }
  }

  /**
   * Get a single class by ID
   */
  static async getClassById(classId: number, teacherId: string): Promise<ClassWithDetails> {
    try {
      // Verify teacher has access to this class
      const hasAccess = await ClassService.verifyClassAccess(classId, teacherId);
      if (!hasAccess) {
        throw new ClassServiceError(
          'ACCESS_DENIED',
          'You do not have access to this class'
        );
      }

      const { data: classData, error } = await supabase
        .from('classes')
        .select(`
          *,
          class_teachers!left(*),
          class_students!left(student_id),
          class_subjects!left(*)
        `)
        .eq('id', classId)
        .single();

      if (error) {
        throw new ClassServiceError(
          'FETCH_FAILED',
          'Failed to fetch class',
          error
        );
      }

      // Get teacher details
      const { data: teachers } = await supabase
        .from('class_teachers')
        .select(`
          user_id,
          role,
          profiles!inner(full_name)
        `)
        .eq('class_id', classId);

      return {
        ...classData!,
        student_count: classData!.class_students?.length || 0,
        subject_count: classData!.class_subjects?.length || 0,
        teachers: teachers || [],
      };
    } catch (error) {
      if (error instanceof ClassServiceError) {
        throw error;
      }
      throw new ClassServiceError(
        'UNEXPECTED_ERROR',
        'An unexpected error occurred',
        error
      );
    }
  }

  /**
   * Update a class with validation and audit trail
   */
  static async updateClass(
    classId: number,
    updates: UpdateClassRequest,
    teacherId: string
  ): Promise<Class> {
    try {
      // Validate input data
      const validatedData = UpdateClassSchema.parse(updates);

      // Verify teacher has access to this class
      const hasAccess = await ClassService.verifyClassAccess(classId, teacherId);
      if (!hasAccess) {
        throw new ClassServiceError(
          'ACCESS_DENIED',
          'You do not have access to this class'
        );
      }

      // Get current class data for audit trail
      const { data: oldClass } = await supabase
        .from('classes')
        .select('*')
        .eq('id', classId)
        .single();

      if (!oldClass) {
        throw new ClassServiceError(
          'CLASS_NOT_FOUND',
          'Class not found'
        );
      }

      // Check for duplicate class name if name is being updated
      if (validatedData.name && validatedData.name !== oldClass.name) {
        const existingClass = await ClassService.checkDuplicateClassName(
          validatedData.name,
          teacherId,
          oldClass.school_id
        );
        
        if (existingClass && existingClass.id !== classId) {
          throw new ClassServiceError(
            'DUPLICATE_CLASS_NAME',
            'A class with this name already exists'
          );
        }
      }

      // Update class record
      const { data: updatedClass, error } = await supabase
        .from('classes')
        .update({
          ...validatedData,
          updated_by: teacherId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', classId)
        .select()
        .single();

      if (error) {
        throw new ClassServiceError(
          'UPDATE_FAILED',
          'Failed to update class',
          error
        );
      }

      // Log changes in audit trail
      const changedFields = Object.keys(validatedData);
      await ClassService.logAuditTrail(
        classId,
        'update',
        changedFields,
        oldClass,
        updatedClass,
        teacherId
      );

      return updatedClass!;
    } catch (error) {
      if (error instanceof ClassServiceError) {
        throw error;
      }
      throw new ClassServiceError(
        'UNEXPECTED_ERROR',
        'An unexpected error occurred',
        error
      );
    }
  }

  /**
   * Soft delete a class (set status to archived and deleted_at)
   */
  static async deleteClass(classId: number, teacherId: string): Promise<void> {
    try {
      // Verify teacher has access to this class
      const hasAccess = await ClassService.verifyClassAccess(classId, teacherId);
      if (!hasAccess) {
        throw new ClassServiceError(
          'ACCESS_DENIED',
          'You do not have access to this class'
        );
      }

      // Check for enrolled students
      const { data: enrolledStudents } = await supabase
        .from('class_students')
        .select('student_id')
        .eq('class_id', classId);

      if (enrolledStudents && enrolledStudents.length > 0) {
        throw new ClassServiceError(
          'CLASS_HAS_STUDENTS',
          `Cannot delete class with ${enrolledStudents.length} enrolled students`
        );
      }

      // Get current class data for audit trail
      const { data: oldClass } = await supabase
        .from('classes')
        .select('*')
        .eq('id', classId)
        .single();

      if (!oldClass) {
        throw new ClassServiceError(
          'CLASS_NOT_FOUND',
          'Class not found'
        );
      }

      // Soft delete the class
      const { error } = await supabase
        .from('classes')
        .update({
          status: 'archived',
          deleted_at: new Date().toISOString(),
          updated_by: teacherId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', classId);

      if (error) {
        throw new ClassServiceError(
          'DELETE_FAILED',
          'Failed to delete class',
          error
        );
      }

      // Log deletion in audit trail
      await ClassService.logAuditTrail(
        classId,
        'delete',
        ['status', 'deleted_at'],
        oldClass,
        { ...oldClass, status: 'archived', deleted_at: new Date().toISOString() },
        teacherId
      );
    } catch (error) {
      if (error instanceof ClassServiceError) {
        throw error;
      }
      throw new ClassServiceError(
        'UNEXPECTED_ERROR',
        'An unexpected error occurred',
        error
      );
    }
  }

  /**
   * Restore a soft-deleted class
   */
  static async restoreClass(classId: number, teacherId: string): Promise<Class> {
    try {
      // Verify teacher has access to this class
      const hasAccess = await ClassService.verifyClassAccess(classId, teacherId);
      if (!hasAccess) {
        throw new ClassServiceError(
          'ACCESS_DENIED',
          'You do not have access to this class'
        );
      }

      // Get current class data
      const { data: oldClass } = await supabase
        .from('classes')
        .select('*')
        .eq('id', classId)
        .single();

      if (!oldClass) {
        throw new ClassServiceError(
          'CLASS_NOT_FOUND',
          'Class not found'
        );
      }

      // Restore the class
      const { data: restoredClass, error } = await supabase
        .from('classes')
        .update({
          status: 'active',
          deleted_at: null,
          updated_by: teacherId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', classId)
        .select()
        .single();

      if (error) {
        throw new ClassServiceError(
          'RESTORE_FAILED',
          'Failed to restore class',
          error
        );
      }

      // Log restoration in audit trail
      await ClassService.logAuditTrail(
        classId,
        'restore',
        ['status', 'deleted_at'],
        oldClass,
        restoredClass,
        teacherId
      );

      return restoredClass!;
    } catch (error) {
      if (error instanceof ClassServiceError) {
        throw error;
      }
      throw new ClassServiceError(
        'UNEXPECTED_ERROR',
        'An unexpected error occurred',
        error
      );
    }
  }

  /**
   * Bulk operations
   */
  static async bulkCreateClasses(
    classes: CreateClassRequest[],
    teacherId: string
  ): Promise<{
    results: Class[];
    errors: Array<{
      classData: CreateClassRequest;
      error: string;
    }>;
  }> {
    const results: Class[] = [];
    const errors: Array<{
      classData: CreateClassRequest;
      error: string;
    }> = [];

    for (const classData of classes) {
      try {
        const newClass = await ClassService.createClass(classData, teacherId);
        results.push(newClass);
      } catch (error) {
        errors.push({
          classData,
          error: error instanceof ClassServiceError ? error.message : 'Unknown error',
        });
      }
    }

    return { results, errors };
  }

  static async bulkUpdateClasses(
    request: BulkUpdateRequest,
    teacherId: string
  ): Promise<{
    results: Class[];
    errors: Array<{
      classId: number;
      error: string;
    }>;
  }> {
    const results: Class[] = [];
    const errors: Array<{
      classId: number;
      error: string;
    }> = [];

    for (const classId of request.class_ids) {
      try {
        const updatedClass = await ClassService.updateClass(classId, request.updates, teacherId);
        results.push(updatedClass);
      } catch (error) {
        errors.push({
          classId,
          error: error instanceof ClassServiceError ? error.message : 'Unknown error',
        });
      }
    }

    return { results, errors };
  }

  static async bulkDeleteClasses(
    classIds: number[],
    teacherId: string
  ): Promise<{
    results: number[];
    errors: Array<{
      classId: number;
      error: string;
    }>;
  }> {
    const results: number[] = [];
    const errors: Array<{
      classId: number;
      error: string;
    }> = [];

    for (const classId of classIds) {
      try {
        await ClassService.deleteClass(classId, teacherId);
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
   * Helper methods
   */
  private static async checkDuplicateClassName(
    name: string,
    teacherId: string,
    schoolId: number
  ): Promise<Class | null> {
    const { data: existingClass } = await supabase
      .from('classes')
      .select('*')
      .eq('name', name)
      .eq('school_id', schoolId)
      .eq('status', 'active')
      .single();

    return existingClass || null;
  }

  private static async verifyClassAccess(classId: number, teacherId: string): Promise<boolean> {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, school_id')
      .eq('id', teacherId)
      .single();

    if (!profile) return false;

    // Administrators have access to all classes
    if (profile.role === 'management') {
      return true;
    }

    // Check if teacher is assigned to this class
    const { data: teacherAssignment } = await supabase
      .from('class_teachers')
      .select('user_id')
      .eq('class_id', classId)
      .eq('user_id', teacherId)
      .single();

    return !!teacherAssignment;
  }

  private static async logAuditTrail(
    classId: number,
    action: string,
    changedFields: string[] | null,
    oldValues: any,
    newValues: any,
    performedBy: string
  ): Promise<void> {
    const { error } = await supabase.from('class_audit_log').insert({
      class_id: classId,
      action,
      changed_fields: changedFields,
      old_values: oldValues,
      new_values: newValues,
      performed_by: performedBy,
    });

    if (error) {
      console.error('Failed to log audit trail:', error);
    }
  }
}