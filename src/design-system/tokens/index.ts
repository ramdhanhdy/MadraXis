/**
 * Design Tokens - Main Export
 * Central export point for all design tokens
 */

// Enhanced token exports - specific exports to avoid conflicts
export {
  baseColors,
  semanticColors,
  roleColors,
  darkModeColors,
  contextualColors,
  wcagCompliantCombinations,
  colors
} from './colors';

export {
  typography,
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  letterSpacing,
  typographyVariants,
  roleTypography,
  responsiveTypography,
  typographyAccessibility as accessibleTypography
} from './typography';

export {
  baseSpacing,
  semanticSpacing,
  componentSpacing,
  roleSpacing,
  responsiveSpacing,
  contextualSpacing,
  densitySpacing,
  spacing
} from './spacing';

export {
  shadows,
  baseShadows,
  semanticShadows,
  roleShadows,
  coloredShadows
} from './shadows';

export {
  animations,
  duration,
  easing,
  transitions,
  microInteractions,
  performanceAnimations,
  roleAnimations,
  reducedMotion
} from './animations';

export {
  accessibility,
  touchTargets,
  focusRing,
  contrast,
  colorAccessibility,
  screenReader,
  keyboardNavigation,
  highContrast,
  mobileAccessibility,
  voiceControl,
  cognitiveAccessibility,
  motorAccessibility,
  visualAccessibility,
  hearingAccessibility,
  testing
} from './accessibility';

// Define legacy tokens for backward compatibility
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
};

export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

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
};

export const zIndexUtils = {
  hide: () => zIndex.hide,
  auto: () => zIndex.auto,
  base: () => zIndex.base,
  docked: () => zIndex.docked,
  dropdown: () => zIndex.dropdown,
  sticky: () => zIndex.sticky,
  banner: () => zIndex.banner,
  overlay: () => zIndex.overlay,
  modal: () => zIndex.modal,
  popover: () => zIndex.popover,
  skipLink: () => zIndex.skipLink,
  toast: () => zIndex.toast,
  tooltip: () => zIndex.tooltip,
};

// Native easing functions for React Native
export const nativeEasing = {
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
};

// Elevation levels for shadows
export const elevationLevels = {
  none: 0,
  sm: 1,
  md: 2,
  lg: 4,
  xl: 8,
  '2xl': 12,
  '3xl': 16,
};

// Named exports for convenience
export { colors as colorsTokens } from './colors';
export { typography as typographyTokens } from './typography';
export { shadows as shadowTokens } from './shadows';
export { animations as animationTokens } from './animations';
export { accessibility as accessibilityTokens } from './accessibility';

// Export spacingTokens from spacing
export { spacingTokens } from './spacing';
