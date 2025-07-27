import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

  return (
    <View style={styles.container}>
      {hasHiddenItems && (
        <>
          <TouchableOpacity
            style={styles.ellipsisButton}
            onPress={() => {
              // Navigate back to the first hidden item
              const firstHiddenItem = items[0];
              onNavigate(firstHiddenItem.path, firstHiddenItem.params);
            }}
          >
            <Text style={styles.ellipsisText}>...</Text>
          </TouchableOpacity>
          <Text style={styles.separator}>{separator}</Text>
        </>
      )}
      
      {visibleItems.map((item, index) => {
        const isLast = index === visibleItems.length - 1;
        const isClickable = !isLast;
        
        return (
          <React.Fragment key={`${item.path}-${index}`}>
            <TouchableOpacity
              style={[styles.item, isClickable && styles.clickableItem]}
              onPress={() => handleItemPress(item, index)}
              disabled={!isClickable}
            >
              <Text style={[styles.label, isLast && styles.currentLabel]}>
                {item.label}
              </Text>
            </TouchableOpacity>
            
            {!isLast && (
              <Text style={styles.separator}>{separator}</Text>
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clickableItem: {
    opacity: 0.8,
  },
  label: {
    fontSize: 14,
    color: '#6c757d',
  },
  currentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  separator: {
    fontSize: 14,
    color: '#adb5bd',
    marginHorizontal: 4,
  },
  ellipsisButton: {
    paddingHorizontal: 4,
  },
  ellipsisText: {
    fontSize: 14,
    color: '#6c757d',
  },
});