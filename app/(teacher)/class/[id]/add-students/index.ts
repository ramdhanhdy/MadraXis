/**
 * Add Students to Class Feature Barrel Export
 */

// Main screen component
export { default as AddStudentsScreen } from './screen';

// Types and models
export type {
  AddStudentsState,
  Student,
  AddStudentsFormData,
  AddStudentsFormSchema,
} from './model';

export {
  addStudentsFormSchema,
  validateClassId,
  validateStudentSelection,
  filterAvailableStudents,
  groupStudentsByEnrollmentStatus,
  initialAddStudentsState,
  ADD_STUDENTS_ERRORS,
  ADD_STUDENTS_SUCCESS,
} from './model';

// Store and hooks
export {
  useAddStudentsStore,
  useAddStudentsClassId,
  useAddStudentsSelection,
  useAddStudentsLoading,
  useAddStudentsValidation,
  useAddStudentsActions,
} from './store';
