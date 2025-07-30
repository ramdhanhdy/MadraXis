/**
 * Parent Anti-Bullying Feature Model
 * 
 * This module contains the business logic and data models for the parent anti-bullying feature.
 * It defines types, validation schemas, and business rules specific to anti-bullying resources for parents.
 */

import { z } from 'zod';

// Types
export interface AntiBullyingResource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'guide' | 'checklist' | 'contact';
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  downloadUrl?: string;
  targetAudience: 'parent' | 'child' | 'both';
  ageGroup: 'elementary' | 'middle' | 'high' | 'all';
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  isEmergency: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ParentAntiBullyingState {
  isLoading: boolean;
  error: string | null;
  resources: AntiBullyingResource[];
  selectedResource: AntiBullyingResource | null;
  filterType: 'all' | 'article' | 'video' | 'guide' | 'checklist' | 'contact';
  filterAudience: 'all' | 'parent' | 'child' | 'both';
  filterAgeGroup: 'all' | 'elementary' | 'middle' | 'high';
  searchQuery: string;
  showEmergencyOnly: boolean;
}

export interface BullyingIncident {
  id: string;
  reporterId: string;
  childName: string;
  incidentType: 'physical' | 'verbal' | 'social' | 'cyber';
  description: string;
  location: string;
  dateTime: Date;
  witnesses: string[];
  actionsTaken: string[];
  isAnonymous: boolean;
  status: 'reported' | 'investigating' | 'resolved';
  followUpRequired: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email?: string;
  availability: string;
  isEmergency: boolean;
  description: string;
}

// Validation schemas
export const antiBullyingResourceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  type: z.enum(['article', 'video', 'guide', 'checklist', 'contact']),
  content: z.string().min(1, 'Content is required'),
  imageUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  downloadUrl: z.string().url().optional(),
  targetAudience: z.enum(['parent', 'child', 'both']),
  ageGroup: z.enum(['elementary', 'middle', 'high', 'all']),
  tags: z.array(z.string()),
  priority: z.enum(['low', 'medium', 'high']),
  isEmergency: z.boolean(),
});

export const bullyingIncidentSchema = z.object({
  reporterId: z.string().min(1, 'Reporter ID is required'),
  childName: z.string().min(1, 'Child name is required'),
  incidentType: z.enum(['physical', 'verbal', 'social', 'cyber']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(1, 'Location is required'),
  dateTime: z.date(),
  witnesses: z.array(z.string()),
  actionsTaken: z.array(z.string()),
  isAnonymous: z.boolean(),
  followUpRequired: z.boolean(),
});

export type AntiBullyingResourceSchema = z.infer<typeof antiBullyingResourceSchema>;
export type BullyingIncidentSchema = z.infer<typeof bullyingIncidentSchema>;

// Constants
export const RESOURCE_TYPES = {
  ARTICLE: 'article',
  VIDEO: 'video',
  GUIDE: 'guide',
  CHECKLIST: 'checklist',
  CONTACT: 'contact',
} as const;

export const RESOURCE_TYPE_LABELS = {
  article: 'Artikel',
  video: 'Video',
  guide: 'Panduan',
  checklist: 'Daftar Periksa',
  contact: 'Kontak Darurat',
} as const;

export const TARGET_AUDIENCE_LABELS = {
  parent: 'Orang Tua',
  child: 'Anak',
  both: 'Orang Tua & Anak',
} as const;

export const AGE_GROUP_LABELS = {
  elementary: 'SD (6-12 tahun)',
  middle: 'SMP (13-15 tahun)',
  high: 'SMA (16-18 tahun)',
  all: 'Semua Usia',
} as const;

export const INCIDENT_TYPE_LABELS = {
  physical: 'Kekerasan Fisik',
  verbal: 'Kekerasan Verbal',
  social: 'Pengucilan Sosial',
  cyber: 'Cyberbullying',
} as const;

export const PRIORITY_LABELS = {
  low: 'Rendah',
  medium: 'Sedang',
  high: 'Tinggi',
} as const;

export const WARNING_SIGNS = [
  'Perubahan perilaku mendadak',
  'Enggan pergi ke sekolah',
  'Kehilangan teman atau aktivitas sosial',
  'Barang-barang hilang atau rusak',
  'Luka atau memar yang tidak dapat dijelaskan',
  'Gangguan tidur atau mimpi buruk',
  'Kehilangan nafsu makan',
  'Penurunan prestasi akademik',
  'Perasaan tidak berdaya atau putus asa',
  'Perilaku agresif atau menarik diri',
];

export const PREVENTION_TIPS = [
  'Komunikasi terbuka dengan anak',
  'Ajarkan anak untuk melaporkan bullying',
  'Bangun kepercayaan diri anak',
  'Kenali teman-teman anak',
  'Pantau aktivitas online anak',
  'Ajarkan keterampilan sosial',
  'Berikan contoh perilaku yang baik',
  'Libatkan diri dalam kegiatan sekolah',
  'Jalin hubungan dengan guru',
  'Ciptakan lingkungan rumah yang aman',
];

// Business logic functions
export const validateResource = (data: AntiBullyingResource): { isValid: boolean; errors: Record<string, string> } => {
  try {
    antiBullyingResourceSchema.parse(data);
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

export const validateIncident = (data: BullyingIncident): { isValid: boolean; errors: Record<string, string> } => {
  try {
    bullyingIncidentSchema.parse(data);
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

export const filterResourcesByType = (resources: AntiBullyingResource[], type: string): AntiBullyingResource[] => {
  if (type === 'all') return resources;
  return resources.filter(resource => resource.type === type);
};

export const filterResourcesByAudience = (resources: AntiBullyingResource[], audience: string): AntiBullyingResource[] => {
  if (audience === 'all') return resources;
  return resources.filter(resource => resource.targetAudience === audience || resource.targetAudience === 'both');
};

export const filterResourcesByAgeGroup = (resources: AntiBullyingResource[], ageGroup: string): AntiBullyingResource[] => {
  if (ageGroup === 'all') return resources;
  return resources.filter(resource => resource.ageGroup === ageGroup || resource.ageGroup === 'all');
};

export const searchResources = (resources: AntiBullyingResource[], query: string): AntiBullyingResource[] => {
  if (!query.trim()) return resources;
  const lowercaseQuery = query.toLowerCase();
  return resources.filter(resource => 
    resource.title.toLowerCase().includes(lowercaseQuery) ||
    resource.description.toLowerCase().includes(lowercaseQuery) ||
    resource.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const getEmergencyResources = (resources: AntiBullyingResource[]): AntiBullyingResource[] => {
  return resources.filter(resource => resource.isEmergency);
};

export const sortResourcesByPriority = (resources: AntiBullyingResource[]): AntiBullyingResource[] => {
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  return [...resources].sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
};

export const formatResourceType = (type: string): string => {
  return RESOURCE_TYPE_LABELS[type as keyof typeof RESOURCE_TYPE_LABELS] || type;
};

export const formatTargetAudience = (audience: string): string => {
  return TARGET_AUDIENCE_LABELS[audience as keyof typeof TARGET_AUDIENCE_LABELS] || audience;
};

export const formatAgeGroup = (ageGroup: string): string => {
  return AGE_GROUP_LABELS[ageGroup as keyof typeof AGE_GROUP_LABELS] || ageGroup;
};

export const formatIncidentType = (type: string): string => {
  return INCIDENT_TYPE_LABELS[type as keyof typeof INCIDENT_TYPE_LABELS] || type;
};

export const formatPriority = (priority: string): string => {
  return PRIORITY_LABELS[priority as keyof typeof PRIORITY_LABELS] || priority;
};

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'high':
      return '#EF4444'; // Red
    case 'medium':
      return '#F59E0B'; // Yellow
    case 'low':
      return '#10B981'; // Green
    default:
      return '#6B7280'; // Gray
  }
};

export const getResourceTypeIcon = (type: string): string => {
  switch (type) {
    case 'article':
      return 'document-text-outline';
    case 'video':
      return 'play-circle-outline';
    case 'guide':
      return 'book-outline';
    case 'checklist':
      return 'checkmark-circle-outline';
    case 'contact':
      return 'call-outline';
    default:
      return 'information-circle-outline';
  }
};

// Initial state
export const initialParentAntiBullyingState: ParentAntiBullyingState = {
  isLoading: false,
  error: null,
  resources: [],
  selectedResource: null,
  filterType: 'all',
  filterAudience: 'all',
  filterAgeGroup: 'all',
  searchQuery: '',
  showEmergencyOnly: false,
};

// Mock emergency contacts
export const mockEmergencyContacts: EmergencyContact[] = [
  {
    id: '1',
    name: 'Konselor Sekolah',
    role: 'Konselor',
    phone: '+6281234567890',
    email: 'konselor@zaidsync.com',
    availability: '24/7',
    isEmergency: true,
    description: 'Konselor profesional untuk masalah bullying',
  },
  {
    id: '2',
    name: 'Hotline Anti-Bullying',
    role: 'Layanan Darurat',
    phone: '+6281234567891',
    availability: '24/7',
    isEmergency: true,
    description: 'Layanan darurat untuk kasus bullying',
  },
  {
    id: '3',
    name: 'Kepala Sekolah',
    role: 'Kepala Sekolah',
    phone: '+6281234567892',
    email: 'kepala@zaidsync.com',
    availability: 'Senin-Jumat 07:00-16:00',
    isEmergency: false,
    description: 'Untuk laporan resmi dan tindak lanjut',
  },
];

// Error messages
export const PARENT_ANTI_BULLYING_ERRORS = {
  LOAD_FAILED: 'Gagal memuat sumber daya anti-perundungan',
  SAVE_FAILED: 'Gagal menyimpan data',
  NETWORK_ERROR: 'Terjadi kesalahan jaringan. Silakan coba lagi.',
  VALIDATION_ERROR: 'Data yang dimasukkan tidak valid',
  UNKNOWN_ERROR: 'Terjadi kesalahan yang tidak diketahui',
  REPORT_FAILED: 'Gagal mengirim laporan. Silakan coba lagi.',
  RESOURCE_NOT_FOUND: 'Sumber daya tidak ditemukan',
} as const;
