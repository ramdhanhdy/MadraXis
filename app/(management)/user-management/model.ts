/**
 * User Management Feature Model
 * 
 * This module contains the business logic and data models for the user management feature.
 * It defines types, validation schemas, and business rules specific to user management functionality.
 */

import { z } from 'zod';
import type { Student as BaseStudent, Teacher as BaseTeacher } from '@types';

// Types
export interface UserManagementState {
  isLoading: boolean;
  error: string | null;
  students: BaseStudent[];
  teachers: BaseTeacher[];
  activeTab: 'students' | 'teachers';
  searchTerm: string;
  showAddModal: boolean;
  selectedUser: BaseStudent | BaseTeacher | null;
  refreshing: boolean;
}

export interface UserFormData {
  full_name: string;
  email?: string;
  phone?: string;
  role: 'student' | 'teacher';
  details?: any; // Use any for now since we're using global types
}

// Use the global types directly
export type Student = BaseStudent;
export type Teacher = BaseTeacher;

export interface UserStats {
  totalStudents: number;
  totalTeachers: number;
  maleStudents: number;
  femaleStudents: number;
  activeUsers: number;
  newUsersThisMonth: number;
}

// Validation schemas
export const userFormSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').optional(),
  role: z.enum(['student', 'teacher']),
  details: z.any().optional(), // Simplified for now
});

export type UserFormSchema = z.infer<typeof userFormSchema>;

// Constants
export const USER_TABS = {
  STUDENTS: 'students',
  TEACHERS: 'teachers',
} as const;

export const USER_ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
} as const;

export const GENDER_OPTIONS = [
  { value: 'M', label: 'Laki-laki' },
  { value: 'F', label: 'Perempuan' },
];

export const SUBJECT_OPTIONS = [
  'Matematika',
  'Bahasa Indonesia',
  'Bahasa Inggris',
  'IPA',
  'IPS',
  'Agama',
  'Olahraga',
  'Seni',
  'Komputer',
  'Bahasa Arab',
];

export const CLASS_OPTIONS = [
  '1A', '1B', '1C',
  '2A', '2B', '2C',
  '3A', '3B', '3C',
  '4A', '4B', '4C',
  '5A', '5B', '5C',
  '6A', '6B', '6C',
];

// Business logic functions
export const validateUserForm = (data: UserFormData): { isValid: boolean; errors: Record<string, string> } => {
  try {
    userFormSchema.parse(data);
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

export const searchUsers = (users: (Student | Teacher)[], query: string): (Student | Teacher)[] => {
  if (!query.trim()) return users;
  
  const lowercaseQuery = query.toLowerCase();
  return users.filter(user => 
    user.full_name?.toLowerCase().includes(lowercaseQuery) ||
    user.email?.toLowerCase().includes(lowercaseQuery) ||
    (user.role === 'student' && (user as Student).details?.nis?.toLowerCase().includes(lowercaseQuery)) ||
    (user.role === 'teacher' && (user as Teacher).details?.nip?.toLowerCase().includes(lowercaseQuery))
  );
};

export const filterStudentsByClass = (students: Student[], className: string): Student[] => {
  if (className === 'all') return students;
  return students.filter(student => student.details?.class_name === className);
};

export const filterStudentsByGender = (students: Student[], gender: string): Student[] => {
  if (gender === 'all') return students;
  return students.filter(student => student.details?.gender === gender);
};

export const filterTeachersBySubject = (teachers: Teacher[], subject: string): Teacher[] => {
  if (subject === 'all') return teachers;
  return teachers.filter(teacher => 
    teacher.details?.subjects?.includes(subject)
  );
};

export const sortUsersByName = (users: (Student | Teacher)[]): (Student | Teacher)[] => {
  return [...users].sort((a, b) => 
    (a.full_name || '').localeCompare(b.full_name || '')
  );
};

export const sortUsersByDate = (users: (Student | Teacher)[]): (Student | Teacher)[] => {
  return [...users].sort((a, b) => 
    new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  );
};

export const calculateUserStats = (students: Student[], teachers: Teacher[]): UserStats => {
  const maleStudents = students.filter(s => s.details?.gender === 'M').length;
  const femaleStudents = students.filter(s => s.details?.gender === 'F').length;
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const newUsersThisMonth = [...students, ...teachers].filter(user => {
    if (!user.created_at) return false;
    const userDate = new Date(user.created_at);
    return userDate.getMonth() === currentMonth && userDate.getFullYear() === currentYear;
  }).length;

  return {
    totalStudents: students.length,
    totalTeachers: teachers.length,
    maleStudents,
    femaleStudents,
    activeUsers: students.length + teachers.length,
    newUsersThisMonth,
  };
};

export const formatUserRole = (role: string): string => {
  switch (role) {
    case USER_ROLES.STUDENT:
      return 'Siswa';
    case USER_ROLES.TEACHER:
      return 'Guru';
    default:
      return role;
  }
};

export const formatGender = (gender?: string): string => {
  switch (gender) {
    case 'M':
      return 'Laki-laki';
    case 'F':
      return 'Perempuan';
    default:
      return 'Tidak diketahui';
  }
};

export const generateUserCode = (role: string, name: string): string => {
  const rolePrefix = role === USER_ROLES.STUDENT ? 'STD' : 'TCH';
  const nameCode = name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 3);
  
  const timestamp = Date.now().toString().slice(-4);
  
  return `${rolePrefix}${nameCode}${timestamp}`;
};

export const validateNIS = (nis: string): boolean => {
  // NIS should be numeric and between 6-10 digits
  return /^\d{6,10}$/.test(nis);
};

export const validateNIP = (nip: string): boolean => {
  // NIP should be numeric and exactly 18 digits
  return /^\d{18}$/.test(nip);
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

export const getUniqueClasses = (students: Student[]): string[] => {
  const classes = students
    .map(student => student.details?.class_name)
    .filter(Boolean) as string[];
  
  return Array.from(new Set(classes)).sort();
};

export const getUniqueSubjects = (teachers: Teacher[]): string[] => {
  const subjects = teachers
    .flatMap(teacher => teacher.details?.subjects || [])
    .filter(Boolean);
  
  return Array.from(new Set(subjects)).sort();
};

// Initial state
export const initialUserManagementState: UserManagementState = {
  isLoading: false,
  error: null,
  students: [],
  teachers: [],
  activeTab: USER_TABS.STUDENTS,
  searchTerm: '',
  showAddModal: false,
  selectedUser: null,
  refreshing: false,
};

export const initialUserFormData: UserFormData = {
  full_name: '',
  email: '',
  phone: '',
  role: USER_ROLES.STUDENT,
  details: undefined,
};

// Error messages
export const USER_MANAGEMENT_ERRORS = {
  LOAD_FAILED: 'Gagal memuat data pengguna',
  STUDENTS_LOAD_FAILED: 'Gagal memuat data siswa',
  TEACHERS_LOAD_FAILED: 'Gagal memuat data guru',
  SAVE_FAILED: 'Gagal menyimpan data pengguna',
  DELETE_FAILED: 'Gagal menghapus pengguna',
  VALIDATION_ERROR: 'Data yang dimasukkan tidak valid',
  NETWORK_ERROR: 'Terjadi kesalahan jaringan. Silakan coba lagi.',
  UNKNOWN_ERROR: 'Terjadi kesalahan yang tidak diketahui',
  UNAUTHORIZED: 'Anda tidak memiliki akses untuk mengelola pengguna',
  DUPLICATE_NIS: 'NIS sudah digunakan oleh siswa lain',
  DUPLICATE_NIP: 'NIP sudah digunakan oleh guru lain',
  DUPLICATE_EMAIL: 'Email sudah digunakan',
  INVALID_NIS: 'Format NIS tidak valid',
  INVALID_NIP: 'Format NIP tidak valid',
  INVALID_PHONE: 'Format nomor telepon tidak valid',
  INVALID_EMAIL: 'Format email tidak valid',
} as const;

// Success messages
export const USER_MANAGEMENT_SUCCESS = {
  USER_CREATED: 'Pengguna berhasil ditambahkan',
  USER_UPDATED: 'Data pengguna berhasil diperbarui',
  USER_DELETED: 'Pengguna berhasil dihapus',
  DATA_REFRESHED: 'Data berhasil diperbarui',
} as const;
