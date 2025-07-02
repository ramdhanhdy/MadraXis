import { supabase } from '../utils/supabase';
import { Student, Teacher, Profile, StudentWithDetails, LegacyStudent } from '../types';

/**
 * Retrieves a list of student profiles for a specified school, including associated student details.
 *
 * Queries the unified schema to fetch students by school ID, joining profile data with related student details. Optionally limits the number of results. Each student object includes a placeholder Quran progress field.
 *
 * @param schoolId - The ID of the school to fetch students for
 * @param limit - Optional maximum number of students to return
 * @returns An object containing an array of `Student` objects on success, or `null` and an error on failure
 */
export async function fetchStudents(schoolId: number, limit?: number): Promise<{ data: Student[] | null; error: any }> {
  try {
    let query = supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        role,
        school_id,
        created_at,
        updated_at,
        student_details (
          user_id,
          nis,
          date_of_birth,
          gender,
          boarding,
          created_at,
          updated_at
        )
      `)
      .eq('role', 'student')
      .eq('school_id', schoolId)
      .order('full_name');

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching students:', error);
      return { data: null, error };
    }

    // Transform to Student interface
    const students: Student[] = data?.map((profile: any) => ({
      ...profile,
      details: profile.student_details?.[0] || undefined,
      // For backward compatibility, map common fields
      quran_progress: {
        memorized_verses: 0, // TODO: Get from actual progress tracking
        total_verses: 6236   // Standard Quran verse count
      }
    })) || [];

    return { data: students, error: null };
  } catch (err) {
    console.error('Service error fetching students:', err);
    return { data: null, error: err };
  }
}

/**
 * Retrieves a single student profile by ID, including detailed student information and performance records.
 *
 * @param studentId - The unique identifier of the student to fetch
 * @returns An object containing the student data with details and performance, or an error if not found
 */
export async function fetchStudentById(studentId: string): Promise<{ data: Student | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        role,
        school_id,
        created_at,
        updated_at,
        student_details (
          user_id,
          nis,
          date_of_birth,
          gender,
          boarding,
          created_at,
          updated_at
        ),
        student_performance (
          id,
          user_id,
          period_start,
          period_end,
          academic_score,
          quran_score,
          attendance_pct,
          created_at
        )
      `)
      .eq('id', studentId)
      .eq('role', 'student')
      .single();

    if (error) {
      console.error('Error fetching student by ID:', error);
      return { data: null, error };
    }

    if (!data) {
      return { data: null, error: { message: 'Student not found' } };
    }

    // Transform to Student interface
    const student: Student = {
      ...data,
      details: data.student_details?.[0] || undefined,
      performance: data.student_performance || [],
      quran_progress: {
        memorized_verses: 0, // TODO: Get from actual progress tracking
        total_verses: 6236
      }
    };

    return { data: student, error: null };
  } catch (err) {
    console.error('Service error fetching student by ID:', err);
    return { data: null, error: err };
  }
}

/**
 * Retrieves teacher profiles for a specified school, including associated teacher details.
 *
 * @param schoolId - The ID of the school to fetch teachers from
 * @param limit - Optional maximum number of teacher profiles to return
 * @returns An object containing an array of `Teacher` objects with their details, or an error if the operation fails
 */
export async function fetchTeachers(schoolId: number, limit?: number): Promise<{ data: Teacher[] | null; error: any }> {
  try {
    let query = supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        role,
        school_id,
        created_at,
        updated_at,
        teacher_details (
          user_id,
          employee_id,
          hire_date,
          specialty,
          created_at,
          updated_at
        )
      `)
      .eq('role', 'teacher')
      .eq('school_id', schoolId)
      .order('full_name');

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching teachers:', error);
      return { data: null, error };
    }

    // Transform to Teacher interface
    const teachers: Teacher[] = data?.map((profile: any) => ({
      ...profile,
      details: profile.teacher_details?.[0] || undefined
    })) || [];

    return { data: teachers, error: null };
  } catch (err) {
    console.error('Service error fetching teachers:', err);
    return { data: null, error: err };
  }
}

/**
 * Retrieves students for a given school and returns them in a legacy-compatible format.
 *
 * Transforms student data into the `LegacyStudent` structure, providing placeholder values for fields not available in the current schema.
 *
 * @param schoolId - The ID of the school to fetch students from
 * @param limit - Optional maximum number of students to return
 * @returns An object containing an array of `LegacyStudent` objects or null if an error occurred, along with any error encountered
 */
export async function fetchStudentsLegacyFormat(schoolId: number, limit?: number): Promise<{ data: LegacyStudent[] | null; error: any }> {
  const { data: students, error } = await fetchStudents(schoolId, limit);
  
  if (error || !students) {
    return { data: null, error };
  }

  // Transform to legacy format
  const legacyStudents: LegacyStudent[] = students.map(student => ({
    id: student.id,
    name: student.full_name,
    class: '', // TODO: Get class assignment from class_students table
    image_url: '', // TODO: Add profile images if needed
    quran_progress: student.quran_progress,
    gender: student.details?.gender,
    birth_date: student.details?.date_of_birth,
    parent_name: '', // TODO: Get from parent relationship if needed
    phone: '', // TODO: Get from student_details or parent_details
    address: '' // TODO: Get from student_details
  }));

  return { data: legacyStudents, error: null };
}

/**
 * Retrieves a user profile by user ID, regardless of role.
 *
 * @param userId - The unique identifier of the user to fetch
 * @returns An object containing the user profile data or null if not found, and any error encountered
 */
export async function fetchUserProfile(userId: string): Promise<{ data: Profile | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Service error fetching user profile:', err);
    return { data: null, error: err };
  }
}

/**
 * Searches for student profiles within a school by partial match on full name.
 *
 * Performs a case-insensitive search for students whose names contain the specified search term, limited to the given number of results. Returns an array of `Student` objects with associated details and a placeholder Quran progress structure.
 *
 * @param schoolId - The ID of the school to search within
 * @param searchTerm - The partial name to search for
 * @param limit - The maximum number of results to return (default is 10)
 * @returns An object containing the array of matching students or null if an error occurred, along with any error information
 */
export async function searchStudents(schoolId: number, searchTerm: string, limit: number = 10): Promise<{ data: Student[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        role,
        school_id,
        created_at,
        updated_at,
        student_details (
          user_id,
          nis,
          date_of_birth,
          gender,
          boarding,
          created_at,
          updated_at
        )
      `)
      .eq('role', 'student')
      .eq('school_id', schoolId)
      .ilike('full_name', `%${searchTerm}%`)
      .limit(limit)
      .order('full_name');

    if (error) {
      console.error('Error searching students:', error);
      return { data: null, error };
    }

    // Transform to Student interface
    const students: Student[] = data?.map((profile: any) => ({
      ...profile,
      details: profile.student_details?.[0] || undefined,
      quran_progress: {
        memorized_verses: 0,
        total_verses: 6236
      }
    })) || [];

    return { data: students, error: null };
  } catch (err) {
    console.error('Service error searching students:', err);
    return { data: null, error: err };
  }
} 