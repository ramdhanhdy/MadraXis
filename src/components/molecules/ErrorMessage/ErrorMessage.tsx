/**
 * ErrorMessage Component
 * Consistent error display for all user roles
 */

import React from 'react';
import { View, ViewStyle, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme, useColors } from '../../../context/ThemeContext';
import { Typography } from '../../atoms/Typography';
import { Icon } from '../../atoms/Icon';
import { Button } from '../../atoms/Button';

// ErrorMessage Props Interface
export interface ErrorMessageProps {
  // Error content
  title?: string;
  message: string;
  icon?: string;
  
  // Actions
  onRetry?: () => void;
  onDismiss?: () => void;
  retryLabel?: string;
  
  // Variants
  variant?: 'error' | 'warning' | 'info';
  
  // Layout
  fullScreen?: boolean;
  
  // Custom styling
  style?: ViewStyle;
  
  // Accessibility
  accessibilityLabel?: string;
  
  // Test ID
  testID?: string;
}

// ErrorMessage Component
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  message,
  icon,
  onRetry,
  onDismiss,
  retryLabel = 'Try Again',
  variant = 'error',
  fullScreen = false,
  style,
  accessibilityLabel,
  testID,
}) => {
  const { theme } = useTheme();
  const colors = useColors();

  // Get icon name based on variant
  const getIconName = (): string => {
    if (icon) return icon;
    
    switch (variant) {
      case 'error':
        return 'close-circle';
      case 'warning':
        return 'warning';
      case 'info':
        return 'information-circle';
      default:
        return 'close-circle';
    }
  };

  // Get colors based on variant
  const getVariantColors = () => {
    switch (variant) {
      case 'error':
        return {
          iconColor: colors.error.main,
          titleColor: colors.error.main,
          backgroundColor: colors.error.light,
        };
      case 'warning':
        return {
          iconColor: colors.warning.main,
          titleColor: colors.warning.main,
          backgroundColor: colors.warning.light,
        };
      case 'info':
        return {
          iconColor: colors.primary.main,
          titleColor: colors.primary.main,
          backgroundColor: colors.primary.light,
        };
      default:
        return {
          iconColor: colors.error.main,
          titleColor: colors.error.main,
          backgroundColor: colors.error.light,
        };
    }
  };

  const variantColors = getVariantColors();

  // Get container styles
  const getContainerStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: variantColors.backgroundColor,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.base.lg,
      borderWidth: 1,
      borderColor: variantColors.iconColor,
    };

    if (fullScreen) {
      return {
        ...baseStyle,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        margin: theme.spacing.base.lg,
      };
    }

    return baseStyle;
  };

  // Get action container styles
  const getActionStyles = (): ViewStyle => {
    return {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.base.md,
      gap: theme.spacing.base.sm,
    };
  };

  return (
    <View
      style={[getContainerStyles(), style]}
      accessibilityRole="alert"
      accessibilityLabel={accessibilityLabel || `Error: ${title || message}`}
      testID={testID}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }} testID={testID ? `${testID}-content` : 'error-content'}>
        <Icon
          name={getIconName() as keyof typeof import('@expo/vector-icons/Ionicons').Ionicons.glyphMap}
          size="lg"
          color={variantColors.iconColor}
          style={{ marginRight: theme.spacing.base.md, marginTop: 2 }}
        />
        
        <View style={{ flex: 1 }}>
          {title && (
            <Typography
              variant="h4"
              color={variantColors.titleColor}
              weight="semibold"
              style={{ marginBottom: theme.spacing.base.xs }}
            >
              {title}
            </Typography>
          )}
          
          <Typography
            variant="body2"
            color="secondary"
            style={{ lineHeight: 20 }}
          >
            {message}
          </Typography>
        </View>
        
        {onDismiss && (
          <TouchableOpacity
            onPress={onDismiss}
            style={{ marginLeft: theme.spacing.base.sm }}
            accessibilityRole="button"
            accessibilityLabel="Dismiss error"
          >
            <Icon
              name="close"
              size="sm"
              color={colors.text.secondary}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {(onRetry || onDismiss) && (
        <View style={getActionStyles()}>
          {onDismiss && (
            <Button
              variant="outline"
              size="small"
              onPress={onDismiss}
              style={{ flex: 1 }}
            >
              Close
            </Button>
          )}
          
          {onRetry && (
            <Button
              variant="solid"
              size="small"
              onPress={onRetry}
              style={{ flex: 1 }}
            >
              {retryLabel}
            </Button>
          )}
        </View>
      )}
    </View>
  );
};

// Internal styles
const styles = StyleSheet.create({
  // Add any internal styles if needed
});

// Export default
export default ErrorMessage;