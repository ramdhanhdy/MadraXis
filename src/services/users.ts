import { supabase } from '../utils/supabase';
import { Student, Teacher, Profile, StudentWithDetails, LegacyStudent, StudentWithRelations } from '../types';

/**
 * Fetch all students for a school using the new unified schema
 * Uses the compatibility view or joins profiles + student_details
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
 * Fetch a single student by ID with all details
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
        ),
        class_students!left (
          classes (
            name
          )
        ),
        student_parent!left (
          parent_profile:profiles!inner (
            full_name,
            parent_details (
              phone_number,
              address
            )
          )
        )
      `)
      .eq('id', studentId)
      .eq('role', 'student')
      .single<StudentWithRelations>();

    if (error) {
      console.error('Error fetching student by ID:', error);
      return { data: null, error };
    }

    if (!data) {
      return { data: null, error: { message: 'Student not found' } };
    }

    // Transform to Student interface by explicitly mapping fields
    const student: Student = {
      // Base profile fields
      id: data.id,
      full_name: data.full_name,
      role: 'student',
      school_id: data.school_id,
      created_at: data.created_at,
      updated_at: data.updated_at,
      
      // Mapped-in fields for Student
      details: data.student_details?.[0] || undefined,
      performance: data.student_performance || [],
      class_name: data.class_students?.[0]?.classes?.name,
      parent_name: data.student_parent?.[0]?.parent_profile?.full_name,
      parent_phone: data.student_parent?.[0]?.parent_profile?.parent_details?.[0]?.phone_number ?? undefined,
      address: data.student_parent?.[0]?.parent_profile?.parent_details?.[0]?.address ?? undefined,
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
 * Fetch all teachers for a school
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
 * Legacy compatibility function that returns students in the old format
 * This helps ease the transition for existing components
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
 * Fetch user profile by ID (works for any role)
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
 * Search students by name
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