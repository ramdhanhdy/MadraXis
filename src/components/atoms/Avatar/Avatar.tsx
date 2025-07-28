/**
 * Avatar Component
 * User profile images and initials with consistent sizing and fallbacks
 */

import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { useTheme, useColors } from '../../../context/ThemeContext';

// Avatar Props Interface
export interface AvatarProps {
  // Image source
  source?: { uri: string } | number;
  
  // Fallback options
  name?: string;
  initials?: string;
  
  // Size options
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;
  
  // Shape options
  shape?: 'circle' | 'square' | 'rounded';
  
  // Interactive
  onPress?: () => void;
  disabled?: boolean;
  
  // Styling
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: number;
  
  // Custom styling
  containerStyle?: ViewStyle;
  imageStyle?: ImageStyle;
  textStyle?: TextStyle;
  
  // Status indicator
  showStatus?: boolean;
  status?: 'online' | 'offline' | 'away' | 'busy';
  statusColor?: string;
  
  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
  
  // Test ID
  testID?: string;
}

// Avatar Component
export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  initials,
  size = 'md',
  shape = 'circle',
  onPress,
  disabled = false,
  backgroundColor,
  textColor,
  borderColor,
  borderWidth = 0,
  containerStyle,
  imageStyle,
  textStyle,
  showStatus = false,
  status = 'offline',
  statusColor,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const { theme } = useTheme();
  const colors = useColors();
  const [imageError, setImageError] = useState(false);

  // Get avatar size in pixels
  const getAvatarSize = (): number => {
    if (typeof size === 'number') {
      return size;
    }

    const sizeMap = {
      xs: 24,
      sm: 32,
      md: 40,
      lg: 48,
      xl: 64,
      '2xl': 80,
    };

    return sizeMap[size];
  };

  // Get border radius based on shape
  const getBorderRadius = (): number => {
    const avatarSize = getAvatarSize();
    
    switch (shape) {
      case 'circle':
        return avatarSize / 2;
      case 'square':
        return 0;
      case 'rounded':
        return theme.borderRadius.md;
      default:
        return avatarSize / 2;
    }
  };

  // Generate initials from name
  const generateInitials = (): string => {
    if (initials) return initials.toUpperCase().slice(0, 2);
    if (!name) return '?';
    
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  // Get background color for initials
  const getBackgroundColor = (): string => {
    if (backgroundColor) return backgroundColor;
    
    // Generate consistent color based on name/initials
    if (name || initials) {
      const text = name || initials || '';
      const hash = text.split('').reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
      }, 0);
      
      const colors = [
        '#005e7a', // Primary
        '#f0c75e', // Secondary
        '#4caf50', // Success
        '#ff9800', // Warning
        '#9c27b0', // Purple
        '#2196f3', // Blue
        '#ff5722', // Deep Orange
        '#795548', // Brown
      ];
      
      return colors[Math.abs(hash) % colors.length];
    }
    
    return colors.surface.secondary;
  };

  // Get text color for initials
  const getTextColor = (): string => {
    if (textColor) return textColor;
    return colors.text.inverse;
  };

  // Get font size for initials
  const getFontSize = (): number => {
    const avatarSize = getAvatarSize();
    return Math.floor(avatarSize * 0.4);
  };

  // Get status indicator color
  const getStatusColor = (): string => {
    if (statusColor) return statusColor;
    
    const statusColors = {
      online: colors.success.main,
      offline: colors.text.disabled,
      away: colors.warning.main,
      busy: colors.error.main,
    };
    
    return statusColors[status];
  };

  // Get container styles
  const getContainerStyles = (): ViewStyle => {
    const avatarSize = getAvatarSize();
    
    return {
      width: avatarSize,
      height: avatarSize,
      borderRadius: getBorderRadius(),
      backgroundColor: getBackgroundColor(),
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      ...(borderWidth > 0 && {
        borderWidth,
        borderColor: borderColor || colors.border.primary,
      }),
      ...(onPress && {
        opacity: disabled ? 0.6 : 1,
      }),
    };
  };

  // Get image styles
  const getImageStyles = (): ImageStyle => {
    const avatarSize = getAvatarSize();
    
    return {
      width: avatarSize,
      height: avatarSize,
      borderRadius: getBorderRadius(),
    };
  };

  // Get text styles for initials
  const getTextStyles = (): TextStyle => {
    return {
      fontSize: getFontSize(),
      fontWeight: theme.typography.fontWeight.semibold as TextStyle['fontWeight'],
      color: getTextColor(),
      textAlign: 'center',
    };
  };

  // Get status indicator styles
  const getStatusStyles = (): ViewStyle => {
    const avatarSize = getAvatarSize();
    const statusSize = Math.max(8, avatarSize * 0.2);
    
    return {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: statusSize,
      height: statusSize,
      borderRadius: statusSize / 2,
      backgroundColor: getStatusColor(),
      borderWidth: 2,
      borderColor: colors.surface.primary,
    };
  };

  // Render avatar content
  const renderAvatarContent = () => {
    // Try to render image first
    if (source && !imageError) {
      return (
        <Image
          source={source}
          style={[getImageStyles(), imageStyle]}
          onError={() => setImageError(true)}
          accessibilityRole="image"
          testID="avatar-image"
        />
      );
    }

    // Fallback to initials
    const displayInitials = generateInitials();
    
    return (
      <Text style={[getTextStyles(), textStyle]}>
        {displayInitials}
      </Text>
    );
  };

  // Render status indicator
  const renderStatusIndicator = () => {
    if (!showStatus) return null;
    
    return <View style={getStatusStyles()} testID="status-indicator" />;
  };

  // Get accessibility label
  const getAccessibilityLabel = (): string => {
    if (accessibilityLabel) return accessibilityLabel;
    if (name) return `Avatar for ${name}`;
    return 'User avatar';
  };

  // Render avatar
  const avatarContent = (
    <View style={[getContainerStyles(), containerStyle]}>
      {renderAvatarContent()}
      {renderStatusIndicator()}
    </View>
  );

  // If interactive, wrap in TouchableOpacity
  if (onPress) {
    return (
      <TouchableOpacity
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={getAccessibilityLabel()}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled }}
        testID={testID}
      >
        {avatarContent}
      </TouchableOpacity>
    );
  }

  // Simple avatar without interaction
  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={getAccessibilityLabel()}
      testID={testID}
    >
      {avatarContent}
    </View>
  );
};

// Export default
export default Avatar;