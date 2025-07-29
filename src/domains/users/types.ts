import { z } from 'zod';
import { Student, Teacher, Profile } from '@types';

// Validation schemas
export const SearchUsersOptionsSchema = z.object({
  searchTerm: z.string().min(1).max(100).optional(),
  role: z.enum(['student', 'teacher', 'parent', 'management']).optional(),
  gender: z.enum(['male', 'female']).optional(),
  boarding: z.enum(['day', 'boarding']).optional(),
  limit: z.number().int().min(1).max(100).default(10).optional(),
  page: z.number().int().min(1).default(1).optional(),
});

export const CreateUserSchema = z.object({
  full_name: z.string().min(1, 'Full name is required').max(100, 'Name too long'),
  role: z.enum(['student', 'teacher', 'parent', 'management']),
  school_id: z.number().int().positive(),
  email: z.string().email().optional(),
});

export const UpdateUserSchema = z.object({
  full_name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
});

export const CreateStudentDetailsSchema = z.object({
  nis: z.string().min(1, 'NIS is required').max(20),
  date_of_birth: z.string().datetime().optional(),
  gender: z.enum(['male', 'female']),
  boarding: z.enum(['day', 'boarding']),
});

export const CreateTeacherDetailsSchema = z.object({
  employee_id: z.string().min(1, 'Employee ID is required').max(20),
  hire_date: z.string().datetime().optional(),
  specialty: z.string().max(100).optional(),
});

// Type definitions
export interface SearchUsersOptions {
  searchTerm?: string;
  role?: 'student' | 'teacher' | 'parent' | 'management';
  gender?: 'male' | 'female';
  boarding?: 'day' | 'boarding';
  limit?: number;
  page?: number;
}

export interface CreateUserRequest {
  full_name: string;
  role: 'student' | 'teacher' | 'parent' | 'management';
  school_id: number;
  email?: string;
}

export interface UpdateUserRequest {
  full_name?: string;
  email?: string;
}

export interface CreateStudentDetailsRequest {
  nis: string;
  date_of_birth?: string;
  gender: 'male' | 'female';
  boarding: 'day' | 'boarding';
}

export interface CreateTeacherDetailsRequest {
  employee_id: string;
  hire_date?: string;
  specialty?: string;
}

export interface UserWithDetails extends Profile {
  student_details?: {
    user_id: string;
    nis: string;
    date_of_birth?: string;
    gender: 'male' | 'female';
    boarding: 'day' | 'boarding';
    created_at: string;
    updated_at: string;
  };
  teacher_details?: {
    user_id: string;
    employee_id: string;
    hire_date?: string;
    specialty?: string;
    created_at: string;
    updated_at: string;
  };
  parent_details?: {
    user_id: string;
    phone_number?: string;
    address?: string;
    created_at: string;
    updated_at: string;
  };
}

export interface StudentWithPerformance extends Student {
  performance?: {
    id: number;
    user_id: string;
    period_start: string;
    period_end: string;
    academic_score: number;
    quran_score: number;
    attendance_pct: number;
    created_at: string;
  }[];
  class_name?: string;
  parent_name?: string;
  parent_phone?: string;
  address?: string;
}

export interface TeacherWithClasses extends Teacher {
  classes?: {
    id: number;
    name: string;
    level: string;
    student_count: number;
  }[];
  total_classes?: number;
  total_students?: number;
}

export interface UserSearchResult {
  users: UserWithDetails[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserCounts {
  students: number;
  teachers: number;
  parents: number;
  management: number;
  total: number;
}

/**
 * Custom error class for user service operations
 */
export class UserServiceError extends Error {
  public readonly code: string;
  public readonly context?: any;

  constructor(code: string, message: string, context?: any) {
    super(message);
    this.name = 'UserServiceError';
    this.code = code;
    this.context = context;
  }

  static create(code: string, message: string, context?: any): UserServiceError {
    return new UserServiceError(code, message, context);
  }
}

// Legacy types for backward compatibility
export interface LegacyStudent {
  id: string;
  name: string;
  class: string;
  image_url: string;
  quran_progress: {
    memorized_verses: number;
    total_verses: number;
  };
  gender?: 'male' | 'female';
  birth_date?: string;
  parent_name: string;
  phone: string;
  address: string;
}
