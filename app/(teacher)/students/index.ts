/**
 * Students Management Feature Barrel Export
 * 
 * This file provides a clean interface for importing students management feature components,
 * types, and utilities from other parts of the application.
 */

// Main screen component
export { default as StudentsListScreen } from './screen';

// Types and models
export type {
  Student,
  AcademicRecord,
  SubjectRecord,
  Score,
  BehaviorRecord,
  StudentsState,
  StudentSchema,
  ScoreSchema,
  BehaviorRecordSchema,
} from './model';

export {
  studentSchema,
  scoreSchema,
  behaviorRecordSchema,
  STUDENT_STATUS,
  STUDENT_STATUS_LABELS,
  GENDER_LABELS,
  SCORE_TYPES,
  SCORE_TYPE_LABELS,
  BEHAVIOR_TYPES,
  BEHAVIOR_TYPE_LABELS,
  BEHAVIOR_CATEGORIES,
  BEHAVIOR_CATEGORY_LABELS,
  GRADE_SCALE,
  validateStudent,
  calculateAge,
  calculateGrade,
  getGradeLabel,
  formatStudentStatus,
  formatGender,
  formatScoreType,
  formatBehaviorType,
  formatBehaviorCategory,
  getStatusColor,
  getBehaviorTypeColor,
  searchStudents,
  filterStudentsByStatus,
  filterStudentsByClass,
  sortStudents,
  calculateOverallGrade,
  calculateBehaviorScore,
  initialStudentsState,
  STUDENTS_ERRORS,
} from './model';
