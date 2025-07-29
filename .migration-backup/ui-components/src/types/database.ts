// Database schema types for Supabase queries
// These types represent the actual database structure

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
      student_details: {
        Row: {
          user_id: string;
          nis: string | null;
          date_of_birth: string | null;
          gender: 'M' | 'F' | null;
          boarding: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          nis?: string | null;
          date_of_birth?: string | null;
          gender?: 'M' | 'F' | null;
          boarding?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          nis?: string | null;
          date_of_birth?: string | null;
          gender?: 'M' | 'F' | null;
          boarding?: boolean | null;
          updated_at?: string;
        };
      };
      teacher_details: {
        Row: {
          user_id: string;
          employee_id: string | null;
          hire_date: string | null;
          specialty: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          employee_id?: string | null;
          hire_date?: string | null;
          specialty?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          employee_id?: string | null;
          hire_date?: string | null;
          specialty?: string | null;
          updated_at?: string;
        };
      };
      parent_details: {
        Row: {
          user_id: string;
          phone_number: string | null;
          address: string | null;
          occupation: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          phone_number?: string | null;
          address?: string | null;
          occupation?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          phone_number?: string | null;
          address?: string | null;
          occupation?: string | null;
          updated_at?: string;
        };
      };
      management_details: {
        Row: {
          user_id: string;
          position: string | null;
          hire_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          position?: string | null;
          hire_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          position?: string | null;
          hire_date?: string | null;
          updated_at?: string;
        };
      };
      classes: {
        Row: {
          id: number;
          name: string;
          level: string;
          description: string | null;
          status: 'active' | 'inactive' | 'archived';
          student_capacity: number;
          academic_year: string;
          semester: '1' | '2';
          school_id: number;
          created_by: string;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          name: string;
          level: string;
          description?: string | null;
          status?: 'active' | 'inactive' | 'archived';
          student_capacity?: number;
          academic_year: string;
          semester: '1' | '2';
          school_id: number;
          created_by: string;
          updated_by?: string | null;
        };
        Update: {
          name?: string;
          level?: string;
          description?: string | null;
          status?: 'active' | 'inactive' | 'archived';
          student_capacity?: number;
          academic_year?: string;
          semester?: '1' | '2';
          updated_by?: string | null;
        };
      };
      class_teachers: {
        Row: {
          class_id: number;
          user_id: string;
          role: string;
          assigned_date: string;
          created_at: string;
        };
        Insert: {
          class_id: number;
          user_id: string;
          role?: string;
          assigned_date?: string;
          created_at?: string;
        };
        Update: {
          role?: string;
          assigned_date?: string;
        };
      };
      class_students: {
        Row: {
          class_id: number;
          student_id: string;
          enrollment_date: string;
          created_at: string;
        };
        Insert: {
          class_id: number;
          student_id: string;
          enrollment_date?: string;
          created_at?: string;
        };
        Update: {
          enrollment_date?: string;
        };
      };
      class_subjects: {
        Row: {
          id: number;
          class_id: number;
          subject_name: string;
          subject_code: string;
          created_at: string;
        };
        Insert: {
          class_id: number;
          subject_name: string;
          subject_code: string;
          created_at?: string;
        };
        Update: {
          subject_name?: string;
          subject_code?: string;
        };
      };
      student_performance: {
        Row: {
          id: number;
          user_id: string;
          period_start: string;
          period_end: string;
          academic_score: number | null;
          quran_score: number | null;
          attendance_pct: number | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          period_start: string;
          period_end: string;
          academic_score?: number | null;
          quran_score?: number | null;
          attendance_pct?: number | null;
          created_at?: string;
        };
        Update: {
          period_start?: string;
          period_end?: string;
          academic_score?: number | null;
          quran_score?: number | null;
          attendance_pct?: number | null;
        };
      };
      teacher_performance: {
        Row: {
          id: number;
          user_id: string;
          period_start: string;
          period_end: string;
          class_observation: number | null;
          punctuality_score: number | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          period_start: string;
          period_end: string;
          class_observation?: number | null;
          punctuality_score?: number | null;
          created_at?: string;
        };
        Update: {
          period_start?: string;
          period_end?: string;
          class_observation?: number | null;
          punctuality_score?: number | null;
        };
      };
      incidents: {
        Row: {
          id: number;
          incident_type: string;
          description: string;
          location: string;
          incident_date: string;
          status: string;
          is_anonymous: boolean;
          reporter_id: string;
          student_id: string | null;
          school_id: number;
          created_at: string;
        };
        Insert: {
          incident_type: string;
          description: string;
          location: string;
          incident_date: string;
          status?: string;
          is_anonymous?: boolean;
          reporter_id: string;
          student_id?: string | null;
          school_id: number;
          created_at?: string;
        };
        Update: {
          incident_type?: string;
          description?: string;
          location?: string;
          incident_date?: string;
          status?: string;
          is_anonymous?: boolean;
          student_id?: string | null;
        };
      };
      schools: {
        Row: {
          id: number;
          name: string;
          npsn: string;
          address: string;
          phone: string;
          email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          npsn: string;
          address: string;
          phone: string;
          email: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          npsn?: string;
          address?: string;
          phone?: string;
          email?: string;
          updated_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: number;
          table_name: string;
          operation: string;
          record_id: string;
          old_values: any | null;
          new_values: any | null;
          user_id: string;
          created_at: string;
          metadata: any | null;
        };
        Insert: {
          table_name: string;
          operation: string;
          record_id: string;
          old_values?: any | null;
          new_values?: any | null;
          user_id: string;
          created_at?: string;
          metadata?: any | null;
        };
        Update: {
          table_name?: string;
          operation?: string;
          record_id?: string;
          old_values?: any | null;
          new_values?: any | null;
          user_id?: string;
          metadata?: any | null;
        };
      };
      class_audit_log: {
        Row: {
          id: number;
          class_id: number;
          action: string;
          changed_fields: string[] | null;
          old_values: any | null;
          new_values: any | null;
          performed_by: string;
          created_at: string;
        };
        Insert: {
          class_id: number;
          action: string;
          changed_fields?: string[] | null;
          old_values?: any | null;
          new_values?: any | null;
          performed_by: string;
          created_at?: string;
        };
        Update: {
          class_id?: number;
          action?: string;
          changed_fields?: string[] | null;
          old_values?: any | null;
          new_values?: any | null;
          performed_by?: string;
          created_at?: string;
        };
      };
    };
    Enums: {
      user_role: 'student' | 'teacher' | 'parent' | 'management';
      class_status: 'active' | 'inactive' | 'archived';
      gender: 'M' | 'F';
      semester: '1' | '2';
      incident_status: 'pending' | 'investigating' | 'resolved' | 'closed';
      audit_operation: 'INSERT' | 'UPDATE' | 'DELETE';
    };
    Functions: {
      add_students_to_class_atomic: {
        Args: {
          p_class_id: number;
          p_student_ids: string[];
          p_teacher_id: string;
          p_school_id: number;
        };
        Returns: {
          success: string[];
          errors: { student_id: string; error: string }[];
          total_added: number;
        }[];
      };
    };
  };
}

// Export type helpers for better type safety
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
export type Enums = Database['public']['Enums'];

// Common database response types
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

// Error types for better error handling
export interface DatabaseError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

// Utility types for nullable fields
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;