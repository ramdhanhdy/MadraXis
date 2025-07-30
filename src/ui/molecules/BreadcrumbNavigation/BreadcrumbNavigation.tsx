import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../design-system';
import { NavigationComponentTheme } from '../../../design-system/core/types';

export interface BreadcrumbItem {
  label: string;
  path: string;
  params?: Record<string, any>;
}

export interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[];
  onNavigate: (path: string, params?: Record<string, any>) => void;
  separator?: string;
  maxVisibleItems?: number;
}

/**
 * Breadcrumb navigation component for hierarchical navigation
 * Shows the current location in the navigation flow
 */
export const BreadcrumbNavigation: React.FC<BreadcrumbNavigationProps> = ({
  items,
  onNavigate,
  separator = ' › ',
  maxVisibleItems = 3,
}) => {
  const { theme } = useTheme();
  const navigationTheme: NavigationComponentTheme = theme.componentThemes.navigation;
  const colors = theme.colors;

  if (items.length === 0) {
    return null;
  }

  // Limit visible items based on maxVisibleItems
  const visibleItems = items.slice(-maxVisibleItems);
  const hasHiddenItems = items.length > maxVisibleItems;

  const handleItemPress = (item: BreadcrumbItem, index: number) => {
    // Only allow navigation to previous items (not current)
    if (index < visibleItems.length - 1) {
      onNavigate(item.path, item.params);
    }
  };

  // Create dynamic styles using design system
  const dynamicStyles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: navigationTheme.padding.horizontal,
      paddingVertical: navigationTheme.padding.vertical,
      backgroundColor: navigationTheme.backgroundColor,
      borderBottomWidth: 1,
      borderBottomColor: colors.border?.primary || colors.neutral?.[300] || '#e9ecef',
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    clickableItem: {
      opacity: 0.8,
    },
    label: {
      fontSize: theme.typography?.fontSize?.sm || 14,
      color: colors.text?.secondary || colors.neutral?.[600] || '#6c757d',
    },
    currentLabel: {
      fontSize: theme.typography?.fontSize?.sm || 14,
      fontWeight: theme.typography?.fontWeight?.semibold || '600',
      color: navigationTheme.accentColor,
    },
    separator: {
      fontSize: theme.typography?.fontSize?.sm || 14,
      color: colors.text?.tertiary || colors.neutral?.[400] || '#adb5bd',
      marginHorizontal: 4,
    },
    ellipsisButton: {
      paddingHorizontal: 4,
    },
    ellipsisText: {
      fontSize: theme.typography?.fontSize?.sm || 14,
      color: colors.text?.secondary || colors.neutral?.[600] || '#6c757d',
    },
  });

  return (
    <View style={dynamicStyles.container}>
      {hasHiddenItems && (
        <>
          <TouchableOpacity
            style={dynamicStyles.ellipsisButton}
            onPress={() => {
              // Navigate back to the first hidden item
              const firstHiddenItem = items[0];
              onNavigate(firstHiddenItem.path, firstHiddenItem.params);
            }}
          >
            <Text style={dynamicStyles.ellipsisText}>...</Text>
          </TouchableOpacity>
          <Text style={dynamicStyles.separator}>{separator}</Text>
        </>
      )}

      {visibleItems.map((item, index) => {
        const isLast = index === visibleItems.length - 1;
        const isClickable = !isLast;

        return (
          <React.Fragment key={`${item.path}-${index}`}>
            <TouchableOpacity
              style={[dynamicStyles.item, isClickable && dynamicStyles.clickableItem]}
              onPress={() => handleItemPress(item, index)}
              disabled={!isClickable}
            >
              <Text style={[dynamicStyles.label, isLast && dynamicStyles.currentLabel]}>
                {item.label}
              </Text>
            </TouchableOpacity>

            {!isLast && (
              <Text style={dynamicStyles.separator}>{separator}</Text>
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

