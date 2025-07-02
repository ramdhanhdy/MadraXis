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
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({ 
  session: null, 
  user: null, 
  profile: null,
  loading: true, 
  signOut: async () => {} 
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
        router.replace('/screens/auth/login');
        return;
      }

      if (userProfile?.role) {
        setProfile(userProfile as Profile);
        navigateBasedOnRole(userProfile.role, userProfile.school_id);
      } else {
        console.error('No role found for user');
        router.replace('/screens/auth/login');
      }
    } catch (error) {
      console.error('Error in fetchUserProfileAndNavigate:', error);
      router.replace('/screens/auth/login');
    }
  };

  // Function to navigate based on user role
  const navigateBasedOnRole = (role: string, schoolId?: string | number) => {
    switch (role) {
      case 'teacher':
        router.replace('/screens/teacher/TeacherDashboard');
        break;
      case 'management':
        if (schoolId) {
          router.replace('/management/dashboard');
        } else {
          router.replace('/management/setup');
        }
        break;
      case 'parent':
        router.replace('/screens/parent/ParentDashboard');
        break;
      case 'student':
        router.replace('/screens/student/StudentDashboard');
        break;
      default:
        console.error('Unknown role:', role);
        router.replace('/screens/auth/login');
        break;
    }
  };

  useEffect(() => {
    // Get the initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes in auth state
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (event === 'SIGNED_IN' && session?.user) {
        // Check role from user metadata and raw_user_meta_data
        const userMetadata = session.user.user_metadata || {};
        // Define a more specific type for the user object with raw metadata
        const rawMetadata = (session.user as { raw_user_meta_data?: Record<string, any> }).raw_user_meta_data || {};
        const userRole = userMetadata.role || rawMetadata.role;
        
        // If no role in auth metadata, fetch from profiles table
        if (!userRole) {
          await fetchUserProfileAndNavigate(session.user.id);
          return;
        }
        
        navigateBasedOnRole(userRole, rawMetadata.school_id || userMetadata.school_id);
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
        router.replace('/screens/auth/login');
      }
    });

    // Cleanup the listener on component unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const signOut = async () => {
    setProfile(null);
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    profile,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
