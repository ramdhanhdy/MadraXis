// Core user identity from the unified profiles table
export interface Profile {
  id: string;  // UUID from auth.users
  full_name: string;  // Single canonical name field
  role: 'student' | 'teacher' | 'parent' | 'management';
  school_id: number;
  created_at: string;
  updated_at: string;
}

// Import database types for consistency
export type { Database } from '../types/database';

// Role-specific detail interfaces
export interface StudentDetails {
  user_id: string;  // FK to profiles.id
  nis?: string;     // National Student Number
  date_of_birth?: string;
  gender?: 'M' | 'F';
  boarding?: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeacherDetails {
  user_id: string;  // FK to profiles.id
  employee_id?: string;
  hire_date?: string;
  specialty?: string;
  created_at: string;
  updated_at: string;
}

export interface ParentDetails {
  user_id: string;  // FK to profiles.id
  phone_number?: string;
  address?: string;
  occupation?: string;
  created_at: string;
  updated_at: string;
}

export interface ManagementDetails {
  user_id: string;  // FK to profiles.id
  position?: string;
  hire_date?: string;
  created_at: string;
  updated_at: string;
}

// Performance tracking interfaces
export interface StudentPerformance {
  id: number;
  user_id: string;  // FK to profiles.id
  period_start: string;
  period_end: string;
  academic_score?: number;
  quran_score?: number;
  attendance_pct?: number;
  created_at: string;
}

export interface TeacherPerformance {
  id: number;
  user_id: string;  // FK to profiles.id
  period_start: string;
  period_end: string;
  class_observation?: number;
  punctuality_score?: number;
  created_at: string;
}

// Composite interfaces for common use cases
export interface Student extends Profile {
  role: 'student';
  details?: StudentDetails;
  performance?: StudentPerformance[];
  class_name?: string;
  parent_name?: string;
  parent_phone?: string;
  address?: string;
  // For backward compatibility with existing Quran progress tracking
  quran_progress?: {
    memorized_verses: number;
    total_verses: number;
  };
}

export interface Teacher extends Profile {
  role: 'teacher';
  details?: TeacherDetails;
  performance?: TeacherPerformance[];
}

export interface Parent extends Profile {
  role: 'parent';
  details?: ParentDetails;
}

export interface Management extends Profile {
  role: 'management';
  details?: ManagementDetails;
}

// Union type for any user profile
export type UserProfile = Student | Teacher | Parent | Management;

// Legacy compatibility types for existing code
export interface LegacyStudent {
  id: string;
  name: string;  // Maps to Profile.full_name
  class?: string;
  image_url?: string;
  quran_progress?: {
    memorized_verses: number;
    total_verses: number;
  };
  // Additional legacy fields that may exist
  gender?: string;
  birth_date?: string;
  parent_name?: string;
  phone?: string;
  address?: string;
}

// Type for the raw Supabase query result in `fetchStudentById`
export interface StudentWithRelations extends Profile {
  student_details: StudentDetails[] | null;
  student_performance: StudentPerformance[] | null;
  class_students: {
    classes: {
      name: string;
    } | null;
  }[] | null;
  student_parent: {
    parent_profile: {
      full_name: string;
      parent_details: {
        phone_number: string | null;
        address: string | null;
      }[] | null;
    } | null;
  }[] | null;
}

// Helper type for database query results
export interface StudentWithDetails {
  id: string;
  full_name: string;
  role: 'student';
  school_id: number;
  created_at: string;
  updated_at: string;
  nis?: string;
  date_of_birth?: string;
  gender?: 'M' | 'F';
  boarding?: boolean;
}

// Incident interface for school incident management
export interface Incident {
  id: number;
  incident_type: string;
  description: string;
  location: string;
  status: string;
  created_at: string;
  student?: {
    full_name: string;
  };
  is_anonymous?: boolean;
  reporter_id: string; // Required field for tracking incident reporters
}