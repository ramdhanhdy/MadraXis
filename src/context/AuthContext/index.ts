/**
 * AuthContext - React Context-based authentication state management
 *
 * This replaces the Zustand-based authStore with React Context pattern
 * while preserving all authentication functionality and persistence behavior.
 */

export * from './context';
export * from './useAuth';
export * from './types';

// AuthProvider is available from './AuthProvider' but not exported here to avoid JSX resolution issues
// For runtime usage: import { AuthProvider } from './AuthProvider';
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
