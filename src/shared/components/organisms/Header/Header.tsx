/**
 * Header Component
 * Consistent page header with title positioning, action buttons, and notification icons
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  ViewStyle,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useColors } from '@/src/context/ThemeContext';
import { Typography } from '@/src/shared/components/atoms/Typography';
import { Icon } from '@/src/shared/components/atoms/Icon';

// Header action interface
export interface HeaderAction {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  badge?: number;
  badgeColor?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

// Header Props Interface
export interface HeaderProps {
  // Content
  title: string;
  subtitle?: string;
  
  // Left action (typically back button)
  leftAction?: HeaderAction;
  
  // Right actions (notifications, settings, etc.)
  rightActions?: HeaderAction[];
  
  // Visual options
  variant?: 'default' | 'transparent' | 'elevated';
  
  // Colors
  backgroundColor?: string;
  textColor?: string;
  
  // Layout options
  centerTitle?: boolean;
  showStatusBar?: boolean;
  statusBarStyle?: 'default' | 'light-content' | 'dark-content';
  
  // Custom styling
  style?: ViewStyle;
  
  // Accessibility
  accessibilityLabel?: string;
  
  // Test ID
  testID?: string;
}

// Header Component
export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  leftAction,
  rightActions = [],
  variant = 'default',
  backgroundColor,
  textColor,
  centerTitle = true,
  showStatusBar = true,
  statusBarStyle = 'dark-content',
  style,
  accessibilityLabel,
  testID,
}) => {
  const { theme } = useTheme();
  const colors = useColors();

  // Get header background color
  const getBackgroundColor = (): string => {
    if (backgroundColor) return backgroundColor;
    
    const variantBackgrounds = {
      default: colors.surface.primary,
      transparent: 'transparent',
      elevated: colors.surface.primary,
    };
    
    return variantBackgrounds[variant];
  };

  // Get text color
  const getTextColor = (): string => {
    if (textColor) return textColor;
    return colors.text.primary;
  };

  // Get container styles
  const getContainerStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: getBackgroundColor(),
      paddingHorizontal: theme.spacing.base.md,
      paddingTop: showStatusBar ? (StatusBar.currentHeight || 0) + theme.spacing.base.sm : theme.spacing.base.sm,
      paddingBottom: theme.spacing.base.sm,
      minHeight: 56 + (showStatusBar ? (StatusBar.currentHeight || 0) : 0),
    };

    // Add shadow for elevated variant
    if (variant === 'elevated') {
      return {
        ...baseStyle,
        ...theme.shadows.header,
      };
    }

    return baseStyle;
  };

  // Get content container styles
  const getContentStyles = (): ViewStyle => {
    return {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 44, // Minimum touch target
    };
  };

  // Get title container styles
  const getTitleContainerStyles = (): ViewStyle => {
    const hasLeftAction = !!leftAction;
    const hasRightActions = rightActions.length > 0;
    
    if (centerTitle) {
      return {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: theme.spacing.base.sm,
      };
    }
    
    return {
      flex: 1,
      alignItems: 'flex-start',
      marginLeft: hasLeftAction ? theme.spacing.base.sm : 0,
      marginRight: hasRightActions ? theme.spacing.base.sm : 0,
    };
  };

  // Get actions container styles
  const getActionsContainerStyles = (): ViewStyle => {
    return {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.base.xs,
    };
  };

  // Get badge styles
  const getBadgeStyles = (badgeColor?: string): ViewStyle => {
    const badgeSize = 16;
    
    return {
      position: 'absolute',
      top: -4,
      right: -4,
      minWidth: badgeSize,
      height: badgeSize,
      borderRadius: badgeSize / 2,
      backgroundColor: badgeColor || colors.error.main,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4,
    };
  };

  // Render action button
  const renderActionButton = (action: HeaderAction, index: number) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.actionButton}
        onPress={action.onPress}
        accessibilityRole="button"
        accessibilityLabel={action.accessibilityLabel || `Action ${index + 1}`}
        accessibilityHint={action.accessibilityHint}
        testID={action.testID}
        activeOpacity={0.7}
      >
        <View style={{ position: 'relative' }}>
          <Icon
            name={action.icon}
            size="md"
            color={getTextColor()}
          />
          
          {action.badge && action.badge > 0 && (
            <View style={getBadgeStyles(action.badgeColor)}>
              <Typography
                variant="caption"
                color={colors.error.contrast}
                style={{
                  fontSize: 10,
                  fontWeight: 'bold',
                  lineHeight: 10,
                }}
              >
                {action.badge > 99 ? '99+' : action.badge.toString()}
              </Typography>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Render left section
  const renderLeftSection = () => {
    if (!leftAction) {
      return <View style={{ width: 44 }} />; // Spacer for centering
    }
    
    return renderActionButton(leftAction, -1);
  };

  // Render title section
  const renderTitleSection = () => {
    return (
      <View style={getTitleContainerStyles()}>
        <Typography
          variant="h4"
          color={getTextColor()}
          align={centerTitle ? 'center' : 'left'}
          numberOfLines={1}
          ellipsizeMode="tail"
          weight="semibold"
        >
          {title}
        </Typography>
        
        {subtitle && (
          <Typography
            variant="caption"
            color={colors.text.secondary}
            align={centerTitle ? 'center' : 'left'}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ marginTop: 2 }}
          >
            {subtitle}
          </Typography>
        )}
      </View>
    );
  };

  // Render right section
  const renderRightSection = () => {
    if (rightActions.length === 0) {
      return <View style={{ width: 44 }} />; // Spacer for centering
    }
    
    return (
      <View style={getActionsContainerStyles()}>
        {rightActions.map((action, index) => renderActionButton(action, index))}
      </View>
    );
  };

  return (
    <>
      {showStatusBar && (
        <StatusBar
          barStyle={statusBarStyle}
          backgroundColor={getBackgroundColor()}
          translucent={Platform.OS === 'android'}
        />
      )}
      
      <View
        style={[getContainerStyles(), style]}
        accessibilityRole="header"
        accessibilityLabel={accessibilityLabel || `Header: ${title}`}
        testID={testID}
      >
        <View style={getContentStyles()}>
          {renderLeftSection()}
          {renderTitleSection()}
          {renderRightSection()}
        </View>
      </View>
    </>
  );
};

// Internal styles
const styles = StyleSheet.create({
  actionButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
});

// Export default
export default Header;