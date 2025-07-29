/**
 * Anti-Bullying Feature Model
 * 
 * This module contains the business logic and data models for the anti-bullying education feature.
 * It defines types, validation schemas, and business rules specific to anti-bullying resources.
 */

import { z } from 'zod';

// Types
export interface AntiBullyingResource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'infographic' | 'quiz';
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  duration?: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AntiBullyingState {
  isLoading: boolean;
  error: string | null;
  resources: AntiBullyingResource[];
  selectedResource: AntiBullyingResource | null;
  filterType: 'all' | 'article' | 'video' | 'infographic' | 'quiz';
  searchQuery: string;
}

export interface BullyingReport {
  id: string;
  reporterName: string;
  reporterEmail?: string;
  incidentType: 'physical' | 'verbal' | 'social' | 'cyber';
  description: string;
  location: string;
  dateTime: Date;
  witnesses: string[];
  isAnonymous: boolean;
  status: 'pending' | 'investigating' | 'resolved';
}

// Validation schemas
export const antiBullyingResourceSchema = z.object({
  id: z.string().min(1, 'Resource ID is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  type: z.enum(['article', 'video', 'infographic', 'quiz']),
  content: z.string().min(1, 'Content is required'),
  imageUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  duration: z.number().positive().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  tags: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const bullyingReportSchema = z.object({
  reporterName: z.string().min(1, 'Reporter name is required'),
  reporterEmail: z.string().email().optional(),
  incidentType: z.enum(['physical', 'verbal', 'social', 'cyber']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(1, 'Location is required'),
  dateTime: z.date(),
  witnesses: z.array(z.string()),
  isAnonymous: z.boolean(),
});

export type AntiBullyingResourceSchema = z.infer<typeof antiBullyingResourceSchema>;
export type BullyingReportSchema = z.infer<typeof bullyingReportSchema>;

// Constants
export const RESOURCE_TYPES = {
  ARTICLE: 'article',
  VIDEO: 'video',
  INFOGRAPHIC: 'infographic',
  QUIZ: 'quiz',
} as const;

export const INCIDENT_TYPES = {
  PHYSICAL: 'physical',
  VERBAL: 'verbal',
  SOCIAL: 'social',
  CYBER: 'cyber',
} as const;

export const RESOURCE_TYPE_LABELS = {
  article: 'Artikel',
  video: 'Video',
  infographic: 'Infografis',
  quiz: 'Kuis',
} as const;

export const INCIDENT_TYPE_LABELS = {
  physical: 'Kekerasan Fisik',
  verbal: 'Kekerasan Verbal',
  social: 'Pengucilan Sosial',
  cyber: 'Cyberbullying',
} as const;

export const DIFFICULTY_LABELS = {
  beginner: 'Pemula',
  intermediate: 'Menengah',
  advanced: 'Lanjutan',
} as const;

// Business logic functions
export const validateResource = (data: AntiBullyingResource): { isValid: boolean; errors: Record<string, string> } => {
  try {
    antiBullyingResourceSchema.parse(data);
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

export const validateBullyingReport = (data: BullyingReport): { isValid: boolean; errors: Record<string, string> } => {
  try {
    bullyingReportSchema.parse(data);
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

export const filterResourcesByType = (resources: AntiBullyingResource[], type: string) => {
  if (type === 'all') return resources;
  return resources.filter(resource => resource.type === type);
};

export const searchResources = (resources: AntiBullyingResource[], query: string) => {
  if (!query.trim()) return resources;
  const lowercaseQuery = query.toLowerCase();
  return resources.filter(resource => 
    resource.title.toLowerCase().includes(lowercaseQuery) ||
    resource.description.toLowerCase().includes(lowercaseQuery) ||
    resource.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const formatDuration = (minutes?: number): string => {
  if (!minutes) return '';
  if (minutes < 60) return `${minutes} menit`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours} jam ${remainingMinutes} menit` : `${hours} jam`;
};

// Initial state
export const initialAntiBullyingState: AntiBullyingState = {
  isLoading: false,
  error: null,
  resources: [],
  selectedResource: null,
  filterType: 'all',
  searchQuery: '',
};

// Error messages
export const ANTI_BULLYING_ERRORS = {
  LOAD_FAILED: 'Gagal memuat materi anti-perundungan',
  SAVE_FAILED: 'Gagal menyimpan data',
  NETWORK_ERROR: 'Terjadi kesalahan jaringan. Silakan coba lagi.',
  VALIDATION_ERROR: 'Data yang dimasukkan tidak valid',
  UNKNOWN_ERROR: 'Terjadi kesalahan yang tidak diketahui',
  REPORT_FAILED: 'Gagal mengirim laporan. Silakan coba lagi.',
} as const;
