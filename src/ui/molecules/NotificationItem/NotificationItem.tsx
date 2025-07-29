/**
 * NotificationItem Component
 * Consistent notification display with status indicators and actions
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  ViewStyle,
  StyleSheet,
  TouchableOpacityProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useColors } from '../../../context/ThemeContext';
import { Typography } from '../../atoms/Typography';
import { Icon } from '../../atoms/Icon';
import { Button } from '../../atoms/Button';

// Notification types
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

// NotificationItem Props Interface
export interface NotificationItemProps extends Omit<TouchableOpacityProps, 'style'> {
  // Content
  title: string;
  message: string;
  
  // Notification type
  type?: NotificationType;
  
  // Timing
  timestamp?: string;
  
  // Status
  read?: boolean;
  
  // Icon
  icon?: keyof typeof Ionicons.glyphMap;
  
  // Actions
  onPress?: () => void;
  onDismiss?: () => void;
  onAction?: () => void;
  actionLabel?: string;
  
  // Visual options
  showDismiss?: boolean;
  compact?: boolean;
  
  // Custom styling
  style?: ViewStyle;
  
  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
  
  // Test ID
  testID?: string;
}

// NotificationItem Component
export const NotificationItem: React.FC<NotificationItemProps> = ({
  title,
  message,
  type = 'info',
  timestamp,
  read = false,
  icon,
  onPress,
  onDismiss,
  onAction,
  actionLabel,
  showDismiss = true,
  compact = false,
  style,
  accessibilityLabel,
  accessibilityHint,
  testID,
  ...props
}) => {
  const { theme } = useTheme();
  const colors = useColors();

  // Get notification icon based on type
  const getNotificationIcon = (): keyof typeof Ionicons.glyphMap => {
    if (icon) return icon;
    
    const typeIcons = {
      info: 'information-circle' as const,
      success: 'checkmark-circle' as const,
      warning: 'warning' as const,
      error: 'alert-circle' as const,
    };
    
    return typeIcons[type];
  };

  // Get notification color based on type
  const getNotificationColor = (): string => {
    const typeColors = {
      info: colors.primary.main,
      success: colors.success.main,
      warning: colors.warning.main,
      error: colors.error.main,
    };
    
    return typeColors[type];
  };

  // Get container styles
  const getContainerStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      padding: compact ? theme.spacing.base.sm : theme.spacing.base.md,
      backgroundColor: read ? colors.surface.primary : colors.surface.secondary,
      borderLeftWidth: 4,
      borderLeftColor: getNotificationColor(),
      borderRadius: theme.borderRadius.md,
      ...theme.shadows.card,
    };

    return {
      ...baseStyle,
      opacity: read ? 0.8 : 1,
    };
  };

  // Get content styles
  const getContentStyles = (): ViewStyle => {
    return {
      flex: 1,
      marginLeft: theme.spacing.base.sm,
      marginRight: showDismiss || onAction ? theme.spacing.base.sm : 0,
    };
  };

  // Get header styles
  const getHeaderStyles = (): ViewStyle => {
    return {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: compact ? 2 : 4,
    };
  };

  // Get actions container styles
  const getActionsStyles = (): ViewStyle => {
    return {
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: theme.spacing.base.xs,
    };
  };

  // Get accessibility label
  const getAccessibilityLabel = (): string => {
    if (accessibilityLabel) return accessibilityLabel;
    
    const statusText = read ? 'read' : 'unread';
    const timeText = timestamp ? `, ${timestamp}` : '';
    return `${type} notification: ${title}, ${message}${timeText}, ${statusText}`;
  };

  // Render notification content
  const renderContent = () => {
    return (
      <>
        <Icon
          name={getNotificationIcon()}
          size={compact ? 'md' : 'lg'}
          color={getNotificationColor()}
        />
        
        <View style={getContentStyles()}>
          <View style={getHeaderStyles()}>
            <Typography
              variant={compact ? 'body2' : 'body1'}
              weight="medium"
              color={read ? 'secondary' : 'primary'}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {title}
            </Typography>
            
            {timestamp && (
              <Typography
                variant="caption"
                color="tertiary"
                style={{ marginLeft: theme.spacing.base.xs }}
              >
                {timestamp}
              </Typography>
            )}
          </View>
          
          <Typography
            variant={compact ? 'caption' : 'body2'}
            color={read ? 'tertiary' : 'secondary'}
            numberOfLines={compact ? 2 : 3}
            ellipsizeMode="tail"
            style={{ marginBottom: onAction ? theme.spacing.base.xs : 0 }}
          >
            {message}
          </Typography>
          
          {onAction && actionLabel && (
            <Button
              variant="outline"
              size="small"
              onPress={onAction}
              style={{ alignSelf: 'flex-start', marginTop: theme.spacing.base.xs }}
            >
              {actionLabel}
            </Button>
          )}
        </View>
        
        {(showDismiss || onAction) && (
          <View style={getActionsStyles()}>
            {showDismiss && onDismiss && (
              <TouchableOpacity
                onPress={onDismiss}
                style={styles.dismissButton}
                accessibilityRole="button"
                accessibilityLabel="Dismiss notification"
                accessibilityHint="Removes this notification"
              >
                <Icon
                  name="close"
                  size="sm"
                  color="tertiary"
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      </>
    );
  };

  // If interactive, wrap in TouchableOpacity
  if (onPress) {
    return (
      <TouchableOpacity
        style={[getContainerStyles(), style]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={getAccessibilityLabel()}
        accessibilityHint={accessibilityHint}
        testID={testID}
        activeOpacity={0.7}
        {...props}
      >
        {renderContent()}
      </TouchableOpacity>
    );
  }

  // Static notification item
  return (
    <View
      style={[getContainerStyles(), style]}
      accessibilityRole="text"
      accessibilityLabel={getAccessibilityLabel()}
      testID={testID}
    >
      {renderContent()}
    </View>
  );
};

// Internal styles
const styles = StyleSheet.create({
  dismissButton: {
    padding: 4,
    borderRadius: 12,
  },
});

// Export default
export default NotificationItem;