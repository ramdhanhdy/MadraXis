export interface ClassData {
  id: number;
  name: string;
  level: string;
  description?: string;
  studentCount: number;
  progress: number;
  school_id: number;
  teacher_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateClassData {
  name: string;
  level: string;
  description?: string;
  school_id: number;
  teacher_id?: string;
}

export interface UpdateClassData {
  name?: string;
  level?: string;
  description?: string;
  teacher_id?: string;
}

export interface ClassStudent {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  class_id: number;
  enrollment_date: string;
  progress: number;
}

export interface ClassSchedule {
  id: string;
  class_id: number;
  day_of_week: number; // 0-6 (Sunday-Saturday)
  start_time: string; // "HH:MM"
  end_time: string; // "HH:MM"
  subject?: string;
  room?: string;
}

export interface ClassAttendance {
  id: string;
  class_id: number;
  student_id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
}

export interface ClassPerformance {
  classId: number;
  totalStudents: number;
  averageProgress: number;
  attendanceRate: number;
  recentIncidents: number;
}