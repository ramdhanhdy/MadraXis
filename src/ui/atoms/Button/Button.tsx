/**
 * Button Component
 * Consistent button implementation with all variants, sizes, and states
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@design-system';
import { ButtonComponentTheme } from '@design-system/core/types';

// Button Props Interface
export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  // Content
  children?: React.ReactNode;
  
  // Variants
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  
  // States
  loading?: boolean;
  disabled?: boolean;
  
  // Icon support
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  iconOnly?: boolean;
  
  // Layout
  fullWidth?: boolean;
  
  // Custom styling
  style?: ViewStyle;
  textStyle?: TextStyle;
  
  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

// Button Component
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  iconOnly = false,
  fullWidth = false,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
  onPress,
  ...props
}) => {
  const { theme } = useTheme();
  const buttonTheme: ButtonComponentTheme = theme.componentThemes.button;
  const colors = theme.colors;

  // Get button styles based on variant, size, and state using design system
  const getButtonStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: buttonTheme.borderRadius,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      minHeight: buttonTheme.minHeight[size],
      paddingHorizontal: buttonTheme.padding[size].horizontal,
      paddingVertical: buttonTheme.padding[size].vertical,
    };

    // Variant-specific styles using design system colors
    const variantStyles = {
      primary: {
        backgroundColor: disabled ? colors.interactive?.disabled || colors.neutral?.[300] : colors.primary.main,
        ...theme.shadows?.button,
      },
      secondary: {
        backgroundColor: disabled ? colors.interactive?.disabled || colors.neutral?.[300] : colors.secondary.main,
        ...theme.shadows?.button,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: disabled ? colors.interactive?.disabled || colors.neutral?.[300] : colors.primary.main,
      },
      ghost: {
        backgroundColor: 'transparent',
      },
      danger: {
        backgroundColor: disabled ? colors.interactive?.disabled || colors.neutral?.[300] : colors.error?.main || colors.red?.[500],
        ...theme.shadows?.button,
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...(fullWidth && { width: '100%' }),
      ...(iconOnly && {
        paddingHorizontal: buttonTheme.padding[size].vertical,
        aspectRatio: 1,
      }),
      opacity: disabled ? 0.6 : 1,
    };
  };

  // Get text styles based on variant, size, and state using design system
  const getTextStyles = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontWeight: buttonTheme.typography[size]?.fontWeight || '600',
      textAlign: 'center',
      fontSize: buttonTheme.typography[size]?.fontSize || theme.typography?.fontSize?.base || 16,
      lineHeight: buttonTheme.typography[size]?.lineHeight || theme.typography?.fontSize?.base * (theme.typography?.lineHeight?.tight || 1.2),
    };

    // Variant-specific text colors using design system colors
    const variantTextColors = {
      primary: disabled ? colors.text?.disabled || colors.neutral?.[400] : colors.primary?.contrast || colors.white,
      secondary: disabled ? colors.text?.disabled || colors.neutral?.[400] : colors.secondary?.contrast || colors.white,
      outline: disabled ? colors.text?.disabled || colors.neutral?.[400] : colors.primary.main,
      ghost: disabled ? colors.text?.disabled || colors.neutral?.[400] : colors.primary.main,
      danger: disabled ? colors.text?.disabled || colors.neutral?.[400] : colors.error?.contrast || colors.white,
    };

    return {
      ...baseTextStyle,
      color: variantTextColors[variant],
    };
  };

  // Get icon size based on button size
  const getIconSize = (): number => {
    const iconSizes = {
      small: 16,
      medium: 20,
      large: 24,
    };
    return iconSizes[size];
  };

  // Get icon color based on variant and state
  const getIconColor = (): string => {
    const variantIconColors = {
      primary: disabled ? colors.text.disabled : colors.primary.contrast,
      secondary: disabled ? colors.text.disabled : colors.secondary.contrast,
      outline: disabled ? colors.text.disabled : colors.primary.main,
      ghost: disabled ? colors.text.disabled : colors.primary.main,
      danger: disabled ? colors.text.disabled : colors.error.contrast,
    };
    return variantIconColors[variant];
  };

  // Render icon if provided
  const renderIcon = () => {
    if (!icon) return null;

    return (
      <Ionicons
        name={icon}
        size={getIconSize()}
        color={getIconColor()}
        style={[
          !iconOnly && iconPosition === 'left' && { marginRight: 8 },
          !iconOnly && iconPosition === 'right' && { marginLeft: 8 },
        ]}
      />
    );
  };

  // Render loading indicator
  const renderLoadingIndicator = () => {
    if (!loading) return null;

    return (
      <ActivityIndicator
        size="small"
        color={getIconColor()}
        style={[
          !iconOnly && { marginRight: 8 },
        ]}
      />
    );
  };

  // Render button content
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.contentContainer}>
          {renderLoadingIndicator()}
          {!iconOnly && (
            <Text style={[getTextStyles(), textStyle]}>
              {typeof children === 'string' ? children : 'Loading...'}
            </Text>
          )}
        </View>
      );
    }

    if (iconOnly) {
      return renderIcon();
    }

    return (
      <View style={styles.contentContainer}>
        {iconPosition === 'left' && renderIcon()}
        <Text style={[getTextStyles(), textStyle]}>
          {children}
        </Text>
        {iconPosition === 'right' && renderIcon()}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[getButtonStyles(), style]}
      onPress={disabled || loading ? undefined : onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || (typeof children === 'string' ? children : undefined)}
      accessibilityHint={accessibilityHint}
      accessibilityState={{
        disabled: disabled || loading,
        busy: loading,
      }}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

// Internal styles
const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// Export default
export default Button;
