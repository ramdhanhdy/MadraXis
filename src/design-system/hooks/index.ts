/**
 * Design System Hooks - Main Export
 * Central export point for all design system hooks
 */

// Theme hooks
export {
  useTheme,
  useEnhancedTheme,
} from '../themes/hooks';

// Theme switcher hooks
export {
  useThemeSwitcher,
  useThemePresets,
  useAnimatedThemeSwitcher,
} from './useThemeSwitcher';

export type {
  ThemeSwitcherResult,
} from './useThemeSwitcher';
