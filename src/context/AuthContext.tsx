import { logger } from '../utils/logger';
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/src/utils/supabase';
import { useRouter } from 'expo-router';
import { Profile } from '../types';

// Global flag to prevent multiple auth initializations
let authInitialized = false;

// Define the shape of the context
interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  clearSession: () => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  clearSession: async () => {}
});

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component
export const AuthProvider = ({ children }: {children: React.ReactNode;}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [navigationInProgress, setNavigationInProgress] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Function to fetch user profile from unified profiles table
  const fetchUserProfileAndNavigate = async (userId: string) => {
    if (navigationInProgress) {
      logger.debug('🔄 Navigation already in progress, skipping profile fetch');
      return;
    }

    try {
      if (!userId) {
        logger.error('User ID is required to fetch profile');
        if (!navigationInProgress) {
          router.replace('/(auth)/login');
        }
        return;
      }

      const { data: userProfile, error } = await supabase.
      from('profiles').
      select('*').
      eq('id', userId).
      single();

      if (error) {
        logger.error('Error fetching user profile', { error: error.message || error });
        if (!navigationInProgress) {
          router.replace('/(auth)/login');
        }
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
        navigateBasedOnRole(profile.role, profile.school_id);
      } else {
        logger.error('No role found for user');
        setLoading(false);
        if (!navigationInProgress) {
          router.replace('/(auth)/login');
        }
      }
    } catch (error) {
      logger.error('Error in fetchUserProfileAndNavigate', { error: error instanceof Error ? error.message : String(error) });
      setLoading(false);
      if (!navigationInProgress) {
        router.replace('/(auth)/login');
      }
    }
  };

  // Function to navigate based on user role
  const navigateBasedOnRole = (role: string, schoolId?: string | number) => {
    if (navigationInProgress) {
      logger.debug('🔄 Navigation already in progress, skipping duplicate navigation');
      return;
    }

    // Don't navigate if we're still loading
    if (loading) {
      logger.debug('🔄 Still loading, deferring navigation');
      return;
    }

    setNavigationInProgress(true);
    logger.debug(`🔐 Navigating based on role: ${role}, school_id: ${schoolId}`);

    // Use setTimeout to ensure navigation happens after current render cycle
    setTimeout(() => {
      try {
        switch (role) {
          case 'teacher':
            router.replace('/(teacher)/dashboard');
            break;
          case 'management':
            if (schoolId) {
              router.replace('/(management)/dashboard');
            } else {
              router.replace('/(management)/setup');
            }
            break;
          case 'parent':
            router.replace('/(parent)/dashboard');
            break;
          case 'student':
            router.replace('/(student)/dashboard');
            break;
          default:
            logger.error('Unknown role', { role });
            router.replace('/(auth)/login');
            break;
        }
      } catch (error) {
        logger.error('Navigation error', { error });
      }
    }, 100);

    // Reset navigation flag after a longer delay to prevent rapid re-navigation
    setTimeout(() => setNavigationInProgress(false), 3000);
  };

  // Function to clear session and force logout
  const clearSession = async () => {
    logger.debug('🚨 Clearing session and forcing logout');
    setLoading(true);

    try {
      setSession(null);
      setUser(null);
      setProfile(null);
      await supabase.auth.signOut();
      // Navigation handled by onAuthStateChange listener
    } catch (error) {
      logger.error('🚨 Error during session clearing', { error: error instanceof Error ? error.message : String(error) });
      // Force redirect to login if signOut fails
      router.replace('/(auth)/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Prevent multiple auth initializations
    if (authInitialized) {
      logger.debug('🔄 Auth already initialized, skipping');
      return;
    }

    authInitialized = true;
    logger.debug('🔐 Initializing auth context');

    // Get the initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      logger.debug(`🔐 Initial session check: ${session ? 'AUTHENTICATED' : 'NOT AUTHENTICATED'}`);
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Always fetch profile from database for consistency
        await fetchUserProfileAndNavigate(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for changes in auth state
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      logger.debug(`🔐 Auth state change: ${event}, ${session ? 'AUTHENTICATED' : 'NOT AUTHENTICATED'}`);
      setSession(session);
      setUser(session?.user ?? null);

      if (event === 'SIGNED_IN' && session?.user) {
        logger.debug('🔐 User signed in - fetching profile from database');
        // Always fetch role from profiles table for consistency and security
        await fetchUserProfileAndNavigate(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        logger.debug('🔐 User signed out - redirecting to login');
        setProfile(null);
        setLoading(false);
        authInitialized = false; // Reset flag on sign out
        router.replace('/(auth)/login');
      } else {
        setLoading(false);
      }
    });

    // Cleanup the listener on component unmount
    return () => {
      authListener.subscription.unsubscribe();
      authInitialized = false; // Reset flag on unmount
    };
  }, []); // Remove router dependency to prevent re-initialization

  const signOut = async () => {
    logger.debug('🔐 User signing out');
    setProfile(null);
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    profile,
    loading,
    signOut,
    clearSession
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};