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
      throw ClassServiceError.create(
        'CREATE_FAILED',
        `Failed to create class: ${insertError.message}`,
        { originalError: insertError }
      );
    }

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
        
    // Apply filters
    if (options?.status) {
      query = query.eq('status', options.status);
    }

    if (options?.searchTerm) {
      const sanitizedSearch = sanitizeLikeInput(options.searchTerm);
      query = query.ilike('name', `%${sanitizedSearch}%`);
    }

    // Apply sorting with sanitization
    const { sortBy, sortOrder } = sanitizeSortParams(options?.sortBy, options?.sortOrder);
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
    }

    const { data: classes, error } = await query;

    console.log('getByTeacher query result:', {
      teacherId,
      classesCount: classes?.length || 0,
      error: error?.message,
      options
    });

    if (error) {
      console.error('getByTeacher error:', error);
      throw ClassServiceError.create(
        'FETCH_FAILED',
        'Failed to fetch classes',
        { originalError: error, teacherId }
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
    schoolId: string,
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