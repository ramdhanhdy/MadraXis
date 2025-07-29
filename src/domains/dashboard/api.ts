import { logger } from '@lib/utils/logger';
import { supabase } from '@lib/utils/supabase';
import { UserService } from '@domains/users';
import type { DatabaseResponse } from '@types/database';
import { DashboardMetrics, DashboardServiceError } from './types';

/**
 * DashboardService provides dashboard metrics and analytics
 */
export class DashboardService {
  /**
   * Fetch dashboard metrics for a specific school
   */
  static async fetchDashboardMetrics(schoolId: number): Promise<DatabaseResponse<DashboardMetrics>> {
    try {
      const [
        studentCountResponse,
        teacherCountResponse,
        incidentsResponse,
        academicResponse,
        teacherPerfResponse,
        attendanceResponse
      ] = await Promise.all([
        // Fetch student count (optimized - count only, no full records)
        UserService.getStudentCount(schoolId),

        // Fetch teacher count (optimized - count only, no full records)
        UserService.getTeacherCount(schoolId),

        // Fetch incident summary
        this.getIncidentSummary(schoolId),

        // Fetch academic performance
        this.getAcademicPerformance(schoolId),

        // Fetch teacher performance
        this.getTeacherPerformance(schoolId),

        // Fetch attendance data
        this.getAttendanceData(schoolId)
      ]);

      // Check for errors in any of the responses
      if (studentCountResponse.error) {
        logger.error('Error fetching student count for dashboard', { 
          error: studentCountResponse.error.message, 
          schoolId 
        });
        return { data: null, error: studentCountResponse.error };
      }

      if (teacherCountResponse.error) {
        logger.error('Error fetching teacher count for dashboard', { 
          error: teacherCountResponse.error.message, 
          schoolId 
        });
        return { data: null, error: teacherCountResponse.error };
      }

      const studentCount = studentCountResponse.data || 0;
      const teacherCount = teacherCountResponse.data || 0;

      // Calculate teacher-to-student ratio
      const teacherToStudentRatio = teacherCount > 0 ? studentCount / teacherCount : 0;

      const dashboardMetrics: DashboardMetrics = {
        studentEnrollment: studentCount,
        teacherCount: teacherCount,
        teacherToStudentRatio: Math.round(teacherToStudentRatio * 100) / 100, // Round to 2 decimal places
        incidentSummary: incidentsResponse || {
          total: 0,
          pending: 0,
          resolved: 0
        },
        academicPerformance: academicResponse || {
          averageScore: 0
        },
        teacherPerformance: teacherPerfResponse || {
          averageScore: 0
        },
        studentAttendance: attendanceResponse || {
          averagePercentage: 0
        },
        parentEngagement: {
          meetingsHeld: 0 // TODO: Implement when parent meetings are tracked
        }
      };

      return { data: dashboardMetrics, error: null };
    } catch (err) {
      logger.error('Service error fetching dashboard metrics', { 
        error: err instanceof Error ? err.message : String(err),
        schoolId,
        operation: 'fetchDashboardMetrics'
      });
      return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
    }
  }

  /**
   * Get incident summary for dashboard
   */
  private static async getIncidentSummary(schoolId: number): Promise<{
    total: number;
    pending: number;
    resolved: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .select('status')
        .eq('school_id', schoolId);

      if (error) {
        logger.error('Error fetching incident summary', { error: error.message, schoolId });
        return { total: 0, pending: 0, resolved: 0 };
      }

      const summary = { total: 0, pending: 0, resolved: 0 };
      
      data?.forEach(incident => {
        summary.total++;
        if (incident.status === 'open' || incident.status === 'investigating') {
          summary.pending++;
        } else if (incident.status === 'resolved') {
          summary.resolved++;
        }
      });

      return summary;
    } catch (err) {
      logger.error('Error calculating incident summary', { error: String(err), schoolId });
      return { total: 0, pending: 0, resolved: 0 };
    }
  }

  /**
   * Get academic performance metrics
   */
  private static async getAcademicPerformance(schoolId: number): Promise<{
    averageScore: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('student_performance')
        .select('academic_score')
        .eq('school_id', schoolId);

      if (error) {
        logger.error('Error fetching academic performance', { error: error.message, schoolId });
        return { averageScore: 0 };
      }

      if (!data || data.length === 0) {
        return { averageScore: 0 };
      }

      const totalScore = data.reduce((sum, record) => sum + (record.academic_score || 0), 0);
      const averageScore = totalScore / data.length;

      return { averageScore: Math.round(averageScore * 100) / 100 };
    } catch (err) {
      logger.error('Error calculating academic performance', { error: String(err), schoolId });
      return { averageScore: 0 };
    }
  }

  /**
   * Get teacher performance metrics
   */
  private static async getTeacherPerformance(schoolId: number): Promise<{
    averageScore: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('teacher_performance')
        .select('performance_score')
        .eq('school_id', schoolId);

      if (error) {
        logger.error('Error fetching teacher performance', { error: error.message, schoolId });
        return { averageScore: 0 };
      }

      if (!data || data.length === 0) {
        return { averageScore: 0 };
      }

      const totalScore = data.reduce((sum, record) => sum + (record.performance_score || 0), 0);
      const averageScore = totalScore / data.length;

      return { averageScore: Math.round(averageScore * 100) / 100 };
    } catch (err) {
      logger.error('Error calculating teacher performance', { error: String(err), schoolId });
      return { averageScore: 0 };
    }
  }

  /**
   * Get attendance data
   */
  private static async getAttendanceData(schoolId: number): Promise<{
    averagePercentage: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('student_performance')
        .select('attendance_pct')
        .eq('school_id', schoolId);

      if (error) {
        logger.error('Error fetching attendance data', { error: error.message, schoolId });
        return { averagePercentage: 0 };
      }

      if (!data || data.length === 0) {
        return { averagePercentage: 0 };
      }

      const totalPercentage = data.reduce((sum, record) => sum + (record.attendance_pct || 0), 0);
      const averagePercentage = totalPercentage / data.length;

      return { averagePercentage: Math.round(averagePercentage * 100) / 100 };
    } catch (err) {
      logger.error('Error calculating attendance data', { error: String(err), schoolId });
      return { averagePercentage: 0 };
    }
  }
}
