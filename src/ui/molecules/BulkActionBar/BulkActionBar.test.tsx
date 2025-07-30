/**
 * BulkActionBar Component Tests
 * 
 * Comprehensive test suite for the BulkActionBar component,
 * covering rendering, interactions, and accessibility.
 */

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { BulkActionBar } from './BulkActionBar';
import { ThemeContextType } from '@context/ThemeContext';
import { theme } from '@design-system';

// Mock dependencies
jest.mock('../../../context/ThemeContext');
jest.mock('../../atoms/Typography', () => ({
  Typography: ({ children, ...props }: any) => (
    <span {...props}>{children}</span>
  ),
}));
jest.mock('../../atoms/Button', () => ({
  Button: ({ children, onPress, testID, ...props }: any) => (
    <button onClick={onPress} data-testid={testID} {...props}>
      {children}
    </button>
  ),
}));

// Test wrapper with theme context
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeContext.Provider value={{ theme, setRole: jest.fn(), currentRole: null, isDarkMode: false, toggleDarkMode: jest.fn() }}>
    {children}
  </ThemeContext.Provider>
);

describe('BulkActionBar', () => {
  const defaultProps = {
    selectedCount: 0,
    totalVisible: 10,
    onSelectAll: jest.fn(),
    onClearSelection: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders correctly with no selections', () => {
      render(
        <TestWrapper>
          <BulkActionBar {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText('No students selected', { exact: false })).toBeTruthy();
      expect(screen.getByText('Select all (10)')).toBeTruthy();
      expect(screen.queryByText('Clear')).toBeFalsy();
    });

    it('renders correctly with some selections', () => {
      render(
        <TestWrapper>
          <BulkActionBar {...defaultProps} selectedCount={3} />
        </TestWrapper>
      );

      expect(screen.getByText('3 students selected', { exact: false })).toBeTruthy();
      expect(screen.getByText('Select all (10)')).toBeTruthy();
      expect(screen.getByText('Clear')).toBeTruthy();
    });

    it('renders correctly with all selections', () => {
      render(
        <TestWrapper>
          <BulkActionBar {...defaultProps} selectedCount={10} totalVisible={10} />
        </TestWrapper>
      );

      expect(screen.getByText('10 students selected', { exact: false })).toBeTruthy();
      expect(screen.getByText('All selected')).toBeTruthy();
      expect(screen.getByText('Clear')).toBeTruthy();
    });

    it('renders with custom testID', () => {
      render(
        <TestWrapper>
          <BulkActionBar {...defaultProps} testID="custom-bulk-action-bar" />
        </TestWrapper>
      );

      expect(screen.getByTestId('custom-bulk-action-bar')).toBeTruthy();
    });
  });

  describe('Interactions', () => {
    it('calls onSelectAll when Select all button is pressed', () => {
      const onSelectAll = jest.fn();
      render(
        <TestWrapper>
          <BulkActionBar {...defaultProps} onSelectAll={onSelectAll} />
        </TestWrapper>
      );

      fireEvent.press(screen.getByText('Select all'));
      expect(onSelectAll).toHaveBeenCalledTimes(1);
    });

    it('calls onClearSelection when Clear button is pressed', () => {
      const onClearSelection = jest.fn();
      render(
        <TestWrapper>
          <BulkActionBar
            {...defaultProps}
            selectedCount={3}
            onClearSelection={onClearSelection}
          />
        </TestWrapper>
      );

      fireEvent.press(screen.getByText('Clear'));
      expect(onClearSelection).toHaveBeenCalledTimes(1);
    });

    it('does not call callbacks when disabled', () => {
      const onSelectAll = jest.fn();
      const onClearSelection = jest.fn();
      render(
        <TestWrapper>
          <BulkActionBar
            {...defaultProps}
            selectedCount={3}
            onSelectAll={onSelectAll}
            onClearSelection={onClearSelection}
            disabled={true}
          />
        </TestWrapper>
      );

      fireEvent.press(screen.getByText('Select all'));
      fireEvent.press(screen.getByText('Clear'));
      
      expect(onSelectAll).not.toHaveBeenCalled();
      expect(onClearSelection).not.toHaveBeenCalled();
    });
  });

  describe('Button States', () => {
    it('shows Select all button when not all items are selected', () => {
      render(
        <TestWrapper>
          <BulkActionBar {...defaultProps} selectedCount={5} totalVisible={10} />
        </TestWrapper>
      );

      expect(screen.getByText('Select all (10)')).toBeTruthy();
    });

    it('shows Select all button even when all items are selected', () => {
      render(
        <TestWrapper>
          <BulkActionBar {...defaultProps} selectedCount={10} totalVisible={10} />
        </TestWrapper>
      );

      expect(screen.getByText('All selected')).toBeTruthy();
    });

    it('shows Clear button only when items are selected', () => {
      const { rerender } = render(
        <TestWrapper>
          <BulkActionBar {...defaultProps} selectedCount={0} />
        </TestWrapper>
      );

      expect(screen.queryByText('Clear')).toBeFalsy();

      rerender(
        <TestWrapper>
          <BulkActionBar {...defaultProps} selectedCount={1} />
        </TestWrapper>
      );

      expect(screen.getByText('Clear')).toBeTruthy();
    });
  });

  describe('Selection Count Display', () => {
    it('displays correct count for single selection', () => {
      render(
        <TestWrapper>
          <BulkActionBar {...defaultProps} selectedCount={1} />
        </TestWrapper>
      );

      expect(screen.getByText('1 student selected', { exact: false })).toBeTruthy();
    });

    it('displays correct count for multiple selections', () => {
      render(
        <TestWrapper>
          <BulkActionBar {...defaultProps} selectedCount={25} />
        </TestWrapper>
      );

      expect(screen.getByText('25 students selected', { exact: false })).toBeTruthy();
    });

    it('displays zero count correctly', () => {
      render(
        <TestWrapper>
          <BulkActionBar {...defaultProps} selectedCount={0} />
        </TestWrapper>
      );

      expect(screen.getByText(/No students? selected/)).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('has proper accessibility labels', () => {
      render(
        <TestWrapper>
          <BulkActionBar {...defaultProps} selectedCount={3} />
        </TestWrapper>
      );

      expect(screen.getByTestId('bulk-action-bar')).toBeTruthy();
      expect(screen.getByTestId('bulk-action-bar-select-all')).toBeTruthy();
      expect(screen.getByTestId('bulk-action-bar-clear')).toBeTruthy();
    });

    it('provides proper accessibility hints', () => {
      render(
        <TestWrapper>
          <BulkActionBar {...defaultProps} selectedCount={3} totalVisible={10} />
        </TestWrapper>
      );

      const selectAllButton = screen.getByTestId('bulk-action-bar-select-all');
      const clearButton = screen.getByTestId('bulk-action-bar-clear');

      expect(selectAllButton.props.accessibilityHint).toBe('Select all 10 visible students');
      expect(clearButton.props.accessibilityHint).toBe('Clear all selected students');
    });
  });

  describe('Edge Cases', () => {
    it('handles zero total visible items', () => {
      render(
        <TestWrapper>
          <BulkActionBar {...defaultProps} totalVisible={0} />
        </TestWrapper>
      );

      expect(screen.getByText(/No students? selected/)).toBeTruthy();
      expect(screen.queryByText('Select all')).toBeFalsy();
    });

    it('handles negative selected count gracefully', () => {
      render(
        <TestWrapper>
          <BulkActionBar {...defaultProps} selectedCount={-1} />
        </TestWrapper>
      );

      expect(screen.getByText('No students selected')).toBeTruthy();
    });

    it('handles selected count greater than total visible', () => {
      render(
        <TestWrapper>
          <BulkActionBar {...defaultProps} selectedCount={15} totalVisible={10} />
        </TestWrapper>
      );

      expect(screen.getByText('15 students selected', { exact: false })).toBeTruthy();
    });
  });

  describe('Performance', () => {
    it('does not re-render unnecessarily', () => {
      const onSelectAll = jest.fn();
      const onClearSelection = jest.fn();
      
      const { rerender } = render(
        <TestWrapper>
          <BulkActionBar
            {...defaultProps}
            selectedCount={3}
            onSelectAll={onSelectAll}
            onClearSelection={onClearSelection}
          />
        </TestWrapper>
      );

      // Re-render with same props
      rerender(
        <TestWrapper>
          <BulkActionBar
            {...defaultProps}
            selectedCount={3}
            onSelectAll={onSelectAll}
            onClearSelection={onClearSelection}
          />
        </TestWrapper>
      );

      // Component should still be functional
      expect(screen.getByText('3 students selected', { exact: false })).toBeTruthy();
    });
  });
});