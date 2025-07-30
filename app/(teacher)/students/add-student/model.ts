/**
 * Add Student Feature Model
 * 
 * This module contains the business logic and data models for the add student feature.
 * It defines types, validation schemas, and business rules specific to student creation.
 */

import { z } from 'zod';

// Re-export common types from parent model
export type {
  Student,
  StudentSchema,
} from '../model';

// Additional types specific to adding students
export interface AddStudentState {
  isLoading: boolean;
  error: string | null;
  formData: StudentFormData;
  validationErrors: Record<string, string>;
  isSubmitting: boolean;
  submitSuccess: boolean;
  currentStep: number;
  totalSteps: number;
}

export interface StudentFormData {
  // Basic Information
  studentNumber: string;
  fullName: string;
  nickname?: string;
  dateOfBirth: Date | null;
  gender: 'male' | 'female' | '';
  
  // Contact Information
  email?: string;
  phone?: string;
  address: string;
  
  // Parent Information
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  parentAddress?: string;
  parentOccupation?: string;
  
  // School Information
  enrollmentDate: Date | null;
  currentClass?: string;
  previousSchool?: string;
  
  // Additional Information
  profilePicture?: string;
  medicalConditions?: string;
  allergies?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  notes?: string;
}

export interface FormStep {
  id: number;
  title: string;
  description: string;
  fields: string[];
  isRequired: boolean;
}

// Validation schemas
export const basicInfoSchema = z.object({
  studentNumber: z.string().min(1, 'Nomor siswa harus diisi'),
  fullName: z.string().min(2, 'Nama lengkap minimal 2 karakter'),
  nickname: z.string().optional(),
  dateOfBirth: z.date({ message: 'Tanggal lahir harus diisi' }),
  gender: z.enum(['male', 'female'], { message: 'Jenis kelamin harus dipilih' }),
});

export const contactInfoSchema = z.object({
  email: z.string().email('Format email tidak valid').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().min(5, 'Alamat minimal 5 karakter'),
});

export const parentInfoSchema = z.object({
  parentName: z.string().min(2, 'Nama orang tua minimal 2 karakter'),
  parentPhone: z.string().min(10, 'Nomor telepon orang tua minimal 10 digit'),
  parentEmail: z.string().email('Format email tidak valid').optional().or(z.literal('')),
  parentAddress: z.string().optional(),
  parentOccupation: z.string().optional(),
});

export const schoolInfoSchema = z.object({
  enrollmentDate: z.date({ message: 'Tanggal pendaftaran harus diisi' }),
  currentClass: z.string().optional(),
  previousSchool: z.string().optional(),
});

export const additionalInfoSchema = z.object({
  profilePicture: z.string().url().optional().or(z.literal('')),
  medicalConditions: z.string().optional(),
  allergies: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  notes: z.string().optional(),
});

export const completeStudentFormSchema = basicInfoSchema
  .merge(contactInfoSchema)
  .merge(parentInfoSchema)
  .merge(schoolInfoSchema)
  .merge(additionalInfoSchema);

export type BasicInfoSchema = z.infer<typeof basicInfoSchema>;
export type ContactInfoSchema = z.infer<typeof contactInfoSchema>;
export type ParentInfoSchema = z.infer<typeof parentInfoSchema>;
export type SchoolInfoSchema = z.infer<typeof schoolInfoSchema>;
export type AdditionalInfoSchema = z.infer<typeof additionalInfoSchema>;
export type CompleteStudentFormSchema = z.infer<typeof completeStudentFormSchema>;

// Constants
export const FORM_STEPS: FormStep[] = [
  {
    id: 1,
    title: 'Informasi Dasar',
    description: 'Data dasar siswa',
    fields: ['studentNumber', 'fullName', 'nickname', 'dateOfBirth', 'gender'],
    isRequired: true,
  },
  {
    id: 2,
    title: 'Informasi Kontak',
    description: 'Alamat dan kontak siswa',
    fields: ['email', 'phone', 'address'],
    isRequired: true,
  },
  {
    id: 3,
    title: 'Informasi Orang Tua',
    description: 'Data orang tua/wali',
    fields: ['parentName', 'parentPhone', 'parentEmail', 'parentAddress', 'parentOccupation'],
    isRequired: true,
  },
  {
    id: 4,
    title: 'Informasi Sekolah',
    description: 'Data akademik dan sekolah',
    fields: ['enrollmentDate', 'currentClass', 'previousSchool'],
    isRequired: true,
  },
  {
    id: 5,
    title: 'Informasi Tambahan',
    description: 'Data pelengkap (opsional)',
    fields: ['profilePicture', 'medicalConditions', 'allergies', 'emergencyContact', 'emergencyPhone', 'notes'],
    isRequired: false,
  },
];

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Laki-laki' },
  { value: 'female', label: 'Perempuan' },
];

export const CLASS_OPTIONS = [
  { value: '1A', label: 'Kelas 1A' },
  { value: '1B', label: 'Kelas 1B' },
  { value: '2A', label: 'Kelas 2A' },
  { value: '2B', label: 'Kelas 2B' },
  { value: '3A', label: 'Kelas 3A' },
  { value: '3B', label: 'Kelas 3B' },
];

// Business logic functions
export const validateFormStep = (step: number, formData: StudentFormData): { isValid: boolean; errors: Record<string, string> } => {
  try {
    switch (step) {
      case 1:
        basicInfoSchema.parse({
          studentNumber: formData.studentNumber,
          fullName: formData.fullName,
          nickname: formData.nickname,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
        });
        break;
      case 2:
        contactInfoSchema.parse({
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        });
        break;
      case 3:
        parentInfoSchema.parse({
          parentName: formData.parentName,
          parentPhone: formData.parentPhone,
          parentEmail: formData.parentEmail,
          parentAddress: formData.parentAddress,
          parentOccupation: formData.parentOccupation,
        });
        break;
      case 4:
        schoolInfoSchema.parse({
          enrollmentDate: formData.enrollmentDate,
          currentClass: formData.currentClass,
          previousSchool: formData.previousSchool,
        });
        break;
      case 5:
        additionalInfoSchema.parse({
          profilePicture: formData.profilePicture,
          medicalConditions: formData.medicalConditions,
          allergies: formData.allergies,
          emergencyContact: formData.emergencyContact,
          emergencyPhone: formData.emergencyPhone,
          notes: formData.notes,
        });
        break;
      default:
        return { isValid: false, errors: { general: 'Invalid step' } };
    }
    
    // Additional business logic validation
    if (step === 1 && formData.dateOfBirth) {
      const today = new Date();
      const age = today.getFullYear() - formData.dateOfBirth.getFullYear();
      if (age < 5 || age > 25) {
        return { 
          isValid: false, 
          errors: { dateOfBirth: 'Usia siswa harus antara 5-25 tahun' } 
        };
      }
    }
    
    if (step === 4 && formData.enrollmentDate) {
      const today = new Date();
      if (formData.enrollmentDate > today) {
        return { 
          isValid: false, 
          errors: { enrollmentDate: 'Tanggal pendaftaran tidak boleh di masa depan' } 
        };
      }
    }
    
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

export const validateCompleteForm = (formData: StudentFormData): { isValid: boolean; errors: Record<string, string> } => {
  try {
    completeStudentFormSchema.parse(formData);
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

export const generateStudentNumber = (classCode?: string): string => {
  const year = new Date().getFullYear().toString().slice(-2);
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  const prefix = classCode ? classCode.toUpperCase() : 'STD';
  return `${prefix}${year}${randomNum}`;
};

export const calculateAge = (dateOfBirth: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }
  
  return age;
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

export const isStepComplete = (step: number, formData: StudentFormData): boolean => {
  const { isValid } = validateFormStep(step, formData);
  return isValid;
};

export const getCompletedStepsCount = (formData: StudentFormData): number => {
  let count = 0;
  for (let i = 1; i <= FORM_STEPS.length; i++) {
    if (isStepComplete(i, formData)) {
      count++;
    } else {
      break; // Stop at first incomplete step
    }
  }
  return count;
};

export const getFormProgress = (formData: StudentFormData): number => {
  const completedSteps = getCompletedStepsCount(formData);
  return Math.round((completedSteps / FORM_STEPS.length) * 100);
};

import type { Student } from '../model';

export const convertFormDataToStudent = (formData: StudentFormData): Omit<Student, 'id' | 'academicRecords' | 'behaviorRecords'> => {
  return {
    studentNumber: formData.studentNumber,
    fullName: formData.fullName,
    nickname: formData.nickname,
    email: formData.email,
    phone: formData.phone,
    dateOfBirth: formData.dateOfBirth!,
    gender: formData.gender as 'male' | 'female',
    address: formData.address,
    parentName: formData.parentName,
    parentPhone: formData.parentPhone,
    parentEmail: formData.parentEmail,
    enrollmentDate: formData.enrollmentDate!,
    currentClass: formData.currentClass,
    status: 'active',
    profilePicture: formData.profilePicture,
    notes: formData.notes,
  };
};

// Initial state
export const initialStudentFormData: StudentFormData = {
  studentNumber: '',
  fullName: '',
  nickname: '',
  dateOfBirth: null,
  gender: '',
  email: '',
  phone: '',
  address: '',
  parentName: '',
  parentPhone: '',
  parentEmail: '',
  parentAddress: '',
  parentOccupation: '',
  enrollmentDate: null,
  currentClass: '',
  previousSchool: '',
  profilePicture: '',
  medicalConditions: '',
  allergies: '',
  emergencyContact: '',
  emergencyPhone: '',
  notes: '',
};

export const initialAddStudentState: AddStudentState = {
  isLoading: false,
  error: null,
  formData: initialStudentFormData,
  validationErrors: {},
  isSubmitting: false,
  submitSuccess: false,
  currentStep: 1,
  totalSteps: FORM_STEPS.length,
};

// Error messages
export const ADD_STUDENT_ERRORS = {
  SAVE_FAILED: 'Gagal menyimpan data siswa',
  VALIDATION_ERROR: 'Data yang dimasukkan tidak valid',
  DUPLICATE_STUDENT_NUMBER: 'Nomor siswa sudah digunakan',
  DUPLICATE_EMAIL: 'Email sudah digunakan oleh siswa lain',
  NETWORK_ERROR: 'Terjadi kesalahan jaringan. Silakan coba lagi.',
  UNKNOWN_ERROR: 'Terjadi kesalahan yang tidak diketahui',
  UNAUTHORIZED: 'Anda tidak memiliki akses untuk menambahkan siswa',
  INVALID_DATE: 'Format tanggal tidak valid',
  INVALID_PHONE: 'Format nomor telepon tidak valid',
  INVALID_EMAIL: 'Format email tidak valid',
} as const;
