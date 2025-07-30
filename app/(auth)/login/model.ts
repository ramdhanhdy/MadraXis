/**
 * Login Feature Model
 * 
 * This module contains the business logic and data models for the login feature.
 * It defines types, validation schemas, and business rules specific to authentication.
 */

import { z } from 'zod';

// Types
export interface LoginFormData {
  email: string;
  password: string;
  role?: string;
}

export interface LoginState {
  isLoading: boolean;
  error: string | null;
  formData: LoginFormData;
}

export interface LoginActions {
  setFormData: (data: Partial<LoginFormData>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetForm: () => void;
}

// Validation schemas
export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  role: z.string().optional(),
});

export type LoginFormSchema = z.infer<typeof loginFormSchema>;

// Constants
export const SUPPORTED_ROLES = ['student', 'teacher', 'parent', 'management'] as const;
export type UserRole = typeof SUPPORTED_ROLES[number];

export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  student: 'Siswa',
  teacher: 'Guru',
  parent: 'Orang Tua',
  management: 'Manajemen',
};

// Business logic functions
export const validateLoginForm = (data: LoginFormData): { isValid: boolean; errors: Record<string, string> } => {
  try {
    loginFormSchema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach((err) => {
        if (err.path.length > 0) {
          errors[err.path[0] as string] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: 'Validation failed' } };
  }
};

export const formatRoleForDisplay = (role?: string): string => {
  if (!role) return '';
  const normalizedRole = role.toLowerCase() as UserRole;
  return ROLE_DISPLAY_NAMES[normalizedRole] || role;
};

export const isValidRole = (role?: string): role is UserRole => {
  if (!role) return false;
  return SUPPORTED_ROLES.includes(role.toLowerCase() as UserRole);
};

// Initial state
export const initialLoginState: LoginState = {
  isLoading: false,
  error: null,
  formData: {
    email: '',
    password: '',
    role: undefined,
  },
};

// Error messages
export const LOGIN_ERRORS = {
  INVALID_CREDENTIALS: 'Email atau password tidak valid',
  NETWORK_ERROR: 'Terjadi kesalahan jaringan. Silakan coba lagi.',
  UNKNOWN_ERROR: 'Terjadi kesalahan yang tidak diketahui',
  VALIDATION_ERROR: 'Data yang dimasukkan tidak valid',
  ROLE_REQUIRED: 'Role pengguna diperlukan',
} as const;
