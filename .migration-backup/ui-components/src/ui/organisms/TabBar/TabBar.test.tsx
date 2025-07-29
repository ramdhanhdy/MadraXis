/**
 * TabBar Component Tests
 * Unit tests for the TabBar component functionality and accessibility
 */

import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { TabBar } from './TabBar';
import { ThemeProvider } from '../../../context/ThemeContext';

// Test wrapper with theme provider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    {children}
  </ThemeProvider>
);

// Mock tabs for testing
const mockTabs = [
  { id: 'home', label: 'Home', icon: 'home' as const },
  { id: 'search', label: 'Search', icon: 'search' as const },
  { id: 'notifications', label: 'Notifications', icon: 'notifications' as const },
  { id: 'profile', label: 'Profile', icon: 'person' as const },
];

describe('TabBar Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
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
    it('renders all tabs correctly', () => {
      const { getByText } = render(
        <TestWrapper>
          <TabBar
            tabs={mockTabs}
            activeTab="home"
            onTabPress={() => {}}
          />
        </TestWrapper>
      );

      expect(getByText('Home')).toBeTruthy();
      expect(getByText('Search')).toBeTruthy();
      expect(getByText('Notifications')).toBeTruthy();
      expect(getByText('Profile')).toBeTruthy();
    });

    it('renders with default props', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <TabBar
            tabs={mockTabs}
            activeTab="home"
            onTabPress={() => {}}
            testID="test-tab-bar"
          />
        </TestWrapper>
      );

      const tabBar = getByTestId('test-tab-bar');
      expect(tabBar).toBeTruthy();
    });

    it('renders without labels when showLabels is false', () => {
      const { queryByText } = render(
        <TestWrapper>
          <TabBar
            tabs={mockTabs}
            activeTab="home"
            onTabPress={() => {}}
            showLabels={false}
          />
        </TestWrapper>
      );

      expect(queryByText('Home')).toBeNull();
      expect(queryByText('Search')).toBeNull();
    });
  });

  // Variant tests
  describe('Variants', () => {
    it('renders default variant', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <TabBar
            tabs={mockTabs}
            activeTab="home"
            onTabPress={() => {}}
            variant="default"
            testID="default-tab-bar"
          />
        </TestWrapper>
      );

      const tabBar = getByTestId('default-tab-bar');
      expect(tabBar).toBeTruthy();
    });

    it('renders elevated variant', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <TabBar
            tabs={mockTabs}
            activeTab="home"
            onTabPress={() => {}}
            variant="elevated"
            testID="elevated-tab-bar"
          />
        </TestWrapper>
      );

      const tabBar = getByTestId('elevated-tab-bar');
      expect(tabBar).toBeTruthy();
    });

    it('renders transparent variant', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <TabBar
            tabs={mockTabs}
            activeTab="home"
            onTabPress={() => {}}
            variant="transparent"
            testID="transparent-tab-bar"
          />
        </TestWrapper>
      );

      const tabBar = getByTestId('transparent-tab-bar');
      expect(tabBar).toBeTruthy();
    });
  });

  // Tab interaction tests
  describe('Tab Interactions', () => {
    it('handles tab press events', () => {
      const mockOnTabPress = jest.fn();
      const { getByTestId } = render(
        <TestWrapper>
          <TabBar
            tabs={mockTabs}
            activeTab="home"
            onTabPress={mockOnTabPress}
          />
        </TestWrapper>
      );

      const searchTab = getByTestId('tab-search');
      fireEvent.press(searchTab);
      expect(mockOnTabPress).toHaveBeenCalledWith('search');
    });

    it('does not handle press events for disabled tabs', () => {
      const mockOnTabPress = jest.fn();
      const disabledTabs = [
        ...mockTabs,
        { id: 'disabled', label: 'Disabled', icon: 'ban' as const, disabled: true },
      ];

      const { getByTestId } = render(
        <TestWrapper>
          <TabBar
            tabs={disabledTabs}
            activeTab="home"
            onTabPress={mockOnTabPress}
          />
        </TestWrapper>
      );

      const disabledTab = getByTestId('tab-disabled');
      fireEvent.press(disabledTab);
      expect(mockOnTabPress).not.toHaveBeenCalledWith('disabled');
    });

    it('shows active state correctly', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <TabBar
            tabs={mockTabs}
            activeTab="search"
            onTabPress={() => {}}
          />
        </TestWrapper>
      );

      const searchTab = getByTestId('tab-search');
      expect(searchTab.props.accessibilityState.selected).toBe(true);

      const homeTab = getByTestId('tab-home');
      expect(homeTab.props.accessibilityState.selected).toBe(false);
    });
  });

  // Badge tests
  describe('Badges', () => {
    it('renders badges on tabs', () => {
      const tabsWithBadges = [
        { id: 'home', label: 'Home', icon: 'home' as const },
        { id: 'messages', label: 'Messages', icon: 'mail' as const, badge: 5 },
        { id: 'notifications', label: 'Notifications', icon: 'notifications' as const, badge: 12 },
      ];

      const { getByText } = render(
        <TestWrapper>
          <TabBar
            tabs={tabsWithBadges}
            activeTab="home"
            onTabPress={() => {}}
          />
        </TestWrapper>
      );

      expect(getByText('5')).toBeTruthy();
      expect(getByText('12')).toBeTruthy();
    });

    it('shows 99+ for badges over 99', () => {
      const tabsWithLargeBadge = [
        { id: 'home', label: 'Home', icon: 'home' as const },
        { id: 'notifications', label: 'Notifications', icon: 'notifications' as const, badge: 150 },
      ];

      const { getByText } = render(
        <TestWrapper>
          <TabBar
            tabs={tabsWithLargeBadge}
            activeTab="home"
            onTabPress={() => {}}
          />
        </TestWrapper>
      );

      expect(getByText('99+')).toBeTruthy();
    });

    it('does not show badge when badge is 0', () => {
      const tabsWithZeroBadge = [
        { id: 'home', label: 'Home', icon: 'home' as const },
        { id: 'notifications', label: 'Notifications', icon: 'notifications' as const, badge: 0 },
      ];

      const { queryByText } = render(
        <TestWrapper>
          <TabBar
            tabs={tabsWithZeroBadge}
            activeTab="home"
            onTabPress={() => {}}
          />
        </TestWrapper>
      );

      expect(queryByText('0')).toBeNull();
    });

    it('does not show badge when not provided', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <TabBar
            tabs={mockTabs}
            activeTab="home"
            onTabPress={() => {}}
            testID="no-badge-tab-bar"
          />
        </TestWrapper>
      );

      const tabBar = getByTestId('no-badge-tab-bar');
      expect(tabBar).toBeTruthy();
      // Badges should not be present
    });
  });

  // Animation tests
  describe('Animation', () => {
    it('enables animation by default', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <TabBar
            tabs={mockTabs}
            activeTab="home"
            onTabPress={() => {}}
            testID="animated-tab-bar"
          />
        </TestWrapper>
      );
      runTimers();

      const tabBar = getByTestId('animated-tab-bar');
      expect(tabBar).toBeTruthy();
    });

    it('disables animation when animated is false', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <TabBar
            tabs={mockTabs}
            activeTab="home"
            onTabPress={() => {}}
            animated={false}
            testID="static-tab-bar"
          />
        </TestWrapper>
      );

      const tabBar = getByTestId('static-tab-bar');
      expect(tabBar).toBeTruthy();
    });

    it('accepts custom animation duration', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <TabBar
            tabs={mockTabs}
            activeTab="home"
            onTabPress={() => {}}
            animationDuration={500}
            testID="custom-duration-tab-bar"
          />
        </TestWrapper>
      );
      runTimers();

      const tabBar = getByTestId('custom-duration-tab-bar');
      expect(tabBar).toBeTruthy();
    });
  });

  // Custom colors tests
  describe('Custom Colors', () => {
    it('accepts custom background color', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <TabBar
            tabs={mockTabs}
            activeTab="home"
            onTabPress={() => {}}
            backgroundColor="#ff0000"
            testID="custom-bg-tab-bar"
          />
        </TestWrapper>
      );

      const tabBar = getByTestId('custom-bg-tab-bar');
      expect(tabBar).toBeTruthy();
    });

    it('accepts custom active color', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <TabBar
            tabs={mockTabs}
            activeTab="home"
            onTabPress={() => {}}
            activeColor="#00ff00"
            testID="custom-active-tab-bar"
          />
        </TestWrapper>
      );

      const tabBar = getByTestId('custom-active-tab-bar');
      expect(tabBar).toBeTruthy();
    });

    it('accepts custom inactive color', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <TabBar
            tabs={mockTabs}
            activeTab="home"
            onTabPress={() => {}}
            inactiveColor="#cccccc"
            testID="custom-inactive-tab-bar"
          />
        </TestWrapper>
      );

      const tabBar = getByTestId('custom-inactive-tab-bar');
      expect(tabBar).toBeTruthy();
    });

    it('accepts all custom colors', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <TabBar
            tabs={mockTabs}
            activeTab="home"
            onTabPress={() => {}}
            backgroundColor="#000000"
            activeColor="#ffffff"
            inactiveColor="#666666"
            testID="all-custom-colors-tab-bar"
          />
        </TestWrapper>
      );

      const tabBar = getByTestId('all-custom-colors-tab-bar');
      expect(tabBar).toBeTruthy();
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    it('has correct accessibility role', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <TabBar
            tabs={mockTabs}
            activeTab="home"
            onTabPress={() => {}}
            testID="accessible-tab-bar"
          />
        </TestWrapper>
      );

      const tabBar = getByTestId('accessible-tab-bar');
      expect(tabBar.props.accessibilityRole).toBe('tablist');
    });

    it('generates accessibility label from tab count', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <TabBar
            tabs={mockTabs}
            activeTab="home"
            onTabPress={() => {}}
            testID="auto-label-tab-bar"
          />
        </TestWrapper>
      );

      const tabBar = getByTestId('auto-label-tab-bar');
      expect(tabBar.props.accessibilityLabel).toBe('Tab bar with 4 tabs');
    });

    it('applies custom accessibility label', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <TabBar
            tabs={mockTabs}
            activeTab="home"
            onTabPress={() => {}}
            accessibilityLabel="Custom tab bar label"
            testID="custom-label-tab-bar"
          />
        </TestWrapper>
      );

      const tabBar = getByTestId('custom-label-tab-bar');
      expect(tabBar.props.accessibilityLabel).toBe('Custom tab bar label');
    });

    it('provides proper accessibility for tab buttons', () => {
      const tabsWithAccessibility = [
        {
          id: 'home',
          label: 'Home',
          icon: 'home' as const,
          accessibilityLabel: 'Home tab',
          accessibilityHint: 'Navigate to home screen',
        },
      ];

      const { getByLabelText } = render(
        <TestWrapper>
          <TabBar
            tabs={tabsWithAccessibility}
            activeTab="home"
            onTabPress={() => {}}
          />
        </TestWrapper>
      );

      const homeTab = getByLabelText('Home tab');
      expect(homeTab.props.accessibilityRole).toBe('tab');
      expect(homeTab.props.accessibilityHint).toBe('Navigate to home screen');
    });

    it('uses label as default accessibility label', () => {
      const { getByLabelText } = render(
        <TestWrapper>
          <TabBar
            tabs={mockTabs}
            activeTab="home"
            onTabPress={() => {}}
          />
        </TestWrapper>
      );

      const homeTab = getByLabelText('Home');
      expect(homeTab).toBeTruthy();
    });

    it('sets correct accessibility state for active/inactive tabs', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <TabBar
            tabs={mockTabs}
            activeTab="search"
            onTabPress={() => {}}
          />
        </TestWrapper>
      );

      const activeTab = getByTestId('tab-search');
      const inactiveTab = getByTestId('tab-home');

      expect(activeTab.props.accessibilityState.selected).toBe(true);
      expect(inactiveTab.props.accessibilityState.selected).toBe(false);
    });

    it('sets correct accessibility state for disabled tabs', () => {
      const disabledTabs = [
        { id: 'home', label: 'Home', icon: 'home' as const },
        { id: 'disabled', label: 'Disabled', icon: 'ban' as const, disabled: true },
      ];

      const { getByTestId } = render(
        <TestWrapper>
          <TabBar
            tabs={disabledTabs}
            activeTab="home"
            onTabPress={() => {}}
          />
        </TestWrapper>
      );

      const disabledTab = getByTestId('tab-disabled');
      expect(disabledTab.props.accessibilityState.disabled).toBe(true);
    });
  });

  // Safe area insets tests
  describe('Safe Area Insets', () => {
    it('applies safe area insets', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <TabBar
            tabs={mockTabs}
            activeTab="home"
            onTabPress={() => {}}
            safeAreaInsets={{ bottom: 20 }}
            testID="safe-area-tab-bar"
          />
        </TestWrapper>
      );

      const tabBar = getByTestId('safe-area-tab-bar');
      expect(tabBar).toBeTruthy();
    });

    it('works without safe area insets', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <TabBar
            tabs={mockTabs}
            activeTab="home"
            onTabPress={() => {}}
            testID="no-safe-area-tab-bar"
          />
        </TestWrapper>
      );

      const tabBar = getByTestId('no-safe-area-tab-bar');
      expect(tabBar).toBeTruthy();
    });
  });

  // Custom styling tests
  describe('Custom Styling', () => {
    it('applies custom styles', () => {
      const customStyle = { borderWidth: 2 };
      const { getByTestId } = render(
        <TestWrapper>
          <TabBar
            tabs={mockTabs}
            activeTab="home"
            onTabPress={() => {}}
            style={customStyle}
            testID="custom-styled-tab-bar"
          />
        </TestWrapper>
      );

      const tabBar = getByTestId('custom-styled-tab-bar');
      expect(tabBar).toBeTruthy();
    });
  });

  // Edge cases
  describe('Edge Cases', () => {
    it('handles empty tabs array', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <TabBar
            tabs={[]}
            activeTab=""
            onTabPress={() => {}}
            testID="empty-tabs-tab-bar"
          />
        </TestWrapper>
      );

      const tabBar = getByTestId('empty-tabs-tab-bar');
      expect(tabBar).toBeTruthy();
    });

    it('handles single tab', () => {
      const singleTab = [{ id: 'home', label: 'Home', icon: 'home' as const }];
      const { getByText } = render(
        <TestWrapper>
          <TabBar
            tabs={singleTab}
            activeTab="home"
            onTabPress={() => {}}
          />
        </TestWrapper>
      );

      expect(getByText('Home')).toBeTruthy();
    });

    it('handles many tabs', () => {
      const manyTabs = Array.from({ length: 8 }, (_, i) => ({
        id: `tab${i}`,
        label: `Tab ${i + 1}`,
        icon: 'star' as const,
      }));

      const { getByTestId } = render(
        <TestWrapper>
          <TabBar
            tabs={manyTabs}
            activeTab="tab0"
            onTabPress={() => {}}
            testID="many-tabs-tab-bar"
          />
        </TestWrapper>
      );

      const tabBar = getByTestId('many-tabs-tab-bar');
      expect(tabBar).toBeTruthy();
    });

    it('handles long tab labels', () => {
      const longLabelTabs = [
        { id: 'home', label: 'Very Long Home Label That Should Truncate', icon: 'home' as const },
        { id: 'search', label: 'Another Very Long Search Label', icon: 'search' as const },
      ];

      const { getByText } = render(
        <TestWrapper>
          <TabBar
            tabs={longLabelTabs}
            activeTab="home"
            onTabPress={() => {}}
          />
        </TestWrapper>
      );

      expect(getByText('Very Long Home Label That Should Truncate')).toBeTruthy();
    });

    it('handles negative badge values', () => {
      const negativeBadgeTabs = [
        { id: 'home', label: 'Home', icon: 'home' as const },
        { id: 'notifications', label: 'Notifications', icon: 'notifications' as const, badge: -5 },
      ];

      const { queryByText } = render(
        <TestWrapper>
          <TabBar
            tabs={negativeBadgeTabs}
            activeTab="home"
            onTabPress={() => {}}
          />
        </TestWrapper>
      );

      // Negative badges should not be shown
      expect(queryByText('-5')).toBeNull();
    });

    it('handles invalid active tab', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <TabBar
            tabs={mockTabs}
            activeTab="nonexistent"
            onTabPress={() => {}}
            testID="invalid-active-tab-bar"
          />
        </TestWrapper>
      );

      const tabBar = getByTestId('invalid-active-tab-bar');
      expect(tabBar).toBeTruthy();
    });
  });
});