/**
 * ProgressBar Component
 * Consistent progress indicator with visual patterns and color coding
 */

import React from 'react';
import {
  View,
  ViewStyle,
  StyleSheet,
  Animated,
} from 'react-native';
import { useTheme, useColors } from '../../../context/ThemeContext';
import { Typography } from '../../atoms/Typography';

// ProgressBar Props Interface
export interface ProgressBarProps {
  // Progress value (0-100)
  value: number;
  
  // Visual options
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  
  // Display options
  showLabel?: boolean;
  showPercentage?: boolean;
  label?: string;
  
  // Styling
  backgroundColor?: string;
  progressColor?: string;
  
  // Animation
  animated?: boolean;
  animationDuration?: number;
  
  // Custom styling
  style?: ViewStyle;
  
  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
  
  // Test ID
  testID?: string;
}

// ProgressBar Component
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  variant = 'default',
  size = 'medium',
  showLabel = false,
  showPercentage = false,
  label,
  backgroundColor,
  progressColor,
  animated = true,
  animationDuration = 300,
  style,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const { theme } = useTheme();
  const colors = useColors();
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  // Clamp value between 0 and 100
  const clampedValue = Math.max(0, Math.min(100, value));

  // Animate progress bar when value changes
  React.useEffect(() => {
    if (animated) {
      Animated.timing(animatedValue, {
        toValue: clampedValue,
        duration: animationDuration,
        useNativeDriver: false,
      }).start();
    } else {
      animatedValue.setValue(clampedValue);
    }
  }, [clampedValue, animated, animationDuration, animatedValue]);

  // Get progress bar height based on size
  const getProgressBarHeight = (): number => {
    const heights = {
      small: 4,
      medium: 8,
      large: 12,
    };
    return heights[size];
  };

  // Get progress color based on variant
  const getProgressColor = (): string => {
    if (progressColor) return progressColor;
    
    const variantColors = {
      default: colors.primary.main,
      success: colors.success.main,
      warning: colors.warning.main,
      error: colors.error.main,
    };
    
    return variantColors[variant];
  };

  // Get background color
  const getBackgroundColor = (): string => {
    if (backgroundColor) return backgroundColor;
    return colors.surface.secondary;
  };

  // Get container styles
  const getContainerStyles = (): ViewStyle => {
    return {
      width: '100%',
    };
  };

  // Get progress bar container styles
  const getProgressBarContainerStyles = (): ViewStyle => {
    const height = getProgressBarHeight();
    
    return {
      height,
      backgroundColor: getBackgroundColor(),
      borderRadius: height / 2,
      overflow: 'hidden',
    };
  };

  // Get progress bar fill styles
  const getProgressBarFillStyles = (): ViewStyle => {
    const height = getProgressBarHeight();
    
    return {
      height: '100%',
      backgroundColor: getProgressColor(),
      borderRadius: height / 2,
    };
  };

  // Get label styles
  const getLabelStyles = (): ViewStyle => {
    return {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.base.xs,
    };
  };

  // Get accessibility label
  const getAccessibilityLabel = (): string => {
    if (accessibilityLabel) return accessibilityLabel;
    
    const baseLabel = label || 'Progress';
    return `${baseLabel}: ${clampedValue} percent`;
  };

  // Render label section
  const renderLabel = () => {
    if (!showLabel && !showPercentage) return null;
    
    return (
      <View style={getLabelStyles()}>
        {showLabel && label && (
          <Typography variant="body2" color="primary">
            {label}
          </Typography>
        )}
        
        {showPercentage && (
          <Typography variant="body2" color="secondary">
            {Math.round(clampedValue)}%
          </Typography>
        )}
      </View>
    );
  };

  return (
    <View style={[getContainerStyles(), style]} testID={testID}>
      {renderLabel()}
      
      <View
        style={getProgressBarContainerStyles()}
        accessibilityRole="progressbar"
        accessibilityLabel={getAccessibilityLabel()}
        accessibilityHint={accessibilityHint}
        accessibilityValue={{
          min: 0,
          max: 100,
          now: clampedValue,
        }}
      >
        <Animated.View
          style={[
            getProgressBarFillStyles(),
            {
              width: animatedValue.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
                extrapolate: 'clamp',
              }),
            },
          ]}
        />
      </View>
    </View>
  );
};

// Export default
export default ProgressBar;