/**
 * TabBar Component
 * Consistent bottom navigation with tab styling, active states, and transitions
 */

import React from 'react';
import {
  View,
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

// Tab configuration interface
export interface TabConfig {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  badge?: number;
  badgeColor?: string;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

// TabBar Props Interface
export interface TabBarProps {
  // Tabs configuration
  tabs: TabConfig[];
  activeTab: string;
  onTabPress: (tabId: string) => void;
  
  // Visual options
  variant?: 'default' | 'elevated' | 'transparent';
  showLabels?: boolean;
  
  // Colors
  backgroundColor?: string;
  activeColor?: string;
  inactiveColor?: string;
  
  // Animation
  animated?: boolean;
  animationDuration?: number;
  
  // Layout
  safeAreaInsets?: {
    bottom?: number;
  };
  
  // Custom styling
  style?: ViewStyle;
  
  // Accessibility
  accessibilityLabel?: string;
  
  // Test ID
  testID?: string;
}

// TabBar Component
export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTab,
  onTabPress,
  variant = 'default',
  showLabels = true,
  backgroundColor,
  activeColor,
  inactiveColor,
  animated = true,
  animationDuration = 200,
  safeAreaInsets,
  style,
  accessibilityLabel,
  testID,
}) => {
  const { theme } = useTheme();
  const colors = useColors();
  const screenWidth = Dimensions.get('window').width;
  
  // Animation values for active indicator
  const indicatorPosition = React.useRef(new Animated.Value(0)).current;
  const indicatorWidth = screenWidth / tabs.length;

  // Update indicator position when active tab changes
  React.useEffect(() => {
    const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (activeIndex !== -1 && animated) {
      Animated.timing(indicatorPosition, {
        toValue: activeIndex * indicatorWidth,
        duration: animationDuration,
        useNativeDriver: false,
      }).start();
    } else if (activeIndex !== -1) {
      indicatorPosition.setValue(activeIndex * indicatorWidth);
    }
  }, [activeTab, tabs, indicatorWidth, animated, animationDuration, indicatorPosition]);

  // Get background color
  const getBackgroundColor = (): string => {
    if (backgroundColor) return backgroundColor;
    
    const variantBackgrounds = {
      default: colors.surface.primary,
      elevated: colors.surface.primary,
      transparent: 'transparent',
    };
    
    return variantBackgrounds[variant];
  };

  // Get active color
  const getActiveColor = (): string => {
    if (activeColor) return activeColor;
    return colors.primary.main;
  };

  // Get inactive color
  const getInactiveColor = (): string => {
    if (inactiveColor) return inactiveColor;
    return colors.text.tertiary;
  };

  // Get container styles
  const getContainerStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: getBackgroundColor(),
      paddingBottom: safeAreaInsets?.bottom || 0,
      borderTopWidth: variant === 'transparent' ? 0 : 1,
      borderTopColor: colors.border.primary,
    };

    // Add shadow for elevated variant
    if (variant === 'elevated') {
      return {
        ...baseStyle,
        ...theme.shadows.tabBar,
      };
    }

    return baseStyle;
  };

  // Get tab container styles
  const getTabContainerStyles = (): ViewStyle => {
    return {
      flexDirection: 'row',
      height: showLabels ? 64 : 56,
      position: 'relative',
    };
  };

  // Get active indicator styles
  const getActiveIndicatorStyles = (): ViewStyle => {
    return {
      position: 'absolute',
      top: 0,
      height: 3,
      width: indicatorWidth,
      backgroundColor: getActiveColor(),
      borderRadius: 1.5,
    };
  };

  // Get tab button styles
  const getTabButtonStyles = (isActive: boolean, disabled: boolean): ViewStyle => {
    return {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.base.xs,
      paddingHorizontal: theme.spacing.base.xs,
      opacity: disabled ? 0.5 : 1,
    };
  };

  // Get badge styles
  const getBadgeStyles = (badgeColor?: string): ViewStyle => {
    const badgeSize = 16;
    
    return {
      position: 'absolute',
      top: showLabels ? 8 : 12,
      right: '50%',
      marginRight: -20,
      minWidth: badgeSize,
      height: badgeSize,
      borderRadius: badgeSize / 2,
      backgroundColor: badgeColor || colors.error.main,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4,
    };
  };

  // Render tab badge
  const renderTabBadge = (tab: TabConfig) => {
    if (!tab.badge || tab.badge <= 0) return null;
    
    return (
      <View style={getBadgeStyles(tab.badgeColor)}>
        <Typography
          variant="caption"
          color={colors.error.contrast}
          style={{
            fontSize: 10,
            fontWeight: 'bold',
            lineHeight: 10,
          }}
        >
          {tab.badge > 99 ? '99+' : tab.badge.toString()}
        </Typography>
      </View>
    );
  };

  // Render individual tab
  const renderTab = (tab: TabConfig, index: number) => {
    const isActive = tab.id === activeTab;
    const iconColor = isActive ? getActiveColor() : getInactiveColor();
    const textColor = isActive ? getActiveColor() : getInactiveColor();

    return (
      <TouchableOpacity
        key={tab.id}
        style={getTabButtonStyles(isActive, tab.disabled || false)}
        onPress={() => !tab.disabled && onTabPress(tab.id)}
        disabled={tab.disabled}
        accessibilityRole="tab"
        accessibilityState={{ selected: isActive, disabled: tab.disabled }}
        accessibilityLabel={tab.accessibilityLabel || tab.label}
        accessibilityHint={tab.accessibilityHint}
        testID={tab.testID || `tab-${tab.id}`}
        activeOpacity={0.7}
      >
        <View style={{ position: 'relative' }}>
          <Icon
            name={tab.icon}
            size="md"
            color={iconColor}
          />
          {renderTabBadge(tab)}
        </View>
        
        {showLabels && (
          <Typography
            variant="caption"
            color={textColor}
            align="center"
            numberOfLines={1}
            ellipsizeMode="tail"
            weight={isActive ? 'medium' : 'normal'}
            style={{ 
              marginTop: 4,
              fontSize: 11,
              lineHeight: 12,
            }}
          >
            {tab.label}
          </Typography>
        )}
      </TouchableOpacity>
    );
  };

  // Get accessibility label
  const getAccessibilityLabel = (): string => {
    if (accessibilityLabel) return accessibilityLabel;
    return `Tab bar with ${tabs.length} tabs`;
  };

  return (
    <View
      style={[getContainerStyles(), style]}
      accessibilityRole="tablist"
      accessibilityLabel={getAccessibilityLabel()}
      testID={testID}
    >
      <View style={getTabContainerStyles()}>
        {/* Active indicator */}
        {animated && (
          <Animated.View
            style={[
              getActiveIndicatorStyles(),
              {
                left: indicatorPosition,
              },
            ]}
          />
        )}
        
        {/* Static indicator for non-animated version */}
        {!animated && (
          <View
            style={[
              getActiveIndicatorStyles(),
              {
                left: tabs.findIndex(tab => tab.id === activeTab) * indicatorWidth,
              },
            ]}
          />
        )}
        
        {/* Tab buttons */}
        {tabs.map((tab, index) => renderTab(tab, index))}
      </View>
    </View>
  );
};

// Export default
export default TabBar;