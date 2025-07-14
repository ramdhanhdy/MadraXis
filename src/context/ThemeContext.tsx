/**
 * Theme Context Provider
 * Provides theme tokens and utilities to all components in the app
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { theme, Theme, UserRole, roleThemes } from '../styles/theme';

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
export const useComponentTheme = (component: 'button' | 'card' | 'input' | 'modal' | 'header' | 'tabBar') => {
  const { theme } = useTheme();
  const componentThemes = {
    button: {
      borderRadius: theme.borderRadius.md,
      minHeight: {
        small: 32,
        medium: 40,
        large: 48,
      },
      padding: {
        small: { horizontal: 12, vertical: 6 },
        medium: { horizontal: 16, vertical: 8 },
        large: { horizontal: 20, vertical: 12 },
      },
      typography: {
        small: theme.typography.variants.buttonSmall,
        medium: theme.typography.variants.button,
        large: theme.typography.variants.buttonLarge,
      },
    },
    card: {
      borderRadius: theme.borderRadius.lg,
      padding: {
        none: 0,
        small: theme.spacing.base.sm,
        medium: theme.spacing.base.md,
        large: theme.spacing.base.lg,
      },
      backgroundColor: theme.colors.surface.primary,
      shadow: theme.shadows.card,
    },
    input: {
      borderRadius: theme.borderRadius.md,
      padding: {
        horizontal: theme.spacing.base.md,
        vertical: theme.spacing.base.sm,
      },
      minHeight: 40,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      focusBorderColor: theme.colors.border.focus,
      errorBorderColor: theme.colors.border.error,
      backgroundColor: theme.colors.surface.primary,
    },
    modal: {
      borderRadius: theme.borderRadius['2xl'],
      padding: theme.spacing.base.lg,
      backgroundColor: theme.colors.surface.primary,
      shadow: theme.shadows.modal,
      backdropColor: 'rgba(0, 0, 0, 0.5)',
      maxHeight: '80%',
    },
    header: {
      height: theme.spacing.component.header.height,
      padding: {
        horizontal: theme.spacing.component.header.horizontal,
        vertical: theme.spacing.component.header.vertical,
      },
      backgroundColor: theme.colors.surface.primary,
      shadow: theme.shadows.header,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    },
    tabBar: {
      height: theme.spacing.component.tabBar.height,
      padding: {
        horizontal: theme.spacing.component.tabBar.horizontal,
        vertical: theme.spacing.component.tabBar.vertical,
      },
      backgroundColor: theme.colors.surface.primary,
      shadow: theme.shadows.tabBar,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.primary,
    },
  };
  
  return componentThemes[component];
};

// Hook for responsive values (for future implementation)
export const useResponsiveValue = <T>(values: {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
}) => {
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