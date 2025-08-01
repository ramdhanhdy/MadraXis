import { supabase } from '../utils/supabase';
import { Incident } from '../types';
import type { DatabaseResponse } from '../types/database';

/**
 * Fetches the most recent incidents for a given school.
 * 
 * @param schoolId The ID of the school.
 * @param limit The maximum number of incidents to fetch.
 * @returns A promise that resolves with the incidents data and any potential error.
 */
export const fetchIncidentsForSchool = async (schoolId: number, limit: number = 5): Promise<DatabaseResponse<Incident[]>> => {
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
};
