/**
 * ListItem Component
 * Consistent list item implementation with uniform layout, spacing, and interactions
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  StyleSheet,
  TouchableOpacityProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useColors } from '@/src/context/ThemeContext';
import { Typography } from '@/src/shared/components/atoms/Typography';
import { Icon } from '@/src/shared/components/atoms/Icon';
import { combineStyles } from '@/src/utils/styleHelpers';

// ListItem Props Interface
export interface ListItemProps extends Omit<TouchableOpacityProps, 'style'> {
  // Content
  title: string;
  subtitle?: string;
  
  // Icons
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  
  // Custom components (alternative to icons)
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  
  // Visual options
  showDivider?: boolean;
  
  // Interactive
  onPress?: () => void;
  disabled?: boolean;
  
  // Custom styling
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  
  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: 'button' | 'none';
  
  // Test ID
  testID?: string;
}

// ListItem Component
export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  leftComponent,
  rightComponent,
  showDivider = false,
  onPress,
  disabled = false,
  style,
  titleStyle,
  subtitleStyle,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
  testID,
  ...props
}) => {
  const { theme } = useTheme();
  const colors = useColors();

  // Get container styles
  const getContainerStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.base.md,
      paddingVertical: theme.spacing.base.sm,
      minHeight: 56, // Standard list item height for good touch targets
      backgroundColor: colors.surface.primary,
    };

    return {
      ...baseStyle,
      ...(onPress && {
        opacity: disabled ? 0.6 : 1,
      }),
    };
  };

  // Get content container styles
  const getContentStyles = (): ViewStyle => {
    return {
      flex: 1,
      marginLeft: leftIcon || leftComponent ? theme.spacing.base.sm : 0,
      marginRight: rightIcon || rightComponent ? theme.spacing.base.sm : 0,
    };
  };

  // Get divider styles
  const getDividerStyles = (): ViewStyle => {
    return {
      height: 1,
      backgroundColor: colors.border.primary,
      marginLeft: leftIcon || leftComponent ? 56 : theme.spacing.base.md, // Align with content
    };
  };

  // Get accessibility role
  const getAccessibilityRole = () => {
    if (accessibilityRole) return accessibilityRole;
    if (onPress) return 'button';
    return 'none';
  };

  // Get accessibility label
  const getAccessibilityLabel = (): string => {
    if (accessibilityLabel) return accessibilityLabel;
    return subtitle ? `${title}, ${subtitle}` : title;
  };

  // Render left content
  const renderLeftContent = () => {
    if (leftComponent) {
      return leftComponent;
    }
    
    if (leftIcon) {
      return (
        <Icon
          name={leftIcon}
          size="md"
          color={disabled ? 'disabled' : 'secondary'}
        />
      );
    }
    
    return null;
  };

  // Render right content
  const renderRightContent = () => {
    if (rightComponent) {
      return rightComponent;
    }
    
    if (rightIcon) {
      return (
        <Icon
          name={rightIcon}
          size="md"
          color={disabled ? 'disabled' : 'tertiary'}
        />
      );
    }
    
    return null;
  };

  // Render main content
  const renderContent = () => {
    return (
      <View style={styles.container}>
        <View style={getContainerStyles()}>
          {renderLeftContent()}
          
          <View style={getContentStyles()}>
            <Typography
              variant="body1"
              color={disabled ? 'disabled' : 'primary'}
              numberOfLines={1}
              ellipsizeMode="tail"
              style={titleStyle}
            >
              {title}
            </Typography>
            
            {subtitle && (
              <Typography
                variant="body2"
                color={disabled ? 'disabled' : 'secondary'}
                numberOfLines={1}
                ellipsizeMode="tail"
                style={combineStyles({ marginTop: 2 }, subtitleStyle) as TextStyle}
              >
                {subtitle}
              </Typography>
            )}
          </View>
          
          {renderRightContent()}
        </View>
        
        {showDivider && <View style={getDividerStyles()} />}
      </View>
    );
  };

  // If interactive, wrap in TouchableOpacity
  if (onPress) {
    return (
      <TouchableOpacity
        style={style}
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
        accessibilityRole={getAccessibilityRole()}
        accessibilityLabel={getAccessibilityLabel()}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled }}
        testID={testID}
        activeOpacity={0.7}
        {...props}
      >
        {renderContent()}
      </TouchableOpacity>
    );
  }

  // Static list item without interaction
  return (
    <View
      style={style}
      accessibilityRole={getAccessibilityRole()}
      accessibilityLabel={getAccessibilityLabel()}
      testID={testID}
    >
      {renderContent()}
    </View>
  );
};

// Internal styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
});

// Export default
export default ListItem;