/**
 * Color Design Tokens
 * Consistent color palette and semantic color mappings for the MadraXis app
 */

// Base Color Palette
export const baseColors = {
  // Primary Brand Colors
  teal: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#005e7a', // Primary brand color
    600: '#004d65',
    700: '#003d51',
    800: '#002d3d',
    900: '#001d29',
  },
  
  // Secondary Brand Colors
  gold: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#f0c75e', // Secondary brand color
    500: '#d97706',
    600: '#b45309',
    700: '#92400e',
    800: '#78350f',
    900: '#451a03',
  },
  
  // Semantic Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#4caf50', // Success color
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#ff9800', // Warning color
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },
  
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#f44336', // Error color
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  
  // Neutral Colors
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5', // Main background
    200: '#eeeeee',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#666666', // Secondary text
    700: '#404040',
    800: '#333333', // Primary text
    900: '#171717',
  },
  
  // Pure Colors
  white: '#ffffff',
  black: '#000000',
} as const;

// Semantic Color Mappings
export const semanticColors = {
  // Primary Colors
  primary: {
    main: baseColors.teal[500],
    light: baseColors.teal[400],
    dark: baseColors.teal[600],
    contrast: baseColors.white,
  },
  
  // Secondary Colors
  secondary: {
    main: baseColors.gold[400],
    light: baseColors.gold[300],
    dark: baseColors.gold[500],
    contrast: baseColors.white,
  },
  
  // Status Colors
  success: {
    main: baseColors.success[500],
    light: baseColors.success[400],
    dark: baseColors.success[600],
    contrast: baseColors.white,
  },
  
  warning: {
    main: baseColors.warning[500],
    light: baseColors.warning[400],
    dark: baseColors.warning[600],
    contrast: baseColors.white,
  },
  
  error: {
    main: baseColors.error[600],
    light: baseColors.error[400],
    dark: baseColors.error[700],
    contrast: baseColors.white,
  },
  
  // Info Colors
  info: {
    main: baseColors.teal[500],
    light: baseColors.teal[400],
    dark: baseColors.teal[600],
    contrast: baseColors.white,
  },
  
  // Background Colors
  background: {
    primary: baseColors.neutral[100], // #f5f5f5
    secondary: baseColors.white,
    tertiary: baseColors.neutral[50],
  },
  
  // Surface Colors
  surface: {
    primary: baseColors.white,
    secondary: baseColors.neutral[50],
    tertiary: baseColors.neutral[100],
  },
  
  // Text Colors
  text: {
    primary: baseColors.neutral[800], // #333333
    secondary: baseColors.neutral[600], // #666666
    tertiary: baseColors.neutral[500],
    disabled: baseColors.neutral[400],
    inverse: baseColors.white,
  },
  
  // Border Colors
  border: {
    primary: baseColors.neutral[200], // #eeeeee
    secondary: baseColors.neutral[300],
    focus: baseColors.teal[500],
    error: baseColors.error[600],
  },
  
  // Interactive Colors
  interactive: {
    hover: baseColors.neutral[50],
    pressed: baseColors.neutral[100],
    focus: baseColors.teal[100],
    disabled: baseColors.neutral[200],
  },
} as const;

// Role-specific Color Variations - distinct colors for visual differentiation
export const roleColors = {
  student: {
    primary: baseColors.teal[500],     // Teal - learning and growth
    accent: baseColors.teal[300],      // Lighter teal accent
  },
  teacher: {
    primary: baseColors.success[500],  // Green - guidance and knowledge
    accent: baseColors.gold[400],      // Gold - achievement and wisdom
  },
  parent: {
    primary: baseColors.warning[500],  // Orange - care and protection
    accent: baseColors.warning[300],   // Lighter orange accent
  },
  management: {
    primary: baseColors.error[600],    // Red - authority and decisions
    accent: baseColors.neutral[600],   // Neutral gray - professionalism
  },
} as const;

// Export all colors
export const colors = {
  ...baseColors,
  ...semanticColors,
  role: roleColors,
} as const;

// Type definitions
export type BaseColorKey = keyof typeof baseColors;
export type SemanticColorKey = keyof typeof semanticColors;
export type ColorVariant = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
export type UserRole = 'student' | 'teacher' | 'parent' | 'management';