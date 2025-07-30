import { Redirect } from 'expo-router';
import { useAuth } from '@lib/hooks/useAuth';

// Storybook toggle - set to true to enable Storybook mode
const ENABLE_STORYBOOK = __DEV__ && false; // Change to true to enable Storybook

// Conditionally import Storybook
let StorybookUIRoot: any = null;
if (ENABLE_STORYBOOK) {
  StorybookUIRoot = require('../.rnstorybook').default;
}

export default function Index() {
  // If Storybook is enabled, show Storybook instead of the app
  if (ENABLE_STORYBOOK && StorybookUIRoot) {
    return <StorybookUIRoot />;
  }

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
