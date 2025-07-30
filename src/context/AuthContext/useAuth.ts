import { useContext } from 'react';
import { AuthContext } from './context';
import { AuthContextType } from './types';

/**
 * Custom hook to use auth context
 * 
 * This hook provides access to the authentication state and actions.
 * It must be used within an AuthProvider component.
 * 
 * @returns {AuthContextType} The authentication context value
 * @throws {Error} If used outside of AuthProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, profile, loading, signOut } = useAuth();
 *   
 *   if (loading) return <LoadingSpinner />;
 *   if (!user) return <LoginForm />;
 *   
 *   return (
 *     <div>
 *       <h1>Welcome, {profile?.full_name}</h1>
 *       <button onClick={signOut}>Sign Out</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error(
      'useAuth must be used within an AuthProvider. ' +
      'Make sure your component is wrapped with <AuthProvider>.'
    );
  }

  return context as AuthContextType;
}

/**
 * Hook to check if user is authenticated
 * 
 * @returns {boolean} True if user is authenticated and has a profile
 */
export function useIsAuthenticated(): boolean {
  const { user, profile, loading } = useAuth();
  return !loading && !!user && !!profile;
}

/**
 * Hook to get current user role
 * 
 * @returns {string | null} The user's role or null if not authenticated
 */
export function useUserRole(): string | null {
  const { profile } = useAuth();
  return profile?.role || null;
}

/**
 * Hook to check if user has a specific role
 * 
 * @param role - The role to check for
 * @returns {boolean} True if user has the specified role
 */
export function useHasRole(role: string): boolean {
  const userRole = useUserRole();
  return userRole === role;
}

/**
 * Hook to get authentication loading state
 * 
 * @returns {boolean} True if authentication is loading
 */
export function useAuthLoading(): boolean {
  const { loading } = useAuth();
  return loading;
}

/**
 * Hook to get current session
 * 
 * @returns {Session | null} The current session or null
 */
export function useSession() {
  const { session } = useAuth();
  return session;
}

/**
 * Hook to get current user
 * 
 * @returns {User | null} The current user or null
 */
export function useUser() {
  const { user } = useAuth();
  return user;
}

/**
 * Hook to get current user profile
 * 
 * @returns {Profile | null} The current user profile or null
 */
export function useProfile() {
  const { profile } = useAuth();
  return profile;
}
