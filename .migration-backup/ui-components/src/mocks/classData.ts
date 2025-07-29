// Mock data for class information and students
// This file contains sample data used for development and testing purposes

export interface Student {
  id: number;
  name: string;
  full_name: string;
  role: 'student';
  school_id: number;
  created_at: string;
  updated_at: string;
  memorizedVerses: number;
  totalVerses: number;
  lastActivity: string;
  progress: number;
}

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

export interface ClassData {
  id: number;
  name: string;
  level: string;
  description?: string;
  studentCount: number;
  progress?: number;
  students?: Student[];
  schedule?: ClassScheduleItem[];
  recentActivities?: Activity[];
  reports?: Report[];
}

export const mockClassData: ClassData[] = [
  {
    id: 1,
    name: 'Tahfidz Al-Baqarah',
    level: 'Menengah',
    description: 'Kelas fokus pada hafalan Surah Al-Baqarah dengan penekanan pada tajwid dan makna.',
    studentCount: 25,
    progress: 75,
    students: [
      { 
        id: 1, 
        name: 'Ahmad Fauzi',
        full_name: 'Ahmad Fauzi',
        role: 'student' as const,
        school_id: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z',
        memorizedVerses: 150, 
        totalVerses: 200, 
        lastActivity: '2024-01-15',
        progress: 75 
      },
      { 
        id: 2, 
        name: 'Fatimah Zahra',
        full_name: 'Fatimah Zahra',
        role: 'student' as const,
        school_id: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-14T00:00:00Z',
        memorizedVerses: 180, 
        totalVerses: 200, 
        lastActivity: '2024-01-14',
        progress: 90 
      },
      { 
        id: 3, 
        name: 'Muhammad Ali',
        full_name: 'Muhammad Ali',
        role: 'student' as const,
        school_id: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-13T00:00:00Z',
        memorizedVerses: 120, 
        totalVerses: 200, 
        lastActivity: '2024-01-13',
        progress: 60 
      },
      { 
        id: 4, 
        name: 'Siti Aisyah',
        full_name: 'Siti Aisyah',
        role: 'student' as const,
        school_id: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z',
        memorizedVerses: 160, 
        totalVerses: 200, 
        lastActivity: '2024-01-15',
        progress: 80 
      },
      { 
        id: 5, 
        name: 'Omar bin Khattab',
        full_name: 'Omar bin Khattab',
        role: 'student' as const,
        school_id: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-12T00:00:00Z',
        memorizedVerses: 140, 
        totalVerses: 200, 
        lastActivity: '2024-01-12',
        progress: 70 
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
    studentCount: 20,
    progress: 67,
    students: [
      { 
        id: 6, 
        name: 'Khadijah binti Khuwailid',
        full_name: 'Khadijah binti Khuwailid',
        role: 'student' as const,
        school_id: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z',
        memorizedVerses: 100, 
        totalVerses: 150, 
        lastActivity: '2024-01-15',
        progress: 67 
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