import { supabase } from '@lib/utils/supabase';
import { logger } from '@lib/utils/logger';
import { sanitizeLikeInput, sanitizeSortParams } from '@lib/utils/sanitization';
import { Incident } from '@types';
import type { DatabaseResponse } from '@types/database';
import {
  CreateIncidentRequest,
  UpdateIncidentRequest,
  GetIncidentsOptions,
  IncidentWithDetails,
  IncidentStats,
  IncidentSearchResult,
  IncidentServiceError,
  CreateIncidentSchema,
  UpdateIncidentSchema,
  GetIncidentsOptionsSchema
} from './types';

/**
 * IncidentRepository handles direct database operations for incidents
 */
export class IncidentRepository {
  /**
   * Create a new incident
   */
  static async create(
    incidentData: CreateIncidentRequest,
    reporterId: string,
    schoolId: number
  ): Promise<IncidentWithDetails> {
    // Validate input data
    const validatedData = CreateIncidentSchema.parse(incidentData);
    
    const insertData = {
      ...validatedData,
      reporter_id: reporterId,
      school_id: schoolId,
      status: 'open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    logger.debug('Creating incident', {
      operation: 'incident_create',
      reporterId,
      schoolId,
      incidentType: validatedData.incident_type
    });
    
    const { data: newIncident, error } = await supabase
      .from('incidents')
      .insert(insertData)
      .select(`
        *,
        profiles!incidents_student_id_fkey(full_name),
        reporter:profiles!incidents_reporter_id_fkey(full_name)
      `)
      .single();

    if (error) {
      logger.error('Failed to create incident', {
        error: error.message,
        code: error.code,
        operation: 'incident_create',
        reporterId,
        schoolId
      });
      
      throw IncidentServiceError.create(
        'DATABASE_ERROR',
        'Failed to create incident',
        { originalError: error, incidentData: validatedData }
      );
    }

    // Transform to IncidentWithDetails
    const incident: IncidentWithDetails = {
      ...newIncident,
      student_name: newIncident.profiles?.full_name,
      reporter_name: newIncident.reporter?.full_name,
      severity: newIncident.severity || 'medium'
    };

    return incident;
  }

  /**
   * Get incident by ID
   */
  static async getById(incidentId: number): Promise<IncidentWithDetails | null> {
    const { data, error } = await supabase
      .from('incidents')
      .select(`
        *,
        profiles!incidents_student_id_fkey(full_name),
        reporter:profiles!incidents_reporter_id_fkey(full_name),
        resolver:profiles!incidents_resolved_by_fkey(full_name)
      `)
      .eq('id', incidentId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Incident not found
      }
      throw IncidentServiceError.create(
        'DATABASE_ERROR',
        'Failed to fetch incident',
        { originalError: error, incidentId }
      );
    }

    // Transform to IncidentWithDetails
    const incident: IncidentWithDetails = {
      ...data,
      student_name: data.profiles?.full_name,
      reporter_name: data.reporter?.full_name,
      resolved_by: data.resolver?.full_name,
      severity: data.severity || 'medium'
    };

    return incident;
  }

  /**
   * Get incidents for a school with filtering and pagination
   */
  static async getBySchool(
    schoolId: number,
    options: GetIncidentsOptions = {}
  ): Promise<{ incidents: IncidentWithDetails[]; total: number }> {
    // Validate options
    const validatedOptions = GetIncidentsOptionsSchema.parse(options);
    
    // Build the base query
    let queryBuilder = supabase
      .from('incidents')
      .select(`
        *,
        profiles!incidents_student_id_fkey(full_name),
        reporter:profiles!incidents_reporter_id_fkey(full_name),
        resolver:profiles!incidents_resolved_by_fkey(full_name)
      `, { count: 'exact' })
      .eq('school_id', schoolId);
        
    // Apply filters
    if (validatedOptions.status) {
      queryBuilder = queryBuilder.eq('status', validatedOptions.status);
    }

    if (validatedOptions.incident_type) {
      queryBuilder = queryBuilder.eq('incident_type', validatedOptions.incident_type);
    }

    if (validatedOptions.severity) {
      queryBuilder = queryBuilder.eq('severity', validatedOptions.severity);
    }

    if (validatedOptions.student_id) {
      queryBuilder = queryBuilder.eq('student_id', validatedOptions.student_id);
    }

    if (validatedOptions.reporter_id) {
      queryBuilder = queryBuilder.eq('reporter_id', validatedOptions.reporter_id);
    }

    if (validatedOptions.date_from) {
      queryBuilder = queryBuilder.gte('created_at', validatedOptions.date_from);
    }

    if (validatedOptions.date_to) {
      queryBuilder = queryBuilder.lte('created_at', validatedOptions.date_to);
    }

    // Apply sorting
    const { column, ascending } = sanitizeSortParams(
      validatedOptions.sortBy || 'created_at',
      validatedOptions.sortOrder || 'desc',
      ['created_at', 'updated_at', 'severity', 'status']
    );
    queryBuilder = queryBuilder.order(column, { ascending });

    // Apply pagination
    const limit = validatedOptions.limit || 10;
    const offset = ((validatedOptions.page || 1) - 1) * limit;
    queryBuilder = queryBuilder.range(offset, offset + limit - 1);

    const { data, error, count } = await queryBuilder;

    if (error) {
      throw IncidentServiceError.create(
        'DATABASE_ERROR',
        'Failed to fetch incidents',
        { originalError: error, schoolId, options: validatedOptions }
      );
    }

    // Transform the data
    const incidents: IncidentWithDetails[] = (data || []).map((incident: any) => ({
      ...incident,
      student_name: incident.profiles?.full_name,
      reporter_name: incident.reporter?.full_name,
      resolved_by: incident.resolver?.full_name,
      severity: incident.severity || 'medium'
    }));

    return {
      incidents,
      total: count || 0
    };
  }

  /**
   * Update an incident
   */
  static async update(
    incidentId: number,
    updateData: UpdateIncidentRequest,
    updatedBy: string
  ): Promise<IncidentWithDetails> {
    // Validate input data
    const validatedData = UpdateIncidentSchema.parse(updateData);
    
    const updatePayload = {
      ...validatedData,
      updated_at: new Date().toISOString(),
      ...(validatedData.status === 'resolved' && {
        resolved_at: new Date().toISOString(),
        resolved_by: updatedBy
      })
    };
    
    const { data: updatedIncident, error } = await supabase
      .from('incidents')
      .update(updatePayload)
      .eq('id', incidentId)
      .select(`
        *,
        profiles!incidents_student_id_fkey(full_name),
        reporter:profiles!incidents_reporter_id_fkey(full_name),
        resolver:profiles!incidents_resolved_by_fkey(full_name)
      `)
      .single();

    if (error) {
      throw IncidentServiceError.create(
        'DATABASE_ERROR',
        'Failed to update incident',
        { originalError: error, incidentId, updateData: validatedData }
      );
    }

    // Transform to IncidentWithDetails
    const incident: IncidentWithDetails = {
      ...updatedIncident,
      student_name: updatedIncident.profiles?.full_name,
      reporter_name: updatedIncident.reporter?.full_name,
      resolved_by: updatedIncident.resolver?.full_name,
      severity: updatedIncident.severity || 'medium'
    };

    return incident;
  }

  /**
   * Delete an incident (soft delete by setting status to closed)
   */
  static async softDelete(incidentId: number, deletedBy: string): Promise<void> {
    const { error } = await supabase
      .from('incidents')
      .update({
        status: 'closed',
        updated_at: new Date().toISOString(),
        resolved_by: deletedBy,
        resolved_at: new Date().toISOString(),
        resolution_notes: 'Incident closed/deleted'
      })
      .eq('id', incidentId);

    if (error) {
      throw IncidentServiceError.create(
        'DATABASE_ERROR',
        'Failed to delete incident',
        { originalError: error, incidentId, deletedBy }
      );
    }
  }

  /**
   * Get incident statistics for a school
   */
  static async getStats(schoolId: number): Promise<IncidentStats> {
    // Get all incidents for the school
    const { data: incidents, error } = await supabase
      .from('incidents')
      .select('status, incident_type, severity, created_at')
      .eq('school_id', schoolId);

    if (error) {
      throw IncidentServiceError.create(
        'DATABASE_ERROR',
        'Failed to fetch incident statistics',
        { originalError: error, schoolId }
      );
    }

    // Calculate statistics
    const stats: IncidentStats = {
      total: incidents?.length || 0,
      open: 0,
      investigating: 0,
      resolved: 0,
      closed: 0,
      by_type: {
        disciplinary: 0,
        academic: 0,
        health: 0,
        safety: 0,
        other: 0
      },
      by_severity: {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0
      },
      recent_trend: {
        this_week: 0,
        last_week: 0,
        this_month: 0,
        last_month: 0
      }
    };

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    incidents?.forEach((incident) => {
      // Count by status
      stats[incident.status as keyof typeof stats]++;
      
      // Count by type
      stats.by_type[incident.incident_type as keyof typeof stats.by_type]++;
      
      // Count by severity
      const severity = incident.severity || 'medium';
      stats.by_severity[severity as keyof typeof stats.by_severity]++;
      
      // Count by time period
      const createdAt = new Date(incident.created_at);
      if (createdAt >= oneWeekAgo) {
        stats.recent_trend.this_week++;
      } else if (createdAt >= twoWeeksAgo) {
        stats.recent_trend.last_week++;
      }
      
      if (createdAt >= oneMonthAgo) {
        stats.recent_trend.this_month++;
      } else if (createdAt >= twoMonthsAgo) {
        stats.recent_trend.last_month++;
      }
    });

    return stats;
  }
}

/**
 * IncidentService provides high-level operations for incident management
 */
export class IncidentService {
  /**
   * Create a new incident
   */
  static async createIncident(
    incidentData: CreateIncidentRequest,
    reporterId: string,
    schoolId: number
  ): Promise<IncidentWithDetails> {
    return IncidentRepository.create(incidentData, reporterId, schoolId);
  }

  /**
   * Get incident by ID
   */
  static async getIncidentById(incidentId: number): Promise<IncidentWithDetails | null> {
    return IncidentRepository.getById(incidentId);
  }

  /**
   * Get incidents for a school with filtering and pagination
   */
  static async getIncidents(
    schoolId: number,
    options: GetIncidentsOptions = {}
  ): Promise<IncidentSearchResult> {
    const { incidents, total } = await IncidentRepository.getBySchool(schoolId, options);

    const limit = options.limit || 10;
    const page = options.page || 1;
    const totalPages = Math.ceil(total / limit);

    return {
      incidents,
      total,
      page,
      limit,
      totalPages
    };
  }

  /**
   * Update an incident
   */
  static async updateIncident(
    incidentId: number,
    updateData: UpdateIncidentRequest,
    updatedBy: string
  ): Promise<IncidentWithDetails> {
    return IncidentRepository.update(incidentId, updateData, updatedBy);
  }

  /**
   * Delete an incident
   */
  static async deleteIncident(incidentId: number, deletedBy: string): Promise<void> {
    return IncidentRepository.softDelete(incidentId, deletedBy);
  }

  /**
   * Get incident statistics for a school
   */
  static async getIncidentStats(schoolId: number): Promise<IncidentStats> {
    return IncidentRepository.getStats(schoolId);
  }

  /**
   * Get incidents with statistics (combined call)
   */
  static async getIncidentsWithStats(
    schoolId: number,
    options: GetIncidentsOptions = {}
  ): Promise<IncidentSearchResult> {
    const [incidentResult, stats] = await Promise.all([
      this.getIncidents(schoolId, options),
      this.getIncidentStats(schoolId)
    ]);

    return {
      ...incidentResult,
      stats
    };
  }

  /**
   * Legacy function for backward compatibility
   * Fetches the most recent incidents for a given school
   */
  static async fetchIncidentsForSchool(
    schoolId: number,
    limit: number = 5
  ): Promise<DatabaseResponse<Incident[]>> {
    try {
      if (!schoolId) {
        return { data: null, error: new Error('School ID is required to fetch incidents.') };
      }

      const { data, error } = await supabase
        .from('incidents')
        .select(`
          id,
          incident_type,
          description,
          location,
          status,
          created_at,
          is_anonymous,
          student_id,
          profiles!incidents_student_id_fkey(full_name),
          reporter_id
        `)
        .eq('school_id', schoolId)
        .order('created_at', { ascending: false })
        .limit(limit);

      return { data, error };
    } catch (err) {
      logger.error('Service error fetching incidents for school', {
        error: err instanceof Error ? err.message : String(err),
        schoolId,
        limit,
        operation: 'fetchIncidentsForSchool'
      });
      return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
    }
  }

  /**
   * Resolve an incident with resolution notes
   */
  static async resolveIncident(
    incidentId: number,
    resolutionNotes: string,
    resolvedBy: string
  ): Promise<IncidentWithDetails> {
    return this.updateIncident(incidentId, {
      status: 'resolved',
      resolution_notes: resolutionNotes
    }, resolvedBy);
  }

  /**
   * Reopen a resolved incident
   */
  static async reopenIncident(
    incidentId: number,
    reopenedBy: string,
    reason?: string
  ): Promise<IncidentWithDetails> {
    return this.updateIncident(incidentId, {
      status: 'open',
      resolution_notes: reason ? `Reopened: ${reason}` : 'Incident reopened'
    }, reopenedBy);
  }

  /**
   * Get incidents by student
   */
  static async getIncidentsByStudent(
    studentId: string,
    schoolId: number,
    options: Omit<GetIncidentsOptions, 'student_id'> = {}
  ): Promise<IncidentSearchResult> {
    return this.getIncidents(schoolId, {
      ...options,
      student_id: studentId
    });
  }

  /**
   * Get incidents by reporter
   */
  static async getIncidentsByReporter(
    reporterId: string,
    schoolId: number,
    options: Omit<GetIncidentsOptions, 'reporter_id'> = {}
  ): Promise<IncidentSearchResult> {
    return this.getIncidents(schoolId, {
      ...options,
      reporter_id: reporterId
    });
  }
}
