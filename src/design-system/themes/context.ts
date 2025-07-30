/**
 * Theme Context - Pure TypeScript context creation
 * This file contains only the context creation and types, no JSX
 */

import { createContext } from 'react';
import { ThemeContextType } from '../core/types';

/**
 * Enhanced Theme Context
 * Created separately from the Provider to avoid JSX resolution issues
 */
export const EnhancedThemeContext = createContext<ThemeContextType | undefined>(undefined);
