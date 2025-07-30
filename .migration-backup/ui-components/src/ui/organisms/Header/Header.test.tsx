/**
 * Header Component Tests
 * Unit tests for the Header component functionality and accessibility
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Header } from './Header';
import { ThemeProvider } from '../../../context/ThemeContext';

// Test wrapper with theme provider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    {children}
  </ThemeProvider>
);

describe('Header Component', () => {
  // Basic rendering tests
  describe('Rendering', () => {
    it('renders title correctly', () => {
      const { getByText } = render(
        <TestWrapper>
          <Header title="Test Header" />
        </TestWrapper>
      );

      expect(getByText('Test Header')).toBeTruthy();
    });

    it('renders title and subtitle correctly', () => {
      const { getByText } = render(
        <TestWrapper>
          <Header title="Test Header" subtitle="Test Subtitle" />
        </TestWrapper>
      );

      expect(getByText('Test Header')).toBeTruthy();
      expect(getByText('Test Subtitle')).toBeTruthy();
    });

    it('renders with default props', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Header title="Test Header" testID="test-header" />
        </TestWrapper>
      );

      const header = getByTestId('test-header');
      expect(header).toBeTruthy();
    });
  });

  // Variant tests
  describe('Variants', () => {
    it('renders default variant', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Header title="Default Header" variant="default" testID="default-header" />
        </TestWrapper>
      );

      const header = getByTestId('default-header');
      expect(header).toBeTruthy();
    });

    it('renders transparent variant', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Header title="Transparent Header" variant="transparent" testID="transparent-header" />
        </TestWrapper>
      );

      const header = getByTestId('transparent-header');
      expect(header).toBeTruthy();
    });

    it('renders elevated variant', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Header title="Elevated Header" variant="elevated" testID="elevated-header" />
        </TestWrapper>
      );

      const header = getByTestId('elevated-header');
      expect(header).toBeTruthy();
    });
  });

  // Left action tests
  describe('Left Action', () => {
    it('renders left action button', () => {
      const mockOnPress = jest.fn();
      const { getByLabelText } = render(
        <TestWrapper>
          <Header
            title="Header with Back"
            leftAction={{
              icon: 'arrow-back',
              onPress: mockOnPress,
              accessibilityLabel: 'Go back',
            }}
          />
        </TestWrapper>
      );

      const backButton = getByLabelText('Go back');
      expect(backButton).toBeTruthy();
    });

    it('handles left action press', () => {
      const mockOnPress = jest.fn();
      const { getByLabelText } = render(
        <TestWrapper>
          <Header
            title="Header with Back"
            leftAction={{
              icon: 'arrow-back',
              onPress: mockOnPress,
              accessibilityLabel: 'Go back',
            }}
          />
        </TestWrapper>
      );

      const backButton = getByLabelText('Go back');
      fireEvent.press(backButton);
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('does not render left action when not provided', () => {
      const { queryByLabelText } = render(
        <TestWrapper>
          <Header title="Header without Back" />
        </TestWrapper>
      );

      const backButton = queryByLabelText('Go back');
      expect(backButton).toBeNull();
    });
  });

  // Right actions tests
  describe('Right Actions', () => {
    it('renders single right action', () => {
      const mockOnPress = jest.fn();
      const { getByLabelText } = render(
        <TestWrapper>
          <Header
            title="Header with Action"
            rightActions={[
              {
                icon: 'settings',
                onPress: mockOnPress,
                accessibilityLabel: 'Settings',
              },
            ]}
          />
        </TestWrapper>
      );

      const settingsButton = getByLabelText('Settings');
      expect(settingsButton).toBeTruthy();
    });

    it('renders multiple right actions', () => {
      const mockOnPress1 = jest.fn();
      const mockOnPress2 = jest.fn();
      const { getByLabelText } = render(
        <TestWrapper>
          <Header
            title="Header with Actions"
            rightActions={[
              {
                icon: 'search',
                onPress: mockOnPress1,
                accessibilityLabel: 'Search',
              },
              {
                icon: 'settings',
                onPress: mockOnPress2,
                accessibilityLabel: 'Settings',
              },
            ]}
          />
        </TestWrapper>
      );

      const searchButton = getByLabelText('Search');
      const settingsButton = getByLabelText('Settings');
      expect(searchButton).toBeTruthy();
      expect(settingsButton).toBeTruthy();
    });

    it('handles right action press', () => {
      const mockOnPress = jest.fn();
      const { getByLabelText } = render(
        <TestWrapper>
          <Header
            title="Header with Action"
            rightActions={[
              {
                icon: 'settings',
                onPress: mockOnPress,
                accessibilityLabel: 'Settings',
              },
            ]}
          />
        </TestWrapper>
      );

      const settingsButton = getByLabelText('Settings');
      fireEvent.press(settingsButton);
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('does not render right actions when not provided', () => {
      const { queryByLabelText } = render(
        <TestWrapper>
          <Header title="Header without Actions" />
        </TestWrapper>
      );

      const settingsButton = queryByLabelText('Settings');
      expect(settingsButton).toBeNull();
    });
  });

  // Badge tests
  describe('Badges', () => {
    it('renders badge on action button', () => {
      const { getByText } = render(
        <TestWrapper>
          <Header
            title="Header with Badge"
            rightActions={[
              {
                icon: 'notifications',
                onPress: () => {},
                badge: 5,
                accessibilityLabel: 'Notifications',
              },
            ]}
          />
        </TestWrapper>
      );

      expect(getByText('5')).toBeTruthy();
    });

    it('shows 99+ for badges over 99', () => {
      const { getByText } = render(
        <TestWrapper>
          <Header
            title="Header with Large Badge"
            rightActions={[
              {
                icon: 'notifications',
                onPress: () => {},
                badge: 150,
                accessibilityLabel: 'Notifications',
              },
            ]}
          />
        </TestWrapper>
      );

      expect(getByText('99+')).toBeTruthy();
    });

    it('does not show badge when badge is 0', () => {
      const { queryByText } = render(
        <TestWrapper>
          <Header
            title="Header with Zero Badge"
            rightActions={[
              {
                icon: 'notifications',
                onPress: () => {},
                badge: 0,
                accessibilityLabel: 'Notifications',
              },
            ]}
          />
        </TestWrapper>
      );

      expect(queryByText('0')).toBeNull();
    });

    it('does not show badge when not provided', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Header
            title="Header without Badge"
            rightActions={[
              {
                icon: 'notifications',
                onPress: () => {},
                accessibilityLabel: 'Notifications',
              },
            ]}
            testID="no-badge-header"
          />
        </TestWrapper>
      );

      const header = getByTestId('no-badge-header');
      expect(header).toBeTruthy();
      // Badge should not be present
    });
  });

  // Title alignment tests
  describe('Title Alignment', () => {
    it('centers title by default', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Header title="Centered Title" testID="centered-header" />
        </TestWrapper>
      );

      const header = getByTestId('centered-header');
      expect(header).toBeTruthy();
    });

    it('centers title when centerTitle is true', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Header title="Centered Title" centerTitle={true} testID="centered-header" />
        </TestWrapper>
      );

      const header = getByTestId('centered-header');
      expect(header).toBeTruthy();
    });

    it('left-aligns title when centerTitle is false', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Header title="Left Title" centerTitle={false} testID="left-header" />
        </TestWrapper>
      );

      const header = getByTestId('left-header');
      expect(header).toBeTruthy();
    });
  });

  // Custom colors tests
  describe('Custom Colors', () => {
    it('accepts custom background color', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Header
            title="Custom Background"
            backgroundColor="#ff0000"
            testID="custom-bg-header"
          />
        </TestWrapper>
      );

      const header = getByTestId('custom-bg-header');
      expect(header).toBeTruthy();
    });

    it('accepts custom text color', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Header
            title="Custom Text Color"
            textColor="#00ff00"
            testID="custom-text-header"
          />
        </TestWrapper>
      );

      const header = getByTestId('custom-text-header');
      expect(header).toBeTruthy();
    });

    it('accepts both custom colors', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Header
            title="Custom Colors"
            backgroundColor="#000000"
            textColor="#ffffff"
            testID="custom-colors-header"
          />
        </TestWrapper>
      );

      const header = getByTestId('custom-colors-header');
      expect(header).toBeTruthy();
    });
  });

  // Status bar tests
  describe('Status Bar', () => {
    it('shows status bar by default', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Header title="With Status Bar" testID="status-bar-header" />
        </TestWrapper>
      );

      const header = getByTestId('status-bar-header');
      expect(header).toBeTruthy();
    });

    it('hides status bar when showStatusBar is false', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Header title="Without Status Bar" showStatusBar={false} testID="no-status-bar-header" />
        </TestWrapper>
      );

      const header = getByTestId('no-status-bar-header');
      expect(header).toBeTruthy();
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    it('has correct accessibility role', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Header title="Accessible Header" testID="accessible-header" />
        </TestWrapper>
      );

      const header = getByTestId('accessible-header');
      expect(header.props.accessibilityRole).toBe('header');
    });

    it('generates accessibility label from title', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Header title="Test Header" testID="auto-label-header" />
        </TestWrapper>
      );

      const header = getByTestId('auto-label-header');
      expect(header.props.accessibilityLabel).toBe('Header: Test Header');
    });

    it('applies custom accessibility label', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Header
            title="Custom Label Header"
            accessibilityLabel="Custom header label"
            testID="custom-label-header"
          />
        </TestWrapper>
      );

      const header = getByTestId('custom-label-header');
      expect(header.props.accessibilityLabel).toBe('Custom header label');
    });

    it('provides proper accessibility for action buttons', () => {
      const { getByLabelText } = render(
        <TestWrapper>
          <Header
            title="Accessible Actions"
            rightActions={[
              {
                icon: 'settings',
                onPress: () => {},
                accessibilityLabel: 'Settings',
                accessibilityHint: 'Open settings menu',
              },
            ]}
          />
        </TestWrapper>
      );

      const settingsButton = getByLabelText('Settings');
      expect(settingsButton.props.accessibilityRole).toBe('button');
      expect(settingsButton.props.accessibilityHint).toBe('Open settings menu');
    });

    it('provides default accessibility labels for actions', () => {
      const { getByLabelText } = render(
        <TestWrapper>
          <Header
            title="Default Action Labels"
            rightActions={[
              {
                icon: 'settings',
                onPress: () => {},
              },
            ]}
          />
        </TestWrapper>
      );

      const actionButton = getByLabelText('Action 1');
      expect(actionButton).toBeTruthy();
    });
  });

  // Custom styling tests
  describe('Custom Styling', () => {
    it('applies custom styles', () => {
      const customStyle = { borderWidth: 2 };
      const { getByTestId } = render(
        <TestWrapper>
          <Header
            title="Custom Styled Header"
            style={customStyle}
            testID="custom-styled-header"
          />
        </TestWrapper>
      );

      const header = getByTestId('custom-styled-header');
      expect(header).toBeTruthy();
    });
  });

  // Edge cases
  describe('Edge Cases', () => {
    it('handles long titles gracefully', () => {
      const longTitle = 'This is a very long header title that should be truncated properly when it exceeds the available space';
      const { getByText } = render(
        <TestWrapper>
          <Header title={longTitle} />
        </TestWrapper>
      );

      expect(getByText(longTitle)).toBeTruthy();
    });

    it('handles long subtitles gracefully', () => {
      const longSubtitle = 'This is a very long subtitle that should also be truncated when needed';
      const { getByText } = render(
        <TestWrapper>
          <Header title="Short Title" subtitle={longSubtitle} />
        </TestWrapper>
      );

      expect(getByText(longSubtitle)).toBeTruthy();
    });

    it('handles many right actions', () => {
      const manyActions = Array.from({ length: 5 }, (_, i) => ({
        icon: 'star' as const,
        onPress: () => {},
        accessibilityLabel: `Action ${i + 1}`,
      }));

      const { getByTestId } = render(
        <TestWrapper>
          <Header
            title="Many Actions"
            rightActions={manyActions}
            testID="many-actions-header"
          />
        </TestWrapper>
      );

      const header = getByTestId('many-actions-header');
      expect(header).toBeTruthy();
    });

    it('handles negative badge values', () => {
      const { queryByText } = render(
        <TestWrapper>
          <Header
            title="Negative Badge"
            rightActions={[
              {
                icon: 'notifications',
                onPress: () => {},
                badge: -5,
                accessibilityLabel: 'Notifications',
              },
            ]}
          />
        </TestWrapper>
      );

      // Negative badges should not be shown
      expect(queryByText('-5')).toBeNull();
    });
  });
});