import { logger } from '@lib/utils/logger';
import { supabase } from '@lib/utils/supabase';
import type { DatabaseResponse } from '../../types/database';
import {
  School,
  SchoolWithStats,
  CreateSchoolRequest,
  UpdateSchoolRequest,
  SchoolServiceError,
  SchoolSchema,
  UpdateSchoolSchema
} from './types';

/**
 * SchoolRepository handles direct database operations for schools
 */
export class SchoolRepository {
  /**
   * Fetch school data by ID
   */
  static async getById(schoolId: number): Promise<School | null> {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('id', schoolId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // School not found
      }
      throw SchoolServiceError.create(
        'DATABASE_ERROR',
        'Failed to fetch school',
        { originalError: error, schoolId }
      );
    }

    return data;
  }

  /**
   * Create a new school
   */
  static async create(schoolData: CreateSchoolRequest): Promise<School> {
    // Validate input data
    const validatedData = SchoolSchema.parse(schoolData);
    
    const insertData = {
      ...validatedData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data: newSchool, error } = await supabase
      .from('schools')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      logger.error('Failed to create school', {
        error: error.message,
        code: error.code
      });
      
      if (error.code === '23505') {
        throw SchoolServiceError.create(
          'DUPLICATE_SCHOOL',
          'A school with this NPSN already exists',
          { originalError: error, schoolData: validatedData }
        );
      }
      
      throw SchoolServiceError.create(
        'DATABASE_ERROR',
        'Failed to create school',
        { originalError: error, schoolData: validatedData }
      );
    }

    return newSchool;
  }

  /**
   * Update a school
   */
  static async update(schoolId: number, updateData: UpdateSchoolRequest): Promise<School> {
    // Validate input data
    const validatedData = UpdateSchoolSchema.parse(updateData);
    
    const { data: updatedSchool, error } = await supabase
      .from('schools')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString()
      })
      .eq('id', schoolId)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw SchoolServiceError.create(
          'DUPLICATE_SCHOOL',
          'A school with this NPSN already exists',
          { originalError: error, schoolId, updateData: validatedData }
        );
      }
      
      throw SchoolServiceError.create(
        'DATABASE_ERROR',
        'Failed to update school',
        { originalError: error, schoolId, updateData: validatedData }
      );
    }

    return updatedSchool;
  }

  /**
   * Get all schools
   */
  static async getAll(): Promise<School[]> {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .order('name');

    if (error) {
      throw SchoolServiceError.create(
        'DATABASE_ERROR',
        'Failed to fetch schools',
        { originalError: error }
      );
    }

    return data || [];
  }

  /**
   * Get school with statistics
   */
  static async getWithStats(schoolId: number): Promise<SchoolWithStats | null> {
    const school = await this.getById(schoolId);
    if (!school) return null;

    // Get statistics in parallel
    const [studentCount, teacherCount, classCount, incidentCount] = await Promise.all([
      this.getStudentCount(schoolId),
      this.getTeacherCount(schoolId),
      this.getClassCount(schoolId),
      this.getIncidentCount(schoolId)
    ]);

    return {
      ...school,
      student_count: studentCount,
      teacher_count: teacherCount,
      class_count: classCount,
      incident_count: incidentCount
    };
  }

  /**
   * Get student count for a school
   */
  private static async getStudentCount(schoolId: number): Promise<number> {
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('school_id', schoolId)
      .eq('role', 'student');

    if (error) {
      logger.error('Error getting student count', { error: error.message, schoolId });
      return 0;
    }

    return count || 0;
  }

  /**
   * Get teacher count for a school
   */
  private static async getTeacherCount(schoolId: number): Promise<number> {
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('school_id', schoolId)
      .eq('role', 'teacher');

    if (error) {
      logger.error('Error getting teacher count', { error: error.message, schoolId });
      return 0;
    }

    return count || 0;
  }

  /**
   * Get class count for a school
   */
  private static async getClassCount(schoolId: number): Promise<number> {
    const { count, error } = await supabase
      .from('classes')
      .select('*', { count: 'exact', head: true })
      .eq('school_id', schoolId)
      .neq('status', 'archived');

    if (error) {
      logger.error('Error getting class count', { error: error.message, schoolId });
      return 0;
    }

    return count || 0;
  }

  /**
   * Get incident count for a school
   */
  private static async getIncidentCount(schoolId: number): Promise<number> {
    const { count, error } = await supabase
      .from('incidents')
      .select('*', { count: 'exact', head: true })
      .eq('school_id', schoolId);

    if (error) {
      logger.error('Error getting incident count', { error: error.message, schoolId });
      return 0;
    }

    return count || 0;
  }
}

/**
 * SchoolService provides high-level operations for school management
 */
export class SchoolService {
  /**
   * Fetch school data by ID
   */
  static async fetchSchoolById(schoolId: number): Promise<DatabaseResponse<School>> {
    try {
      const school = await SchoolRepository.getById(schoolId);
      return { data: school, error: null };
    } catch (err) {
      logger.error('Service error fetching school by ID', { 
        error: err instanceof Error ? err.message : String(err),
        schoolId
      });
      return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
    }
  }

  /**
   * Create or update school information
   */
  static async saveSchool(
    schoolData: CreateSchoolRequest | UpdateSchoolRequest,
    schoolId?: number
  ): Promise<DatabaseResponse<School>> {
    try {
      let school: School;
      
      if (schoolId) {
        // Update existing school
        school = await SchoolRepository.update(schoolId, schoolData as UpdateSchoolRequest);
      } else {
        // Create new school
        school = await SchoolRepository.create(schoolData as CreateSchoolRequest);
      }

      return { data: school, error: null };
    } catch (err) {
      logger.error('Service error saving school', { 
        error: err instanceof Error ? err.message : String(err),
        schoolData,
        schoolId
      });
      return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
    }
  }

  /**
   * Get all schools
   */
  static async getAllSchools(): Promise<DatabaseResponse<School[]>> {
    try {
      const schools = await SchoolRepository.getAll();
      return { data: schools, error: null };
    } catch (err) {
      logger.error('Service error fetching all schools', { 
        error: err instanceof Error ? err.message : String(err)
      });
      return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
    }
  }

  /**
   * Get school with statistics
   */
  static async getSchoolWithStats(schoolId: number): Promise<DatabaseResponse<SchoolWithStats>> {
    try {
      const school = await SchoolRepository.getWithStats(schoolId);
      return { data: school, error: null };
    } catch (err) {
      logger.error('Service error fetching school with stats', { 
        error: err instanceof Error ? err.message : String(err),
        schoolId
      });
      return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
    }
  }
}
