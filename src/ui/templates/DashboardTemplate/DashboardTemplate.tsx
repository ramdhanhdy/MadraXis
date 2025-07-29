/**
 * DashboardTemplate Component
 * Consistent dashboard structure for all user roles with header, content, and tab bar
 */

import React from 'react';
import {
  View,
  ScrollView,
  ViewStyle,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useColors } from '../../../context/ThemeContext';
import { Header } from '../../organisms/Header';
import { TabBar } from '../../organisms/TabBar';
import { BackgroundPattern } from '../../atoms/BackgroundPattern';

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

// DashboardTemplate Props Interface
export interface DashboardTemplateProps {
  // Header configuration
  header: {
    title: string;
    subtitle?: string;
    leftAction?: {
      icon: keyof typeof Ionicons.glyphMap;
      onPress: () => void;
      accessibilityLabel?: string;
    };
    rightActions?: HeaderAction[];
  };
  
  // Tab configuration
  tabs?: TabConfig[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  
  // Content
  children: React.ReactNode;
  
  // Background and styling
  backgroundPattern?: boolean;
  backgroundColor?: string;
  contentBackgroundColor?: string;
  
  // Layout options
  scrollable?: boolean;
  safeArea?: boolean;
  contentPadding?: boolean;
  
  // Custom styling
  style?: ViewStyle;
  headerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  tabBarStyle?: ViewStyle;
  
  // Accessibility
  accessibilityLabel?: string;
  
  // Test ID
  testID?: string;
}

// DashboardTemplate Component
export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
  header,
  tabs,
  activeTab,
  onTabChange,
  children,
  backgroundPattern = true,
  backgroundColor,
  contentBackgroundColor,
  scrollable = true,
  safeArea = true,
  contentPadding = true,
  style,
  headerStyle,
  contentStyle,
  tabBarStyle,
  accessibilityLabel,
  testID,
}) => {
  const { theme } = useTheme();
  const colors = useColors();

  // Get container styles
  const getContainerStyles = (): ViewStyle => {
    return {
      flex: 1,
      backgroundColor: backgroundColor || colors.background.primary,
    };
  };

  // Get content container styles
  const getContentContainerStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flex: 1,
      backgroundColor: contentBackgroundColor || 'transparent',
    };

    if (contentPadding) {
      baseStyle.paddingHorizontal = theme.spacing.base.lg;
    }

    return baseStyle;
  };

  // Get scroll content styles
  const getScrollContentStyles = (): ViewStyle => {
    return {
      flexGrow: 1,
      paddingBottom: tabs ? theme.spacing.base.xl : theme.spacing.base.lg,
    };
  };

  // Render background pattern
  const renderBackgroundPattern = () => {
    if (!backgroundPattern) return null;

    return (
      <View style={StyleSheet.absoluteFill}>
        <BackgroundPattern
          color={colors.primary.main}
          opacity={0.05}
        />
      </View>
    );
  };

  // Render header
  const renderHeader = () => {
    return (
      <Header
        title={header.title}
        subtitle={header.subtitle}
        leftAction={header.leftAction}
        rightActions={header.rightActions}
        style={headerStyle}
        backgroundColor={backgroundColor || colors.background.primary}
        testID={testID ? `${testID}-header` : 'dashboard-header'}
      />
    );
  };

  // Render content
  const renderContent = () => {
    const contentContainer = (
      <View style={[getContentContainerStyles(), contentStyle]}>
        {children}
      </View>
    );

    if (scrollable) {
      return (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={getScrollContentStyles()}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'handled'}
          testID={testID ? `${testID}-scroll` : 'dashboard-scroll'}
        >
          {contentContainer}
        </ScrollView>
      );
    }

    return contentContainer;
  };

  // Render tab bar
  const renderTabBar = () => {
    if (!tabs || tabs.length === 0) return null;

    return (
      <TabBar
        tabs={tabs}
        activeTab={activeTab || tabs[0]?.id}
        onTabPress={onTabChange || (() => {})}
        style={tabBarStyle}
        testID={testID ? `${testID}-tabbar` : 'dashboard-tabbar'}
      />
    );
  };

  // Main container component
  const Container = safeArea ? SafeAreaView : View;

  return (
    <Container
      style={[getContainerStyles(), style]}
      accessibilityLabel={accessibilityLabel || 'Dashboard'}
      testID={testID || 'dashboard-template'}
    >
      {/* Status bar configuration */}
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
        backgroundColor={backgroundColor || colors.background.primary}
        translucent={false}
      />

      {/* Background pattern */}
      {renderBackgroundPattern()}

      {/* Header */}
      {renderHeader()}

      {/* Content */}
      {renderContent()}

      {/* Tab bar */}
      {renderTabBar()}
    </Container>
  );
};

// Internal styles
const styles = StyleSheet.create({
  // Add any internal styles if needed
});

// Export default
export default DashboardTemplate;