/**
 * Enhanced Style Utilities for Component Theming
 * Provides helper functions for responsive design and component styling
 */

import { ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { Theme, ComponentThemes } from '../core/types';

// Type definitions for style utilities
export type ResponsiveValue<T> = T | {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
};

export type StyleValue = ViewStyle | TextStyle | ImageStyle;

export interface ResponsiveStyleConfig {
  breakpoints?: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

// Default breakpoints (screen widths)
export const defaultBreakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

/**
 * Get current screen size category based on width
 */
export function getCurrentScreenSize(
  screenWidth: number,
  breakpoints = defaultBreakpoints
): 'xs' | 'sm' | 'md' | 'lg' | 'xl' {
  if (screenWidth >= breakpoints.xl) return 'xl';
  if (screenWidth >= breakpoints.lg) return 'lg';
  if (screenWidth >= breakpoints.md) return 'md';
  if (screenWidth >= breakpoints.sm) return 'sm';
  return 'xs';
}

/**
 * Resolve responsive value based on current screen size
 */
export function getResponsiveValue<T>(
  value: ResponsiveValue<T>,
  screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
): T {
  if (typeof value !== 'object' || value === null) {
    return value as T;
  }

  const responsiveValue = value as { xs?: T; sm?: T; md?: T; lg?: T; xl?: T };
  
  // Try to get value for current screen size, fallback to smaller sizes
  return (
    responsiveValue[screenSize] ??
    responsiveValue.lg ??
    responsiveValue.md ??
    responsiveValue.sm ??
    responsiveValue.xs
  ) as T;
}

/**
 * Create responsive styles based on screen width
 */
export function createResponsiveStyle<T extends StyleValue>(
  styles: ResponsiveValue<T>,
  screenWidth: number,
  breakpoints = defaultBreakpoints
): T {
  const screenSize = getCurrentScreenSize(screenWidth, breakpoints);
  return getResponsiveValue(styles, screenSize);
}

/**
 * Component theme utilities
 */
export class ComponentThemeUtils {
  constructor(private theme: Theme) {}

  /**
   * Get component theme with fallbacks
   */
  getComponentTheme<K extends keyof ComponentThemes>(
    componentName: K
  ): ComponentThemes[K] {
    return this.theme.componentThemes[componentName];
  }

  /**
   * Create button styles with variants
   */
  createButtonStyles(
    variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' = 'primary',
    size: 'small' | 'medium' | 'large' = 'medium',
    disabled = false
  ): ViewStyle {
    const buttonTheme = this.getComponentTheme('button');
    const colors = this.theme.colors;

    const baseStyle: ViewStyle = {
      borderRadius: buttonTheme.borderRadius,
      minHeight: buttonTheme.minHeight[size],
      paddingHorizontal: buttonTheme.padding[size].horizontal,
      paddingVertical: buttonTheme.padding[size].vertical,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    const variantStyles: Record<string, ViewStyle> = {
      primary: {
        backgroundColor: disabled ? colors.neutral?.[300] : colors.primary.main,
        ...this.theme.shadows?.button,
      },
      secondary: {
        backgroundColor: disabled ? colors.neutral?.[300] : colors.secondary.main,
        ...this.theme.shadows?.button,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: disabled ? colors.neutral?.[300] : colors.primary.main,
      },
      ghost: {
        backgroundColor: 'transparent',
      },
      danger: {
        backgroundColor: disabled ? colors.neutral?.[300] : colors.error?.main || colors.red?.[500],
        ...this.theme.shadows?.button,
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      opacity: disabled ? 0.6 : 1,
    };
  }

  /**
   * Create card styles with variants
   */
  createCardStyles(
    variant: 'default' | 'elevated' | 'outlined' = 'default',
    padding: 'none' | 'small' | 'medium' | 'large' = 'medium'
  ): ViewStyle {
    const cardTheme = this.getComponentTheme('card');
    const colors = this.theme.colors;

    const baseStyle: ViewStyle = {
      borderRadius: cardTheme.borderRadius,
      backgroundColor: cardTheme.backgroundColor,
      padding: cardTheme.padding[padding],
    };

    const variantStyles: Record<string, ViewStyle> = {
      default: {
        ...cardTheme.shadow,
      },
      elevated: {
        ...this.theme.shadows?.cardHover || cardTheme.shadow,
      },
      outlined: {
        borderWidth: 1,
        borderColor: colors.border?.primary || colors.neutral?.[300],
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
    };
  }

  /**
   * Create modal styles with size variants
   */
  createModalStyles(
    size: 'small' | 'medium' | 'large' | 'fullscreen' = 'medium'
  ): ViewStyle {
    const modalTheme = this.getComponentTheme('modal');

    const baseStyle: ViewStyle = {
      backgroundColor: modalTheme.backgroundColor,
      borderRadius: size === 'fullscreen' ? 0 : modalTheme.borderRadius,
      padding: modalTheme.padding,
      ...modalTheme.shadow,
      overflow: 'hidden',
    };

    const sizeStyles: Record<string, ViewStyle> = {
      small: { maxWidth: 400 },
      medium: { maxWidth: 600 },
      large: { maxWidth: 800 },
      fullscreen: { width: '100%', height: '100%' },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
    };
  }

  /**
   * Create navigation styles
   */
  createNavigationStyles(): ViewStyle {
    const navTheme = this.getComponentTheme('navigation');

    return {
      backgroundColor: navTheme.backgroundColor,
      height: navTheme.height,
      paddingHorizontal: navTheme.padding.horizontal,
      paddingVertical: navTheme.padding.vertical,
      flexDirection: 'row',
      alignItems: 'center',
    };
  }
}

/**
 * Animation utilities
 */
export function createAnimationConfig(
  theme: Theme,
  animationType: 'fast' | 'normal' | 'slow' = 'normal'
) {
  const duration = theme.animations?.duration?.[animationType] || theme.duration?.[animationType] || 300;
  const easing = theme.animations?.easing?.spring || theme.easing?.spring || 'ease-in-out';

  return {
    duration,
    easing,
    useNativeDriver: true,
  };
}

/**
 * Accessibility utilities
 */
export function createAccessibilityProps(
  theme: Theme,
  options: {
    label?: string;
    hint?: string;
    role?: string;
    state?: Record<string, boolean>;
  } = {}
) {
  const accessibility = theme.accessibility || {};
  
  return {
    accessibilityLabel: options.label,
    accessibilityHint: options.hint,
    accessibilityRole: options.role as any,
    accessibilityState: options.state,
    // Ensure minimum touch target
    minHeight: accessibility.minTouchTarget || 44,
    minWidth: accessibility.minTouchTarget || 44,
  };
}

/**
 * Shadow utilities
 */
export function createElevationStyle(
  theme: Theme,
  elevation: 'none' | 'low' | 'medium' | 'high' = 'medium'
): ViewStyle {
  const shadows = theme.shadows || {};
  
  const elevationMap = {
    none: {},
    low: shadows.card || {},
    medium: shadows.modal || {},
    high: shadows.dropdown || {},
  };

  return elevationMap[elevation];
}

/**
 * Typography utilities
 */
export function createTypographyStyle(
  theme: Theme,
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'button' = 'body'
): TextStyle {
  const typography = theme.typography || {};
  const variants = typography.variants || {};
  
  return variants[variant] || {
    fontSize: typography.fontSize?.base || 16,
    lineHeight: typography.lineHeight?.normal || 1.5,
    fontWeight: typography.fontWeight?.normal || '400',
  };
}

/**
 * Spacing utilities
 */
export function createSpacingStyle(
  theme: Theme,
  spacing: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md'
): number {
  const spacingTokens = theme.spacing || {};
  const base = spacingTokens.base || {};
  
  return base[spacing] || 16;
}
