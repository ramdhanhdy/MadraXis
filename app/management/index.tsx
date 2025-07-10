import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { Text, View } from 'react-native';

export default function ManagementIndex() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/screens/auth/login');
      } else if (profile && profile.role !== 'management') {
        // Redirect based on role or to login if role doesn't match
        switch (profile.role) {
          case 'teacher':
            router.replace('/screens/teacher/TeacherDashboard');
            break;
          case 'parent':
            router.replace('/screens/parent/ParentDashboard');
            break;
          case 'student':
            router.replace('/screens/student/StudentDashboard');
            break;
          default:
            router.replace('/screens/auth/login');
        }
      } else if (user && !profile) {
        // If user is logged in but profile isn't loaded yet, wait or fetch profile
        // For now, we'll assume AuthContext will handle this
        router.replace('/screens/auth/login');
      } else if (user && profile && profile.role === 'management') {
        // Check if school_id exists to decide between dashboard and setup
        const schoolId = user.user_metadata?.school_id || profile.school_id;
        if (schoolId) {
          router.replace('/management/dashboard');
        } else {
          router.replace('/management/setup');
        }
      }
    }
  }, [user, profile, loading, router]);

  // While loading or redirecting, show a placeholder
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Memuat...</Text>
    </View>
  );
} 