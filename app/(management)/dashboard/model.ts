/**
 * Management Dashboard Feature Model
 * 
 * This module contains the business logic and data models for the management dashboard feature.
 * It defines types, validation schemas, and business rules specific to management dashboard functionality.
 */

import { z } from 'zod';
import { Ionicons } from '@expo/vector-icons';

// Re-export types from services and shared types
export type { DashboardMetrics } from '../../../src/services/dashboard';
export type { Incident } from '../../../src/types';

// Icon types for proper typing
export type IoniconsIcon = keyof typeof Ionicons.glyphMap;

// Types
export interface ManagementDashboardState {
  isLoading: boolean;
  error: string | null;
  schoolName: string;
  activeTab: string;
  incidents: Incident[];
  dashboardMetrics: DashboardMetrics | null;
  refreshing: boolean;
}

export interface QuickActionItem {
  title: string;
  icon: IoniconsIcon;
  onPress: () => void;
  variant: 'primary' | 'secondary';
}

export interface HeaderAction {
  icon: IoniconsIcon;
  onPress: () => void;
  badge?: number;
  accessibilityLabel: string;
}

export interface TabItem {
  id: string;
  label: string;
  icon: IoniconsIcon;
}

export interface IncidentSummary {
  total: number;
  pending: number;
  investigating: number;
  resolved: number;
}

// Validation schemas
export const incidentSchema = z.object({
  id: z.string().min(1, 'Incident ID is required'),
  incident_type: z.string().min(1, 'Incident type is required'),
  description: z.string().min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required'),
  created_at: z.string().min(1, 'Created date is required'),
  status: z.enum(['pending', 'investigating', 'resolved']),
});

export const dashboardMetricsSchema = z.object({
  studentEnrollment: z.number().min(0),
  teacherCount: z.number().min(0),
  incidentSummary: z.object({
    total: z.number().min(0),
    pending: z.number().min(0),
    investigating: z.number().min(0),
    resolved: z.number().min(0),
  }),
  lastUpdated: z.date(),
});

export type IncidentSchema = z.infer<typeof incidentSchema>;
export type DashboardMetricsSchema = z.infer<typeof dashboardMetricsSchema>;

// Constants
export const DASHBOARD_TABS = {
  DASHBOARD: 'dashboard',
  PROFILE: 'profile',
} as const;

export const TAB_LABELS = {
  dashboard: 'Dashboard',
  profile: 'Profil',
} as const;

export const INCIDENT_STATUS = {
  PENDING: 'pending',
  INVESTIGATING: 'investigating',
  RESOLVED: 'resolved',
} as const;

export const INCIDENT_STATUS_LABELS = {
  pending: 'Menunggu',
  investigating: 'Sedang Diselidiki',
  resolved: 'Terselesaikan',
} as const;

export const INCIDENT_TYPES = {
  BULLYING: 'bullying',
  VIOLENCE: 'violence',
  THEFT: 'theft',
  VANDALISM: 'vandalism',
  OTHER: 'other',
} as const;

export const INCIDENT_TYPE_LABELS = {
  bullying: 'Perundungan',
  violence: 'Kekerasan',
  theft: 'Pencurian',
  vandalism: 'Vandalisme',
  other: 'Lainnya',
} as const;

// Business logic functions
export const validateIncident = (data: Incident): { isValid: boolean; errors: Record<string, string> } => {
  try {
    incidentSchema.parse(data);
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

export const getIncidentPriorityColor = (incidentType: string): string => {
  switch (incidentType.toLowerCase()) {
    case INCIDENT_TYPES.BULLYING:
      return '#EF4444'; // Red
    case INCIDENT_TYPES.VIOLENCE:
      return '#7C2D12'; // Dark Red
    case INCIDENT_TYPES.THEFT:
      return '#F59E0B'; // Yellow
    case INCIDENT_TYPES.VANDALISM:
      return '#D97706'; // Dark Yellow
    default:
      return '#6B7280'; // Gray
  }
};

export const getIncidentStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case INCIDENT_STATUS.PENDING:
      return '#F59E0B'; // Yellow
    case INCIDENT_STATUS.INVESTIGATING:
      return '#3B82F6'; // Blue
    case INCIDENT_STATUS.RESOLVED:
      return '#10B981'; // Green
    default:
      return '#6B7280'; // Gray
  }
};

export const getRelativeTime = (date: string): string => {
  const now = new Date();
  const incidentDate = new Date(date);
  const diffInMinutes = Math.floor((now.getTime() - incidentDate.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Baru saja';
  if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} jam yang lalu`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} hari yang lalu`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  return `${diffInWeeks} minggu yang lalu`;
};

export const formatIncidentType = (type: string): string => {
  return INCIDENT_TYPE_LABELS[type as keyof typeof INCIDENT_TYPE_LABELS] || type;
};

export const formatIncidentStatus = (status: string): string => {
  return INCIDENT_STATUS_LABELS[status as keyof typeof INCIDENT_STATUS_LABELS] || status;
};

export const calculateIncidentSummary = (incidents: Incident[]): IncidentSummary => {
  const summary = {
    total: incidents.length,
    pending: 0,
    investigating: 0,
    resolved: 0,
  };

  incidents.forEach(incident => {
    switch (incident.status) {
      case INCIDENT_STATUS.PENDING:
        summary.pending++;
        break;
      case INCIDENT_STATUS.INVESTIGATING:
        summary.investigating++;
        break;
      case INCIDENT_STATUS.RESOLVED:
        summary.resolved++;
        break;
    }
  });

  return summary;
};

export const getRecentIncidents = (incidents: Incident[], limit: number = 5): Incident[] => {
  return incidents
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
};

export const getPendingIncidentsCount = (incidents: Incident[]): number => {
  return incidents.filter(incident => incident.status === INCIDENT_STATUS.PENDING).length;
};

export const filterIncidentsByStatus = (incidents: Incident[], status: string): Incident[] => {
  if (status === 'all') return incidents;
  return incidents.filter(incident => incident.status === status);
};

export const filterIncidentsByType = (incidents: Incident[], type: string): Incident[] => {
  if (type === 'all') return incidents;
  return incidents.filter(incident => incident.incident_type === type);
};

export const searchIncidents = (incidents: Incident[], query: string): Incident[] => {
  if (!query.trim()) return incidents;
  
  const lowercaseQuery = query.toLowerCase();
  return incidents.filter(incident => 
    incident.description.toLowerCase().includes(lowercaseQuery) ||
    incident.location.toLowerCase().includes(lowercaseQuery) ||
    incident.incident_type.toLowerCase().includes(lowercaseQuery)
  );
};

export const formatDashboardMetrics = (metrics: DashboardMetrics | null) => {
  if (!metrics) {
    return {
      studentEnrollment: 0,
      teacherCount: 0,
      incidentSummary: {
        total: 0,
        pending: 0,
        investigating: 0,
        resolved: 0,
      },
      lastUpdated: new Date(),
    };
  }
  return metrics;
};

export const getMetricChangeIndicator = (current: number, previous: number): 'up' | 'down' | 'stable' => {
  if (current > previous) return 'up';
  if (current < previous) return 'down';
  return 'stable';
};

export const calculateMetricPercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

// Initial state
export const initialManagementDashboardState: ManagementDashboardState = {
  isLoading: false,
  error: null,
  schoolName: 'Zaid Bin Tsabit',
  activeTab: DASHBOARD_TABS.DASHBOARD,
  incidents: [],
  dashboardMetrics: null,
  refreshing: false,
};

// Error messages
export const MANAGEMENT_DASHBOARD_ERRORS = {
  LOAD_FAILED: 'Gagal memuat data dashboard',
  INCIDENTS_LOAD_FAILED: 'Gagal memuat data insiden',
  METRICS_LOAD_FAILED: 'Gagal memuat metrik dashboard',
  NETWORK_ERROR: 'Terjadi kesalahan jaringan. Silakan coba lagi.',
  VALIDATION_ERROR: 'Data yang dimasukkan tidak valid',
  UNKNOWN_ERROR: 'Terjadi kesalahan yang tidak diketahui',
  UNAUTHORIZED: 'Anda tidak memiliki akses untuk melihat dashboard ini',
  REFRESH_FAILED: 'Gagal memperbarui data',
} as const;
