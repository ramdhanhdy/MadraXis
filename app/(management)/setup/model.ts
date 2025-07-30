/**
 * School Setup Feature Model
 * 
 * This module contains the business logic and data models for the school setup feature.
 * It defines types, validation schemas, and business rules specific to initial school configuration.
 */

import { z } from 'zod';

// Re-export School type from domains
export type { School } from '@domains/schools';

// Types
export interface SchoolSetupState {
  isLoading: boolean;
  error: string | null;
  formData: SchoolSetupFormData;
  validationErrors: Record<string, string>;
  isSubmitting: boolean;
  submitSuccess: boolean;
  debugInfo: string | null;
  currentStep: number;
  totalSteps: number;
}

export interface SchoolSetupFormData {
  schoolName: string;
  npsn: string;
  managerName: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  establishedYear?: number;
  schoolType?: 'public' | 'private' | 'islamic' | 'other';
  educationLevel?: 'elementary' | 'middle' | 'high' | 'mixed';
}

export interface SetupStep {
  id: number;
  title: string;
  description: string;
  fields: string[];
  isRequired: boolean;
}

// Validation schemas
export const basicInfoSchema = z.object({
  schoolName: z.string().min(3, 'Nama sekolah minimal 3 karakter'),
  npsn: z.string().min(8, 'NPSN harus 8 digit').max(8, 'NPSN harus 8 digit').regex(/^\d+$/, 'NPSN hanya boleh berisi angka'),
  managerName: z.string().min(2, 'Nama minimal 2 karakter'),
});

export const contactInfoSchema = z.object({
  address: z.string().min(10, 'Alamat minimal 10 karakter').optional(),
  phone: z.string().min(10, 'Nomor telepon minimal 10 digit').optional(),
  email: z.string().email('Format email tidak valid').optional(),
  website: z.string().url('Format website tidak valid').optional(),
});

export const schoolDetailsSchema = z.object({
  establishedYear: z.number().min(1900, 'Tahun berdiri tidak valid').max(new Date().getFullYear(), 'Tahun berdiri tidak boleh di masa depan').optional(),
  schoolType: z.enum(['public', 'private', 'islamic', 'other']).optional(),
  educationLevel: z.enum(['elementary', 'middle', 'high', 'mixed']).optional(),
});

export const completeSetupSchema = basicInfoSchema
  .merge(contactInfoSchema)
  .merge(schoolDetailsSchema);

export type BasicInfoSchema = z.infer<typeof basicInfoSchema>;
export type ContactInfoSchema = z.infer<typeof contactInfoSchema>;
export type SchoolDetailsSchema = z.infer<typeof schoolDetailsSchema>;
export type CompleteSetupSchema = z.infer<typeof completeSetupSchema>;

// Constants
export const SETUP_STEPS: SetupStep[] = [
  {
    id: 1,
    title: 'Informasi Dasar',
    description: 'Data dasar sekolah dan pengelola',
    fields: ['schoolName', 'npsn', 'managerName'],
    isRequired: true,
  },
  {
    id: 2,
    title: 'Informasi Kontak',
    description: 'Alamat dan kontak sekolah',
    fields: ['address', 'phone', 'email', 'website'],
    isRequired: false,
  },
  {
    id: 3,
    title: 'Detail Sekolah',
    description: 'Informasi tambahan sekolah',
    fields: ['establishedYear', 'schoolType', 'educationLevel'],
    isRequired: false,
  },
];

export const SCHOOL_TYPES = [
  { value: 'public', label: 'Negeri' },
  { value: 'private', label: 'Swasta' },
  { value: 'islamic', label: 'Islam' },
  { value: 'other', label: 'Lainnya' },
];

export const EDUCATION_LEVELS = [
  { value: 'elementary', label: 'Sekolah Dasar (SD)' },
  { value: 'middle', label: 'Sekolah Menengah Pertama (SMP)' },
  { value: 'high', label: 'Sekolah Menengah Atas (SMA)' },
  { value: 'mixed', label: 'Campuran' },
];

// Business logic functions
export const validateFormStep = (step: number, formData: SchoolSetupFormData): { isValid: boolean; errors: Record<string, string> } => {
  try {
    switch (step) {
      case 1:
        basicInfoSchema.parse({
          schoolName: formData.schoolName,
          npsn: formData.npsn,
          managerName: formData.managerName,
        });
        break;
      case 2:
        contactInfoSchema.parse({
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
          website: formData.website,
        });
        break;
      case 3:
        schoolDetailsSchema.parse({
          establishedYear: formData.establishedYear,
          schoolType: formData.schoolType,
          educationLevel: formData.educationLevel,
        });
        break;
      default:
        return { isValid: false, errors: { general: 'Invalid step' } };
    }
    
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

export const validateCompleteSetup = (formData: SchoolSetupFormData): { isValid: boolean; errors: Record<string, string> } => {
  try {
    completeSetupSchema.parse(formData);
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

export const validateNPSN = (npsn: string): boolean => {
  // NPSN should be exactly 8 digits
  return /^\d{8}$/.test(npsn);
};

export const formatPhoneNumber = (phone: string): string => {
  // Simple phone number formatting for Indonesian numbers
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('62')) {
    return `+${cleaned}`;
  } else if (cleaned.startsWith('0')) {
    return `+62${cleaned.substring(1)}`;
  }
  return `+62${cleaned}`;
};

export const isStepComplete = (step: number, formData: SchoolSetupFormData): boolean => {
  const { isValid } = validateFormStep(step, formData);
  return isValid;
};

export const getCompletedStepsCount = (formData: SchoolSetupFormData): number => {
  let count = 0;
  for (let i = 1; i <= SETUP_STEPS.length; i++) {
    if (isStepComplete(i, formData)) {
      count++;
    } else if (SETUP_STEPS[i - 1].isRequired) {
      break; // Stop at first incomplete required step
    }
  }
  return count;
};

export const getSetupProgress = (formData: SchoolSetupFormData): number => {
  const completedSteps = getCompletedStepsCount(formData);
  return Math.round((completedSteps / SETUP_STEPS.length) * 100);
};

export const convertFormDataToSchool = (formData: SchoolSetupFormData) => {
  return {
    name: formData.schoolName,
    npsn: formData.npsn,
    address: formData.address || '',
    phone: formData.phone || '',
    email: formData.email || '',
    website: formData.website,
    establishedYear: formData.establishedYear,
    schoolType: formData.schoolType,
    educationLevel: formData.educationLevel,
  };
};

export const generateSchoolCode = (schoolName: string, npsn: string): string => {
  // Generate a school code from name and NPSN
  const nameCode = schoolName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 3);
  
  const npsnCode = npsn.substring(npsn.length - 3);
  
  return `${nameCode}${npsnCode}`;
};

export const getSchoolTypeLabel = (type?: string): string => {
  const schoolType = SCHOOL_TYPES.find(t => t.value === type);
  return schoolType?.label || 'Tidak Diketahui';
};

export const getEducationLevelLabel = (level?: string): string => {
  const educationLevel = EDUCATION_LEVELS.find(l => l.value === level);
  return educationLevel?.label || 'Tidak Diketahui';
};

// Initial state
export const initialSchoolSetupFormData: SchoolSetupFormData = {
  schoolName: '',
  npsn: '',
  managerName: '',
  address: '',
  phone: '',
  email: '',
  website: '',
  establishedYear: undefined,
  schoolType: undefined,
  educationLevel: undefined,
};

export const initialSchoolSetupState: SchoolSetupState = {
  isLoading: false,
  error: null,
  formData: initialSchoolSetupFormData,
  validationErrors: {},
  isSubmitting: false,
  submitSuccess: false,
  debugInfo: null,
  currentStep: 1,
  totalSteps: SETUP_STEPS.length,
};

// Error messages
export const SETUP_ERRORS = {
  SAVE_FAILED: 'Gagal menyimpan data sekolah',
  VALIDATION_ERROR: 'Data yang dimasukkan tidak valid',
  DUPLICATE_NPSN: 'NPSN sudah digunakan oleh sekolah lain',
  DUPLICATE_NAME: 'Nama sekolah sudah digunakan',
  NETWORK_ERROR: 'Terjadi kesalahan jaringan. Silakan coba lagi.',
  UNKNOWN_ERROR: 'Terjadi kesalahan yang tidak diketahui',
  UNAUTHORIZED: 'Anda tidak memiliki akses untuk melakukan setup',
  INVALID_NPSN: 'Format NPSN tidak valid',
  INVALID_PHONE: 'Format nomor telepon tidak valid',
  INVALID_EMAIL: 'Format email tidak valid',
  INVALID_WEBSITE: 'Format website tidak valid',
  USER_UPDATE_FAILED: 'Gagal memperbarui data pengguna',
  SESSION_REFRESH_FAILED: 'Gagal memperbarui sesi',
} as const;

// Success messages
export const SETUP_SUCCESS = {
  SCHOOL_CREATED: 'Profil sekolah berhasil dibuat',
  SETUP_COMPLETE: 'Setup sekolah berhasil diselesaikan',
  USER_UPDATED: 'Data pengguna berhasil diperbarui',
} as const;
