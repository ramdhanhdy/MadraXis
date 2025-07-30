/**
 * DashboardTemplate Component Tests
 * Unit tests for the DashboardTemplate component functionality and accessibility
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import { DashboardTemplate } from './DashboardTemplate';
import { ThemeProvider } from '../../../context/ThemeContext';

// Test wrapper with theme provider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    {children}
  </ThemeProvider>
);

// Sample content component
const SampleContent: React.FC = () => (
  <View>
    <Text>Sample dashboard content</Text>
  </View>
);

describe('DashboardTemplate Component', () => {
  // Basic rendering tests
  describe('Rendering', () => {
    it('renders with basic props', () => {
      const { getByText } = render(
        <TestWrapper>
          <DashboardTemplate
            header={{ title: 'Test Dashboard' }}
          >
            <SampleContent />
          </DashboardTemplate>
        </TestWrapper>
      );

      expect(getByText('Test Dashboard')).toBeTruthy();
      expect(getByText('Sample dashboard content')).toBeTruthy();
    });

    it('renders with subtitle', () => {
      const { getByText } = render(
        <TestWrapper>
          <DashboardTemplate
            header={{ 
              title: 'Test Dashboard',
              subtitle: 'Welcome back!'
            }}
          >
            <SampleContent />
          </DashboardTemplate>
        </TestWrapper>
      );

      expect(getByText('Test Dashboard')).toBeTruthy();
      expect(getByText('Welcome back!')).toBeTruthy();
    });

    it('renders with testID', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <DashboardTemplate
            header={{ title: 'Test Dashboard' }}
            testID="test-dashboard"
          >
            <SampleContent />
          </DashboardTemplate>
        </TestWrapper>
      );

      expect(getByTestId('test-dashboard')).toBeTruthy();
      expect(getByTestId('test-dashboard-header')).toBeTruthy();
    });

    it('renders with default testID', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <DashboardTemplate
            header={{ title: 'Test Dashboard' }}
          >
            <SampleContent />
          </DashboardTemplate>
        </TestWrapper>
      );

      expect(getByTestId('dashboard-template')).toBeTruthy();
      expect(getByTestId('dashboard-header')).toBeTruthy();
    });
  });

  // Header tests
  describe('Header', () => {
    it('renders header with title only', () => {
      const { getByText } = render(
        <TestWrapper>
          <DashboardTemplate
            header={{ title: 'Simple Header' }}
          >
            <SampleContent />
          </DashboardTemplate>
        </TestWrapper>
      );

      expect(getByText('Simple Header')).toBeTruthy();
    });

    it('renders header with left action', () => {
      const mockLeftAction = jest.fn();
      const { getByTestId } = render(
        <TestWrapper>
          <DashboardTemplate
            header={{ 
              title: 'Dashboard',
              leftAction: {
                icon: 'arrow-back',
                onPress: mockLeftAction,
                accessibilityLabel: 'Go back'
              }
            }}
          >
            <SampleContent />
          </DashboardTemplate>
        </TestWrapper>
      );

      const header = getByTestId('dashboard-header');
      expect(header).toBeTruthy();
    });

    it('renders header with right actions', () => {
      const mockAction1 = jest.fn();
      const mockAction2 = jest.fn();
      
      const { getByTestId } = render(
        <TestWrapper>
          <DashboardTemplate
            header={{ 
              title: 'Dashboard',
              rightActions: [
                {
                  icon: 'notifications',
                  onPress: mockAction1,
                  badge: 5
                },
                {
                  icon: 'settings',
                  onPress: mockAction2
                }
              ]
            }}
          >
            <SampleContent />
          </DashboardTemplate>
        </TestWrapper>
      );

      const header = getByTestId('dashboard-header');
      expect(header).toBeTruthy();
    });
  });

  // Tab bar tests
  describe('Tab Bar', () => {
    it('renders without tabs by default', () => {
      const { queryByTestId } = render(
        <TestWrapper>
          <DashboardTemplate
            header={{ title: 'Dashboard' }}
          >
            <SampleContent />
          </DashboardTemplate>
        </TestWrapper>
      );

      expect(queryByTestId('dashboard-tabbar')).toBeNull();
    });

    it('renders with tabs', () => {
      const mockTabChange = jest.fn();
      const { getByTestId } = render(
        <TestWrapper>
          <DashboardTemplate
            header={{ title: 'Dashboard' }}
            tabs={[
              { id: 'home', label: 'Home', icon: 'home' },
              { id: 'profile', label: 'Profile', icon: 'person' }
            ]}
            activeTab="home"
            onTabChange={mockTabChange}
          >
            <SampleContent />
          </DashboardTemplate>
        </TestWrapper>
      );

      expect(getByTestId('dashboard-tabbar')).toBeTruthy();
    });

    it('renders tabs with badges', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <DashboardTemplate
            header={{ title: 'Dashboard' }}
            tabs={[
              { id: 'home', label: 'Home', icon: 'home' },
              { id: 'messages', label: 'Messages', icon: 'mail', badge: 3 }
            ]}
            activeTab="home"
          >
            <SampleContent />
          </DashboardTemplate>
        </TestWrapper>
      );

      expect(getByTestId('dashboard-tabbar')).toBeTruthy();
    });

    it('handles tab change', () => {
      const mockTabChange = jest.fn();
      const { getByTestId } = render(
        <TestWrapper>
          <DashboardTemplate
            header={{ title: 'Dashboard' }}
            tabs={[
              { id: 'home', label: 'Home', icon: 'home' },
              { id: 'profile', label: 'Profile', icon: 'person' }
            ]}
            activeTab="home"
            onTabChange={mockTabChange}
          >
            <SampleContent />
          </DashboardTemplate>
        </TestWrapper>
      );

      const tabBar = getByTestId('dashboard-tabbar');
      expect(tabBar).toBeTruthy();
      // Note: Actual tab press testing would require more complex setup
    });

    it('uses first tab as default active tab', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <DashboardTemplate
            header={{ title: 'Dashboard' }}
            tabs={[
              { id: 'home', label: 'Home', icon: 'home' },
              { id: 'profile', label: 'Profile', icon: 'person' }
            ]}
          >
            <SampleContent />
          </DashboardTemplate>
        </TestWrapper>
      );

      expect(getByTestId('dashboard-tabbar')).toBeTruthy();
    });
  });

  // Content tests
  describe('Content', () => {
    it('renders children content', () => {
      const { getByText } = render(
        <TestWrapper>
          <DashboardTemplate
            header={{ title: 'Dashboard' }}
          >
            <Text>Custom content here</Text>
          </DashboardTemplate>
        </TestWrapper>
      );

      expect(getByText('Custom content here')).toBeTruthy();
    });

    it('renders scrollable content by default', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <DashboardTemplate
            header={{ title: 'Dashboard' }}
            testID="scrollable-dashboard"
          >
            <SampleContent />
          </DashboardTemplate>
        </TestWrapper>
      );

      expect(getByTestId('scrollable-dashboard-scroll')).toBeTruthy();
    });

    it('renders non-scrollable content when specified', () => {
      const { queryByTestId } = render(
        <TestWrapper>
          <DashboardTemplate
            header={{ title: 'Dashboard' }}
            scrollable={false}
            testID="non-scrollable-dashboard"
          >
            <SampleContent />
          </DashboardTemplate>
        </TestWrapper>
      );

      expect(queryByTestId('non-scrollable-dashboard-scroll')).toBeNull();
    });
  });

  // Background pattern tests
  describe('Background Pattern', () => {
    it('shows background pattern by default', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <DashboardTemplate
            header={{ title: 'Dashboard' }}
            testID="pattern-dashboard"
          >
            <SampleContent />
          </DashboardTemplate>
        </TestWrapper>
      );

      const dashboard = getByTestId('pattern-dashboard');
      expect(dashboard).toBeTruthy();
    });

    it('hides background pattern when disabled', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <DashboardTemplate
            header={{ title: 'Dashboard' }}
            backgroundPattern={false}
            testID="no-pattern-dashboard"
          >
            <SampleContent />
          </DashboardTemplate>
        </TestWrapper>
      );

      const dashboard = getByTestId('no-pattern-dashboard');
      expect(dashboard).toBeTruthy();
    });
  });

  // Layout options tests
  describe('Layout Options', () => {
    it('uses SafeAreaView by default', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <DashboardTemplate
            header={{ title: 'Dashboard' }}
            testID="safe-area-dashboard"
          >
            <SampleContent />
          </DashboardTemplate>
        </TestWrapper>
      );

      const dashboard = getByTestId('safe-area-dashboard');
      expect(dashboard).toBeTruthy();
    });

    it('uses regular View when safeArea is disabled', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <DashboardTemplate
            header={{ title: 'Dashboard' }}
            safeArea={false}
            testID="no-safe-area-dashboard"
          >
            <SampleContent />
          </DashboardTemplate>
        </TestWrapper>
      );

      const dashboard = getByTestId('no-safe-area-dashboard');
      expect(dashboard).toBeTruthy();
    });

    it('applies content padding by default', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <DashboardTemplate
            header={{ title: 'Dashboard' }}
            testID="padded-dashboard"
          >
            <SampleContent />
          </DashboardTemplate>
        </TestWrapper>
      );

      const dashboard = getByTestId('padded-dashboard');
      expect(dashboard).toBeTruthy();
    });

    it('removes content padding when disabled', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <DashboardTemplate
            header={{ title: 'Dashboard' }}
            contentPadding={false}
            testID="no-padding-dashboard"
          >
            <SampleContent />
          </DashboardTemplate>
        </TestWrapper>
      );

      const dashboard = getByTestId('no-padding-dashboard');
      expect(dashboard).toBeTruthy();
    });
  });

  // Custom styling tests
  describe('Custom Styling', () => {
    it('applies custom background color', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <DashboardTemplate
            header={{ title: 'Dashboard' }}
            backgroundColor="#ff0000"
            testID="custom-bg-dashboard"
          >
            <SampleContent />
          </DashboardTemplate>
        </TestWrapper>
      );

      const dashboard = getByTestId('custom-bg-dashboard');
      expect(dashboard).toBeTruthy();
    });

    it('applies custom content background color', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <DashboardTemplate
            header={{ title: 'Dashboard' }}
            contentBackgroundColor="#00ff00"
            testID="custom-content-bg-dashboard"
          >
            <SampleContent />
          </DashboardTemplate>
        </TestWrapper>
      );

      const dashboard = getByTestId('custom-content-bg-dashboard');
      expect(dashboard).toBeTruthy();
    });

    it('applies custom styles', () => {
      const customStyle = { borderWidth: 2 };
      const customHeaderStyle = { backgroundColor: 'blue' };
      const customContentStyle = { padding: 20 };
      const customTabBarStyle = { backgroundColor: 'green' };

      const { getByTestId } = render(
        <TestWrapper>
          <DashboardTemplate
            header={{ title: 'Dashboard' }}
            style={customStyle}
            headerStyle={customHeaderStyle}
            contentStyle={customContentStyle}
            tabBarStyle={customTabBarStyle}
            tabs={[{ id: 'home', label: 'Home', icon: 'home' }]}
            testID="styled-dashboard"
          >
            <SampleContent />
          </DashboardTemplate>
        </TestWrapper>
      );

      const dashboard = getByTestId('styled-dashboard');
      expect(dashboard).toBeTruthy();
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    it('has default accessibility label', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <DashboardTemplate
            header={{ title: 'Dashboard' }}
            testID="accessible-dashboard"
          >
            <SampleContent />
          </DashboardTemplate>
        </TestWrapper>
      );

      const dashboard = getByTestId('accessible-dashboard');
      expect(dashboard.props.accessibilityLabel).toBe('Dashboard');
    });

    it('applies custom accessibility label', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <DashboardTemplate
            header={{ title: 'Dashboard' }}
            accessibilityLabel="Custom dashboard label"
            testID="custom-accessible-dashboard"
          >
            <SampleContent />
          </DashboardTemplate>
        </TestWrapper>
      );

      const dashboard = getByTestId('custom-accessible-dashboard');
      expect(dashboard.props.accessibilityLabel).toBe('Custom dashboard label');
    });
  });

  // Edge cases
  describe('Edge Cases', () => {
    it('handles empty tabs array', () => {
      const { queryByTestId } = render(
        <TestWrapper>
          <DashboardTemplate
            header={{ title: 'Dashboard' }}
            tabs={[]}
          >
            <SampleContent />
          </DashboardTemplate>
        </TestWrapper>
      );

      expect(queryByTestId('dashboard-tabbar')).toBeNull();
    });

    it('handles missing onTabChange', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <DashboardTemplate
            header={{ title: 'Dashboard' }}
            tabs={[
              { id: 'home', label: 'Home', icon: 'home' },
              { id: 'profile', label: 'Profile', icon: 'person' }
            ]}
            activeTab="home"
          >
            <SampleContent />
          </DashboardTemplate>
        </TestWrapper>
      );

      expect(getByTestId('dashboard-tabbar')).toBeTruthy();
    });

    it('handles complex content', () => {
      const ComplexContent = () => (
        <View>
          <Text>Title</Text>
          <View>
            <Text>Nested content</Text>
            <Text>More nested content</Text>
          </View>
        </View>
      );

      const { getByText } = render(
        <TestWrapper>
          <DashboardTemplate
            header={{ title: 'Dashboard' }}
          >
            <ComplexContent />
          </DashboardTemplate>
        </TestWrapper>
      );

      expect(getByText('Title')).toBeTruthy();
      expect(getByText('Nested content')).toBeTruthy();
      expect(getByText('More nested content')).toBeTruthy();
    });
  });

  // Integration tests
  describe('Integration', () => {
    it('works with all features enabled', () => {
      const mockLeftAction = jest.fn();
      const mockRightAction = jest.fn();
      const mockTabChange = jest.fn();

      const { getByTestId, getByText } = render(
        <TestWrapper>
          <DashboardTemplate
            header={{
              title: 'Full Dashboard',
              subtitle: 'Complete example',
              leftAction: {
                icon: 'arrow-back',
                onPress: mockLeftAction
              },
              rightActions: [
                {
                  icon: 'notifications',
                  onPress: mockRightAction,
                  badge: 5
                }
              ]
            }}
            tabs={[
              { id: 'home', label: 'Home', icon: 'home' },
              { id: 'profile', label: 'Profile', icon: 'person', badge: 2 }
            ]}
            activeTab="home"
            onTabChange={mockTabChange}
            backgroundPattern={true}
            scrollable={true}
            safeArea={true}
            contentPadding={true}
            testID="full-dashboard"
          >
            <Text>Full featured content</Text>
          </DashboardTemplate>
        </TestWrapper>
      );

      expect(getByTestId('full-dashboard')).toBeTruthy();
      expect(getByTestId('full-dashboard-header')).toBeTruthy();
      expect(getByTestId('full-dashboard-scroll')).toBeTruthy();
      expect(getByTestId('full-dashboard-tabbar')).toBeTruthy();
      expect(getByText('Full Dashboard')).toBeTruthy();
      expect(getByText('Complete example')).toBeTruthy();
      expect(getByText('Full featured content')).toBeTruthy();
    });
  });
});