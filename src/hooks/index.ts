export { useClassStudentsSubscription } from './useClassStudentsSubscription';
export { useStudentCountSubscription } from './useStudentCountSubscription';
export { useClassStudentBreakdown } from './useClassStudentBreakdown';

// Export other hooks that exist in the directory
export { useAuth } from './useAuth';
export { useNavigationGuards } from './useNavigationGuards';
export { useNavigationHistory } from './useNavigationHistory';

// MIGRATION COMPATIBILITY: Re-export from new lib structure
// This allows both old and new import paths to work during migration
export * from '../lib/hooks';