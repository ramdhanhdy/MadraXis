/**
 * Typography Design Tokens
 * Consistent typography scale with font sizes, weights, and line heights
 */

// Font Family Definitions
export const fontFamily = {
  regular: 'System', // Uses system default font
  medium: 'System',
  semibold: 'System',
  bold: 'System',
} as const;

// Font Weight Definitions
export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

// Font Size Scale (in pixels)
export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
} as const;

// Line Height Scale
export const lineHeight = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
} as const;

// Typography Variants
export const typographyVariants = {
  // Heading Styles
  h1: {
    fontSize: fontSize['3xl'], // 32px
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: fontSize['2xl'], // 24px
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
    letterSpacing: -0.25,
  },
  h3: {
    fontSize: fontSize.xl, // 20px
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.normal,
    letterSpacing: 0,
  },
  h4: {
    fontSize: fontSize.lg, // 18px
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.normal,
    letterSpacing: 0,
  },
  
  // Body Text Styles
  body1: {
    fontSize: fontSize.base, // 16px
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
    letterSpacing: 0,
  },
  body2: {
    fontSize: fontSize.sm, // 14px
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
    letterSpacing: 0,
  },
  
  // Utility Text Styles
  caption: {
    fontSize: fontSize.xs, // 12px
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
    letterSpacing: 0.25,
  },
  overline: {
    fontSize: fontSize.xs, // 12px
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
  },
  
  // Button Text Styles
  button: {
    fontSize: fontSize.base, // 16px
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.tight,
    letterSpacing: 0.25,
  },
  buttonSmall: {
    fontSize: fontSize.sm, // 14px
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.tight,
    letterSpacing: 0.25,
  },
  buttonLarge: {
    fontSize: fontSize.lg, // 18px
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.tight,
    letterSpacing: 0.25,
  },
} as const;

// Text Alignment Options
export const textAlign = {
  left: 'left',
  center: 'center',
  right: 'right',
  justify: 'justify',
} as const;

// Text Transform Options
export const textTransform = {
  none: 'none',
  uppercase: 'uppercase',
  lowercase: 'lowercase',
  capitalize: 'capitalize',
} as const;

// Export all typography tokens
export const typography = {
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  variants: typographyVariants,
  textAlign,
  textTransform,
} as const;

// Type definitions
export type FontFamilyKey = keyof typeof fontFamily;
export type FontWeightKey = keyof typeof fontWeight;
export type FontSizeKey = keyof typeof fontSize;
export type LineHeightKey = keyof typeof lineHeight;
export type TypographyVariant = keyof typeof typographyVariants;
export type TextAlign = keyof typeof textAlign;
export type TextTransform = keyof typeof textTransform;

// Helper function to get typography styles
export const getTypographyStyle = (variant: TypographyVariant) => {
  return typographyVariants[variant];
};

// Responsive typography helpers (for future use)
export const responsiveTypography = {
  // Scale factors for different screen sizes
  mobile: 1,
  tablet: 1.1,
  desktop: 1.2,
} as const;