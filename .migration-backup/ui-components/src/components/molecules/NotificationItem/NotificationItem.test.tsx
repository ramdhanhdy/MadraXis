/**
 * NotificationItem Component Tests
 * Unit tests for the NotificationItem component functionality and accessibility
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NotificationItem } from './NotificationItem';
import { ThemeProvider } from '../../../context/ThemeContext';

// Test wrapper with theme provider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    {children}
  </ThemeProvider>
);

describe('NotificationItem Component', () => {
  // Basic rendering tests
  describe('Rendering', () => {
    it('renders title and message correctly', () => {
      const { getByText } = render(
        <TestWrapper>
          <NotificationItem
            title="Test Title"
            message="Test message content"
          />
        </TestWrapper>
      );

      expect(getByText('Test Title')).toBeTruthy();
      expect(getByText('Test message content')).toBeTruthy();
    });

    it('renders with timestamp', () => {
      const { getByText } = render(
        <TestWrapper>
          <NotificationItem
            title="Test Title"
            message="Test message"
            timestamp="2 hours ago"
          />
        </TestWrapper>
      );

      expect(getByText('2 hours ago')).toBeTruthy();
    });

    it('renders with default props', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <NotificationItem
            title="Test Title"
            message="Test message"
            testID="test-notification"
          />
        </TestWrapper>
      );

      const notification = getByTestId('test-notification');
      expect(notification).toBeTruthy();
    });
  });

  // Type tests
  describe('Notification Types', () => {
    it('renders info type (default)', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <NotificationItem
            title="Info Notification"
            message="Info message"
            type="info"
            testID="info-notification"
          />
        </TestWrapper>
      );

      const notification = getByTestId('info-notification');
      expect(notification).toBeTruthy();
    });

    it('renders success type', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <NotificationItem
            title="Success Notification"
            message="Success message"
            type="success"
            testID="success-notification"
          />
        </TestWrapper>
      );

      const notification = getByTestId('success-notification');
      expect(notification).toBeTruthy();
    });

    it('renders warning type', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <NotificationItem
            title="Warning Notification"
            message="Warning message"
            type="warning"
            testID="warning-notification"
          />
        </TestWrapper>
      );

      const notification = getByTestId('warning-notification');
      expect(notification).toBeTruthy();
    });

    it('renders error type', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <NotificationItem
            title="Error Notification"
            message="Error message"
            type="error"
            testID="error-notification"
          />
        </TestWrapper>
      );

      const notification = getByTestId('error-notification');
      expect(notification).toBeTruthy();
    });
  });

  // Read state tests
  describe('Read States', () => {
    it('renders unread state (default)', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <NotificationItem
            title="Unread Notification"
            message="Unread message"
            read={false}
            testID="unread-notification"
          />
        </TestWrapper>
      );

      const notification = getByTestId('unread-notification');
      expect(notification).toBeTruthy();
    });

    it('renders read state', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <NotificationItem
            title="Read Notification"
            message="Read message"
            read={true}
            testID="read-notification"
          />
        </TestWrapper>
      );

      const notification = getByTestId('read-notification');
      expect(notification).toBeTruthy();
    });
  });

  // Icon tests
  describe('Icons', () => {
    it('uses default icon for type', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <NotificationItem
            title="Default Icon"
            message="Uses type-based icon"
            type="success"
            testID="default-icon-notification"
          />
        </TestWrapper>
      );

      const notification = getByTestId('default-icon-notification');
      expect(notification).toBeTruthy();
    });

    it('uses custom icon when provided', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <NotificationItem
            title="Custom Icon"
            message="Uses custom icon"
            icon="star"
            testID="custom-icon-notification"
          />
        </TestWrapper>
      );

      const notification = getByTestId('custom-icon-notification');
      expect(notification).toBeTruthy();
    });
  });

  // Interaction tests
  describe('Interactions', () => {
    it('handles press events when onPress is provided', () => {
      const mockOnPress = jest.fn();
      const { getByTestId } = render(
        <TestWrapper>
          <NotificationItem
            title="Interactive Notification"
            message="Tap to interact"
            onPress={mockOnPress}
            testID="interactive-notification"
          />
        </TestWrapper>
      );

      const notification = getByTestId('interactive-notification');
      fireEvent.press(notification);
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('handles dismiss events', () => {
      const mockOnDismiss = jest.fn();
      const { getByLabelText } = render(
        <TestWrapper>
          <NotificationItem
            title="Dismissible Notification"
            message="Can be dismissed"
            onDismiss={mockOnDismiss}
          />
        </TestWrapper>
      );

      const dismissButton = getByLabelText('Dismiss notification');
      fireEvent.press(dismissButton);
      expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    });

    it('handles action events', () => {
      const mockOnAction = jest.fn();
      const { getByText } = render(
        <TestWrapper>
          <NotificationItem
            title="Action Notification"
            message="Has action button"
            onAction={mockOnAction}
            actionLabel="Take Action"
          />
        </TestWrapper>
      );

      const actionButton = getByText('Take Action');
      fireEvent.press(actionButton);
      expect(mockOnAction).toHaveBeenCalledTimes(1);
    });

    it('renders as View when no onPress is provided', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <NotificationItem
            title="Static Notification"
            message="Not interactive"
            testID="static-notification"
          />
        </TestWrapper>
      );

      const notification = getByTestId('static-notification');
      expect(notification).toBeTruthy();
    });
  });

  // Dismiss button tests
  describe('Dismiss Button', () => {
    it('shows dismiss button by default when onDismiss is provided', () => {
      const { getByLabelText } = render(
        <TestWrapper>
          <NotificationItem
            title="Dismissible"
            message="Has dismiss button"
            onDismiss={() => {}}
          />
        </TestWrapper>
      );

      const dismissButton = getByLabelText('Dismiss notification');
      expect(dismissButton).toBeTruthy();
    });

    it('hides dismiss button when showDismiss is false', () => {
      const { queryByLabelText } = render(
        <TestWrapper>
          <NotificationItem
            title="No Dismiss"
            message="No dismiss button"
            onDismiss={() => {}}
            showDismiss={false}
          />
        </TestWrapper>
      );

      const dismissButton = queryByLabelText('Dismiss notification');
      expect(dismissButton).toBeNull();
    });

    it('does not show dismiss button when onDismiss is not provided', () => {
      const { queryByLabelText } = render(
        <TestWrapper>
          <NotificationItem
            title="No Dismiss Handler"
            message="No dismiss functionality"
          />
        </TestWrapper>
      );

      const dismissButton = queryByLabelText('Dismiss notification');
      expect(dismissButton).toBeNull();
    });
  });

  // Action button tests
  describe('Action Button', () => {
    it('shows action button when onAction and actionLabel are provided', () => {
      const { getByText } = render(
        <TestWrapper>
          <NotificationItem
            title="Action Notification"
            message="Has action"
            onAction={() => {}}
            actionLabel="Do Something"
          />
        </TestWrapper>
      );

      const actionButton = getByText('Do Something');
      expect(actionButton).toBeTruthy();
    });

    it('does not show action button when onAction is missing', () => {
      const { queryByText } = render(
        <TestWrapper>
          <NotificationItem
            title="No Action"
            message="No action handler"
            actionLabel="Do Something"
          />
        </TestWrapper>
      );

      const actionButton = queryByText('Do Something');
      expect(actionButton).toBeNull();
    });

    it('does not show action button when actionLabel is missing', () => {
      const { queryByRole } = render(
        <TestWrapper>
          <NotificationItem
            title="No Label"
            message="No action label"
            onAction={() => {}}
          />
        </TestWrapper>
      );

      // Should not find any button with role 'button' for action
      const buttons = queryByRole('button');
      expect(buttons).toBeNull();
    });
  });

  // Compact mode tests
  describe('Compact Mode', () => {
    it('renders in compact mode', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <NotificationItem
            title="Compact Notification"
            message="Compact layout"
            compact
            testID="compact-notification"
          />
        </TestWrapper>
      );

      const notification = getByTestId('compact-notification');
      expect(notification).toBeTruthy();
    });

    it('renders in normal mode by default', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <NotificationItem
            title="Normal Notification"
            message="Normal layout"
            testID="normal-notification"
          />
        </TestWrapper>
      );

      const notification = getByTestId('normal-notification');
      expect(notification).toBeTruthy();
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    it('sets correct accessibility role for interactive notifications', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <NotificationItem
            title="Interactive"
            message="Interactive notification"
            onPress={() => {}}
            testID="interactive-notification"
          />
        </TestWrapper>
      );

      const notification = getByTestId('interactive-notification');
      expect(notification.props.accessibilityRole).toBe('button');
    });

    it('sets correct accessibility role for static notifications', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <NotificationItem
            title="Static"
            message="Static notification"
            testID="static-notification"
          />
        </TestWrapper>
      );

      const notification = getByTestId('static-notification');
      expect(notification.props.accessibilityRole).toBe('text');
    });

    it('generates accessibility label from content', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <NotificationItem
            title="Test Title"
            message="Test message"
            type="success"
            timestamp="1 hour ago"
            testID="auto-label-notification"
          />
        </TestWrapper>
      );

      const notification = getByTestId('auto-label-notification');
      expect(notification.props.accessibilityLabel).toBe(
        'success notification: Test Title, Test message, 1 hour ago, unread'
      );
    });

    it('includes read status in accessibility label', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <NotificationItem
            title="Read Notification"
            message="Already read"
            read={true}
            testID="read-label-notification"
          />
        </TestWrapper>
      );

      const notification = getByTestId('read-label-notification');
      expect(notification.props.accessibilityLabel).toContain('read');
    });

    it('applies custom accessibility label', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <NotificationItem
            title="Custom Label"
            message="Custom accessibility"
            accessibilityLabel="Custom notification label"
            testID="custom-label-notification"
          />
        </TestWrapper>
      );

      const notification = getByTestId('custom-label-notification');
      expect(notification.props.accessibilityLabel).toBe('Custom notification label');
    });

    it('applies accessibility hint', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <NotificationItem
            title="Hinted Notification"
            message="Has accessibility hint"
            onPress={() => {}}
            accessibilityHint="Tap to view details"
            testID="hinted-notification"
          />
        </TestWrapper>
      );

      const notification = getByTestId('hinted-notification');
      expect(notification.props.accessibilityHint).toBe('Tap to view details');
    });

    it('provides proper accessibility for dismiss button', () => {
      const { getByLabelText } = render(
        <TestWrapper>
          <NotificationItem
            title="Dismissible"
            message="Can be dismissed"
            onDismiss={() => {}}
          />
        </TestWrapper>
      );

      const dismissButton = getByLabelText('Dismiss notification');
      expect(dismissButton.props.accessibilityRole).toBe('button');
      expect(dismissButton.props.accessibilityHint).toBe('Removes this notification');
    });
  });

  // Custom styling tests
  describe('Custom Styling', () => {
    it('applies custom styles', () => {
      const customStyle = { backgroundColor: 'red' };
      const { getByTestId } = render(
        <TestWrapper>
          <NotificationItem
            title="Custom Styled"
            message="Has custom styles"
            style={customStyle}
            testID="custom-styled-notification"
          />
        </TestWrapper>
      );

      const notification = getByTestId('custom-styled-notification');
      expect(notification).toBeTruthy();
    });
  });

  // Edge cases
  describe('Edge Cases', () => {
    it('handles long titles gracefully', () => {
      const longTitle = 'This is a very long notification title that should be truncated properly';
      const { getByText } = render(
        <TestWrapper>
          <NotificationItem
            title={longTitle}
            message="Short message"
          />
        </TestWrapper>
      );

      expect(getByText(longTitle)).toBeTruthy();
    });

    it('handles long messages gracefully', () => {
      const longMessage = 'This is a very long notification message that should be truncated properly when it exceeds the maximum number of lines allowed for display';
      const { getByText } = render(
        <TestWrapper>
          <NotificationItem
            title="Short Title"
            message={longMessage}
          />
        </TestWrapper>
      );

      expect(getByText(longMessage)).toBeTruthy();
    });

    it('handles empty timestamp', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <NotificationItem
            title="No Timestamp"
            message="No timestamp provided"
            testID="no-timestamp-notification"
          />
        </TestWrapper>
      );

      const notification = getByTestId('no-timestamp-notification');
      expect(notification).toBeTruthy();
    });
  });
});