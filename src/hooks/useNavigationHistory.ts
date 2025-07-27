import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'expo-router';

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
 * Hook for managing navigation history and state
 * Tracks navigation flow and provides breadcrumb functionality
 */
export function useNavigationHistory(maxHistorySize = 10) {
  const [history, setHistory] = useState<NavigationHistoryItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const router = useRouter();

  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < history.length - 1;

  /**
   * Add a new navigation entry to history
   */
  const addToHistory = useCallback((
    path: string,
    params?: Record<string, any>,
    label?: string
  ) => {
    const newItem: NavigationHistoryItem = {
      path,
      params,
      timestamp: Date.now(),
      label,
    };

    setHistory(prevHistory => {
      // Remove any forward history if we're not at the end
      const newHistory = prevHistory.slice(0, currentIndex + 1);
      
      // Add new item
      newHistory.push(newItem);
      
      // Limit history size
      if (newHistory.length > maxHistorySize) {
        newHistory.shift();
      }
      
      return newHistory;
    });

    setCurrentIndex(prevIndex => Math.min(prevIndex + 1, maxHistorySize - 1));
  }, [currentIndex, maxHistorySize]);

  /**
   * Navigate back in history
   */
  const goBack = useCallback(() => {
    if (canGoBack) {
      const previousItem = history[currentIndex - 1];
      setCurrentIndex(prev => prev - 1);
      router.push(previousItem.path as any);
    }
  }, [canGoBack, currentIndex, history, router]);

  /**
   * Navigate forward in history
   */
  const goForward = useCallback(() => {
    if (canGoForward) {
      const nextItem = history[currentIndex + 1];
      setCurrentIndex(prev => prev + 1);
      router.push(nextItem.path as any);
    }
  }, [canGoForward, currentIndex, history, router]);

  /**
   * Clear navigation history
   */
  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
  }, []);

  /**
   * Get breadcrumb items for current navigation path
   */
  const getBreadcrumbItems = useCallback((): NavigationHistoryItem[] => {
    return history.slice(0, currentIndex + 1);
  }, [history, currentIndex]);

  /**
   * Navigate to a specific point in history
   */
  const navigateToHistoryItem = useCallback((index: number) => {
    if (index >= 0 && index <= currentIndex) {
      const item = history[index];
      setCurrentIndex(index);
      router.push(item.path as any);
    }
  }, [currentIndex, history, router]);

  return {
    history,
    currentIndex,
    canGoBack,
    canGoForward,
    addToHistory,
    goBack,
    goForward,
    clearHistory,
    getBreadcrumbItems,
    navigateToHistoryItem,
  };
}

/**
 * Hook for tracking navigation to specific routes
 */
export function useRouteTracking(route: string, label?: string) {
  const { addToHistory } = useNavigationHistory();

  useEffect(() => {
    addToHistory(route, {}, label);
  }, [route, label, addToHistory]);
}

/**
 * Hook for generating breadcrumb data for common routes
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