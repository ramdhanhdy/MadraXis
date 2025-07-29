import { z } from 'zod';
import { Incident } from '@types';

// Validation schemas
export const CreateIncidentSchema = z.object({
  incident_type: z.enum(['disciplinary', 'academic', 'health', 'safety', 'other']),
  description: z.string().min(1, 'Description is required').max(1000, 'Description too long'),
  location: z.string().min(1, 'Location is required').max(200, 'Location too long'),
  student_id: z.string().uuid('Invalid student ID').optional(),
  is_anonymous: z.boolean().default(false),
  severity: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
});

export const UpdateIncidentSchema = z.object({
  incident_type: z.enum(['disciplinary', 'academic', 'health', 'safety', 'other']).optional(),
  description: z.string().min(1).max(1000).optional(),
  location: z.string().min(1).max(200).optional(),
  status: z.enum(['open', 'investigating', 'resolved', 'closed']).optional(),
  resolution_notes: z.string().max(1000).optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
});

export const GetIncidentsOptionsSchema = z.object({
  status: z.enum(['open', 'investigating', 'resolved', 'closed']).optional(),
  incident_type: z.enum(['disciplinary', 'academic', 'health', 'safety', 'other']).optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  student_id: z.string().uuid().optional(),
  reporter_id: z.string().uuid().optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
  limit: z.number().int().min(1).max(100).default(10).optional(),
  page: z.number().int().min(1).default(1).optional(),
  sortBy: z.enum(['created_at', 'updated_at', 'severity', 'status']).default('created_at').optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
});

// Type definitions
export interface CreateIncidentRequest {
  incident_type: 'disciplinary' | 'academic' | 'health' | 'safety' | 'other';
  description: string;
  location: string;
  student_id?: string;
  is_anonymous?: boolean;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export interface UpdateIncidentRequest {
  incident_type?: 'disciplinary' | 'academic' | 'health' | 'safety' | 'other';
  description?: string;
  location?: string;
  status?: 'open' | 'investigating' | 'resolved' | 'closed';
  resolution_notes?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export interface GetIncidentsOptions {
  status?: 'open' | 'investigating' | 'resolved' | 'closed';
  incident_type?: 'disciplinary' | 'academic' | 'health' | 'safety' | 'other';
  severity?: 'low' | 'medium' | 'high' | 'critical';
  student_id?: string;
  reporter_id?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  page?: number;
  sortBy?: 'created_at' | 'updated_at' | 'severity' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface IncidentWithDetails extends Incident {
  student_name?: string;
  reporter_name?: string;
  resolution_notes?: string;
  resolved_at?: string;
  resolved_by?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  follow_up_required?: boolean;
  follow_up_date?: string;
  tags?: string[];
}

export interface IncidentStats {
  total: number;
  open: number;
  investigating: number;
  resolved: number;
  closed: number;
  by_type: {
    disciplinary: number;
    academic: number;
    health: number;
    safety: number;
    other: number;
  };
  by_severity: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  recent_trend: {
    this_week: number;
    last_week: number;
    this_month: number;
    last_month: number;
  };
}

export interface IncidentSearchResult {
  incidents: IncidentWithDetails[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats?: IncidentStats;
}

/**
 * Custom error class for incident service operations
 */
export class IncidentServiceError extends Error {
  public readonly code: string;
  public readonly context?: any;

  constructor(code: string, message: string, context?: any) {
    super(message);
    this.name = 'IncidentServiceError';
    this.code = code;
    this.context = context;
  }

  static create(code: string, message: string, context?: any): IncidentServiceError {
    return new IncidentServiceError(code, message, context);
  }
}
