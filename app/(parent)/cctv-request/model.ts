/**
 * CCTV Request Feature Model
 * 
 * This module contains the business logic and data models for the CCTV access request feature.
 * It defines types, validation schemas, and business rules specific to CCTV footage requests by parents.
 */

import { z } from 'zod';

// Types
export interface CCTVRequest {
  id?: string;
  requesterId: string;
  requesterName: string;
  requesterEmail?: string;
  requesterPhone: string;
  childName: string;
  childClass: string;
  childId?: string;
  requestType: 'incident_investigation' | 'safety_concern' | 'lost_item' | 'behavior_verification' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  reason: string;
  detailedDescription: string;
  requestedLocations: CCTVLocation[];
  requestedTimeRange: {
    startDate: Date;
    endDate: Date;
    startTime: string;
    endTime: string;
  };
  relatedIncidentId?: string;
  legalBasis: string;
  consentProvided: boolean;
  dataUsagePurpose: string;
  dataRetentionPeriod: number; // in days
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'fulfilled' | 'expired';
  reviewNotes?: string;
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  accessDetails?: {
    viewingMethod: 'on_site' | 'secure_link' | 'physical_copy';
    accessLocation?: string;
    accessDateTime?: Date;
    accessDuration?: number; // in minutes
    supervisionRequired: boolean;
    restrictions: string[];
  };
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

export interface CCTVLocation {
  id: string;
  name: string;
  description: string;
  zone: 'classroom' | 'corridor' | 'playground' | 'entrance' | 'cafeteria' | 'library' | 'parking' | 'other';
  isAvailable: boolean;
  retentionDays: number;
  requiresSpecialPermission: boolean;
}

export interface CCTVRequestState {
  isLoading: boolean;
  error: string | null;
  requests: CCTVRequest[];
  currentRequest: Partial<CCTVRequest>;
  selectedRequest: CCTVRequest | null;
  availableLocations: CCTVLocation[];
  isSubmitting: boolean;
  submitSuccess: boolean;
  filterStatus: 'all' | 'pending' | 'approved' | 'rejected' | 'fulfilled';
  sortBy: 'date' | 'priority' | 'status' | 'type';
  sortOrder: 'asc' | 'desc';
}

export interface RequestFormData {
  // Child Information
  childName: string;
  childClass: string;
  
  // Request Details
  requestType: string;
  priority: string;
  reason: string;
  detailedDescription: string;
  
  // Time and Location
  requestedLocations: string[];
  startDate: Date | null;
  endDate: Date | null;
  startTime: string;
  endTime: string;
  
  // Legal and Compliance
  legalBasis: string;
  dataUsagePurpose: string;
  dataRetentionPeriod: number;
  consentProvided: boolean;
  
  // Related Information
  relatedIncidentId?: string;
  
  // Contact Information (for non-anonymous requests)
  requesterName?: string;
  requesterEmail?: string;
  requesterPhone?: string;
}

// Validation schemas
export const cctvRequestSchema = z.object({
  requesterId: z.string().min(1, 'Requester ID is required'),
  requesterName: z.string().min(1, 'Requester name is required'),
  requesterEmail: z.string().email().optional(),
  requesterPhone: z.string().min(1, 'Phone number is required'),
  childName: z.string().min(1, 'Child name is required'),
  childClass: z.string().min(1, 'Child class is required'),
  requestType: z.enum(['incident_investigation', 'safety_concern', 'lost_item', 'behavior_verification', 'other']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
  detailedDescription: z.string().min(20, 'Detailed description must be at least 20 characters'),
  requestedLocations: z.array(z.object({
    id: z.string(),
    name: z.string(),
  })).min(1, 'At least one location must be selected'),
  requestedTimeRange: z.object({
    startDate: z.date(),
    endDate: z.date(),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  }),
  legalBasis: z.string().min(1, 'Legal basis is required'),
  consentProvided: z.boolean().refine(val => val === true, 'Consent must be provided'),
  dataUsagePurpose: z.string().min(1, 'Data usage purpose is required'),
  dataRetentionPeriod: z.number().min(1).max(90, 'Retention period cannot exceed 90 days'),
});

export const requestFormSchema = z.object({
  childName: z.string().min(1, 'Nama anak harus diisi'),
  childClass: z.string().min(1, 'Kelas anak harus diisi'),
  requestType: z.string().min(1, 'Jenis permintaan harus dipilih'),
  priority: z.string().min(1, 'Prioritas harus dipilih'),
  reason: z.string().min(10, 'Alasan minimal 10 karakter'),
  detailedDescription: z.string().min(20, 'Deskripsi detail minimal 20 karakter'),
  requestedLocations: z.array(z.string()).min(1, 'Minimal satu lokasi harus dipilih'),
  startDate: z.date({ required_error: 'Tanggal mulai harus diisi' }),
  endDate: z.date({ required_error: 'Tanggal selesai harus diisi' }),
  startTime: z.string().min(1, 'Waktu mulai harus diisi'),
  endTime: z.string().min(1, 'Waktu selesai harus diisi'),
  legalBasis: z.string().min(1, 'Dasar hukum harus diisi'),
  dataUsagePurpose: z.string().min(1, 'Tujuan penggunaan data harus diisi'),
  dataRetentionPeriod: z.number().min(1).max(90, 'Periode penyimpanan maksimal 90 hari'),
  consentProvided: z.boolean().refine(val => val === true, 'Persetujuan harus diberikan'),
});

export type CCTVRequestSchema = z.infer<typeof cctvRequestSchema>;
export type RequestFormSchema = z.infer<typeof requestFormSchema>;

// Constants
export const REQUEST_TYPES = {
  INCIDENT_INVESTIGATION: 'incident_investigation',
  SAFETY_CONCERN: 'safety_concern',
  LOST_ITEM: 'lost_item',
  BEHAVIOR_VERIFICATION: 'behavior_verification',
  OTHER: 'other',
} as const;

export const REQUEST_TYPE_LABELS = {
  incident_investigation: 'Investigasi Insiden',
  safety_concern: 'Kekhawatiran Keamanan',
  lost_item: 'Barang Hilang',
  behavior_verification: 'Verifikasi Perilaku',
  other: 'Lainnya',
} as const;

export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export const PRIORITY_LABELS = {
  low: 'Rendah',
  medium: 'Sedang',
  high: 'Tinggi',
  urgent: 'Mendesak',
} as const;

export const REQUEST_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  FULFILLED: 'fulfilled',
  EXPIRED: 'expired',
} as const;

export const STATUS_LABELS = {
  draft: 'Draft',
  submitted: 'Terkirim',
  under_review: 'Sedang Ditinjau',
  approved: 'Disetujui',
  rejected: 'Ditolak',
  fulfilled: 'Terpenuhi',
  expired: 'Kedaluwarsa',
} as const;

export const LOCATION_ZONES = {
  CLASSROOM: 'classroom',
  CORRIDOR: 'corridor',
  PLAYGROUND: 'playground',
  ENTRANCE: 'entrance',
  CAFETERIA: 'cafeteria',
  LIBRARY: 'library',
  PARKING: 'parking',
  OTHER: 'other',
} as const;

export const ZONE_LABELS = {
  classroom: 'Ruang Kelas',
  corridor: 'Koridor',
  playground: 'Lapangan',
  entrance: 'Pintu Masuk',
  cafeteria: 'Kantin',
  library: 'Perpustakaan',
  parking: 'Parkiran',
  other: 'Lainnya',
} as const;

export const LEGAL_BASIS_OPTIONS = [
  'Hak orang tua untuk memantau keamanan anak',
  'Investigasi insiden yang melibatkan anak',
  'Verifikasi klaim atau laporan',
  'Kepentingan keamanan dan keselamatan',
  'Permintaan penegak hukum',
  'Lainnya (sebutkan dalam deskripsi)',
];

export const DATA_USAGE_PURPOSES = [
  'Investigasi insiden spesifik',
  'Verifikasi laporan atau klaim',
  'Dokumentasi untuk keperluan hukum',
  'Analisis keamanan dan keselamatan',
  'Pemantauan perilaku anak',
  'Pencarian barang hilang',
];

export const VIEWING_METHODS = {
  ON_SITE: 'on_site',
  SECURE_LINK: 'secure_link',
  PHYSICAL_COPY: 'physical_copy',
} as const;

export const VIEWING_METHOD_LABELS = {
  on_site: 'Melihat di Lokasi',
  secure_link: 'Link Aman',
  physical_copy: 'Salinan Fisik',
} as const;

// Business logic functions
export const validateCCTVRequest = (data: CCTVRequest): { isValid: boolean; errors: Record<string, string> } => {
  try {
    cctvRequestSchema.parse(data);
    
    // Additional business logic validation
    if (data.requestedTimeRange.endDate <= data.requestedTimeRange.startDate) {
      return { 
        isValid: false, 
        errors: { timeRange: 'Tanggal selesai harus setelah tanggal mulai' } 
      };
    }
    
    const startTime = parseTime(data.requestedTimeRange.startTime);
    const endTime = parseTime(data.requestedTimeRange.endTime);
    
    if (endTime <= startTime) {
      return { 
        isValid: false, 
        errors: { timeRange: 'Waktu selesai harus setelah waktu mulai' } 
      };
    }
    
    // Check if request is within retention period
    const daysDiff = Math.ceil((new Date().getTime() - data.requestedTimeRange.startDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 30) { // Assuming 30 days retention
      return { 
        isValid: false, 
        errors: { timeRange: 'Rekaman CCTV hanya tersedia untuk 30 hari terakhir' } 
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

export const validateRequestForm = (data: RequestFormData): { isValid: boolean; errors: Record<string, string> } => {
  try {
    requestFormSchema.parse(data);
    
    // Additional validation
    if (data.endDate && data.startDate && data.endDate <= data.startDate) {
      return { 
        isValid: false, 
        errors: { endDate: 'Tanggal selesai harus setelah tanggal mulai' } 
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

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case PRIORITY_LEVELS.URGENT:
      return '#7C2D12'; // Dark Red
    case PRIORITY_LEVELS.HIGH:
      return '#EF4444'; // Red
    case PRIORITY_LEVELS.MEDIUM:
      return '#F59E0B'; // Yellow
    case PRIORITY_LEVELS.LOW:
      return '#10B981'; // Green
    default:
      return '#6B7280'; // Gray
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case REQUEST_STATUS.DRAFT:
      return '#6B7280'; // Gray
    case REQUEST_STATUS.SUBMITTED:
      return '#3B82F6'; // Blue
    case REQUEST_STATUS.UNDER_REVIEW:
      return '#8B5CF6'; // Purple
    case REQUEST_STATUS.APPROVED:
      return '#10B981'; // Green
    case REQUEST_STATUS.REJECTED:
      return '#EF4444'; // Red
    case REQUEST_STATUS.FULFILLED:
      return '#059669'; // Dark Green
    case REQUEST_STATUS.EXPIRED:
      return '#6B7280'; // Gray
    default:
      return '#6B7280'; // Gray
  }
};

export const formatRequestType = (type: string): string => {
  return REQUEST_TYPE_LABELS[type as keyof typeof REQUEST_TYPE_LABELS] || type;
};

export const formatPriority = (priority: string): string => {
  return PRIORITY_LABELS[priority as keyof typeof PRIORITY_LABELS] || priority;
};

export const formatStatus = (status: string): string => {
  return STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status;
};

export const formatZone = (zone: string): string => {
  return ZONE_LABELS[zone as keyof typeof ZONE_LABELS] || zone;
};

export const formatViewingMethod = (method: string): string => {
  return VIEWING_METHOD_LABELS[method as keyof typeof VIEWING_METHOD_LABELS] || method;
};

export const calculateRequestDuration = (startDate: Date, endDate: Date): number => {
  return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
};

export const isRequestExpired = (request: CCTVRequest): boolean => {
  return new Date() > request.expiresAt;
};

export const canRequestLocation = (location: CCTVLocation, requestDate: Date): boolean => {
  if (!location.isAvailable) return false;
  
  const daysSinceRequest = Math.ceil((new Date().getTime() - requestDate.getTime()) / (1000 * 60 * 60 * 24));
  return daysSinceRequest <= location.retentionDays;
};

export const filterRequestsByStatus = (requests: CCTVRequest[], status: string): CCTVRequest[] => {
  if (status === 'all') return requests;
  if (status === 'pending') {
    return requests.filter(req => 
      req.status === 'submitted' || req.status === 'under_review'
    );
  }
  return requests.filter(request => request.status === status);
};

export const sortRequests = (requests: CCTVRequest[], sortBy: string, sortOrder: string): CCTVRequest[] => {
  return [...requests].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = a.createdAt.getTime() - b.createdAt.getTime();
        break;
      case 'priority':
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      case 'type':
        comparison = a.requestType.localeCompare(b.requestType);
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });
};

// Initial state
export const initialRequestFormData: RequestFormData = {
  childName: '',
  childClass: '',
  requestType: '',
  priority: '',
  reason: '',
  detailedDescription: '',
  requestedLocations: [],
  startDate: null,
  endDate: null,
  startTime: '',
  endTime: '',
  legalBasis: '',
  dataUsagePurpose: '',
  dataRetentionPeriod: 7,
  consentProvided: false,
  relatedIncidentId: '',
  requesterName: '',
  requesterEmail: '',
  requesterPhone: '',
};

export const initialCCTVRequestState: CCTVRequestState = {
  isLoading: false,
  error: null,
  requests: [],
  currentRequest: {},
  selectedRequest: null,
  availableLocations: [],
  isSubmitting: false,
  submitSuccess: false,
  filterStatus: 'all',
  sortBy: 'date',
  sortOrder: 'desc',
};

// Mock available locations
export const mockAvailableLocations: CCTVLocation[] = [
  {
    id: '1',
    name: 'Ruang Kelas 1A',
    description: 'Kamera di ruang kelas 1A',
    zone: 'classroom',
    isAvailable: true,
    retentionDays: 30,
    requiresSpecialPermission: false,
  },
  {
    id: '2',
    name: 'Koridor Lantai 1',
    description: 'Kamera di koridor lantai 1',
    zone: 'corridor',
    isAvailable: true,
    retentionDays: 30,
    requiresSpecialPermission: false,
  },
  {
    id: '3',
    name: 'Lapangan Sekolah',
    description: 'Kamera di area lapangan',
    zone: 'playground',
    isAvailable: true,
    retentionDays: 30,
    requiresSpecialPermission: false,
  },
  {
    id: '4',
    name: 'Pintu Masuk Utama',
    description: 'Kamera di pintu masuk utama',
    zone: 'entrance',
    isAvailable: true,
    retentionDays: 30,
    requiresSpecialPermission: true,
  },
];

// Error messages
export const CCTV_REQUEST_ERRORS = {
  LOAD_FAILED: 'Gagal memuat permintaan CCTV',
  SUBMIT_FAILED: 'Gagal mengirim permintaan. Silakan coba lagi.',
  SAVE_DRAFT_FAILED: 'Gagal menyimpan draft permintaan',
  DELETE_FAILED: 'Gagal menghapus permintaan',
  NETWORK_ERROR: 'Terjadi kesalahan jaringan. Silakan coba lagi.',
  VALIDATION_ERROR: 'Data yang dimasukkan tidak valid',
  UNKNOWN_ERROR: 'Terjadi kesalahan yang tidak diketahui',
  UNAUTHORIZED: 'Anda tidak memiliki akses untuk melihat permintaan ini',
  NOT_FOUND: 'Permintaan tidak ditemukan',
  FOOTAGE_NOT_AVAILABLE: 'Rekaman CCTV tidak tersedia untuk periode yang diminta',
  LOCATION_NOT_AVAILABLE: 'Lokasi CCTV tidak tersedia',
  RETENTION_PERIOD_EXCEEDED: 'Periode penyimpanan rekaman telah terlampaui',
  CONSENT_REQUIRED: 'Persetujuan penggunaan data harus diberikan',
  INVALID_TIME_RANGE: 'Rentang waktu tidak valid',
} as const;
