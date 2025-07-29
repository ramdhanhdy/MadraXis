import { useState, useEffect, useCallback } from 'react';
import { IncidentService } from './api';
import {
  IncidentWithDetails,
  GetIncidentsOptions,
  CreateIncidentRequest,
  UpdateIncidentRequest,
  IncidentSearchResult,
  IncidentStats
} from './types';

/**
 * Hook for managing incidents for a school
 */
export function useIncidents(schoolId: number, options?: GetIncidentsOptions) {
  const [incidents, setIncidents] = useState<IncidentWithDetails[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIncidents = useCallback(async () => {
    if (!schoolId) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await IncidentService.getIncidents(schoolId, options);
      setIncidents(result.incidents);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch incidents');
    } finally {
      setLoading(false);
    }
  }, [schoolId, options]);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  const refetch = useCallback(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  return {
    incidents,
    total,
    loading,
    error,
    refetch
  };
}

/**
 * Hook for managing a single incident
 */
export function useIncident(incidentId: number) {
  const [incident, setIncident] = useState<IncidentWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIncident = useCallback(async () => {
    if (!incidentId) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await IncidentService.getIncidentById(incidentId);
      setIncident(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch incident');
    } finally {
      setLoading(false);
    }
  }, [incidentId]);

  useEffect(() => {
    fetchIncident();
  }, [fetchIncident]);

  const refetch = useCallback(() => {
    fetchIncident();
  }, [fetchIncident]);

  return {
    incident,
    loading,
    error,
    refetch
  };
}

/**
 * Hook for incident statistics
 */
export function useIncidentStats(schoolId: number) {
  const [stats, setStats] = useState<IncidentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!schoolId) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await IncidentService.getIncidentStats(schoolId);
      setStats(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch incident statistics');
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const refetch = useCallback(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch
  };
}

/**
 * Hook for incident operations (create, update, delete)
 */
export function useIncidentOperations(schoolId: number) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createIncident = useCallback(async (
    incidentData: CreateIncidentRequest,
    reporterId: string
  ): Promise<IncidentWithDetails | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await IncidentService.createIncident(incidentData, reporterId, schoolId);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create incident');
      return null;
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  const updateIncident = useCallback(async (
    incidentId: number,
    updateData: UpdateIncidentRequest,
    updatedBy: string
  ): Promise<IncidentWithDetails | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await IncidentService.updateIncident(incidentId, updateData, updatedBy);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update incident');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteIncident = useCallback(async (
    incidentId: number,
    deletedBy: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await IncidentService.deleteIncident(incidentId, deletedBy);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete incident');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const resolveIncident = useCallback(async (
    incidentId: number,
    resolutionNotes: string,
    resolvedBy: string
  ): Promise<IncidentWithDetails | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await IncidentService.resolveIncident(incidentId, resolutionNotes, resolvedBy);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resolve incident');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reopenIncident = useCallback(async (
    incidentId: number,
    reopenedBy: string,
    reason?: string
  ): Promise<IncidentWithDetails | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await IncidentService.reopenIncident(incidentId, reopenedBy, reason);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reopen incident');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createIncident,
    updateIncident,
    deleteIncident,
    resolveIncident,
    reopenIncident
  };
}

/**
 * Hook for student-specific incidents
 */
export function useStudentIncidents(
  studentId: string,
  schoolId: number,
  options?: Omit<GetIncidentsOptions, 'student_id'>
) {
  const [incidents, setIncidents] = useState<IncidentWithDetails[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIncidents = useCallback(async () => {
    if (!studentId || !schoolId) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await IncidentService.getIncidentsByStudent(studentId, schoolId, options);
      setIncidents(result.incidents);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch student incidents');
    } finally {
      setLoading(false);
    }
  }, [studentId, schoolId, options]);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  const refetch = useCallback(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  return {
    incidents,
    total,
    loading,
    error,
    refetch
  };
}

/**
 * Hook for reporter-specific incidents
 */
export function useReporterIncidents(
  reporterId: string,
  schoolId: number,
  options?: Omit<GetIncidentsOptions, 'reporter_id'>
) {
  const [incidents, setIncidents] = useState<IncidentWithDetails[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIncidents = useCallback(async () => {
    if (!reporterId || !schoolId) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await IncidentService.getIncidentsByReporter(reporterId, schoolId, options);
      setIncidents(result.incidents);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reporter incidents');
    } finally {
      setLoading(false);
    }
  }, [reporterId, schoolId, options]);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  const refetch = useCallback(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  return {
    incidents,
    total,
    loading,
    error,
    refetch
  };
}
