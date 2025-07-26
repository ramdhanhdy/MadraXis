/**
 * BulkActionBar Component
 * 
 * Shows selected student count and provides bulk action buttons.
 * Appears when students are selected and provides options to:
 * - Select all visible students
 * - Clear all selections
 * - View selection count
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme, useColors } from '../../../context/ThemeContext';
import { Typography } from '../../atoms/Typography';
import { Button } from '../../atoms/Button';

// Props interface
export interface BulkActionBarProps {
  selectedCount: number;
  totalVisible: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
}

// Main component
export const BulkActionBar: React.FC<BulkActionBarProps> = ({
  selectedCount,
  totalVisible,
  onSelectAll,
  onClearSelection,
  disabled = false,
  style,
  testID,
}) => {
  const { theme } = useTheme();
  const colors = useColors();

  // Check if all visible students are selected
  const allSelected = selectedCount === totalVisible && totalVisible > 0;

  // Get selection text
  const getSelectionText = (): string => {
    if (selectedCount === 0) return 'No students selected';
    if (selectedCount === 1) return '1 student selected';
    return `${selectedCount} students selected`;
  };

  // Get select all button text
  const getSelectAllText = (): string => {
    return allSelected ? 'All selected' : `Select all (${totalVisible})`;
  };

  return (
    <View 
      style={[styles.container, style]}
      testID={testID}
    >
      {/* Selection Count */}
      <View style={styles.countContainer}>
        <Typography
          variant="body2"
          color="primary"
          style={styles.countText}
        >
          {getSelectionText()}
        </Typography>
        
        {totalVisible > 0 && (
          <Typography
            variant="caption"
            color="secondary"
            style={styles.totalText}
          >
            of {totalVisible} visible
          </Typography>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        {/* Select All Button */}
        {totalVisible > 0 && (
          <Button
            variant={allSelected ? 'secondary' : 'outline'}
            size="small"
            onPress={onSelectAll}
            disabled={disabled || allSelected}
            style={styles.actionButton}
            icon={allSelected ? 'checkmark-done' : 'checkmark-circle-outline'}
          >
            {getSelectAllText()}
          </Button>
        )}

        {/* Clear Selection Button */}
        {selectedCount > 0 && (
          <Button
            variant="ghost"
            size="small"
            onPress={onClearSelection}
            disabled={disabled}
            style={styles.actionButton}
            icon="close-circle-outline"
          >
            Clear
          </Button>
        )}
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  countContainer: {
    flex: 1,
  },
  countText: {
    fontWeight: '600',
    marginBottom: 2,
  },
  totalText: {
    fontSize: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    minWidth: 80,
  },
});

export default BulkActionBar;