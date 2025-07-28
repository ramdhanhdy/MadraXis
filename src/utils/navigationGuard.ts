import { useAuthStore } from '../stores/authStore';
import { logger } from './logger';

/**
 * Hook to check if it's safe to make database calls
 * Returns false if navigation is in progress to prevent excessive DB requests
 */
export const useSafeToQuery = () => {
  const { navigationInProgress, loading } = useAuthStore();
  
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
  const { navigationInProgress, loading } = useAuthStore.getState();
  return !navigationInProgress && !loading;
};
