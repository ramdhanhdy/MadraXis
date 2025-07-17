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
        router.replace('/(auth)/login');
      } else if (user && profile) {
        // User is authenticated and profile is loaded
        if (profile.role !== 'management') {
          // Redirect based on role or to login if role doesn't match
          switch (profile.role) {
            case 'teacher':
              router.replace('/(teacher)/dashboard');
              break;
            case 'parent':
              router.replace('/(parent)/dashboard');
              break;
            case 'student':
              router.replace('/(student)/dashboard');
              break;
            default:
              router.replace('/(auth)/login');
          }
        } else if (profile.role === 'management') {
          // Check if school_id exists to decide between dashboard and setup
          const schoolId = user.user_metadata?.school_id || profile.school_id;
          if (schoolId) {
            router.replace('/(management)/dashboard');
          } else {
            router.replace('/management/setup');
          }
        }
      }
      // If user exists but profile is null, we wait for the profile to load
      // The AuthContext will handle fetching the profile data
      // Do not redirect to login in this case to avoid race conditions
    }
  }, [user, profile, loading, router]);

  // While loading or redirecting, show a placeholder
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Memuat...</Text>
    </View>
  );
} 