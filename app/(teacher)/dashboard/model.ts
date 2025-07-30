/**
 * Teacher Dashboard Feature Model
 * 
 * This module contains the business logic and data models for the teacher dashboard feature.
 * It defines types, validation schemas, and business rules specific to teacher dashboard functionality.
 */

import { z } from 'zod';
import { Ionicons } from '@expo/vector-icons';

// Icon types for proper typing
export type IoniconsIcon = keyof typeof Ionicons.glyphMap;

// Types
export interface ActivityItem {
  id: number;
  title: string;
  detail: string;
  time: string;
  icon: IoniconsIcon;
}

export interface TeacherScheduleItem {
  day: string;
  date: string;
  time: string;
  activity: string;
  note: string;
}

export interface TeacherData {
  name: string;
  email?: string;
  phone?: string;
  subjects?: string[];
  classes?: string[];
}

export interface QuickActionItem {
  title: string;
  icon: IoniconsIcon;
  onPress: () => void;
  variant: 'primary' | 'secondary';
}

export interface HeaderAction {
  icon: IoniconsIcon;
  onPress: () => void;
  badge?: number;
  accessibilityLabel: string;
}

export interface TabItem {
  id: string;
  label: string;
  icon: IoniconsIcon;
}

export interface TeacherDashboardState {
  isLoading: boolean;
  error: string | null;
  schoolName: string;
  activeTab: string;
  activities: ActivityItem[];
  upcomingSchedule: TeacherScheduleItem | null;
  teacherData: TeacherData;
}

// Validation schemas
export const activityItemSchema = z.object({
  id: z.number(),
  title: z.string().min(1, 'Activity title is required'),
  detail: z.string().min(1, 'Activity detail is required'),
  time: z.string().min(1, 'Activity time is required'),
  icon: z.string(),
});

export const teacherScheduleSchema = z.object({
  day: z.string().min(1, 'Day is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  activity: z.string().min(1, 'Activity is required'),
  note: z.string().min(1, 'Note is required'),
});

export const teacherDataSchema = z.object({
  name: z.string().min(1, 'Teacher name is required'),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  subjects: z.array(z.string()).optional(),
  classes: z.array(z.string()).optional(),
});

export type ActivityItemSchema = z.infer<typeof activityItemSchema>;
export type TeacherScheduleSchema = z.infer<typeof teacherScheduleSchema>;
export type TeacherDataSchema = z.infer<typeof teacherDataSchema>;

// Constants
export const DASHBOARD_TABS = {
  DASHBOARD: 'dashboard',
  STUDENTS: 'students',
  CLASSES: 'classes',
  HAFALAN: 'hafalan',
  PROFILE: 'profile',
} as const;

export const TAB_LABELS = {
  dashboard: 'Dashboard',
  students: 'Siswa',
  classes: 'Kelas',
  hafalan: 'Hafalan',
  profile: 'Profil',
} as const;

export const QUICK_ACTION_TYPES = {
  STUDENTS: 'students',
  CLASSES: 'classes',
  HAFALAN: 'hafalan',
  COMMUNICATION: 'communication',
  BOARDING: 'boarding',
  INCIDENT: 'incident',
  REPORTS: 'reports',
  PROFILE: 'profile',
} as const;

// Business logic functions
export const validateActivity = (data: ActivityItem): { isValid: boolean; errors: Record<string, string> } => {
  try {
    activityItemSchema.parse(data);
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

export const validateTeacherSchedule = (data: TeacherScheduleItem): { isValid: boolean; errors: Record<string, string> } => {
  try {
    teacherScheduleSchema.parse(data);
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

export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Baru saja';
  if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} hari yang lalu`;
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  return `${diffInWeeks} minggu yang lalu`;
};

export const formatIndonesianDate = (date: Date): string => {
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getGreetingMessage = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Selamat pagi';
  if (hour < 15) return 'Selamat siang';
  if (hour < 18) return 'Selamat sore';
  return 'Selamat malam';
};

export const sortActivitiesByTime = (activities: ActivityItem[]): ActivityItem[] => {
  return [...activities].sort((a, b) => a.id - b.id); // Simple sort by ID for now
};

// Initial state
export const initialTeacherDashboardState: TeacherDashboardState = {
  isLoading: false,
  error: null,
  schoolName: 'Zaid Bin Tsabit',
  activeTab: DASHBOARD_TABS.DASHBOARD,
  activities: [],
  upcomingSchedule: null,
  teacherData: {
    name: 'Ustadz Guru',
  },
};

// Mock data for development
export const mockActivities: ActivityItem[] = [
  {
    id: 1,
    title: 'Ahmad Fauzi menyelesaikan hafalan Al-Baqarah 255-257',
    detail: 'Al-Baqarah 255-257',
    time: '10 menit yang lalu',
    icon: 'checkmark-circle-outline' as IoniconsIcon,
  },
  {
    id: 2,
    title: 'Budi Santoso belum menyetorkan hafalan minggu ini',
    detail: 'Minggu ini',
    time: '2 jam yang lalu',
    icon: 'alert-circle-outline' as IoniconsIcon,
  },
  {
    id: 3,
    title: 'Jadwal kelas Tahfidz Al-Baqarah telah diperbarui',
    detail: 'Jadwal Tahfidz',
    time: '1 hari yang lalu',
    icon: 'calendar-outline' as IoniconsIcon,
  },
];

export const mockUpcomingSchedule: TeacherScheduleItem = {
  day: 'Senin',
  date: new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }),
  time: '08:00 - 10:00',
  activity: 'Kelas Tahfidz Al-Baqarah',
  note: 'Setoran hafalan Al-Baqarah ayat 255-257',
};

// Error messages
export const DASHBOARD_ERRORS = {
  LOAD_FAILED: 'Gagal memuat data dashboard',
  NETWORK_ERROR: 'Terjadi kesalahan jaringan. Silakan coba lagi.',
  VALIDATION_ERROR: 'Data yang dimasukkan tidak valid',
  UNKNOWN_ERROR: 'Terjadi kesalahan yang tidak diketahui',
  SCHOOL_LOAD_FAILED: 'Gagal memuat informasi sekolah',
  ACTIVITIES_LOAD_FAILED: 'Gagal memuat aktivitas terbaru',
  SCHEDULE_LOAD_FAILED: 'Gagal memuat jadwal mendatang',
} as const;
