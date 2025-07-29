/**
 * Class Reports Feature Model
 * 
 * This module contains the business logic and data models for the class reports feature.
 * It defines types, validation schemas, and business rules specific to class reporting.
 */

import { z } from 'zod';

// Types
export interface ClassReport {
  id: string;
  classId: string;
  className: string;
  reportType: 'academic' | 'behavior' | 'attendance' | 'progress' | 'summary';
  title: string;
  description: string;
  period: {
    startDate: Date;
    endDate: Date;
    semester: 'ganjil' | 'genap';
    academicYear: string;
  };
  metrics: {
    totalStudents: number;
    averageScore: number;
    attendanceRate: number;
    completionRate: number;
  };
  subjects: SubjectReport[];
  students: StudentReport[];
  generatedBy: string;
  generatedAt: Date;
  status: 'draft' | 'published' | 'archived';
}

export interface SubjectReport {
  subjectId: string;
  subjectName: string;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passRate: number;
  totalAssignments: number;
  completedAssignments: number;
}

export interface StudentReport {
  studentId: string;
  studentName: string;
  overallScore: number;
  attendanceRate: number;
  behaviorScore: number;
  subjects: {
    subjectId: string;
    subjectName: string;
    score: number;
    grade: string;
    notes?: string;
  }[];
  strengths: string[];
  improvements: string[];
  teacherNotes?: string;
}

export interface ClassReportsState {
  isLoading: boolean;
  error: string | null;
  reports: ClassReport[];
  selectedReport: ClassReport | null;
  filterType: 'all' | 'academic' | 'behavior' | 'attendance' | 'progress' | 'summary';
  sortBy: 'date' | 'type' | 'title';
  sortOrder: 'asc' | 'desc';
}

// Validation schemas
export const classReportSchema = z.object({
  classId: z.string().min(1, 'Class ID is required'),
  className: z.string().min(1, 'Class name is required'),
  reportType: z.enum(['academic', 'behavior', 'attendance', 'progress', 'summary']),
  title: z.string().min(1, 'Report title is required'),
  description: z.string().min(1, 'Report description is required'),
  period: z.object({
    startDate: z.date(),
    endDate: z.date(),
    semester: z.enum(['ganjil', 'genap']),
    academicYear: z.string().min(1, 'Academic year is required'),
  }),
  generatedBy: z.string().min(1, 'Generator ID is required'),
  status: z.enum(['draft', 'published', 'archived']),
});

export const subjectReportSchema = z.object({
  subjectId: z.string().min(1, 'Subject ID is required'),
  subjectName: z.string().min(1, 'Subject name is required'),
  averageScore: z.number().min(0).max(100),
  highestScore: z.number().min(0).max(100),
  lowestScore: z.number().min(0).max(100),
  passRate: z.number().min(0).max(100),
  totalAssignments: z.number().min(0),
  completedAssignments: z.number().min(0),
});

export type ClassReportSchema = z.infer<typeof classReportSchema>;
export type SubjectReportSchema = z.infer<typeof subjectReportSchema>;

// Constants
export const REPORT_TYPES = {
  ACADEMIC: 'academic',
  BEHAVIOR: 'behavior',
  ATTENDANCE: 'attendance',
  PROGRESS: 'progress',
  SUMMARY: 'summary',
} as const;

export const REPORT_TYPE_LABELS = {
  academic: 'Laporan Akademik',
  behavior: 'Laporan Perilaku',
  attendance: 'Laporan Kehadiran',
  progress: 'Laporan Progress',
  summary: 'Laporan Ringkasan',
} as const;

export const SEMESTER_LABELS = {
  ganjil: 'Semester Ganjil',
  genap: 'Semester Genap',
} as const;

export const REPORT_STATUS_LABELS = {
  draft: 'Draft',
  published: 'Dipublikasi',
  archived: 'Diarsipkan',
} as const;

export const GRADE_SCALE = {
  A: { min: 90, max: 100, label: 'Sangat Baik' },
  B: { min: 80, max: 89, label: 'Baik' },
  C: { min: 70, max: 79, label: 'Cukup' },
  D: { min: 60, max: 69, label: 'Kurang' },
  E: { min: 0, max: 59, label: 'Sangat Kurang' },
} as const;

// Business logic functions
export const validateClassReport = (data: ClassReport): { isValid: boolean; errors: Record<string, string> } => {
  try {
    classReportSchema.parse(data);
    
    // Additional business logic validation
    if (data.period.endDate <= data.period.startDate) {
      return { 
        isValid: false, 
        errors: { period: 'Tanggal akhir harus setelah tanggal mulai' } 
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

export const calculateClassAverage = (students: StudentReport[]): number => {
  if (students.length === 0) return 0;
  const total = students.reduce((sum, student) => sum + student.overallScore, 0);
  return Math.round((total / students.length) * 100) / 100;
};

export const calculatePassRate = (students: StudentReport[], passingScore: number = 70): number => {
  if (students.length === 0) return 0;
  const passedStudents = students.filter(student => student.overallScore >= passingScore).length;
  return Math.round((passedStudents / students.length) * 100);
};

export const formatReportType = (type: string): string => {
  return REPORT_TYPE_LABELS[type as keyof typeof REPORT_TYPE_LABELS] || type;
};

export const formatSemester = (semester: string): string => {
  return SEMESTER_LABELS[semester as keyof typeof SEMESTER_LABELS] || semester;
};

export const formatReportStatus = (status: string): string => {
  return REPORT_STATUS_LABELS[status as keyof typeof REPORT_STATUS_LABELS] || status;
};

export const sortReports = (reports: ClassReport[], sortBy: string, sortOrder: string): ClassReport[] => {
  return [...reports].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = a.generatedAt.getTime() - b.generatedAt.getTime();
        break;
      case 'type':
        comparison = a.reportType.localeCompare(b.reportType);
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });
};

export const filterReports = (reports: ClassReport[], filterType: string): ClassReport[] => {
  if (filterType === 'all') return reports;
  return reports.filter(report => report.reportType === filterType);
};

// Initial state
export const initialClassReportsState: ClassReportsState = {
  isLoading: false,
  error: null,
  reports: [],
  selectedReport: null,
  filterType: 'all',
  sortBy: 'date',
  sortOrder: 'desc',
};

// Error messages
export const REPORTS_ERRORS = {
  LOAD_FAILED: 'Gagal memuat laporan kelas',
  GENERATE_FAILED: 'Gagal membuat laporan',
  SAVE_FAILED: 'Gagal menyimpan laporan',
  DELETE_FAILED: 'Gagal menghapus laporan',
  NETWORK_ERROR: 'Terjadi kesalahan jaringan. Silakan coba lagi.',
  VALIDATION_ERROR: 'Data yang dimasukkan tidak valid',
  UNKNOWN_ERROR: 'Terjadi kesalahan yang tidak diketahui',
  UNAUTHORIZED: 'Anda tidak memiliki akses untuk melihat laporan ini',
  NOT_FOUND: 'Laporan tidak ditemukan',
} as const;
