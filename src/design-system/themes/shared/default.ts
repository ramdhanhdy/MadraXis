/**
 * Shared Theme Configuration
 * Default theme configuration used across all roles with fallback support
 */

import { Theme, ThemeConfig, ThemeStrategy } from '../../core/types';
import { createTheme } from '../../core/theme-builder';
import { enhancedLightTheme, enhancedDarkTheme } from '../base';
import { deepMerge } from '../../core/utils';
import { baseColors } from '../../tokens/colors';

/**
 * Shared theme customizations that apply to all roles
 */
export const sharedThemeCustomizations = {
  // Consistent branding elements across all roles
  branding: {
    logoColor: baseColors.teal[600],
    brandAccent: baseColors.gold[400],
    institutionColor: baseColors.neutral[700],
  },
  
  // Shared component customizations
  components: {
    // Header styling consistent across roles
    header: {
      backgroundColor: baseColors.white,
      borderBottomColor: baseColors.neutral[200],
      titleColor: baseColors.neutral[800],
      shadow: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
      },
    },
    
    // Navigation styling
    navigation: {
      backgroundColor: baseColors.white,
      borderColor: baseColors.neutral[200],
      activeIndicatorColor: baseColors.teal[500],
    },
    
    // Form elements
    form: {
      inputBorderColor: baseColors.neutral[300],
      inputFocusColor: baseColors.teal[500],
      labelColor: baseColors.neutral[700],
      placeholderColor: baseColors.neutral[500],
    },
    
    // Status indicators
    status: {
      successColor: baseColors.success[500],
      warningColor: baseColors.warning[500],
      errorColor: baseColors.error[600],
      infoColor: baseColors.teal[500],
    },
  },
  
  // Shared accessibility enhancements
  accessibility: {
    // Enhanced focus indicators
    focusRing: {
      width: 2,
      offset: 2,
      color: baseColors.teal[500],
      style: 'solid',
    },
    
    // Consistent touch targets
    minTouchTarget: 44,
    
    // High contrast mode support
    highContrast: {
      enabled: false, // Can be toggled by user preference
      borderWidth: 2,
      textWeight: 'bold',
    },
  },
  
  // Shared animation preferences
  animations: {
    // Conservative animations suitable for all users
    defaultDuration: 300,
    defaultEasing: 'ease-out',
    reducedMotion: false, // Respects user system preferences
  },
} as const;

/**
 * Light shared theme configuration
 */
export const lightSharedTheme: Theme = deepMerge(enhancedLightTheme, {
  colors: {
    // Neutral primary/secondary for shared theme
    primary: {
      main: baseColors.teal[500],
      light: baseColors.teal[400],
      dark: baseColors.teal[600],
      contrast: baseColors.white,
    },
    secondary: {
      main: baseColors.gold[400],
      light: baseColors.gold[300],
      dark: baseColors.gold[500],
      contrast: baseColors.white,
    },
  },
  
  // Apply shared customizations
  branding: sharedThemeCustomizations.branding,
  sharedComponents: sharedThemeCustomizations.components,
  sharedAccessibility: sharedThemeCustomizations.accessibility,
  sharedAnimations: sharedThemeCustomizations.animations,
});

/**
 * Dark shared theme configuration
 */
export const darkSharedTheme: Theme = deepMerge(enhancedDarkTheme, {
  colors: {
    // Adjusted for dark mode
    primary: {
      main: baseColors.teal[400], // Brighter for dark backgrounds
      light: baseColors.teal[300],
      dark: baseColors.teal[500],
      contrast: baseColors.neutral[900],
    },
    secondary: {
      main: baseColors.gold[400],
      light: baseColors.gold[300],
      dark: baseColors.gold[500],
      contrast: baseColors.neutral[900],
    },
  },
  
  // Dark mode shared customizations
  branding: {
    ...sharedThemeCustomizations.branding,
    logoColor: baseColors.teal[400], // Brighter for dark mode
    institutionColor: baseColors.neutral[300],
  },
  
  sharedComponents: {
    ...sharedThemeCustomizations.components,
    header: {
      ...sharedThemeCustomizations.components.header,
      backgroundColor: baseColors.neutral[800],
      borderBottomColor: baseColors.neutral[700],
      titleColor: baseColors.neutral[100],
    },
    navigation: {
      ...sharedThemeCustomizations.components.navigation,
      backgroundColor: baseColors.neutral[800],
      borderColor: baseColors.neutral[700],
    },
  },
  
  sharedAccessibility: {
    ...sharedThemeCustomizations.accessibility,
    focusRing: {
      ...sharedThemeCustomizations.accessibility.focusRing,
      color: baseColors.teal[400], // Brighter for dark mode
    },
  },
});

/**
 * Default shared theme configuration for createTheme
 */
export const defaultSharedThemeConfig: ThemeConfig = {
  strategy: 'shared',
  baseTheme: 'light',
  customizations: sharedThemeCustomizations,
};

/**
 * Shared theme strategy - single theme for all roles
 */
export const sharedThemeStrategy: ThemeStrategy = {
  name: 'Shared Theme Strategy',
  description: 'Single consistent theme used across all user roles',
  type: 'shared',
  themes: {
    shared: lightSharedTheme,
  },
  resolver: (config: ThemeConfig) => {
    const baseTheme = config.baseTheme === 'dark' ? darkSharedTheme : lightSharedTheme;
    
    if (config.customizations) {
      return deepMerge(baseTheme, config.customizations);
    }
    
    return baseTheme;
  },
};

/**
 * Create shared theme with customizations
 */
export function createSharedTheme(
  colorScheme: 'light' | 'dark' = 'light',
  customizations?: Partial<Theme>
): Theme {
  const baseTheme = colorScheme === 'dark' ? darkSharedTheme : lightSharedTheme;
  
  if (customizations) {
    return deepMerge(baseTheme, customizations);
  }
  
  return baseTheme;
}

/**
 * Fallback theme - used when role-specific theme fails to load
 */
export const fallbackTheme: Theme = lightSharedTheme;

/**
 * Theme validation for shared themes
 */
export function validateSharedTheme(theme: Theme): boolean {
  try {
    // Basic validation checks
    return !!(
      theme.colors?.primary?.main &&
      theme.colors?.secondary?.main &&
      theme.colors?.background?.primary &&
      theme.colors?.text?.primary &&
      theme.componentThemes
    );
  } catch (error) {
    console.error('Shared theme validation failed:', error);
    return false;
  }
}

// Export default shared theme
export default lightSharedTheme;
