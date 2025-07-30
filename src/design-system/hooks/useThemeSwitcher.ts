/**
 * Simplified Theme Switcher Hook
 * Basic theme switching capabilities
 */

import { useState, useEffect, useCallback } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { ThemeStrategy, ThemeContextType } from '../core/types';
import { UserRole } from '../tokens/colors';
import { roleBasedThemeStrategy } from '../themes/strategies';

// Mock useTheme hook to avoid JSX compilation issues
const useTheme = (): ThemeContextType => {
  // This is a simplified mock for TypeScript compilation
  // In actual usage, this would be imported from the ThemeProvider
  return {
    theme: {} as any,
    currentRole: 'student',
    setRole: () => {},
    colorScheme: 'light',
    setColorScheme: () => {},
    strategy: roleBasedThemeStrategy,
    setStrategy: () => {},
    isLoading: false,
    error: null,
  };
};

// Define ThemeMode locally
export type ThemeMode = 'light' | 'dark';

// Hook return type
export interface ThemeSwitcherResult {
  // Current theme state
  currentStrategy: ThemeStrategy;
  currentRole: UserRole;
  currentMode: ThemeMode;
  
  // Available options
  availableStrategies: Array<{ key: ThemeStrategy; label: string; description: string }>;
  availableRoles: Array<{ key: UserRole; label: string; color: string }>;
  availableModes: Array<{ key: ThemeMode; label: string; icon: string }>;
  
  // Switching functions
  switchStrategy: (strategy: ThemeStrategy) => void;
  switchRole: (role: UserRole) => void;
  switchMode: (mode: ThemeMode) => void;
  switchTheme: (strategy: ThemeStrategy, role: UserRole, mode: ThemeMode) => void;
  
  // Convenience functions
  toggleMode: () => void;
  resetToDefaults: () => void;
  
  // System integration
  followSystemMode: boolean;
  setFollowSystemMode: (follow: boolean) => void;
  systemColorScheme: ColorSchemeName;
  
  // State management
  isLoading: boolean;
  error: string | null;
}

// Persistence key for AsyncStorage
const THEME_PERSISTENCE_KEY = '@madraxis/theme-preferences';

/**
 * Hook for easy theme switching with configuration management
 */
export function useThemeSwitcher(): ThemeSwitcherResult {
  const { strategy, currentRole, colorScheme, setRole, setColorScheme, setStrategy } = useTheme();
  
  // Local state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [followSystemMode, setFollowSystemMode] = useState(false);
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );

  // Listen to system color scheme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme);
      
      // Auto-switch mode if following system
      if (followSystemMode && colorScheme) {
        const newMode: ThemeMode = colorScheme === 'dark' ? 'dark' : 'light';
        setColorScheme(newMode);
      }
    });

    return () => subscription.remove();
  }, [followSystemMode]);

  // Load persisted preferences on mount
  useEffect(() => {
    loadPersistedPreferences();
  }, []);

  // Save preferences when theme changes
  useEffect(() => {
    savePreferences();
  }, [strategy, currentRole, colorScheme, followSystemMode]);

  /**
   * Load persisted theme preferences
   */
  const loadPersistedPreferences = async () => {
    try {
      setIsLoading(true);
      
      // In a real app, this would use AsyncStorage
      const stored = localStorage?.getItem(THEME_PERSISTENCE_KEY);
      if (stored) {
        const preferences = JSON.parse(stored);
        
        // Apply preferences
        if (preferences.strategy) {
          setStrategy(preferences.strategy);
        }
        if (preferences.role) {
          setRole(preferences.role);
        }
        if (preferences.mode) {
          setColorScheme(preferences.mode);
        }
        
        if (typeof preferences.followSystemMode === 'boolean') {
          setFollowSystemMode(preferences.followSystemMode);
        }
      }
    } catch (err) {
      console.warn('Failed to load theme preferences:', err);
      setError('Failed to load saved theme preferences');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Save current preferences
   */
  const savePreferences = async () => {
    try {
      const preferences = {
        strategy,
        role: currentRole,
        mode: colorScheme,
        followSystemMode,
        timestamp: Date.now(),
      };

      // In a real app, this would use AsyncStorage
      localStorage?.setItem(THEME_PERSISTENCE_KEY, JSON.stringify(preferences));
    } catch (err) {
      console.warn('Failed to save theme preferences:', err);
    }
  };

  /**
   * Switch theme strategy
   */
  const switchStrategy = useCallback((newStrategy: ThemeStrategy) => {
    setError(null);
    setStrategy(newStrategy);
  }, [setStrategy]);

  /**
   * Switch user role
   */
  const switchRole = useCallback((newRole: UserRole) => {
    setError(null);
    setRole(newRole);
  }, [setRole]);

  /**
   * Switch theme mode
   */
  const switchMode = useCallback((newMode: ThemeMode) => {
    setError(null);
    setColorScheme(newMode);
  }, [setColorScheme]);

  /**
   * Switch complete theme
   */
  const switchTheme = useCallback((
    newStrategy: ThemeStrategy,
    newRole: UserRole,
    newMode: ThemeMode
  ) => {
    setError(null);
    setStrategy(newStrategy);
    setRole(newRole);
    setColorScheme(newMode);
  }, [setStrategy, setRole, setColorScheme]);

  /**
   * Toggle between light and dark mode
   */
  const toggleMode = useCallback(() => {
    const newMode: ThemeMode = colorScheme === 'light' ? 'dark' : 'light';
    switchMode(newMode);
  }, [colorScheme, switchMode]);

  /**
   * Reset to default theme
   */
  const resetToDefaults = useCallback(() => {
    switchTheme(roleBasedThemeStrategy, 'student', 'light');
    setFollowSystemMode(false);
    setError(null);
  }, [switchTheme]);

  /**
   * Set whether to follow system color scheme
   */
  const handleSetFollowSystemMode = useCallback((follow: boolean) => {
    setFollowSystemMode(follow);

    // Immediately apply system mode if enabled
    if (follow && systemColorScheme) {
      const systemMode: ThemeMode = systemColorScheme === 'dark' ? 'dark' : 'light';
      switchMode(systemMode);
    }
  }, [systemColorScheme, switchMode]);

  // Available options (simplified)
  const availableStrategies = [roleBasedThemeStrategy];
  const availableRoles: UserRole[] = ['student', 'teacher', 'parent', 'management'];
  const availableModes: ThemeMode[] = ['light', 'dark'];

  return {
    // Current state
    currentStrategy: strategy,
    currentRole: currentRole || 'student',
    currentMode: colorScheme,

    // Available options
    availableStrategies: [
      { key: roleBasedThemeStrategy, label: 'Role-Based', description: 'Different themes for each user role' }
    ],
    availableRoles: [
      { key: 'student', label: 'Student', color: '#4F46E5' },
      { key: 'teacher', label: 'Teacher', color: '#059669' },
      { key: 'parent', label: 'Parent', color: '#DC2626' },
      { key: 'management', label: 'Management', color: '#7C2D12' }
    ],
    availableModes: [
      { key: 'light', label: 'Light', icon: '☀️' },
      { key: 'dark', label: 'Dark', icon: '🌙' }
    ],
    
    // Switching functions
    switchStrategy,
    switchRole,
    switchMode,
    switchTheme,
    
    // Convenience functions
    toggleMode,
    resetToDefaults,
    
    // System integration
    followSystemMode,
    setFollowSystemMode: handleSetFollowSystemMode,
    systemColorScheme,
    
    // State
    isLoading,
    error,
  };
}

/**
 * Hook for quick theme presets
 */
export function useThemePresets() {
  const { switchTheme } = useThemeSwitcher();
  
  const presets = {
    // Student presets
    studentLight: () => switchTheme(roleBasedThemeStrategy, 'student', 'light'),
    studentDark: () => switchTheme(roleBasedThemeStrategy, 'student', 'dark'),

    // Teacher presets
    teacherLight: () => switchTheme(roleBasedThemeStrategy, 'teacher', 'light'),
    teacherDark: () => switchTheme(roleBasedThemeStrategy, 'teacher', 'dark'),

    // Parent presets
    parentLight: () => switchTheme(roleBasedThemeStrategy, 'parent', 'light'),
    parentDark: () => switchTheme(roleBasedThemeStrategy, 'parent', 'dark'),

    // Management presets
    managementLight: () => switchTheme(roleBasedThemeStrategy, 'management', 'light'),
    managementDark: () => switchTheme(roleBasedThemeStrategy, 'management', 'dark'),
  };
  
  return presets;
}

/**
 * Hook for theme switching with animations
 */
export function useAnimatedThemeSwitcher() {
  const themeSwitcher = useThemeSwitcher();
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const switchWithAnimation = useCallback(async (
    strategy: ThemeStrategy,
    role: UserRole,
    mode: ThemeMode,
    duration = 300
  ) => {
    setIsTransitioning(true);
    
    // Add transition animation here if needed
    // For React Native, you might use Animated API or Reanimated
    
    // Switch theme
    themeSwitcher.switchTheme(strategy, role, mode);
    
    // Wait for animation to complete
    setTimeout(() => {
      setIsTransitioning(false);
    }, duration);
  }, [themeSwitcher]);
  
  return {
    ...themeSwitcher,
    switchWithAnimation,
    isTransitioning,
  };
}
