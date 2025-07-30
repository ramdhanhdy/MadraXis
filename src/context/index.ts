/**
 * Context Providers and Hooks
 * Central export point for all application context providers and hooks
 */

// AuthContext exports
export * from './AuthContext';

// ThemeContext exports
export * from './ThemeContext';

// NavigationHistoryContext exports
export * from './NavigationHistoryContext';

// Convenience re-exports for backward compatibility (hooks only, providers must be imported directly)
export { useAuth } from './AuthContext';
export { useTheme } from './ThemeContext';
export { useNavigationHistory } from './NavigationHistoryContext';

// For Provider components, import directly:
// import { AuthProvider } from './AuthContext/AuthProvider';
// import { ThemeProvider } from './ThemeContext/ThemeProvider';
// import { NavigationHistoryProvider } from './NavigationHistoryContext/NavigationHistoryContext';