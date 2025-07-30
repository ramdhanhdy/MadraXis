/**
 * ThemeContext - Enhanced theme system integration
 * 
 * Integrates the design-system's enhanced ThemeProvider with application-specific
 * configuration and provides convenient hooks for theme access.
 */

export * from './useTheme';

// ThemeProvider components are available from './ThemeProvider' but not exported here to avoid JSX resolution issues
// For runtime usage: import { AppThemeProvider, ThemeProvider } from './ThemeProvider';
export { 
  useTheme,
  useColors,
  useTypography,
  useSpacing,
  useShadows,
  useBorderRadius,
  useComponentTheme,
  useIsDarkMode,
  useCurrentRole,
  useHasThemeRole,
  useThemeStrategy,
  useResponsiveValue,
  useStyleHelpers,
  useButtonStyles,
  useCardStyles,
  useModalStyles,
  useRoleColors,
  useThemeDebug
} from './useTheme';

// Re-export design system types for convenience
export type {
  Theme,
  ThemeStrategy,
  ThemeContextType
} from '../../design-system/core/types';
export type { UserRole } from '../../design-system/tokens/colors';
