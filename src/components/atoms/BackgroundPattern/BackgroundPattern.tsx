/**
 * BackgroundPattern Component
 * Islamic geometric background pattern with design token integration
 */

import React, { useState, useMemo } from 'react';
import { View, ViewStyle, StyleSheet, Text } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useTheme, useColors } from '../../../context/ThemeContext';

// Pattern variant types
export type PatternVariant = 'geometric' | 'minimal' | 'dots' | 'waves' | 'none';

// Pattern intensity levels
export type PatternIntensity = 'subtle' | 'light' | 'medium' | 'strong';

// BackgroundPattern Props Interface
export interface BackgroundPatternProps {
  // Pattern configuration
  variant?: PatternVariant;
  intensity?: PatternIntensity;
  
  // Color customization
  color?: string;
  opacity?: number;
  
  // Layout
  width?: number | string;
  height?: number | string;
  
  // Custom styling
  style?: ViewStyle;
  
  // Accessibility
  accessibilityLabel?: string;
  
  // Test ID
  testID?: string;
}

// Error boundary component for SVG rendering
class SvgErrorBoundary extends React.Component<{ 
  children: React.ReactNode; 
  fallback?: React.ReactNode 
}, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.warn('SVG rendering error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <>{this.props.fallback}</>;
    }

    return <>{this.props.children}</>;
  }
}

// BackgroundPattern Component - Memoized for performance
export const BackgroundPattern: React.FC<BackgroundPatternProps> = React.memo(({
  variant = 'geometric',
  intensity = 'subtle',
  color,
  opacity,
  width = '100%',
  height = '100%',
  style,
  accessibilityLabel,
  testID,
}) => {
  const { theme } = useTheme();
  const colors = useColors();

  // Get pattern color
  const getPatternColor = (): string => {
    if (color) return color;
    return colors.primary.main;
  };

  // Get pattern opacity based on intensity
  const getPatternOpacity = (): number => {
    if (opacity !== undefined) return opacity;
    
    switch (intensity) {
      case 'subtle':
        return 0.03;
      case 'light':
        return 0.05;
      case 'medium':
        return 0.08;
      case 'strong':
        return 0.12;
      default:
        return 0.05;
    }
  };

  // Generate geometric pattern SVG
  const generateGeometricPattern = (): string => {
    const patternColor = getPatternColor();
    const patternOpacity = getPatternOpacity();
    
    return `
      <svg width="100%" height="100%" viewBox="0 0 375 812" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="375" height="812" fill="none"/>
        
        <!-- Islamic Geometric Pattern -->
        <g opacity="${patternOpacity}">
          <!-- Repeating Pattern -->
          <g fill="${patternColor}">
            <!-- Row 1 -->
            <path d="M0 0 L50 0 L25 43.3 Z" />
            <path d="M50 0 L100 0 L75 43.3 Z" />
            <path d="M100 0 L150 0 L125 43.3 Z" />
            <path d="M150 0 L200 0 L175 43.3 Z" />
            <path d="M200 0 L250 0 L225 43.3 Z" />
            <path d="M250 0 L300 0 L275 43.3 Z" />
            <path d="M300 0 L350 0 L325 43.3 Z" />
            <path d="M350 0 L400 0 L375 43.3 Z" />
            
            <!-- Row 2 -->
            <path d="M25 43.3 L75 43.3 L50 86.6 Z" />
            <path d="M75 43.3 L125 43.3 L100 86.6 Z" />
            <path d="M125 43.3 L175 43.3 L150 86.6 Z" />
            <path d="M175 43.3 L225 43.3 L200 86.6 Z" />
            <path d="M225 43.3 L275 43.3 L250 86.6 Z" />
            <path d="M275 43.3 L325 43.3 L300 86.6 Z" />
            <path d="M325 43.3 L375 43.3 L350 86.6 Z" />
            
            <!-- Row 3 -->
            <path d="M0 86.6 L50 86.6 L25 129.9 Z" />
            <path d="M50 86.6 L100 86.6 L75 129.9 Z" />
            <path d="M100 86.6 L150 86.6 L125 129.9 Z" />
            <path d="M150 86.6 L200 86.6 L175 129.9 Z" />
            <path d="M200 86.6 L250 86.6 L225 129.9 Z" />
            <path d="M250 86.6 L300 86.6 L275 129.9 Z" />
            <path d="M300 86.6 L350 86.6 L325 129.9 Z" />
            <path d="M350 86.6 L400 86.6 L375 129.9 Z" />
            
            <!-- Row 4 -->
            <path d="M25 129.9 L75 129.9 L50 173.2 Z" />
            <path d="M75 129.9 L125 129.9 L100 173.2 Z" />
            <path d="M125 129.9 L175 129.9 L150 173.2 Z" />
            <path d="M175 129.9 L225 129.9 L200 173.2 Z" />
            <path d="M225 129.9 L275 129.9 L250 173.2 Z" />
            <path d="M275 129.9 L325 129.9 L300 173.2 Z" />
            <path d="M325 129.9 L375 129.9 L350 173.2 Z" />
            
            <!-- Row 5 -->
            <path d="M0 173.2 L50 173.2 L25 216.5 Z" />
            <path d="M50 173.2 L100 173.2 L75 216.5 Z" />
            <path d="M100 173.2 L150 173.2 L125 216.5 Z" />
            <path d="M150 173.2 L200 173.2 L175 216.5 Z" />
            <path d="M200 173.2 L250 173.2 L225 216.5 Z" />
            <path d="M250 173.2 L300 173.2 L275 216.5 Z" />
            <path d="M300 173.2 L350 173.2 L325 216.5 Z" />
            <path d="M350 173.2 L400 173.2 L375 216.5 Z" />
            
            <!-- Continue pattern for more rows -->
            <path d="M25 216.5 L75 216.5 L50 259.8 Z" />
            <path d="M75 216.5 L125 216.5 L100 259.8 Z" />
            <path d="M125 216.5 L175 216.5 L150 259.8 Z" />
            <path d="M175 216.5 L225 216.5 L200 259.8 Z" />
            <path d="M225 216.5 L275 216.5 L250 259.8 Z" />
            <path d="M275 216.5 L325 216.5 L300 259.8 Z" />
            <path d="M325 216.5 L375 216.5 L350 259.8 Z" />
            
            <!-- Star patterns scattered throughout -->
            <path d="M100 300 L110 320 L130 320 L115 335 L120 355 L100 345 L80 355 L85 335 L70 320 L90 320 Z" />
            <path d="M250 400 L260 420 L280 420 L265 435 L270 455 L250 445 L230 455 L235 435 L220 420 L240 420 Z" />
            <path d="M150 500 L160 520 L180 520 L165 535 L170 555 L150 545 L130 555 L135 535 L120 520 L140 520 Z" />
            <path d="M300 600 L310 620 L330 620 L315 635 L320 655 L300 645 L280 655 L285 635 L270 620 L290 620 Z" />
            <path d="M200 700 L210 720 L230 720 L215 735 L220 755 L200 745 L180 755 L185 735 L170 720 L190 720 Z" />
          </g>
        </g>
        
        <!-- Decorative circles with varying opacity -->
        <circle cx="350" cy="150" r="100" fill="${patternColor}" opacity="${patternOpacity * 3}"/>
        <circle cx="50" cy="400" r="150" fill="${patternColor}" opacity="${patternOpacity * 2}"/>
        <circle cx="300" cy="700" r="120" fill="${patternColor}" opacity="${patternOpacity * 2.5}"/>
      </svg>
    `;
  };

  // Generate minimal pattern SVG
  const generateMinimalPattern = (): string => {
    const patternColor = getPatternColor();
    const patternOpacity = getPatternOpacity();
    
    return `
      <svg width="100%" height="100%" viewBox="0 0 375 812" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="375" height="812" fill="none"/>
        
        <!-- Minimal Pattern -->
        <g opacity="${patternOpacity}">
          <g fill="${patternColor}">
            <!-- Simple geometric shapes -->
            <circle cx="100" cy="100" r="2" />
            <circle cx="200" cy="150" r="2" />
            <circle cx="300" cy="200" r="2" />
            <circle cx="150" cy="300" r="2" />
            <circle cx="250" cy="350" r="2" />
            <circle cx="50" cy="400" r="2" />
            <circle cx="350" cy="450" r="2" />
            <circle cx="175" cy="550" r="2" />
            <circle cx="275" cy="600" r="2" />
            <circle cx="125" cy="700" r="2" />
            
            <!-- Subtle lines -->
            <line x1="0" y1="200" x2="375" y2="200" stroke="${patternColor}" stroke-width="0.5" />
            <line x1="0" y1="400" x2="375" y2="400" stroke="${patternColor}" stroke-width="0.5" />
            <line x1="0" y1="600" x2="375" y2="600" stroke="${patternColor}" stroke-width="0.5" />
          </g>
        </g>
      </svg>
    `;
  };

  // Generate dots pattern SVG
  const generateDotsPattern = (): string => {
    const patternColor = getPatternColor();
    const patternOpacity = getPatternOpacity();
    
    return `
      <svg width="100%" height="100%" viewBox="0 0 375 812" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="375" height="812" fill="none"/>
        
        <!-- Dots Pattern -->
        <g opacity="${patternOpacity}">
          <g fill="${patternColor}">
            ${Array.from({ length: 15 }, (_, row) =>
              Array.from({ length: 8 }, (_, col) => 
                `<circle cx="${col * 50 + 25}" cy="${row * 50 + 25}" r="1.5" />`
              ).join('')
            ).join('')}
          </g>
        </g>
      </svg>
    `;
  };

  // Generate waves pattern SVG
  const generateWavesPattern = (): string => {
    const patternColor = getPatternColor();
    const patternOpacity = getPatternOpacity();
    
    return `
      <svg width="100%" height="100%" viewBox="0 0 375 812" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="375" height="812" fill="none"/>
        
        <!-- Waves Pattern -->
        <g opacity="${patternOpacity}">
          <g fill="none" stroke="${patternColor}" stroke-width="1">
            <path d="M0 100 Q93.75 50 187.5 100 T375 100" />
            <path d="M0 200 Q93.75 150 187.5 200 T375 200" />
            <path d="M0 300 Q93.75 250 187.5 300 T375 300" />
            <path d="M0 400 Q93.75 350 187.5 400 T375 400" />
            <path d="M0 500 Q93.75 450 187.5 500 T375 500" />
            <path d="M0 600 Q93.75 550 187.5 600 T375 600" />
            <path d="M0 700 Q93.75 650 187.5 700 T375 700" />
          </g>
        </g>
      </svg>
    `;
  };


  // Don't render anything for 'none' variant
  if (variant === 'none') {
    return null;
  }

  // Memoize the pattern SVG generation
  const patternSvg = useMemo(() => {
    try {
      switch (variant) {
        case 'geometric':
          return generateGeometricPattern();
        case 'minimal':
          return generateMinimalPattern();
        case 'dots':
          return generateDotsPattern();
        case 'waves':
          return generateWavesPattern();
        case 'none':
          return '';
        default:
          return generateGeometricPattern();
      }
    } catch (error) {
      console.warn('Failed to generate pattern SVG:', error);
      return '';
    }
  }, [variant, actualColor, actualOpacity]);

  if (variant === 'none' || !patternSvg) {
    return null;
  }

  return (
    <View
      style={[
        {
          width,
          height,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
        style,
      ]}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      pointerEvents="none"
    >
      <SvgErrorBoundary fallback={null}>
        <SvgXml xml={patternSvg} width="100%" height="100%" />
      </SvgErrorBoundary>
    </View>
  );
});

// Internal styles
const styles = StyleSheet.create({
  // Add any internal styles if needed
});

// Export default
export default BackgroundPattern;