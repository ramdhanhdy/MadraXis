import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth as useAuthContext } from '@context/AuthContext';
import { logger } from '@lib/utils/logger';
import { UserRole } from '@lib/constants/roleCapabilities';

export const useAuth = () => {
  const router = useRouter();
  const {
    session,
    user,
    profile,
    loading,
    navigationInProgress,
    isInitialized,
    hasNavigated,
    lastNavigationTime,
    setNavigationInProgress,
    setHasNavigated,
    setLastNavigationTime,
    signOut,
    clearSession
  } = useAuthContext();

  // Handle navigation based on auth state
  useEffect(() => {
    // Don't navigate if not initialized, still loading, navigation in progress, or already navigated
    if (!isInitialized || loading || navigationInProgress || hasNavigated) {
      return;
    }

    // Don't navigate if we're already on the correct route
    const currentPath = '';

    // If user is authenticated and has profile, navigate to appropriate dashboard
    if (session && profile?.role) {
      const targetRoute = getRouteForRole(profile.role, profile.school_id);

      // Improved route comparison - check if we're already on the target route
      const isOnTargetRoute = isCurrentRouteTarget(currentPath, targetRoute);

      logger.debug(`🔐 Route check: current="${currentPath}", target="${targetRoute}", isOnTarget=${isOnTargetRoute}`);

      if (!isOnTargetRoute) {
        // Add cooldown to prevent rapid navigation attempts
        const now = Date.now();
        const timeSinceLastNav = lastNavigationTime > 0 ? now - lastNavigationTime : 2000; // Allow first navigation

        if (timeSinceLastNav < 500 && lastNavigationTime > 0) { // 500ms cooldown, but only after first nav
          logger.debug(`🔄 Navigation cooldown active, skipping (${timeSinceLastNav}ms ago)`);
          return;
        }

        setLastNavigationTime(now);
        setNavigationInProgress(true);
        setHasNavigated(true);
        logger.debug(`🔐 Navigating to: ${targetRoute} (current: ${currentPath})`);

        try {
          router.replace(targetRoute as any);
        } catch (error) {
          logger.error('Navigation error', { error });
        } finally {
          // Reset navigation flag after a shorter delay
          setTimeout(() => setNavigationInProgress(false), 500);
        }
      } else {
        // We're already on the correct route, mark as navigated
        if (!hasNavigated) {
          logger.debug(`🔐 Already on correct route: ${currentPath}`);
          setHasNavigated(true);
        }
      }
    }
    // If user is not authenticated and not on auth routes, redirect to login
    // Use precise regex to match only legitimate auth routes:
    // - /(auth)/login, /(auth)/reset-password (Expo Router grouped routes)
    // - /auth/login, /auth (standard auth routes)
    const isOnAuthRoute = /^\/(\(auth\)\/|\(auth\)$|auth\/|auth$)/.test(currentPath);
    if (!session && !isOnAuthRoute) {
      logger.debug('🔐 User not authenticated, redirecting to login');
      setHasNavigated(true);
      router.replace('/(auth)/login');
    }
  }, [session, profile, loading, isInitialized, navigationInProgress, hasNavigated]);

  return {
    session,
    user,
    profile,
    loading,
    signOut,
    clearSession
  };
};

// Helper function to check if current route matches target route
function isCurrentRouteTarget(currentPath: string, targetRoute: string): boolean {
  // Normalize paths by removing leading/trailing slashes and converting to lowercase
  const normalizePath = (path: string) => path.replace(/^\/+|\/+$/g, '').toLowerCase();

  const normalizedCurrent = normalizePath(currentPath);
  const normalizedTarget = normalizePath(targetRoute);

  // Extract the key parts of the target route (role and page)
  // e.g., "/(teacher)/dashboard" -> ["teacher", "dashboard"]
  const targetParts = normalizedTarget.replace(/[()]/g, '').split('/').filter(Boolean);

  // Check if current path contains the key parts
  // This handles both exact matches and nested routes
  if (targetParts.length === 0) return false;

  // For exact match
  if (normalizedCurrent === normalizedTarget.replace(/[()]/g, '')) {
    return true;
  }

  // For partial match (check if current path contains the role and page)
  const currentParts = normalizedCurrent.split('/').filter(Boolean);
  return targetParts.every(part => currentParts.includes(part));
}

// Helper function to get route based on user role
function getRouteForRole(role: UserRole, schoolId?: string | number): string {
  switch (role) {
    case 'teacher':
      return '/(teacher)/dashboard';
    case 'management':
      return schoolId ? '/(management)/dashboard' : '/(management)/setup';
    case 'parent':
      return '/(parent)/dashboard';
    case 'student':
      return '/(student)/dashboard';
    default:
      // This case should never be reached due to TypeScript checking
      logger.error('Unknown role', { role });
      return '/(auth)/login';
  }
}
