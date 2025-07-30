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

// Note: useTheme is available from '../themes/provider/ThemeProvider'
// but not re-exported here to avoid JSX compilation issues during TypeScript checking
