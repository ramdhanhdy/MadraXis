/**
 * Background Pattern System Utilities
 * Helper functions to integrate background patterns with design tokens
 */

import { useTheme, useColors } from '../context/ThemeContext';
import { PatternVariant, PatternIntensity } from '../shared/components/atoms/BackgroundPattern';

// Pattern configuration for different contexts
export interface PatternConfig {
  variant: PatternVariant;
  intensity?: PatternIntensity;
  color?: string;
  opacity?: number;
}

// Predefined pattern configurations
export const patternConfigs = {
  // Dashboard patterns
  dashboard: {
    default: {
      variant: 'geometric' as PatternVariant,
      intensity: 'subtle' as PatternIntensity,
    },
    teacher: {
      variant: 'geometric' as PatternVariant,
      intensity: 'light' as PatternIntensity,
      color: 'success' as const,
    },
    student: {
      variant: 'geometric' as PatternVariant,
      intensity: 'subtle' as PatternIntensity,
      color: 'primary' as const,
    },
    parent: {
      variant: 'geometric' as PatternVariant,
      intensity: 'light' as PatternIntensity,
      color: 'warning' as const,
    },
    management: {
      variant: 'geometric' as PatternVariant,
      intensity: 'medium' as PatternIntensity,
      color: 'error' as const,
    },
  },
  
  // Modal patterns
  modal: {
    variant: 'minimal' as PatternVariant,
    intensity: 'subtle' as PatternIntensity,
  },
  
  // Form patterns
  form: {
    variant: 'dots' as PatternVariant,
    intensity: 'light' as PatternIntensity,
  },
  
  // Minimal patterns
  minimal: {
    variant: 'minimal' as PatternVariant,
    intensity: 'subtle' as PatternIntensity,
  },
  
  // No pattern
  none: {
    variant: 'none' as PatternVariant,
  },
};

// Hook to get pattern configuration with theme integration
export const usePatternConfig = (configKey: keyof typeof patternConfigs, role?: string): PatternConfig => {
  const { theme } = useTheme();
  const colors = useColors();

  // Handle dashboard configurations with role-based colors
  if (configKey === 'dashboard') {
    const dashboardConfigs = patternConfigs.dashboard;
    const effectiveRole = role && role in dashboardConfigs ? role : 'default';
    const roleConfig = dashboardConfigs[effectiveRole as keyof typeof dashboardConfigs];

    // Define the color map and the type for its keys
    const colorMap = {
      primary: colors.primary.main,
      success: colors.success.main,
      warning: colors.warning.main,
      error: colors.error.main,
    };
    type ColorName = keyof typeof colorMap;

    // Resolve color name from config, ensuring it's a valid key
    const colorName = ('color' in roleConfig && roleConfig.color) ? roleConfig.color as ColorName : 'primary';
    const patternColor = colorMap[colorName];

    return {
      variant: roleConfig.variant,
      intensity: roleConfig.intensity,
      color: patternColor,
    };
  } 

  // Handle other simple pattern types
  const config = patternConfigs[configKey];
  const color = ('color' in config && typeof config.color === 'string') ? config.color : colors.primary.main;
  
  return {
    variant: config.variant,
    intensity: 'intensity' in config ? config.intensity : undefined,
    color: color,
  };
};

// Helper function to get role-specific pattern with resolved colors
export const getRolePatternConfig = (role: string, colors?: any): PatternConfig => {
  const baseConfig = {
    variant: 'geometric' as PatternVariant,
    intensity: 'subtle' as PatternIntensity,
  };

  // Use provided colors or fallback to default hex values
  const colorMap = colors ? {
    primary: colors.primary?.main || '#3B82F6',
    success: colors.success?.main || '#10B981',
    warning: colors.warning?.main || '#F59E0B',
    error: colors.error?.main || '#EF4444',
  } : {
    primary: '#3B82F6',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  };

  switch (role) {
    case 'student':
      return { ...baseConfig, color: colorMap.primary };
    case 'teacher':
      return { ...baseConfig, color: colorMap.success, intensity: 'light' as PatternIntensity };
    case 'parent':
      return { ...baseConfig, color: colorMap.warning, intensity: 'light' as PatternIntensity };
    case 'management':
      return { ...baseConfig, color: colorMap.error, intensity: 'medium' as PatternIntensity };
    default:
      return baseConfig;
  }
};

// Utility to create pattern variants
export const createPatternVariant = (
  variant: PatternVariant,
  intensity: PatternIntensity,
  color?: string,
  opacity?: number
): PatternConfig => ({
  variant,
  intensity,
  color,
  opacity,
});