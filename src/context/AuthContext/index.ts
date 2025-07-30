/**
 * AuthContext - React Context-based authentication state management
 *
 * This replaces the Zustand-based authStore with React Context pattern
 * while preserving all authentication functionality and persistence behavior.
 */

export * from './AuthProvider';
export * from './useAuth';
export * from './types';

// Re-export the main components for easy importing
export { AuthProvider } from './AuthProvider';
export {
  useAuth,
  useIsAuthenticated,
  useUserRole,
  useHasRole,
  useAuthLoading,
  useSession,
  useUser,
  useProfile
} from './useAuth';
export type { AuthContextType, AuthProviderProps, AuthState, AuthActions } from './types';
