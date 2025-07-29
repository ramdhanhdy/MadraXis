import { supabase } from '@lib/utils/supabase';
import { logger } from '@lib/utils/logger';
import {
  ClassSubject,
  SubjectData,
  SubjectUpdate,
  Subject,
  SubjectWithDetails,
  SubjectServiceError,
  SubjectSchema,
  UpdateSubjectSchema
} from './types';

/**
 * SubjectRepository handles direct database operations for subjects
 */
export class SubjectRepository {
  /**
   * Create a new subject for a class
   */
  static async createClassSubject(
    classId: number,
    subjectData: SubjectData,
    teacherId: string
  ): Promise<ClassSubject> {
    // Validate input data
    const validatedData = SubjectSchema.parse(subjectData);
    
    const insertData = {
      class_id: classId,
      ...validatedData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data: newSubject, error } = await supabase
      .from('class_subjects')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      logger.error('Failed to create class subject', {
        error: error.message,
        code: error.code,
        classId,
        teacherId
      });
      
      throw SubjectServiceError.create(
        'DATABASE_ERROR',
        'Failed to create subject',
        { originalError: error, subjectData: validatedData }
      );
    }

    return newSubject;
  }

  /**
   * Get subjects for a class
   */
  static async getClassSubjects(classId: number): Promise<ClassSubject[]> {
    const { data, error } = await supabase
      .from('class_subjects')
      .select('*')
      .eq('class_id', classId)
      .order('subject_name');

    if (error) {
      throw SubjectServiceError.create(
        'DATABASE_ERROR',
        'Failed to fetch class subjects',
        { originalError: error, classId }
      );
    }

    return data || [];
  }

  /**
   * Update a class subject
   */
  static async updateClassSubject(
    subjectId: number,
    updateData: SubjectUpdate,
    teacherId: string
  ): Promise<ClassSubject> {
    // Validate input data
    const validatedData = UpdateSubjectSchema.parse(updateData);
    
    const { data: updatedSubject, error } = await supabase
      .from('class_subjects')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString()
      })
      .eq('id', subjectId)
      .select()
      .single();

    if (error) {
      throw SubjectServiceError.create(
        'DATABASE_ERROR',
        'Failed to update subject',
        { originalError: error, subjectId, updateData: validatedData }
      );
    }

    return updatedSubject;
  }

  /**
   * Delete a class subject
   */
  static async deleteClassSubject(subjectId: number, teacherId: string): Promise<void> {
    const { error } = await supabase
      .from('class_subjects')
      .delete()
      .eq('id', subjectId);

    if (error) {
      throw SubjectServiceError.create(
        'DATABASE_ERROR',
        'Failed to delete subject',
        { originalError: error, subjectId, teacherId }
      );
    }
  }

  /**
   * Get all subjects for a school
   */
  static async getSchoolSubjects(schoolId: number): Promise<Subject[]> {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('school_id', schoolId)
      .order('subject_name');

    if (error) {
      throw SubjectServiceError.create(
        'DATABASE_ERROR',
        'Failed to fetch school subjects',
        { originalError: error, schoolId }
      );
    }

    return data || [];
  }
}

/**
 * SubjectService provides high-level operations for subject management
 */
export class SubjectService {
  /**
   * Create a new subject for a class
   */
  static async createClassSubject(
    classId: number,
    subjectData: SubjectData,
    teacherId: string
  ): Promise<ClassSubject> {
    return SubjectRepository.createClassSubject(classId, subjectData, teacherId);
  }

  /**
   * Get subjects for a class
   */
  static async getClassSubjects(classId: number): Promise<ClassSubject[]> {
    return SubjectRepository.getClassSubjects(classId);
  }

  /**
   * Update a class subject
   */
  static async updateClassSubject(
    subjectId: number,
    updateData: SubjectUpdate,
    teacherId: string
  ): Promise<ClassSubject> {
    return SubjectRepository.updateClassSubject(subjectId, updateData, teacherId);
  }

  /**
   * Delete a class subject
   */
  static async deleteClassSubject(subjectId: number, teacherId: string): Promise<void> {
    return SubjectRepository.deleteClassSubject(subjectId, teacherId);
  }

  /**
   * Get all subjects for a school
   */
  static async getSchoolSubjects(schoolId: number): Promise<Subject[]> {
    return SubjectRepository.getSchoolSubjects(schoolId);
  }

  /**
   * Get subject statistics for a class
   */
  static async getClassSubjectStats(classId: number): Promise<{
    total: number;
    by_grading_scale: {
      points: number;
      percentage: number;
      standards: number;
    };
  }> {
    const subjects = await this.getClassSubjects(classId);
    
    const stats = {
      total: subjects.length,
      by_grading_scale: {
        points: 0,
        percentage: 0,
        standards: 0
      }
    };

    subjects.forEach(subject => {
      stats.by_grading_scale[subject.grading_scale]++;
    });

    return stats;
  }
}
