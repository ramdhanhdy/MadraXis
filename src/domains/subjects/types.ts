import { z } from 'zod';

// Validation schemas
export const SubjectSchema = z.object({
  subject_name: z.string().min(1, 'Subject name is required').max(100, 'Subject name too long'),
  subject_code: z.string().max(20, 'Subject code too long').optional(),
  grading_scale: z.enum(['points', 'percentage', 'standards']).default('percentage'),
  standards_alignment: z.string().max(1000, 'Standards alignment text is too long (max 1000 characters)').optional(),
});

export const UpdateSubjectSchema = z.object({
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
  created_at: string;
  updated_at: string;
}

export interface SubjectWithDetails extends Subject {
  class_count?: number;
  teacher_count?: number;
  student_count?: number;
}

/**
 * Custom error class for subject service operations
 */
export class SubjectServiceError extends Error {
  public readonly code: string;
  public readonly context?: any;

  constructor(code: string, message: string, context?: any) {
    super(message);
    this.name = 'SubjectServiceError';
    this.code = code;
    this.context = context;
  }

  static create(code: string, message: string, context?: any): SubjectServiceError {
    return new SubjectServiceError(code, message, context);
  }
}
