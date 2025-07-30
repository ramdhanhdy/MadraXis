/**
 * Themes - Main Export
 * Complete theme system with base themes, role themes, strategies, and provider
 */

// Base themes
export * from './base';

// Shared themes
export * from './shared';

// Role-specific themes
export * from './roles';

// Theme strategies
export * from './strategies';

// Provider and hooks
export { ThemeProvider } from './provider/ThemeProvider';
export { useTheme, useEnhancedTheme } from './hooks';
export { useThemeDebugger } from '../debug/useThemeDebugger';

export {
  defaultThemeStrategy,
  roleBasedThemeStrategy,
  sharedThemeStrategy,
  adaptiveThemeStrategy,
  highContrastThemeStrategy,
  reducedMotionThemeStrategy,
} from './strategies';

export {
  roleThemes,
  roleThemeConfigs,
  roleThemeCreators,
} from './roles';

export {
  lightSharedTheme,
  darkSharedTheme,
  fallbackTheme,
} from './shared';

export {
  enhancedLightTheme as defaultLightTheme,
  enhancedDarkTheme as defaultDarkTheme,
} from './base';
