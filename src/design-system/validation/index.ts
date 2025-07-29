/**
 * Design System Validation - Main Export
 * Central export point for all validation utilities
 */

// Theme validator exports
export {
  ThemeValidator,
  validateTheme,
} from './theme-validator';

export type {
  ValidationResult,
  ValidationError,
  ValidationWarning,
  ValidationSummary,
  ValidationOptions,
} from './theme-validator';

// Contrast checker exports
export {
  ColorParser,
  ContrastCalculator,
  ThemeContrastValidator,
  checkContrast,
  calculateContrast,
  validateThemeContrast,
  suggestBetterColors,
} from './contrast-checker';

export type {
  ColorFormat,
  RGBColor,
  HSLColor,
  ContrastResult,
  ContrastCheckOptions,
  ContrastCheckResult,
  ContrastValidationResult,
  ColorSuggestion,
} from './contrast-checker';

// Re-export commonly used functions with shorter names
export {
  validateTheme as validate,
  checkContrast as checkA11y,
  calculateContrast as getContrastRatio,
} from './theme-validator';
