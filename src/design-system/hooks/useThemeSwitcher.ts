/**
 * Theme Switcher Hook
 * Easy theme switching with configuration management
 */

import { useState, useEffect, useCallback } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { useTheme } from '../themes/ThemeProvider';
import { themeConfig } from '@app/theme-config';
import { ThemeStrategy, UserRole, ThemeMode } from '../core/types';

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
  const { theme, strategy, role, mode, switchTheme: providerSwitchTheme } = useTheme();
  const config = themeConfig.getConfig();
  
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
        if (themeConfig.isModeEnabled(newMode)) {
          switchMode(newMode);
        }
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
  }, [strategy, role, mode, followSystemMode]);

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
        
        // Validate and apply preferences
        if (preferences.strategy && themeConfig.isStrategyEnabled(preferences.strategy)) {
          if (preferences.role && themeConfig.isRoleEnabled(preferences.role)) {
            if (preferences.mode && themeConfig.isModeEnabled(preferences.mode)) {
              providerSwitchTheme(preferences.strategy, preferences.role, preferences.mode);
            }
          }
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
        role,
        mode,
        followSystemMode,
        timestamp: Date.now(),
      };
      
      // In a real app, this would use AsyncStorage
      localStorage?.setItem(THEME_PERSISTENCE_KEY, JSON.stringify(preferences));
      
      if (config.development.logThemeChanges) {
        console.log('🎨 Theme preferences saved:', preferences);
      }
    } catch (err) {
      console.warn('Failed to save theme preferences:', err);
    }
  };

  /**
   * Switch theme strategy
   */
  const switchStrategy = useCallback((newStrategy: ThemeStrategy) => {
    if (!themeConfig.isStrategyEnabled(newStrategy)) {
      setError(`Strategy '${newStrategy}' is not enabled`);
      return;
    }
    
    setError(null);
    providerSwitchTheme(newStrategy, role, mode);
    
    if (config.development.logThemeChanges) {
      console.log(`🎨 Switched to strategy: ${newStrategy}`);
    }
  }, [role, mode, providerSwitchTheme, config.development.logThemeChanges]);

  /**
   * Switch user role
   */
  const switchRole = useCallback((newRole: UserRole) => {
    if (!themeConfig.isRoleEnabled(newRole)) {
      setError(`Role '${newRole}' is not enabled`);
      return;
    }
    
    setError(null);
    providerSwitchTheme(strategy, newRole, mode);
    
    if (config.development.logThemeChanges) {
      console.log(`🎨 Switched to role: ${newRole}`);
    }
  }, [strategy, mode, providerSwitchTheme, config.development.logThemeChanges]);

  /**
   * Switch theme mode
   */
  const switchMode = useCallback((newMode: ThemeMode) => {
    if (!themeConfig.isModeEnabled(newMode)) {
      setError(`Mode '${newMode}' is not enabled`);
      return;
    }
    
    setError(null);
    providerSwitchTheme(strategy, role, newMode);
    
    if (config.development.logThemeChanges) {
      console.log(`🎨 Switched to mode: ${newMode}`);
    }
  }, [strategy, role, providerSwitchTheme, config.development.logThemeChanges]);

  /**
   * Switch complete theme
   */
  const switchTheme = useCallback((
    newStrategy: ThemeStrategy,
    newRole: UserRole,
    newMode: ThemeMode
  ) => {
    // Validate all parameters
    if (!themeConfig.isStrategyEnabled(newStrategy)) {
      setError(`Strategy '${newStrategy}' is not enabled`);
      return;
    }
    
    if (!themeConfig.isRoleEnabled(newRole)) {
      setError(`Role '${newRole}' is not enabled`);
      return;
    }
    
    if (!themeConfig.isModeEnabled(newMode)) {
      setError(`Mode '${newMode}' is not enabled`);
      return;
    }
    
    setError(null);
    providerSwitchTheme(newStrategy, newRole, newMode);
    
    if (config.development.logThemeChanges) {
      console.log(`🎨 Switched theme: ${newStrategy}-${newRole}-${newMode}`);
    }
  }, [providerSwitchTheme, config.development.logThemeChanges]);

  /**
   * Toggle between light and dark mode
   */
  const toggleMode = useCallback(() => {
    const newMode: ThemeMode = mode === 'light' ? 'dark' : 'light';
    switchMode(newMode);
  }, [mode, switchMode]);

  /**
   * Reset to default theme
   */
  const resetToDefaults = useCallback(() => {
    const defaultConfig = themeConfig.getConfig();
    switchTheme(
      defaultConfig.defaultStrategy,
      defaultConfig.defaultRole,
      defaultConfig.defaultMode
    );
    
    setFollowSystemMode(false);
    setError(null);
    
    if (config.development.logThemeChanges) {
      console.log('🎨 Reset to default theme');
    }
  }, [switchTheme, config.development.logThemeChanges]);

  /**
   * Set whether to follow system color scheme
   */
  const handleSetFollowSystemMode = useCallback((follow: boolean) => {
    setFollowSystemMode(follow);
    
    // Immediately apply system mode if enabled
    if (follow && systemColorScheme) {
      const systemMode: ThemeMode = systemColorScheme === 'dark' ? 'dark' : 'light';
      if (themeConfig.isModeEnabled(systemMode)) {
        switchMode(systemMode);
      }
    }
    
    if (config.development.logThemeChanges) {
      console.log(`🎨 Follow system mode: ${follow}`);
    }
  }, [systemColorScheme, switchMode, config.development.logThemeChanges]);

  // Get available options from configuration
  const availableStrategies = themeConfig.getAvailableStrategies();
  const availableRoles = themeConfig.getAvailableRoles();
  const availableModes = themeConfig.getAvailableModes();

  return {
    // Current state
    currentStrategy: strategy,
    currentRole: role,
    currentMode: mode,
    
    // Available options
    availableStrategies,
    availableRoles,
    availableModes,
    
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
    studentLight: () => switchTheme('role-based', 'student', 'light'),
    studentDark: () => switchTheme('role-based', 'student', 'dark'),
    
    // Teacher presets
    teacherLight: () => switchTheme('role-based', 'teacher', 'light'),
    teacherDark: () => switchTheme('role-based', 'teacher', 'dark'),
    
    // Parent presets
    parentLight: () => switchTheme('role-based', 'parent', 'light'),
    parentDark: () => switchTheme('role-based', 'parent', 'dark'),
    
    // Management presets
    managementLight: () => switchTheme('role-based', 'management', 'light'),
    managementDark: () => switchTheme('role-based', 'management', 'dark'),
    
    // Accessibility presets
    highContrast: () => switchTheme('high-contrast', 'student', 'light'),
    reducedMotion: () => switchTheme('reduced-motion', 'student', 'light'),
    
    // Shared theme
    shared: () => switchTheme('shared', 'student', 'light'),
    sharedDark: () => switchTheme('shared', 'student', 'dark'),
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
