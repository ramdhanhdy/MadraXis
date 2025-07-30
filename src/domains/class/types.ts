import { z } from 'zod';
import { Class } from '../../types';

// Validation schemas
export const CreateClassSchema = z.object({
  name: z.string().min(1, 'Class name is required').max(100, 'Class name too long'),
  level: z.string().min(1, 'Class level is required'),
  description: z.string().optional(),
  school_id: z.number().int().positive(),
  student_capacity: z.number().int().positive().optional(),
  academic_year: z.string().min(1, 'Academic year is required'),
  semester: z.enum(['1', '2']),
});

export const UpdateClassSchema = z.object({
  name: z.string().min(1, 'Class name is required').max(100, 'Class name too long').optional(),
  level: z.string().min(1, 'Class level is required').optional(),
  description: z.string().optional(),
  student_capacity: z.number().int().positive().optional(),
  academic_year: z.string().optional(),
  semester: z.enum(['1', '2']).optional(),
  status: z.enum(['active', 'inactive', 'archived']).optional(),
});

export const BulkUpdateClassSchema = z.object({
  class_ids: z.array(z.number().int().positive()),
  updates: UpdateClassSchema.partial(),
});

export const EnrollStudentSchema = z.object({
  student_id: z.string().uuid('Invalid student ID'),
  enrollment_date: z.string().datetime().optional(),
  notes: z.string().optional(),
});

export const BulkEnrollStudentsSchema = z.object({
  student_ids: z.array(z.string().uuid()),
  enrollment_date: z.string().datetime().optional(),
  notes: z.string().optional(),
});

export const GetAvailableStudentsOptionsSchema = z.object({
  searchTerm: z.string().min(1).max(100).optional(),
  gender: z.enum(['male', 'female']).optional(),
  boarding: z.enum(['day', 'boarding']).optional(),
  limit: z.number().int().min(1).max(100).default(10).optional(),
  page: z.number().int().min(1).default(1).optional(),
});

// Type definitions
export interface CreateClassRequest {
  name: string;
  level: string;
  description?: string;
  school_id: number;
  student_capacity?: number;
  academic_year: string;
  semester: '1' | '2';
}

export interface UpdateClassRequest {
  name?: string;
  level?: string;
  description?: string;
  student_capacity?: number;
  academic_year?: string;
  semester?: '1' | '2';
  status?: 'active' | 'inactive' | 'archived';
}

export interface BulkUpdateRequest {
  class_ids: number[];
  updates: Partial<UpdateClassRequest>;
}

// Alias for backward compatibility
export type BulkUpdateClassesRequest = BulkUpdateRequest;

export interface ClassWithDetails extends Class {
  student_count: number;
  subject_count: number;
  teacher_count: number;
  teachers: {
    user_id: string;
    role: string;
    full_name: string;
  }[];
}

export interface EnrollStudentRequest {
  student_id: string;
  enrollment_date?: string;
  notes?: string;
}

export interface BulkEnrollStudentsRequest {
  student_ids: string[];
  enrollment_date?: string;
  notes?: string;
}

export interface GetClassesOptions {
  status?: 'active' | 'inactive' | 'archived';
  searchTerm?: string;
  sortBy?: 'name' | 'created_at' | 'updated_at';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  page?: number;
}

export interface GetTeacherClassesOptions extends GetClassesOptions {}

export interface GetAvailableStudentsOptions {
  searchTerm?: string;
  gender?: 'male' | 'female';
  boarding?: 'day' | 'boarding';
  limit?: number;
  page?: number;
}

export interface GetClassStudentsOptions {
  searchTerm?: string;
  limit?: number;
  page?: number;
}

export interface StudentWithDetails {
  id: string;
  full_name: string;
  nis?: string;
  gender?: 'male' | 'female';
  boarding?: 'day' | 'boarding';
  date_of_birth?: string;
  enrollment_date?: string;
  notes?: string;
}

/**
 * Custom error class for class service operations
 */
export class ClassServiceError extends Error {
  public readonly code: string;
  public readonly context?: any;

  constructor(code: string, message: string, context?: any) {
    super(message);
    this.name = 'ClassServiceError';
    this.code = code;
    this.context = context;
  }

  static create(code: string, message: string, context?: any): ClassServiceError {
    return new ClassServiceError(code, message, context);
  }
}
