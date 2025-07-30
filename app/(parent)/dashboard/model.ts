/**
 * Parent Dashboard Feature Model
 * 
 * This module contains the business logic and data models for the parent dashboard.
 */

// Types
export interface ParentDashboardState {
  activeTab: string;
  studentData: StudentData | null;
  activities: ActivityItem[];
  events: EventItem[];
  isLoading: boolean;
  error: string | null;
}

export interface ActivityItem {
  id: number;
  type: 'academic' | 'quran' | 'dorm';
  title: string;
  score?: string;
  progress?: string;
  status?: string;
  date: string;
}

export interface EventItem {
  id: number;
  title: string;
  date: string;
  time: string;
}

export interface StudentData {
  name: string;
  grade: string;
  class: string;
  dorm: string;
}

// Tab configuration
export const PARENT_DASHBOARD_TABS = [
  {
    id: 'dashboard',
    label: 'Beranda',
    icon: 'home-outline',
    accessibilityLabel: 'Beranda',
    testID: 'tab-dashboard',
  },
  {
    id: 'messages',
    label: 'Pesan',
    icon: 'chatbubble-outline',
    accessibilityLabel: 'Pesan',
    testID: 'tab-messages',
  },
  {
    id: 'reports',
    label: 'Laporan',
    icon: 'document-text-outline',
    accessibilityLabel: 'Laporan',
    testID: 'tab-reports',
  },
  {
    id: 'profile',
    label: 'Profil',
    icon: 'person-outline',
    accessibilityLabel: 'Profil',
    testID: 'tab-profile',
  },
] as const;

// Mock data - in real app this would come from API
export const MOCK_STUDENT_DATA: StudentData = {
  name: 'Ahmad Fauzi',
  grade: 'Kelas 7',
  class: 'A',
  dorm: 'Asrama Putra Blok A',
};

export const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: 1,
    type: 'quran',
    title: 'Setoran Hafalan Al-Baqarah',
    progress: '85%',
    date: '2024-01-15',
  },
  {
    id: 2,
    type: 'academic',
    title: 'Ujian Matematika',
    score: '88',
    date: '2024-01-14',
  },
  {
    id: 3,
    type: 'dorm',
    title: 'Kegiatan Asrama',
    status: 'Hadir',
    date: '2024-01-13',
  },
];

export const MOCK_EVENTS: EventItem[] = [
  {
    id: 1,
    title: 'Pertemuan Orang Tua',
    date: '2024-01-20',
    time: '09:00',
  },
  {
    id: 2,
    title: 'Wisuda Tahfidz',
    date: '2024-01-25',
    time: '08:00',
  },
];

// Business logic functions
export const getActivityIcon = (type: ActivityItem['type']): string => {
  switch (type) {
    case 'academic':
      return 'book';
    case 'quran':
      return 'book-open';
    case 'dorm':
      return 'home';
    default:
      return 'list';
  }
};

export const formatActivityDisplay = (activity: ActivityItem): string => {
  if (activity.score) return activity.score;
  if (activity.progress) return activity.progress;
  if (activity.status) return activity.status;
  return '';
};

export const getGreetingMessage = (name?: string): string => {
  const defaultName = 'Bapak/Ibu';
  return `Assalamu'alaikum, ${name || defaultName}`;
};

// Initial state
export const initialParentDashboardState: ParentDashboardState = {
  activeTab: 'dashboard',
  studentData: null,
  activities: [],
  events: [],
  isLoading: false,
  error: null,
};

// Constants
export const FEATURE_MESSAGES = {
  LOADING_DATA: 'Memuat data dashboard...',
  MESSAGES_COMING_SOON: 'Fitur Pesan Segera Hadir',
  MESSAGES_DESCRIPTION: 'Anda akan dapat berkomunikasi dengan guru dan pihak sekolah di sini.',
  REPORTS_COMING_SOON: 'Laporan Lengkap Segera Hadir',
  REPORTS_DESCRIPTION: 'Anda akan dapat melihat laporan akademik dan perkembangan anak di sini.',
  PROFILE_COMING_SOON: 'Profil Segera Hadir',
  PROFILE_DESCRIPTION: 'Pengaturan profil dan akun akan tersedia di sini.',
  NO_ACTIVITIES: 'Belum ada aktivitas',
  NO_ACTIVITIES_DESCRIPTION: 'Aktivitas anak akan muncul di sini',
  NO_EVENTS: 'Belum ada acara',
  NO_EVENTS_DESCRIPTION: 'Acara sekolah akan muncul di sini',
} as const;
