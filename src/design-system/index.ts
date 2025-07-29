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

// Re-export existing tokens for backward compatibility
export {
  colors,
  semanticColors,
  baseColors,
  roleColors,
  typography,
  typographyVariants,
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  spacingTokens,
  spacing,
  semanticSpacing,
  componentSpacing,
  shadows,
  semanticShadows,
  elevationLevels,
  borderRadius,
  duration,
  easing,
  nativeEasing,
  breakpoints,
  zIndex,
  zIndexUtils,
} from '../styles/theme';

// Export theme and role themes for backward compatibility
export { theme, roleThemes } from '../styles/theme';

// Export enhanced theme context (will be created next)
// export { ThemeProvider, useTheme } from './provider/ThemeProvider';
