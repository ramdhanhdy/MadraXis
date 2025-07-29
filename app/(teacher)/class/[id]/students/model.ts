/**
 * Class Students Feature Model
 * 
 * This module contains the business logic and data models for the class students feature.
 * It defines types, validation schemas, and business rules specific to student management within a class.
 */

import { z } from 'zod';

// Types
export interface ClassStudent {
  id: string;
  studentId: string;
  studentNumber: string;
  fullName: string;
  nickname?: string;
  email?: string;
  phone?: string;
  dateOfBirth: Date;
  gender: 'male' | 'female';
  address: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  enrollmentDate: Date;
  status: 'active' | 'inactive' | 'transferred' | 'graduated';
  profilePicture?: string;
  notes?: string;
}

export interface StudentAcademicRecord {
  studentId: string;
  classId: string;
  semester: 'ganjil' | 'genap';
  academicYear: string;
  subjects: SubjectGrade[];
  overallGrade: number;
  rank: number;
  attendanceRate: number;
  behaviorScore: number;
  achievements: string[];
  notes?: string;
}

export interface SubjectGrade {
  subjectId: string;
  subjectName: string;
  assignments: Assignment[];
  midtermScore?: number;
  finalScore?: number;
  overallScore: number;
  grade: string;
  notes?: string;
}

export interface Assignment {
  id: string;
  title: string;
  type: 'quiz' | 'homework' | 'project' | 'exam';
  score: number;
  maxScore: number;
  submittedAt?: Date;
  notes?: string;
}

export interface ClassStudentsState {
  isLoading: boolean;
  error: string | null;
  students: ClassStudent[];
  selectedStudent: ClassStudent | null;
  searchQuery: string;
  filterStatus: 'all' | 'active' | 'inactive' | 'transferred' | 'graduated';
  sortBy: 'name' | 'studentNumber' | 'enrollmentDate' | 'status';
  sortOrder: 'asc' | 'desc';
  viewMode: 'list' | 'grid' | 'table';
}

// Validation schemas
export const classStudentSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  studentNumber: z.string().min(1, 'Student number is required'),
  fullName: z.string().min(1, 'Full name is required'),
  nickname: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  dateOfBirth: z.date(),
  gender: z.enum(['male', 'female']),
  address: z.string().min(1, 'Address is required'),
  parentName: z.string().min(1, 'Parent name is required'),
  parentPhone: z.string().min(1, 'Parent phone is required'),
  parentEmail: z.string().email().optional(),
  enrollmentDate: z.date(),
  status: z.enum(['active', 'inactive', 'transferred', 'graduated']),
  profilePicture: z.string().url().optional(),
  notes: z.string().optional(),
});

export const assignmentSchema = z.object({
  title: z.string().min(1, 'Assignment title is required'),
  type: z.enum(['quiz', 'homework', 'project', 'exam']),
  score: z.number().min(0, 'Score must be non-negative'),
  maxScore: z.number().min(1, 'Max score must be positive'),
  submittedAt: z.date().optional(),
  notes: z.string().optional(),
});

export const subjectGradeSchema = z.object({
  subjectId: z.string().min(1, 'Subject ID is required'),
  subjectName: z.string().min(1, 'Subject name is required'),
  assignments: z.array(assignmentSchema),
  midtermScore: z.number().min(0).max(100).optional(),
  finalScore: z.number().min(0).max(100).optional(),
  overallScore: z.number().min(0).max(100),
  grade: z.string().min(1, 'Grade is required'),
  notes: z.string().optional(),
});

export type ClassStudentSchema = z.infer<typeof classStudentSchema>;
export type AssignmentSchema = z.infer<typeof assignmentSchema>;
export type SubjectGradeSchema = z.infer<typeof subjectGradeSchema>;

// Constants
export const STUDENT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  TRANSFERRED: 'transferred',
  GRADUATED: 'graduated',
} as const;

export const STUDENT_STATUS_LABELS = {
  active: 'Aktif',
  inactive: 'Tidak Aktif',
  transferred: 'Pindah',
  graduated: 'Lulus',
} as const;

export const GENDER_LABELS = {
  male: 'Laki-laki',
  female: 'Perempuan',
} as const;

export const ASSIGNMENT_TYPES = {
  QUIZ: 'quiz',
  HOMEWORK: 'homework',
  PROJECT: 'project',
  EXAM: 'exam',
} as const;

export const ASSIGNMENT_TYPE_LABELS = {
  quiz: 'Kuis',
  homework: 'Tugas Rumah',
  project: 'Proyek',
  exam: 'Ujian',
} as const;

export const GRADE_SCALE = {
  A: { min: 90, max: 100, label: 'Sangat Baik' },
  B: { min: 80, max: 89, label: 'Baik' },
  C: { min: 70, max: 79, label: 'Cukup' },
  D: { min: 60, max: 69, label: 'Kurang' },
  E: { min: 0, max: 59, label: 'Sangat Kurang' },
} as const;

// Business logic functions
export const validateClassStudent = (data: ClassStudent): { isValid: boolean; errors: Record<string, string> } => {
  try {
    classStudentSchema.parse(data);
    
    // Additional business logic validation
    const today = new Date();
    if (data.dateOfBirth >= today) {
      return { 
        isValid: false, 
        errors: { dateOfBirth: 'Tanggal lahir tidak boleh di masa depan' } 
      };
    }
    
    if (data.enrollmentDate > today) {
      return { 
        isValid: false, 
        errors: { enrollmentDate: 'Tanggal pendaftaran tidak boleh di masa depan' } 
      };
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

export const calculateAge = (dateOfBirth: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }
  
  return age;
};

export const calculateGrade = (score: number): string => {
  for (const [grade, range] of Object.entries(GRADE_SCALE)) {
    if (score >= range.min && score <= range.max) {
      return grade;
    }
  }
  return 'E';
};

export const getGradeLabel = (grade: string): string => {
  return GRADE_SCALE[grade as keyof typeof GRADE_SCALE]?.label || 'Tidak Valid';
};

export const formatStudentStatus = (status: string): string => {
  return STUDENT_STATUS_LABELS[status as keyof typeof STUDENT_STATUS_LABELS] || status;
};

export const formatGender = (gender: string): string => {
  return GENDER_LABELS[gender as keyof typeof GENDER_LABELS] || gender;
};

export const formatAssignmentType = (type: string): string => {
  return ASSIGNMENT_TYPE_LABELS[type as keyof typeof ASSIGNMENT_TYPE_LABELS] || type;
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case STUDENT_STATUS.ACTIVE:
      return '#10B981'; // Green
    case STUDENT_STATUS.INACTIVE:
      return '#6B7280'; // Gray
    case STUDENT_STATUS.TRANSFERRED:
      return '#F59E0B'; // Yellow
    case STUDENT_STATUS.GRADUATED:
      return '#3B82F6'; // Blue
    default:
      return '#6B7280'; // Gray
  }
};

export const searchStudents = (students: ClassStudent[], query: string): ClassStudent[] => {
  if (!query.trim()) return students;
  
  const lowercaseQuery = query.toLowerCase();
  return students.filter(student => 
    student.fullName.toLowerCase().includes(lowercaseQuery) ||
    student.studentNumber.toLowerCase().includes(lowercaseQuery) ||
    (student.nickname && student.nickname.toLowerCase().includes(lowercaseQuery)) ||
    (student.email && student.email.toLowerCase().includes(lowercaseQuery))
  );
};

export const filterStudentsByStatus = (students: ClassStudent[], status: string): ClassStudent[] => {
  if (status === 'all') return students;
  return students.filter(student => student.status === status);
};

export const sortStudents = (students: ClassStudent[], sortBy: string, sortOrder: string): ClassStudent[] => {
  return [...students].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.fullName.localeCompare(b.fullName);
        break;
      case 'studentNumber':
        comparison = a.studentNumber.localeCompare(b.studentNumber);
        break;
      case 'enrollmentDate':
        comparison = a.enrollmentDate.getTime() - b.enrollmentDate.getTime();
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });
};

export const calculateOverallScore = (subjects: SubjectGrade[]): number => {
  if (subjects.length === 0) return 0;
  
  const total = subjects.reduce((sum, subject) => sum + subject.overallScore, 0);
  return Math.round((total / subjects.length) * 100) / 100;
};

export const calculateClassRank = (students: StudentAcademicRecord[]): StudentAcademicRecord[] => {
  const sortedStudents = [...students].sort((a, b) => b.overallGrade - a.overallGrade);
  
  return sortedStudents.map((student, index) => ({
    ...student,
    rank: index + 1,
  }));
};

// Initial state
export const initialClassStudentsState: ClassStudentsState = {
  isLoading: false,
  error: null,
  students: [],
  selectedStudent: null,
  searchQuery: '',
  filterStatus: 'all',
  sortBy: 'name',
  sortOrder: 'asc',
  viewMode: 'list',
};

// Error messages
export const STUDENTS_ERRORS = {
  LOAD_FAILED: 'Gagal memuat daftar siswa',
  SAVE_FAILED: 'Gagal menyimpan data siswa',
  DELETE_FAILED: 'Gagal menghapus data siswa',
  ADD_FAILED: 'Gagal menambahkan siswa ke kelas',
  REMOVE_FAILED: 'Gagal mengeluarkan siswa dari kelas',
  NETWORK_ERROR: 'Terjadi kesalahan jaringan. Silakan coba lagi.',
  VALIDATION_ERROR: 'Data yang dimasukkan tidak valid',
  UNKNOWN_ERROR: 'Terjadi kesalahan yang tidak diketahui',
  UNAUTHORIZED: 'Anda tidak memiliki akses untuk mengelola siswa ini',
  NOT_FOUND: 'Data siswa tidak ditemukan',
  DUPLICATE_STUDENT_NUMBER: 'Nomor siswa sudah digunakan',
} as const;
