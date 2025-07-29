/**
 * Reset Password Feature Model
 * 
 * This module contains the business logic and data models for the reset password feature.
 */

import { z } from 'zod';

// Types
export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordState {
  isLoading: boolean;
  error: string | null;
  formData: ResetPasswordFormData;
  sessionEstablished: boolean;
}

// Validation schemas
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    'Password must include uppercase, lowercase, number, and special character'
  );

export const resetPasswordFormSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type ResetPasswordFormSchema = z.infer<typeof resetPasswordFormSchema>;

// Business logic functions
export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  try {
    passwordSchema.parse(password);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0].message };
    }
    return { isValid: false, error: 'Invalid password' };
  }
};

export const validateResetPasswordForm = (data: ResetPasswordFormData): { 
  isValid: boolean; 
  errors: Record<string, string> 
} => {
  try {
    resetPasswordFormSchema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          errors[err.path[0] as string] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: 'Validation failed' } };
  }
};

// Initial state
export const initialResetPasswordState: ResetPasswordState = {
  isLoading: false,
  error: null,
  formData: {
    password: '',
    confirmPassword: '',
  },
  sessionEstablished: false,
};

// Error messages
export const RESET_PASSWORD_ERRORS = {
  INVALID_LINK: 'Invalid password reset link format',
  EXPIRED_LINK: 'Password reset link has expired. Please try again.',
  SESSION_ERROR: 'Failed to process password reset link',
  UPDATE_ERROR: 'Failed to update password',
  NETWORK_ERROR: 'Network error occurred. Please try again.',
  UNKNOWN_ERROR: 'An unknown error occurred',
} as const;
