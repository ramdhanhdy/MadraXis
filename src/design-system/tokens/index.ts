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
  spacingTokens,
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
  elevationLevels,
  roleShadows,
  coloredShadows
} from './shadows';

export {
  animations,
  duration,
  easing,
  nativeEasing,
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

// Re-export legacy tokens for backward compatibility
export {
  borderRadius,
  breakpoints,
  zIndex,
  zIndexUtils,
} from '../../styles/theme';

// Named exports for convenience
export { colors as colorsTokens } from './colors';
export { typography as typographyTokens } from './typography';
export { spacingTokens } from './spacing';
export { shadows as shadowTokens } from './shadows';
export { animations as animationTokens } from './animations';
export { accessibility as accessibilityTokens } from './accessibility';
