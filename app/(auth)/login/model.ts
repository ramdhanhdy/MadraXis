/**
 * Login Feature Model
 * 
 * This module contains the business logic and data models for the login feature.
 * It defines types, validation schemas, and business rules specific to authentication.
 */

import { useEffect } from 'react';
import { z } from 'zod';
import { useAuth } from '@context/AuthContext';
import { useLoginStore } from './store';

// Types
export interface LoginFormData {
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginState {
  isLoading: boolean;
  // Use a record for errors to support field-specific messages
  errors: Record<string, string> | null;
  formData: LoginFormData;
}

export interface LoginActions {
  setFormData: (data: Partial<LoginFormData>) => void;
  setLoading: (loading: boolean) => void;
  setErrors: (errors: Record<string, string> | null) => void;
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
    .min(8, 'Password must be at least 8 characters'),
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
  errors: null,
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

// Hooks
interface UseLoginProps {
  role?: string;
}

/**
 * Orchestrates the login feature's logic.
 * Connects the UI (Screen) with the state (Store) and authentication logic (Auth Hook).
 */
export const useLogin = ({ role }: UseLoginProps) => {
  const { formData, isLoading, errors, setFormData, setLoading, setErrors } = useLoginStore();
  const { signIn } = useAuth();

  // Set the role from URL params into the form data on initial load
  useEffect(() => {
    if (role && isValidRole(role)) {
      setFormData({ role });
    }
  }, [role, setFormData]);

  const handleFormDataChange = (data: Partial<LoginFormData>) => {
    setFormData(data);
    // Clear errors when user types
    if (errors) {
      setErrors(null);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setErrors(null);

    const validation = validateLoginForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setLoading(false);
      return;
    }

    try {
      await signIn(formData.email, formData.password);
      // On success, navigation is handled by the AuthProvider's onAuthStateChange listener
    } catch (e: any) {
      setErrors({ general: e.message || LOGIN_ERRORS.INVALID_CREDENTIALS });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    errors: errors || {}, // Ensure errors is always an object for the UI
    isLoading,
    handleFormDataChange,
    handleLogin,
  };
};
