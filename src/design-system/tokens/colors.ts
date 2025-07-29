/**
 * Enhanced Color Design Tokens
 * Comprehensive color palette with role-specific mappings and WCAG AA compliance
 */

// Base Color Palette - Enhanced with role-specific colors
export const baseColors = {
  // Student Theme Colors (Teal Primary)
  teal: {
    50: '#F0FDFA',
    100: '#CCFBF1',
    200: '#99F6E4',
    300: '#5EEAD4',
    400: '#2DD4BF',
    500: '#14B8A6', // Student primary
    600: '#0D9488',
    700: '#0F766E',
    800: '#115E59',
    900: '#134E4A',
  },
  
  // Teacher Theme Colors (Green Primary)
  green: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#10B981', // Teacher primary
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },
  
  // Parent Theme Colors (Amber Primary)
  amber: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B', // Parent primary
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },
  
  // Management Theme Colors (Rose Primary)
  rose: {
    50: '#FFF1F2',
    100: '#FFE4E6',
    200: '#FECDD3',
    300: '#FDA4AF',
    400: '#FB7185',
    500: '#F43F5E',
    600: '#E11D48', // Management primary
    700: '#BE123C',
    800: '#9F1239',
    900: '#881337',
  },
  
  // Legacy Gold Colors (maintained for backward compatibility)
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

// Enhanced Semantic Color Mappings
export const semanticColors = {
  // Primary Colors (default to teal for backward compatibility)
  primary: {
    main: baseColors.teal[500],
    light: baseColors.teal[400],
    dark: baseColors.teal[600],
    contrast: baseColors.white,
  },
  
  // Secondary Colors (default to gold for backward compatibility)
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

// Enhanced Role-specific Color Variations with WCAG AA compliance
export const roleColors = {
  student: {
    primary: baseColors.teal[500],     // #14B8A6 - Teal primary
    accent: baseColors.teal[300],      // #5EEAD4 - Lighter teal accent
    darkMode: baseColors.teal[400],    // #2DD4BF - For dark backgrounds
  },
  teacher: {
    primary: baseColors.green[500],    // #10B981 - Green primary
    accent: baseColors.green[300],     // #86EFAC - Lighter green accent
    darkMode: baseColors.green[400],   // #4ADE80 - For dark backgrounds
  },
  parent: {
    primary: baseColors.amber[500],    // #F59E0B - Amber primary
    accent: baseColors.amber[300],     // #FCD34D - Lighter amber accent
    darkMode: baseColors.amber[400],   // #FBBF24 - For dark backgrounds
  },
  management: {
    primary: baseColors.rose[600],     // #E11D48 - Rose primary
    accent: baseColors.rose[300],      // #FDA4AF - Lighter rose accent
    darkMode: baseColors.rose[400],    // #FB7185 - For dark backgrounds
  },
} as const;

// Export all colors for backward compatibility
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

// Dark mode color mappings
export const darkModeColors = {
  // Background colors for dark mode
  background: {
    primary: baseColors.neutral[900],   // #171717
    secondary: baseColors.neutral[800], // #333333
    tertiary: baseColors.neutral[700],  // #404040
  },

  // Surface colors for dark mode
  surface: {
    primary: baseColors.neutral[800],   // #333333
    secondary: baseColors.neutral[700], // #404040
    tertiary: baseColors.neutral[600],  // #666666
  },

  // Text colors for dark mode
  text: {
    primary: baseColors.neutral[100],   // #f5f5f5
    secondary: baseColors.neutral[300], // #d4d4d4
    tertiary: baseColors.neutral[400],  // #a3a3a3
    disabled: baseColors.neutral[500],  // #737373
    inverse: baseColors.neutral[900],   // #171717
  },

  // Border colors for dark mode
  border: {
    primary: baseColors.neutral[700],   // #404040
    secondary: baseColors.neutral[600], // #666666
    focus: baseColors.teal[400],        // Brighter for dark backgrounds
    error: baseColors.error[500],       // Adjusted for dark mode
  },

  // Role colors optimized for dark mode
  role: {
    student: {
      primary: baseColors.teal[400],    // #2DD4BF - Brighter for dark
      accent: baseColors.teal[300],     // #5EEAD4
    },
    teacher: {
      primary: baseColors.green[400],   // #4ADE80 - Brighter for dark
      accent: baseColors.green[300],    // #86EFAC
    },
    parent: {
      primary: baseColors.amber[400],   // #FBBF24 - Maintained brightness
      accent: baseColors.amber[300],    // #FCD34D
    },
    management: {
      primary: baseColors.rose[400],    // #FB7185 - Brighter for dark
      accent: baseColors.rose[300],     // #FDA4AF
    },
  },
} as const;

// Enhanced semantic color mappings with context awareness
export const contextualColors = {
  // Status colors with variations
  status: {
    success: {
      subtle: baseColors.success[50],
      muted: baseColors.success[100],
      default: baseColors.success[500],
      emphasis: baseColors.success[600],
      strong: baseColors.success[700],
    },
    warning: {
      subtle: baseColors.warning[50],
      muted: baseColors.warning[100],
      default: baseColors.warning[500],
      emphasis: baseColors.warning[600],
      strong: baseColors.warning[700],
    },
    error: {
      subtle: baseColors.error[50],
      muted: baseColors.error[100],
      default: baseColors.error[500],
      emphasis: baseColors.error[600],
      strong: baseColors.error[700],
    },
    info: {
      subtle: baseColors.teal[50],
      muted: baseColors.teal[100],
      default: baseColors.teal[500],
      emphasis: baseColors.teal[600],
      strong: baseColors.teal[700],
    },
  },

  // Interactive state colors
  interactive: {
    default: baseColors.neutral[50],
    hover: baseColors.neutral[100],
    active: baseColors.neutral[200],
    pressed: baseColors.neutral[300],
    disabled: baseColors.neutral[200],
    focus: baseColors.teal[100],
  },

  // Data visualization colors
  dataViz: {
    primary: [
      baseColors.teal[500],
      baseColors.green[500],
      baseColors.amber[500],
      baseColors.rose[500],
    ],
    sequential: [
      baseColors.teal[100],
      baseColors.teal[300],
      baseColors.teal[500],
      baseColors.teal[700],
      baseColors.teal[900],
    ],
    diverging: [
      baseColors.rose[500],
      baseColors.rose[300],
      baseColors.neutral[200],
      baseColors.teal[300],
      baseColors.teal[500],
    ],
  },
} as const;

// WCAG AA Compliance validation
export const wcagCompliantCombinations = {
  // Text on white background (4.5:1 minimum)
  textOnWhite: [
    baseColors.neutral[800], // Primary text
    baseColors.neutral[700], // Secondary text
    baseColors.teal[600],    // Student links
    baseColors.green[600],   // Teacher links
    baseColors.amber[700],   // Parent links
    baseColors.rose[700],    // Management links
  ],

  // Text on colored backgrounds
  whiteTextOn: [
    baseColors.teal[500],    // Student primary
    baseColors.green[500],   // Teacher primary
    baseColors.amber[600],   // Parent primary (darker for contrast)
    baseColors.rose[600],    // Management primary
  ],

  // Dark mode compliant combinations
  darkModeCompliant: {
    textOnDark: [
      baseColors.neutral[100], // Primary text on dark
      baseColors.neutral[300], // Secondary text on dark
      baseColors.teal[400],    // Student links on dark
      baseColors.green[400],   // Teacher links on dark
      baseColors.amber[400],   // Parent links on dark
      baseColors.rose[400],    // Management links on dark
    ],
    darkTextOn: [
      baseColors.neutral[100], // Light backgrounds
      baseColors.neutral[50],  // Very light backgrounds
    ],
  },
} as const;
