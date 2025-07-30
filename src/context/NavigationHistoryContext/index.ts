/**
 * NavigationHistoryContext - Navigation history management
 * 
 * Provides shared navigation history state and utilities for tracking
 * user navigation throughout the application.
 */

export * from './NavigationHistoryContext';

// Re-export main components for easy importing
export { 
  NavigationHistoryProvider, 
  useNavigationHistory,
  useRouteTracking,
  useBreadcrumbData
} from './NavigationHistoryContext';

// Re-export types
export type { 
  NavigationHistoryItem, 
  NavigationHistoryState 
} from './NavigationHistoryContext';
