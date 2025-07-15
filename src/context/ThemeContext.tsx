/**
 * Theme Context Provider
 * Provides theme tokens and utilities to all components in the app
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { theme, Theme, UserRole, roleThemes, ComponentThemeKey } from '../styles/theme';

// Theme Context Interface
interface ThemeContextType {
  theme: Theme;
  currentRole: UserRole | null;
  setRole: (role: UserRole | null) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

// Create Theme Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme Provider Props
interface ThemeProviderProps {
  children: ReactNode;
  initialRole?: UserRole | null;
  initialDarkMode?: boolean;
}

// Theme Provider Component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialRole = null,
  initialDarkMode = false,
}) => {
  const [currentRole, setCurrentRole] = useState<UserRole | null>(initialRole);
  const [isDarkMode, setIsDarkMode] = useState(initialDarkMode);

  // Get theme based on current role
  const getCurrentTheme = useCallback((): Theme => {
    if (currentRole && roleThemes[currentRole]) {
      return roleThemes[currentRole];
    }
    return theme;
  }, [currentRole]);

  // Set role and update theme
  const setRole = useCallback((role: UserRole | null) => {
    setCurrentRole(role);
  }, []);

  // Toggle dark mode (for future implementation)
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const contextValue: ThemeContextType = {
    theme: getCurrentTheme(),
    currentRole,
    setRole,
    isDarkMode,
    toggleDarkMode,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Custom hooks for specific theme tokens
export const useColors = () => {
  const { theme } = useTheme();
  return theme.colors;
};

export const useTypography = () => {
  const { theme } = useTheme();
  return theme.typography;
};

export const useSpacing = () => {
  const { theme } = useTheme();
  return theme.spacing;
};

export const useShadows = () => {
  const { theme } = useTheme();
  return theme.shadows;
};

export const useBorderRadius = () => {
  const { theme } = useTheme();
  return theme.borderRadius;
};

// Utility hooks for common styling patterns
export const useComponentTheme = (component: ComponentThemeKey) => {
  const { theme } = useTheme();
  return theme.componentThemes[component];
};

// Hook for responsive values (for future implementation)
export const useResponsiveValue = <T,>(values: {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
}): T | undefined => {
  // For now, return the base value (xs)
  // In the future, this could use screen dimensions to return appropriate value
  return values.xs || values.sm || values.md || values.lg || values.xl;
};

// Hook for creating consistent styles
export const useStyleHelpers = () => {
  const { theme } = useTheme();
  
  return {
    // Spacing helpers
    margin: (size: keyof typeof theme.spacing.base) => ({ margin: theme.spacing.base[size] }),
    marginHorizontal: (size: keyof typeof theme.spacing.base) => ({ marginHorizontal: theme.spacing.base[size] }),
    marginVertical: (size: keyof typeof theme.spacing.base) => ({ marginVertical: theme.spacing.base[size] }),
    padding: (size: keyof typeof theme.spacing.base) => ({ padding: theme.spacing.base[size] }),
    paddingHorizontal: (size: keyof typeof theme.spacing.base) => ({ paddingHorizontal: theme.spacing.base[size] }),
    paddingVertical: (size: keyof typeof theme.spacing.base) => ({ paddingVertical: theme.spacing.base[size] }),
    
    // Typography helpers
    text: (variant: keyof typeof theme.typography.variants) => theme.typography.variants[variant],
    
    // Shadow helpers
    shadow: (size: keyof typeof theme.shadows) => theme.shadows[size],
    
    // Border radius helpers
    borderRadius: (size: keyof typeof theme.borderRadius) => ({ borderRadius: theme.borderRadius[size] }),
  };
};