/**
 * Navigation History Context - Pure TypeScript context creation
 * This file contains only the context creation and types, no JSX
 */

import { createContext } from 'react';

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

// Navigation History Context Interface
export interface NavigationHistoryContextType {
  history: NavigationHistoryItem[];
  currentIndex: number;
  canGoBack: boolean;
  canGoForward: boolean;
  addToHistory: (path: string, params?: Record<string, any>, label?: string) => void;
  goBack: () => void;
  goForward: () => void;
  clearHistory: () => void;
  getBreadcrumbItems: () => NavigationHistoryItem[];
  navigateToHistoryItem: (index: number) => void;
}

// Create Navigation History Context
export const NavigationHistoryContext = createContext<NavigationHistoryContextType | undefined>(undefined);
