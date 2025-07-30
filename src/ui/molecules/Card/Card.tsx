/**
 * Card Component
 * Consistent content container with variants, padding options, and press interactions
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  ViewStyle,
  TouchableOpacityProps,
} from 'react-native';
import { useTheme } from '@design-system';
import { CardComponentTheme } from '@design-system/core/types';

// Card Props Interface
export interface CardProps extends Omit<TouchableOpacityProps, 'style'> {
  // Content
  children: React.ReactNode;
  
  // Variants
  variant?: 'default' | 'elevated' | 'outlined';
  
  // Padding options
  padding?: 'none' | 'small' | 'medium' | 'large';
  
  // Interactive
  onPress?: () => void;
  disabled?: boolean;
  
  // Loading state
  loading?: boolean;
  
  // Custom styling
  style?: ViewStyle;
  
  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: 'button' | 'none';
  
  // Test ID
  testID?: string;
}

// Card Component
export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  onPress,
  disabled = false,
  loading = false,
  style,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
  testID,
  ...props
}) => {
  const { theme } = useTheme();
  const cardTheme: CardComponentTheme = theme.componentThemes.card;
  const colors = theme.colors;

  // Get card styles based on variant and state using design system
  const getCardStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: cardTheme.borderRadius,
      backgroundColor: cardTheme.backgroundColor,
      padding: cardTheme.padding[padding],
    };

    // Variant styles using design system
    const variantStyles = {
      default: {
        ...cardTheme.shadow,
      },
      elevated: {
        ...theme.shadows?.cardHover || cardTheme.shadow,
      },
      outlined: {
        borderWidth: 1,
        borderColor: colors.border?.primary || colors.neutral?.[300] || '#e5e5e5',
        // No shadow for outlined variant
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...(onPress && {
        opacity: disabled ? 0.6 : 1,
      }),
      ...(loading && {
        opacity: 0.7,
      }),
    };
  };

  // Get accessibility role
  const getAccessibilityRole = () => {
    if (accessibilityRole) return accessibilityRole;
    if (onPress) return 'button';
    return 'none';
  };

  // Render card content
  const renderContent = () => {
    if (loading) {
      // TODO: Add loading skeleton in future iteration
      return children;
    }
    
    return children;
  };

  // If interactive, wrap in TouchableOpacity
  if (onPress) {
    return (
      <TouchableOpacity
        style={[getCardStyles(), style]}
        onPress={disabled || loading ? undefined : onPress}
        disabled={disabled || loading}
        accessibilityRole={getAccessibilityRole()}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{
          disabled: disabled || loading,
          busy: loading,
        }}
        testID={testID}
        activeOpacity={0.7}
        {...props}
      >
        {renderContent()}
      </TouchableOpacity>
    );
  }

  // Static card without interaction
  return (
    <View
      style={[getCardStyles(), style]}
      accessibilityRole={getAccessibilityRole()}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      {renderContent()}
    </View>
  );
};

// Export default
export default Card;