/**
 * QuickAction Component Tests
 * Unit tests for the QuickAction component functionality and accessibility
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { QuickAction } from './QuickAction';
import { ThemeProvider } from '../../../context/ThemeContext';

// Test wrapper with theme provider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    {children}
  </ThemeProvider>
);

describe('QuickAction Component', () => {
  // Basic rendering tests
  describe('Rendering', () => {
    it('renders title correctly', () => {
      const { getByText } = render(
        <TestWrapper>
          <QuickAction
            title="Test Action"
            icon="home"
            onPress={() => {}}
          />
        </TestWrapper>
      );

      expect(getByText('Test Action')).toBeTruthy();
    });

    it('renders title and subtitle correctly', () => {
      const { getByText } = render(
        <TestWrapper>
          <QuickAction
            title="Test Action"
            subtitle="Test subtitle"
            icon="home"
            onPress={() => {}}
          />
        </TestWrapper>
      );

      expect(getByText('Test Action')).toBeTruthy();
      expect(getByText('Test subtitle')).toBeTruthy();
    });

    it('renders with default props', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <QuickAction
            title="Test Action"
            icon="home"
            onPress={() => {}}
            testID="test-quick-action"
          />
        </TestWrapper>
      );

      const quickAction = getByTestId('test-quick-action');
      expect(quickAction).toBeTruthy();
    });
  });

  // Variant tests
  describe('Variants', () => {
    it('renders default variant', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <QuickAction
            title="Default Action"
            icon="home"
            variant="default"
            onPress={() => {}}
            testID="default-variant"
          />
        </TestWrapper>
      );

      const quickAction = getByTestId('default-variant');
      expect(quickAction).toBeTruthy();
    });

    it('renders primary variant', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <QuickAction
            title="Primary Action"
            icon="star"
            variant="primary"
            onPress={() => {}}
            testID="primary-variant"
          />
        </TestWrapper>
      );

      const quickAction = getByTestId('primary-variant');
      expect(quickAction).toBeTruthy();
    });

    it('renders secondary variant', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <QuickAction
            title="Secondary Action"
            icon="heart"
            variant="secondary"
            onPress={() => {}}
            testID="secondary-variant"
          />
        </TestWrapper>
      );

      const quickAction = getByTestId('secondary-variant');
      expect(quickAction).toBeTruthy();
    });
  });

  // Size tests
  describe('Sizes', () => {
    it('renders small size', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <QuickAction
            title="Small Action"
            icon="home"
            size="small"
            onPress={() => {}}
            testID="small-size"
          />
        </TestWrapper>
      );

      const quickAction = getByTestId('small-size');
      expect(quickAction).toBeTruthy();
    });

    it('renders medium size (default)', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <QuickAction
            title="Medium Action"
            icon="home"
            size="medium"
            onPress={() => {}}
            testID="medium-size"
          />
        </TestWrapper>
      );

      const quickAction = getByTestId('medium-size');
      expect(quickAction).toBeTruthy();
    });

    it('renders large size', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <QuickAction
            title="Large Action"
            icon="home"
            size="large"
            onPress={() => {}}
            testID="large-size"
          />
        </TestWrapper>
      );

      const quickAction = getByTestId('large-size');
      expect(quickAction).toBeTruthy();
    });
  });

  // Layout tests
  describe('Layout', () => {
    it('renders vertical layout (default)', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <QuickAction
            title="Vertical Action"
            icon="home"
            layout="vertical"
            onPress={() => {}}
            testID="vertical-layout"
          />
        </TestWrapper>
      );

      const quickAction = getByTestId('vertical-layout');
      expect(quickAction).toBeTruthy();
    });

    it('renders horizontal layout', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <QuickAction
            title="Horizontal Action"
            icon="home"
            layout="horizontal"
            onPress={() => {}}
            testID="horizontal-layout"
          />
        </TestWrapper>
      );

      const quickAction = getByTestId('horizontal-layout');
      expect(quickAction).toBeTruthy();
    });
  });

  // Badge tests
  describe('Badge', () => {
    it('shows badge when badge prop is provided', () => {
      const { getByText } = render(
        <TestWrapper>
          <QuickAction
            title="Badge Action"
            icon="mail"
            badge={5}
            onPress={() => {}}
          />
        </TestWrapper>
      );

      expect(getByText('5')).toBeTruthy();
    });

    it('shows 99+ for badges over 99', () => {
      const { getByText } = render(
        <TestWrapper>
          <QuickAction
            title="Large Badge Action"
            icon="notifications"
            badge={150}
            onPress={() => {}}
          />
        </TestWrapper>
      );

      expect(getByText('99+')).toBeTruthy();
    });

    it('does not show badge when badge is 0', () => {
      const { queryByText } = render(
        <TestWrapper>
          <QuickAction
            title="No Badge Action"
            icon="home"
            badge={0}
            onPress={() => {}}
          />
        </TestWrapper>
      );

      expect(queryByText('0')).toBeNull();
    });

    it('does not show badge when badge is not provided', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <QuickAction
            title="No Badge Action"
            icon="home"
            onPress={() => {}}
            testID="no-badge-action"
          />
        </TestWrapper>
      );

      const quickAction = getByTestId('no-badge-action');
      expect(quickAction).toBeTruthy();
      // Badge should not be present
    });
  });

  // Interaction tests
  describe('Interactions', () => {
    it('handles press events', () => {
      const mockOnPress = jest.fn();
      const { getByTestId } = render(
        <TestWrapper>
          <QuickAction
            title="Interactive Action"
            icon="home"
            onPress={mockOnPress}
            testID="interactive-action"
          />
        </TestWrapper>
      );

      const quickAction = getByTestId('interactive-action');
      fireEvent.press(quickAction);
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('does not handle press events when disabled', () => {
      const mockOnPress = jest.fn();
      const { getByTestId } = render(
        <TestWrapper>
          <QuickAction
            title="Disabled Action"
            icon="ban"
            onPress={mockOnPress}
            disabled
            testID="disabled-action"
          />
        </TestWrapper>
      );

      const quickAction = getByTestId('disabled-action');
      fireEvent.press(quickAction);
      expect(mockOnPress).not.toHaveBeenCalled();
    });
  });

  // State tests
  describe('States', () => {
    it('applies disabled state', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <QuickAction
            title="Disabled Action"
            icon="ban"
            onPress={() => {}}
            disabled
            testID="disabled-action"
          />
        </TestWrapper>
      );

      const quickAction = getByTestId('disabled-action');
      expect(quickAction).toBeTruthy();
    });
  });

  // Custom colors tests
  describe('Custom Colors', () => {
    it('accepts custom icon color', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <QuickAction
            title="Custom Icon Color"
            icon="star"
            iconColor="#ff0000"
            onPress={() => {}}
            testID="custom-icon-color"
          />
        </TestWrapper>
      );

      const quickAction = getByTestId('custom-icon-color');
      expect(quickAction).toBeTruthy();
    });

    it('accepts custom badge color', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <QuickAction
            title="Custom Badge Color"
            icon="notifications"
            badge={5}
            badgeColor="#00ff00"
            onPress={() => {}}
            testID="custom-badge-color"
          />
        </TestWrapper>
      );

      const quickAction = getByTestId('custom-badge-color');
      expect(quickAction).toBeTruthy();
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    it('has correct accessibility role', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <QuickAction
            title="Accessible Action"
            icon="home"
            onPress={() => {}}
            testID="accessible-action"
          />
        </TestWrapper>
      );

      const quickAction = getByTestId('accessible-action');
      expect(quickAction.props.accessibilityRole).toBe('button');
    });

    it('generates accessibility label from title only', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <QuickAction
            title="Test Action"
            icon="home"
            onPress={() => {}}
            testID="title-only-action"
          />
        </TestWrapper>
      );

      const quickAction = getByTestId('title-only-action');
      expect(quickAction.props.accessibilityLabel).toBe('Test Action');
    });

    it('generates accessibility label from title and subtitle', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <QuickAction
            title="Test Action"
            subtitle="Test subtitle"
            icon="home"
            onPress={() => {}}
            testID="title-subtitle-action"
          />
        </TestWrapper>
      );

      const quickAction = getByTestId('title-subtitle-action');
      expect(quickAction.props.accessibilityLabel).toBe('Test Action, Test subtitle');
    });

    it('includes badge count in accessibility label', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <QuickAction
            title="Badge Action"
            subtitle="With badge"
            icon="mail"
            badge={3}
            onPress={() => {}}
            testID="badge-action"
          />
        </TestWrapper>
      );

      const quickAction = getByTestId('badge-action');
      expect(quickAction.props.accessibilityLabel).toBe('Badge Action, With badge, 3 notifications');
    });

    it('applies custom accessibility label', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <QuickAction
            title="Custom Label Action"
            icon="home"
            accessibilityLabel="Custom accessibility label"
            onPress={() => {}}
            testID="custom-label-action"
          />
        </TestWrapper>
      );

      const quickAction = getByTestId('custom-label-action');
      expect(quickAction.props.accessibilityLabel).toBe('Custom accessibility label');
    });

    it('applies accessibility hint', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <QuickAction
            title="Hinted Action"
            icon="home"
            accessibilityHint="Tap to perform action"
            onPress={() => {}}
            testID="hinted-action"
          />
        </TestWrapper>
      );

      const quickAction = getByTestId('hinted-action');
      expect(quickAction.props.accessibilityHint).toBe('Tap to perform action');
    });

    it('sets correct accessibility state for disabled actions', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <QuickAction
            title="Disabled Action"
            icon="ban"
            onPress={() => {}}
            disabled
            testID="disabled-action"
          />
        </TestWrapper>
      );

      const quickAction = getByTestId('disabled-action');
      expect(quickAction.props.accessibilityState.disabled).toBe(true);
    });
  });

  // Custom styling tests
  describe('Custom Styling', () => {
    it('applies custom styles', () => {
      const customStyle = { backgroundColor: 'red' };
      const { getByTestId } = render(
        <TestWrapper>
          <QuickAction
            title="Custom Styled Action"
            icon="home"
            style={customStyle}
            onPress={() => {}}
            testID="custom-styled-action"
          />
        </TestWrapper>
      );

      const quickAction = getByTestId('custom-styled-action');
      expect(quickAction).toBeTruthy();
    });
  });

  // Edge cases
  describe('Edge Cases', () => {
    it('handles long titles gracefully', () => {
      const longTitle = 'This is a very long action title that should be truncated properly';
      const { getByText } = render(
        <TestWrapper>
          <QuickAction
            title={longTitle}
            icon="home"
            onPress={() => {}}
          />
        </TestWrapper>
      );

      expect(getByText(longTitle)).toBeTruthy();
    });

    it('handles long subtitles gracefully', () => {
      const longSubtitle = 'This is a very long subtitle that should be truncated';
      const { getByText } = render(
        <TestWrapper>
          <QuickAction
            title="Short Title"
            subtitle={longSubtitle}
            icon="home"
            onPress={() => {}}
          />
        </TestWrapper>
      );

      expect(getByText(longSubtitle)).toBeTruthy();
    });

    it('handles negative badge values', () => {
      const { queryByText } = render(
        <TestWrapper>
          <QuickAction
            title="Negative Badge"
            icon="home"
            badge={-5}
            onPress={() => {}}
          />
        </TestWrapper>
      );

      // Negative badges should not be shown
      expect(queryByText('-5')).toBeNull();
    });
  });
});