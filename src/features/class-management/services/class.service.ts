import { supabase } from '@/src/utils/supabase';
import { ClassData, CreateClassData, UpdateClassData, ClassStudent, ClassSchedule, ClassAttendance, ClassPerformance } from '../types';

export const fetchClassesForSchool = async (schoolId: number) => {
  if (!schoolId) {
    return { data: null, error: new Error('School ID is required to fetch classes.') };
  }

  const { data, error } = await supabase
    .from('classes')
    .select(`
      *,
      teacher:teacher_id (
        full_name,
        email
      )
    `)
    .eq('school_id', schoolId)
    .order('created_at', { ascending: false });

  return { data, error };
};

export const fetchClassesForTeacher = async (teacherId: string) => {
  if (!teacherId) {
    return { data: null, error: new Error('Teacher ID is required to fetch classes.') };
  }

  const { data, error } = await supabase
    .from('classes')
    .select(`
      *,
      teacher:teacher_id (
        full_name,
        email
      )
    `)
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: false });

  return { data, error };
};

export const fetchClassById = async (classId: number) => {
  const { data, error } = await supabase
    .from('classes')
    .select(`
      *,
      teacher:teacher_id (
        full_name,
        email
      )
    `)
    .eq('id', classId)
    .single();

  return { data, error };
};

export const createClass = async (classData: CreateClassData) => {
  const { data, error } = await supabase
    .from('classes')
    .insert(classData)
    .select(`
      *,
      teacher:teacher_id (
        full_name,
        email
      )
    `)
    .single();

  return { data, error };
};

export const updateClass = async (classId: number, updateData: UpdateClassData) => {
  const { data, error } = await supabase
    .from('classes')
    .update(updateData)
    .eq('id', classId)
    .select(`
      *,
      teacher:teacher_id (
        full_name,
        email
      )
    `)
    .single();

  return { data, error };
};

export const deleteClass = async (classId: number) => {
  const { error } = await supabase
    .from('classes')
    .delete()
    .eq('id', classId);

  return { error };
};

export const fetchClassStudents = async (classId: number) => {
  const { data, error } = await supabase
    .from('class_enrollments')
    .select(`
      *,
      student:student_id (
        id,
        full_name,
        email,
        avatar_url
      )
    `)
    .eq('class_id', classId)
    .order('enrollment_date', { ascending: false });

  if (error) return { data: null, error };

  const students = data?.map(enrollment => ({
    ...enrollment.student,
    enrollment_date: enrollment.enrollment_date,
    class_id: enrollment.class_id,
    progress: enrollment.progress || 0,
  })) || [];

  return { data: students as ClassStudent[], error: null };
};

export const addStudentToClass = async (classId: number, studentId: string) => {
  const { data, error } = await supabase
    .from('class_enrollments')
    .insert({
      class_id: classId,
      student_id: studentId,
    })
    .select()
    .single();

  return { data, error };
};

export const removeStudentFromClass = async (classId: number, studentId: string) => {
  const { error } = await supabase
    .from('class_enrollments')
    .delete()
    .eq('class_id', classId)
    .eq('student_id', studentId);

  return { error };
};

export const fetchClassSchedules = async (classId: number) => {
  const { data, error } = await supabase
    .from('class_schedules')
    .select(`
      *,
      class:class_id (
        id,
        name
      )
    `)
    .eq('class_id', classId)
    .order('day_of_week')
    .order('start_time');

  return { data: data as ClassSchedule[], error };
};

export const createClassSchedule = async (scheduleData: Omit<ClassSchedule, 'id'>) => {
  const { data, error } = await supabase
    .from('class_schedules')
    .insert(scheduleData)
    .select()
    .single();

  return { data, error };
};

export const updateClassSchedule = async (scheduleId: string, updateData: Partial<ClassSchedule>) => {
  const { data, error } = await supabase
    .from('class_schedules')
    .update(updateData)
    .eq('id', scheduleId)
    .select()
    .single();

  return { data, error };
};

export const deleteClassSchedule = async (scheduleId: string) => {
  const { error } = await supabase
    .from('class_schedules')
    .delete()
    .eq('id', scheduleId);

  return { error };
};

export const fetchClassPerformance = async (classId: number): Promise<{ data: ClassPerformance | null; error: any }> => {
  try {
    // Get student count
    const { data: studentData } = await supabase
      .from('class_enrollments')
      .select('student_id')
      .eq('class_id', classId);

    const totalStudents = studentData?.length || 0;

    // Get average progress
    const { data: progressData } = await supabase
      .from('class_enrollments')
      .select('progress')
      .eq('class_id', classId);

    const totalProgress = progressData?.reduce((sum, item) => sum + (item.progress || 0), 0) || 0;
    const averageProgress = totalStudents > 0 ? Math.round(totalProgress / totalStudents) : 0;

    // Get attendance rate (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: attendanceData } = await supabase
      .from('class_attendance')
      .select('status')
      .eq('class_id', classId)
      .gte('date', thirtyDaysAgo.toISOString());

    const attendanceRecords = attendanceData?.length || 0;
    const presentRecords = attendanceData?.filter(record => record.status === 'present').length || 0;
    const attendanceRate = attendanceRecords > 0 ? Math.round((presentRecords / attendanceRecords) * 100) : 0;

    // Get recent incidents (last 30 days)
    const { data: incidentData } = await supabase
      .from('incidents')
      .select('id')
      .eq('school_id', (await fetchClassById(classId)).data?.school_id)
      .gte('created_at', thirtyDaysAgo.toISOString());

    const recentIncidents = incidentData?.length || 0;

    const performance: ClassPerformance = {
      classId,
      totalStudents,
      averageProgress,
      attendanceRate,
      recentIncidents,
    };

    return { data: performance, error: null };
  } catch (error) {
    return { data: null, error };
  }
};