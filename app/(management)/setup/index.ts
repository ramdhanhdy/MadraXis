/**
 * School Setup Feature Barrel Export
 * 
 * This file provides a clean interface for importing school setup feature components,
 * types, and utilities from other parts of the application.
 */

// Main screen component
export { default as SchoolSetupScreen } from './screen';

// Types and models
export type {
  School,
  SchoolSetupState,
  SchoolSetupFormData,
  SetupStep,
  BasicInfoSchema,
  ContactInfoSchema,
  SchoolDetailsSchema,
  CompleteSetupSchema,
} from './model';

export {
  basicInfoSchema,
  contactInfoSchema,
  schoolDetailsSchema,
  completeSetupSchema,
  SETUP_STEPS,
  SCHOOL_TYPES,
  EDUCATION_LEVELS,
  validateFormStep,
  validateCompleteSetup,
  validateNPSN,
  formatPhoneNumber,
  isStepComplete,
  getCompletedStepsCount,
  getSetupProgress,
  convertFormDataToSchool,
  generateSchoolCode,
  getSchoolTypeLabel,
  getEducationLevelLabel,
  initialSchoolSetupFormData,
  initialSchoolSetupState,
  SETUP_ERRORS,
  SETUP_SUCCESS,
} from './model';
