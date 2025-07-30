/**
 * Shared Hooks - Reusable React hooks
 *
 * This module contains shared React hooks that can be used across
 * different domains and components. These are cross-cutting concerns
 * that don't belong to a specific domain.
 */

// Export all migrated hooks
export { useAuth } from './useAuth';
export { useClassStudentBreakdown } from './useClassStudentBreakdown';
export { useClassStudentsSubscription } from './useClassStudentsSubscription';
export { useNavigationGuards } from './useNavigationGuards';
export { useNavigationHistory } from './useNavigationHistory';
export { useStudentCountSubscription } from './useStudentCountSubscription';
export { usePrevious } from './usePrevious';
export { useDebounce } from './useDebounce';
