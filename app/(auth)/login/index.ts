/**
 * Login Feature Barrel Export
 * 
 * This file provides a clean interface for importing login feature components,
 * types, and utilities from other parts of the application.
 */

// Main screen component
export { default as LoginScreen } from './screen';

// UI Components
export { LoginHeader, LoginForm, LoginLoading } from './ui';

// Types and models
export type {
  LoginFormData,
  LoginState,
  LoginActions,
  LoginFormSchema,
  UserRole,
} from './model';

export {
  loginFormSchema,
  SUPPORTED_ROLES,
  ROLE_DISPLAY_NAMES,
  validateLoginForm,
  formatRoleForDisplay,
  isValidRole,
  initialLoginState,
  LOGIN_ERRORS,
} from './model';

// Store and hooks
export {
  useLoginStore,
  useLoginFormData,
  useLoginErrors,
  useLoginLoading,
  useLoginValidation,
  useLoginActions,
} from './store';
