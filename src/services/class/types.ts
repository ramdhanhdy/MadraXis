import { z } from 'zod';
import { Class } from '../../types/class';

// Validation schemas
export const CreateClassSchema = z.object({
  name: z.string().min(1, 'Class name is required').max(100, 'Class name too long'),
  level: z.string().min(1, 'Class level is required'),
  description: z.string().optional(),
  school_id: z.number().int().positive('Invalid school ID'),
  student_capacity: z.number().int().positive().default(30),
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

export interface StudentWithDetails {
  student_id: string;
  full_name: string;
  nis?: string;
  gender?: 'male' | 'female';
  boarding?: 'day' | 'boarding';
  enrollment_date?: string;
  notes?: string;
}

export interface GetAvailableStudentsOptions {
  searchTerm?: string;
  gender?: 'male' | 'female';
  boarding?: 'day' | 'boarding';
  limit?: number;
  page?: number;
}

export interface GetClassStudentsOptions {
  searchTerm?: string;
  sortBy?: 'full_name' | 'nis' | 'enrollment_date';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface GetTeacherClassesOptions {
  status?: 'active' | 'inactive' | 'archived';
  searchTerm?: string;
  sortBy?: 'name' | 'level' | 'student_count' | 'created_at';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

// Alias for backward compatibility
export type GetClassesOptions = GetTeacherClassesOptions;

// Error class
export class ClassServiceError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ClassServiceError';
  }

  static create(
    code: string,
    message: string,
    context?: {
      operation?: string;
      classId?: number;
      teacherId?: string;
      studentId?: string;
      originalError?: unknown;
      additionalContext?: Record<string, unknown>;
    }
  ): ClassServiceError {
    const contextData = {
      ...(context?.additionalContext && typeof context.additionalContext === 'object' ? context.additionalContext : {}),
      ...(context?.classId && { classId: context.classId }),
      ...(context?.teacherId && { teacherId: context.teacherId }),
      ...(context?.studentId && { studentId: context.studentId }),
      ...(context?.operation && { operation: context.operation }),
      ...(context?.originalError && typeof context.originalError === 'object' && context.originalError !== null ? { originalError: context.originalError } : context?.originalError ? { originalError: String(context.originalError) } : {}),
    };

    return new ClassServiceError(code, message, contextData);
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      details: this.details,
      stack: this.stack,
    };
  }
}