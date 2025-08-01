import { logger } from '../utils/logger';
import { supabase } from '../utils/supabase';
import { getStudentCount, getTeacherCount } from './users';
import type { DatabaseResponse } from '../types/database';

/**
 * Interface for dashboard metrics
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

/**
 * Fetch dashboard metrics for a specific school
 * @param schoolId The ID of the school to fetch metrics for
 * @returns Dashboard metrics data
 */
export async function fetchDashboardMetrics(schoolId: number): Promise<DatabaseResponse<DashboardMetrics>> {
  try {
    const [
    studentCountResponse,
    teacherCountResponse,
    incidentsResponse,
    academicResponse,
    teacherPerfResponse,
    attendanceResponse] =
    await Promise.all([
    // Fetch student count (optimized - count only, no full records)
    getStudentCount(schoolId),

    // Fetch teacher count (optimized - count only, no full records)
    getTeacherCount(schoolId),

    // Fetch incident summary
    supabase.
    from('incidents').
    select('id, status').
    eq('school_id', schoolId),

    // Fetch academic performance (average across student_performance joined with profiles)
    supabase.
    from('student_performance').
    select(`
          academic_score,
          profiles!inner(school_id)
        `).
    eq('profiles.school_id', schoolId),

    // Fetch teacher performance (average across teacher_performance joined with profiles)
    supabase.
    from('teacher_performance').
    select(`
          class_observation,
          punctuality_score,
          profiles!inner(school_id)
        `).
    eq('profiles.school_id', schoolId),

    // Fetch student attendance (average across student_performance joined with profiles)
    supabase.
    from('student_performance').
    select(`
          attendance_pct,
          profiles!inner(school_id)
        `).
    eq('profiles.school_id', schoolId)]
    );

    if (studentCountResponse.error) {
      throw new Error(`Failed to fetch student count: ${studentCountResponse.error.message}`);
    }
    if (teacherCountResponse.error) {
      throw new Error(`Failed to fetch teacher count: ${teacherCountResponse.error.message}`);
    }
    if (incidentsResponse.error) {
      throw new Error(`Failed to fetch incidents: ${incidentsResponse.error.message}`);
    }
    if (academicResponse.error) {
      throw new Error(`Failed to fetch academic performance: ${academicResponse.error.message}`);
    }
    if (teacherPerfResponse.error) {
      throw new Error(`Failed to fetch teacher performance: ${teacherPerfResponse.error.message}`);
    }
    if (attendanceResponse.error) {
      throw new Error(`Failed to fetch attendance data: ${attendanceResponse.error.message}`);
    }

    const studentCount = studentCountResponse.data || 0;
    const teacherCount = teacherCountResponse.data || 0;

    // Calculate teacher-to-student ratio (students per teacher)
    const teacherToStudentRatio = teacherCount > 0 ?
    parseFloat((studentCount / teacherCount).toFixed(2)) :
    0;

    const incidents = incidentsResponse.data || [];
    const totalIncidents = incidents.length;
    const pendingIncidents = incidents.filter((i) => i.status === 'pending').length;
    const resolvedIncidents = incidents.filter((i) => i.status !== 'pending').length;

    const academicScores = academicResponse.data?.map((p) => p.academic_score).filter((score) => score !== null) || [];
    const averageAcademicScore = academicScores.length > 0 ?
    parseFloat((academicScores.reduce((a, b) => a + b, 0) / academicScores.length).toFixed(2)) :
    0;

    const teacherScores = teacherPerfResponse.data?.map((p) => {
      const obs = p.class_observation || 0;
      const punct = p.punctuality_score || 0;
      return (obs + punct) / 2; // Simple average of the two metrics
    }).filter((score) => score > 0) || [];
    const averageTeacherScore = teacherScores.length > 0 ?
    parseFloat((teacherScores.reduce((a, b) => a + b, 0) / teacherScores.length).toFixed(2)) :
    0;

    const attendanceRates = attendanceResponse.data?.map((p) => p.attendance_pct).filter((rate) => rate !== null) || [];
    const averageAttendance = attendanceRates.length > 0 ?
    parseFloat((attendanceRates.reduce((a, b) => a + b, 0) / attendanceRates.length).toFixed(2)) :
    0;

    // Placeholder for parent engagement (mock data until real data source is available)
    const parentEngagement = {
      meetingsHeld: 0 // TODO: Implement actual data source for parent meetings or communications
    };

    const metrics: DashboardMetrics = {
      studentEnrollment: studentCount,
      teacherCount: teacherCount,
      teacherToStudentRatio: teacherToStudentRatio,
      incidentSummary: {
        total: totalIncidents,
        pending: pendingIncidents,
        resolved: resolvedIncidents
      },
      academicPerformance: {
        averageScore: averageAcademicScore
      },
      teacherPerformance: {
        averageScore: averageTeacherScore
      },
      studentAttendance: {
        averagePercentage: averageAttendance
      },
      parentEngagement: parentEngagement
    };

    return { data: metrics, error: null };
  } catch (err) {
    logger.error('Service error fetching dashboard metrics:', { error: err instanceof Error ? err.message : String(err) });
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
}