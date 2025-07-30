/**
 * Theme Builder Engine
 * Core theme composition system with deep merge capability and strategy pattern
 */

import { Theme, ThemeConfig, ThemeStrategy, RoleThemeConfig, AnimationTokens, AccessibilityTokens, DeepPartial } from './types';
import { deepMerge, generateColorVariants, validateTheme } from './utils';

// Import theme tokens from design system
import { baseColors, semanticColors, roleColors } from '../tokens/colors';
import { typography } from '../tokens/typography';
import { spacingTokens } from '../tokens/spacing';
import { shadows } from '../tokens/shadows';
import { borderRadius, duration, easing, breakpoints, zIndex, zIndexUtils, nativeEasing, elevationLevels } from '../tokens';

// Define UserRole type locally since it was in the old styles
export type UserRole = 'student' | 'teacher' | 'parent' | 'management';

/**
 * Enhanced animation tokens
 */
const animationTokens: AnimationTokens = {
  duration: {
    instant: 0,
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  transitions: {
    fade: { opacity: [0, 1] },
    slide: { transform: [{ translateY: 20 }, { translateY: 0 }] },
    scale: { transform: [{ scale: 0.95 }, { scale: 1 }] },
  },
};

/**
 * Enhanced accessibility tokens
 */
const accessibilityTokens: AccessibilityTokens = {
  minTouchTarget: 44,
  focusRing: {
    width: 2,
    offset: 2,
    color: 'primary.main',
  },
  contrast: {
    minimum: 4.5,
    enhanced: 7,
  },
  reducedMotion: {
    duration: 0,
    easing: 'linear',
  },
};

/**
 * Create component themes based on current theme colors
 */
function createComponentThemes(theme: Partial<Theme>) {
  const primaryColor = theme.colors?.primary?.main || baseColors.teal[500];
  const backgroundColor = theme.colors?.surface?.primary || baseColors.white;
  
  return {
    button: {
      borderRadius: borderRadius.md,
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
        small: typography.variants.buttonSmall,
        medium: typography.variants.button,
        large: typography.variants.buttonLarge,
      },
    },
    card: {
      borderRadius: borderRadius.lg,
      padding: {
        none: 0,
        small: spacingTokens.base.sm,
        medium: spacingTokens.base.md,
        large: spacingTokens.base.lg,
      },
      backgroundColor,
      shadow: shadows.semantic.card.default,
    },
    modal: {
      borderRadius: borderRadius['2xl'],
      padding: spacingTokens.base.lg,
      backgroundColor,
      shadow: shadows.semantic.modal,
      backdropColor: 'rgba(0, 0, 0, 0.5)',
      maxHeight: '80%',
    },
    navigation: {
      backgroundColor: primaryColor,
      accentColor: theme.colors?.secondary?.main || baseColors.gold[400],
      height: 60,
      padding: {
        horizontal: spacingTokens.base.md,
        vertical: spacingTokens.base.sm,
      },
    },
  };
}

/**
 * Create base light theme
 */
export function createLightBaseTheme(): Theme {
  return {
    colors: {
      primary: {
        main: semanticColors.primary.main,
        light: semanticColors.primary.light,
        dark: semanticColors.primary.dark,
        contrast: semanticColors.primary.contrast,
      },
      secondary: {
        main: semanticColors.secondary.main,
        light: semanticColors.secondary.light,
        dark: semanticColors.secondary.dark,
        contrast: semanticColors.secondary.contrast,
      },
      success: semanticColors.success,
      warning: semanticColors.warning,
      error: semanticColors.error,
      info: semanticColors.info,
      background: semanticColors.background,
      surface: semanticColors.surface,
      text: semanticColors.text,
      border: semanticColors.border,
      interactive: semanticColors.interactive,
      role: roleColors,
      teal: baseColors.teal,
      gold: baseColors.gold,
      neutral: baseColors.neutral,
      white: baseColors.white,
      black: baseColors.black,
    },
    typography,
    spacing: spacingTokens,
    shadows,
    borderRadius,
    duration,
    easing,
    nativeEasing,
    breakpoints,
    zIndex,
    zIndexUtils,
    elevationLevels,
    animations: animationTokens,
    accessibility: accessibilityTokens,
    componentThemes: {} as any, // Will be set after theme creation
  };
}

/**
 * Create base dark theme (placeholder for future implementation)
 */
export function createDarkBaseTheme(): Theme {
  const lightTheme = createLightBaseTheme();
  
  // For now, return light theme with dark color adjustments
  // This will be enhanced in future iterations
  return deepMerge(lightTheme, {
    colors: {
      background: {
        primary: baseColors.neutral[900],
        secondary: baseColors.neutral[800],
        tertiary: baseColors.neutral[700],
      },
      surface: {
        primary: baseColors.neutral[800],
        secondary: baseColors.neutral[700],
        tertiary: baseColors.neutral[600],
      },
      text: {
        primary: baseColors.neutral[100],
        secondary: baseColors.neutral[300],
        tertiary: baseColors.neutral[400],
        disabled: baseColors.neutral[500],
        inverse: baseColors.neutral[900],
      },
      border: {
        primary: baseColors.neutral[700],
        secondary: baseColors.neutral[600],
        focus: baseColors.teal[400],
        error: baseColors.error[500],
      },
    },
  });
}

/**
 * Create role-specific theme configuration
 */
export function createRoleThemeConfig(role: UserRole): DeepPartial<Theme> {
  // Role-specific color mappings based on specifications
  const roleColorMappings = {
    student: {
      primary: { main: '#14B8A6', light: '#2DD4BF', dark: '#0D9488' }, // Teal
      secondary: { main: '#5EEAD4', light: '#99F6E4', dark: '#2DD4BF' },
    },
    teacher: {
      primary: { main: '#10B981', light: '#4ADE80', dark: '#059669' }, // Green
      secondary: { main: '#86EFAC', light: '#BBF7D0', dark: '#4ADE80' },
    },
    parent: {
      primary: { main: '#FBBF24', light: '#FCD34D', dark: '#D97706' }, // Amber
      secondary: { main: '#FDE68A', light: '#FEF3C7', dark: '#FBBF24' },
    },
    management: {
      primary: { main: '#E11D48', light: '#FB7185', dark: '#BE123C' }, // Rose
      secondary: { main: '#FDA4AF', light: '#FECDD3', dark: '#FB7185' },
    },
  };

  const roleThemeColors = roleColorMappings[role];
  
  return {
    colors: {
      primary: {
        main: roleThemeColors.primary.main,
        light: roleThemeColors.primary.light,
        dark: roleThemeColors.primary.dark,
        contrast: baseColors.white,
      },
      secondary: {
        main: roleThemeColors.secondary.main,
        light: roleThemeColors.secondary.light,
        dark: roleThemeColors.secondary.dark,
        contrast: baseColors.white,
      },
    },
  };
}

/**
 * Main theme creation function with deep merge capability
 */
export function createTheme(config: ThemeConfig, role?: UserRole): Theme {
  // Start with base theme
  const baseTheme = config.baseTheme === 'dark' 
    ? createDarkBaseTheme() 
    : createLightBaseTheme();
  
  // Apply role overrides if specified
  let themeWithRoleOverrides = baseTheme;
  if (config.roleOverrides) {
    themeWithRoleOverrides = deepMerge(baseTheme, config.roleOverrides);
  }
  
  // Apply role-specific configuration if role is provided
  let themeWithRoleConfig = themeWithRoleOverrides;
  if (role) {
    const roleConfig = createRoleThemeConfig(role);
    themeWithRoleConfig = deepMerge(themeWithRoleOverrides, roleConfig);
  }
  
  // Apply custom overrides
  let finalTheme = themeWithRoleConfig;
  if (config.customizations) {
    finalTheme = deepMerge(themeWithRoleConfig, config.customizations);
  }
  
  // Generate component themes based on final colors
  finalTheme.componentThemes = createComponentThemes(finalTheme);
  
  // Validate theme in development
  if (__DEV__) {
    const validation = validateTheme(finalTheme);
    if (!validation.isValid) {
      console.warn('Theme validation failed:', validation.errors);
    }
    if (validation.warnings.length > 0) {
      console.warn('Theme validation warnings:', validation.warnings);
    }
  }
  
  return finalTheme;
}

/**
 * Create theme strategy for flexible theme management
 */
export function createThemeStrategy(
  type: 'shared' | 'role-based',
  config: ThemeConfig
): ThemeStrategy {
  return {
    name: type === 'shared' ? 'Shared Theme Strategy' : 'Role-Based Theme Strategy',
    description: type === 'shared' 
      ? 'Single theme used across all user roles'
      : 'Different themes for each user role',
    type,
    themes: {
      shared: type === 'shared' ? createTheme(config) : undefined,
      roles: type === 'role-based' ? {
        student: createTheme(config, 'student'),
        teacher: createTheme(config, 'teacher'),
        parent: createTheme(config, 'parent'),
        management: createTheme(config, 'management'),
      } : undefined,
    },
    resolver: (resolverConfig: ThemeConfig, role?: UserRole) => {
      if (type === 'shared') {
        return createTheme(resolverConfig);
      } else {
        return role ? createTheme(resolverConfig, role) : createTheme(resolverConfig);
      }
    },
  };
}

// Export default configurations
export const defaultLightThemeConfig: ThemeConfig = {
  strategy: 'shared',
  baseTheme: 'light',
};

export const defaultDarkThemeConfig: ThemeConfig = {
  strategy: 'shared',
  baseTheme: 'dark',
};

export const defaultRoleBasedThemeConfig: ThemeConfig = {
  strategy: 'role-based',
  baseTheme: 'light',
};
