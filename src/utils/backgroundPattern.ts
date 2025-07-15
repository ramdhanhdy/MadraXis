/**
 * Background Pattern System Utilities
 * Helper functions to integrate background patterns with design tokens
 */

import { useTheme, useColors } from '../context/ThemeContext';
import { PatternVariant, PatternIntensity } from '../components/atoms/BackgroundPattern';

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
  },
};

// Hook to get pattern configuration with theme integration
export const usePatternConfig = (configKey: keyof typeof patternConfigs, role?: string) => {
  const { theme } = useTheme();
  const colors = useColors();
  
  const config = patternConfigs[configKey];
  
  // Handle role-specific color mapping
  let patternColor: string | undefined;
  
  // Handle dashboard configurations with role-based colors
  if (configKey === 'dashboard' && role) {
    const dashboardConfig = patternConfigs.dashboard;
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
  } else {
    // Handle other pattern types without color specification
    patternColor = colors.primary.main;
  }
  
  return {
    ...config,
    color: patternColor,
  };
};

// Helper function to get role-specific pattern
export const getRolePatternConfig = (role: string): PatternConfig => {
  const baseConfig = {
    variant: 'geometric' as PatternVariant,
    intensity: 'subtle' as PatternIntensity,
  };

  switch (role) {
    case 'student':
      return { ...baseConfig, color: 'primary' };
    case 'teacher':
      return { ...baseConfig, color: 'success', intensity: 'light' as PatternIntensity };
    case 'parent':
      return { ...baseConfig, color: 'warning', intensity: 'light' as PatternIntensity };
    case 'management':
      return { ...baseConfig, color: 'error', intensity: 'medium' as PatternIntensity };
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