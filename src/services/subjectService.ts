import { supabase } from '../utils/supabase';
import { z } from 'zod';

// Validation schemas
const SubjectSchema = z.object({
  subject_name: z.string().min(1, 'Subject name is required').max(100, 'Subject name too long'),
  subject_code: z.string().max(20, 'Subject code too long').optional(),
  grading_scale: z.enum(['points', 'percentage', 'standards']).default('percentage'),
  standards_alignment: z.string().max(1000, 'Standards alignment text is too long (max 1000 characters)').optional(),
});

const UpdateSubjectSchema = z.object({
  subject_name: z.string().min(1, 'Subject name is required').max(100, 'Subject name too long').optional(),
  subject_code: z.string().max(20, 'Subject code too long').optional(),
  grading_scale: z.enum(['points', 'percentage', 'standards']).optional(),
  standards_alignment: z.string().max(1000, 'Standards alignment text is too long (max 1000 characters)').optional(),
});

// Type definitions
export interface ClassSubject {
  id: number;
  class_id: number;
  subject_name: string;
  subject_code?: string;
  grading_scale: 'points' | 'percentage' | 'standards';
  standards_alignment?: string;
  created_at: string;
  updated_at: string;
}

export interface SubjectData {
  subject_name: string;
  subject_code?: string;
  grading_scale?: 'points' | 'percentage' | 'standards';
  standards_alignment?: string;
}

export interface SubjectUpdate {
  subject_name?: string;
  subject_code?: string;
  grading_scale?: 'points' | 'percentage' | 'standards';
  standards_alignment?: string;
}

export interface Subject {
  id: number;
  subject_name: string;
  subject_code?: string;
  grading_scale: 'points' | 'percentage' | 'standards';
  standards_alignment?: string;
}

export class SubjectServiceError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'SubjectServiceError';
  }
}

/**
 * SubjectService provides comprehensive subject management within classes
 */
export class SubjectService {
  /**
   * Get available predefined subjects
   */
  static async getAvailableSubjects(): Promise<Subject[]> {
    try {
      // Return a predefined list of common subjects
      // In a real implementation, this could come from a school curriculum database
      return [
        { id: -1, subject_name: 'Mathematics', subject_code: 'MATH', grading_scale: 'percentage' },
        { id: -2, subject_name: 'Science', subject_code: 'SCI', grading_scale: 'percentage' },
        { id: -3, subject_name: 'English', subject_code: 'ENG', grading_scale: 'percentage' },
        { id: -4, subject_name: 'History', subject_code: 'HIST', grading_scale: 'percentage' },
        { id: -5, subject_name: 'Geography', subject_code: 'GEO', grading_scale: 'percentage' },
        { id: -6, subject_name: 'Art', subject_code: 'ART', grading_scale: 'standards' },
        { id: -7, subject_name: 'Music', subject_code: 'MUS', grading_scale: 'standards' },
        { id: -8, subject_name: 'Physical Education', subject_code: 'PE', grading_scale: 'standards' },
        { id: -9, subject_name: 'Computer Science', subject_code: 'CS', grading_scale: 'percentage' },
        { id: -10, subject_name: 'Religious Studies', subject_code: 'REL', grading_scale: 'standards' },
        { id: -11, subject_name: 'Arabic', subject_code: 'ARB', grading_scale: 'percentage' },
        { id: -12, subject_name: 'Quran', subject_code: 'QUR', grading_scale: 'standards' },
      ];
    } catch (error) {
      throw new SubjectServiceError(
        'FETCH_FAILED',
        'Failed to fetch available subjects',
        error
      );
    }
  }

  /**
   * Get all subjects for a specific class
   */
  static async getClassSubjects(classId: number): Promise<ClassSubject[]> {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new SubjectServiceError(
          'NOT_AUTHENTICATED',
          'User not authenticated'
        );
      }

      // Verify teacher has access to this class
      const hasAccess = await SubjectService.verifyClassAccess(classId, user.id);
      if (!hasAccess) {
        throw new SubjectServiceError(
          'ACCESS_DENIED',
          'You do not have access to this class'
        );
      }

      const { data: subjects, error } = await supabase
        .from('class_subjects')
        .select('*')
        .eq('class_id', classId)
        .order('subject_name', { ascending: true });

      if (error) {
        throw new SubjectServiceError(
          'FETCH_FAILED',
          'Failed to fetch subjects',
          error
        );
      }

      return subjects || [];
    } catch (error) {
      if (error instanceof SubjectServiceError) {
        throw error;
      }
      throw new SubjectServiceError(
        'UNEXPECTED_ERROR',
        'An unexpected error occurred',
        error
      );
    }
  }

  /**
   * Add a subject to a class
   */
  static async addSubjectToClass(
    classId: number,
    subjectData: SubjectData
  ): Promise<ClassSubject> {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new SubjectServiceError(
          'NOT_AUTHENTICATED',
          'User not authenticated'
        );
      }

      // Validate input data
      const validatedData = SubjectSchema.parse(subjectData);

      // Verify teacher has access to this class
      const hasAccess = await this.verifyClassAccess(classId, user.id);
      if (!hasAccess) {
        throw new SubjectServiceError(
          'ACCESS_DENIED',
          'You do not have access to this class'
        );
      }

      // Check for duplicate subject within the class
      const existingSubject = await this.checkDuplicateSubjectName(
        validatedData.subject_name,
        classId
      );

      if (existingSubject) {
        throw new SubjectServiceError(
          'DUPLICATE_SUBJECT',
          'A subject with this name already exists in this class'
        );
      }

      // Insert subject record
      const { data: newSubject, error } = await supabase
        .from('class_subjects')
        .insert({
          ...validatedData,
          class_id: classId,
        })
        .select()
        .single();

      if (error) {
        throw new SubjectServiceError(
          'CREATE_FAILED',
          'Failed to add subject to class',
          error
        );
      }

      return newSubject!;
    } catch (error) {
      if (error instanceof SubjectServiceError) {
        throw error;
      }
      throw new SubjectServiceError(
        'UNEXPECTED_ERROR',
        'An unexpected error occurred',
        error
      );
    }
  }

  /**
   * Update a class subject
   */
  static async updateClassSubject(
    subjectId: number,
    updates: SubjectUpdate
  ): Promise<ClassSubject> {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new SubjectServiceError(
          'NOT_AUTHENTICATED',
          'User not authenticated'
        );
      }

      // Validate input data
      const validatedData = UpdateSubjectSchema.parse(updates);

      // Get the subject to determine which class it belongs to
      const { data: subject } = await supabase
        .from('class_subjects')
        .select('class_id')
        .eq('id', subjectId)
        .single();

      if (!subject) {
        throw new SubjectServiceError(
          'SUBJECT_NOT_FOUND',
          'Subject not found'
        );
      }

      // Verify teacher has access to this class
      const hasAccess = await this.verifyClassAccess(subject.class_id, user.id);
      if (!hasAccess) {
        throw new SubjectServiceError(
          'ACCESS_DENIED',
          'You do not have access to this class'
        );
      }

      // Check for duplicate subject name if name is being updated
      if (validatedData.subject_name) {
        const existingSubject = await this.checkDuplicateSubjectName(
          validatedData.subject_name,
          subject.class_id,
          subjectId
        );

        if (existingSubject) {
          throw new SubjectServiceError(
            'DUPLICATE_SUBJECT',
            'A subject with this name already exists in this class'
          );
        }
      }

      // Update subject record
      const { data: updatedSubject, error } = await supabase
        .from('class_subjects')
        .update({
          ...validatedData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', subjectId)
        .select()
        .single();

      if (error) {
        throw new SubjectServiceError(
          'UPDATE_FAILED',
          'Failed to update subject',
          error
        );
      }

      return updatedSubject!;
    } catch (error) {
      if (error instanceof SubjectServiceError) {
        throw error;
      }
      throw new SubjectServiceError(
        'UNEXPECTED_ERROR',
        'An unexpected error occurred',
        error
      );
    }
  }

  /**
   * Remove a subject from a class
   */
  static async removeSubjectFromClass(subjectId: number): Promise<void> {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new SubjectServiceError(
          'NOT_AUTHENTICATED',
          'User not authenticated'
        );
      }

      // Get the subject to determine which class it belongs to
      const { data: subject } = await supabase
        .from('class_subjects')
        .select('class_id')
        .eq('id', subjectId)
        .single();

      if (!subject) {
        throw new SubjectServiceError(
          'SUBJECT_NOT_FOUND',
          'Subject not found'
        );
      }

      // Verify teacher has access to this class
      const hasAccess = await this.verifyClassAccess(subject.class_id, user.id);
      if (!hasAccess) {
        throw new SubjectServiceError(
          'ACCESS_DENIED',
          'You do not have access to this class'
        );
      }

      const { error } = await supabase
        .from('class_subjects')
        .delete()
        .eq('id', subjectId);

      if (error) {
        throw new SubjectServiceError(
          'DELETE_FAILED',
          'Failed to remove subject from class',
          error
        );
      }
    } catch (error) {
      if (error instanceof SubjectServiceError) {
        throw error;
      }
      throw new SubjectServiceError(
        'UNEXPECTED_ERROR',
        'An unexpected error occurred',
        error
      );
    }
  }

  /**
   * Validate subject data
   */
  static async validateSubjectData(
    subjectData: SubjectData,
    classId: number
  ): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        errors.push('User not authenticated');
        return { valid: false, errors };
      }

      // Validate input data
      SubjectSchema.parse(subjectData);

      // Check if teacher has access to the class
      const hasAccess = await this.verifyClassAccess(classId, user.id);
      if (!hasAccess) {
        errors.push('You do not have access to this class');
      }

      // Check for duplicate subject name
      const existingSubject = await this.checkDuplicateSubjectName(
        subjectData.subject_name,
        classId
      );

      if (existingSubject) {
        errors.push('A subject with this name already exists in this class');
      }

      // Validate standards alignment
      if (subjectData.standards_alignment) {
        if (subjectData.standards_alignment.length > 1000) {
          errors.push('Standards alignment text is too long (max 1000 characters)');
        }
      }

      // Validate subject code
      if (subjectData.subject_code) {
        if (subjectData.subject_code.length > 20) {
          errors.push('Subject code is too long (max 20 characters)');
        }
        if (!/^[A-Za-z0-9\-]+$/.test(subjectData.subject_code)) {
          errors.push('Subject code can only contain letters, numbers, and hyphens');
        }
      }

      return {
        valid: errors.length === 0,
        errors,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors.push(...error.issues.map((err: z.ZodIssue) => err.message));
      }
      return {
        valid: false,
        errors,
      };
    }
  }

  /**
   * Get subjects by grading scale
   */
  static async getSubjectsByGradingScale(
    classId: number,
    gradingScale: 'points' | 'percentage' | 'standards'
  ): Promise<ClassSubject[]> {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new SubjectServiceError(
          'NOT_AUTHENTICATED',
          'User not authenticated'
        );
      }

      // Verify teacher has access to this class
      const hasAccess = await this.verifyClassAccess(classId, user.id);
      if (!hasAccess) {
        throw new SubjectServiceError(
          'ACCESS_DENIED',
          'You do not have access to this class'
        );
      }

      const { data: subjects, error } = await supabase
        .from('class_subjects')
        .select('*')
        .eq('class_id', classId)
        .eq('grading_scale', gradingScale)
        .order('subject_name', { ascending: true });

      if (error) {
        throw new SubjectServiceError(
          'FETCH_FAILED',
          'Failed to fetch subjects',
          error
        );
      }

      return subjects || [];
    } catch (error) {
      if (error instanceof SubjectServiceError) {
        throw error;
      }
      throw new SubjectServiceError(
        'UNEXPECTED_ERROR',
        'An unexpected error occurred',
        error
      );
    }
  }

  /**
   * Helper methods
   */
  private static async checkDuplicateSubjectName(
    subjectName: string,
    classId: number,
    excludeId?: number
  ): Promise<ClassSubject | null> {
    let query = supabase
      .from('class_subjects')
      .select('*')
      .eq('subject_name', subjectName)
      .eq('class_id', classId);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data: existingSubject } = await query.single();
    return existingSubject || null;
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
}