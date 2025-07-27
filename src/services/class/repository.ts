import { supabase } from '../../utils/supabase';
import { Class } from '../../types/class';
import { sanitizeLikeInput, sanitizeSortParams } from '../../utils/sanitization';
import {
  CreateClassRequest,
  UpdateClassRequest,
  ClassWithDetails,
  GetTeacherClassesOptions,
  ClassServiceError,
  CreateClassSchema,
  UpdateClassSchema
} from './types';
import { logger } from '../../utils/logger';

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
      logger.error('Class creation failed', {
        operation: 'class_create',
        userId: teacherId,
        errorCode: insertError.code,
        errorMessage: insertError.message
      });
      
      throw ClassServiceError.create(
        'CREATE_FAILED',
        `Failed to create class: ${insertError.message}`,
        { originalError: insertError }
      );
    }

    logger.info('Class created successfully', {
      operation: 'class_create',
      userId: teacherId,
      classId: newClass!.id
    });

    // Transform to ClassWithDetails format
    return {
      ...newClass!,
      student_count: 0,
      subject_count: 0,
      teacher_count: 0,
      teachers: []
    };
  }

  /**
   * Get a class by ID
   */
  static async getById(classId: number): Promise<ClassWithDetails | null> {
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
      if (error.code === 'PGRST116') {
        return null; // Class not found
      }
      throw ClassServiceError.create(
        'FETCH_FAILED',
        'Failed to fetch class',
        { originalError: error, classId }
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

    // Transform teacher data to match expected format
    const formattedTeachers = (teachers || []).map((teacher: any) => ({
      user_id: teacher.user_id,
      role: teacher.role,
      full_name: teacher.profiles?.full_name || ''
    }));

    return {
      ...classData!,
      student_count: classData!.class_students?.length || 0,
      subject_count: classData!.class_subjects?.length || 0,
      teacher_count: formattedTeachers.length,
      teachers: formattedTeachers,
    };
  }

  /**
   * Get classes for a specific teacher
   */
  static async getByTeacher(
    teacherId: string,
    options?: GetTeacherClassesOptions
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

    // Apply sorting with sanitization
    const { sortBy, sortOrder } = sanitizeSortParams(options?.sortBy, options?.sortOrder);
    queryBuilder = queryBuilder.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    if (options?.offset || options?.limit) {
      const limit = options?.limit || 50;
      const offset = options?.offset || 0;
      queryBuilder = queryBuilder.range(offset, offset + limit - 1);
    }

    const { data: classes, error } = await queryBuilder;

    logger.debug('Teacher classes query completed', {
      operation: 'get_teacher_classes',
      userId: teacherId,
      classesCount: classes?.length || 0,
      hasError: !!error
    });

    if (error) {
      logger.error('Failed to fetch teacher classes', {
        operation: 'get_teacher_classes',
        userId: teacherId,
        errorCode: error.code,
        errorMessage: error.message
      });
      
      throw ClassServiceError.create(
        'FETCH_FAILED',
        'Failed to fetch classes',
        { originalError: error, teacherId }
      );
    }

    // Handle case where no classes are returned
    if (!classes || classes.length === 0) {
      return {
        classes: [],
        total: 0
      };
    }

    // Transform data to include counts and teacher details
    // No need for in-memory filtering since the JOIN already filters by teacherId
    const transformedClasses = classes.map((classItem) => {
      // Format teachers to match expected structure
      const formattedTeachers = (classItem.class_teachers || []).map((teacher: any) => ({
        user_id: teacher.user_id,
        role: teacher.role,
        full_name: teacher.profiles?.full_name || ''
      }));

      return {
        ...classItem,
        student_count: classItem.class_students?.length || 0,
        subject_count: classItem.class_subjects?.length || 0,
        teacher_count: formattedTeachers.length,
        teachers: formattedTeachers,
      };
    });

    return {
      classes: transformedClasses,
      total: transformedClasses.length
    };
  }

  /**
   * Update a class record
   */
  static async update(
    classId: number,
    updates: UpdateClassRequest,
    teacherId: string
  ): Promise<ClassWithDetails> {
    // Validate input data
    const validatedData = UpdateClassSchema.parse(updates);

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
      throw ClassServiceError.create(
        'UPDATE_FAILED',
        'Failed to update class',
        { originalError: error, classId, teacherId }
      );
    }

    // Get the full class details to return ClassWithDetails
    const fullClass = await this.getById(classId);
    if (!fullClass) {
      throw ClassServiceError.create(
        'NOT_FOUND',
        'Class not found after update',
        { classId, teacherId }
      );
    }
    return fullClass;
  }

  /**
   * Soft delete a class (set status to archived)
   */
  static async softDelete(classId: number, teacherId: string): Promise<void> {
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
      throw ClassServiceError.create(
        'DELETE_FAILED',
        'Failed to delete class',
        { originalError: error, classId, teacherId }
      );
    }
  }

  /**
   * Restore a soft-deleted class
   */
  static async restore(classId: number, teacherId: string): Promise<ClassWithDetails> {
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
      throw ClassServiceError.create(
        'RESTORE_FAILED',
        'Failed to restore class',
        { originalError: error, classId, teacherId }
      );
    }

    // Get the full class details to return ClassWithDetails
    const fullClass = await this.getById(classId);
    if (!fullClass) {
      throw ClassServiceError.create(
        'NOT_FOUND',
        'Class not found after restore',
        { classId, teacherId }
      );
    }
    return fullClass;
  }

  /**
   * Check if a class name already exists for a teacher's school
   */
  static async checkDuplicateName(
    name: string,
    teacherId: string,
    schoolId: number
  ): Promise<Class | null> {
    const { data: existingClass } = await supabase
      .from('classes')
      .select('*')
      .eq('name', name)
      .eq('school_id', schoolId)
      .neq('status', 'archived')
      .single();

    return existingClass;
  }

  /**
   * Check if a class name already exists in a school (returns boolean)
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

    const { data: existingClass } = await query.single();
    return !!existingClass;
  }

  /**
   * Get enrolled student count for a class
   */
  static async getEnrolledStudentCount(classId: number): Promise<number> {
    const { data: enrolledStudents } = await supabase
      .from('class_students')
      .select('student_id')
      .eq('class_id', classId);

    return enrolledStudents?.length || 0;
  }
}

