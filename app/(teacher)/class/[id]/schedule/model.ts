/**
 * Class Schedule Feature Model
 * 
 * This module contains the business logic and data models for the class schedule feature.
 * It defines types, validation schemas, and business rules specific to class scheduling.
 */

import { z } from 'zod';

// Types
export interface ClassSchedule {
  id: string;
  classId: string;
  className: string;
  academicYear: string;
  semester: 'ganjil' | 'genap';
  schedule: ScheduleItem[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'inactive' | 'draft';
}

export interface ScheduleItem {
  id: string;
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string; // Format: "HH:mm"
  endTime: string; // Format: "HH:mm"
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  room: string;
  type: 'regular' | 'exam' | 'extra' | 'break';
  notes?: string;
  isRecurring: boolean;
  color?: string;
}

export interface ClassScheduleState {
  isLoading: boolean;
  error: string | null;
  schedule: ClassSchedule | null;
  selectedDay: string;
  viewMode: 'week' | 'day';
  filterType: 'all' | 'regular' | 'exam' | 'extra';
}

export interface TimeSlot {
  time: string;
  label: string;
  period: number;
}

// Validation schemas
export const scheduleItemSchema = z.object({
  dayOfWeek: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  subjectId: z.string().min(1, 'Subject ID is required'),
  subjectName: z.string().min(1, 'Subject name is required'),
  teacherId: z.string().min(1, 'Teacher ID is required'),
  teacherName: z.string().min(1, 'Teacher name is required'),
  room: z.string().min(1, 'Room is required'),
  type: z.enum(['regular', 'exam', 'extra', 'break']),
  notes: z.string().optional(),
  isRecurring: z.boolean(),
  color: z.string().optional(),
});

export const classScheduleSchema = z.object({
  classId: z.string().min(1, 'Class ID is required'),
  className: z.string().min(1, 'Class name is required'),
  academicYear: z.string().min(1, 'Academic year is required'),
  semester: z.enum(['ganjil', 'genap']),
  schedule: z.array(scheduleItemSchema),
  createdBy: z.string().min(1, 'Creator ID is required'),
  status: z.enum(['active', 'inactive', 'draft']),
});

export type ScheduleItemSchema = z.infer<typeof scheduleItemSchema>;
export type ClassScheduleSchema = z.infer<typeof classScheduleSchema>;

// Constants
export const DAYS_OF_WEEK = {
  MONDAY: 'monday',
  TUESDAY: 'tuesday',
  WEDNESDAY: 'wednesday',
  THURSDAY: 'thursday',
  FRIDAY: 'friday',
  SATURDAY: 'saturday',
  SUNDAY: 'sunday',
} as const;

export const DAY_LABELS = {
  monday: 'Senin',
  tuesday: 'Selasa',
  wednesday: 'Rabu',
  thursday: 'Kamis',
  friday: 'Jumat',
  saturday: 'Sabtu',
  sunday: 'Minggu',
} as const;

export const SCHEDULE_TYPES = {
  REGULAR: 'regular',
  EXAM: 'exam',
  EXTRA: 'extra',
  BREAK: 'break',
} as const;

export const SCHEDULE_TYPE_LABELS = {
  regular: 'Pelajaran Reguler',
  exam: 'Ujian',
  extra: 'Ekstrakurikuler',
  break: 'Istirahat',
} as const;

export const SEMESTER_LABELS = {
  ganjil: 'Semester Ganjil',
  genap: 'Semester Genap',
} as const;

export const STATUS_LABELS = {
  active: 'Aktif',
  inactive: 'Tidak Aktif',
  draft: 'Draft',
} as const;

// Default time slots for Indonesian schools
export const DEFAULT_TIME_SLOTS: TimeSlot[] = [
  { time: '07:00', label: '07:00 - 07:40', period: 1 },
  { time: '07:40', label: '07:40 - 08:20', period: 2 },
  { time: '08:20', label: '08:20 - 09:00', period: 3 },
  { time: '09:00', label: '09:00 - 09:15', period: 0 }, // Break
  { time: '09:15', label: '09:15 - 09:55', period: 4 },
  { time: '09:55', label: '09:55 - 10:35', period: 5 },
  { time: '10:35', label: '10:35 - 11:15', period: 6 },
  { time: '11:15', label: '11:15 - 11:30', period: 0 }, // Break
  { time: '11:30', label: '11:30 - 12:10', period: 7 },
  { time: '12:10', label: '12:10 - 12:50', period: 8 },
  { time: '12:50', label: '12:50 - 13:30', period: 0 }, // Lunch break
  { time: '13:30', label: '13:30 - 14:10', period: 9 },
  { time: '14:10', label: '14:10 - 14:50', period: 10 },
];

export const SCHEDULE_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#84CC16', // Lime
  '#EC4899', // Pink
  '#6B7280', // Gray
];

// Business logic functions
export const validateScheduleItem = (data: ScheduleItem): { isValid: boolean; errors: Record<string, string> } => {
  try {
    scheduleItemSchema.parse(data);
    
    // Additional business logic validation
    const startTime = parseTime(data.startTime);
    const endTime = parseTime(data.endTime);
    
    if (endTime <= startTime) {
      return { 
        isValid: false, 
        errors: { time: 'Waktu selesai harus setelah waktu mulai' } 
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

export const parseTime = (timeString: string): number => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

export const formatTimeRange = (startTime: string, endTime: string): string => {
  return `${startTime} - ${endTime}`;
};

export const getDayLabel = (day: string): string => {
  return DAY_LABELS[day as keyof typeof DAY_LABELS] || day;
};

export const getScheduleTypeLabel = (type: string): string => {
  return SCHEDULE_TYPE_LABELS[type as keyof typeof SCHEDULE_TYPE_LABELS] || type;
};

export const getSemesterLabel = (semester: string): string => {
  return SEMESTER_LABELS[semester as keyof typeof SEMESTER_LABELS] || semester;
};

export const getStatusLabel = (status: string): string => {
  return STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status;
};

export const getScheduleForDay = (schedule: ScheduleItem[], day: string): ScheduleItem[] => {
  return schedule
    .filter(item => item.dayOfWeek === day)
    .sort((a, b) => parseTime(a.startTime) - parseTime(b.startTime));
};

export const checkTimeConflict = (schedule: ScheduleItem[], newItem: ScheduleItem): boolean => {
  const daySchedule = getScheduleForDay(schedule, newItem.dayOfWeek);
  const newStart = parseTime(newItem.startTime);
  const newEnd = parseTime(newItem.endTime);
  
  return daySchedule.some(item => {
    if (item.id === newItem.id) return false; // Skip self when editing
    
    const itemStart = parseTime(item.startTime);
    const itemEnd = parseTime(item.endTime);
    
    return (newStart < itemEnd && newEnd > itemStart);
  });
};

export const generateScheduleColor = (index: number): string => {
  return SCHEDULE_COLORS[index % SCHEDULE_COLORS.length];
};

export const filterScheduleByType = (schedule: ScheduleItem[], type: string): ScheduleItem[] => {
  if (type === 'all') return schedule;
  return schedule.filter(item => item.type === type);
};

// Initial state
export const initialClassScheduleState: ClassScheduleState = {
  isLoading: false,
  error: null,
  schedule: null,
  selectedDay: DAYS_OF_WEEK.MONDAY,
  viewMode: 'week',
  filterType: 'all',
};

// Error messages
export const SCHEDULE_ERRORS = {
  LOAD_FAILED: 'Gagal memuat jadwal kelas',
  SAVE_FAILED: 'Gagal menyimpan jadwal',
  DELETE_FAILED: 'Gagal menghapus jadwal',
  TIME_CONFLICT: 'Terdapat konflik waktu dengan jadwal lain',
  INVALID_TIME: 'Format waktu tidak valid',
  NETWORK_ERROR: 'Terjadi kesalahan jaringan. Silakan coba lagi.',
  VALIDATION_ERROR: 'Data yang dimasukkan tidak valid',
  UNKNOWN_ERROR: 'Terjadi kesalahan yang tidak diketahui',
  UNAUTHORIZED: 'Anda tidak memiliki akses untuk mengubah jadwal ini',
  NOT_FOUND: 'Jadwal tidak ditemukan',
} as const;
