/**
 * Theme Design Tokens
 * Complete design token system combining colors, typography, spacing, and shadows
 */

import { colors, semanticColors, baseColors, roleColors } from './colors';
import { typography, typographyVariants, fontFamily, fontWeight, fontSize, lineHeight } from './typography';
import { spacingTokens, spacing, semanticSpacing, componentSpacing } from './spacing';
import { shadows, semanticShadows, elevationLevels } from './shadows';

// Border Radius Scale
export const borderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
} as const;

// Animation/Transition Durations
export const duration = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

// Animation Easing
export const easing = {
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
} as const;

// Breakpoints for responsive design
export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
} as const;

// Z-Index Scale
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// Complete Theme Interface
export interface Theme {
  colors: typeof colors;
  typography: typeof typography;
  spacing: typeof spacingTokens;
  shadows: typeof shadows;
  borderRadius: typeof borderRadius;
  duration: typeof duration;
  easing: typeof easing;
  breakpoints: typeof breakpoints;
  zIndex: typeof zIndex;
  elevationLevels: typeof elevationLevels;
}

// Main Theme Object
export const theme: Theme = {
  colors,
  typography,
  spacing: spacingTokens,
  shadows,
  borderRadius,
  duration,
  easing,
  breakpoints,
  zIndex,
  elevationLevels,
} as const;

// Component-specific theme tokens
export const componentThemes = {
  // Button theme
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
  
  // Card theme
  card: {
    borderRadius: borderRadius.lg,
    padding: {
      none: 0,
      small: spacing.sm,
      medium: spacing.md,
      large: spacing.lg,
    },
    backgroundColor: semanticColors.surface.primary,
    shadow: shadows.card,
  },
  
  // Input theme
  input: {
    borderRadius: borderRadius.md,
    padding: {
      horizontal: spacing.md,
      vertical: spacing.sm,
    },
    minHeight: 40,
    borderWidth: 1,
    borderColor: semanticColors.border.primary,
    focusBorderColor: semanticColors.border.focus,
    errorBorderColor: semanticColors.border.error,
    backgroundColor: semanticColors.surface.primary,
  },
  
  // Modal theme
  modal: {
    borderRadius: borderRadius['2xl'],
    padding: spacing.lg,
    backgroundColor: semanticColors.surface.primary,
    shadow: shadows.modal,
    backdropColor: 'rgba(0, 0, 0, 0.5)',
    maxHeight: '80%',
  },
  
  // Header theme
  header: {
    height: componentSpacing.header.height,
    padding: {
      horizontal: componentSpacing.header.horizontal,
      vertical: componentSpacing.header.vertical,
    },
    backgroundColor: semanticColors.surface.primary,
    shadow: shadows.header,
    borderBottomWidth: 1,
    borderBottomColor: semanticColors.border.primary,
  },
  
  // Tab Bar theme
  tabBar: {
    height: componentSpacing.tabBar.height,
    padding: {
      horizontal: componentSpacing.tabBar.horizontal,
      vertical: componentSpacing.tabBar.vertical,
    },
    backgroundColor: semanticColors.surface.primary,
    shadow: shadows.tabBar,
    borderTopWidth: 1,
    borderTopColor: semanticColors.border.primary,
  },
} as const;

// Role-specific theme variations
export const roleThemes = {
  student: {
    ...theme,
    colors: {
      ...colors,
      primary: {
        main: roleColors.student.primary,
        light: baseColors.teal[400],
        dark: baseColors.teal[600],
        contrast: baseColors.white,
      },
      secondary: {
        main: roleColors.student.accent,
        light: baseColors.gold[300],
        dark: baseColors.gold[500],
        contrast: baseColors.white,
      },
    },
  },
  teacher: {
    ...theme,
    colors: {
      ...colors,
      primary: {
        main: roleColors.teacher.primary,
        light: baseColors.teal[400],
        dark: baseColors.teal[600],
        contrast: baseColors.white,
      },
      secondary: {
        main: roleColors.teacher.accent,
        light: baseColors.gold[300],
        dark: baseColors.gold[500],
        contrast: baseColors.white,
      },
    },
  },
  parent: {
    ...theme,
    colors: {
      ...colors,
      primary: {
        main: roleColors.parent.primary,
        light: baseColors.teal[400],
        dark: baseColors.teal[600],
        contrast: baseColors.white,
      },
      secondary: {
        main: roleColors.parent.accent,
        light: baseColors.gold[300],
        dark: baseColors.gold[500],
        contrast: baseColors.white,
      },
    },
  },
  management: {
    ...theme,
    colors: {
      ...colors,
      primary: {
        main: roleColors.management.primary,
        light: baseColors.teal[400],
        dark: baseColors.teal[600],
        contrast: baseColors.white,
      },
      secondary: {
        main: roleColors.management.accent,
        light: baseColors.gold[300],
        dark: baseColors.gold[500],
        contrast: baseColors.white,
      },
    },
  },
} as const;

// Export everything
export {
  colors,
  semanticColors,
  baseColors,
  roleColors,
  typography,
  typographyVariants,
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  spacingTokens,
  spacing,
  semanticSpacing,
  componentSpacing,
  shadows,
  semanticShadows,
  elevationLevels,
};

// Type exports
export type BorderRadiusKey = keyof typeof borderRadius;
export type DurationKey = keyof typeof duration;
export type EasingKey = keyof typeof easing;
export type BreakpointKey = keyof typeof breakpoints;
export type ZIndexKey = keyof typeof zIndex;
export type ComponentThemeKey = keyof typeof componentThemes;
export type UserRole = keyof typeof roleThemes;

// Default export
export default theme;