/**
 * Class Students Feature Barrel Export
 * 
 * This file provides a clean interface for importing class students feature components,
 * types, and utilities from other parts of the application.
 */

// Main screen component
export { default as ClassStudentsScreen } from './screen';

// Types and models
export type {
  ClassStudent,
  StudentAcademicRecord,
  SubjectGrade,
  Assignment,
  ClassStudentsState,
  ClassStudentSchema,
  AssignmentSchema,
  SubjectGradeSchema,
} from './model';

export {
  classStudentSchema,
  assignmentSchema,
  subjectGradeSchema,
  STUDENT_STATUS,
  STUDENT_STATUS_LABELS,
  GENDER_LABELS,
  ASSIGNMENT_TYPES,
  ASSIGNMENT_TYPE_LABELS,
  GRADE_SCALE,
  validateClassStudent,
  calculateAge,
  calculateGrade,
  getGradeLabel,
  formatStudentStatus,
  formatGender,
  formatAssignmentType,
  getStatusColor,
  searchStudents,
  filterStudentsByStatus,
  sortStudents,
  calculateOverallScore,
  calculateClassRank,
  initialClassStudentsState,
  STUDENTS_ERRORS,
} from './model';
