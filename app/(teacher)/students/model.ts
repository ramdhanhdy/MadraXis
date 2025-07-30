/**
 * Students Management Feature Model
 * 
 * This module contains the business logic and data models for the students management feature.
 * It defines types, validation schemas, and business rules specific to overall student management.
 */

import { z } from 'zod';

// Student interface based on the schema
export interface Student {
  id: string;
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
  currentClass?: string;
  status: 'active' | 'inactive' | 'transferred' | 'graduated';
  profilePicture?: string;
  notes?: string;
}

export interface AcademicRecord {
  id: string;
  studentId: string;
  classId: string;
  className: string;
  semester: 'ganjil' | 'genap';
  academicYear: string;
  subjects: SubjectRecord[];
  overallGrade: number;
  rank: number;
  attendanceRate: number;
  notes?: string;
}

export interface SubjectRecord {
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  scores: Score[];
  finalScore: number;
  grade: string;
  notes?: string;
}

export interface Score {
  id: string;
  type: 'quiz' | 'homework' | 'project' | 'midterm' | 'final';
  title: string;
  score: number;
  maxScore: number;
  date: Date;
  notes?: string;
}

export interface BehaviorRecord {
  id: string;
  studentId: string;
  date: Date;
  type: 'positive' | 'negative';
  category: 'discipline' | 'participation' | 'leadership' | 'cooperation' | 'other';
  description: string;
  reportedBy: string;
  points: number;
  notes?: string;
}

export interface StudentsState {
  isLoading: boolean;
  error: string | null;
  students: Student[];
  selectedStudent: Student | null;
  searchQuery: string;
  filterStatus: 'all' | 'active' | 'inactive' | 'transferred' | 'graduated';
  filterClass: string;
  sortBy: 'name' | 'studentNumber' | 'class' | 'enrollmentDate' | 'status';
  sortOrder: 'asc' | 'desc';
  viewMode: 'list' | 'grid' | 'table';
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

// Validation schemas
export const studentSchema = z.object({
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
  currentClass: z.string().optional(),
  status: z.enum(['active', 'inactive', 'transferred', 'graduated']),
  profilePicture: z.string().url().optional(),
  notes: z.string().optional(),
});

export const scoreSchema = z.object({
  type: z.enum(['quiz', 'homework', 'project', 'midterm', 'final']),
  title: z.string().min(1, 'Score title is required'),
  score: z.number().min(0, 'Score must be non-negative'),
  maxScore: z.number().min(1, 'Max score must be positive'),
  date: z.date(),
  notes: z.string().optional(),
});

export const behaviorRecordSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  date: z.date(),
  type: z.enum(['positive', 'negative']),
  category: z.enum(['discipline', 'participation', 'leadership', 'cooperation', 'other']),
  description: z.string().min(1, 'Description is required'),
  reportedBy: z.string().min(1, 'Reporter is required'),
  points: z.number(),
  notes: z.string().optional(),
});

export type StudentSchema = z.infer<typeof studentSchema>;
export type ScoreSchema = z.infer<typeof scoreSchema>;
export type BehaviorRecordSchema = z.infer<typeof behaviorRecordSchema>;

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

export const SCORE_TYPES = {
  QUIZ: 'quiz',
  HOMEWORK: 'homework',
  PROJECT: 'project',
  MIDTERM: 'midterm',
  FINAL: 'final',
} as const;

export const SCORE_TYPE_LABELS = {
  quiz: 'Kuis',
  homework: 'Tugas Rumah',
  project: 'Proyek',
  midterm: 'Ujian Tengah Semester',
  final: 'Ujian Akhir Semester',
} as const;

export const BEHAVIOR_TYPES = {
  POSITIVE: 'positive',
  NEGATIVE: 'negative',
} as const;

export const BEHAVIOR_TYPE_LABELS = {
  positive: 'Positif',
  negative: 'Negatif',
} as const;

export const BEHAVIOR_CATEGORIES = {
  DISCIPLINE: 'discipline',
  PARTICIPATION: 'participation',
  LEADERSHIP: 'leadership',
  COOPERATION: 'cooperation',
  OTHER: 'other',
} as const;

export const BEHAVIOR_CATEGORY_LABELS = {
  discipline: 'Kedisiplinan',
  participation: 'Partisipasi',
  leadership: 'Kepemimpinan',
  cooperation: 'Kerjasama',
  other: 'Lainnya',
} as const;

export const GRADE_SCALE = {
  A: { min: 90, max: 100, label: 'Sangat Baik' },
  B: { min: 80, max: 89, label: 'Baik' },
  C: { min: 70, max: 79, label: 'Cukup' },
  D: { min: 60, max: 69, label: 'Kurang' },
  E: { min: 0, max: 59, label: 'Sangat Kurang' },
} as const;

// Business logic functions
export const validateStudent = (data: Student): { isValid: boolean; errors: Record<string, string> } => {
  try {
    studentSchema.parse(data);
    
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

export const formatScoreType = (type: string): string => {
  return SCORE_TYPE_LABELS[type as keyof typeof SCORE_TYPE_LABELS] || type;
};

export const formatBehaviorType = (type: string): string => {
  return BEHAVIOR_TYPE_LABELS[type as keyof typeof BEHAVIOR_TYPE_LABELS] || type;
};

export const formatBehaviorCategory = (category: string): string => {
  return BEHAVIOR_CATEGORY_LABELS[category as keyof typeof BEHAVIOR_CATEGORY_LABELS] || category;
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

export const getBehaviorTypeColor = (type: string): string => {
  switch (type) {
    case BEHAVIOR_TYPES.POSITIVE:
      return '#10B981'; // Green
    case BEHAVIOR_TYPES.NEGATIVE:
      return '#EF4444'; // Red
    default:
      return '#6B7280'; // Gray
  }
};

export const searchStudents = (students: Student[], query: string): Student[] => {
  if (!query.trim()) return students;
  
  const lowercaseQuery = query.toLowerCase();
  return students.filter(student => 
    student.fullName.toLowerCase().includes(lowercaseQuery) ||
    student.studentNumber.toLowerCase().includes(lowercaseQuery) ||
    (student.nickname && student.nickname.toLowerCase().includes(lowercaseQuery)) ||
    (student.email && student.email.toLowerCase().includes(lowercaseQuery)) ||
    (student.currentClass && student.currentClass.toLowerCase().includes(lowercaseQuery))
  );
};

export const filterStudentsByStatus = (students: Student[], status: string): Student[] => {
  if (status === 'all') return students;
  return students.filter(student => student.status === status);
};

export const filterStudentsByClass = (students: Student[], className: string): Student[] => {
  if (!className || className === 'all') return students;
  return students.filter(student => student.currentClass === className);
};

export const sortStudents = (students: Student[], sortBy: string, sortOrder: string): Student[] => {
  return [...students].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.fullName.localeCompare(b.fullName);
        break;
      case 'studentNumber':
        comparison = a.studentNumber.localeCompare(b.studentNumber);
        break;
      case 'class':
        comparison = (a.currentClass || '').localeCompare(b.currentClass || '');
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

export const calculateOverallGrade = (subjects: SubjectRecord[]): number => {
  if (subjects.length === 0) return 0;
  
  const total = subjects.reduce((sum, subject) => sum + subject.finalScore, 0);
  return Math.round((total / subjects.length) * 100) / 100;
};

export const calculateBehaviorScore = (records: BehaviorRecord[]): number => {
  const totalPoints = records.reduce((sum, record) => sum + record.points, 0);
  return Math.max(0, Math.min(100, 50 + totalPoints)); // Base score 50, adjusted by behavior points
};

// Initial state
export const initialStudentsState: StudentsState = {
  isLoading: false,
  error: null,
  students: [],
  selectedStudent: null,
  searchQuery: '',
  filterStatus: 'all',
  filterClass: 'all',
  sortBy: 'name',
  sortOrder: 'asc',
  viewMode: 'list',
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
};

// Error messages
export const STUDENTS_ERRORS = {
  LOAD_FAILED: 'Gagal memuat daftar siswa',
  SAVE_FAILED: 'Gagal menyimpan data siswa',
  DELETE_FAILED: 'Gagal menghapus data siswa',
  CREATE_FAILED: 'Gagal menambahkan siswa baru',
  UPDATE_FAILED: 'Gagal memperbarui data siswa',
  NETWORK_ERROR: 'Terjadi kesalahan jaringan. Silakan coba lagi.',
  VALIDATION_ERROR: 'Data yang dimasukkan tidak valid',
  UNKNOWN_ERROR: 'Terjadi kesalahan yang tidak diketahui',
  UNAUTHORIZED: 'Anda tidak memiliki akses untuk mengelola siswa ini',
  NOT_FOUND: 'Data siswa tidak ditemukan',
  DUPLICATE_STUDENT_NUMBER: 'Nomor siswa sudah digunakan',
  DUPLICATE_EMAIL: 'Email sudah digunakan oleh siswa lain',
} as const;
