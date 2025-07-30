/**
 * Theme Hooks and Utilities
 * Provides convenient hooks for accessing theme values and utilities
 */

import { useEnhancedTheme } from '../../design-system/themes/hooks';
import { Theme, ButtonComponentTheme, CardComponentTheme, ModalComponentTheme } from '../../design-system/core/types';
import { UserRole } from '../../design-system/tokens/colors';

/**
 * Main theme hook - re-export from design system
 */
export const useTheme = useEnhancedTheme;

/**
 * Hook to get theme colors
 */
export const useColors = () => {
  const { theme } = useTheme();
  return theme.colors;
};

/**
 * Hook to get typography settings
 */
export const useTypography = () => {
  const { theme } = useTheme();
  return theme.typography;
};

/**
 * Hook to get spacing values
 */
export const useSpacing = () => {
  const { theme } = useTheme();
  return theme.spacing;
};

/**
 * Hook to get shadow values
 */
export const useShadows = () => {
  const { theme } = useTheme();
  return theme.shadows;
};

/**
 * Hook to get border radius values
 */
export const useBorderRadius = () => {
  const { theme } = useTheme();
  return theme.borderRadius;
};

/**
 * Hook to get component theme
 */
export const useComponentTheme = (componentName: keyof Theme['componentThemes']) => {
  const { theme } = useTheme();
  return theme.componentThemes[componentName];
};

/**
 * Hook to check current theme mode
 */
export const useIsDarkMode = (): boolean => {
  const { colorScheme } = useTheme();
  return colorScheme === 'dark';
};

/**
 * Hook to get current user role
 */
export const useCurrentRole = (): UserRole | null => {
  const { currentRole } = useTheme();
  return currentRole;
};

/**
 * Hook to check if user has a specific role
 */
export const useHasThemeRole = (role: UserRole): boolean => {
  const currentRole = useCurrentRole();
  return currentRole === role;
};

/**
 * Hook to get theme strategy information
 */
export const useThemeStrategy = () => {
  const { strategy } = useTheme();
  return {
    type: strategy.type,
    name: strategy.name,
    description: strategy.description,
    isShared: strategy.type === 'shared',
    isRoleBased: strategy.type === 'role-based',
  };
};

/**
 * Hook for responsive values (placeholder for future implementation)
 */
export const useResponsiveValue = <T>(values: {
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

/**
 * Hook for creating consistent styles
 */
export const useStyleHelpers = () => {
  const { theme } = useTheme();
  
  return {
    // Spacing helpers
    margin: (size: keyof typeof theme.spacing) => ({ margin: theme.spacing[size] }),
    marginHorizontal: (size: keyof typeof theme.spacing) => ({ marginHorizontal: theme.spacing[size] }),
    marginVertical: (size: keyof typeof theme.spacing) => ({ marginVertical: theme.spacing[size] }),
    padding: (size: keyof typeof theme.spacing) => ({ padding: theme.spacing[size] }),
    paddingHorizontal: (size: keyof typeof theme.spacing) => ({ paddingHorizontal: theme.spacing[size] }),
    paddingVertical: (size: keyof typeof theme.spacing) => ({ paddingVertical: theme.spacing[size] }),
    
    // Typography helpers
    text: (variant: keyof typeof theme.typography.fontSize) => ({
      fontSize: theme.typography.fontSize[variant],
      fontFamily: theme.typography.fontFamily.primary,
    }),
    
    // Shadow helpers
    shadow: (size: keyof typeof theme.shadows) => ({ 
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
    
    // Border radius helpers
    borderRadius: (size: keyof typeof theme.borderRadius) => ({ 
      borderRadius: theme.borderRadius[size] 
    }),
    
    // Color helpers
    backgroundColor: (color: string) => ({ backgroundColor: color }),
    textColor: (color: string) => ({ color }),
    borderColor: (color: string) => ({ borderColor: color }),
  };
};

/**
 * Hook for theme-aware button styles
 */
export const useButtonStyles = (variant: 'solid' | 'outline' = 'solid', size: 'sm' | 'md' | 'lg' = 'md') => {
  const buttonTheme = useComponentTheme('button') as ButtonComponentTheme;
  const colors = useColors();

  if (!buttonTheme) {
    return {};
  }

  // Use the actual ButtonComponentTheme structure
  const sizeConfig = size === 'sm' ? 'small' : size === 'lg' ? 'large' : 'medium';

  return {
    borderRadius: buttonTheme.borderRadius,
    minHeight: buttonTheme.minHeight[sizeConfig],
    backgroundColor: variant === 'solid' ? colors.primary?.main : 'transparent',
    borderColor: colors.primary?.main,
    borderWidth: variant === 'outline' ? 1 : 0,
  };
};

/**
 * Hook for theme-aware card styles
 */
export const useCardStyles = () => {
  const cardTheme = useComponentTheme('card') as CardComponentTheme;

  if (!cardTheme) {
    return {};
  }

  return {
    borderRadius: cardTheme.borderRadius,
    padding: cardTheme.padding.medium,
    backgroundColor: cardTheme.backgroundColor,
    ...cardTheme.shadow,
  };
};

/**
 * Hook for theme-aware modal styles
 */
export const useModalStyles = () => {
  const modalTheme = useComponentTheme('modal') as ModalComponentTheme;

  if (!modalTheme) {
    return {};
  }

  return {
    borderRadius: modalTheme.borderRadius,
    padding: modalTheme.padding,
    backgroundColor: modalTheme.backgroundColor,
    maxHeight: modalTheme.maxHeight,
    ...modalTheme.shadow,
  };
};

/**
 * Hook to get role-specific colors
 */
export const useRoleColors = (role?: UserRole) => {
  const colors = useColors();
  const currentRole = useCurrentRole();
  const targetRole = role || currentRole;
  
  // Return role-specific colors if available, otherwise return primary colors
  switch (targetRole) {
    case 'student':
      return {
        primary: colors.primary.main,
        secondary: colors.secondary.main,
        accent: '#14B8A6', // Teal
      };
    case 'teacher':
      return {
        primary: colors.primary.main,
        secondary: colors.secondary.main,
        accent: '#10B981', // Green
      };
    case 'parent':
      return {
        primary: colors.primary.main,
        secondary: colors.secondary.main,
        accent: '#FBBF24', // Amber
      };
    case 'management':
      return {
        primary: colors.primary.main,
        secondary: colors.secondary.main,
        accent: '#E11D48', // Rose
      };
    default:
      return {
        primary: colors.primary.main,
        secondary: colors.secondary.main,
        accent: colors.primary.main,
      };
  }
};

/**
 * Hook for theme debugging (development only)
 */
export const useThemeDebug = () => {
  const themeContext = useTheme();
  
  if (process.env.NODE_ENV === 'production') {
    return {
      logTheme: () => {},
      exportTheme: () => '{}',
      validateTheme: () => ({ isValid: true, errors: [], warnings: [] }),
    };
  }
  
  return {
    logTheme: () => {
      console.group('🎨 Theme Debug Information');
      console.log('Current Role:', themeContext.currentRole);
      console.log('Color Scheme:', themeContext.colorScheme);
      console.log('Strategy:', themeContext.strategy);
      console.log('Theme Colors:', themeContext.theme.colors);
      console.log('Component Themes:', themeContext.theme.componentThemes);
      console.groupEnd();
    },
    
    exportTheme: () => {
      return JSON.stringify({
        role: themeContext.currentRole,
        colorScheme: themeContext.colorScheme,
        strategy: themeContext.strategy,
        theme: {
          colors: themeContext.theme.colors,
          typography: themeContext.theme.typography,
          spacing: themeContext.theme.spacing,
          componentThemes: themeContext.theme.componentThemes,
        },
      }, null, 2);
    },
    
    validateTheme: () => {
      // Basic theme validation
      const theme = themeContext.theme;
      const errors: string[] = [];
      const warnings: string[] = [];
      
      if (!theme.colors?.primary?.main) {
        errors.push('Missing primary color');
      }
      
      if (!theme.typography?.fontSize) {
        errors.push('Missing typography fontSize');
      }
      
      if (!theme.spacing) {
        errors.push('Missing spacing values');
      }
      
      return {
        isValid: errors.length === 0,
        errors,
        warnings,
      };
    },
  };
};
