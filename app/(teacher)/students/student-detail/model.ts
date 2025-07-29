/**
 * Student Detail Feature Model
 * 
 * This module contains the business logic and data models for the student detail feature.
 * It defines types, validation schemas, and business rules specific to individual student management.
 */

import { z } from 'zod';

// Re-export common types from parent model
export type {
  Student,
  AcademicRecord,
  SubjectRecord,
  Score,
  BehaviorRecord,
} from '../model';

// Additional types specific to student detail
export interface StudentDetailState {
  isLoading: boolean;
  error: string | null;
  student: Student | null;
  academicRecords: AcademicRecord[];
  behaviorRecords: BehaviorRecord[];
  selectedSemester: string;
  selectedAcademicYear: string;
  activeTab: 'overview' | 'academic' | 'behavior' | 'attendance' | 'notes';
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: Date;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
  subjectId?: string;
  subjectName?: string;
}

export interface StudentNote {
  id: string;
  studentId: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  type: 'general' | 'academic' | 'behavior' | 'health' | 'family';
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentProgress {
  subjectId: string;
  subjectName: string;
  currentGrade: number;
  previousGrade?: number;
  trend: 'improving' | 'declining' | 'stable';
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

// Validation schemas
export const attendanceRecordSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  date: z.date(),
  status: z.enum(['present', 'absent', 'late', 'excused']),
  notes: z.string().optional(),
  subjectId: z.string().optional(),
  subjectName: z.string().optional(),
});

export const studentNoteSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  authorId: z.string().min(1, 'Author ID is required'),
  authorName: z.string().min(1, 'Author name is required'),
  title: z.string().min(1, 'Note title is required'),
  content: z.string().min(1, 'Note content is required'),
  type: z.enum(['general', 'academic', 'behavior', 'health', 'family']),
  isPrivate: z.boolean(),
});

export type AttendanceRecordSchema = z.infer<typeof attendanceRecordSchema>;
export type StudentNoteSchema = z.infer<typeof studentNoteSchema>;

// Constants
export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  EXCUSED: 'excused',
} as const;

export const ATTENDANCE_STATUS_LABELS = {
  present: 'Hadir',
  absent: 'Tidak Hadir',
  late: 'Terlambat',
  excused: 'Izin',
} as const;

export const NOTE_TYPES = {
  GENERAL: 'general',
  ACADEMIC: 'academic',
  BEHAVIOR: 'behavior',
  HEALTH: 'health',
  FAMILY: 'family',
} as const;

export const NOTE_TYPE_LABELS = {
  general: 'Umum',
  academic: 'Akademik',
  behavior: 'Perilaku',
  health: 'Kesehatan',
  family: 'Keluarga',
} as const;

export const DETAIL_TABS = {
  OVERVIEW: 'overview',
  ACADEMIC: 'academic',
  BEHAVIOR: 'behavior',
  ATTENDANCE: 'attendance',
  NOTES: 'notes',
} as const;

export const TAB_LABELS = {
  overview: 'Ringkasan',
  academic: 'Akademik',
  behavior: 'Perilaku',
  attendance: 'Kehadiran',
  notes: 'Catatan',
} as const;

export const PROGRESS_TRENDS = {
  IMPROVING: 'improving',
  DECLINING: 'declining',
  STABLE: 'stable',
} as const;

export const TREND_LABELS = {
  improving: 'Meningkat',
  declining: 'Menurun',
  stable: 'Stabil',
} as const;

// Business logic functions
export const validateAttendanceRecord = (data: AttendanceRecord): { isValid: boolean; errors: Record<string, string> } => {
  try {
    attendanceRecordSchema.parse(data);
    
    // Additional business logic validation
    const today = new Date();
    if (data.date > today) {
      return { 
        isValid: false, 
        errors: { date: 'Tanggal kehadiran tidak boleh di masa depan' } 
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

export const validateStudentNote = (data: StudentNote): { isValid: boolean; errors: Record<string, string> } => {
  try {
    studentNoteSchema.parse(data);
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

export const formatAttendanceStatus = (status: string): string => {
  return ATTENDANCE_STATUS_LABELS[status as keyof typeof ATTENDANCE_STATUS_LABELS] || status;
};

export const formatNoteType = (type: string): string => {
  return NOTE_TYPE_LABELS[type as keyof typeof NOTE_TYPE_LABELS] || type;
};

export const formatTrend = (trend: string): string => {
  return TREND_LABELS[trend as keyof typeof TREND_LABELS] || trend;
};

export const getAttendanceStatusColor = (status: string): string => {
  switch (status) {
    case ATTENDANCE_STATUS.PRESENT:
      return '#10B981'; // Green
    case ATTENDANCE_STATUS.ABSENT:
      return '#EF4444'; // Red
    case ATTENDANCE_STATUS.LATE:
      return '#F59E0B'; // Yellow
    case ATTENDANCE_STATUS.EXCUSED:
      return '#3B82F6'; // Blue
    default:
      return '#6B7280'; // Gray
  }
};

export const getTrendColor = (trend: string): string => {
  switch (trend) {
    case PROGRESS_TRENDS.IMPROVING:
      return '#10B981'; // Green
    case PROGRESS_TRENDS.DECLINING:
      return '#EF4444'; // Red
    case PROGRESS_TRENDS.STABLE:
      return '#6B7280'; // Gray
    default:
      return '#6B7280'; // Gray
  }
};

export const getNoteTypeColor = (type: string): string => {
  switch (type) {
    case NOTE_TYPES.GENERAL:
      return '#6B7280'; // Gray
    case NOTE_TYPES.ACADEMIC:
      return '#3B82F6'; // Blue
    case NOTE_TYPES.BEHAVIOR:
      return '#F59E0B'; // Yellow
    case NOTE_TYPES.HEALTH:
      return '#EF4444'; // Red
    case NOTE_TYPES.FAMILY:
      return '#8B5CF6'; // Purple
    default:
      return '#6B7280'; // Gray
  }
};

export const calculateAttendanceRate = (records: AttendanceRecord[]): number => {
  if (records.length === 0) return 0;
  
  const presentCount = records.filter(record => 
    record.status === ATTENDANCE_STATUS.PRESENT || record.status === ATTENDANCE_STATUS.LATE
  ).length;
  
  return Math.round((presentCount / records.length) * 100);
};

export const getAttendanceStatistics = (records: AttendanceRecord[]) => {
  const total = records.length;
  const present = records.filter(r => r.status === ATTENDANCE_STATUS.PRESENT).length;
  const absent = records.filter(r => r.status === ATTENDANCE_STATUS.ABSENT).length;
  const late = records.filter(r => r.status === ATTENDANCE_STATUS.LATE).length;
  const excused = records.filter(r => r.status === ATTENDANCE_STATUS.EXCUSED).length;
  
  return {
    total,
    present,
    absent,
    late,
    excused,
    attendanceRate: total > 0 ? Math.round(((present + late) / total) * 100) : 0,
  };
};

export const analyzeProgress = (currentRecord: AcademicRecord, previousRecord?: AcademicRecord): StudentProgress[] => {
  return currentRecord.subjects.map(subject => {
    const previousSubject = previousRecord?.subjects.find(s => s.subjectId === subject.subjectId);
    
    let trend: 'improving' | 'declining' | 'stable' = 'stable';
    if (previousSubject) {
      const diff = subject.finalScore - previousSubject.finalScore;
      if (diff > 5) trend = 'improving';
      else if (diff < -5) trend = 'declining';
    }
    
    return {
      subjectId: subject.subjectId,
      subjectName: subject.subjectName,
      currentGrade: subject.finalScore,
      previousGrade: previousSubject?.finalScore,
      trend,
      strengths: [], // Would be populated from analysis
      weaknesses: [], // Would be populated from analysis
      recommendations: [], // Would be populated from analysis
    };
  });
};

export const filterNotesByType = (notes: StudentNote[], type: string): StudentNote[] => {
  if (type === 'all') return notes;
  return notes.filter(note => note.type === type);
};

export const sortNotesByDate = (notes: StudentNote[], order: 'asc' | 'desc' = 'desc'): StudentNote[] => {
  return [...notes].sort((a, b) => {
    const comparison = a.createdAt.getTime() - b.createdAt.getTime();
    return order === 'desc' ? -comparison : comparison;
  });
};

export const getRecentBehaviorTrend = (records: BehaviorRecord[], days: number = 30): 'positive' | 'negative' | 'neutral' => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  const recentRecords = records.filter(record => record.date >= cutoffDate);
  
  if (recentRecords.length === 0) return 'neutral';
  
  const totalPoints = recentRecords.reduce((sum, record) => sum + record.points, 0);
  
  if (totalPoints > 5) return 'positive';
  if (totalPoints < -5) return 'negative';
  return 'neutral';
};

// Initial state
export const initialStudentDetailState: StudentDetailState = {
  isLoading: false,
  error: null,
  student: null,
  academicRecords: [],
  behaviorRecords: [],
  selectedSemester: 'ganjil',
  selectedAcademicYear: new Date().getFullYear().toString(),
  activeTab: DETAIL_TABS.OVERVIEW,
};

// Error messages
export const STUDENT_DETAIL_ERRORS = {
  LOAD_FAILED: 'Gagal memuat detail siswa',
  SAVE_FAILED: 'Gagal menyimpan data siswa',
  UPDATE_FAILED: 'Gagal memperbarui data siswa',
  DELETE_FAILED: 'Gagal menghapus data siswa',
  ATTENDANCE_SAVE_FAILED: 'Gagal menyimpan data kehadiran',
  NOTE_SAVE_FAILED: 'Gagal menyimpan catatan',
  NETWORK_ERROR: 'Terjadi kesalahan jaringan. Silakan coba lagi.',
  VALIDATION_ERROR: 'Data yang dimasukkan tidak valid',
  UNKNOWN_ERROR: 'Terjadi kesalahan yang tidak diketahui',
  UNAUTHORIZED: 'Anda tidak memiliki akses untuk melihat detail siswa ini',
  NOT_FOUND: 'Data siswa tidak ditemukan',
} as const;
