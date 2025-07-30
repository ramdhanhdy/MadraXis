/**
 * Student Detail Feature Barrel Export
 * 
 * This file provides a clean interface for importing student detail feature components,
 * types, and utilities from other parts of the application.
 */

// Main screen component
export { default as StudentDetailScreen } from './screen';

// Types and models
export type {
  StudentDetailState,
  AttendanceRecord,
  StudentNote,
  StudentProgress,
  AttendanceRecordSchema,
  StudentNoteSchema,
} from './model';

// Re-export types from parent model
export type {
  Student,
  AcademicRecord,
  SubjectRecord,
  Score,
  BehaviorRecord,
} from '../model';

export {
  attendanceRecordSchema,
  studentNoteSchema,
  ATTENDANCE_STATUS,
  ATTENDANCE_STATUS_LABELS,
  NOTE_TYPES,
  NOTE_TYPE_LABELS,
  DETAIL_TABS,
  TAB_LABELS,
  PROGRESS_TRENDS,
  TREND_LABELS,
  validateAttendanceRecord,
  validateStudentNote,
  formatAttendanceStatus,
  formatNoteType,
  formatTrend,
  getAttendanceStatusColor,
  getTrendColor,
  getNoteTypeColor,
  calculateAttendanceRate,
  getAttendanceStatistics,
  analyzeProgress,
  filterNotesByType,
  sortNotesByDate,
  getRecentBehaviorTrend,
  initialStudentDetailState,
  STUDENT_DETAIL_ERRORS,
} from './model';
