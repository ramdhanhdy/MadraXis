/**
 * Style Helper Utilities
 * Common styling patterns and helper functions for consistent styling
 */

import { ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { theme } from '../styles/theme';
import type { ShadowStyle } from '../styles/shadows';

// Type for all possible style objects
type Style = ViewStyle | TextStyle | ImageStyle;

// Helper function to create consistent margin styles
export const createMarginStyle = (
  size: keyof typeof theme.spacing.base,
  direction?: 'top' | 'bottom' | 'left' | 'right' | 'horizontal' | 'vertical'
): ViewStyle => {
  const value = theme.spacing.base[size];
  
  switch (direction) {
    case 'top':
      return { marginTop: value };
    case 'bottom':
      return { marginBottom: value };
    case 'left':
      return { marginLeft: value };
    case 'right':
      return { marginRight: value };
    case 'horizontal':
      return { marginHorizontal: value };
    case 'vertical':
      return { marginVertical: value };
    default:
      return { margin: value };
  }
};

// Helper function to create consistent padding styles
export const createPaddingStyle = (
  size: keyof typeof theme.spacing.base,
  direction?: 'top' | 'bottom' | 'left' | 'right' | 'horizontal' | 'vertical'
): ViewStyle => {
  const value = theme.spacing.base[size];
  
  switch (direction) {
    case 'top':
      return { paddingTop: value };
    case 'bottom':
      return { paddingBottom: value };
    case 'left':
      return { paddingLeft: value };
    case 'right':
      return { paddingRight: value };
    case 'horizontal':
      return { paddingHorizontal: value };
    case 'vertical':
      return { paddingVertical: value };
    default:
      return { padding: value };
  }
};

// Helper function to create typography styles
export const createTypographyStyle = (
  variant: keyof typeof theme.typography.variants,
  color?: string,
  align?: 'left' | 'center' | 'right' | 'justify'
): TextStyle => {
  const baseStyle = theme.typography.variants[variant];
  
  return {
    fontSize: baseStyle.fontSize,
    fontWeight: baseStyle.fontWeight as TextStyle['fontWeight'],
    lineHeight: baseStyle.lineHeight * baseStyle.fontSize,
    letterSpacing: baseStyle.letterSpacing,
    ...(color && { color }),
    ...(align && { textAlign: align }),
    ...((baseStyle as any).textTransform && { textTransform: (baseStyle as any).textTransform as TextStyle['textTransform'] }),
  };
};

// Helper function to create shadow styles
export const createShadowStyle = (shadowKey: keyof typeof theme.shadows): ShadowStyle => {
  return theme.shadows[shadowKey] as ShadowStyle;
};

// Helper function to create border radius styles
export const createBorderRadiusStyle = (
  size: keyof typeof theme.borderRadius,
  corners?: 'top' | 'bottom' | 'left' | 'right' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
): ViewStyle => {
  const value = theme.borderRadius[size];
  
  switch (corners) {
    case 'top':
      return { borderTopLeftRadius: value, borderTopRightRadius: value };
    case 'bottom':
      return { borderBottomLeftRadius: value, borderBottomRightRadius: value };
    case 'left':
      return { borderTopLeftRadius: value, borderBottomLeftRadius: value };
    case 'right':
      return { borderTopRightRadius: value, borderBottomRightRadius: value };
    case 'topLeft':
      return { borderTopLeftRadius: value };
    case 'topRight':
      return { borderTopRightRadius: value };
    case 'bottomLeft':
      return { borderBottomLeftRadius: value };
    case 'bottomRight':
      return { borderBottomRightRadius: value };
    default:
      return { borderRadius: value };
  }
};

// Helper function to create flex layout styles
export const createFlexStyle = (
  direction: 'row' | 'column' = 'column',
  justify: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' = 'flex-start',
  align: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline' = 'stretch',
  wrap: 'nowrap' | 'wrap' | 'wrap-reverse' = 'nowrap'
): ViewStyle => {
  return {
    display: 'flex',
    flexDirection: direction,
    justifyContent: justify,
    alignItems: align,
    flexWrap: wrap,
  };
};

// Helper function to create consistent button styles
export const createButtonStyle = (
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger',
  size: 'small' | 'medium' | 'large' = 'medium',
  disabled: boolean = false
): ViewStyle => {
  const baseStyle: ViewStyle = {
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  };

  // Size-specific styles
  const sizeStyles = {
    small: {
      minHeight: 32,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    medium: {
      minHeight: 40,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    large: {
      minHeight: 48,
      paddingHorizontal: 20,
      paddingVertical: 12,
    },
  };

  // Variant-specific styles
  const variantStyles = {
    primary: {
      backgroundColor: disabled ? theme.colors.interactive.disabled : theme.colors.primary.main,
      ...theme.shadows.button,
    },
    secondary: {
      backgroundColor: disabled ? theme.colors.interactive.disabled : theme.colors.secondary.main,
      ...theme.shadows.button,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: disabled ? theme.colors.interactive.disabled : theme.colors.primary.main,
    },
    ghost: {
      backgroundColor: 'transparent',
    },
    danger: {
      backgroundColor: disabled ? theme.colors.interactive.disabled : theme.colors.error.main,
      ...theme.shadows.button,
    },
  };

  return {
    ...baseStyle,
    ...sizeStyles[size],
    ...variantStyles[variant],
    opacity: disabled ? 0.6 : 1,
  };
};

// Helper function to create consistent card styles
export const createCardStyle = (
  variant: 'default' | 'elevated' | 'outlined' = 'default',
  padding: 'none' | 'small' | 'medium' | 'large' = 'medium'
): ViewStyle => {
  const baseStyle: ViewStyle = {
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface.primary,
  };

  // Padding styles
  const paddingStyles = {
    none: {},
    small: { padding: theme.spacing.base.sm },
    medium: { padding: theme.spacing.base.md },
    large: { padding: theme.spacing.base.lg },
  };

  // Variant styles
  const variantStyles = {
    default: {
      ...theme.shadows.card,
    },
    elevated: {
      ...theme.shadows.cardHover,
    },
    outlined: {
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
  };

  return {
    ...baseStyle,
    ...paddingStyles[padding],
    ...variantStyles[variant],
  };
};

// Helper function to create consistent input styles
export const createInputStyle = (
  focused: boolean = false,
  error: boolean = false,
  disabled: boolean = false
): ViewStyle => {
  return {
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.base.md,
    paddingVertical: theme.spacing.base.sm,
    minHeight: 40,
    borderWidth: 1,
    backgroundColor: disabled ? theme.colors.interactive.disabled : theme.colors.surface.primary,
    borderColor: error 
      ? theme.colors.border.error 
      : focused 
        ? theme.colors.border.focus 
        : theme.colors.border.primary,
    opacity: disabled ? 0.6 : 1,
  };
};

// Helper function to create consistent modal styles
export const createModalStyle = (size: 'small' | 'medium' | 'large' | 'fullscreen' = 'medium'): ViewStyle => {
  const baseStyle: ViewStyle = {
    backgroundColor: theme.colors.surface.primary,
    borderTopLeftRadius: theme.borderRadius['2xl'],
    borderTopRightRadius: theme.borderRadius['2xl'],
    padding: theme.spacing.base.lg,
    ...theme.shadows.modal,
  };

  const sizeStyles: Record<'small' | 'medium' | 'large' | 'fullscreen', ViewStyle> = {
    small: { maxHeight: '40%' },
    medium: { maxHeight: '60%' },
    large: { maxHeight: '80%' },
    fullscreen: { maxHeight: '100%', borderRadius: 0 },
  };

  return {
    ...baseStyle,
    ...sizeStyles[size],
  };
};

// Helper function to combine multiple styles
export const combineStyles = (...styles: (Style | undefined | null | false)[]): Style => {
  return styles
    .filter((s): s is Style => !!s)
    .reduce<Style>((acc, style) => ({ ...acc, ...style } as Style), {} as Style);
};

// Helper function to create responsive styles (for future implementation)
export const createResponsiveStyle = <T extends Style>(styles: {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
}): T => {
  // For now, return the base style (xs)
  // In the future, this could use screen dimensions to return appropriate style
  return styles.xs || styles.sm || styles.md || styles.lg || styles.xl || ({} as T);
};

// Utility object with all helper functions
export const styleHelpers = {
  margin: createMarginStyle,
  padding: createPaddingStyle,
  typography: createTypographyStyle,
  shadow: createShadowStyle,
  borderRadius: createBorderRadiusStyle,
  flex: createFlexStyle,
  button: createButtonStyle,
  card: createCardStyle,
  input: createInputStyle,
  modal: createModalStyle,
  combine: combineStyles,
  responsive: createResponsiveStyle,
} as const;

// Export individual helpers for convenience
export {
  createMarginStyle as margin,
  createPaddingStyle as padding,
  createTypographyStyle as typography,
  createShadowStyle as shadow,
  createBorderRadiusStyle as borderRadius,
  createFlexStyle as flex,
  createButtonStyle as button,
  createCardStyle as card,
  createInputStyle as input,
  createModalStyle as modal,
  combineStyles as combine,
  createResponsiveStyle as responsive,
};