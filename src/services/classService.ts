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
      const insertData = {
        ...validatedData,
        created_by: teacherId,
        updated_by: teacherId,
        status: 'active',
      };
      
      console.log('Attempting to insert class with data:', insertData);
      
      const { data: newClass, error: insertError } = await supabase
        .from('classes')
        .insert(insertData)
        .select()
        .single();

      if (insertError) {
        console.error('Class creation failed - Full error details:', {
          error: insertError,
          errorCode: insertError.code,
          errorMessage: insertError.message,
          errorDetails: insertError.details,
          errorHint: insertError.hint,
          insertData: insertData,
          teacherId: teacherId
        });
        throw new ClassServiceError(
          'CREATE_FAILED',
          `Failed to create class: ${insertError.message}`,
          insertError
        );
      }

      // Create class-teacher relationship record
      console.log('Creating class-teacher relationship:', {
        class_id: newClass!.id,
        user_id: teacherId,
        role: 'primary',
        assigned_date: new Date().toISOString(),
      });
      
      const { error: teacherError } = await supabase
        .from('class_teachers')
        .insert({
          class_id: newClass!.id,
          user_id: teacherId,
          role: 'primary',
          assigned_date: new Date().toISOString(),
        });

      if (teacherError) {
        console.error('Teacher assignment failed - Full error details:', {
          error: teacherError,
          errorCode: teacherError.code,
          errorMessage: teacherError.message,
          errorDetails: teacherError.details,
          errorHint: teacherError.hint,
          classId: newClass!.id,
          teacherId: teacherId,
          teacherIdType: typeof teacherId,
          insertData: {
            class_id: newClass!.id,
            user_id: teacherId,
            role: 'primary',
            assigned_date: new Date().toISOString(),
          }
        });
        // Rollback class creation if teacher assignment fails
        await supabase.from('classes').delete().eq('id', newClass!.id);
        throw new ClassServiceError(
          'TEACHER_ASSIGNMENT_FAILED',
          `Failed to assign teacher to class: ${teacherError.message}`,
          teacherError
        );
      }
      
      console.log('Class and teacher assignment successful for class:', newClass!.id);

      // Log creation in audit trail (non-blocking)
      try {
        await ClassService.logAuditTrail(
          newClass!.id,
          'create',
          null,
          null,
          newClass,
          teacherId
        );
        console.log('Audit trail logged successfully for class:', newClass!.id);
      } catch (auditError: any) {
        console.warn('Audit trail logging failed (non-blocking) - Full error details:', {
          error: auditError,
          errorCode: auditError?.code,
          errorMessage: auditError?.message,
          errorDetails: auditError?.details,
          errorHint: auditError?.hint,
          classId: newClass!.id,
          teacherId: teacherId,
          action: 'create',
          oldValues: null,
          newValues: newClass
        });
      }

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
          class_teachers!left(
            user_id,
            role,
            profiles!inner(full_name)
          ),
          class_students!left(student_id),
          class_subjects!left(id)
        `);
        
      // Filter for classes where the teacher is assigned
      // We'll filter this in the application layer to handle the left join properly

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

      console.log('getTeacherClasses query result:', {
        teacherId,
        classesCount: classes?.length || 0,
        error: error?.message,
        options
      });

      if (error) {
        console.error('getTeacherClasses error:', error);
        throw new ClassServiceError(
          'FETCH_FAILED',
          'Failed to fetch classes',
          error
        );
      }

      // Filter classes to only include those where the teacher is assigned
      const filteredClasses = classes!.filter((classItem) => {
        if (!classItem.class_teachers) return false;
        return classItem.class_teachers.some((teacher: any) => teacher.user_id === teacherId);
      });
      
      console.log('Filtered classes count:', filteredClasses.length);
      
      // Transform data to include counts and teacher details
      const transformedClasses = filteredClasses.map((classItem) => {
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

  /**
   * Student Enrollment Methods
   */

  /**
   * Add multiple students to a class with validation and capacity checks
   */
  static async addStudentsToClass(
    classId: number,
    studentIds: string[],
    teacherId: string
  ): Promise<{
    success: string[];
    errors: Array<{ studentId: string; error: string }>;
  }> {
    try {
      // Validate teacher access
      const hasAccess = await ClassService.validateTeacherAccess(classId, teacherId);
      if (!hasAccess) {
        throw new ClassServiceError(
          'ACCESS_DENIED',
          'You do not have access to this class'
        );
      }

      // Get class details and current enrollment
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('id, name, student_capacity, school_id')
        .eq('id', classId)
        .eq('status', 'active')
        .single();

      if (classError || !classData) {
        throw new ClassServiceError(
          'CLASS_NOT_FOUND',
          'Class not found or inactive'
        );
      }

      // Get current enrollment count
      const { count: currentEnrollment, error: countError } = await supabase
        .from('class_students')
        .select('*', { count: 'exact', head: true })
        .eq('class_id', classId);

      if (countError) {
        throw new ClassServiceError(
          'ENROLLMENT_CHECK_FAILED',
          'Failed to check current enrollment'
        );
      }

      // Check capacity
      const availableSpots = classData.student_capacity - (currentEnrollment || 0);
      if (studentIds.length > availableSpots) {
        throw new ClassServiceError(
          'CAPACITY_EXCEEDED',
          `Cannot add ${studentIds.length} students. Only ${availableSpots} spots available.`
        );
      }

      // Validate students belong to same school and are not already enrolled
      const { data: students, error: studentsError } = await supabase
        .from('profiles')
        .select('id, school_id, role')
        .in('id', studentIds)
        .eq('school_id', classData.school_id)
        .eq('role', 'student');

      if (studentsError) {
        throw new ClassServiceError(
          'STUDENT_VALIDATION_FAILED',
          'Failed to validate students'
        );
      }

      // Check for already enrolled students
      const { data: alreadyEnrolled } = await supabase
        .from('class_students')
        .select('student_id')
        .eq('class_id', classId)
        .in('student_id', studentIds);

      const enrolledIds = new Set(alreadyEnrolled?.map(e => e.student_id) || []);
      const validStudentIds = students?.map(s => s.id) || [];
      const success: string[] = [];
      const errors: Array<{ studentId: string; error: string }> = [];

      // Process each student
      for (const studentId of studentIds) {
        try {
          // Check if student exists and is valid
          if (!validStudentIds.includes(studentId)) {
            errors.push({
              studentId,
              error: 'Student not found or not in same school'
            });
            continue;
          }

          // Check if already enrolled
          if (enrolledIds.has(studentId)) {
            errors.push({
              studentId,
              error: 'Student already enrolled in this class'
            });
            continue;
          }

          // Add student to class
          const { error: enrollError } = await supabase
            .from('class_students')
            .insert({
              class_id: classId,
              student_id: studentId,
              enrolled_date: new Date().toISOString()
            });

          if (enrollError) {
            errors.push({
              studentId,
              error: `Failed to enroll: ${enrollError.message}`
            });
          } else {
            success.push(studentId);
            // Log enrollment action
            await ClassService.logEnrollmentAction(
              classId,
              studentId,
              'add',
              teacherId
            );
          }
        } catch (error: any) {
          errors.push({
            studentId,
            error: error.message || 'Unknown error'
          });
        }
      }

      return { success, errors };
    } catch (error) {
      if (error instanceof ClassServiceError) {
        throw error;
      }
      throw new ClassServiceError(
        'UNEXPECTED_ERROR',
        'An unexpected error occurred during enrollment',
        error
      );
    }
  }

  /**
   * Remove a student from a class with access validation
   */
  static async removeStudentFromClass(
    classId: number,
    studentId: string,
    teacherId: string
  ): Promise<void> {
    try {
      // Validate teacher access
      const hasAccess = await ClassService.validateTeacherAccess(classId, teacherId);
      if (!hasAccess) {
        throw new ClassServiceError(
          'ACCESS_DENIED',
          'You do not have access to this class'
        );
      }

      // Check if student is enrolled in the class
      const { data: enrollment, error: checkError } = await supabase
        .from('class_students')
        .select('*')
        .eq('class_id', classId)
        .eq('student_id', studentId)
        .single();

      if (checkError || !enrollment) {
        throw new ClassServiceError(
          'STUDENT_NOT_ENROLLED',
          'Student is not enrolled in this class'
        );
      }

      // Remove student from class
      const { error: removeError } = await supabase
        .from('class_students')
        .delete()
        .eq('class_id', classId)
        .eq('student_id', studentId);

      if (removeError) {
        throw new ClassServiceError(
          'REMOVAL_FAILED',
          `Failed to remove student: ${removeError.message}`
        );
      }

      // Log removal action
      await ClassService.logEnrollmentAction(
        classId,
        studentId,
        'remove',
        teacherId
      );
    } catch (error) {
      if (error instanceof ClassServiceError) {
        throw error;
      }
      throw new ClassServiceError(
        'UNEXPECTED_ERROR',
        'An unexpected error occurred during removal',
        error
      );
    }
  }

  /**
   * Get available students for enrollment (not yet enrolled in the class)
   */
  static async getAvailableStudents(
    classId: number,
    teacherId: string,
    filters?: {
      search?: string;
      boarding?: boolean;
      gender?: string;
    },
    pagination?: {
      page?: number;
      limit?: number;
    }
  ): Promise<{
    students: Array<{
      id: string;
      full_name: string;
      nis: string;
      gender: string;
      boarding: boolean;
      date_of_birth: string;
    }>;
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      // Validate teacher access
      const hasAccess = await ClassService.validateTeacherAccess(classId, teacherId);
      if (!hasAccess) {
        throw new ClassServiceError(
          'ACCESS_DENIED',
          'You do not have access to this class'
        );
      }

      // Get class school_id
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('school_id')
        .eq('id', classId)
        .single();

      if (classError || !classData) {
        throw new ClassServiceError(
          'CLASS_NOT_FOUND',
          'Class not found'
        );
      }

      // Get enrolled student IDs
      const { data: enrolledStudents } = await supabase
        .from('class_students')
        .select('student_id')
        .eq('class_id', classId);

      const enrolledIds = enrolledStudents?.map(e => e.student_id) || [];

      // Build query for available students
       let query = supabase
         .from('profiles')
         .select(`
           id,
           full_name,
           school_id,
           student_details(
             nis,
             gender,
             boarding,
             date_of_birth
           )
         `)
         .eq('role', 'student')
         .eq('school_id', classData.school_id)
         .not('student_details', 'is', null);

       // Exclude already enrolled students
       if (enrolledIds.length > 0) {
         query = query.not('id', 'in', `(${enrolledIds.join(',')})`);
       }

       // Apply filters
       if (filters?.search) {
         query = query.or(`full_name.ilike.%${filters.search}%,student_details.nis.ilike.%${filters.search}%`);
       }
       if (filters?.boarding !== undefined) {
         query = query.eq('student_details.boarding', filters.boarding);
       }
       if (filters?.gender) {
         query = query.eq('student_details.gender', filters.gender);
       }

      // Get total count for pagination
       const countQuery = supabase
         .from('profiles')
         .select('id', { count: 'exact', head: true })
         .eq('role', 'student')
         .eq('school_id', classData.school_id);

       // Exclude already enrolled students from count
       if (enrolledIds.length > 0) {
         countQuery.not('id', 'in', `(${enrolledIds.join(',')})`);
       }

       const { count: total, error: countError } = await countQuery;

      if (countError) {
        throw new ClassServiceError(
          'COUNT_FAILED',
          'Failed to count available students'
        );
      }

      // Apply pagination
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 20;
      const offset = (page - 1) * limit;

      const { data: students, error: studentsError } = await query
        .range(offset, offset + limit - 1)
        .order('full_name');

      if (studentsError) {
        throw new ClassServiceError(
          'FETCH_FAILED',
          'Failed to fetch available students'
        );
      }

      // Transform data
       const transformedStudents = students?.map(student => {
         const details = Array.isArray(student.student_details) 
           ? student.student_details[0] 
           : student.student_details;
         
         return {
           id: student.id,
           full_name: student.full_name,
           nis: details?.nis || '',
           gender: details?.gender || '',
           boarding: details?.boarding || false,
           date_of_birth: details?.date_of_birth || ''
         };
       }) || [];

      return {
        students: transformedStudents,
        total: total || 0,
        page,
        limit
      };
    } catch (error) {
      if (error instanceof ClassServiceError) {
        throw error;
      }
      throw new ClassServiceError(
        'UNEXPECTED_ERROR',
        'An unexpected error occurred while fetching students',
        error
      );
    }
  }

  /**
   * Validate if a teacher has access to a specific class
   */
  static async validateTeacherAccess(classId: number, teacherId: string): Promise<boolean> {
    try {
      // Get teacher profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, school_id')
        .eq('id', teacherId)
        .single();

      if (profileError || !profile) {
        return false;
      }

      // Management has access to all classes in their school
      if (profile.role === 'management') {
        const { data: classData } = await supabase
          .from('classes')
          .select('school_id')
          .eq('id', classId)
          .single();
        
        return classData?.school_id === profile.school_id;
      }

      // Teachers need to be assigned to the class
      if (profile.role === 'teacher') {
        const { data: assignment } = await supabase
          .from('class_teachers')
          .select('user_id')
          .eq('class_id', classId)
          .eq('user_id', teacherId)
          .single();
        
        return !!assignment;
      }

      return false;
    } catch (error) {
      console.error('Error validating teacher access:', error);
      return false;
    }
  }

  /**
   * Log student enrollment/removal actions for auditing
   */
  static async logEnrollmentAction(
    classId: number,
    studentId: string,
    action: 'add' | 'remove',
    performedBy: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('audit_logs')
        .insert({
          table_name: 'class_students',
          operation: action === 'add' ? 'INSERT' : 'DELETE',
          record_id: `${classId},${studentId}`,
          new_values: action === 'add' ? { class_id: classId, student_id: studentId } : null,
          old_values: action === 'remove' ? { class_id: classId, student_id: studentId } : null,
          user_id: performedBy,
          metadata: {
            action_type: 'student_enrollment',
            class_id: classId,
            student_id: studentId,
            performed_action: action
          }
        });

      if (error) {
        console.error('Failed to log enrollment action:', error);
      }
    } catch (error) {
      console.error('Error logging enrollment action:', error);
    }
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