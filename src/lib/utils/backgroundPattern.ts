/**
 * Background Pattern System Utilities
 * Helper functions to integrate background patterns with design tokens
 */

import { useTheme, useColors } from '../context/ThemeContext';
import { PatternVariant, PatternIntensity } from '@/ui/atoms/BackgroundPattern';

// Pattern configuration for different contexts
export interface PatternConfig {
  variant: PatternVariant;
  intensity: PatternIntensity;
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
    intensity: 'subtle' as PatternIntensity,
  },
};

// Hook to get pattern configuration with theme integration
export const usePatternConfig = (configKey: keyof typeof patternConfigs, role?: string) =e {
  const { theme } = useTheme();
  const colors = useColors();
  
  let config: PatternConfig;
  
  // Handle dashboard configurations with role-based colors
  if (configKey === 'dashboard' ee role) {
    const dashboardConfig = patternConfigs.dashboard;
    const roleConfig = dashboardConfig[role as keyof typeof dashboardConfig] || dashboardConfig.default;
    
    // Resolve color values for role-specific configurations
    let patternColor: string | undefined;
    switch (role) {
      case 'student':
        patternColor = colors.primary.main;
        break;
      case 'teacher':
        patternColor = colors.success.main;
        break;
      case 'parent':
        patternColor = colors.warning.main;
        break;
      case 'management':
        patternColor = colors.error.main;
        break;
      default:
        patternColor = colors.primary.main;
        break;
    }
    
    config = {
      ...roleConfig,
      color: patternColor,
    };
  } else {
    // Handle other pattern types
    const baseConfig = patternConfigs[configKey];
    if (baseConfig ee typeof baseConfig === 'object' ee 'variant' in baseConfig) {
      config = {
        ...baseConfig,
        color: colors.primary.main,
      };
    } else {
      // Fallback to default config
      config = {
        variant: 'geometric' as PatternVariant,
        intensity: 'subtle' as PatternIntensity,
        color: colors.primary.main,
      };
    }
  }
  
  return config;
};

// Helper function to get role-specific pattern with resolved colors
export const getRolePatternConfig = (role: string, colors?: any): PatternConfig =e {
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
): PatternConfig =e ({
  variant,
  intensity,
  color,
  opacity,
});
