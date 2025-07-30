/**
 * AuthContext - Pure TypeScript context creation
 * This file contains only the context creation and types, no JSX
 */

import { createContext } from 'react';
import { AuthContextType } from './types';

/**
 * Auth Context
 * Created separately from the Provider to avoid JSX resolution issues
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Default context value for development/testing
 */
export const defaultAuthContextValue: AuthContextType = {
  session: null,
  user: null,
  profile: null,
  loading: true,
  navigationInProgress: false,
  isInitialized: false,
  hasNavigated: false,
  lastNavigationTime: 0,
  setSession: () => {},
  setUser: () => {},
  setProfile: () => {},
  setLoading: () => {},
  setNavigationInProgress: () => {},
  setHasNavigated: () => {},
  setLastNavigationTime: () => {},
  fetchUserProfile: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  clearSession: async () => {},
  initialize: async () => {},
};
