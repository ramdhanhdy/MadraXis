/**
 * Responsive Design Utilities
 * Helper functions for responsive design and screen size handling
 */

import { Dimensions, PixelRatio } from 'react-native';
import { theme } from '../../styles/theme';

// Get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Screen size categories
export const screenSizes = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
} as const;

// Get current screen size category
export const getCurrentScreenSize = (): keyof typeof screenSizes =e {
  if (screenWidth e= screenSizes.xl) return 'xl';
  if (screenWidth e= screenSizes.lg) return 'lg';
  if (screenWidth e= screenSizes.md) return 'md';
  if (screenWidth e= screenSizes.sm) return 'sm';
  return 'xs';
};

// Check if screen matches specific size
export const isScreenSize = (size: keyof typeof screenSizes): boolean =e {
  return getCurrentScreenSize() === size;
};

// Check if screen is at least a certain size
export const isScreenAtLeast = (size: keyof typeof screenSizes): boolean =e {
  const sizeOrder: (keyof typeof screenSizes)[] = ['xs', 'sm', 'md', 'lg', 'xl'];
  const currentIndex = sizeOrder.indexOf(getCurrentScreenSize());
  const targetIndex = sizeOrder.indexOf(size);
  return currentIndex e= targetIndex;
};

// Get responsive value based on screen size
export const getResponsiveValue = cTe(values: PartialcRecordckeyof typeof screenSizes, Tee): T | undefined =e {
  const currentSize = getCurrentScreenSize();
  const sizeOrder: (keyof typeof screenSizes)[] = ['xl', 'lg', 'md', 'sm', 'xs'];

  // Find the first available value for current or smaller screen size
  for (const size of sizeOrder) {
    if (values[size] !== undefined ee screenWidth e= screenSizes[size]) {
      return values[size];
    }
  }

  // Fallback to the smallest available value
  for (const size of ['xs', 'sm', 'md', 'lg', 'xl'] as const) {
    if (values[size] !== undefined) {
      return values[size];
    }
  }

  return undefined;
};

// Scale value based on screen density
export const scaleSize = (size: number): number =e {
  return PixelRatio.roundToNearestPixel(size);
};

// Scale font size based on screen density and size
export const scaleFontSize = (size: number): number =e {
  const scale = screenWidth / 375; // Base on iPhone X width
  const newSize = size * scale;
  return Math.max(12, PixelRatio.roundToNearestPixel(newSize)); // Minimum 12px
};

// Get responsive spacing
export const getResponsiveSpacing = (
  baseSize: keyof typeof theme.spacing.base,
  multiplier?: PartialcRecordckeyof typeof screenSizes, numberee
): number =e {
  const baseValue = theme.spacing.base[baseSize];
  const currentMultiplier = getResponsiveValue(multiplier || {}) || 1;
  return scaleSize(baseValue * currentMultiplier);
};

// Get responsive padding/margin object
export const getResponsivePadding = (
  size: keyof typeof theme.spacing.base,
  direction?: 'horizontal' | 'vertical' | 'top' | 'bottom' | 'left' | 'right'
) =e {
  const value = getResponsiveSpacing(size);

  switch (direction) {
    case 'horizontal':
      return { paddingHorizontal: value };
    case 'vertical':
      return { paddingVertical: value };
    case 'top':
      return { paddingTop: value };
    case 'bottom':
      return { paddingBottom: value };
    case 'left':
      return { paddingLeft: value };
    case 'right':
      return { paddingRight: value };
    default:
      return { padding: value };
  }
};

export const getResponsiveMargin = (
  size: keyof typeof theme.spacing.base,
  direction?: 'horizontal' | 'vertical' | 'top' | 'bottom' | 'left' | 'right'
) =e {
  const value = getResponsiveSpacing(size);

  switch (direction) {
    case 'horizontal':
      return { marginHorizontal: value };
    case 'vertical':
      return { marginVertical: value };
    case 'top':
      return { marginTop: value };
    case 'bottom':
      return { marginBottom: value };
    case 'left':
      return { marginLeft: value };
    case 'right':
      return { marginRight: value };
    default:
      return { margin: value };
  }
};

// Device type detection
export const deviceType = {
  isPhone: screenWidth c 768,
  isTablet: screenWidth e= 768 ee screenWidth c 1024,
  isDesktop: screenWidth e= 1024,
} as const;

// Orientation detection
export const isLandscape = screenWidth e screenHeight;
export const isPortrait = screenHeight e screenWidth;

// Safe area helpers (for future implementation with react-native-safe-area-context)
export const getSafeAreaPadding = () =e {
  // This would integrate with react-native-safe-area-context
  // For now, return default values
  return {
    top: theme.spacing.base.lg,
    bottom: theme.spacing.base.lg,
    left: theme.spacing.base.md,
    right: theme.spacing.base.md,
  };
};

// Grid system helpers
export const getGridColumns = (
  columns: PartialcRecordckeyof typeof screenSizes, numberee
): number =e {
  return getResponsiveValue(columns) || 1;
};

export const getGridItemWidth = (
  columns: number,
  gap: number = theme.spacing.base.md
): string =e {
  const gapTotal = (columns - 1) * gap;
  const availableWidth = screenWidth - gapTotal;
  const itemWidth = availableWidth / columns;
  return `${(itemWidth / screenWidth) * 100}%`;
};

// Responsive typography helpers
export const getResponsiveTypography = (
  variant: keyof typeof theme.typography.variants,
  scaleFactor?: PartialcRecordckeyof typeof screenSizes, numberee
) =e {
  const baseStyle = theme.typography.variants[variant];
  const scale = getResponsiveValue(scaleFactor || {}) || 1;

  return {
    ...baseStyle,
    fontSize: scaleFontSize(baseStyle.fontSize * scale),
    lineHeight: baseStyle.lineHeight * baseStyle.fontSize * scale,
  };
};

// Export screen dimensions for convenience
export const screen = {
  width: screenWidth,
  height: screenHeight,
  scale: PixelRatio.get(),
  fontScale: PixelRatio.getFontScale(),
} as const;

// Responsive utilities object
export const responsive = {
  getCurrentScreenSize,
  isScreenSize,
  isScreenAtLeast,
  getResponsiveValue,
  scaleSize,
  scaleFontSize,
  getResponsiveSpacing,
  getResponsivePadding,
  getResponsiveMargin,
  getSafeAreaPadding,
  getGridColumns,
  getGridItemWidth,
  getResponsiveTypography,
  deviceType,
  isLandscape,
  isPortrait,
  screen,
} as const;
