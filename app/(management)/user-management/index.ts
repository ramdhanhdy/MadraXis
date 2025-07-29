/**
 * User Management Feature Barrel Export
 * 
 * This file provides a clean interface for importing user management feature components,
 * types, and utilities from other parts of the application.
 */

// Main screen component
export { default as UserManagementScreen } from './screen';

// Types and models
export type {
  Student,
  Teacher,
  UserManagementState,
  UserFormData,
  StudentDetails,
  TeacherDetails,
  UserStats,
  StudentDetailsSchema,
  TeacherDetailsSchema,
  UserFormSchema,
} from './model';

export {
  studentDetailsSchema,
  teacherDetailsSchema,
  userFormSchema,
  USER_TABS,
  USER_ROLES,
  GENDER_OPTIONS,
  SUBJECT_OPTIONS,
  CLASS_OPTIONS,
  validateUserForm,
  searchUsers,
  filterStudentsByClass,
  filterStudentsByGender,
  filterTeachersBySubject,
  sortUsersByName,
  sortUsersByDate,
  calculateUserStats,
  formatUserRole,
  formatGender,
  generateUserCode,
  validateNIS,
  validateNIP,
  formatPhoneNumber,
  getUniqueClasses,
  getUniqueSubjects,
  initialUserManagementState,
  initialUserFormData,
  USER_MANAGEMENT_ERRORS,
  USER_MANAGEMENT_SUCCESS,
} from './model';
