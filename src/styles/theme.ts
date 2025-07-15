/**
 * Theme Design Tokens
 * Complete design token system combining colors, typography, spacing, and shadows
 */

import { Easing } from 'react-native';
import { colors, semanticColors, baseColors, roleColors, UserRole } from './colors';
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

// Animation Easing (CSS values for web)
export const easing = {
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
} as const;

// Native Animation Easing (React Native Easing functions)
export const nativeEasing = {
  linear: Easing.linear,
  ease: Easing.ease,
  easeIn: Easing.in(Easing.ease),
  easeOut: Easing.out(Easing.ease),
  easeInOut: Easing.inOut(Easing.ease),
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

// Function to generate component themes from a base theme
export const createComponentThemes = (currentTheme: Omit<Theme, 'componentThemes'>) => ({
  button: {
    borderRadius: currentTheme.borderRadius.md,
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
      small: currentTheme.typography.variants.buttonSmall,
      medium: currentTheme.typography.variants.button,
      large: currentTheme.typography.variants.buttonLarge,
    },
  },
  card: {
    borderRadius: currentTheme.borderRadius.lg,
    padding: {
      none: 0,
      small: currentTheme.spacing.base.sm,
      medium: currentTheme.spacing.base.md,
      large: currentTheme.spacing.base.lg,
    },
    backgroundColor: currentTheme.colors.surface.primary,
    shadow: currentTheme.shadows.card,
  },
  input: {
    borderRadius: currentTheme.borderRadius.md,
    padding: {
      horizontal: currentTheme.spacing.base.md,
      vertical: currentTheme.spacing.base.sm,
    },
    minHeight: 40,
    borderWidth: 1,
    borderColor: currentTheme.colors.border.primary,
    focusBorderColor: currentTheme.colors.border.focus,
    errorBorderColor: currentTheme.colors.border.error,
    backgroundColor: currentTheme.colors.surface.primary,
  },
  modal: {
    borderRadius: currentTheme.borderRadius['2xl'],
    padding: currentTheme.spacing.base.lg,
    backgroundColor: currentTheme.colors.surface.primary,
    shadow: currentTheme.shadows.modal,
    backdropColor: 'rgba(0, 0, 0, 0.5)',
    maxHeight: '80%',
  },
  header: {
    height: currentTheme.spacing.component.header.height,
    padding: {
      horizontal: currentTheme.spacing.component.header.horizontal,
      vertical: currentTheme.spacing.component.header.vertical,
    },
    backgroundColor: currentTheme.colors.surface.primary,
    shadow: currentTheme.shadows.header,
    borderBottomWidth: 1,
    borderBottomColor: currentTheme.colors.border.primary,
  },
  tabBar: {
    height: currentTheme.spacing.component.tabBar.height,
    padding: {
      horizontal: currentTheme.spacing.component.tabBar.horizontal,
      vertical: currentTheme.spacing.component.tabBar.vertical,
    },
    backgroundColor: currentTheme.colors.surface.primary,
    shadow: currentTheme.shadows.tabBar,
    borderTopWidth: 1,
    borderTopColor: currentTheme.colors.border.primary,
  },
});

const baseTheme = {
  colors,
  typography,
  spacing: spacingTokens,
  shadows,
  borderRadius,
  duration,
  easing,
  nativeEasing,
  breakpoints,
  zIndex,
  elevationLevels,
};

const componentThemes = createComponentThemes(baseTheme);

// Complete Theme Interface
export interface Theme {
  colors: typeof colors;
  typography: typeof typography;
  spacing: typeof spacingTokens;
  shadows: typeof shadows;
  borderRadius: typeof borderRadius;
  duration: typeof duration;
  easing: typeof easing;
  nativeEasing: typeof nativeEasing;
  breakpoints: typeof breakpoints;
  zIndex: typeof zIndex;
  elevationLevels: typeof elevationLevels;
  componentThemes: typeof componentThemes;
}

// Main Theme Object
export const theme: Theme = {
  ...baseTheme,
  componentThemes,
} as const;



// Role-specific theme variations
const createRoleTheme = (role: UserRole): Theme => {
  const roleBaseTheme = {
    ...baseTheme,
    colors: {
      ...colors,
      primary: {
        main: roleColors[role].primary,
        light: baseColors.teal[400],
        dark: baseColors.teal[600],
        contrast: baseColors.white,
      },
      secondary: {
        main: roleColors[role].accent,
        light: baseColors.gold[300],
        dark: baseColors.gold[500],
        contrast: baseColors.white,
      },
    },
  };

  return {
    ...roleBaseTheme,
    componentThemes: createComponentThemes(roleBaseTheme),
  };
};

export const roleThemes = {
  student: createRoleTheme('student'),
  teacher: createRoleTheme('teacher'),
  parent: createRoleTheme('parent'),
  management: createRoleTheme('management'),
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

// Default export
export default theme;