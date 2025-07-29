/**
 * Quran Progress Feature Model
 * 
 * This module contains the business logic and data models for the Quran progress feature.
 * It defines types, validation schemas, and business rules specific to Quran memorization tracking.
 */

import { z } from 'zod';

// Types
export interface QuranProgressData {
  studentId: string;
  surahName: string;
  ayahFrom: number;
  ayahTo: number;
  memorizedDate: Date;
  reviewDate?: Date;
  status: 'memorized' | 'reviewing' | 'mastered';
  notes?: string;
}

export interface QuranProgressState {
  isLoading: boolean;
  error: string | null;
  progressData: QuranProgressData[];
  selectedSurah?: string;
  filterStatus?: 'all' | 'memorized' | 'reviewing' | 'mastered';
}

// Validation schemas
export const quranProgressSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  surahName: z.string().min(1, 'Surah name is required'),
  ayahFrom: z.number().min(1, 'Starting ayah must be at least 1'),
  ayahTo: z.number().min(1, 'Ending ayah must be at least 1'),
  memorizedDate: z.date(),
  reviewDate: z.date().optional(),
  status: z.enum(['memorized', 'reviewing', 'mastered']),
  notes: z.string().optional(),
});

export type QuranProgressSchema = z.infer<typeof quranProgressSchema>;

// Constants
export const PROGRESS_STATUS = {
  MEMORIZED: 'memorized',
  REVIEWING: 'reviewing', 
  MASTERED: 'mastered',
} as const;

export const STATUS_DISPLAY_NAMES = {
  memorized: 'Hafal',
  reviewing: 'Muraja\'ah',
  mastered: 'Lancar',
} as const;

export const COMMON_SURAHS = [
  'Al-Fatihah',
  'Al-Baqarah',
  'Ali \'Imran',
  'An-Nisa\'',
  'Al-Ma\'idah',
  'Al-An\'am',
  'Al-A\'raf',
  'Al-Anfal',
  'At-Tawbah',
  'Yunus',
] as const;

// Business logic functions
export const validateProgressData = (data: QuranProgressData): { isValid: boolean; errors: Record<string, string> } => {
  try {
    quranProgressSchema.parse(data);
    
    // Additional business logic validation
    if (data.ayahFrom > data.ayahTo) {
      return { 
        isValid: false, 
        errors: { ayahRange: 'Ayat awal tidak boleh lebih besar dari ayat akhir' } 
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

export const formatProgressStatus = (status: string): string => {
  return STATUS_DISPLAY_NAMES[status as keyof typeof STATUS_DISPLAY_NAMES] || status;
};

export const calculateProgressPercentage = (progressData: QuranProgressData[]): number => {
  if (progressData.length === 0) return 0;
  
  const masteredCount = progressData.filter(item => item.status === 'mastered').length;
  return Math.round((masteredCount / progressData.length) * 100);
};

export const getProgressByStatus = (progressData: QuranProgressData[], status: string) => {
  return progressData.filter(item => item.status === status);
};

// Initial state
export const initialQuranProgressState: QuranProgressState = {
  isLoading: false,
  error: null,
  progressData: [],
  selectedSurah: undefined,
  filterStatus: 'all',
};

// Error messages
export const PROGRESS_ERRORS = {
  LOAD_FAILED: 'Gagal memuat data progress hafalan',
  SAVE_FAILED: 'Gagal menyimpan data progress',
  NETWORK_ERROR: 'Terjadi kesalahan jaringan. Silakan coba lagi.',
  VALIDATION_ERROR: 'Data yang dimasukkan tidak valid',
  UNKNOWN_ERROR: 'Terjadi kesalahan yang tidak diketahui',
} as const;

// Mock data for development
export const mockProgressData: QuranProgressData[] = [
  {
    studentId: '1',
    surahName: 'Al-Fatihah',
    ayahFrom: 1,
    ayahTo: 7,
    memorizedDate: new Date('2024-01-15'),
    reviewDate: new Date('2024-01-20'),
    status: 'mastered',
    notes: 'Sudah lancar dan hafal dengan baik',
  },
  {
    studentId: '1',
    surahName: 'Al-Baqarah',
    ayahFrom: 1,
    ayahTo: 5,
    memorizedDate: new Date('2024-01-22'),
    status: 'reviewing',
    notes: 'Perlu lebih banyak muraja\'ah',
  },
];
