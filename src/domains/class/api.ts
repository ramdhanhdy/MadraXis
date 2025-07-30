import { supabase } from '@lib/utils/supabase';
import { logger } from '@lib/utils/logger';
import { withRetry } from '@lib/utils/retry';
import { sanitizeLikeInput, sanitizeSortParams } from '@lib/utils/sanitization';
import { Class } from '@types';
import {
  CreateClassRequest,
  UpdateClassRequest,
  ClassWithDetails,
  GetClassesOptions,
  GetAvailableStudentsOptions,
  GetClassStudentsOptions,
  EnrollStudentRequest,
  BulkEnrollStudentsRequest,
  BulkUpdateClassesRequest,
  StudentWithDetails,
  ClassServiceError,
  CreateClassSchema,
  UpdateClassSchema,
  BulkUpdateClassSchema,
  EnrollStudentSchema,
  BulkEnrollStudentsSchema
} from './types';

/**
 * ClassRepository handles direct database operations for classes
 */
export class ClassRepository {
  /**
   * Create a new class record in the database
   */
  static async create(classData: CreateClassRequest, teacherId: string): Promise<ClassWithDetails> {
    // Validate input data
    const validatedData = CreateClassSchema.parse(classData);
    
    // Security validation: Verify teacher belongs to the same school as the class being created
    const { data: teacherProfile, error: teacherError } = await supabase
      .from('profiles')
      .select('school_id')
      .eq('id', teacherId)
      .single();

    if (teacherError || !teacherProfile) {
      throw ClassServiceError.create(
        'AUTHORIZATION_FAILED',
        'Teacher profile not found or invalid',
        { originalError: teacherError, teacherId }
      );
    }

    if (teacherProfile.school_id !== validatedData.school_id) {
      throw ClassServiceError.create(
        'AUTHORIZATION_FAILED',
        'You can only create classes for your own school',
        { 
          teacherId,
          additionalContext: {
            teacherSchoolId: teacherProfile.school_id,
            requestedSchoolId: validatedData.school_id
          }
        }
      );
    }
    
    const insertData = {
      ...validatedData,
      created_by: teacherId,
      updated_by: teacherId,
      status: 'active',
    };
    
    logger.debug('Attempting to create class', {
      operation: 'class_create',
      userId: teacherId,
      schoolId: validatedData.school_id
    });
    
    const { data: newClass, error: insertError } = await supabase
      .from('classes')
      .insert(insertData)
      .select()
      .single();

    if (insertError) {
      logger.error('Failed to create class', {
        error: insertError.message,
        code: insertError.code,
        operation: 'class_create',
        userId: teacherId
      });
      
      if (insertError.code === '23505') {
        throw ClassServiceError.create(
          'DUPLICATE_CLASS_NAME',
          'A class with this name already exists in your school',
          { originalError: insertError, classData: validatedData }
        );
      }
      
      throw ClassServiceError.create(
        'DATABASE_ERROR',
        'Failed to create class',
        { originalError: insertError, classData: validatedData }
      );
    }

    // Assign the teacher to the newly created class
    const { error: assignmentError } = await supabase
      .from('class_teachers')
      .insert({
        class_id: newClass.id,
        user_id: teacherId,
        role: 'primary',
        assigned_by: teacherId,
        assigned_at: new Date().toISOString()
      });

    if (assignmentError) {
      logger.error('Failed to assign teacher to class', {
        error: assignmentError.message,
        classId: newClass.id,
        teacherId,
        operation: 'class_create'
      });
      
      // Clean up the created class if teacher assignment fails
      await supabase.from('classes').delete().eq('id', newClass.id);
      
      throw ClassServiceError.create(
        'TEACHER_ASSIGNMENT_FAILED',
        'Failed to assign teacher to the newly created class',
        { originalError: assignmentError, classId: newClass.id, teacherId }
      );
    }

    // Return the class with details
    return this.getById(newClass.id) as Promise<ClassWithDetails>;
  }

  /**
   * Get a class by ID with full details
   */
  static async getById(classId: number): Promise<ClassWithDetails | null> {
    const { data, error } = await supabase
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
      .eq('id', classId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Class not found
      }
      throw ClassServiceError.create(
        'DATABASE_ERROR',
        'Failed to fetch class details',
        { originalError: error, classId }
      );
    }

    // Transform the data to include counts and teacher details
    const classWithDetails: ClassWithDetails = {
      ...data,
      student_count: data.class_students?.length || 0,
      subject_count: data.class_subjects?.length || 0,
      teacher_count: data.class_teachers?.length || 0,
      teachers: data.class_teachers?.map((ct: any) => ({
        user_id: ct.user_id,
        role: ct.role,
        full_name: ct.profiles.full_name
      })) || []
    };

    return classWithDetails;
  }

  /**
   * Get classes for a specific teacher
   */
  static async getByTeacher(
    teacherId: string,
    options?: GetClassesOptions
  ): Promise<{ classes: ClassWithDetails[]; total: number }> {
    // Build the base query with JOIN to filter classes by teacher directly in the database
    let queryBuilder = supabase
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
      queryBuilder = queryBuilder.eq('status', options.status);
    }

    if (options?.searchTerm) {
      const sanitizedSearch = sanitizeLikeInput(options.searchTerm);
      queryBuilder = queryBuilder.ilike('name', `%${sanitizedSearch}%`);
    }

    // Apply sorting
    const { column, ascending } = sanitizeSortParams(
      options?.sortBy || 'created_at',
      options?.sortOrder || 'desc',
      ['name', 'created_at', 'updated_at']
    );
    queryBuilder = queryBuilder.order(column, { ascending });

    // Apply pagination
    const limit = Math.min(options?.limit || 10, 100);
    const offset = ((options?.page || 1) - 1) * limit;
    queryBuilder = queryBuilder.range(offset, offset + limit - 1);

    const { data, error, count } = await queryBuilder;

    if (error) {
      throw ClassServiceError.create(
        'DATABASE_ERROR',
        'Failed to fetch teacher classes',
        { originalError: error, teacherId, options }
      );
    }

    // Transform the data to include counts
    const classes: ClassWithDetails[] = (data || []).map((classData: any) => ({
      ...classData,
      student_count: classData.class_students?.length || 0,
      subject_count: classData.class_subjects?.length || 0,
      teacher_count: classData.class_teachers?.length || 0,
      teachers: classData.class_teachers?.map((ct: any) => ({
        user_id: ct.user_id,
        role: ct.role,
        full_name: ct.profiles.full_name
      })) || []
    }));

    return {
      classes,
      total: count || 0
    };
  }

  /**
   * Update a class
   */
  static async update(
    classId: number,
    updateData: UpdateClassRequest,
    teacherId: string
  ): Promise<ClassWithDetails> {
    // Validate input data
    const validatedData = UpdateClassSchema.parse(updateData);
    
    const { data: updatedClass, error } = await supabase
      .from('classes')
      .update({
        ...validatedData,
        updated_by: teacherId,
        updated_at: new Date().toISOString()
      })
      .eq('id', classId)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw ClassServiceError.create(
          'DUPLICATE_CLASS_NAME',
          'A class with this name already exists in your school',
          { originalError: error, classId, updateData: validatedData }
        );
      }
      
      throw ClassServiceError.create(
        'DATABASE_ERROR',
        'Failed to update class',
        { originalError: error, classId, updateData: validatedData }
      );
    }

    // Return the updated class with details
    return this.getById(classId) as Promise<ClassWithDetails>;
  }

  /**
   * Soft delete a class
   */
  static async softDelete(classId: number, teacherId: string): Promise<void> {
    const { error } = await supabase
      .from('classes')
      .update({
        status: 'archived',
        updated_by: teacherId,
        updated_at: new Date().toISOString()
      })
      .eq('id', classId);

    if (error) {
      throw ClassServiceError.create(
        'DATABASE_ERROR',
        'Failed to delete class',
        { originalError: error, classId, teacherId }
      );
    }
  }

  /**
   * Restore a deleted class
   */
  static async restore(classId: number, teacherId: string): Promise<ClassWithDetails> {
    const { error } = await supabase
      .from('classes')
      .update({
        status: 'active',
        updated_by: teacherId,
        updated_at: new Date().toISOString()
      })
      .eq('id', classId);

    if (error) {
      throw ClassServiceError.create(
        'DATABASE_ERROR',
        'Failed to restore class',
        { originalError: error, classId, teacherId }
      );
    }

    return this.getById(classId) as Promise<ClassWithDetails>;
  }

  /**
   * Get enrolled student count for a class
   */
  static async getEnrolledStudentCount(classId: number): Promise<number> {
    const { count, error } = await supabase
      .from('class_students')
      .select('*', { count: 'exact', head: true })
      .eq('class_id', classId);

    if (error) {
      throw ClassServiceError.create(
        'DATABASE_ERROR',
        'Failed to get student count',
        { originalError: error, classId }
      );
    }

    return count || 0;
  }

  /**
   * Check for duplicate class name
   */
  static async checkDuplicateClassName(
    className: string,
    schoolId: number,
    excludeClassId?: number
  ): Promise<boolean> {
    let query = supabase
      .from('classes')
      .select('id')
      .eq('name', className)
      .eq('school_id', schoolId)
      .neq('status', 'archived');

    if (excludeClassId) {
      query = query.neq('id', excludeClassId);
    }

    const { data, error } = await query;

    if (error) {
      throw ClassServiceError.create(
        'DATABASE_ERROR',
        'Failed to check duplicate class name',
        { originalError: error, className, schoolId }
      );
    }

    return (data?.length || 0) > 0;
  }
}

/**
 * ClassAccessControl handles permission checks and access validation
 */
export class ClassAccessControl {
  /**
   * Verify if a teacher has access to a specific class
   */
  static async verifyClassAccess(
    classId: number,
    teacherId: string,
    validateSchool: boolean = true
  ): Promise<boolean> {
    try {
      if (validateSchool) {
        // First get the teacher's school_id
        const { data: teacherProfile, error: teacherError } = await supabase
          .from('profiles')
          .select('school_id')
          .eq('id', teacherId)
          .single();

        if (teacherError || !teacherProfile) {
          return false;
        }

        // Then check if the class belongs to the same school and teacher has access
        const { data: classData, error: classError } = await supabase
          .from('classes')
          .select(`
            school_id,
            class_teachers!inner(user_id)
          `)
          .eq('id', classId)
          .eq('class_teachers.user_id', teacherId)
          .eq('school_id', teacherProfile.school_id)
          .single();

        return !classError && !!classData;
      } else {
        // Just check if teacher is assigned to the class
        const { data: classTeacher, error } = await supabase
          .from('class_teachers')
          .select('user_id')
          .eq('class_id', classId)
          .eq('user_id', teacherId)
          .single();

        return !error && !!classTeacher;
      }
    } catch (error) {
      logger.error('Error verifying class access', {
        error: error instanceof Error ? error.message : String(error),
        classId,
        teacherId,
        validateSchool
      });
      return false;
    }
  }

  /**
   * Validate teacher access to a class with detailed error handling
   */
  static async validateTeacherAccess(
    classId: number,
    teacherId: string,
    operation: string
  ): Promise<void> {
    const hasAccess = await this.verifyClassAccess(classId, teacherId, true);

    if (!hasAccess) {
      throw ClassServiceError.create(
        'ACCESS_DENIED',
        `You do not have permission to ${operation} this class`,
        { classId, teacherId, operation }
      );
    }
  }

  /**
   * Check if a class exists
   */
  static async checkClassExists(classId: number): Promise<boolean> {
    const { data, error } = await supabase
      .from('classes')
      .select('id')
      .eq('id', classId)
      .single();

    return !error && !!data;
  }

  /**
   * Validate class name uniqueness
   */
  static async validateUniqueClassName(
    className: string,
    schoolId: number,
    excludeClassId?: number
  ): Promise<void> {
    const isDuplicate = await ClassRepository.checkDuplicateClassName(
      className,
      schoolId,
      excludeClassId
    );

    if (isDuplicate) {
      throw ClassServiceError.create(
        'DUPLICATE_CLASS_NAME',
        'A class with this name already exists in your school',
        { className, schoolId, excludeClassId }
      );
    }
  }

  /**
   * Validate class can be deleted (no enrolled students)
   */
  static async validateClassDeletion(classId: number): Promise<void> {
    const studentCount = await ClassRepository.getEnrolledStudentCount(classId);

    if (studentCount > 0) {
      throw ClassServiceError.create(
        'CLASS_HAS_STUDENTS',
        'Cannot delete class with enrolled students',
        { classId, studentCount }
      );
    }
  }
}

/**
 * ClassEnrollmentService handles student enrollment operations
 */
export class ClassEnrollmentService {
  /**
   * Get available students for enrollment with retry logic
   */
  static async getAvailableStudents(
    classId: number,
    teacherId: string,
    options?: GetAvailableStudentsOptions
  ): Promise<{ students: StudentWithDetails[]; total: number }> {
    // Get teacher's school_id for filtering
    const { data: teacherProfile, error: teacherError } = await supabase
      .from('profiles')
      .select('school_id')
      .eq('id', teacherId)
      .single();

    if (teacherError || !teacherProfile) {
      throw ClassServiceError.create(
        'TEACHER_NOT_FOUND',
        'Teacher profile not found',
        { originalError: teacherError, teacherId }
      );
    }

    // Build query to get students not enrolled in this class
    let queryBuilder = supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        student_details (
          nis,
          gender,
          boarding,
          date_of_birth
        )
      `)
      .eq('role', 'student')
      .eq('school_id', teacherProfile.school_id)
      .not('id', 'in', `(
        SELECT student_id
        FROM class_students
        WHERE class_id = ${classId}
      )`);

    // Apply filters
    if (options?.searchTerm) {
      const sanitizedSearch = sanitizeLikeInput(options.searchTerm);
      queryBuilder = queryBuilder.ilike('full_name', `%${sanitizedSearch}%`);
    }

    if (options?.gender) {
      queryBuilder = queryBuilder.eq('student_details.gender', options.gender);
    }

    if (options?.boarding) {
      queryBuilder = queryBuilder.eq('student_details.boarding', options.boarding);
    }

    // Apply pagination
    const limit = Math.min(options?.limit || 10, 100);
    const offset = ((options?.page || 1) - 1) * limit;
    queryBuilder = queryBuilder
      .order('full_name')
      .range(offset, offset + limit - 1);

    const { data, error, count } = await queryBuilder;

    if (error) {
      throw ClassServiceError.create(
        'DATABASE_ERROR',
        'Failed to fetch available students',
        { originalError: error, classId, teacherId, options }
      );
    }

    // Transform the data
    const students: StudentWithDetails[] = (data || []).map((profile: any) => ({
      id: profile.id,
      full_name: profile.full_name,
      nis: profile.student_details?.[0]?.nis,
      gender: profile.student_details?.[0]?.gender,
      boarding: profile.student_details?.[0]?.boarding,
      date_of_birth: profile.student_details?.[0]?.date_of_birth
    }));

    return {
      students,
      total: count || 0
    };
  }

  /**
   * Get students enrolled in a class
   */
  static async getClassStudents(
    classId: number,
    teacherId: string,
    options?: GetClassStudentsOptions
  ): Promise<{ students: StudentWithDetails[]; total: number }> {
    // Build query to get enrolled students
    let queryBuilder = supabase
      .from('class_students')
      .select(`
        student_id,
        enrollment_date,
        notes,
        profiles!inner (
          id,
          full_name,
          student_details (
            nis,
            gender,
            boarding,
            date_of_birth
          )
        )
      `)
      .eq('class_id', classId);

    // Apply search filter
    if (options?.searchTerm) {
      const sanitizedSearch = sanitizeLikeInput(options.searchTerm);
      queryBuilder = queryBuilder.ilike('profiles.full_name', `%${sanitizedSearch}%`);
    }

    // Apply pagination
    const limit = Math.min(options?.limit || 10, 100);
    const offset = ((options?.page || 1) - 1) * limit;
    queryBuilder = queryBuilder
      .order('profiles.full_name')
      .range(offset, offset + limit - 1);

    const { data, error, count } = await queryBuilder;

    if (error) {
      throw ClassServiceError.create(
        'DATABASE_ERROR',
        'Failed to fetch class students',
        { originalError: error, classId, teacherId, options }
      );
    }

    // Transform the data
    const students: StudentWithDetails[] = (data || []).map((enrollment: any) => ({
      id: enrollment.profiles.id,
      full_name: enrollment.profiles.full_name,
      nis: enrollment.profiles.student_details?.[0]?.nis,
      gender: enrollment.profiles.student_details?.[0]?.gender,
      boarding: enrollment.profiles.student_details?.[0]?.boarding,
      date_of_birth: enrollment.profiles.student_details?.[0]?.date_of_birth,
      enrollment_date: enrollment.enrollment_date,
      notes: enrollment.notes
    }));

    return {
      students,
      total: count || 0
    };
  }

  /**
   * Enroll a single student in a class
   */
  static async enrollStudent(
    classId: number,
    enrollmentData: EnrollStudentRequest,
    teacherId: string
  ): Promise<void> {
    // Validate input
    const validatedData = EnrollStudentSchema.parse(enrollmentData);

    // Get teacher's school_id for the atomic function
    const { data: teacherProfile } = await supabase
      .from('profiles')
      .select('school_id')
      .eq('id', teacherId)
      .single();

    if (!teacherProfile) {
      throw ClassServiceError.create(
        'TEACHER_NOT_FOUND',
        'Teacher profile not found',
        { teacherId, classId }
      );
    }

    // Use atomic function to enroll student with capacity checking
    const { data: result, error } = await supabase
      .rpc('add_students_to_class_atomic', {
        p_class_id: classId,
        p_student_ids: [validatedData.student_id],
        p_teacher_id: teacherId,
        p_school_id: teacherProfile.school_id
      });

    if (error) {
      throw ClassServiceError.create(
        'ENROLLMENT_FAILED',
        'Failed to enroll student',
        { originalError: error, classId, studentId: validatedData.student_id, teacherId }
      );
    }

    // Check if enrollment was successful
    if (!result || result.length === 0) {
      throw ClassServiceError.create(
        'ENROLLMENT_FAILED',
        'Atomic enrollment function returned no results',
        { classId, studentId: validatedData.student_id, teacherId }
      );
    }

    const enrollmentResult = result[0];
    if (!enrollmentResult.success) {
      throw ClassServiceError.create(
        'ENROLLMENT_FAILED',
        enrollmentResult.error || 'Failed to enroll student',
        { classId, studentId: validatedData.student_id, teacherId, result: enrollmentResult }
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
    // Validate input
    const validatedData = BulkEnrollStudentsSchema.parse(enrollmentData);

    // Get teacher's school_id for the atomic function
    const { data: teacherProfile } = await supabase
      .from('profiles')
      .select('school_id')
      .eq('id', teacherId)
      .single();

    if (!teacherProfile) {
      throw ClassServiceError.create(
        'TEACHER_NOT_FOUND',
        'Teacher profile not found',
        { teacherId, classId }
      );
    }

    // Use atomic function to enroll students with capacity checking
    const { data: result, error } = await supabase
      .rpc('add_students_to_class_atomic', {
        p_class_id: classId,
        p_student_ids: validatedData.student_ids,
        p_teacher_id: teacherId,
        p_school_id: teacherProfile.school_id
      });

    if (error) {
      throw ClassServiceError.create(
        'BULK_ENROLLMENT_FAILED',
        'Failed to bulk enroll students',
        { originalError: error, classId, studentIds: validatedData.student_ids, teacherId }
      );
    }

    // Process results
    const results: string[] = [];
    const errors: { studentId: string; error: string }[] = [];

    if (result && Array.isArray(result)) {
      result.forEach((enrollmentResult: any) => {
        if (enrollmentResult.success) {
          results.push(enrollmentResult.student_id);
        } else {
          errors.push({
            studentId: enrollmentResult.student_id,
            error: enrollmentResult.error || 'Unknown error'
          });
        }
      });
    }

    return { results, errors };
  }

  /**
   * Remove a student from a class
   */
  static async removeStudent(
    classId: number,
    studentId: string,
    teacherId: string
  ): Promise<void> {
    const { error } = await supabase
      .from('class_students')
      .delete()
      .eq('class_id', classId)
      .eq('student_id', studentId);

    if (error) {
      throw ClassServiceError.create(
        'REMOVAL_FAILED',
        'Failed to remove student from class',
        { originalError: error, classId, studentId, teacherId }
      );
    }
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
    const results: string[] = [];
    const errors: { studentId: string; error: string }[] = [];

    // Process each student removal
    for (const studentId of studentIds) {
      try {
        await this.removeStudent(classId, studentId, teacherId);
        results.push(studentId);
      } catch (error) {
        errors.push({
          studentId,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return { results, errors };
  }
}

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
    errors: { classId: number; error: string }[];
  }> {
    // Validate input
    const validatedData = BulkUpdateClassSchema.parse(updateData);

    const results: number[] = [];
    const errors: { classId: number; error: string }[] = [];

    // Process each class update
    for (const classId of validatedData.class_ids) {
      try {
        // Validate access first
        await ClassAccessControl.validateTeacherAccess(classId, teacherId, 'update');

        // Update the class
        await ClassRepository.update(classId, validatedData.updates, teacherId);
        results.push(classId);
      } catch (error) {
        errors.push({
          classId,
          error: error instanceof Error ? error.message : 'Unknown error'
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
    errors: { classId: number; error: string }[];
  }> {
    const results: number[] = [];
    const errors: { classId: number; error: string }[] = [];

    // Process each class deletion
    for (const classId of classIds) {
      try {
        // Validate access first
        await ClassAccessControl.validateTeacherAccess(classId, teacherId, 'delete');

        // Validate class can be deleted
        await ClassAccessControl.validateClassDeletion(classId);

        // Delete the class
        await ClassRepository.softDelete(classId, teacherId);
        results.push(classId);
      } catch (error) {
        errors.push({
          classId,
          error: error instanceof Error ? error.message : 'Unknown error'
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
    errors: { classId: number; error: string }[];
  }> {
    const results: number[] = [];
    const errors: { classId: number; error: string }[] = [];

    // Process each class restoration
    for (const classId of classIds) {
      try {
        // Validate access first
        await ClassAccessControl.validateTeacherAccess(classId, teacherId, 'restore');

        // Restore the class
        await ClassRepository.restore(classId, teacherId);
        results.push(classId);
      } catch (error) {
        errors.push({
          classId,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return { results, errors };
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
    let accessible = 0;
    let withStudents = 0;
    let deleted = 0;
    let active = 0;

    // Check each class
    for (const classId of classIds) {
      try {
        const hasAccess = await ClassAccessControl.verifyClassAccess(classId, teacherId, true);
        if (hasAccess) {
          accessible++;

          const classData = await ClassRepository.getById(classId);
          if (classData) {
            if (classData.status === 'archived') {
              deleted++;
            } else if (classData.status === 'active') {
              active++;
            }

            if (classData.student_count > 0) {
              withStudents++;
            }
          }
        }
      } catch (error) {
        // Skip classes that can't be accessed
        continue;
      }
    }

    return {
      total: classIds.length,
      accessible,
      withStudents,
      deleted,
      active
    };
  }
}

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
