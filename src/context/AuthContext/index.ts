/**
 * AuthContext - React Context-based authentication state management
 * 
 * This replaces the Zustand-based authStore with React Context pattern
 * while preserving all authentication functionality and persistence behavior.
 */

export * from './AuthContext';
export * from './types';

// Re-export the main components for easy importing
export { AuthProvider, useAuth } from './AuthContext';
export type { AuthContextType, AuthProviderProps } from './types';
