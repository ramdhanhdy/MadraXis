/**
 * Typography Design Tokens
 * Enhanced typography system with accessibility and role-specific considerations
 * Migrated and enhanced from src/styles/typography.ts
 */

// Font Family Definitions
export const fontFamily = {
  // Primary font family
  primary: 'System',
  
  // Platform-specific font stacks
  ios: 'SF Pro Display',
  android: 'Roboto',
  web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  
  // Fallback fonts
  fallback: 'Arial, sans-serif',
  
  // Monospace for code
  mono: 'SF Mono, Monaco, Inconsolata, "Roboto Mono", Consolas, "Courier New", monospace',
} as const;

// Font Weight Scale
export const fontWeight = {
  thin: '100',
  extraLight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
  black: '900',
} as const;

// Font Size Scale - Enhanced with accessibility considerations
export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,    // Base font size for accessibility
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  '6xl': 60,
  '7xl': 72,
  '8xl': 96,
  '9xl': 128,
} as const;

// Line Height Scale - WCAG compliant ratios
export const lineHeight = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,    // WCAG recommended minimum
  relaxed: 1.625,
  loose: 2,
} as const;

// Letter Spacing Scale
export const letterSpacing = {
  tighter: -0.05,
  tight: -0.025,
  normal: 0,
  wide: 0.025,
  wider: 0.05,
  widest: 0.1,
} as const;

// Typography Variants - Semantic text styles
export const typographyVariants = {
  // Display styles
  display1: {
    fontSize: fontSize['8xl'],
    fontWeight: fontWeight.black,
    lineHeight: lineHeight.none,
    letterSpacing: letterSpacing.tight,
  },
  display2: {
    fontSize: fontSize['7xl'],
    fontWeight: fontWeight.extraBold,
    lineHeight: lineHeight.none,
    letterSpacing: letterSpacing.tight,
  },
  display3: {
    fontSize: fontSize['6xl'],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.normal,
  },
  
  // Heading styles
  h1: {
    fontSize: fontSize['5xl'],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.normal,
  },
  h2: {
    fontSize: fontSize['4xl'],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.normal,
  },
  h3: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.semiBold,
    lineHeight: lineHeight.snug,
    letterSpacing: letterSpacing.normal,
  },
  h4: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.semiBold,
    lineHeight: lineHeight.snug,
    letterSpacing: letterSpacing.normal,
  },
  h5: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  h6: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  
  // Body text styles
  bodyLarge: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.relaxed,
    letterSpacing: letterSpacing.normal,
  },
  body: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  bodySmall: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  
  // Caption and helper text
  caption: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.wide,
  },
  overline: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.widest,
    textTransform: 'uppercase' as const,
  },
  
  // Interactive elements
  button: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.none,
    letterSpacing: letterSpacing.normal,
  },
  buttonSmall: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.none,
    letterSpacing: letterSpacing.normal,
  },
  buttonLarge: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.none,
    letterSpacing: letterSpacing.normal,
  },
  
  // Navigation and UI
  navItem: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  tabLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  
  // Form elements
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  input: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  placeholder: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  
  // Status and feedback
  error: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  success: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  warning: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
} as const;

// Role-specific typography preferences
export const roleTypography = {
  student: {
    // Slightly larger, more casual feel
    baseSize: fontSize.lg,
    headingWeight: fontWeight.bold,
    bodyWeight: fontWeight.normal,
    lineHeight: lineHeight.relaxed,
  },
  teacher: {
    // Professional, readable
    baseSize: fontSize.base,
    headingWeight: fontWeight.semiBold,
    bodyWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
  },
  parent: {
    // Comfortable, family-friendly
    baseSize: fontSize.base,
    headingWeight: fontWeight.medium,
    bodyWeight: fontWeight.normal,
    lineHeight: lineHeight.relaxed,
  },
  management: {
    // Condensed, efficient
    baseSize: fontSize.sm,
    headingWeight: fontWeight.semiBold,
    bodyWeight: fontWeight.normal,
    lineHeight: lineHeight.snug,
  },
} as const;

// Accessibility enhancements
export const accessibleTypography = {
  // Minimum sizes for accessibility
  minSizes: {
    mobile: fontSize.base,    // 16px minimum on mobile
    tablet: fontSize.sm,      // 14px minimum on tablet
    desktop: fontSize.xs,     // 12px minimum on desktop
  },
  
  // High contrast typography
  highContrast: {
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.wide,
    lineHeight: lineHeight.loose,
  },
  
  // Dyslexia-friendly options
  dyslexiaFriendly: {
    fontFamily: 'OpenDyslexic, Arial, sans-serif',
    letterSpacing: letterSpacing.wider,
    lineHeight: lineHeight.loose,
    wordSpacing: 0.16,
  },
} as const;

// Complete typography system
export const typography = {
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  letterSpacing,
  variants: typographyVariants,
  roleTypography,
  accessibleTypography,
} as const;

// Type definitions
export type FontFamilyKey = keyof typeof fontFamily;
export type FontWeightKey = keyof typeof fontWeight;
export type FontSizeKey = keyof typeof fontSize;
export type LineHeightKey = keyof typeof lineHeight;
export type LetterSpacingKey = keyof typeof letterSpacing;
export type TypographyVariantKey = keyof typeof typographyVariants;

export default typography;
