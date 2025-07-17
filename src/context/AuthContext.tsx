import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/src/utils/supabase';
import { useRouter } from 'expo-router';
import { Profile } from '../types';

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
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Function to fetch user profile from unified profiles table
  const fetchUserProfileAndNavigate = async (userId: string) => {
    try {
      const { data: userProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        router.replace('/(auth)/login');
        return;
      }

      if (userProfile?.role) {
        setProfile(userProfile as Profile);
        navigateBasedOnRole(userProfile.role, userProfile.school_id);
      } else {
        console.error('No role found for user');
        router.replace('/(auth)/login');
      }
    } catch (error) {
      console.error('Error in fetchUserProfileAndNavigate:', error);
      router.replace('/(auth)/login');
    }
  };

  // Function to navigate based on user role
  const navigateBasedOnRole = (role: string, schoolId?: string | number) => {
    console.log('🔐 Navigating based on role:', role, 'school_id:', schoolId);
    switch (role) {
      case 'teacher':
        router.replace('/(teacher)/dashboard');
        break;
      case 'management':
        if (schoolId) {
          router.replace('/(management)/dashboard');
        } else {
          router.replace('/management/setup');
        }
        break;
      case 'parent':
        router.replace('/(parent)/dashboard');
        break;
      case 'student':
        router.replace('/(student)/dashboard');
        break;
      default:
        console.error('Unknown role:', role);
        router.replace('/(auth)/login');
        break;
    }
  };

  // Function to clear session and force logout
  const clearSession = async () => {
    console.log('🚨 Clearing session and forcing logout');
    setLoading(true);
    
    try {
      setSession(null);
      setUser(null);
      setProfile(null);
      await supabase.auth.signOut();
      // Navigation handled by onAuthStateChange listener
    } catch (error) {
      console.error('🚨 Error during session clearing:', error);
      // Force redirect to login if signOut fails
      router.replace('/(auth)/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get the initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔐 Initial session check:', session ? 'AUTHENTICATED' : 'NOT AUTHENTICATED');
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes in auth state
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔐 Auth state change:', event, session ? 'AUTHENTICATED' : 'NOT AUTHENTICATED');
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (event === 'SIGNED_IN' && session?.user) {
        // Check role from user metadata and raw_user_meta_data
        const userMetadata = session.user.user_metadata || {};
        // Define a more specific type for the user object with raw metadata
        const rawMetadata = (session.user as { raw_user_meta_data?: Record<string, any> }).raw_user_meta_data || {};
        const userRole = userMetadata.role || rawMetadata.role;
        
        console.log('🔐 User role from metadata:', userRole);
        
        // If no role in auth metadata, fetch from profiles table
        if (!userRole) {
          await fetchUserProfileAndNavigate(session.user.id);
          return;
        }
        
        navigateBasedOnRole(userRole, rawMetadata.school_id || userMetadata.school_id);
      } else if (event === 'SIGNED_OUT') {
        console.log('🔐 User signed out - redirecting to login');
        setProfile(null);
        router.replace('/(auth)/login');
      }
    });

    // Cleanup the listener on component unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const signOut = async () => {
    console.log('🔐 User signing out');
    setProfile(null);
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    profile,
    loading,
    signOut,
    clearSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
