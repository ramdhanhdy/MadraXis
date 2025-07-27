import { logger } from '../../utils/logger';
import { supabase } from '../../utils/supabase';
import { sanitizeLikeInput, sanitizeSortParams, sanitizePagination } from '../../utils/sanitization';
import {
  EnrollStudentRequest,
  BulkEnrollStudentsRequest,
  StudentWithDetails,
  GetAvailableStudentsOptions,
  GetClassStudentsOptions,
  ClassServiceError,
  EnrollStudentSchema,
  BulkEnrollStudentsSchema,
  GetAvailableStudentsOptionsSchema } from
'./types';
import { ClassAccessControl } from './access';
import { ClassAuditService } from './audit';
import { ClassRepository } from './repository';

/**
 * ClassEnrollmentService handles student enrollment operations
 */
export class ClassEnrollmentService {
  /**
   * Get available students for enrollment (not already enrolled in the class)
   */
  static async getAvailableStudents(
  classId: number,
  teacherId: string,
  options?: GetAvailableStudentsOptions)
  : Promise<{students: StudentWithDetails[];total: number;}> {
    try {
      // Validate and sanitize input options
      const validatedOptions = options ? GetAvailableStudentsOptionsSchema.parse(options) : undefined;

      // Verify teacher has access to this class
      await ClassAccessControl.validateTeacherAccess(classId, teacherId, 'get_available_students');

      // Get class details to filter by school
      const classData = await ClassRepository.getById(classId);
      if (!classData) {
        throw ClassServiceError.create(
          'CLASS_NOT_FOUND',
          'Class not found',
          { classId, teacherId }
        );
      }

      const { page, limit } = sanitizePagination(validatedOptions?.page, validatedOptions?.limit);
      const offset = (page - 1) * limit;
      let searchResults: StudentWithDetails[] = [];

      // Handle search functionality with optimized single query
      if (validatedOptions?.searchTerm) {
        const searchPattern = `%${sanitizeLikeInput(validatedOptions.searchTerm)}%`;

        try {
          // Get enrolled student IDs first
          const { data: enrolledStudents } = await supabase
            .from('class_students')
            .select('student_id')
            .eq('class_id', classId);

          const enrolledIds = enrolledStudents?.map(e => e.student_id) || [];

          // Single optimized query combining name and NIS search
          let searchQuery = supabase
            .from('profiles')
            .select(
              `
              id,
              full_name,
              student_details!inner(
                nis,
                gender,
                boarding
              )
            `,
              { count: 'exact' }
            )
            .eq('role', 'student')
            .eq('school_id', classData.school_id)
            .or(`full_name.ilike.${searchPattern},student_details.nis.ilike.${searchPattern}`);

          // Exclude enrolled students
          if (enrolledIds.length > 0) {
            searchQuery = searchQuery.not('id', 'in', `(${enrolledIds.join(',')})`);
          }

          // Apply additional filters
          if (validatedOptions?.gender) {
            searchQuery = searchQuery.eq('student_details.gender', validatedOptions.gender);
          }
          if (validatedOptions?.boarding !== undefined) {
            searchQuery = searchQuery.eq('student_details.boarding', validatedOptions.boarding);
          }

          // Apply pagination
          const { data: searchResults, error: searchError, count } = await searchQuery
            .range(offset, offset + limit - 1);

          if (searchError) {
            logger.error('Error searching students:', { error: searchError.message });
            throw searchError;
          }

          // Transform data
          const availableStudents = searchResults.map((student) => {
            const details = Array.isArray(student.student_details) ? student.student_details[0] : student.student_details;
            return {
              student_id: student.id,
              full_name: student.full_name,
              nis: details?.nis,
              gender: details?.gender,
              boarding: details?.boarding
            };
          });

          return {
            students: availableStudents,
            total: count || 0
          };
        } catch (error) {
          logger.error('Search operation failed:', { error: error instanceof Error ? error.message : String(error) });
          throw ClassServiceError.create(
            'SEARCH_FAILED',
            'Failed to search students',
            { originalError: error, classId, teacherId }
          );
        }
      }

      // Get enrolled student IDs first to exclude them from the query
      const { data: enrolledStudents, error: enrolledError } = await supabase.
      from('class_students').
      select('student_id').
      eq('class_id', classId);

      if (enrolledError) {
        throw ClassServiceError.create(
          'FETCH_FAILED',
          'Failed to fetch enrolled student IDs',
          { originalError: enrolledError, classId, teacherId }
        );
      }
      const enrolledStudentIds = enrolledStudents?.map((e) => e.student_id) || [];

      // Base query for available students, combining data fetch and count
      let query = supabase.
      from('profiles').
      select(`
          id,
          full_name,
          student_details!inner(
            nis,
            gender,
            boarding
          )
        `, { count: 'exact' }).
      eq('role', 'student').
      eq('school_id', classData.school_id);

      // Exclude enrolled students at the query level
      if (enrolledStudentIds.length > 0) {
        query = query.not('id', 'in', `(${enrolledStudentIds.join(',')})`);
      }

      // Apply filters
      if (validatedOptions?.gender) {
        query = query.eq('student_details.gender', validatedOptions.gender);
      }

      if (validatedOptions?.boarding) {
        query = query.eq('student_details.boarding', validatedOptions.boarding);
      }

      // Apply pagination and fetch data + count
      const { data: students, count: totalCount, error } = await query.
      range(offset, offset + limit - 1);

      if (error) {
        throw ClassServiceError.create(
          'FETCH_FAILED',
          'Failed to fetch available students',
          { originalError: error, classId, teacherId }
        );
      }

      // Transform data
      const availableStudents = students!.map((student) => {
        const details = Array.isArray(student.student_details) ? student.student_details[0] : student.student_details;
        return {
          student_id: student.id,
          full_name: student.full_name,
          nis: details?.nis,
          gender: details?.gender,
          boarding: details?.boarding
        };
      });

      return {
        students: availableStudents,
        total: totalCount || 0
      };
    } catch (error) {
      if (error instanceof ClassServiceError) {
        throw error;
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
  options?: GetClassStudentsOptions)
  : Promise<{students: StudentWithDetails[];total: number;}> {
    try {
      // Verify teacher has access to this class
      await ClassAccessControl.validateTeacherAccess(classId, teacherId, 'get_class_students');

      let query = supabase.
      from('class_students').
      select(`
          student_id,
          enrollment_date,
          notes,
          profiles!inner(
            full_name,
            student_details!inner(
              nis,
              gender,
              boarding
            )
          )
        `, { count: 'exact' }).
      eq('class_id', classId);

      // Apply search filter safely using parameterized queries
      if (options?.searchTerm) {
        const sanitizedSearch = sanitizeLikeInput(options.searchTerm);
        if (sanitizedSearch.length > 0) {
          const searchPattern = `%${sanitizedSearch}%`;
          // Use Supabase's or method with proper escaping
          query = query.or(`profiles.full_name.ilike.${searchPattern},profiles.student_details.nis.ilike.${searchPattern}`);
        }
      }

      // Apply sorting
      const { sortBy, sortOrder } = sanitizeSortParams(options?.sortBy, options?.sortOrder);
      if (sortBy === 'full_name') {
        query = query.order('profiles.full_name', { ascending: sortOrder === 'asc' });
      } else if (sortBy === 'nis') {
        query = query.order('profiles.student_details.nis', { ascending: sortOrder === 'asc' });
      } else {
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });
      }

      // Apply pagination
      const { page, limit } = sanitizePagination(options?.offset ? Math.floor(options.offset / (options?.limit || 10)) + 1 : 1, options?.limit);
      const offset = (page - 1) * limit;

      const { data: enrollments, count: totalCount, error } = await query.range(offset, offset + limit - 1);

      if (error) {
        throw ClassServiceError.create(
          'FETCH_FAILED',
          'Failed to fetch class students',
          { originalError: error, classId, teacherId }
        );
      }

      // Transform data
      const students = enrollments!.map((enrollment: any) => {
        const profile = Array.isArray(enrollment.profiles) ? enrollment.profiles[0] : enrollment.profiles;
        const studentDetails = profile?.student_details ? Array.isArray(profile.student_details) ? profile.student_details[0] : profile.student_details : null;

        return {
          student_id: enrollment.student_id,
          full_name: profile?.full_name,
          nis: studentDetails?.nis,
          gender: studentDetails?.gender,
          boarding: studentDetails?.boarding,
          enrollment_date: enrollment.enrollment_date,
          notes: enrollment.notes
        };
      });

      return {
        students,
        total: totalCount || 0
      };
    } catch (error) {
      if (error instanceof ClassServiceError) {
        throw error;
      }
      throw ClassServiceError.create(
        'UNEXPECTED_ERROR',
        'An unexpected error occurred',
        { originalError: error, classId, teacherId }
      );
    }
  }

  /**
   * Enroll a single student in a class
   * Uses atomic database function to prevent race conditions and enforce capacity limits
   */
  static async enrollStudent(
  classId: number,
  enrollmentData: EnrollStudentRequest,
  teacherId: string)
  : Promise<void> {
    try {
      // Validate input
      const validatedData = EnrollStudentSchema.parse(enrollmentData);

      // Get teacher's school_id for the atomic function
      const { data: teacherProfile } = await supabase.
      from('profiles').
      select('school_id').
      eq('id', teacherId).
      single();

      if (!teacherProfile) {
        throw ClassServiceError.create(
          'TEACHER_NOT_FOUND',
          'Teacher profile not found',
          { teacherId, classId }
        );
      }

      // Use atomic function to enroll student with capacity checking
      const { data: result, error } = await supabase.
      rpc('add_students_to_class_atomic', {
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

      // Check if student was successfully enrolled
      if (!enrollmentResult.success.includes(validatedData.student_id)) {
        // Find the specific error for this student
        const studentError = enrollmentResult.errors.find(
          (err: any) => err.student_id === validatedData.student_id
        );

        const errorMessage = studentError ? studentError.error : 'Unknown enrollment error';

        // Map specific errors to appropriate error codes
        let errorCode = 'ENROLLMENT_FAILED';
        if (errorMessage.includes('already enrolled')) {
          errorCode = 'STUDENT_ALREADY_ENROLLED';
        } else if (errorMessage.includes('capacity exceeded')) {
          errorCode = 'CLASS_CAPACITY_EXCEEDED';
        } else if (errorMessage.includes('not found') || errorMessage.includes('same school')) {
          errorCode = 'STUDENT_NOT_FOUND';
        } else if (errorMessage.includes('access denied')) {
          errorCode = 'ACCESS_DENIED';
        }

        throw ClassServiceError.create(
          errorCode,
          errorMessage,
          { classId, studentId: validatedData.student_id, teacherId }
        );
      }

      // Note: Audit logging is handled by the atomic function
    } catch (error) {
      if (error instanceof ClassServiceError) {
        throw error;
      }
      throw ClassServiceError.create(
        'UNEXPECTED_ERROR',
        'An unexpected error occurred',
        { originalError: error, classId, teacherId }
      );
    }
  }

  /**
   * Bulk enroll multiple students in a class
   * Uses atomic database function to prevent race conditions and enforce capacity limits
   */
  static async bulkEnrollStudents(
  classId: number,
  enrollmentData: BulkEnrollStudentsRequest,
  teacherId: string)
  : Promise<{
    results: string[];
    errors: Array<{studentId: string;error: string;}>;
  }> {
    try {
      // Validate input
      const validatedData = BulkEnrollStudentsSchema.parse(enrollmentData);

      // Get teacher's school_id for the atomic function
      const { data: teacherProfile } = await supabase.
      from('profiles').
      select('school_id').
      eq('id', teacherId).
      single();

      if (!teacherProfile) {
        throw ClassServiceError.create(
          'TEACHER_NOT_FOUND',
          'Teacher profile not found',
          { teacherId, classId }
        );
      }

      // Use atomic function to enroll students with capacity checking
      const { data: result, error } = await supabase.
      rpc('add_students_to_class_atomic', {
        p_class_id: classId,
        p_student_ids: validatedData.student_ids,
        p_teacher_id: teacherId,
        p_school_id: teacherProfile.school_id
      });

      if (error) {
        throw ClassServiceError.create(
          'BULK_ENROLLMENT_FAILED',
          'Failed to bulk enroll students',
          { originalError: error, classId, teacherId }
        );
      }

      // Check if enrollment was successful
      if (!result || result.length === 0) {
        throw ClassServiceError.create(
          'BULK_ENROLLMENT_FAILED',
          'Atomic enrollment function returned no results',
          { classId, teacherId }
        );
      }

      const enrollmentResult = result[0];

      // Transform results to match expected format
      const results = enrollmentResult.success || [];
      const errors = (enrollmentResult.errors || []).map((err: any) => ({
        studentId: err.student_id,
        error: err.error
      }));

      return { results, errors };
    } catch (error) {
      if (error instanceof ClassServiceError) {
        throw error;
      }
      throw ClassServiceError.create(
        'UNEXPECTED_ERROR',
        'An unexpected error occurred during bulk enrollment',
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
  teacherId: string)
  : Promise<void> {
    try {
      // Verify teacher has access to this class
      await ClassAccessControl.validateTeacherAccess(classId, teacherId, 'remove_student');

      // Get current enrollment data for audit
      const { data: enrollmentData } = await supabase.
      from('class_students').
      select('*').
      eq('class_id', classId).
      eq('student_id', studentId).
      single();

      if (!enrollmentData) {
        throw ClassServiceError.create(
          'STUDENT_NOT_ENROLLED',
          'Student is not enrolled in this class',
          { classId, studentId, teacherId }
        );
      }

      // Remove the student
      const { error } = await supabase.
      from('class_students').
      delete().
      eq('class_id', classId).
      eq('student_id', studentId);

      if (error) {
        throw ClassServiceError.create(
          'REMOVAL_FAILED',
          'Failed to remove student from class',
          { originalError: error, classId, studentId, teacherId }
        );
      }

      // Log removal action
      await ClassAuditService.logEnrollmentAction(
        classId,
        'remove_student',
        studentId,
        enrollmentData,
        teacherId
      );
    } catch (error) {
      if (error instanceof ClassServiceError) {
        throw error;
      }
      throw ClassServiceError.create(
        'UNEXPECTED_ERROR',
        'An unexpected error occurred',
        { originalError: error, classId, studentId, teacherId }
      );
    }
  }

  /**
   * Bulk remove multiple students from a class
   */
  static async bulkRemoveStudents(
  classId: number,
  studentIds: string[],
  teacherId: string)
  : Promise<{
    results: string[];
    errors: Array<{studentId: string;error: string;}>;
  }> {
    const results: string[] = [];
    const errors: Array<{studentId: string;error: string;}> = [];

    for (const studentId of studentIds) {
      try {
        await ClassEnrollmentService.removeStudent(classId, studentId, teacherId);
        results.push(studentId);
      } catch (error) {
        errors.push({
          studentId,
          error: error instanceof ClassServiceError ? error.message : 'Unknown error'
        });
      }
    }

    return { results, errors };
  }
}