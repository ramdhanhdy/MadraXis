/**
 * Parent Incident Report Feature Model
 * 
 * This module contains the business logic and data models for the parent incident report feature.
 * It defines types, validation schemas, and business rules specific to incident reporting by parents.
 */

import { z } from 'zod';

// Types
export interface ParentIncidentReport {
  id?: string;
  parentId: string;
  parentName: string;
  parentEmail?: string;
  parentPhone: string;
  childName: string;
  childClass: string;
  childId?: string;
  incidentType: 'bullying' | 'violence' | 'discrimination' | 'harassment' | 'safety' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: string;
  dateTime: Date;
  witnesses: string[];
  involvedParties: string[];
  previousIncidents: boolean;
  actionsTakenByParent: string[];
  desiredOutcome: string;
  evidence: {
    photos: string[];
    videos: string[];
    documents: string[];
    screenshots: string[];
  };
  isAnonymous: boolean;
  urgentFollowUp: boolean;
  status: 'draft' | 'submitted' | 'acknowledged' | 'investigating' | 'resolved' | 'closed';
  schoolResponse?: string;
  resolution?: string;
  followUpDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ParentIncidentReportState {
  isLoading: boolean;
  error: string | null;
  reports: ParentIncidentReport[];
  currentReport: Partial<ParentIncidentReport>;
  isSubmitting: boolean;
  submitSuccess: boolean;
  selectedReport: ParentIncidentReport | null;
  filterStatus: 'all' | 'draft' | 'submitted' | 'investigating' | 'resolved';
  sortBy: 'date' | 'severity' | 'status' | 'type';
  sortOrder: 'asc' | 'desc';
}

export interface IncidentFormData {
  // Child Information
  childName: string;
  childClass: string;
  
  // Incident Details
  incidentType: string;
  severity: string;
  title: string;
  description: string;
  location: string;
  dateTime: Date | null;
  
  // Additional Details
  witnesses: string[];
  involvedParties: string[];
  previousIncidents: boolean;
  actionsTakenByParent: string[];
  desiredOutcome: string;
  
  // Contact Preferences
  isAnonymous: boolean;
  urgentFollowUp: boolean;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
}

export interface IncidentTemplate {
  id: string;
  name: string;
  description: string;
  incidentType: string;
  severity: string;
  commonLocations: string[];
  suggestedActions: string[];
  warningText?: string;
}

// Validation schemas
export const parentIncidentReportSchema = z.object({
  parentId: z.string().min(1, 'Parent ID is required'),
  parentName: z.string().min(1, 'Parent name is required'),
  parentEmail: z.string().email().optional(),
  parentPhone: z.string().min(1, 'Parent phone is required'),
  childName: z.string().min(1, 'Child name is required'),
  childClass: z.string().min(1, 'Child class is required'),
  childId: z.string().optional(),
  incidentType: z.enum(['bullying', 'violence', 'discrimination', 'harassment', 'safety', 'other']),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  location: z.string().min(1, 'Location is required'),
  dateTime: z.date(),
  witnesses: z.array(z.string()),
  involvedParties: z.array(z.string()),
  previousIncidents: z.boolean(),
  actionsTakenByParent: z.array(z.string()),
  desiredOutcome: z.string().min(1, 'Desired outcome is required'),
  isAnonymous: z.boolean(),
  urgentFollowUp: z.boolean(),
});

export const incidentFormSchema = z.object({
  childName: z.string().min(1, 'Nama anak harus diisi'),
  childClass: z.string().min(1, 'Kelas anak harus diisi'),
  incidentType: z.string().min(1, 'Jenis insiden harus dipilih'),
  severity: z.string().min(1, 'Tingkat keparahan harus dipilih'),
  title: z.string().min(5, 'Judul minimal 5 karakter'),
  description: z.string().min(20, 'Deskripsi minimal 20 karakter'),
  location: z.string().min(1, 'Lokasi harus diisi'),
  dateTime: z.date().refine(date => date !== null, 'Tanggal dan waktu harus diisi'),
  witnesses: z.array(z.string()),
  involvedParties: z.array(z.string()),
  previousIncidents: z.boolean(),
  actionsTakenByParent: z.array(z.string()),
  desiredOutcome: z.string().min(1, 'Hasil yang diharapkan harus diisi'),
  isAnonymous: z.boolean(),
  urgentFollowUp: z.boolean(),
  parentName: z.string().optional(),
  parentEmail: z.string().email('Format email tidak valid').optional(),
  parentPhone: z.string().optional(),
});

export type ParentIncidentReportSchema = z.infer<typeof parentIncidentReportSchema>;
export type IncidentFormSchema = z.infer<typeof incidentFormSchema>;

// Constants
export const INCIDENT_TYPES = {
  BULLYING: 'bullying',
  VIOLENCE: 'violence',
  DISCRIMINATION: 'discrimination',
  HARASSMENT: 'harassment',
  SAFETY: 'safety',
  OTHER: 'other',
} as const;

export const INCIDENT_TYPE_LABELS = {
  bullying: 'Perundungan',
  violence: 'Kekerasan',
  discrimination: 'Diskriminasi',
  harassment: 'Pelecehan',
  safety: 'Keamanan',
  other: 'Lainnya',
} as const;

export const SEVERITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export const SEVERITY_LABELS = {
  low: 'Ringan',
  medium: 'Sedang',
  high: 'Berat',
  critical: 'Kritis',
} as const;

export const REPORT_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  ACKNOWLEDGED: 'acknowledged',
  INVESTIGATING: 'investigating',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
} as const;

export const STATUS_LABELS = {
  draft: 'Draft',
  submitted: 'Terkirim',
  acknowledged: 'Diterima',
  investigating: 'Sedang Diselidiki',
  resolved: 'Terselesaikan',
  closed: 'Ditutup',
} as const;

export const COMMON_LOCATIONS = [
  'Ruang Kelas',
  'Kantin',
  'Toilet',
  'Lapangan',
  'Koridor',
  'Perpustakaan',
  'Lab Komputer',
  'Musholla',
  'Parkiran',
  'Gerbang Sekolah',
  'Bus Sekolah',
  'Online/Media Sosial',
];

export const COMMON_ACTIONS = [
  'Berbicara dengan anak',
  'Menghubungi guru kelas',
  'Menghubungi wali kelas',
  'Mendokumentasikan kejadian',
  'Mengambil foto/video bukti',
  'Berbicara dengan orang tua pelaku',
  'Melaporkan ke kepala sekolah',
  'Mencari bantuan konselor',
  'Menghubungi pihak berwajib',
  'Mencari saksi mata',
];

export const DESIRED_OUTCOMES = [
  'Penyelidikan menyeluruh',
  'Tindakan disiplin untuk pelaku',
  'Permintaan maaf dari pelaku',
  'Mediasi antara pihak terlibat',
  'Konseling untuk anak',
  'Pemindahan kelas',
  'Peningkatan pengawasan',
  'Pelatihan anti-bullying',
  'Kebijakan sekolah yang lebih ketat',
  'Kompensasi atau ganti rugi',
];

// Business logic functions
export const validateIncidentReport = (data: ParentIncidentReport): { isValid: boolean; errors: Record<string, string> } => {
  try {
    parentIncidentReportSchema.parse(data);
    
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
    
    // Additional validation for non-anonymous reports
    if (!data.isAnonymous) {
      if (!data.parentName || data.parentName.trim().length === 0) {
        return { 
          isValid: false, 
          errors: { parentName: 'Nama orang tua harus diisi untuk laporan non-anonim' } 
        };
      }
      if (!data.parentPhone || data.parentPhone.trim().length === 0) {
        return { 
          isValid: false, 
          errors: { parentPhone: 'Nomor telepon harus diisi untuk laporan non-anonim' } 
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
    case REPORT_STATUS.DRAFT:
      return '#6B7280'; // Gray
    case REPORT_STATUS.SUBMITTED:
      return '#3B82F6'; // Blue
    case REPORT_STATUS.ACKNOWLEDGED:
      return '#8B5CF6'; // Purple
    case REPORT_STATUS.INVESTIGATING:
      return '#F59E0B'; // Yellow
    case REPORT_STATUS.RESOLVED:
      return '#10B981'; // Green
    case REPORT_STATUS.CLOSED:
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

export const getIncidentTypeIcon = (type: string): string => {
  switch (type) {
    case INCIDENT_TYPES.BULLYING:
      return 'people-outline';
    case INCIDENT_TYPES.VIOLENCE:
      return 'warning-outline';
    case INCIDENT_TYPES.DISCRIMINATION:
      return 'ban-outline';
    case INCIDENT_TYPES.HARASSMENT:
      return 'alert-circle-outline';
    case INCIDENT_TYPES.SAFETY:
      return 'shield-outline';
    case INCIDENT_TYPES.OTHER:
      return 'help-circle-outline';
    default:
      return 'information-circle-outline';
  }
};

export const filterReportsByStatus = (reports: ParentIncidentReport[], status: string): ParentIncidentReport[] => {
  if (status === 'all') return reports;
  return reports.filter(report => report.status === status);
};

export const sortReports = (reports: ParentIncidentReport[], sortBy: string, sortOrder: string): ParentIncidentReport[] => {
  return [...reports].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = a.createdAt.getTime() - b.createdAt.getTime();
        break;
      case 'severity':
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        comparison = severityOrder[a.severity] - severityOrder[b.severity];
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      case 'type':
        comparison = a.incidentType.localeCompare(b.incidentType);
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });
};

export const getUrgentReports = (reports: ParentIncidentReport[]): ParentIncidentReport[] => {
  return reports.filter(report => 
    report.urgentFollowUp || 
    report.severity === 'critical' || 
    report.severity === 'high'
  );
};

// Initial state
export const initialIncidentFormData: IncidentFormData = {
  childName: '',
  childClass: '',
  incidentType: '',
  severity: '',
  title: '',
  description: '',
  location: '',
  dateTime: null,
  witnesses: [],
  involvedParties: [],
  previousIncidents: false,
  actionsTakenByParent: [],
  desiredOutcome: '',
  isAnonymous: false,
  urgentFollowUp: false,
  parentName: '',
  parentEmail: '',
  parentPhone: '',
};

export const initialParentIncidentReportState: ParentIncidentReportState = {
  isLoading: false,
  error: null,
  reports: [],
  currentReport: {},
  isSubmitting: false,
  submitSuccess: false,
  selectedReport: null,
  filterStatus: 'all',
  sortBy: 'date',
  sortOrder: 'desc',
};

// Mock incident templates
export const mockIncidentTemplates: IncidentTemplate[] = [
  {
    id: '1',
    name: 'Perundungan Fisik',
    description: 'Kekerasan fisik atau ancaman kekerasan',
    incidentType: 'bullying',
    severity: 'high',
    commonLocations: ['Ruang Kelas', 'Koridor', 'Toilet', 'Lapangan'],
    suggestedActions: ['Dokumentasikan luka', 'Hubungi guru', 'Laporkan ke kepala sekolah'],
    warningText: 'Segera laporkan jika ada kekerasan fisik',
  },
  {
    id: '2',
    name: 'Cyberbullying',
    description: 'Perundungan melalui media digital',
    incidentType: 'bullying',
    severity: 'medium',
    commonLocations: ['Online/Media Sosial'],
    suggestedActions: ['Screenshot bukti', 'Blokir pelaku', 'Laporkan ke platform'],
  },
];

// Error messages
export const PARENT_INCIDENT_ERRORS = {
  LOAD_FAILED: 'Gagal memuat laporan insiden',
  SUBMIT_FAILED: 'Gagal mengirim laporan. Silakan coba lagi.',
  SAVE_DRAFT_FAILED: 'Gagal menyimpan draft laporan',
  DELETE_FAILED: 'Gagal menghapus laporan',
  NETWORK_ERROR: 'Terjadi kesalahan jaringan. Silakan coba lagi.',
  VALIDATION_ERROR: 'Data yang dimasukkan tidak valid',
  UNKNOWN_ERROR: 'Terjadi kesalahan yang tidak diketahui',
  UNAUTHORIZED: 'Anda tidak memiliki akses untuk melihat laporan ini',
  NOT_FOUND: 'Laporan tidak ditemukan',
  FILE_UPLOAD_FAILED: 'Gagal mengunggah file bukti',
  DUPLICATE_REPORT: 'Laporan serupa sudah pernah dikirim',
} as const;
