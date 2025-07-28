/**
 * EmptyState Component
 * Consistent empty state display for all user roles
 */

import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme, useColors } from '../../../context/ThemeContext';
import { Typography } from '../../atoms/Typography';
import { Icon } from '../../atoms/Icon';
import { Button } from '../../atoms/Button';

// EmptyState Props Interface
export interface EmptyStateProps {
  // Content
  title?: string;
  message: string;
  icon?: string;
  
  // Actions
  actionLabel?: string;
  onAction?: () => void;
  
  // Variants
  variant?: 'default' | 'search' | 'notification' | 'data';
  
  // Layout
  fullScreen?: boolean;
  
  // Custom styling
  style?: ViewStyle;
  
  // Accessibility
  accessibilityLabel?: string;
  
  // Test ID
  testID?: string;
}

// EmptyState Component
export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon,
  actionLabel,
  onAction,
  variant = 'default',
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
      case 'search':
        return 'search';
      case 'notification':
        return 'notifications-off';
      case 'data':
        return 'file-tray';
      default:
        return 'inbox';
    }
  };

  // Get container styles
  const getContainerStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.base.xl,
    };

    if (fullScreen) {
      return {
        ...baseStyle,
        flex: 1,
      };
    }

    return {
      ...baseStyle,
      minHeight: 200,
    };
  };

  // Get text styles
  const getTextStyles = (): ViewStyle => ({
    alignItems: 'center',
  });

  return (
    <View
      style={[getContainerStyles(), style]}
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel || `${title || 'Empty'}: ${message}`}
      testID={testID}
    >
      <View style={getTextStyles()} testID={testID ? `${testID}-content` : 'empty-state-content'}>
        <View style={{ marginBottom: theme.spacing.base.md }}>
          <Icon
            name={getIconName() as any}
            size="xl"
            color={colors.text.tertiary}
          />
        </View>
        
        {title && (
          <Typography
            variant="h4"
            color="secondary"
            weight="semibold"
            style={{ marginBottom: theme.spacing.base.sm }}
          >
            {title}
          </Typography>
        )}
        
        <Typography
          variant="body2"
          color="tertiary"
          align="center"
          style={{ 
            lineHeight: 20,
            maxWidth: 280,
            marginBottom: actionLabel ? theme.spacing.base.md : 0,
          }}
        >
          {message}
        </Typography>
        
        {actionLabel && onAction && (
          <Button
            variant="outline"
            size="medium"
            onPress={onAction}
            style={{ marginTop: theme.spacing.base.sm }}
          >
            {actionLabel}
          </Button>
        )}
      </View>
    </View>
  );
};

// Styles are defined inline for better maintainability

// Export default
export default EmptyState;