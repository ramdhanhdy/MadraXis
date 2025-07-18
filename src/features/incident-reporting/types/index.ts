export interface Incident {
  id: string;
  incident_type: string;
  description: string;
  location?: string;
  status: 'pending' | 'resolved' | 'escalated';
  created_at: string;
  student_name?: string;
  is_anonymous: boolean;
  reporter: {
    full_name: string;
  };
  school_id: number;
}

export interface CreateIncidentData {
  incident_type: string;
  description: string;
  location?: string;
  student_name?: string;
  is_anonymous: boolean;
  school_id: number;
}

export interface IncidentFilters {
  status?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface IncidentSummary {
  total: number;
  pending: number;
  resolved: number;
  escalated: number;
}