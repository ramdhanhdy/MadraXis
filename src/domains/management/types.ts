import { z } from 'zod';

// Validation schemas
export const SchoolSchema = z.object({
  name: z.string().min(1, 'School name is required').max(200, 'School name too long'),
  npsn: z.string().min(1, 'NPSN is required').max(20, 'NPSN too long'),
  address: z.string().min(1, 'Address is required').max(500, 'Address too long'),
  phone: z.string().min(1, 'Phone is required').max(20, 'Phone too long'),
  email: z.string().email('Invalid email format').max(100, 'Email too long'),
  website: z.string().url('Invalid website URL').optional(),
});

export const UpdateSchoolSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  npsn: z.string().min(1).max(20).optional(),
  address: z.string().min(1).max(500).optional(),
  phone: z.string().min(1).max(20).optional(),
  email: z.string().email().max(100).optional(),
  website: z.string().url().optional(),
});

// Type definitions
export interface School {
  id?: number;
  name: string;
  npsn: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SchoolWithStats extends School {
  student_count?: number;
  teacher_count?: number;
  class_count?: number;
  incident_count?: number;
}

export interface CreateSchoolRequest {
  name: string;
  npsn: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
}

export interface UpdateSchoolRequest {
  name?: string;
  npsn?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
}

/**
 * Custom error class for management service operations
 */
export class ManagementServiceError extends Error {
  public readonly code: string;
  public readonly context?: any;

  constructor(code: string, message: string, context?: any) {
    super(message);
    this.name = 'ManagementServiceError';
    this.code = code;
    this.context = context;
  }

  static create(code: string, message: string, context?: any): ManagementServiceError {
    return new ManagementServiceError(code, message, context);
  }
}

// Backward compatibility alias
export const SchoolServiceError = ManagementServiceError;
