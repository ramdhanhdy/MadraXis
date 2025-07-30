/**
 * Theme Hooks - Pure TypeScript hooks
 * This file contains only the hooks, no JSX
 */

import { useContext } from 'react';
import { ThemeContextType } from '../core/types';
import { EnhancedThemeContext } from './context';

/**
 * Enhanced useTheme hook with error handling
 */
export const useEnhancedTheme = (): ThemeContextType => {
  const context = useContext(EnhancedThemeContext);
  
  if (context === undefined) {
    throw new Error('useEnhancedTheme must be used within an EnhancedThemeProvider');
  }
  
  return context;
};

/**
 * Backward compatibility with existing ThemeProvider
 */
export const useTheme = useEnhancedTheme;
