import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/src/utils/supabase';
import { useRouter } from 'expo-router';

// Define the shape of the context
interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({ 
  session: null, 
  user: null, 
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
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Function to fetch user role from profiles table
  const fetchUserRoleAndNavigate = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, school_id')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        router.replace('/screens/auth/login');
        return;
      }

      if (profile?.role) {
        console.log('Role found in profiles:', profile.role);
        navigateBasedOnRole(profile.role, profile.school_id);
      } else {
        console.error('No role found for user');
        router.replace('/screens/auth/login');
      }
    } catch (error) {
      console.error('Error in fetchUserRoleAndNavigate:', error);
      router.replace('/screens/auth/login');
    }
  };

  // Function to navigate based on user role
  const navigateBasedOnRole = (role: string, schoolId?: string | number) => {
    console.log('Navigating based on role:', role, 'school_id:', schoolId);
    
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
        const rawMetadata = (session.user as any).raw_user_meta_data || {};
        const userRole = userMetadata.role || rawMetadata.role;
        
        console.log('=== USER SIGN IN DEBUG ===');
        console.log('User signed in with email:', session.user.email);
        console.log('User metadata:', userMetadata);
        console.log('Raw user metadata:', rawMetadata);
        console.log('Detected role:', userRole);
        console.log('========================');
        
        // If no role in auth metadata, fetch from profiles table
        if (!userRole) {
          console.log('No role found in metadata, fetching from profiles...');
          await fetchUserRoleAndNavigate(session.user.id);
          return;
        }
        
        navigateBasedOnRole(userRole, rawMetadata.school_id || userMetadata.school_id);
      } else if (event === 'SIGNED_OUT') {
        router.replace('/screens/auth/login');
      }
    });

    // Cleanup the listener on component unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
