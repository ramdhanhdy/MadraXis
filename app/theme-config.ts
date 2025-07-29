/**
 * Theme Configuration System
 * Central configuration for theme strategies and easy theme switching
 */

import {
  ThemeStrategy,
  UserRole,
  ThemeMode,
  createTheme,
  THEME_STRATEGIES,
} from '@design-system';

// Configuration types
export interface ThemeConfig {
  defaultStrategy: ThemeStrategy;
  defaultRole: UserRole;
  defaultMode: ThemeMode;
  enabledStrategies: ThemeStrategy[];
  enabledRoles: UserRole[];
  enabledModes: ThemeMode[];
  features: ThemeFeatures;
  development: DevelopmentConfig;
}

export interface ThemeFeatures {
  roleBasedTheming: boolean;
  darkModeSupport: boolean;
  highContrastMode: boolean;
  reducedMotionSupport: boolean;
  adaptiveTheming: boolean;
  customThemeSupport: boolean;
  themeValidation: boolean;
  performanceMonitoring: boolean;
}

export interface DevelopmentConfig {
  enableDebugTools: boolean;
  enableThemeInspector: boolean;
  enableValidation: boolean;
  enablePerformanceTracking: boolean;
  logThemeChanges: boolean;
  showThemeWarnings: boolean;
}

export interface ThemeOverrides {
  colors?: Record<string, any>;
  typography?: Record<string, any>;
  spacing?: Record<string, any>;
  componentThemes?: Record<string, any>;
}

// Default theme configuration
export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  // Default theme settings
  defaultStrategy: 'role-based',
  defaultRole: 'student',
  defaultMode: 'light',

  // Enabled options
  enabledStrategies: ['shared', 'role-based', 'adaptive', 'high-contrast'],
  enabledRoles: ['student', 'teacher', 'parent', 'management'],
  enabledModes: ['light', 'dark'],

  // Feature flags
  features: {
    roleBasedTheming: true,
    darkModeSupport: true,
    highContrastMode: true,
    reducedMotionSupport: true,
    adaptiveTheming: true,
    customThemeSupport: false, // Disabled by default for security
    themeValidation: true,
    performanceMonitoring: true,
  },

  // Development settings
  development: {
    enableDebugTools: __DEV__,
    enableThemeInspector: __DEV__,
    enableValidation: __DEV__,
    enablePerformanceTracking: __DEV__,
    logThemeChanges: __DEV__,
    showThemeWarnings: __DEV__,
  },
};

/**
 * Theme Configuration Manager
 */
export class ThemeConfigManager {
  private static instance: ThemeConfigManager;
  private config: ThemeConfig;
  private overrides: ThemeOverrides = {};
  private listeners: Array<(config: ThemeConfig) => void> = [];

  private constructor(initialConfig: ThemeConfig = DEFAULT_THEME_CONFIG) {
    this.config = { ...initialConfig };
  }

  /**
   * Get singleton instance
   */
  static getInstance(initialConfig?: ThemeConfig): ThemeConfigManager {
    if (!ThemeConfigManager.instance) {
      ThemeConfigManager.instance = new ThemeConfigManager(initialConfig);
    }
    return ThemeConfigManager.instance;
  }

  /**
   * Get current configuration
   */
  getConfig(): ThemeConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(updates: Partial<ThemeConfig>): void {
    this.config = {
      ...this.config,
      ...updates,
      features: {
        ...this.config.features,
        ...updates.features,
      },
      development: {
        ...this.config.development,
        ...updates.development,
      },
    };

    // Notify listeners
    this.listeners.forEach(listener => listener(this.config));

    // Log changes in development
    if (this.config.development.logThemeChanges) {
      console.log('🎨 Theme configuration updated:', updates);
    }
  }

  /**
   * Set theme overrides
   */
  setOverrides(overrides: ThemeOverrides): void {
    this.overrides = { ...overrides };
    
    if (this.config.development.logThemeChanges) {
      console.log('🎨 Theme overrides applied:', overrides);
    }
  }

  /**
   * Get theme overrides
   */
  getOverrides(): ThemeOverrides {
    return { ...this.overrides };
  }

  /**
   * Clear theme overrides
   */
  clearOverrides(): void {
    this.overrides = {};
    
    if (this.config.development.logThemeChanges) {
      console.log('🎨 Theme overrides cleared');
    }
  }

  /**
   * Check if strategy is enabled
   */
  isStrategyEnabled(strategy: ThemeStrategy): boolean {
    return this.config.enabledStrategies.includes(strategy);
  }

  /**
   * Check if role is enabled
   */
  isRoleEnabled(role: UserRole): boolean {
    return this.config.enabledRoles.includes(role);
  }

  /**
   * Check if mode is enabled
   */
  isModeEnabled(mode: ThemeMode): boolean {
    return this.config.enabledModes.includes(mode);
  }

  /**
   * Check if feature is enabled
   */
  isFeatureEnabled(feature: keyof ThemeFeatures): boolean {
    return this.config.features[feature];
  }

  /**
   * Get available strategies
   */
  getAvailableStrategies(): Array<{ key: ThemeStrategy; label: string; description: string }> {
    return this.config.enabledStrategies.map(strategy => ({
      key: strategy,
      label: this.getStrategyLabel(strategy),
      description: this.getStrategyDescription(strategy),
    }));
  }

  /**
   * Get available roles
   */
  getAvailableRoles(): Array<{ key: UserRole; label: string; color: string }> {
    return this.config.enabledRoles.map(role => ({
      key: role,
      label: this.getRoleLabel(role),
      color: this.getRoleColor(role),
    }));
  }

  /**
   * Get available modes
   */
  getAvailableModes(): Array<{ key: ThemeMode; label: string; icon: string }> {
    return this.config.enabledModes.map(mode => ({
      key: mode,
      label: this.getModeLabel(mode),
      icon: this.getModeIcon(mode),
    }));
  }

  /**
   * Create theme with current configuration
   */
  createConfiguredTheme(
    strategy: ThemeStrategy,
    role: UserRole,
    mode: ThemeMode
  ) {
    // Validate inputs against configuration
    if (!this.isStrategyEnabled(strategy)) {
      console.warn(`Strategy '${strategy}' is not enabled, falling back to default`);
      strategy = this.config.defaultStrategy;
    }

    if (!this.isRoleEnabled(role)) {
      console.warn(`Role '${role}' is not enabled, falling back to default`);
      role = this.config.defaultRole;
    }

    if (!this.isModeEnabled(mode)) {
      console.warn(`Mode '${mode}' is not enabled, falling back to default`);
      mode = this.config.defaultMode;
    }

    // Create base theme
    const baseTheme = createTheme({
      strategy,
      role,
      mode,
      overrides: this.overrides,
    });

    // Add configuration metadata
    return {
      ...baseTheme,
      config: {
        strategy,
        role,
        mode,
        features: this.config.features,
        overrides: this.overrides,
      },
    };
  }

  /**
   * Subscribe to configuration changes
   */
  subscribe(listener: (config: ThemeConfig) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Reset to default configuration
   */
  reset(): void {
    this.config = { ...DEFAULT_THEME_CONFIG };
    this.overrides = {};
    
    // Notify listeners
    this.listeners.forEach(listener => listener(this.config));
    
    if (this.config.development.logThemeChanges) {
      console.log('🎨 Theme configuration reset to defaults');
    }
  }

  /**
   * Export configuration as JSON
   */
  exportConfig(): string {
    return JSON.stringify({
      config: this.config,
      overrides: this.overrides,
    }, null, 2);
  }

  /**
   * Import configuration from JSON
   */
  importConfig(configJson: string): void {
    try {
      const imported = JSON.parse(configJson);
      
      if (imported.config) {
        this.updateConfig(imported.config);
      }
      
      if (imported.overrides) {
        this.setOverrides(imported.overrides);
      }
      
      if (this.config.development.logThemeChanges) {
        console.log('🎨 Theme configuration imported successfully');
      }
    } catch (error) {
      console.error('Failed to import theme configuration:', error);
      throw new Error('Invalid configuration JSON');
    }
  }

  // Helper methods for labels and descriptions
  private getStrategyLabel(strategy: ThemeStrategy): string {
    const labels: Record<ThemeStrategy, string> = {
      'shared': 'Shared Theme',
      'role-based': 'Role-Based Theme',
      'adaptive': 'Adaptive Theme',
      'high-contrast': 'High Contrast',
      'reduced-motion': 'Reduced Motion',
      'custom': 'Custom Theme',
    };
    return labels[strategy] || strategy;
  }

  private getStrategyDescription(strategy: ThemeStrategy): string {
    const descriptions: Record<ThemeStrategy, string> = {
      'shared': 'Single theme for all users',
      'role-based': 'Different themes for each user role',
      'adaptive': 'Automatically adapts based on context',
      'high-contrast': 'High contrast for accessibility',
      'reduced-motion': 'Reduced animations for accessibility',
      'custom': 'Custom user-defined theme',
    };
    return descriptions[strategy] || 'Theme strategy';
  }

  private getRoleLabel(role: UserRole): string {
    const labels: Record<UserRole, string> = {
      'student': 'Student',
      'teacher': 'Teacher',
      'parent': 'Parent',
      'management': 'Management',
    };
    return labels[role] || role;
  }

  private getRoleColor(role: UserRole): string {
    const colors: Record<UserRole, string> = {
      'student': '#14B8A6', // Teal
      'teacher': '#10B981', // Green
      'parent': '#FBBF24',  // Amber
      'management': '#E11D48', // Rose
    };
    return colors[role] || '#6B7280';
  }

  private getModeLabel(mode: ThemeMode): string {
    const labels: Record<ThemeMode, string> = {
      'light': 'Light Mode',
      'dark': 'Dark Mode',
    };
    return labels[mode] || mode;
  }

  private getModeIcon(mode: ThemeMode): string {
    const icons: Record<ThemeMode, string> = {
      'light': '☀️',
      'dark': '🌙',
    };
    return icons[mode] || '🎨';
  }
}

// Export singleton instance
export const themeConfig = ThemeConfigManager.getInstance();

// Convenience functions
export const getThemeConfig = () => themeConfig.getConfig();
export const updateThemeConfig = (updates: Partial<ThemeConfig>) => themeConfig.updateConfig(updates);
export const isFeatureEnabled = (feature: keyof ThemeFeatures) => themeConfig.isFeatureEnabled(feature);
export const createConfiguredTheme = (strategy: ThemeStrategy, role: UserRole, mode: ThemeMode) => 
  themeConfig.createConfiguredTheme(strategy, role, mode);

// Development helpers
if (__DEV__) {
  // Make theme config available globally for debugging
  (global as any).__THEME_CONFIG__ = themeConfig;
  
  console.log('🎨 Theme Configuration System initialized');
  console.log('Available in development as global.__THEME_CONFIG__');
}
