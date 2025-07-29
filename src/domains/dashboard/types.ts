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
 * Custom error class for dashboard service operations
 */
export class DashboardServiceError extends Error {
  public readonly code: string;
  public readonly context?: any;

  constructor(code: string, message: string, context?: any) {
    super(message);
    this.name = 'DashboardServiceError';
    this.code = code;
    this.context = context;
  }

  static create(code: string, message: string, context?: any): DashboardServiceError {
    return new DashboardServiceError(code, message, context);
  }
}
