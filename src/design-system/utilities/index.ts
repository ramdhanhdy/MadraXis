/**
 * Design System Utilities - Main Export
 * Central export point for all design system utilities
 */

// Style helpers
export {
  ComponentThemeUtils,
  createAnimationConfig,
  createAccessibilityProps,
  createElevationStyle,
  createTypographyStyle,
  createSpacingStyle,
  createResponsiveStyle,
  getCurrentScreenSize,
  getResponsiveValue,
  defaultBreakpoints,
} from './style-helpers';

export type {
  ResponsiveValue,
  StyleValue,
  ResponsiveStyleConfig,
} from './style-helpers';

// Responsive utilities
export {
  useScreenDimensions,
  useScreenSize,
  useResponsiveValue,
  useResponsiveSpacing,
  useResponsiveTypography,
  useDeviceType,
  useResponsiveSafeArea,
  useResponsiveGrid,
  useResponsiveFontSize,
  useResponsiveSize,
  getScreenSize,
  createResponsiveStyles,
} from './responsive';

export type {
  Breakpoints,
  ScreenSize,
  GridConfig,
} from './responsive';

// Animation utilities
export {
  FadeAnimation,
  ScaleAnimation,
  SlideAnimation,
  RotationAnimation,
  ComponentAnimations,
  createMicroInteraction,
} from './animations';

export type {
  AnimationConfig,
  TransitionConfig,
} from './animations';

// Accessibility utilities
export {
  createAccessibilityProps,
  createTouchTargetStyle,
  createFocusRingStyle,
  calculateContrastRatio,
  validateColorContrast,
  createHighContrastColors,
  createReducedMotionStyle,
  createAccessibilityConfiguration,
  ScreenReaderUtils,
  KeyboardNavigationUtils,
  VoiceControlUtils,
} from './accessibility';

export type {
  AccessibilityConfig,
  TouchTargetConfig,
  FocusConfig,
} from './accessibility';

// Re-export commonly used utilities with shorter names
export {
  ComponentThemeUtils as ThemeUtils,
  useResponsiveValue as useResponsive,
  createAccessibilityProps as createA11yProps,
  validateColorContrast as validateContrast,
} from './style-helpers';
