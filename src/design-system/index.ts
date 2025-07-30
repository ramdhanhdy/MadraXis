/**
 * Design System Main Export
 * Central export point for the enhanced design system
 */

// Core exports
export * from './core/types';
export * from './core/utils';
export * from './core/theme-builder';

// Enhanced token exports
export * from './tokens';

// Enhanced theme system exports
export * from './themes';

// Utility exports
export * from './utilities';

// Validation exports (specific exports to avoid conflicts)
export {
  ThemeValidator,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  ValidationSummary,
  ValidationOptions,
  ColorParser,
  ContrastCalculator,
  ThemeContrastValidator,
  ContrastResult,
  ContrastCheckOptions,
  ContrastCheckResult,
  ContrastValidationResult,
  ColorSuggestion,
  validateThemeContrast,
  suggestBetterColors,
  checkContrast as checkA11y,
  calculateContrast as calculateContrastRatio,
  validateTheme as validateThemeStructure,
} from './validation';

// Hook exports
export * from './hooks';

// Debug exports (development only)
// Debug utilities (excluding useThemeDebugger to avoid conflicts)
export { ThemeInspector } from './debug/ThemeInspector';

// Re-export tokens for backward compatibility
export {
  colors,
  baseColors,
  semanticColors,
  roleColors,
} from './tokens/colors';

export {
  typography,
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
} from './tokens/typography';

export {
  spacing,
  spacingTokens,
} from './tokens/spacing';

export {
  shadows,
  elevationLevels,
} from './tokens/shadows';

export {
  duration,
  easing,
} from './tokens/animations';
