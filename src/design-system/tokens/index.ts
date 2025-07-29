/**
 * Design Tokens - Main Export
 * Central export point for all design tokens
 */

// Enhanced token exports
export * from './colors';
export * from './typography';
export * from './spacing';
export * from './shadows';
export * from './animations';
export * from './accessibility';

// Re-export legacy tokens for backward compatibility
export {
  borderRadius,
  duration,
  easing,
  nativeEasing,
  breakpoints,
  zIndex,
  zIndexUtils,
} from '../../styles/theme';

// Default exports
export { default as colors } from './colors';
export { default as typography } from './typography';
export { default as spacing } from './spacing';
export { default as shadows } from './shadows';
export { default as animations } from './animations';
export { default as accessibility } from './accessibility';
