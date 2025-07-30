/**
 * @deprecated This hook has been deprecated. Use the new NavigationHistoryContext instead.
 * Import from '../context/NavigationHistoryContext' for shared global state.
 */

import { useEffect } from 'react';
import { useNavigationHistory as useNavigationHistoryContext } from '../context/NavigationHistoryContext';

export interface NavigationHistoryItem {
  path: string;
  params?: Record<string, any>;
  timestamp: number;
  label?: string;
}

export interface NavigationHistoryState {
  history: NavigationHistoryItem[];
  currentIndex: number;
  canGoBack: boolean;
  canGoForward: boolean;
}

/**
 * @deprecated Use useNavigationHistory from '../context/NavigationHistoryContext' instead
 * This hook now delegates to the shared context provider
 */
export function useNavigationHistory(maxHistorySize = 10) {
  // Delegate to the context provider
  return useNavigationHistoryContext();
}

/**
 * @deprecated Use useRouteTracking from '../context/NavigationHistoryContext' instead
 * This hook now delegates to the shared context provider
 */
export function useRouteTracking(route: string, label?: string) {
  const { addToHistory } = useNavigationHistoryContext();
  
  useEffect(() => {
    addToHistory(route, {}, label);
  }, [route, label, addToHistory]);
}

/**
 * Hook for generating breadcrumb data for common routes
 * This remains a utility function and doesn't need to be in context
 */
export function useBreadcrumbData(classId?: number, className?: string) {
  const baseItems = [
    {
      label: 'Dashboard',
      path: '/(teacher)/dashboard',
      params: {},
    },
    {
      label: 'Classes',
      path: '/(teacher)/class',
      params: {},
    },
  ];

  if (classId) {
    baseItems.push({
      label: className || `Class ${classId}`,
      path: `/(teacher)/class/${classId}`,
      params: { id: classId },
    });

    // Add add-students breadcrumb
    baseItems.push({
      label: 'Add Students',
      path: `/(teacher)/class/${classId}/add-students`,
      params: { id: classId },
    });
  }

  return baseItems;
}