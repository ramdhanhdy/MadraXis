/**
 * Incident Report Feature Model
 * 
 * This module contains the business logic and data models for the incident reporting feature.
 * It defines types, validation schemas, and business rules specific to incident reporting.
 */

import { z } from 'zod';

// Types
export interface IncidentReport {
  id?: string;
  reporterId: string;
  reporterName: string;
  reporterEmail?: string;
  reporterPhone?: string;
  incidentType: 'bullying' | 'violence' | 'theft' | 'vandalism' | 'harassment' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: string;
  dateTime: Date;
  witnesses: string[];
  involvedParties: string[];
  evidence: {
    photos: string[];
    videos: string[];
    documents: string[];
  };
  isAnonymous: boolean;
  status: 'draft' | 'submitted' | 'under_review' | 'investigating' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  assignedTo?: string;
  resolution?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IncidentReportState {
  isLoading: boolean;
  error: string | null;
  reports: IncidentReport[];
  currentReport: Partial<IncidentReport>;
  isSubmitting: boolean;
  submitSuccess: boolean;
}

export interface IncidentFormData {
  incidentType: string;
  severity: string;
  title: string;
  description: string;
  location: string;
  dateTime: Date;
  witnesses: string[];
  involvedParties: string[];
  isAnonymous: boolean;
  reporterName?: string;
  reporterEmail?: string;
  reporterPhone?: string;
}

// Validation schemas
export const incidentReportSchema = z.object({
  reporterId: z.string().min(1, 'Reporter ID is required'),
  reporterName: z.string().min(1, 'Reporter name is required'),
  reporterEmail: z.string().email().optional(),
  reporterPhone: z.string().optional(),
  incidentType: z.enum(['bullying', 'violence', 'theft', 'vandalism', 'harassment', 'other']),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  location: z.string().min(1, 'Location is required'),
  dateTime: z.date(),
  witnesses: z.array(z.string()),
  involvedParties: z.array(z.string()),
  isAnonymous: z.boolean(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']),
});

export const incidentFormSchema = z.object({
  incidentType: z.string().min(1, 'Jenis insiden harus dipilih'),
  severity: z.string().min(1, 'Tingkat keparahan harus dipilih'),
  title: z.string().min(5, 'Judul minimal 5 karakter'),
  description: z.string().min(20, 'Deskripsi minimal 20 karakter'),
  location: z.string().min(1, 'Lokasi harus diisi'),
  dateTime: z.date(),
  witnesses: z.array(z.string()),
  involvedParties: z.array(z.string()),
  isAnonymous: z.boolean(),
  reporterName: z.string().optional(),
  reporterEmail: z.string().email('Format email tidak valid').optional(),
  reporterPhone: z.string().optional(),
});

export type IncidentReportSchema = z.infer<typeof incidentReportSchema>;
export type IncidentFormSchema = z.infer<typeof incidentFormSchema>;

// Constants
export const INCIDENT_TYPES = {
  BULLYING: 'bullying',
  VIOLENCE: 'violence',
  THEFT: 'theft',
  VANDALISM: 'vandalism',
  HARASSMENT: 'harassment',
  OTHER: 'other',
} as const;

export const SEVERITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export const INCIDENT_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  INVESTIGATING: 'investigating',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
} as const;

export const INCIDENT_TYPE_LABELS = {
  bullying: 'Perundungan',
  violence: 'Kekerasan',
  theft: 'Pencurian',
  vandalism: 'Vandalisme',
  harassment: 'Pelecehan',
  other: 'Lainnya',
} as const;

export const SEVERITY_LABELS = {
  low: 'Ringan',
  medium: 'Sedang',
  high: 'Berat',
  critical: 'Kritis',
} as const;

export const STATUS_LABELS = {
  draft: 'Draft',
  submitted: 'Terkirim',
  under_review: 'Sedang Ditinjau',
  investigating: 'Sedang Diselidiki',
  resolved: 'Terselesaikan',
  closed: 'Ditutup',
} as const;

// Business logic functions
export const validateIncidentReport = (data: IncidentReport): { isValid: boolean; errors: Record<string, string> } => {
  try {
    incidentReportSchema.parse(data);
    
    // Additional business logic validation
    if (data.dateTime > new Date()) {
      return { 
        isValid: false, 
        errors: { dateTime: 'Tanggal insiden tidak boleh di masa depan' } 
      };
    }
    
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

export const validateIncidentForm = (data: IncidentFormData): { isValid: boolean; errors: Record<string, string> } => {
  try {
    incidentFormSchema.parse(data);
    
    // Additional validation for anonymous reports
    if (!data.isAnonymous) {
      if (!data.reporterName || data.reporterName.trim().length === 0) {
        return { 
          isValid: false, 
          errors: { reporterName: 'Nama pelapor harus diisi untuk laporan non-anonim' } 
        };
      }
    }
    
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

export const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case SEVERITY_LEVELS.LOW:
      return '#10B981'; // Green
    case SEVERITY_LEVELS.MEDIUM:
      return '#F59E0B'; // Yellow
    case SEVERITY_LEVELS.HIGH:
      return '#EF4444'; // Red
    case SEVERITY_LEVELS.CRITICAL:
      return '#7C2D12'; // Dark Red
    default:
      return '#6B7280'; // Gray
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case INCIDENT_STATUS.DRAFT:
      return '#6B7280'; // Gray
    case INCIDENT_STATUS.SUBMITTED:
      return '#3B82F6'; // Blue
    case INCIDENT_STATUS.UNDER_REVIEW:
      return '#F59E0B'; // Yellow
    case INCIDENT_STATUS.INVESTIGATING:
      return '#EF4444'; // Red
    case INCIDENT_STATUS.RESOLVED:
      return '#10B981'; // Green
    case INCIDENT_STATUS.CLOSED:
      return '#6B7280'; // Gray
    default:
      return '#6B7280'; // Gray
  }
};

export const formatIncidentType = (type: string): string => {
  return INCIDENT_TYPE_LABELS[type as keyof typeof INCIDENT_TYPE_LABELS] || type;
};

export const formatSeverity = (severity: string): string => {
  return SEVERITY_LABELS[severity as keyof typeof SEVERITY_LABELS] || severity;
};

export const formatStatus = (status: string): string => {
  return STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status;
};

// Initial state
export const initialIncidentReportState: IncidentReportState = {
  isLoading: false,
  error: null,
  reports: [],
  currentReport: {},
  isSubmitting: false,
  submitSuccess: false,
};

export const initialIncidentFormData: IncidentFormData = {
  incidentType: '',
  severity: '',
  title: '',
  description: '',
  location: '',
  dateTime: new Date(),
  witnesses: [],
  involvedParties: [],
  isAnonymous: false,
  reporterName: '',
  reporterEmail: '',
  reporterPhone: '',
};

// Error messages
export const INCIDENT_ERRORS = {
  LOAD_FAILED: 'Gagal memuat laporan insiden',
  SUBMIT_FAILED: 'Gagal mengirim laporan. Silakan coba lagi.',
  NETWORK_ERROR: 'Terjadi kesalahan jaringan. Silakan coba lagi.',
  VALIDATION_ERROR: 'Data yang dimasukkan tidak valid',
  UNKNOWN_ERROR: 'Terjadi kesalahan yang tidak diketahui',
  UNAUTHORIZED: 'Anda tidak memiliki akses untuk melihat laporan ini',
  NOT_FOUND: 'Laporan tidak ditemukan',
} as const;
