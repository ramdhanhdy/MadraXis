/**
 * SkeletonCard Component
 * Content placeholder for cards with consistent loading states
 */

import React, { useMemo, useCallback } from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { useTheme, useColors } from '@/src/context/ThemeContext';

// SkeletonCard Props Interface
export interface SkeletonCardProps {
  // Size variants
  variant?: 'small' | 'medium' | 'large' | 'compact';
  
  // Layout
  horizontal?: boolean;
  
  // Number of lines for text placeholders
  lines?: number;
  
  // Show avatar placeholder
  showAvatar?: boolean;
  
  // Custom styling
  style?: ViewStyle;
  
  // Test ID
  testID?: string;
}

// SkeletonCard Component
export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  variant = 'medium',
  horizontal = false,
  lines = 3,
  showAvatar = false,
  style,
  testID,
}) => {
  const { theme } = useTheme();
  const colors = useColors();

  // Get container styles based on variant - memoized
  const getContainerStyles = useMemo((): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: colors.surface.primary,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: colors.border.primary,
      overflow: 'hidden',
    };

    switch (variant) {
      case 'small':
        return {
          ...baseStyle,
          padding: theme.spacing.base.sm,
          minHeight: 80,
        };
      case 'medium':
        return {
          ...baseStyle,
          padding: theme.spacing.base.md,
          minHeight: 120,
        };
      case 'large':
        return {
          ...baseStyle,
          padding: theme.spacing.base.lg,
          minHeight: 180,
        };
      case 'compact':
        return {
          ...baseStyle,
          padding: theme.spacing.base.xs,
          minHeight: 60,
        };
      default:
        return {
          ...baseStyle,
          padding: theme.spacing.base.md,
          minHeight: 120,
        };
    }
  }, [variant, colors.surface.primary, colors.border.primary, theme.borderRadius.md, theme.spacing.base]);

  // Get layout styles - memoized
  const getLayoutStyles = useMemo((): ViewStyle => {
    if (horizontal) {
      return {
        flexDirection: 'row',
        alignItems: 'center',
      };
    }
    return {
      flexDirection: 'column',
    };
  }, [horizontal]);

  // Get skeleton styles
  const getSkeletonStyles = (type: 'avatar' | 'title' | 'line' | 'action'): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: colors.surface.secondary,
      borderRadius: theme.borderRadius.sm,
    };

    switch (type) {
      case 'avatar':
        return {
          ...baseStyle,
          width: 40,
          height: 40,
          borderRadius: 20,
          marginRight: horizontal ? theme.spacing.base.md : 0,
          marginBottom: !horizontal ? theme.spacing.base.sm : 0,
        };
      case 'title':
        return {
          ...baseStyle,
          width: '60%',
          height: 16,
          marginBottom: theme.spacing.base.xs,
        };
      case 'line':
        return {
          ...baseStyle,
          width: '100%',
          height: 12,
          marginBottom: theme.spacing.base.xs,
        };
      case 'action':
        return {
          ...baseStyle,
          width: 80,
          height: 32,
          marginTop: theme.spacing.base.sm,
          alignSelf: horizontal ? 'flex-end' : 'flex-start',
        };
      default:
        return baseStyle;
    }
  };

  // Render skeleton lines
  const renderLines = () => {
    return Array.from({ length: lines }, (_, index) => (
      <View
        key={index}
        style={[
          getSkeletonStyles('line'),
          {
            width: index === 0 ? '100%' : `${100 - (index * 20)}%`,
          },
        ]}
      />
    ));
  };

  return (
    <View
      style={[
        getContainerStyles,
        getLayoutStyles,
        style,
      ]}
      testID={testID || 'skeleton-card'}
    >
      {/* Avatar placeholder */}
      {showAvatar && <View style={getSkeletonStyles('avatar')} />}
      
      {/* Content area */}
      <View style={{ flex: 1 }} testID={testID ? `${testID}-content` : 'skeleton-content'}>
        {/* Title placeholder */}
        <View style={getSkeletonStyles('title')} />
        
        {/* Text lines */}
        {renderLines()}
        
        {/* Action button placeholder */}
        <View style={getSkeletonStyles('action')} />
      </View>
    </View>
  );
};

// Internal styles
const styles = StyleSheet.create({
  // Add any internal styles if needed
});

// Export default
export default SkeletonCard;