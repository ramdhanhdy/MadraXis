/**
 * LoadingSpinner Component
 * Consistent loading indicator for all user roles
 */

import React from 'react';
import { ActivityIndicator, View, ViewStyle, TextStyle } from 'react-native';
import { useTheme, useColors } from '../../../context/ThemeContext';
import { Typography } from '../Typography';

// LoadingSpinner Props Interface
export interface LoadingSpinnerProps {
  // Size options
  size?: 'small' | 'large' | number;
  
  // Color options
  color?: string;
  
  // Text
  message?: string;
  
  // Layout
  vertical?: boolean;
  
  // Custom styling
  style?: ViewStyle;
  
  // Accessibility
  accessibilityLabel?: string;
  
  // Test ID
  testID?: string;
}

// LoadingSpinner Component
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color,
  message,
  vertical = true,
  style,
  accessibilityLabel,
  testID,
}) => {
  const { theme } = useTheme();
  const colors = useColors();

  // Get spinner color
  const getSpinnerColor = (): string => {
    return color || colors.primary.main;
  };

  // Get spinner size
  const getSpinnerSize = (): 'small' | 'large' | number => {
    if (typeof size === 'number') {
      return size;
    }
    return size;
  };

  // Get container styles
  const getContainerStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.base.lg,
    };

    if (vertical) {
      return {
        ...baseStyle,
        flexDirection: 'column',
      };
    }

    return {
      ...baseStyle,
      flexDirection: 'row',
    };
  };

  // Get spacing styles
  const getSpacingStyles = (): TextStyle => {
    return {
      marginTop: vertical ? theme.spacing.base.sm : 0,
      marginLeft: vertical ? 0 : theme.spacing.base.sm,
    };
  };

  return (
    <View
      style={[getContainerStyles(), style]}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel || (message ? `Loading: ${message}` : 'Loading')}
      testID={testID || 'loading-spinner'}
    >
      <ActivityIndicator
        size={getSpinnerSize()}
        color={getSpinnerColor()}
        testID={testID ? `${testID}-spinner` : 'loading-spinner-spinner'}
      />
      
      {message && (
        <Typography
          variant="body2"
          color="secondary"
          style={getSpacingStyles()}
          align="center"
          testID={testID ? `${testID}-message` : 'loading-message'}
        >
          {message}
        </Typography>
      )}
    </View>
  );
};



// Named export
export { LoadingSpinner };

// Export default
export default LoadingSpinner;