/**
 * Responsive Design Utilities
 * Provides hooks and utilities for responsive design in React Native
 */

import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';
import { Theme } from '../core/types';

// Breakpoint definitions
export interface Breakpoints {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export const defaultBreakpoints: Breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

// Screen size type
export type ScreenSize = keyof Breakpoints;

// Responsive value type
export type ResponsiveValue<T> = T | Partial<Record<ScreenSize, T>>;

/**
 * Hook to get current screen dimensions and size category
 */
export function useScreenDimensions() {
  const [screenData, setScreenData] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return {
      width,
      height,
      size: getScreenSize(width),
    };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenData({
        width: window.width,
        height: window.height,
        size: getScreenSize(window.width),
      });
    });

    return () => subscription?.remove();
  }, []);

  return screenData;
}

/**
 * Get screen size category based on width
 */
export function getScreenSize(
  width: number,
  breakpoints: Breakpoints = defaultBreakpoints
): ScreenSize {
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  return 'xs';
}

/**
 * Check if current screen matches a specific size or larger
 */
export function useScreenSize(targetSize: ScreenSize): boolean {
  const { size } = useScreenDimensions();
  
  const sizeOrder: ScreenSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
  const currentIndex = sizeOrder.indexOf(size);
  const targetIndex = sizeOrder.indexOf(targetSize);
  
  return currentIndex >= targetIndex;
}

/**
 * Hook to get responsive value based on current screen size
 */
export function useResponsiveValue<T>(
  value: ResponsiveValue<T>,
  breakpoints: Breakpoints = defaultBreakpoints
): T {
  const { width } = useScreenDimensions();
  const screenSize = getScreenSize(width, breakpoints);
  
  return getResponsiveValue(value, screenSize);
}

/**
 * Resolve responsive value for a given screen size
 */
export function getResponsiveValue<T>(
  value: ResponsiveValue<T>,
  screenSize: ScreenSize
): T {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return value as T;
  }

  const responsiveValue = value as Partial<Record<ScreenSize, T>>;
  
  // Try to get value for current screen size, fallback to smaller sizes
  const sizeOrder: ScreenSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
  const currentIndex = sizeOrder.indexOf(screenSize);
  
  for (let i = currentIndex; i >= 0; i--) {
    const size = sizeOrder[i];
    if (responsiveValue[size] !== undefined) {
      return responsiveValue[size] as T;
    }
  }
  
  // Fallback to any available value
  return (
    responsiveValue.xl ??
    responsiveValue.lg ??
    responsiveValue.md ??
    responsiveValue.sm ??
    responsiveValue.xs
  ) as T;
}

/**
 * Create responsive styles based on theme breakpoints
 */
export function createResponsiveStyles<T>(
  styles: ResponsiveValue<T>,
  theme: Theme,
  screenWidth?: number
): T {
  const width = screenWidth ?? Dimensions.get('window').width;
  const breakpoints = theme.breakpoints || defaultBreakpoints;
  const screenSize = getScreenSize(width, breakpoints);
  
  return getResponsiveValue(styles, screenSize);
}

/**
 * Responsive spacing utility
 */
export function useResponsiveSpacing(
  spacing: ResponsiveValue<'xs' | 'sm' | 'md' | 'lg' | 'xl'>,
  theme: Theme
): number {
  const spacingKey = useResponsiveValue(spacing);
  const spacingTokens = theme.spacing?.base || {};
  
  const spacingMap = {
    xs: spacingTokens.xs || 4,
    sm: spacingTokens.sm || 8,
    md: spacingTokens.md || 16,
    lg: spacingTokens.lg || 24,
    xl: spacingTokens.xl || 32,
  };
  
  return spacingMap[spacingKey] || spacingMap.md;
}

/**
 * Responsive typography utility
 */
export function useResponsiveTypography(
  variant: ResponsiveValue<'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption'>,
  theme: Theme
) {
  const typographyVariant = useResponsiveValue(variant);
  const typography = theme.typography?.variants || {};
  
  return typography[typographyVariant] || typography.body || {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  };
}

/**
 * Device type detection utilities
 */
export function useDeviceType() {
  const { width, height } = useScreenDimensions();
  
  const isTablet = Math.min(width, height) >= 768;
  const isPhone = !isTablet;
  const isLandscape = width > height;
  const isPortrait = !isLandscape;
  
  return {
    isTablet,
    isPhone,
    isLandscape,
    isPortrait,
    aspectRatio: width / height,
  };
}

/**
 * Safe area utilities for responsive design
 */
export function useResponsiveSafeArea() {
  const { width } = useScreenDimensions();
  const { isPhone, isTablet } = useDeviceType();
  
  // Adjust safe area based on device type and screen size
  const basePadding = {
    top: isPhone ? 44 : 20,
    bottom: isPhone ? 34 : 20,
    left: 16,
    right: 16,
  };
  
  // Increase horizontal padding on larger screens
  if (width >= 768) {
    basePadding.left = 32;
    basePadding.right = 32;
  }
  
  if (width >= 1024) {
    basePadding.left = 48;
    basePadding.right = 48;
  }
  
  return basePadding;
}

/**
 * Responsive grid utilities
 */
export interface GridConfig {
  columns: ResponsiveValue<number>;
  gap: ResponsiveValue<number>;
  minItemWidth?: number;
}

export function useResponsiveGrid(config: GridConfig, theme: Theme) {
  const { width } = useScreenDimensions();
  
  const columns = useResponsiveValue(config.columns);
  const gap = useResponsiveValue(config.gap);
  
  // Calculate item width based on columns and gap
  const totalGapWidth = (columns - 1) * gap;
  const availableWidth = width - totalGapWidth;
  const itemWidth = availableWidth / columns;
  
  // Ensure minimum item width if specified
  const finalItemWidth = config.minItemWidth 
    ? Math.max(itemWidth, config.minItemWidth)
    : itemWidth;
  
  // Recalculate columns if minimum width is enforced
  const finalColumns = config.minItemWidth && finalItemWidth > itemWidth
    ? Math.floor((width + gap) / (config.minItemWidth + gap))
    : columns;
  
  return {
    columns: finalColumns,
    itemWidth: finalItemWidth,
    gap,
    containerWidth: width,
  };
}

/**
 * Responsive font scaling
 */
export function useResponsiveFontSize(
  baseFontSize: number,
  scaleFactor: ResponsiveValue<number> = 1
): number {
  const scale = useResponsiveValue(scaleFactor);
  const { width } = useScreenDimensions();
  
  // Apply additional scaling based on screen width
  let screenScale = 1;
  if (width >= 1200) screenScale = 1.1;
  else if (width >= 768) screenScale = 1.05;
  else if (width < 400) screenScale = 0.95;
  
  return Math.round(baseFontSize * scale * screenScale);
}

/**
 * Responsive component sizing
 */
export function useResponsiveSize(
  baseSize: { width: number; height: number },
  scaleFactor: ResponsiveValue<number> = 1
) {
  const scale = useResponsiveValue(scaleFactor);
  
  return {
    width: baseSize.width * scale,
    height: baseSize.height * scale,
  };
}
