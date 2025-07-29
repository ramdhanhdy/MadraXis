/**
 * Add Student Feature Barrel Export
 * 
 * This file provides a clean interface for importing add student feature components,
 * types, and utilities from other parts of the application.
 */

// Main screen component
export { default as AddStudentScreen } from './screen';

// Types and models
export type {
  Student,
  StudentSchema,
  AddStudentState,
  StudentFormData,
  FormStep,
  BasicInfoSchema,
  ContactInfoSchema,
  ParentInfoSchema,
  SchoolInfoSchema,
  AdditionalInfoSchema,
  CompleteStudentFormSchema,
} from './model';

export {
  basicInfoSchema,
  contactInfoSchema,
  parentInfoSchema,
  schoolInfoSchema,
  additionalInfoSchema,
  completeStudentFormSchema,
  FORM_STEPS,
  GENDER_OPTIONS,
  CLASS_OPTIONS,
  validateFormStep,
  validateCompleteForm,
  generateStudentNumber,
  calculateAge,
  formatPhoneNumber,
  isStepComplete,
  getCompletedStepsCount,
  getFormProgress,
  convertFormDataToStudent,
  initialStudentFormData,
  initialAddStudentState,
  ADD_STUDENT_ERRORS,
} from './model';
