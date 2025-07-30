/**
 * Global Type Declarations
 *
 * This file consolidates all global type definitions for the MadraXis application.
 * It serves as the single source of truth for all shared types across the codebase.
 *
 * Organization:
 * - Core User & Profile Types
 * - Database Schema Types
 * - Class Management Types
 * - Dashboard & UI Types
 * - Student Management Types
 * - Utility & Helper Types
 */

// =============================================================================
// CORE USER & PROFILE TYPES
// =============================================================================

/**
 * Core user identity from the unified profiles table
 */
export interface Profile {
  id: string;  // UUID from auth.users
  full_name: string;  // Single canonical name field
  role: 'student' | 'teacher' | 'parent' | 'management';
  school_id: number;
  created_at: string;
  updated_at: string;
}

/**
 * Role-specific detail interfaces
 */
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

// =============================================================================
// CLASS MANAGEMENT TYPES
// =============================================================================

/**
 * Core class entity
 */
export interface Class {
  id: number;
  name: string;
  level: string;
  description?: string;
  status: 'active' | 'inactive' | 'archived';
  student_capacity: number;
  student_count: number;
  subject_count: number;
  teacher_count: number;
  academic_year: string;
  semester: '1' | '2';
  school_id: number;
  created_by: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  teachers?: Array<{
    user_id: string;
    role: string;
    full_name: string;
  }>;
}

/**
 * Class creation data
 */
export interface CreateClassData {
  name: string;
  level: string;
  description?: string;
  school_id: number;
  student_capacity?: number;
  academic_year: string;
  semester: '1' | '2';
}

/**
 * Class update data
 */
export interface UpdateClassData {
  name?: string;
  level?: string;
  description?: string;
  student_capacity?: number;
  status?: 'active' | 'inactive' | 'archived';
  academic_year?: string;
  semester?: '1' | '2';
}

/**
 * Class filtering options
 */
export interface ClassFilters {
  search?: string;
  status?: string;
  level?: string;
  academic_year?: string;
  semester?: string;
  sortBy?: 'name' | 'level' | 'student_count' | 'created_at' | 'updated_at';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

/**
 * Bulk operations for classes
 */
export interface BulkUpdateClassesData {
  class_ids: number[];
  updates: Partial<UpdateClassData>;
}

export interface BulkDeleteClassesData {
  class_ids: number[];
}

/**
 * Class API response
 */
export interface ClassResponse {
  success: boolean;
  data?: Class[];
  message?: string;
  error?: string;
  meta?: {
    total: number;
    limit: number;
    offset: number;
  };
}

// =============================================================================
// STUDENT MANAGEMENT TYPES
// =============================================================================

// Note: Student interface is already defined above in the Core User & Profile Types section

/**
 * Student filtering options
 */
export interface StudentFilters {
  gradeLevel?: 'SMA' | 'SMP';
  boarding?: boolean;
  search?: string;
}

/**
 * Class-student relationship
 */
export interface ClassStudent {
  id: number;
  class_id: number;
  student_id: string;
  enrolled_at: string;
  enrolled_by: string;
}

// =============================================================================
// DASHBOARD & UI TYPES
// =============================================================================

import { Ionicons } from '@expo/vector-icons';

/**
 * Dashboard quick action configuration
 */
export interface QuickActionConfig {
    title: string;
    subtitle?: string;
    icon: keyof typeof Ionicons.glyphMap;
    badge?: number;
    onPress: () => void;
    accessibilityLabel?: string;
    accessibilityHint?: string;
}

/**
 * Progress indicator configuration
 */
export interface ProgressConfig {
    label: string;
    value: number;
    variant: 'default' | 'success' | 'warning' | 'error';
    showLabel?: boolean;
    showPercentage?: boolean;
}

/**
 * Dashboard data structure
 */
export interface DashboardData {
    quickActions: QuickActionConfig[];
    progressData: ProgressConfig[];
    upcomingAssignments?: Assignment[];
    todaySchedule?: ScheduleItem[];
}

/**
 * Assignment entity
 */
export interface Assignment {
    id: string;
    title: string;
    subject: string;
    dueDate: string;
    status: 'pending' | 'submitted' | 'graded';
}

/**
 * Schedule item entity
 */
export interface ScheduleItem {
    id: string;
    subject: string;
    time: string;
    room: string;
    teacher: string;
}

/**
 * Dashboard metrics (from services/dashboard.ts)
 */
export interface DashboardMetrics {
  studentEnrollment: number;
  teacherCount: number;
  teacherToStudentRatio: number;
  incidentSummary: {
    total: number;
    pending: number;
    resolved: number;
  };
  academicPerformance: {
    averageScore: number;
  };
  teacherPerformance: {
    averageScore: number;
  };
  studentAttendance: {
    averagePercentage: number;
  };
  parentEngagement: {
    meetingsHeld: number;
  };
}

// =============================================================================
// DATABASE SCHEMA TYPES
// =============================================================================

/**
 * Main Supabase database schema interface
 * Note: This is a simplified version. For the complete schema, see the original database.ts
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          role: 'student' | 'teacher' | 'parent' | 'management';
          school_id: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          role: 'student' | 'teacher' | 'parent' | 'management';
          school_id: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string;
          role?: 'student' | 'teacher' | 'parent' | 'management';
          school_id?: number;
          updated_at?: string;
        };
      };
      // Additional tables would be defined here...
      // For complete schema, refer to the original database.ts file
    };
    Enums: {
      user_role: 'student' | 'teacher' | 'parent' | 'management';
      class_status: 'active' | 'inactive' | 'archived';
      gender: 'M' | 'F';
      semester: '1' | '2';
      incident_status: 'pending' | 'investigating' | 'resolved' | 'closed';
      audit_operation: 'INSERT' | 'UPDATE' | 'DELETE';
    };
  };
}

/**
 * Database utility types
 */
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
export type Enums = Database['public']['Enums'];

/**
 * Common database response types
 */
export interface DatabaseResponse<T> {
  data: T | null;
  error: Error | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// =============================================================================
// INCIDENT MANAGEMENT TYPES
// =============================================================================

/**
 * Incident interface for school incident management
 */
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

// =============================================================================
// UTILITY & HELPER TYPES
// =============================================================================

/**
 * Common utility types used throughout the application
 */
export type UserRole = 'student' | 'teacher' | 'parent' | 'management';
export type ClassStatus = 'active' | 'inactive' | 'archived';
export type Gender = 'M' | 'F';
export type Semester = '1' | '2';
export type IncidentStatus = 'pending' | 'investigating' | 'resolved' | 'closed';

/**
 * API Response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    [key: string]: any;
  };
}