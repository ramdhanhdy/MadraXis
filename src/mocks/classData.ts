// Mock data for class information and students
// This file contains sample data used for development and testing purposes

import { Class, Student } from '@types';

export interface ClassScheduleItem {
  id?: number;
  day: string;
  time: string;
  activity: string;
  note?: string;
}

export interface Activity {
  type: 'attendance' | 'memorization' | 'report';
  description: string;
  date: string;
}

export interface Report {
  id: number;
  title: string;
  date: string;
  type: 'academic' | 'behavior' | 'attendance';
  content?: string;
  description?: string;
  status: 'draft' | 'published';
}

/**
 * Represents the rich data structure for a class view, combining the
 * canonical Class type with related data like students and schedule.
 */
export interface MockClassViewData extends Class {
  students: Student[];
  schedule: ClassScheduleItem[];
  recentActivities: Activity[];
  reports: Report[];
}

export const mockClassData: MockClassViewData[] = [
  {
    id: 1,
    name: 'Tahfidz Al-Baqarah',
    level: 'Menengah',
    description: 'Kelas fokus pada hafalan Surah Al-Baqarah dengan penekanan pada tajwid dan makna.',
    status: 'active',
    student_capacity: 30,
    student_count: 5,
    subject_count: 1,
    teacher_count: 1,
    academic_year: '2023/2024',
    semester: '1',
    school_id: 1,
    created_by: 'uuid-teacher-1',
    created_at: '2023-08-01T09:00:00Z',
    updated_at: '2023-08-01T09:00:00Z',
    students: [
      { 
        id: 'uuid-student-1', 
        full_name: 'Ahmad Fauzi',
        role: 'student' as const,
        school_id: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z',
        quran_progress: {
          memorized_verses: 150,
          total_verses: 286,
        }
      },
      { 
        id: 'uuid-student-2', 
        full_name: 'Fatimah Zahra',
        role: 'student' as const,
        school_id: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-14T00:00:00Z',
        quran_progress: {
          memorized_verses: 180,
          total_verses: 286,
        }
      },
      { 
        id: 'uuid-student-3', 
        full_name: 'Muhammad Ali',
        role: 'student' as const,
        school_id: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-13T00:00:00Z',
        quran_progress: {
          memorized_verses: 120,
          total_verses: 286,
        }
      },
      { 
        id: 'uuid-student-4', 
        full_name: 'Siti Aisyah',
        role: 'student' as const,
        school_id: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z',
        quran_progress: {
          memorized_verses: 160,
          total_verses: 286,
        }
      },
      { 
        id: 'uuid-student-5', 
        full_name: 'Omar bin Khattab',
        role: 'student' as const,
        school_id: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-12T00:00:00Z',
        quran_progress: {
          memorized_verses: 140,
          total_verses: 286,
        }
      },
    ],
    schedule: [
      { day: 'Senin', time: '08:00-09:30', activity: 'Hafalan Baru', note: 'Ayat 1-10' },
      { day: 'Rabu', time: '08:00-09:30', activity: 'Muraja\'ah', note: 'Review hafalan minggu lalu' },
      { day: 'Jumat', time: '08:00-09:30', activity: 'Evaluasi', note: 'Tes hafalan bulanan' },
    ],
    recentActivities: [
      { type: 'attendance', description: 'Kehadiran siswa 95%', date: '2024-01-15' },
      { type: 'memorization', description: 'Ahmad Fauzi menyelesaikan ayat 150-160', date: '2024-01-14' },
      { type: 'report', description: 'Laporan bulanan telah dibuat', date: '2024-01-13' },
    ],
    reports: [
      {
         id: 1,
         title: 'Laporan Bulanan Januari 2024',
         date: '2024-01-31',
         type: 'academic',
         description: 'Progress hafalan siswa sangat baik dengan rata-rata 75%',
         status: 'published'
       },
       {
         id: 2,
         title: 'Evaluasi Tengah Semester',
         date: '2024-01-15',
         type: 'behavior',
         description: 'Evaluasi kemampuan hafalan dan tajwid siswa',
         status: 'published'
       },
       {
         id: 3,
         title: 'Laporan Mingguan 3',
         date: '2024-01-21',
         type: 'attendance',
         description: 'Kehadiran 95%, progress hafalan baik',
         status: 'draft'
       },
    ],
  },
  {
    id: 2,
    name: 'Tahfidz Al-Imran',
    level: 'Lanjutan',
    description: 'Kelas lanjutan untuk hafalan Surah Al-Imran dengan fokus pada pemahaman makna.',
    status: 'active',
    student_capacity: 25,
    student_count: 1,
    subject_count: 1,
    teacher_count: 1,
    academic_year: '2023/2024',
    semester: '1',
    school_id: 1,
    created_by: 'uuid-teacher-2',
    created_at: '2023-08-01T10:00:00Z',
    updated_at: '2023-08-01T10:00:00Z',
    students: [
      { 
        id: 'uuid-student-6', 
        full_name: 'Khadijah binti Khuwailid',
        role: 'student' as const,
        school_id: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z',
        quran_progress: {
          memorized_verses: 100,
          total_verses: 200,
        }
      },
    ],
    schedule: [
      { day: 'Selasa', time: '10:00-11:30', activity: 'Hafalan Baru', note: 'Ayat 1-5' },
      { day: 'Kamis', time: '10:00-11:30', activity: 'Muraja\'ah', note: 'Review hafalan' },
    ],
    recentActivities: [
      { type: 'attendance', description: 'Kehadiran siswa 90%', date: '2024-01-15' },
      { type: 'memorization', description: 'Khadijah menyelesaikan ayat 95-100', date: '2024-01-14' },
    ],
    reports: [
       {
          id: 4,
          title: 'Laporan Bulanan Januari 2024',
          date: '2024-01-31',
          type: 'academic',
          description: 'Progress hafalan siswa cukup baik dengan rata-rata 67%',
          status: 'published'
        },
     ],
   },
];