/**
 * Boarding Info Feature Model
 * 
 * This module contains the business logic and data models for the boarding information feature.
 * It defines types, validation schemas, and business rules specific to dormitory information.
 */

import { z } from 'zod';

// Types
export interface BoardingInfoData {
  studentId: string;
  dormitoryName: string;
  roomNumber: string;
  bedNumber?: string;
  roommates: string[];
  supervisor: {
    name: string;
    phone: string;
    email?: string;
  };
  facilities: string[];
  rules: string[];
  checkInDate: Date;
  checkOutDate?: Date;
}

export interface BoardingInfoState {
  isLoading: boolean;
  error: string | null;
  boardingInfo: BoardingInfoData | null;
  facilities: string[];
  rules: string[];
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  isEmergency: boolean;
}

// Validation schemas
export const boardingInfoSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  dormitoryName: z.string().min(1, 'Dormitory name is required'),
  roomNumber: z.string().min(1, 'Room number is required'),
  bedNumber: z.string().optional(),
  roommates: z.array(z.string()),
  supervisor: z.object({
    name: z.string().min(1, 'Supervisor name is required'),
    phone: z.string().min(1, 'Supervisor phone is required'),
    email: z.string().email().optional(),
  }),
  facilities: z.array(z.string()),
  rules: z.array(z.string()),
  checkInDate: z.date(),
  checkOutDate: z.date().optional(),
});

export type BoardingInfoSchema = z.infer<typeof boardingInfoSchema>;

// Constants
export const COMMON_FACILITIES = [
  'WiFi',
  'AC',
  'Lemari',
  'Meja Belajar',
  'Kamar Mandi Dalam',
  'Kamar Mandi Luar',
  'Dapur Bersama',
  'Ruang Belajar',
  'Musholla',
  'Laundry',
] as const;

export const COMMON_RULES = [
  'Tidak boleh keluar asrama tanpa izin',
  'Jam malam pukul 22:00 WIB',
  'Wajib mengikuti sholat berjamaah',
  'Tidak boleh membawa tamu tanpa izin',
  'Menjaga kebersihan kamar',
  'Tidak boleh merokok',
  'Tidak boleh membawa makanan ke kamar',
  'Wajib mengikuti piket kebersihan',
] as const;

export const DORMITORY_TYPES = {
  MALE: 'Asrama Putra',
  FEMALE: 'Asrama Putri',
  MIXED: 'Asrama Campuran',
} as const;

// Business logic functions
export const validateBoardingInfo = (data: BoardingInfoData): { isValid: boolean; errors: Record<string, string> } => {
  try {
    boardingInfoSchema.parse(data);
    
    // Additional business logic validation
    if (data.checkOutDate && data.checkOutDate <= data.checkInDate) {
      return { 
        isValid: false, 
        errors: { checkOutDate: 'Tanggal keluar harus setelah tanggal masuk' } 
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

export const formatPhoneNumber = (phone: string): string => {
  // Simple phone number formatting for Indonesian numbers
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('62')) {
    return `+${cleaned}`;
  } else if (cleaned.startsWith('0')) {
    return `+62${cleaned.substring(1)}`;
  }
  return `+62${cleaned}`;
};

export const calculateStayDuration = (checkIn: Date, checkOut?: Date): string => {
  const endDate = checkOut || new Date();
  const diffTime = Math.abs(endDate.getTime() - checkIn.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 30) {
    return `${diffDays} hari`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} bulan`;
  } else {
    const years = Math.floor(diffDays / 365);
    const remainingMonths = Math.floor((diffDays % 365) / 30);
    return remainingMonths > 0 ? `${years} tahun ${remainingMonths} bulan` : `${years} tahun`;
  }
};

// Initial state
export const initialBoardingInfoState: BoardingInfoState = {
  isLoading: false,
  error: null,
  boardingInfo: null,
  facilities: [...COMMON_FACILITIES],
  rules: [...COMMON_RULES],
};

// Error messages
export const BOARDING_ERRORS = {
  LOAD_FAILED: 'Gagal memuat informasi asrama',
  SAVE_FAILED: 'Gagal menyimpan informasi asrama',
  NETWORK_ERROR: 'Terjadi kesalahan jaringan. Silakan coba lagi.',
  VALIDATION_ERROR: 'Data yang dimasukkan tidak valid',
  UNKNOWN_ERROR: 'Terjadi kesalahan yang tidak diketahui',
  NOT_FOUND: 'Informasi asrama tidak ditemukan',
} as const;

// Mock data for development
export const mockBoardingInfo: BoardingInfoData = {
  studentId: '1',
  dormitoryName: 'Asrama Putra Al-Hikmah',
  roomNumber: 'A-201',
  bedNumber: '2',
  roommates: ['Ahmad Fauzi', 'Budi Santoso'],
  supervisor: {
    name: 'Ustadz Abdullah',
    phone: '+6281234567890',
    email: 'abdullah@zaidsync.com',
  },
  facilities: [
    'WiFi',
    'AC',
    'Lemari',
    'Meja Belajar',
    'Kamar Mandi Dalam',
    'Musholla',
  ],
  rules: [
    'Tidak boleh keluar asrama tanpa izin',
    'Jam malam pukul 22:00 WIB',
    'Wajib mengikuti sholat berjamaah',
    'Menjaga kebersihan kamar',
  ],
  checkInDate: new Date('2024-01-15'),
};

export const mockEmergencyContacts: EmergencyContact[] = [
  {
    name: 'Ustadz Abdullah',
    relationship: 'Pengawas Asrama',
    phone: '+6281234567890',
    isEmergency: true,
  },
  {
    name: 'Security Asrama',
    relationship: 'Keamanan',
    phone: '+6281234567891',
    isEmergency: true,
  },
  {
    name: 'Klinik Sekolah',
    relationship: 'Kesehatan',
    phone: '+6281234567892',
    isEmergency: true,
  },
];
