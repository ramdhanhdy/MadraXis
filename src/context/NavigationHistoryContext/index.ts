/**
 * NavigationHistoryContext - Navigation history management
 * 
 * Provides shared navigation history state and utilities for tracking
 * user navigation throughout the application.
 */

export * from './context';
export * from './hooks';

// NavigationHistoryProvider is available from './NavigationHistoryContext' but not exported here to avoid JSX resolution issues
// For runtime usage: import { NavigationHistoryProvider } from './NavigationHistoryContext';
