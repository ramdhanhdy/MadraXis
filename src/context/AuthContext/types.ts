import { Session, User } from '@supabase/supabase-js';
import { Profile } from '../../types/index';

export interface AuthState {
  // State
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  navigationInProgress: boolean;
  isInitialized: boolean;
  hasNavigated: boolean;
  lastNavigationTime: number;
}

export interface AuthActions {
  // Actions
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  setNavigationInProgress: (inProgress: boolean) => void;
  setHasNavigated: (hasNavigated: boolean) => void;
  setLastNavigationTime: (time: number) => void;
  fetchUserProfile: (userId: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearSession: () => Promise<void>;
  initialize: () => Promise<void>;
}

export interface AuthContextType extends AuthState, AuthActions {}

export interface AuthProviderProps {
  children: React.ReactNode;
}
