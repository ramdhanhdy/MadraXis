/**
 * Icon Component
 * Consistent icon wrapper with sizing, colors, and accessibility
 */

import React from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useColors } from '../../../context/ThemeContext';

// Icon Props Interface
export interface IconProps {
  // Icon configuration
  name: keyof typeof Ionicons.glyphMap;
  
  // Size options
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;
  
  // Color options
  color?: 'primary' | 'secondary' | 'tertiary' | 'disabled' | 'inverse' | 'success' | 'warning' | 'error' | string;
  
  // Interactive
  onPress?: () => void;
  disabled?: boolean;
  
  // Container styling
  containerStyle?: ViewStyle;
  
  // Background circle
  background?: boolean;
  backgroundColor?: string;
  
  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: 'button' | 'image' | 'none';
  
  // Test ID
  testID?: string;
}

// Icon Component
export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  color = 'primary',
  onPress,
  disabled = false,
  containerStyle,
  background = false,
  backgroundColor,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
  testID,
}) => {
  const { theme } = useTheme();
  const colors = useColors();

  // Get icon size in pixels
  const getIconSize = (): number => {
    if (typeof size === 'number') {
      return size;
    }

    const sizeMap = {
      xs: 12,
      sm: 16,
      md: 20,
      lg: 24,
      xl: 32,
      '2xl': 40,
    };

    return sizeMap[size];
  };

  // Get icon color
  const getIconColor = (): string => {
    // If color is a custom hex/rgb value, use it directly
    if (color.startsWith('#') || color.startsWith('rgb') || color.startsWith('hsl')) {
      return disabled ? colors.text.disabled : color;
    }

    // Map semantic color names to theme colors
    const colorMap = {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
      tertiary: colors.text.tertiary,
      disabled: colors.text.disabled,
      inverse: colors.text.inverse,
      success: colors.success.main,
      warning: colors.warning.main,
      error: colors.error.main,
    };

    const mappedColor = colorMap[color as keyof typeof colorMap] || colors.text.primary;
    return disabled ? colors.text.disabled : mappedColor;
  };

  // Get container styles for background
  const getContainerStyles = (): ViewStyle => {
    if (!background && !onPress) return {};

    const iconSize = getIconSize();
    const containerSize = iconSize + (theme.spacing.base.sm * 2); // Add padding

    const baseStyle: ViewStyle = {
      width: containerSize,
      height: containerSize,
      borderRadius: containerSize / 2,
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 44, // Minimum touch target
      minHeight: 44,
    };

    if (background) {
      baseStyle.backgroundColor = backgroundColor || colors.surface.secondary;
    }

    if (onPress) {
      baseStyle.opacity = disabled ? 0.6 : 1;
    }

    return baseStyle;
  };

  // Get accessibility role
  const getAccessibilityRole = () => {
    if (accessibilityRole) return accessibilityRole;
    if (onPress) return 'button';
    return 'image';
  };

  // Render icon
  const renderIcon = () => (
    <Ionicons
      name={name}
      size={getIconSize()}
      color={getIconColor()}
    />
  );

  // If interactive, wrap in TouchableOpacity
  if (onPress) {
    return (
      <TouchableOpacity
        style={[getContainerStyles(), containerStyle]}
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
        accessibilityRole={getAccessibilityRole()}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled }}
        testID={testID}
      >
        {renderIcon()}
      </TouchableOpacity>
    );
  }

  // If has background, wrap in View
  if (background) {
    return (
      <View
        style={[getContainerStyles(), containerStyle]}
        accessibilityRole={getAccessibilityRole()}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        testID={testID}
      >
        {renderIcon()}
      </View>
    );
  }

  // Simple icon without container
  return (
    <View
      style={containerStyle}
      accessibilityRole={getAccessibilityRole()}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      testID={testID}
    >
      {renderIcon()}
    </View>
  );
};

// Export default
export default Icon;