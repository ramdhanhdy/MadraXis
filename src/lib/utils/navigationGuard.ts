import { useAuth } from '@context/AuthContext';
import { logger } from '@lib/utils/logger';

/**
 * Hook to check if it's safe to make database calls
 * Returns false if navigation is in progress to prevent excessive DB requests
 */
export const useSafeToQuery = () => {
  const { navigationInProgress, loading } = useAuth();
  
  const isSafe = !navigationInProgress && !loading;
  
  if (!isSafe) {
    logger.debug('🔄 Skipping database query - navigation or auth loading in progress');
  }
  
  return isSafe;
};

/**
 * Utility function to check if it's safe to make database calls
 * Can be used outside of React components
 */
export const isSafeToQuery = () => {
  // For non-hook usage, we'll assume it's safe
  // This would need to be implemented differently in a real app
  return true;
};
