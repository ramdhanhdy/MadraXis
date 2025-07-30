import { supabase } from '@lib/utils/supabase';
import { logger } from '@lib/utils/logger';
import { sanitizeLikeInput } from '@lib/utils/sanitization';
import { Student, Teacher, Profile } from '@types';
import type { DatabaseResponse } from '../../types/database';
import {
  SearchUsersOptions,
  CreateUserRequest,
  UpdateUserRequest,
  CreateStudentDetailsRequest,
  CreateTeacherDetailsRequest,
  UserWithDetails,
  StudentWithPerformance,
  TeacherWithClasses,
  UserSearchResult,
  UserCounts,
  LegacyStudent,
  UserServiceError,
  SearchUsersOptionsSchema,
  CreateUserSchema,
  UpdateUserSchema,
  CreateStudentDetailsSchema,
  CreateTeacherDetailsSchema
} from './types';

/**
 * UserRepository handles direct database operations for users
 */
export class UserRepository {
  /**
   * Fetch all students for a school using the new unified schema
   */
  static async fetchStudents(schoolId: number, limit?: number): Promise<DatabaseResponse<Student[]>> {
    try {
      if (process.env.NODE_ENV === 'development') {
        logger.debug('fetchStudents called', { schoolId, limit, operation: 'fetchStudents' });
      }

      let query = supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          role,
          school_id,
          created_at,
          updated_at,
          student_details (
            user_id,
            nis,
            date_of_birth,
            gender,
            boarding,
            created_at,
            updated_at
          )
        `)
        .eq('role', 'student')
        .eq('school_id', schoolId)
        .order('full_name');

      if (limit) {
        query = query.limit(limit);
      }

      if (process.env.NODE_ENV === 'development') {
        logger.debug('About to execute supabase query', { operation: 'fetchStudents' });
      }
      const { data, error } = await query;
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Raw supabase response received', { dataLength: data?.length, error, operation: 'fetchStudents' });
      }

      if (error) {
        logger.error('Error fetching students', { error: error.message, code: error.code, operation: 'fetchStudents' });
        return { data: null, error };
      }

      // Transform to Student interface with proper typing
      const students: Student[] = data?.map((profile) => ({
        id: profile.id,
        full_name: profile.full_name,
        role: 'student',
        school_id: profile.school_id,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
        details: profile.student_details?.[0] || undefined,
        // For backward compatibility, map common fields
        quran_progress: {
          memorized_verses: 0,
          total_verses: 6236
        }
      })) || [];

      return { data: students, error: null };
    } catch (err) {
      logger.error('Service error fetching students', { 
        error: err instanceof Error ? err.message : String(err),
        operation: 'fetchStudents'
      });
      return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
    }
  }

  /**
   * Fetch a single student by ID with all details
   */
  static async fetchStudentById(studentId: string): Promise<DatabaseResponse<StudentWithPerformance>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          role,
          school_id,
          created_at,
          updated_at,
          student_details (
            user_id,
            nis,
            date_of_birth,
            gender,
            boarding,
            created_at,
            updated_at
          ),
          student_performance (
            id,
            user_id,
            period_start,
            period_end,
            academic_score,
            quran_score,
            attendance_pct,
            created_at
          ),
          class_students!left (
            classes (
              name
            )
          ),
          student_parent!left (
            parent_profile:profiles!inner (
              full_name,
              parent_details (
                phone_number,
                address
              )
            )
          )
        `)
        .eq('id', studentId)
        .eq('role', 'student')
        .single();

      if (error) {
        logger.error('Error fetching student by ID', { error: error.message, code: error.code, studentId, operation: 'fetchStudentById' });
        return { data: null, error };
      }

      if (!data) {
        return { data: null, error: new Error('Student not found') };
      }

      // Transform to StudentWithPerformance interface
      const student: StudentWithPerformance = {
        // Base profile fields
        id: data.id,
        full_name: data.full_name,
        role: 'student',
        school_id: data.school_id,
        created_at: data.created_at,
        updated_at: data.updated_at,

        // Mapped-in fields for Student
        details: data.student_details?.[0] || undefined,
        performance: data.student_performance || [],
        class_name: (data as any).class_students?.[0]?.classes?.name,
        parent_name: (data as any).student_parent?.[0]?.parent_profile?.full_name,
        parent_phone: (data as any).student_parent?.[0]?.parent_profile?.parent_details?.[0]?.phone_number ?? undefined,
        address: (data as any).student_parent?.[0]?.parent_profile?.parent_details?.[0]?.address ?? undefined,
        quran_progress: {
          memorized_verses: 0,
          total_verses: 6236
        }
      };

      return { data: student, error: null };
    } catch (err) {
      logger.error('Service error fetching student by ID', { 
        error: err instanceof Error ? err.message : String(err),
        studentId,
        operation: 'fetchStudentById'
      });
      return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
    }
  }

  /**
   * Fetch all teachers for a school
   */
  static async fetchTeachers(schoolId: number, limit?: number): Promise<DatabaseResponse<Teacher[]>> {
    try {
      let query = supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          role,
          school_id,
          created_at,
          updated_at,
          teacher_details (
            user_id,
            employee_id,
            hire_date,
            specialty,
            created_at,
            updated_at
          )
        `)
        .eq('role', 'teacher')
        .eq('school_id', schoolId)
        .order('full_name');

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        logger.error('Error fetching teachers', { error: error.message, code: error.code, schoolId, operation: 'fetchTeachers' });
        return { data: null, error };
      }

      // Transform to Teacher interface with proper typing
      const teachers: Teacher[] = data?.map((profile) => ({
        id: profile.id,
        full_name: profile.full_name,
        role: 'teacher',
        school_id: profile.school_id,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
        details: profile.teacher_details?.[0] || undefined
      })) || [];

      return { data: teachers, error: null };
    } catch (err) {
      logger.error('Service error fetching teachers', { 
        error: err instanceof Error ? err.message : String(err),
        schoolId,
        operation: 'fetchTeachers'
      });
      return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
    }
  }

  /**
   * Fetch user profile by ID (works for any role)
   */
  static async fetchUserProfile(userId: string): Promise<DatabaseResponse<Profile>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        logger.error('Error fetching user profile', { error: error.message, code: error.code, userId, operation: 'fetchUserProfile' });
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      logger.error('Service error fetching user profile', { 
        error: err instanceof Error ? err.message : String(err),
        userId,
        operation: 'fetchUserProfile'
      });
      return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
    }
  }

  /**
   * Search students by name
   */
  static async searchStudents(schoolId: number, searchTerm: string, limit: number = 10): Promise<DatabaseResponse<Student[]>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          role,
          school_id,
          created_at,
          updated_at,
          student_details (
            user_id,
            nis,
            date_of_birth,
            gender,
            boarding,
            created_at,
            updated_at
          )
        `)
        .eq('role', 'student')
        .eq('school_id', schoolId)
        .ilike('full_name', `%${sanitizeLikeInput(searchTerm)}%`)
        .limit(limit)
        .order('full_name');

      if (error) {
        logger.error('Error searching students', { 
          error: error.message, 
          code: error.code, 
          schoolId, 
          searchTerm,
          operation: 'searchStudents' 
        });
        return { data: null, error };
      }

      // Transform to Student interface with proper typing
      const students: Student[] = data?.map((profile) => ({
        id: profile.id,
        full_name: profile.full_name,
        role: 'student',
        school_id: profile.school_id,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
        details: profile.student_details?.[0] || undefined,
        quran_progress: {
          memorized_verses: 0,
          total_verses: 6236
        }
      })) || [];

      return { data: students, error: null };
    } catch (err) {
      logger.error('Service error searching students', { 
        error: err instanceof Error ? err.message : String(err),
        schoolId,
        searchTerm,
        operation: 'searchStudents'
      });
      return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
    }
  }

  /**
   * Get count of students for a school (optimized for dashboard metrics)
   */
  static async getStudentCount(schoolId: number): Promise<DatabaseResponse<number>> {
    try {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student')
        .eq('school_id', schoolId);

      if (error) {
        logger.error('Error counting students', { error: error.message, code: error.code, schoolId, operation: 'getStudentCount' });
        return { data: null, error };
      }

      return { data: count || 0, error: null };
    } catch (err) {
      logger.error('Service error counting students', { 
        error: err instanceof Error ? err.message : String(err),
        schoolId,
        operation: 'getStudentCount'
      });
      return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
    }
  }

  /**
   * Get count of teachers for a school (optimized for dashboard metrics)
   */
  static async getTeacherCount(schoolId: number): Promise<DatabaseResponse<number>> {
    try {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'teacher')
        .eq('school_id', schoolId);

      if (error) {
        logger.error('Error counting teachers', { error: error.message, code: error.code, schoolId, operation: 'getTeacherCount' });
        return { data: null, error };
      }

      return { data: count || 0, error: null };
    } catch (err) {
      logger.error('Service error counting teachers', { 
        error: err instanceof Error ? err.message : String(err),
        schoolId,
        operation: 'getTeacherCount'
      });
      return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
    }
  }

  /**
   * Get user counts by role for a school
   */
  static async getUserCounts(schoolId: number): Promise<DatabaseResponse<UserCounts>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('school_id', schoolId);

      if (error) {
        logger.error('Error getting user counts', { error: error.message, code: error.code, schoolId, operation: 'getUserCounts' });
        return { data: null, error };
      }

      const counts: UserCounts = {
        students: 0,
        teachers: 0,
        parents: 0,
        management: 0,
        total: 0
      };

      data?.forEach((user) => {
        switch (user.role) {
          case 'student':
            counts.students++;
            break;
          case 'teacher':
            counts.teachers++;
            break;
          case 'parent':
            counts.parents++;
            break;
          case 'management':
            counts.management++;
            break;
        }
        counts.total++;
      });

      return { data: counts, error: null };
    } catch (err) {
      logger.error('Service error getting user counts', {
        error: err instanceof Error ? err.message : String(err),
        schoolId,
        operation: 'getUserCounts'
      });
      return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
    }
  }

  /**
   * Advanced user search with filters and pagination
   */
  static async searchUsers(
    schoolId: number,
    options: SearchUsersOptions = {}
  ): Promise<DatabaseResponse<UserSearchResult>> {
    try {
      // Validate input
      const validatedOptions = SearchUsersOptionsSchema.parse(options);

      let query = supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          role,
          school_id,
          email,
          created_at,
          updated_at,
          student_details (
            user_id,
            nis,
            date_of_birth,
            gender,
            boarding,
            created_at,
            updated_at
          ),
          teacher_details (
            user_id,
            employee_id,
            hire_date,
            specialty,
            created_at,
            updated_at
          ),
          parent_details (
            user_id,
            phone_number,
            address,
            created_at,
            updated_at
          )
        `, { count: 'exact' })
        .eq('school_id', schoolId);

      // Apply filters
      if (validatedOptions.role) {
        query = query.eq('role', validatedOptions.role);
      }

      if (validatedOptions.searchTerm) {
        const sanitizedSearch = sanitizeLikeInput(validatedOptions.searchTerm);
        query = query.ilike('full_name', `%${sanitizedSearch}%`);
      }

      if (validatedOptions.gender) {
        query = query.eq('student_details.gender', validatedOptions.gender);
      }

      if (validatedOptions.boarding) {
        query = query.eq('student_details.boarding', validatedOptions.boarding);
      }

      // Apply pagination
      const limit = validatedOptions.limit || 10;
      const page = validatedOptions.page || 1;
      const offset = (page - 1) * limit;

      query = query
        .order('full_name')
        .range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        logger.error('Error searching users', {
          error: error.message,
          code: error.code,
          schoolId,
          options: validatedOptions,
          operation: 'searchUsers'
        });
        return { data: null, error };
      }

      // Transform to UserWithDetails interface
      const users: UserWithDetails[] = (data || []).map((profile) => ({
        id: profile.id,
        full_name: profile.full_name,
        role: profile.role,
        school_id: profile.school_id,
        email: profile.email,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
        student_details: profile.student_details?.[0],
        teacher_details: profile.teacher_details?.[0],
        parent_details: profile.parent_details?.[0]
      }));

      const totalPages = Math.ceil((count || 0) / limit);

      const result: UserSearchResult = {
        users,
        total: count || 0,
        page,
        limit,
        totalPages
      };

      return { data: result, error: null };
    } catch (err) {
      logger.error('Service error searching users', {
        error: err instanceof Error ? err.message : String(err),
        schoolId,
        options,
        operation: 'searchUsers'
      });
      return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
    }
  }
}

/**
 * UserService provides high-level operations for user management
 */
export class UserService {
  /**
   * Fetch all students for a school
   */
  static async fetchStudents(schoolId: number, limit?: number): Promise<DatabaseResponse<Student[]>> {
    return UserRepository.fetchStudents(schoolId, limit);
  }

  /**
   * Fetch a single student by ID with all details
   */
  static async fetchStudentById(studentId: string): Promise<DatabaseResponse<StudentWithPerformance>> {
    return UserRepository.fetchStudentById(studentId);
  }

  /**
   * Fetch all teachers for a school
   */
  static async fetchTeachers(schoolId: number, limit?: number): Promise<DatabaseResponse<Teacher[]>> {
    return UserRepository.fetchTeachers(schoolId, limit);
  }

  /**
   * Fetch user profile by ID (works for any role)
   */
  static async fetchUserProfile(userId: string): Promise<DatabaseResponse<Profile>> {
    return UserRepository.fetchUserProfile(userId);
  }

  /**
   * Search students by name
   */
  static async searchStudents(schoolId: number, searchTerm: string, limit: number = 10): Promise<DatabaseResponse<Student[]>> {
    return UserRepository.searchStudents(schoolId, searchTerm, limit);
  }

  /**
   * Get count of students for a school
   */
  static async getStudentCount(schoolId: number): Promise<DatabaseResponse<number>> {
    return UserRepository.getStudentCount(schoolId);
  }

  /**
   * Get count of teachers for a school
   */
  static async getTeacherCount(schoolId: number): Promise<DatabaseResponse<number>> {
    return UserRepository.getTeacherCount(schoolId);
  }

  /**
   * Get user counts by role for a school
   */
  static async getUserCounts(schoolId: number): Promise<DatabaseResponse<UserCounts>> {
    return UserRepository.getUserCounts(schoolId);
  }

  /**
   * Advanced user search with filters and pagination
   */
  static async searchUsers(
    schoolId: number,
    options: SearchUsersOptions = {}
  ): Promise<DatabaseResponse<UserSearchResult>> {
    return UserRepository.searchUsers(schoolId, options);
  }

  /**
   * Legacy compatibility function that returns students in the old format
   */
  static async fetchStudentsLegacyFormat(schoolId: number, limit?: number): Promise<DatabaseResponse<LegacyStudent[]>> {
    const { data: students, error } = await UserRepository.fetchStudents(schoolId, limit);

    if (error || !students) {
      return { data: null, error };
    }

    // Transform to legacy format
    const legacyStudents: LegacyStudent[] = students.map((student) => ({
      id: student.id,
      name: student.full_name,
      class: '', // TODO: Get class assignment from class_students table
      image_url: '', // TODO: Add profile images if needed
      quran_progress: student.quran_progress || {
        memorized_verses: 0,
        total_verses: 6236, // Default total verses in the Quran
      },
      gender: student.details?.gender === 'M' ? 'male' : student.details?.gender === 'F' ? 'female' : undefined,
      birth_date: student.details?.date_of_birth,
      parent_name: '', // TODO: Get from parent relationship if needed
      phone: '', // TODO: Get from student_details or parent_details
      address: '' // TODO: Get from student_details
    }));

    return { data: legacyStudents, error: null };
  }
}
