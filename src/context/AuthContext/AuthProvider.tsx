import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@lib/utils/supabase';
import { Profile } from '@types';
import { logger } from '@lib/utils/logger';
import { AuthState, AuthActions, AuthContextType, AuthProviderProps } from './types';

// Action types for reducer
type AuthAction =
  | { type: 'SET_SESSION'; payload: Session | null }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_PROFILE'; payload: Profile | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_NAVIGATION_IN_PROGRESS'; payload: boolean }
  | { type: 'SET_HAS_NAVIGATED'; payload: boolean }
  | { type: 'SET_LAST_NAVIGATION_TIME'; payload: number }
  | { type: 'SET_INITIALIZED'; payload: boolean }
  | { type: 'RESET_STATE' };

// Initial state
const initialState: AuthState = {
  session: null,
  user: null,
  profile: null,
  loading: true,
  navigationInProgress: false,
  isInitialized: false,
  hasNavigated: false,
  lastNavigationTime: 0,
};

// Reducer function
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_SESSION':
      return { ...state, session: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_PROFILE':
      return { ...state, profile: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_NAVIGATION_IN_PROGRESS':
      return { ...state, navigationInProgress: action.payload };
    case 'SET_HAS_NAVIGATED':
      return { ...state, hasNavigated: action.payload };
    case 'SET_LAST_NAVIGATION_TIME':
      return { ...state, lastNavigationTime: action.payload };
    case 'SET_INITIALIZED':
      return { ...state, isInitialized: action.payload };
    case 'RESET_STATE':
      return {
        ...initialState,
        loading: false,
        isInitialized: state.isInitialized
      };
    default:
      return state;
  }
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Global flags to prevent multiple initializations and excessive DB calls
let authInitialized = false;
let profileFetchInProgress = false;

// Auth Provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Action creators
  const setSession = useCallback((session: Session | null) => {
    dispatch({ type: 'SET_SESSION', payload: session });
  }, []);

  const setUser = useCallback((user: User | null) => {
    dispatch({ type: 'SET_USER', payload: user });
  }, []);

  const setProfile = useCallback((profile: Profile | null) => {
    dispatch({ type: 'SET_PROFILE', payload: profile });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setNavigationInProgress = useCallback((inProgress: boolean) => {
    dispatch({ type: 'SET_NAVIGATION_IN_PROGRESS', payload: inProgress });
  }, []);

  const setHasNavigated = useCallback((hasNavigated: boolean) => {
    dispatch({ type: 'SET_HAS_NAVIGATED', payload: hasNavigated });
  }, []);

  const setLastNavigationTime = useCallback((time: number) => {
    dispatch({ type: 'SET_LAST_NAVIGATION_TIME', payload: time });
  }, []);

  // Fetch user profile from database
  const fetchUserProfile = useCallback(async (userId: string) => {
    if (state.navigationInProgress) {
      logger.debug('🔄 Navigation already in progress, skipping profile fetch');
      return;
    }

    // Global flag to prevent multiple simultaneous profile fetches
    if (profileFetchInProgress) {
      logger.debug('🔄 Profile fetch already in progress globally, skipping');
      return;
    }

    // Don't fetch if we already have a profile for this user
    if (state.profile && state.profile.id === userId) {
      logger.debug('🔄 Profile already loaded for user, skipping fetch');
      setLoading(false);
      return;
    }

    profileFetchInProgress = true;

    try {
      if (!userId) {
        logger.error('User ID is required to fetch profile');
        return;
      }

      logger.debug(`🔐 Fetching profile for user: ${userId}`);
      const { data: userProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        logger.error('Error fetching user profile', { error: error.message || error });
        return;
      }

      if (userProfile?.role) {
        const profile: Profile = {
          id: userProfile.id,
          full_name: userProfile.full_name,
          role: userProfile.role as Profile['role'],
          school_id: userProfile.school_id,
          created_at: userProfile.created_at,
          updated_at: userProfile.updated_at
        };
        
        setProfile(profile);
        setLoading(false);
        logger.debug(`🔐 Profile loaded for role: ${profile.role}`);
      } else {
        logger.error('No role found for user');
        setLoading(false);
      }
    } catch (error) {
      logger.error('Error in fetchUserProfile', {
        error: error instanceof Error ? error.message : String(error)
      });
      setLoading(false);
    } finally {
      profileFetchInProgress = false;
    }
  }, [state.navigationInProgress, state.profile, setLoading, setProfile]);

  // Sign out user
  const signOut = useCallback(async () => {
    logger.debug('🔐 User signing out');
    setProfile(null);
    setHasNavigated(false);
    await supabase.auth.signOut();
  }, [setProfile, setHasNavigated]);

  // Clear session and force logout
  const clearSession = useCallback(async () => {
    logger.debug('🚨 Clearing session and forcing logout');
    setLoading(true);

    try {
      dispatch({ type: 'RESET_STATE' });
      await supabase.auth.signOut();
    } catch (error) {
      logger.error('🚨 Error during session clearing', {
        error: error instanceof Error ? error.message : String(error)
      });
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  // Initialize auth state
  const initialize = useCallback(async () => {
    // Prevent multiple initializations
    if (authInitialized) {
      logger.debug('🔄 Auth already initialized, skipping');
      return;
    }
    
    authInitialized = true;
    logger.debug('🔐 Initializing auth store');
    
    try {
      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();
      logger.debug(`🔐 Initial session check: ${session ? 'AUTHENTICATED' : 'NOT AUTHENTICATED'}`);
      
      setSession(session);
      setUser(session?.user ?? null);
      dispatch({ type: 'SET_INITIALIZED', payload: true });

      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }

      // Listen for auth state changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        logger.debug(`🔐 Auth state change: ${event}, ${session ? 'AUTHENTICATED' : 'NOT AUTHENTICATED'}`);
        
        setSession(session);
        setUser(session?.user ?? null);

        if (event === 'SIGNED_IN' && session?.user) {
          logger.debug('🔐 User signed in - fetching profile from database');
          await fetchUserProfile(session.user.id);
        } else if (event === 'INITIAL_SESSION' && session?.user) {
          // Only fetch profile if we don't already have one for this user
          if (!state.profile || state.profile.id !== session.user.id) {
            logger.debug('🔐 Initial session - fetching profile from database');
            await fetchUserProfile(session.user.id);
          } else {
            // Profile already exists, just ensure loading is false
            setLoading(false);
          }
        } else if (event === 'SIGNED_OUT') {
          logger.debug('🔐 User signed out');
          dispatch({ type: 'RESET_STATE' });
          authInitialized = false; // Reset flag on sign out
        } else {
          setLoading(false);
        }
      });

    } catch (error) {
      logger.error('Error initializing auth store', { 
        error: error instanceof Error ? error.message : String(error) 
      });
      setLoading(false);
      authInitialized = false;
    }
  }, [fetchUserProfile, setSession, setUser, setLoading, state.profile]);

  // Initialize on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Context value
  const contextValue: AuthContextType = {
    ...state,
    setSession,
    setUser,
    setProfile,
    setLoading,
    setNavigationInProgress,
    setHasNavigated,
    setLastNavigationTime,
    fetchUserProfile,
    signOut,
    clearSession,
    initialize,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
