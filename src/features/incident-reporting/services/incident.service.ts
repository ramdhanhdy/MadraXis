import { supabase } from '@/src/utils/supabase';
import { Incident, CreateIncidentData, IncidentFilters } from '../types';

export const fetchIncidentsForSchool = async (schoolId: number, limit: number = 5) => {
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
      reporter:profiles(id, full_name) 
    `)
    .eq('school_id', schoolId)
    .order('created_at', { ascending: false })
    .limit(limit);

  return { data, error };
};

export const fetchAllIncidents = async (schoolId: number, filters?: IncidentFilters) => {
  if (!schoolId) {
    return { data: null, error: new Error('School ID is required to fetch incidents.') };
  }

  let query = supabase
    .from('incidents')
    .select(`
      id,
      incident_type,
      description,
      location,
      status,
      created_at,
      
      is_anonymous,
      reporter:profiles(id, full_name) 
    `)
    .eq('school_id', schoolId)
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.type) {
    query = query.eq('incident_type', filters.type);
  }

  if (filters?.dateFrom) {
    query = query.gte('created_at', filters.dateFrom);
  }

  if (filters?.dateTo) {
    query = query.lte('created_at', filters.dateTo);
  }

  const { data, error } = await query;

  return { data, error };
};

export const createIncident = async (incidentData: CreateIncidentData) => {
  const { data, error } = await supabase
    .from('incidents')
    .insert(incidentData)
    .select(`
      id,
      incident_type,
      description,
      location,
      status,
      created_at,
      
      is_anonymous,
      reporter:profiles(id, full_name) 
    `)
    .single();

  return { data, error };
};

export const updateIncidentStatus = async (incidentId: string, status: string) => {
  const { data, error } = await supabase
    .from('incidents')
    .update({ status })
    .eq('id', incidentId)
    .select(`
      id,
      incident_type,
      description,
      location,
      status,
      created_at,
      
      is_anonymous,
      reporter:profiles(id, full_name) 
    `)
    .single();

  return { data, error };
};

export const deleteIncident = async (incidentId: string) => {
  const { error } = await supabase
    .from('incidents')
    .delete()
    .eq('id', incidentId);

  return { error };
};

export const getIncidentSummary = async (schoolId: number) => {
  if (!schoolId) {
    return { data: null, error: new Error('School ID is required to fetch incident summary.') };
  }

  const { data, error } = await supabase
    .from('incidents')
    .select('status')
    .eq('school_id', schoolId);

  if (error) {
    return { data: null, error };
  }

  const incidents = data || [];
  const summary = {
    total: incidents.length,
    pending: incidents.filter(i => i.status === 'pending').length,
    resolved: incidents.filter(i => i.status === 'resolved').length,
    escalated: incidents.filter(i => i.status === 'escalated').length,
  };

  return { data: summary, error: null };
};
