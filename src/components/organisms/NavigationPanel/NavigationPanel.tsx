/**
 * NavigationPanel Component
 * Consistent notification panel with styling and interactions for different notification types
 */

import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ViewStyle,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useColors } from '../../../context/ThemeContext';
import { Typography } from '../../atoms/Typography';
import { Icon } from '../../atoms/Icon';
import { Button } from '../../atoms/Button';
import { NotificationItem, NotificationType } from '../../molecules/NotificationItem';

// Navigation item interface
export interface NavigationItem {
  id: string;
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  badge?: number;
  badgeColor?: string;
  onPress: () => void;
  disabled?: boolean;
  testID?: string;
}

// Notification for the panel
export interface PanelNotification {
  id: string;
  title: string;
  message: string;
  type?: NotificationType;
  timestamp?: string;
  read?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  onDismiss?: () => void;
  onAction?: () => void;
  actionLabel?: string;
}

// NavigationPanel Props Interface
export interface NavigationPanelProps {
  // Panel type
  type?: 'notifications' | 'navigation' | 'mixed';

  // Content
  title?: string;
  subtitle?: string;

  // Navigation items
  navigationItems?: NavigationItem[];

  // Notifications
  notifications?: PanelNotification[];

  // Actions
  onClearAll?: () => void;
  onMarkAllRead?: () => void;
  onRefresh?: () => void;

  // Visual options
  variant?: 'default' | 'elevated' | 'transparent';
  showHeader?: boolean;
  showActions?: boolean;

  // Layout
  maxHeight?: number;
  scrollable?: boolean;

  // Empty state
  emptyTitle?: string;
  emptyMessage?: string;
  emptyIcon?: keyof typeof Ionicons.glyphMap;

  // Loading state
  loading?: boolean;
  refreshing?: boolean;

  // Custom styling
  style?: ViewStyle;
  headerStyle?: ViewStyle;
  contentStyle?: ViewStyle;

  // Accessibility
  accessibilityLabel?: string;

  // Test ID
  testID?: string;
}

// NavigationPanel Component
export const NavigationPanel: React.FC<NavigationPanelProps> = ({
  type = 'notifications',
  title,
  subtitle,
  navigationItems = [],
  notifications = [],
  onClearAll,
  onMarkAllRead,
  onRefresh,
  variant = 'default',
  showHeader = true,
  showActions = true,
  maxHeight,
  scrollable = true,
  emptyTitle = 'No items',
  emptyMessage = 'There are no items to display',
  emptyIcon = 'inbox',
  loading = false,
  refreshing = false,
  style,
  headerStyle,
  contentStyle,
  accessibilityLabel,
  testID,
}) => {
  const { theme } = useTheme();
  const colors = useColors();
  const screenHeight = Dimensions.get('window').height;

  // Animation for loading state
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  // Handle loading animation
  React.useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0.5,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      fadeAnim.setValue(1);
    }
  }, [loading, fadeAnim]);

  // Get container styles
  const getContainerStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: colors.surface.primary,
      borderRadius: theme.borderRadius.lg,
      maxHeight: maxHeight || screenHeight * 0.7,
      overflow: 'hidden',
    };

    // Add shadow for elevated variant
    if (variant === 'elevated') {
      return {
        ...baseStyle,
        ...theme.shadows.card,
      };
    }

    if (variant === 'transparent') {
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
      };
    }

    return baseStyle;
  };

  // Get header styles
  const getHeaderStyles = (): ViewStyle => {
    return {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.base.lg,
      paddingVertical: theme.spacing.base.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
    };
  };

  // Get content styles
  const getContentStyles = (): ViewStyle => {
    return {
      flex: 1,
    };
  };

  // Get empty state styles
  const getEmptyStateStyles = (): ViewStyle => {
    return {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.base.xl,
      paddingHorizontal: theme.spacing.base.lg,
    };
  };

  // Get separator styles for mixed content
  const getSeparatorStyles = (): ViewStyle => ({
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border.primary,
    marginTop: 8,
  });

  // Get actions container styles
  const getActionsStyles = (): ViewStyle => {
    return {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.base.sm,
    };
  };

  // Get unread count
  const getUnreadCount = (): number => {
    return notifications.filter(notification => !notification.read).length;
  };

  // Render header
  const renderHeader = () => {
    if (!showHeader) return null;

    const unreadCount = getUnreadCount();
    const hasNotifications = notifications.length > 0;
    const hasNavigationItems = navigationItems.length > 0;

    return (
      <View style={[getHeaderStyles(), headerStyle]}>
        <View style={{ flex: 1 }}>
          <Typography
            variant="h4"
            color="primary"
            weight="semibold"
          >
            {title || (type === 'notifications' ? 'Notifications' : 'Navigation')}
          </Typography>

          {subtitle && (
            <Typography
              variant="body2"
              color="secondary"
              style={{ marginTop: 2 }}
            >
              {subtitle}
            </Typography>
          )}

          {type === 'notifications' && unreadCount > 0 && (
            <Typography
              variant="caption"
              color="primary"
              style={{ marginTop: 2 }}
            >
              {unreadCount} unread
            </Typography>
          )}
        </View>

        {showActions && (hasNotifications || hasNavigationItems) && (
          <View style={getActionsStyles()}>
            {onRefresh && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={onRefresh}
                disabled={refreshing}
                accessibilityRole="button"
                accessibilityLabel="Refresh"
                accessibilityHint="Refresh the content"
              >
                <Icon
                  name="refresh"
                  size="sm"
                  color={refreshing ? colors.text.disabled : colors.text.secondary}
                />
              </TouchableOpacity>
            )}

            {type === 'notifications' && onMarkAllRead && unreadCount > 0 && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={onMarkAllRead}
                accessibilityRole="button"
                accessibilityLabel="Mark all as read"
                accessibilityHint="Mark all notifications as read"
              >
                <Icon
                  name="checkmark-done"
                  size="sm"
                  color={colors.text.secondary}
                />
              </TouchableOpacity>
            )}

            {onClearAll && (hasNotifications || hasNavigationItems) && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={onClearAll}
                accessibilityRole="button"
                accessibilityLabel="Clear all"
                accessibilityHint="Clear all items"
              >
                <Icon
                  name="trash"
                  size="sm"
                  color={colors.text.secondary}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  // Render navigation item
  const renderNavigationItem = (item: NavigationItem, index: number) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.navigationItem,
          {
            paddingHorizontal: theme.spacing.base.lg,
            paddingVertical: theme.spacing.base.md,
            borderBottomWidth: index < navigationItems.length - 1 ? 1 : 0,
            borderBottomColor: colors.border.primary,
            opacity: item.disabled ? 0.5 : 1,
          },
        ]}
        onPress={item.disabled ? undefined : item.onPress}
        disabled={item.disabled}
        accessibilityRole="button"
        accessibilityLabel={item.title}
        accessibilityHint={item.subtitle}
        testID={item.testID}
        activeOpacity={0.7}
      >
        <View style={styles.navigationItemContent}>
          {item.icon && (
            <View style={{ position: 'relative', marginRight: theme.spacing.base.sm }}>
              <Icon
                name={item.icon}
                size="md"
                color={item.disabled ? colors.text.disabled : colors.text.secondary}
              />

              {item.badge && item.badge > 0 && (
                <View style={[styles.badge, { backgroundColor: item.badgeColor || colors.error.main }]}>
                  <Typography
                    variant="caption"
                    style={{ ...styles.badgeText, color: colors.error.contrast }}
                  >
                    {item.badge > 99 ? '99+' : item.badge.toString()}
                  </Typography>
                </View>
              )}
            </View>
          )}

          <View style={{ flex: 1 }}>
            <Typography
              variant="body1"
              color={item.disabled ? 'disabled' : 'primary'}
              weight="medium"
            >
              {item.title}
            </Typography>

            {item.subtitle && (
              <Typography
                variant="body2"
                color={item.disabled ? 'disabled' : 'secondary'}
                style={{ marginTop: 2 }}
              >
                {item.subtitle}
              </Typography>
            )}
          </View>

          <Icon
            name="chevron-forward"
            size="sm"
            color={item.disabled ? colors.text.disabled : colors.text.tertiary}
          />
        </View>
      </TouchableOpacity>
    );
  };

  // Render empty state
  const renderEmptyState = () => {
    return (
      <View style={getEmptyStateStyles()}>
        <Icon
          name={emptyIcon as keyof typeof Ionicons.glyphMap}
          size="xl"
          color={colors.text.tertiary}
          containerStyle={{ marginBottom: theme.spacing.base.md }}
        />

        <Typography
          variant="h4"
          color="secondary"
          align="center"
          style={{ marginBottom: theme.spacing.base.xs }}
        >
          {emptyTitle}
        </Typography>

        <Typography
          variant="body2"
          color="tertiary"
          align="center"
        >
          {emptyMessage}
        </Typography>

        {onRefresh && (
          <Button
            variant="outline"
            size="small"
            onPress={onRefresh}
            style={{ marginTop: theme.spacing.base.md }}
          >
            Refresh
          </Button>
        )}
      </View>
    );
  };

  // Render content
  const renderContent = () => {
    const hasContent = notifications.length > 0 || navigationItems.length > 0;

    if (loading && !hasContent) {
      return (
        <Animated.View style={[getEmptyStateStyles(), { opacity: fadeAnim }]}>
          <Icon
            name="hourglass"
            size="xl"
            color={colors.text.tertiary}
            containerStyle={{ marginBottom: theme.spacing.base.md }}
          />
          <Typography variant="body1" color="secondary" align="center">
            Loading...
          </Typography>
        </Animated.View>
      );
    }

    if (!hasContent) {
      return renderEmptyState();
    }

    const ContentWrapper = scrollable ? ScrollView : View;
    const contentProps = scrollable ? {
      showsVerticalScrollIndicator: false,
      refreshing,
      onRefresh: onRefresh,
    } : {};

    return (
      <ContentWrapper style={[getContentStyles(), contentStyle]} {...contentProps}>
        {/* Navigation items */}
        {type !== 'notifications' && navigationItems.map((item, index) =>
          renderNavigationItem(item, index)
        )}

        {/* Notifications */}
        {type !== 'navigation' && notifications.map((notification, index) => (
          <NotificationItem
            key={notification.id}
            title={notification.title}
            message={notification.message}
            type={notification.type}
            timestamp={notification.timestamp}
            read={notification.read}
            icon={notification.icon}
            onPress={notification.onPress}
            onDismiss={notification.onDismiss}
            onAction={notification.onAction}
            actionLabel={notification.actionLabel}
            style={{
              marginHorizontal: theme.spacing.base.sm,
              marginVertical: theme.spacing.base.xs,
            }}
          />
        ))}

        {/* Mixed content separator */}
        {type === 'mixed' && navigationItems.length > 0 && notifications.length > 0 && (
          <View style={getSeparatorStyles()}>
            <Typography variant="caption" color="tertiary" align="center">
              Notifications
            </Typography>
          </View>
        )}
      </ContentWrapper>
    );
  };

  return (
    <View
      style={[getContainerStyles(), style]}
      accessibilityRole="menu"
      accessibilityLabel={accessibilityLabel || title || 'Navigation panel'}
      testID={testID}
    >
      {renderHeader()}
      {renderContent()}
    </View>
  );
};

// Internal styles
const styles = StyleSheet.create({
  actionButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  navigationItem: {
    backgroundColor: 'transparent',
  },
  navigationItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    lineHeight: 10,
  },
});


// Export default
export default NavigationPanel;