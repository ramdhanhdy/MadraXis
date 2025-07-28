import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';
import { Profile } from '../types';
import { logger } from '../utils/logger';

interface AuthState {
  // State
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  navigationInProgress: boolean;
  isInitialized: boolean;
  hasNavigated: boolean;
  lastNavigationTime: number;

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

// Global flags to prevent multiple initializations and excessive DB calls
let authInitialized = false;
let profileFetchInProgress = false;

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  session: null,
  user: null,
  profile: null,
  loading: true,
  navigationInProgress: false,
  isInitialized: false,
  hasNavigated: false,
  lastNavigationTime: 0,

  // Actions
  setSession: (session) => set({ session }),
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  setNavigationInProgress: (inProgress) => set({ navigationInProgress: inProgress }),
  setHasNavigated: (hasNavigated) => set({ hasNavigated }),
  setLastNavigationTime: (time) => set({ lastNavigationTime: time }),

  // Fetch user profile from database
  fetchUserProfile: async (userId: string) => {
    const { navigationInProgress, profile } = get();

    if (navigationInProgress) {
      logger.debug('🔄 Navigation already in progress, skipping profile fetch');
      return;
    }

    // Global flag to prevent multiple simultaneous profile fetches
    if (profileFetchInProgress) {
      logger.debug('🔄 Profile fetch already in progress globally, skipping');
      return;
    }

    // Don't fetch if we already have a profile for this user
    if (profile && profile.id === userId) {
      logger.debug('🔄 Profile already loaded for user, skipping fetch');
      set({ loading: false });
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
        
        set({ profile, loading: false });
        logger.debug(`🔐 Profile loaded for role: ${profile.role}`);
      } else {
        logger.error('No role found for user');
        set({ loading: false });
      }
    } catch (error) {
      logger.error('Error in fetchUserProfile', {
        error: error instanceof Error ? error.message : String(error)
      });
      set({ loading: false });
    } finally {
      profileFetchInProgress = false;
    }
  },

  // Sign out user
  signOut: async () => {
    logger.debug('🔐 User signing out');
    set({ profile: null, hasNavigated: false });
    await supabase.auth.signOut();
  },

  // Clear session and force logout
  clearSession: async () => {
    logger.debug('🚨 Clearing session and forcing logout');
    set({ loading: true });

    try {
      set({ session: null, user: null, profile: null, hasNavigated: false });
      await supabase.auth.signOut();
    } catch (error) {
      logger.error('🚨 Error during session clearing', {
        error: error instanceof Error ? error.message : String(error)
      });
    } finally {
      set({ loading: false });
    }
  },

  // Initialize auth state
  initialize: async () => {
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
      
      set({ 
        session, 
        user: session?.user ?? null,
        isInitialized: true 
      });

      if (session?.user) {
        await get().fetchUserProfile(session.user.id);
      } else {
        set({ loading: false });
      }

      // Listen for auth state changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        logger.debug(`🔐 Auth state change: ${event}, ${session ? 'AUTHENTICATED' : 'NOT AUTHENTICATED'}`);
        
        set({ 
          session, 
          user: session?.user ?? null 
        });

        if (event === 'SIGNED_IN' && session?.user) {
          logger.debug('🔐 User signed in - fetching profile from database');
          await get().fetchUserProfile(session.user.id);
        } else if (event === 'INITIAL_SESSION' && session?.user) {
          // Only fetch profile if we don't already have one for this user
          const currentProfile = get().profile;
          if (!currentProfile || currentProfile.id !== session.user.id) {
            logger.debug('🔐 Initial session - fetching profile from database');
            await get().fetchUserProfile(session.user.id);
          } else {
            // Profile already exists, just ensure loading is false
            set({ loading: false });
          }
        } else if (event === 'SIGNED_OUT') {
          logger.debug('🔐 User signed out');
          set({
            profile: null,
            loading: false,
            navigationInProgress: false,
            hasNavigated: false
          });
          authInitialized = false; // Reset flag on sign out
        } else {
          set({ loading: false });
        }
      });

    } catch (error) {
      logger.error('Error initializing auth store', { 
        error: error instanceof Error ? error.message : String(error) 
      });
      set({ loading: false });
      authInitialized = false;
    }
  }
}));

// Initialize the store when the module is loaded
useAuthStore.getState().initialize();
