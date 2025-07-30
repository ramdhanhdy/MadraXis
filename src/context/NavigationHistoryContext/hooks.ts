/**
 * Navigation History Hooks - Pure TypeScript hooks
 * This file contains only the hooks, no JSX
 */

import { useContext } from 'react';
import { NavigationHistoryContext, NavigationHistoryContextType } from './context';

/**
 * Hook to use navigation history context
 */
export const useNavigationHistory = (): NavigationHistoryContextType => {
  const context = useContext(NavigationHistoryContext);
  
  if (context === undefined) {
    throw new Error('useNavigationHistory must be used within a NavigationHistoryProvider');
  }
  
  return context;
};

/**
 * Hook to get current navigation state
 */
export const useNavigationState = () => {
  const { history, currentIndex, canGoBack, canGoForward } = useNavigationHistory();
  return { history, currentIndex, canGoBack, canGoForward };
};

/**
 * Hook to get navigation actions
 */
export const useNavigationActions = () => {
  const { addToHistory, goBack, goForward, clearHistory, navigateToHistoryItem } = useNavigationHistory();
  return { addToHistory, goBack, goForward, clearHistory, navigateToHistoryItem };
};

/**
 * Hook to get breadcrumb items
 */
export const useBreadcrumbs = () => {
  const { getBreadcrumbItems } = useNavigationHistory();
  return getBreadcrumbItems();
};
