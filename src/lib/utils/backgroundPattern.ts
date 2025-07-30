/**
 * Background Pattern Utilities
 * Utilities for creating and managing background patterns
 */

import { useTheme, useColors } from '../../context/ThemeContext';

export interface PatternConfig {
  type: 'dots' | 'grid' | 'diagonal' | 'waves' | 'hexagon';
  size: number;
  spacing: number;
  opacity: number;
  color: string;
  backgroundColor?: string;
}

// Predefined pattern configurations
export const patternConfigs = {
  subtle: {
    type: 'dots' as const,
    size: 2,
    spacing: 20,
    opacity: 0.1,
    color: '#000000',
  },
  dashboard: {
    type: 'grid' as const,
    size: 1,
    spacing: 24,
    opacity: 0.05,
    color: '#000000',
  },
  decorative: {
    type: 'diagonal' as const,
    size: 3,
    spacing: 16,
    opacity: 0.15,
    color: '#000000',
  },
  header: {
    type: 'waves' as const,
    size: 4,
    spacing: 32,
    opacity: 0.08,
    color: '#ffffff',
  },
  card: {
    type: 'hexagon' as const,
    size: 2,
    spacing: 18,
    opacity: 0.06,
    color: '#000000',
  },
} as const;

// Generate SVG pattern string
export const generateSVGPattern = (config: PatternConfig): string => {
  const { type, size, spacing, opacity, color } = config;
  
  switch (type) {
    case 'dots':
      return `
        <svg width="${spacing}" height="${spacing}" xmlns="http://www.w3.org/2000/svg">
          <circle cx="${spacing / 2}" cy="${spacing / 2}" r="${size}" fill="${color}" opacity="${opacity}" />
        </svg>
      `;
    
    case 'grid':
      return `
        <svg width="${spacing}" height="${spacing}" xmlns="http://www.w3.org/2000/svg">
          <path d="M ${spacing} 0 L 0 0 0 ${spacing}" fill="none" stroke="${color}" stroke-width="${size}" opacity="${opacity}" />
        </svg>
      `;
    
    case 'diagonal':
      return `
        <svg width="${spacing}" height="${spacing}" xmlns="http://www.w3.org/2000/svg">
          <path d="M 0,${spacing} L ${spacing},0" stroke="${color}" stroke-width="${size}" opacity="${opacity}" />
        </svg>
      `;
    
    case 'waves':
      return `
        <svg width="${spacing}" height="${spacing}" xmlns="http://www.w3.org/2000/svg">
          <path d="M 0,${spacing / 2} Q ${spacing / 4},${spacing / 4} ${spacing / 2},${spacing / 2} T ${spacing},${spacing / 2}" 
                stroke="${color}" stroke-width="${size}" fill="none" opacity="${opacity}" />
        </svg>
      `;
    
    case 'hexagon':
      const hexSize = size * 2;
      return `
        <svg width="${spacing}" height="${spacing}" xmlns="http://www.w3.org/2000/svg">
          <polygon points="${spacing / 2},${spacing / 2 - hexSize} ${spacing / 2 + hexSize * 0.866},${spacing / 2 - hexSize / 2} ${spacing / 2 + hexSize * 0.866},${spacing / 2 + hexSize / 2} ${spacing / 2},${spacing / 2 + hexSize} ${spacing / 2 - hexSize * 0.866},${spacing / 2 + hexSize / 2} ${spacing / 2 - hexSize * 0.866},${spacing / 2 - hexSize / 2}"
                   fill="none" stroke="${color}" stroke-width="1" opacity="${opacity}" />
        </svg>
      `;
    
    default:
      return '';
  }
};

// Hook to get pattern configuration with theme integration
export const usePatternConfig = (configKey: keyof typeof patternConfigs, role?: string) => {
  const { theme } = useTheme();
  const colors = useColors();
  
  let config: PatternConfig;
  
  // Handle dashboard configurations with role-based colors
  if (configKey === 'dashboard' && role) {
    const roleColors = colors.role?.[role as keyof typeof colors.role];
    config = {
      ...patternConfigs[configKey],
      color: roleColors?.primary || colors.primary?.main || patternConfigs[configKey].color,
    };
  } else {
    config = {
      ...patternConfigs[configKey],
      color: colors.text?.secondary || patternConfigs[configKey].color,
    };
  }
  
  return config;
};

// Generate CSS background image from pattern
export const generatePatternCSS = (config: PatternConfig): string => {
  const svgString = generateSVGPattern(config);
  const encodedSvg = encodeURIComponent(svgString.replace(/\s+/g, ' ').trim());
  return `url("data:image/svg+xml,${encodedSvg}")`;
};

// Hook to get pattern styles for React Native
export const usePatternStyles = (configKey: keyof typeof patternConfigs, role?: string) => {
  const config = usePatternConfig(configKey, role);
  
  return {
    backgroundImage: generatePatternCSS(config),
    backgroundColor: config.backgroundColor || 'transparent',
  };
};

// Utility to create custom pattern
export const createCustomPattern = (
  type: PatternConfig['type'],
  options: Partial<Omit<PatternConfig, 'type'>>
): PatternConfig => {
  const baseConfig = patternConfigs.subtle;
  
  return {
    type,
    size: options.size || baseConfig.size,
    spacing: options.spacing || baseConfig.spacing,
    opacity: options.opacity || baseConfig.opacity,
    color: options.color || baseConfig.color,
    backgroundColor: options.backgroundColor,
  };
};

// Pattern animation utilities
export const getPatternAnimation = (type: 'float' | 'pulse' | 'rotate') => {
  switch (type) {
    case 'float':
      return {
        animationName: 'patternFloat',
        animationDuration: '6s',
        animationTimingFunction: 'ease-in-out',
        animationIterationCount: 'infinite',
        animationDirection: 'alternate',
      };
    
    case 'pulse':
      return {
        animationName: 'patternPulse',
        animationDuration: '4s',
        animationTimingFunction: 'ease-in-out',
        animationIterationCount: 'infinite',
      };
    
    case 'rotate':
      return {
        animationName: 'patternRotate',
        animationDuration: '20s',
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite',
      };
    
    default:
      return {};
  }
};

// Export pattern utilities
export const patternUtils = {
  generateSVGPattern,
  generatePatternCSS,
  createCustomPattern,
  getPatternAnimation,
  configs: patternConfigs,
} as const;
