import { Redirect } from 'expo-router';
import { useAuth } from '../src/hooks/useAuth';

export default function Index() {
  const { session, loading } = useAuth();

  // Show nothing while loading - let the auth system handle everything
  if (loading) {
    return null;
  }

  // Only redirect to login if definitely not authenticated
  // Let the useAuth hook handle all authenticated navigation
  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  // For authenticated users, return null and let useAuth hook handle navigation
  // This completely eliminates conflicts between index.tsx and useAuth
  return null;
}
