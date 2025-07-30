export interface Student {
  id: string;
  full_name: string;
  email?: string;
  role: 'student';
  school_id: number;
  created_at: string;
  updated_at: string;
  student_details?: {
    nis: string;
    grade_level: 'SMA' | 'SMP';
    boarding: boolean;
    created_at: string;
    updated_at: string;
  };
}

export interface StudentFilters {
  gradeLevel?: 'SMA' | 'SMP';
  boarding?: boolean;
  search?: string;
}

export interface ClassStudent {
  id: number;
  class_id: number;
  student_id: string;
  enrolled_at: string;
  enrolled_by: string;
}