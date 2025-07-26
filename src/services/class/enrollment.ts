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
  BulkEnrollStudentsSchema
} from './types';
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
    options?: GetAvailableStudentsOptions
  ): Promise<{ students: StudentWithDetails[]; total: number }> {
    try {
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

      const { page, limit } = sanitizePagination(options?.page, options?.limit);
      const offset = (page - 1) * limit;
      let searchResults: StudentWithDetails[] = [];

      // Handle search functionality with separate queries to avoid SQL injection
      if (options?.searchTerm) {
        const searchPattern = `%${sanitizeLikeInput(options.searchTerm)}%`;
        
        try {
          // Search by full_name
          const { data: nameResults, error: nameError } = await supabase
            .from('profiles')
            .select(`
              id,
              full_name,
              student_details!inner(
                nis,
                gender,
                boarding
              )
            `)
            .eq('role', 'student')
            .eq('school_id', classData.school_id)
            .ilike('full_name', searchPattern);

          if (nameError) {
            console.error('Error searching by name:', nameError);
          }

          // Search by NIS
          const { data: nisResults, error: nisError } = await supabase
            .from('profiles')
            .select(`
              id,
              full_name,
              student_details!inner(
                nis,
                gender,
                boarding
              )
            `)
            .eq('role', 'student')
            .eq('school_id', classData.school_id)
            .ilike('student_details.nis', searchPattern);

          if (nisError) {
            console.error('Error searching by NIS:', nisError);
          }

          // Merge and deduplicate results
          const allResults = [...(nameResults || []), ...(nisResults || [])];
          const uniqueResults = allResults.reduce((acc, current) => {
            const existing = acc.find(item => item.id === current.id);
            if (!existing) {
              acc.push(current);
            }
            return acc;
          }, [] as any[]);

          // Exclude already enrolled students
          const { data: enrolledStudents } = await supabase
            .from('class_students')
            .select('student_id')
            .eq('class_id', classId);

          const enrolledIds = new Set(enrolledStudents?.map(e => e.student_id) || []);
          const availableResults = uniqueResults.filter(student => !enrolledIds.has(student.id));

          // Apply additional filters
          let filteredResults = availableResults;
          if (options?.gender) {
            filteredResults = filteredResults.filter(s => {
              const details = Array.isArray(s.student_details) ? s.student_details[0] : s.student_details;
              return details?.gender === options.gender;
            });
          }
          if (options?.boarding) {
            filteredResults = filteredResults.filter(s => {
              const details = Array.isArray(s.student_details) ? s.student_details[0] : s.student_details;
              return details?.boarding === options.boarding;
            });
          }

          // Apply pagination
          const paginatedResults = filteredResults.slice(offset, offset + limit);

          // Transform data
          searchResults = paginatedResults.map(student => {
            const details = Array.isArray(student.student_details) ? student.student_details[0] : student.student_details;
            return {
              student_id: student.id,
              full_name: student.full_name,
              nis: details?.nis,
              gender: details?.gender,
              boarding: details?.boarding,
            };
          });

          return {
            students: searchResults,
            total: filteredResults.length
          };
        } catch (error) {
          console.error('Search operation failed:', error);
          throw ClassServiceError.create(
            'SEARCH_FAILED',
            'Failed to search students',
            { originalError: error, classId, teacherId }
          );
        }
      }

      // Get enrolled student IDs first to exclude them from the query
      const { data: enrolledStudents, error: enrolledError } = await supabase
        .from('class_students')
        .select('student_id')
        .eq('class_id', classId);

      if (enrolledError) {
        throw ClassServiceError.create(
          'FETCH_FAILED',
          'Failed to fetch enrolled student IDs',
          { originalError: enrolledError, classId, teacherId }
        );
      }
      const enrolledStudentIds = enrolledStudents?.map(e => e.student_id) || [];

      // Base query for available students, combining data fetch and count
      let query = supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          student_details!inner(
            nis,
            gender,
            boarding
          )
        `, { count: 'exact' })
        .eq('role', 'student')
        .eq('school_id', classData.school_id);

      // Exclude enrolled students at the query level
      if (enrolledStudentIds.length > 0) {
        query = query.not('id', 'in', `(${enrolledStudentIds.join(',')})`);
      }

      // Apply filters
      if (options?.gender) {
        query = query.eq('student_details.gender', options.gender);
      }

      if (options?.boarding) {
        query = query.eq('student_details.boarding', options.boarding);
      }

      // Apply pagination and fetch data + count
      const { data: students, count: totalCount, error } = await query
        .range(offset, offset + limit - 1);

      if (error) {
        throw ClassServiceError.create(
          'FETCH_FAILED',
          'Failed to fetch available students',
          { originalError: error, classId, teacherId }
        );
      }
      
      // Transform data
      const availableStudents = students!.map(student => {
        const details = Array.isArray(student.student_details) ? student.student_details[0] : student.student_details;
        return {
          student_id: student.id,
          full_name: student.full_name,
          nis: details?.nis,
          gender: details?.gender,
          boarding: details?.boarding,
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
    options?: GetClassStudentsOptions
  ): Promise<{ students: StudentWithDetails[]; total: number }> {
    try {
      // Verify teacher has access to this class
      await ClassAccessControl.validateTeacherAccess(classId, teacherId, 'get_class_students');

      let query = supabase
        .from('class_students')
        .select(`
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
        `, { count: 'exact' })
        .eq('class_id', classId);

      // Apply search filter
      if (options?.searchTerm) {
        const sanitizedSearch = sanitizeLikeInput(options.searchTerm);
        query = query.or(`profiles.full_name.ilike.%${sanitizedSearch}%,profiles.student_details.nis.ilike.%${sanitizedSearch}%`);
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
        const studentDetails = profile?.student_details ? (Array.isArray(profile.student_details) ? profile.student_details[0] : profile.student_details) : null;

        return {
          student_id: enrollment.student_id,
          full_name: profile?.full_name,
          nis: studentDetails?.nis,
          gender: studentDetails?.gender,
          boarding: studentDetails?.boarding,
          enrollment_date: enrollment.enrollment_date,
          notes: enrollment.notes,
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
   */
  static async enrollStudent(
    classId: number,
    enrollmentData: EnrollStudentRequest,
    teacherId: string
  ): Promise<void> {
    try {
      // Validate input
      const validatedData = EnrollStudentSchema.parse(enrollmentData);
      
      // Verify teacher has access to this class
      await ClassAccessControl.validateTeacherAccess(classId, teacherId, 'enroll_student');

      // Check if student is already enrolled
      const { data: existingEnrollment } = await supabase
        .from('class_students')
        .select('student_id')
        .eq('class_id', classId)
        .eq('student_id', validatedData.student_id)
        .single();

      if (existingEnrollment) {
        throw ClassServiceError.create(
          'STUDENT_ALREADY_ENROLLED',
          'Student is already enrolled in this class',
          { classId, studentId: validatedData.student_id, teacherId }
        );
      }

      // Enroll the student
      const enrollmentRecord = {
        class_id: classId,
        student_id: validatedData.student_id,
        enrollment_date: validatedData.enrollment_date || new Date().toISOString(),
        notes: validatedData.notes,
        enrolled_by: teacherId,
      };

      const { error } = await supabase
        .from('class_students')
        .insert(enrollmentRecord);

      if (error) {
        throw ClassServiceError.create(
          'ENROLLMENT_FAILED',
          'Failed to enroll student',
          { originalError: error, classId, studentId: validatedData.student_id, teacherId }
        );
      }

      // Log enrollment action
      await ClassAuditService.logEnrollmentAction(
        classId,
        'enroll_student',
        validatedData.student_id,
        enrollmentRecord,
        teacherId
      );
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
   */
  static async bulkEnrollStudents(
    classId: number,
    enrollmentData: BulkEnrollStudentsRequest,
    teacherId: string
  ): Promise<{
    results: string[];
    errors: Array<{ studentId: string; error: string }>;
  }> {
    // Validate input
    const validatedData = BulkEnrollStudentsSchema.parse(enrollmentData);
    
    const results: string[] = [];
    const errors: Array<{ studentId: string; error: string }> = [];

    for (const studentId of validatedData.student_ids) {
      try {
        await ClassEnrollmentService.enrollStudent(
          classId,
          {
            student_id: studentId,
            enrollment_date: validatedData.enrollment_date,
            notes: validatedData.notes,
          },
          teacherId
        );
        results.push(studentId);
      } catch (error) {
        errors.push({
          studentId,
          error: error instanceof ClassServiceError ? error.message : 'Unknown error',
        });
      }
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
    try {
      // Verify teacher has access to this class
      await ClassAccessControl.validateTeacherAccess(classId, teacherId, 'remove_student');

      // Get current enrollment data for audit
      const { data: enrollmentData } = await supabase
        .from('class_students')
        .select('*')
        .eq('class_id', classId)
        .eq('student_id', studentId)
        .single();

      if (!enrollmentData) {
        throw ClassServiceError.create(
          'STUDENT_NOT_ENROLLED',
          'Student is not enrolled in this class',
          { classId, studentId, teacherId }
        );
      }

      // Remove the student
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
    teacherId: string
  ): Promise<{
    results: string[];
    errors: Array<{ studentId: string; error: string }>;
  }> {
    const results: string[] = [];
    const errors: Array<{ studentId: string; error: string }> = [];

    for (const studentId of studentIds) {
      try {
        await ClassEnrollmentService.removeStudent(classId, studentId, teacherId);
        results.push(studentId);
      } catch (error) {
        errors.push({
          studentId,
          error: error instanceof ClassServiceError ? error.message : 'Unknown error',
        });
      }
    }

    return { results, errors };
  }
}