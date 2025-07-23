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

export interface CreateClassData {
  name: string;
  level: string;
  description?: string;
  school_id: number;
  student_capacity?: number;
  academic_year: string;
  semester: '1' | '2';
}

export interface UpdateClassData {
  name?: string;
  level?: string;
  description?: string;
  student_capacity?: number;
  status?: 'active' | 'inactive' | 'archived';
  academic_year?: string;
  semester?: '1' | '2';
}

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

export interface BulkUpdateClassesData {
  class_ids: number[];
  updates: Partial<UpdateClassData>;
}

export interface BulkCreateClassesData {
  classes: CreateClassData[];
}

export interface BulkDeleteClassesData {
  class_ids: number[];
}

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