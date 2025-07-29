/**
 * Design System Hooks - Main Export
 * Central export point for all design system hooks
 */

// Theme switcher hooks
export {
  useThemeSwitcher,
  useThemePresets,
  useAnimatedThemeSwitcher,
} from './useThemeSwitcher';

export type {
  ThemeSwitcherResult,
} from './useThemeSwitcher';

// Re-export theme provider hook for convenience
export { useTheme } from '../themes/ThemeProvider';
