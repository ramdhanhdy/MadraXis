/**
 * QuickAction Component
 * Consistent dashboard action button with grid layout and visual hierarchy
 */

import React from 'react';
import {
  TouchableOpacity,
  View,
  ViewStyle,
  StyleSheet,
  TouchableOpacityProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useColors } from '@/src/context/ThemeContext';
import { Typography } from '@/src/shared/components/atoms/Typography';
import { Icon } from '@/src/shared/components/atoms/Icon';

// QuickAction Props Interface
export interface QuickActionProps extends Omit<TouchableOpacityProps, 'style'> {
  // Content
  title: string;
  subtitle?: string;
  
  // Icon
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  
  // Badge
  badge?: number;
  badgeColor?: string;
  
  // Visual options
  variant?: 'default' | 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  
  // Layout
  layout?: 'vertical' | 'horizontal';
  
  // Interactive
  onPress: () => void;
  disabled?: boolean;
  
  // Custom styling
  style?: ViewStyle;
  
  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
  
  // Test ID
  testID?: string;
}

// QuickAction Component
export const QuickAction: React.FC<QuickActionProps> = ({
  title,
  subtitle,
  icon,
  iconColor,
  badge,
  badgeColor,
  variant = 'default',
  size = 'medium',
  layout = 'vertical',
  onPress,
  disabled = false,
  style,
  accessibilityLabel,
  accessibilityHint,
  testID,
  ...props
}) => {
  const { theme } = useTheme();
  const colors = useColors();

  // Get container styles based on size and variant
  const getContainerStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.lg,
      alignItems: layout === 'vertical' ? 'center' : 'flex-start',
      justifyContent: 'center',
      backgroundColor: colors.surface.primary,
      ...theme.shadows.card,
    };

    // Size-specific styles
    const sizeStyles = {
      small: {
        minHeight: 80,
        padding: theme.spacing.base.sm,
      },
      medium: {
        minHeight: 100,
        padding: theme.spacing.base.md,
      },
      large: {
        minHeight: 120,
        padding: theme.spacing.base.lg,
      },
    };

    // Variant-specific styles
    const variantStyles = {
      default: {
        borderWidth: 1,
        borderColor: colors.border.primary,
      },
      primary: {
        backgroundColor: colors.primary.main,
        borderWidth: 0,
      },
      secondary: {
        backgroundColor: colors.secondary.main,
        borderWidth: 0,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...(layout === 'horizontal' && {
        flexDirection: 'row',
        alignItems: 'center',
      }),
      opacity: disabled ? 0.6 : 1,
    };
  };

  // Get icon size based on component size
  const getIconSize = (): 'sm' | 'md' | 'lg' | 'xl' => {
    const iconSizes = {
      small: 'md' as const,
      medium: 'lg' as const,
      large: 'xl' as const,
    };
    return iconSizes[size];
  };

  // Get icon color based on variant
  const getIconColor = (): string => {
    if (iconColor) return iconColor;
    
    if (disabled) return colors.text.disabled;
    
    const variantIconColors = {
      default: colors.primary.main,
      primary: colors.primary.contrast,
      secondary: colors.secondary.contrast,
    };
    
    return variantIconColors[variant];
  };

  // Get text color based on variant
  const getTextColor = (): 'primary' | 'secondary' | 'disabled' | string => {
    if (disabled) return 'disabled';
    
    const variantTextColors = {
      default: 'primary' as const,
      primary: colors.primary.contrast,
      secondary: colors.secondary.contrast,
    };
    
    return variantTextColors[variant];
  };

  // Get subtitle text color
  const getSubtitleColor = (): 'secondary' | 'disabled' | string => {
    if (disabled) return 'disabled';
    
    const variantSubtitleColors = {
      default: 'secondary' as const,
      primary: colors.primary.contrast,
      secondary: colors.secondary.contrast,
    };
    
    return variantSubtitleColors[variant];
  };

  // Get content container styles
  const getContentStyles = (): ViewStyle => {
    return {
      flex: layout === 'horizontal' ? 1 : undefined,
      alignItems: layout === 'vertical' ? 'center' : 'flex-start',
      marginLeft: layout === 'horizontal' ? theme.spacing.base.sm : 0,
      marginTop: layout === 'vertical' ? theme.spacing.base.xs : 0,
    };
  };

  // Get badge styles
  const getBadgeStyles = (): ViewStyle => {
    const badgeSize = 20;
    
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
      paddingHorizontal: 6,
    };
  };

  // Get accessibility label
  const getAccessibilityLabel = (): string => {
    if (accessibilityLabel) return accessibilityLabel;
    
    let label = title;
    if (subtitle) label += `, ${subtitle}`;
    if (badge && badge > 0) label += `, ${badge} notifications`;
    
    return label;
  };

  // Render badge
  const renderBadge = () => {
    if (!badge || badge <= 0) return null;
    
    return (
      <View style={getBadgeStyles()}>
        <Typography
          variant="caption"
          color={colors.error.contrast}
          style={{
            fontSize: 12,
            fontWeight: 'bold',
            lineHeight: 12,
          }}
        >
          {badge > 99 ? '99+' : badge.toString()}
        </Typography>
      </View>
    );
  };

  // Render icon with badge
  const renderIconWithBadge = () => {
    return (
      <View style={{ position: 'relative' }}>
        <Icon
          name={icon}
          size={getIconSize()}
          color={getIconColor()}
        />
        {renderBadge()}
      </View>
    );
  };

  // Render content
  const renderContent = () => {
    return (
      <View style={getContentStyles()}>
        <Typography
          variant={size === 'small' ? 'body2' : 'body1'}
          weight="medium"
          color={getTextColor()}
          align={layout === 'vertical' ? 'center' : 'left'}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {title}
        </Typography>
        
        {subtitle && (
          <Typography
            variant="caption"
            color={getSubtitleColor()}
            align={layout === 'vertical' ? 'center' : 'left'}
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

  return (
    <TouchableOpacity
      style={[getContainerStyles(), style]}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={getAccessibilityLabel()}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      testID={testID}
      activeOpacity={0.7}
      {...props}
    >
      {renderIconWithBadge()}
      {renderContent()}
    </TouchableOpacity>
  );
};

// Export default
export default QuickAction;