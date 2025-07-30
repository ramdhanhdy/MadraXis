/**
 * Class Reports Feature Barrel Export
 * 
 * This file provides a clean interface for importing class reports feature components,
 * types, and utilities from other parts of the application.
 */

// Main screen component
export { default as ClassReportsScreen } from './screen';

// Types and models
export type {
  ClassReport,
  SubjectReport,
  StudentReport,
  ClassReportsState,
  ClassReportSchema,
  SubjectReportSchema,
} from './model';

export {
  classReportSchema,
  subjectReportSchema,
  REPORT_TYPES,
  REPORT_TYPE_LABELS,
  SEMESTER_LABELS,
  REPORT_STATUS_LABELS,
  GRADE_SCALE,
  validateClassReport,
  calculateGrade,
  getGradeLabel,
  calculateClassAverage,
  calculatePassRate,
  formatReportType,
  formatSemester,
  formatReportStatus,
  sortReports,
  filterReports,
  initialClassReportsState,
  REPORTS_ERRORS,
} from './model';
