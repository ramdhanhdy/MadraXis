/**
 * NavigationPanel Component Tests
 * Unit tests for the NavigationPanel component functionality and accessibility
 */

import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { NavigationPanel } from './NavigationPanel';
import { ThemeProvider } from '../../../context/ThemeContext';

// Test wrapper with theme provider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    {children}
  </ThemeProvider>
);

// Mock data
const mockNotifications = [
  {
    id: '1',
    title: 'Test Notification 1',
    message: 'Test message 1',
    type: 'info' as const,
    timestamp: '1 hour ago',
    read: false,
    onPress: jest.fn(),
    onDismiss: jest.fn(),
  },
  {
    id: '2',
    title: 'Test Notification 2',
    message: 'Test message 2',
    type: 'success' as const,
    timestamp: '2 hours ago',
    read: true,
    onPress: jest.fn(),
    onDismiss: jest.fn(),
  },
];

const mockNavigationItems = [
  {
    id: '1',
    title: 'Dashboard',
    subtitle: 'Overview',
    icon: 'home' as const,
    onPress: jest.fn(),
  },
  {
    id: '2',
    title: 'Messages',
    subtitle: 'View messages',
    icon: 'mail' as const,
    badge: 3,
    onPress: jest.fn(),
  },
];

describe('NavigationPanel Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // Clear all mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // Helper function to run timers
  const runTimers = () => {
    act(() => {
      jest.runAllTimers();
    });
  };

  // Basic rendering tests
  describe('Rendering', () => {
    it('renders with default props', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <NavigationPanel testID="test-panel" />
        </TestWrapper>
      );

      const panel = getByTestId('test-panel');
      expect(panel).toBeTruthy();
    });

    it('renders with title and subtitle', () => {
      const { getByText } = render(
        <TestWrapper>
          <NavigationPanel
            title="Test Panel"
            subtitle="Test subtitle"
          />
        </TestWrapper>
      );

      expect(getByText('Test Panel')).toBeTruthy();
      expect(getByText('Test subtitle')).toBeTruthy();
    });

    it('renders notifications panel', () => {
      const { getByText } = render(
        <TestWrapper>
          <NavigationPanel
            type="notifications"
            notifications={mockNotifications}
          />
        </TestWrapper>
      );

      expect(getByText('Test Notification 1')).toBeTruthy();
      expect(getByText('Test Notification 2')).toBeTruthy();
    });

    it('renders navigation panel', () => {
      const { getByText } = render(
        <TestWrapper>
          <NavigationPanel
            type="navigation"
            navigationItems={mockNavigationItems}
          />
        </TestWrapper>
      );

      expect(getByText('Dashboard')).toBeTruthy();
      expect(getByText('Messages')).toBeTruthy();
    });
  });

  // Type tests
  describe('Panel Types', () => {
    it('renders notifications type correctly', () => {
      const { getByText } = render(
        <TestWrapper>
          <NavigationPanel
            type="notifications"
            notifications={mockNotifications}
          />
        </TestWrapper>
      );

      expect(getByText('Notifications')).toBeTruthy();
    });

    it('renders navigation type correctly', () => {
      const { getByText } = render(
        <TestWrapper>
          <NavigationPanel
            type="navigation"
            navigationItems={mockNavigationItems}
          />
        </TestWrapper>
      );

      expect(getByText('Navigation')).toBeTruthy();
    });

    it('renders mixed type correctly', () => {
      const { getByText } = render(
        <TestWrapper>
          <NavigationPanel
            type="mixed"
            notifications={mockNotifications.slice(0, 1)}
            navigationItems={mockNavigationItems.slice(0, 1)}
          />
        </TestWrapper>
      );

      expect(getByText('Dashboard')).toBeTruthy();
      expect(getByText('Test Notification 1')).toBeTruthy();
    });
  });

  // Variant tests
  describe('Variants', () => {
    it('renders default variant', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <NavigationPanel
            variant="default"
            testID="default-panel"
          />
        </TestWrapper>
      );

      const panel = getByTestId('default-panel');
      expect(panel).toBeTruthy();
    });

    it('renders elevated variant', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <NavigationPanel
            variant="elevated"
            testID="elevated-panel"
          />
        </TestWrapper>
      );

      const panel = getByTestId('elevated-panel');
      expect(panel).toBeTruthy();
    });

    it('renders transparent variant', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <NavigationPanel
            variant="transparent"
            testID="transparent-panel"
          />
        </TestWrapper>
      );

      const panel = getByTestId('transparent-panel');
      expect(panel).toBeTruthy();
    });
  });

  // Header tests
  describe('Header', () => {
    it('shows header by default', () => {
      const { getByText } = render(
        <TestWrapper>
          <NavigationPanel title="Test Header" />
        </TestWrapper>
      );

      expect(getByText('Test Header')).toBeTruthy();
    });

    it('hides header when showHeader is false', () => {
      const { queryByText } = render(
        <TestWrapper>
          <NavigationPanel
            title="Hidden Header"
            showHeader={false}
          />
        </TestWrapper>
      );

      expect(queryByText('Hidden Header')).toBeNull();
    });

    it('shows unread count for notifications', () => {
      const { getByText } = render(
        <TestWrapper>
          <NavigationPanel
            type="notifications"
            notifications={mockNotifications}
          />
        </TestWrapper>
      );

      expect(getByText('1 unread')).toBeTruthy();
    });
  });

  // Action buttons tests
  describe('Action Buttons', () => {
    it('shows action buttons by default', () => {
      const mockOnRefresh = jest.fn();
      const { getByLabelText } = render(
        <TestWrapper>
          <NavigationPanel
            notifications={mockNotifications}
            onRefresh={mockOnRefresh}
          />
        </TestWrapper>
      );

      const refreshButton = getByLabelText('Refresh');
      expect(refreshButton).toBeTruthy();
    });

    it('hides action buttons when showActions is false', () => {
      const mockOnRefresh = jest.fn();
      const { queryByLabelText } = render(
        <TestWrapper>
          <NavigationPanel
            notifications={mockNotifications}
            onRefresh={mockOnRefresh}
            showActions={false}
          />
        </TestWrapper>
      );

      const refreshButton = queryByLabelText('Refresh');
      expect(refreshButton).toBeNull();
    });

    it('handles refresh action', () => {
      const mockOnRefresh = jest.fn();
      const { getByLabelText } = render(
        <TestWrapper>
          <NavigationPanel
            notifications={mockNotifications}
            onRefresh={mockOnRefresh}
          />
        </TestWrapper>
      );

      const refreshButton = getByLabelText('Refresh');
      fireEvent.press(refreshButton);
      expect(mockOnRefresh).toHaveBeenCalledTimes(1);
    });

    it('handles mark all read action', () => {
      const mockOnMarkAllRead = jest.fn();
      const { getByLabelText } = render(
        <TestWrapper>
          <NavigationPanel
            type="notifications"
            notifications={mockNotifications}
            onMarkAllRead={mockOnMarkAllRead}
          />
        </TestWrapper>
      );

      const markAllReadButton = getByLabelText('Mark all as read');
      fireEvent.press(markAllReadButton);
      expect(mockOnMarkAllRead).toHaveBeenCalledTimes(1);
    });

    it('handles clear all action', () => {
      const mockOnClearAll = jest.fn();
      const { getByLabelText } = render(
        <TestWrapper>
          <NavigationPanel
            notifications={mockNotifications}
            onClearAll={mockOnClearAll}
          />
        </TestWrapper>
      );

      const clearAllButton = getByLabelText('Clear all');
      fireEvent.press(clearAllButton);
      expect(mockOnClearAll).toHaveBeenCalledTimes(1);
    });

    it('does not show mark all read when no unread notifications', () => {
      const readNotifications = mockNotifications.map(n => ({ ...n, read: true }));
      const { queryByLabelText } = render(
        <TestWrapper>
          <NavigationPanel
            type="notifications"
            notifications={readNotifications}
            onMarkAllRead={() => {}}
          />
        </TestWrapper>
      );

      const markAllReadButton = queryByLabelText('Mark all as read');
      expect(markAllReadButton).toBeNull();
    });
  });

  // Navigation item tests
  describe('Navigation Items', () => {
    it('renders navigation items correctly', () => {
      const { getByText } = render(
        <TestWrapper>
          <NavigationPanel
            type="navigation"
            navigationItems={mockNavigationItems}
          />
        </TestWrapper>
      );

      expect(getByText('Dashboard')).toBeTruthy();
      expect(getByText('Overview')).toBeTruthy();
      expect(getByText('Messages')).toBeTruthy();
      expect(getByText('View messages')).toBeTruthy();
    });

    it('handles navigation item press', () => {
      const { getByText } = render(
        <TestWrapper>
          <NavigationPanel
            type="navigation"
            navigationItems={mockNavigationItems}
          />
        </TestWrapper>
      );

      const dashboardItem = getByText('Dashboard');
      fireEvent.press(dashboardItem);
      expect(mockNavigationItems[0].onPress).toHaveBeenCalledTimes(1);
    });

    it('shows badges on navigation items', () => {
      const { getByText } = render(
        <TestWrapper>
          <NavigationPanel
            type="navigation"
            navigationItems={mockNavigationItems}
          />
        </TestWrapper>
      );

      expect(getByText('3')).toBeTruthy();
    });

    it('handles disabled navigation items', () => {
      const disabledItems = [
        { ...mockNavigationItems[0], disabled: true },
      ];

      const { getByText } = render(
        <TestWrapper>
          <NavigationPanel
            type="navigation"
            navigationItems={disabledItems}
          />
        </TestWrapper>
      );

      const dashboardItem = getByText('Dashboard');
      fireEvent.press(dashboardItem);
      expect(mockNavigationItems[0].onPress).not.toHaveBeenCalled();
    });
  });

  // Empty state tests
  describe('Empty State', () => {
    it('shows empty state when no content', () => {
      const { getByText } = render(
        <TestWrapper>
          <NavigationPanel
            notifications={[]}
            navigationItems={[]}
          />
        </TestWrapper>
      );

      expect(getByText('No items')).toBeTruthy();
      expect(getByText('There are no items to display')).toBeTruthy();
    });

    it('shows custom empty state', () => {
      const { getByText } = render(
        <TestWrapper>
          <NavigationPanel
            notifications={[]}
            navigationItems={[]}
            emptyTitle="Custom Empty Title"
            emptyMessage="Custom empty message"
          />
        </TestWrapper>
      );

      expect(getByText('Custom Empty Title')).toBeTruthy();
      expect(getByText('Custom empty message')).toBeTruthy();
    });

    it('shows refresh button in empty state', () => {
      const mockOnRefresh = jest.fn();
      const { getByText } = render(
        <TestWrapper>
          <NavigationPanel
            notifications={[]}
            navigationItems={[]}
            onRefresh={mockOnRefresh}
          />
        </TestWrapper>
      );

      const refreshButton = getByText('Refresh');
      fireEvent.press(refreshButton);
      expect(mockOnRefresh).toHaveBeenCalledTimes(1);
    });
  });

  // Loading state tests
  describe('Loading State', () => {
    it('shows loading state', () => {
      const { getByText } = render(
        <TestWrapper>
          <NavigationPanel
            loading={true}
            notifications={[]}
            navigationItems={[]}
          />
        </TestWrapper>
      );

      expect(getByText('Loading...')).toBeTruthy();
    });

    it('shows content when loading with existing items', () => {
      const { getByText } = render(
        <TestWrapper>
          <NavigationPanel
            loading={true}
            notifications={mockNotifications}
          />
        </TestWrapper>
      );

      expect(getByText('Test Notification 1')).toBeTruthy();
    });

    it('handles loading animation', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <NavigationPanel
            loading={true}
            notifications={[]}
            testID="loading-panel"
          />
        </TestWrapper>
      );
      runTimers();

      const panel = getByTestId('loading-panel');
      expect(panel).toBeTruthy();
    });
  });

  // Scrollable content tests
  describe('Scrollable Content', () => {
    it('renders scrollable content by default', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <NavigationPanel
            notifications={mockNotifications}
            scrollable={true}
            testID="scrollable-panel"
          />
        </TestWrapper>
      );

      const panel = getByTestId('scrollable-panel');
      expect(panel).toBeTruthy();
    });

    it('renders non-scrollable content', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <NavigationPanel
            notifications={mockNotifications}
            scrollable={false}
            testID="non-scrollable-panel"
          />
        </TestWrapper>
      );

      const panel = getByTestId('non-scrollable-panel');
      expect(panel).toBeTruthy();
    });
  });

  // Max height tests
  describe('Max Height', () => {
    it('applies custom max height', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <NavigationPanel
            notifications={mockNotifications}
            maxHeight={300}
            testID="max-height-panel"
          />
        </TestWrapper>
      );

      const panel = getByTestId('max-height-panel');
      expect(panel).toBeTruthy();
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    it('has correct accessibility role', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <NavigationPanel testID="accessible-panel" />
        </TestWrapper>
      );

      const panel = getByTestId('accessible-panel');
      expect(panel.props.accessibilityRole).toBe('region');
    });

    it('applies custom accessibility label', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <NavigationPanel
            accessibilityLabel="Custom panel label"
            testID="custom-label-panel"
          />
        </TestWrapper>
      );

      const panel = getByTestId('custom-label-panel');
      expect(panel.props.accessibilityLabel).toBe('Custom panel label');
    });

    it('uses title as default accessibility label', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <NavigationPanel
            title="Test Panel Title"
            testID="title-label-panel"
          />
        </TestWrapper>
      );

      const panel = getByTestId('title-label-panel');
      expect(panel.props.accessibilityLabel).toBe('Test Panel Title');
    });

    it('provides proper accessibility for action buttons', () => {
      const { getByLabelText } = render(
        <TestWrapper>
          <NavigationPanel
            notifications={mockNotifications}
            onRefresh={() => {}}
            onMarkAllRead={() => {}}
            onClearAll={() => {}}
          />
        </TestWrapper>
      );

      const refreshButton = getByLabelText('Refresh');
      const markAllReadButton = getByLabelText('Mark all as read');
      const clearAllButton = getByLabelText('Clear all');

      expect(refreshButton.props.accessibilityRole).toBe('button');
      expect(markAllReadButton.props.accessibilityRole).toBe('button');
      expect(clearAllButton.props.accessibilityRole).toBe('button');
    });

    it('provides proper accessibility for navigation items', () => {
      const { getByText } = render(
        <TestWrapper>
          <NavigationPanel
            type="navigation"
            navigationItems={mockNavigationItems}
          />
        </TestWrapper>
      );

      const dashboardItem = getByText('Dashboard');
      expect(dashboardItem.props.accessibilityRole).toBe('button');
    });
  });

  // Custom styling tests
  describe('Custom Styling', () => {
    it('applies custom panel styles', () => {
      const customStyle = { borderWidth: 2 };
      const { getByTestId } = render(
        <TestWrapper>
          <NavigationPanel
            style={customStyle}
            testID="custom-styled-panel"
          />
        </TestWrapper>
      );

      const panel = getByTestId('custom-styled-panel');
      expect(panel).toBeTruthy();
    });

    it('applies custom header styles', () => {
      const customHeaderStyle = { backgroundColor: 'red' };
      const { getByTestId } = render(
        <TestWrapper>
          <NavigationPanel
            title="Custom Header"
            headerStyle={customHeaderStyle}
            testID="custom-header-panel"
          />
        </TestWrapper>
      );

      const panel = getByTestId('custom-header-panel');
      expect(panel).toBeTruthy();
    });

    it('applies custom content styles', () => {
      const customContentStyle = { padding: 20 };
      const { getByTestId } = render(
        <TestWrapper>
          <NavigationPanel
            notifications={mockNotifications}
            contentStyle={customContentStyle}
            testID="custom-content-panel"
          />
        </TestWrapper>
      );

      const panel = getByTestId('custom-content-panel');
      expect(panel).toBeTruthy();
    });
  });

  // Edge cases
  describe('Edge Cases', () => {
    it('handles empty arrays gracefully', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <NavigationPanel
            notifications={[]}
            navigationItems={[]}
            testID="empty-arrays-panel"
          />
        </TestWrapper>
      );

      const panel = getByTestId('empty-arrays-panel');
      expect(panel).toBeTruthy();
    });

    it('handles missing onPress handlers', () => {
      const itemsWithoutHandlers = [
        { id: '1', title: 'No Handler', icon: 'home' as const },
      ];

      const { getByText } = render(
        <TestWrapper>
          <NavigationPanel
            type="navigation"
            navigationItems={itemsWithoutHandlers}
          />
        </TestWrapper>
      );

      const item = getByText('No Handler');
      expect(item).toBeTruthy();
    });

    it('handles large badge numbers', () => {
      const itemsWithLargeBadge = [
        { ...mockNavigationItems[0], badge: 150 },
      ];

      const { getByText } = render(
        <TestWrapper>
          <NavigationPanel
            type="navigation"
            navigationItems={itemsWithLargeBadge}
          />
        </TestWrapper>
      );

      expect(getByText('99+')).toBeTruthy();
    });

    it('handles long titles gracefully', () => {
      const longTitleItems = [
        {
          id: '1',
          title: 'This is a very long navigation item title that should be handled gracefully',
          subtitle: 'This is also a very long subtitle that should not break the layout',
          icon: 'home' as const,
          onPress: jest.fn(),
        },
      ];

      const { getByText } = render(
        <TestWrapper>
          <NavigationPanel
            type="navigation"
            navigationItems={longTitleItems}
          />
        </TestWrapper>
      );

      expect(getByText('This is a very long navigation item title that should be handled gracefully')).toBeTruthy();
    });
  });
});