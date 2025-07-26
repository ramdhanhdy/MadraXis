import { supabase } from '../utils/supabase';
import type { DatabaseResponse } from '../types/database';

/**
 * Interface for school data
 */
export interface School {
  id?: number;
  name: string;
  npsn: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Fetch school data by ID
 * @param schoolId The ID of the school to fetch
 * @returns School data
 */
export async function fetchSchoolById(schoolId: number): Promise<DatabaseResponse<School>> {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('id', schoolId)
      .single();

    if (error) {
      console.error('Error fetching school by ID:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Service error fetching school by ID:', err);
    return { data: null, error: err };
  }
}

/**
 * Create or update school information
 * @param schoolData The school data to save
 * @param schoolId Optional ID of the school to update; if not provided, a new school will be created
 * @returns The saved school data
 */
export async function saveSchool(schoolData: School, schoolId?: number): Promise<DatabaseResponse<School>> {
  try {
    let result;
    if (schoolId) {
      // Update existing school
      result = await supabase
        .from('schools')
        .update(schoolData)
        .eq('id', schoolId)
        .select('*')
        .single();
    } else {
      // Create new school
      result = await supabase
        .from('schools')
        .insert(schoolData)
        .select('*')
        .single();
    }

    const { data, error } = result;

    if (error) {
      console.error('Error saving school:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Service error saving school:', err);
    return { data: null, error: err };
  }
} 