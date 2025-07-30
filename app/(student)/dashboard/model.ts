/**
 * Student Dashboard Feature Model
 * 
 * This module contains the business logic and data models for the student dashboard.
 */

// Types
export interface StudentDashboardState {
  activeTab: string;
  modalVisible: boolean;
  modalContent: {
    title: string;
    content: React.ReactNode;
  };
  isLoading: boolean;
  error: string | null;
}

export interface StudentProgress {
  surah: string;
  percentage: number;
  versesMemorized: number;
  totalVerses: number;
}

export interface UpcomingSchedule {
  day: string;
  time: string;
  activity: string;
  description?: string;
}

export interface QuickActionItem {
  id: string;
  title: string;
  icon: string;
  variant: 'primary' | 'secondary' | 'default';
  onPress: () => void;
  testID: string;
}

// Tab configuration
export const DASHBOARD_TABS = [
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
    id: 'schedule',
    label: 'Jadwal',
    icon: 'calendar-outline',
    accessibilityLabel: 'Jadwal',
    testID: 'tab-schedule',
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
export const MOCK_STUDENT_PROGRESS: StudentProgress = {
  surah: 'Al-Baqarah',
  percentage: 60,
  versesMemorized: 120,
  totalVerses: 200,
};

export const MOCK_UPCOMING_SCHEDULE: UpcomingSchedule = {
  day: 'Senin',
  time: '08:00 - 10:00',
  activity: 'Setoran Hafalan',
  description: 'Persiapkan hafalan Al-Baqarah ayat 255-257',
};

// Business logic functions
export const calculateProgressPercentage = (memorized: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((memorized / total) * 100);
};

export const formatScheduleTime = (time: string): string => {
  return time;
};

export const getGreetingMessage = (name?: string): string => {
  const defaultName = 'Ahmad Fauzi';
  return `Assalamu'alaikum, ${name || defaultName}`;
};

// Initial state
export const initialStudentDashboardState: StudentDashboardState = {
  activeTab: 'dashboard',
  modalVisible: false,
  modalContent: {
    title: '',
    content: null,
  },
  isLoading: false,
  error: null,
};

// Constants
export const FEATURE_MESSAGES = {
  COMING_SOON: 'Fitur ini akan segera hadir!',
  MESSAGES_COMING_SOON: 'Fitur Pesan Segera Hadir',
  MESSAGES_DESCRIPTION: 'Anda akan dapat berkomunikasi dengan guru dan orang tua di sini.',
  SCHEDULE_COMING_SOON: 'Jadwal Lengkap Segera Hadir',
  SCHEDULE_DESCRIPTION: 'Anda akan dapat melihat jadwal harian, mingguan, dan bulanan di sini.',
} as const;
