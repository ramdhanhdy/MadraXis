// Core user identity from the unified profiles table
export interface Profile {
  id: string;  // UUID from auth.users
  full_name: string;  // Single canonical name field
  role: 'student' | 'teacher' | 'parent' | 'management';
  school_id: number;
  created_at: string;
  updated_at: string;
}

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