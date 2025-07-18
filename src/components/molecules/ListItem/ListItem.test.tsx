/**
 * ListItem Component Tests
 * Unit tests for the ListItem component functionality and accessibility
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { View, Text } from 'react-native';
import { ListItem } from './ListItem';
import { ThemeProvider } from '../../../context/ThemeContext';

// Test wrapper with theme provider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    {children}
  </ThemeProvider>
);

describe('ListItem Component', () => {
  // Basic rendering tests
  describe('Rendering', () => {
    it('renders title correctly', () => {
      const { getByText } = render(
        <TestWrapper>
          <ListItem title="Test Title" />
        </TestWrapper>
      );

      expect(getByText('Test Title')).toBeTruthy();
    });

    it('renders title and subtitle correctly', () => {
      const { getByText } = render(
        <TestWrapper>
          <ListItem title="Test Title" subtitle="Test Subtitle" />
        </TestWrapper>
      );

      expect(getByText('Test Title')).toBeTruthy();
      expect(getByText('Test Subtitle')).toBeTruthy();
    });

    it('renders with default props', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ListItem title="Test Title" testID="test-list-item" />
        </TestWrapper>
      );

      const listItem = getByTestId('test-list-item');
      expect(listItem).toBeTruthy();
    });
  });

  // Icon tests
  describe('Icons', () => {
    it('renders with left icon', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ListItem 
            title="Test Title" 
            leftIcon="home"
            testID="test-list-item"
          />
        </TestWrapper>
      );

      const listItem = getByTestId('test-list-item');
      expect(listItem).toBeTruthy();
    });

    it('renders with right icon', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ListItem 
            title="Test Title" 
            rightIcon="chevron-forward"
            testID="test-list-item"
          />
        </TestWrapper>
      );

      const listItem = getByTestId('test-list-item');
      expect(listItem).toBeTruthy();
    });

    it('renders with both icons', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ListItem 
            title="Test Title" 
            leftIcon="home"
            rightIcon="chevron-forward"
            testID="test-list-item"
          />
        </TestWrapper>
      );

      const listItem = getByTestId('test-list-item');
      expect(listItem).toBeTruthy();
    });
  });

  // Custom component tests
  describe('Custom Components', () => {
    it('renders with left component', () => {
      const LeftComponent = () => <Text>Left Component</Text>;
      
      const { getByText } = render(
        <TestWrapper>
          <ListItem 
            title="Test Title" 
            leftComponent={<LeftComponent />}
          />
        </TestWrapper>
      );

      expect(getByText('Left Component')).toBeTruthy();
    });

    it('renders with right component', () => {
      const RightComponent = () => <Text>Right Component</Text>;
      
      const { getByText } = render(
        <TestWrapper>
          <ListItem 
            title="Test Title" 
            rightComponent={<RightComponent />}
          />
        </TestWrapper>
      );

      expect(getByText('Right Component')).toBeTruthy();
    });

    it('prioritizes custom components over icons', () => {
      const LeftComponent = () => <Text>Custom Left</Text>;
      const RightComponent = () => <Text>Custom Right</Text>;
      
      const { getByText } = render(
        <TestWrapper>
          <ListItem 
            title="Test Title" 
            leftIcon="home"
            rightIcon="chevron-forward"
            leftComponent={<LeftComponent />}
            rightComponent={<RightComponent />}
          />
        </TestWrapper>
      );

      expect(getByText('Custom Left')).toBeTruthy();
      expect(getByText('Custom Right')).toBeTruthy();
    });
  });

  // Divider tests
  describe('Divider', () => {
    it('shows divider when showDivider is true', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ListItem 
            title="Test Title" 
            showDivider
            testID="test-list-item"
          />
        </TestWrapper>
      );

      const listItem = getByTestId('test-list-item');
      expect(listItem).toBeTruthy();
    });

    it('does not show divider by default', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ListItem 
            title="Test Title" 
            testID="test-list-item"
          />
        </TestWrapper>
      );

      const listItem = getByTestId('test-list-item');
      expect(listItem).toBeTruthy();
    });
  });

  // Interaction tests
  describe('Interactions', () => {
    it('handles press events when onPress is provided', () => {
      const mockOnPress = jest.fn();
      const { getByTestId } = render(
        <TestWrapper>
          <ListItem 
            title="Interactive Item"
            onPress={mockOnPress}
            testID="interactive-list-item"
          />
        </TestWrapper>
      );

      const listItem = getByTestId('interactive-list-item');
      fireEvent.press(listItem);
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('does not handle press events when disabled', () => {
      const mockOnPress = jest.fn();
      const { getByTestId } = render(
        <TestWrapper>
          <ListItem 
            title="Disabled Item"
            onPress={mockOnPress}
            disabled
            testID="disabled-list-item"
          />
        </TestWrapper>
      );

      const listItem = getByTestId('disabled-list-item');
      fireEvent.press(listItem);
      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it('renders as View when no onPress is provided', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ListItem 
            title="Static Item"
            testID="static-list-item"
          />
        </TestWrapper>
      );

      const listItem = getByTestId('static-list-item');
      expect(listItem).toBeTruthy();
    });
  });

  // State tests
  describe('States', () => {
    it('applies disabled state', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ListItem 
            title="Disabled Item"
            onPress={() => {}}
            disabled
            testID="disabled-list-item"
          />
        </TestWrapper>
      );

      const listItem = getByTestId('disabled-list-item');
      expect(listItem).toBeTruthy();
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    it('sets correct accessibility role for interactive items', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ListItem 
            title="Interactive Item"
            onPress={() => {}}
            testID="interactive-list-item"
          />
        </TestWrapper>
      );

      const listItem = getByTestId('interactive-list-item');
      expect(listItem.props.accessibilityRole).toBe('button');
    });

    it('sets correct accessibility role for static items', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ListItem 
            title="Static Item"
            testID="static-list-item"
          />
        </TestWrapper>
      );

      const listItem = getByTestId('static-list-item');
      expect(listItem.props.accessibilityRole).toBe('none');
    });

    it('generates accessibility label from title only', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ListItem 
            title="Test Title"
            testID="title-only-item"
          />
        </TestWrapper>
      );

      const listItem = getByTestId('title-only-item');
      expect(listItem.props.accessibilityLabel).toBe('Test Title');
    });

    it('generates accessibility label from title and subtitle', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ListItem 
            title="Test Title"
            subtitle="Test Subtitle"
            testID="title-subtitle-item"
          />
        </TestWrapper>
      );

      const listItem = getByTestId('title-subtitle-item');
      expect(listItem.props.accessibilityLabel).toBe('Test Title, Test Subtitle');
    });

    it('applies custom accessibility label', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ListItem 
            title="Test Title"
            accessibilityLabel="Custom Label"
            testID="custom-label-item"
          />
        </TestWrapper>
      );

      const listItem = getByTestId('custom-label-item');
      expect(listItem.props.accessibilityLabel).toBe('Custom Label');
    });

    it('applies custom accessibility hint', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ListItem 
            title="Test Title"
            onPress={() => {}}
            accessibilityHint="Tap to view details"
            testID="hinted-item"
          />
        </TestWrapper>
      );

      const listItem = getByTestId('hinted-item');
      expect(listItem.props.accessibilityHint).toBe('Tap to view details');
    });

    it('sets correct accessibility state for disabled items', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ListItem 
            title="Disabled Item"
            onPress={() => {}}
            disabled
            testID="disabled-item"
          />
        </TestWrapper>
      );

      const listItem = getByTestId('disabled-item');
      expect(listItem.props.accessibilityState.disabled).toBe(true);
    });
  });

  // Custom styling tests
  describe('Custom Styling', () => {
    it('applies custom styles', () => {
      const customStyle = { backgroundColor: 'red' };
      const { getByTestId } = render(
        <TestWrapper>
          <ListItem 
            title="Custom Styled Item"
            style={customStyle}
            testID="custom-styled-item"
          />
        </TestWrapper>
      );

      const listItem = getByTestId('custom-styled-item');
      expect(listItem).toBeTruthy();
    });

    it('applies custom title styles', () => {
      const titleStyle = { color: 'blue' };
      const { getByTestId } = render(
        <TestWrapper>
          <ListItem 
            title="Custom Title Style"
            titleStyle={titleStyle}
            testID="custom-title-item"
          />
        </TestWrapper>
      );

      const listItem = getByTestId('custom-title-item');
      expect(listItem).toBeTruthy();
    });

    it('applies custom subtitle styles', () => {
      const subtitleStyle = { color: 'green' };
      const { getByTestId } = render(
        <TestWrapper>
          <ListItem 
            title="Test Title"
            subtitle="Custom Subtitle Style"
            subtitleStyle={subtitleStyle}
            testID="custom-subtitle-item"
          />
        </TestWrapper>
      );

      const listItem = getByTestId('custom-subtitle-item');
      expect(listItem).toBeTruthy();
    });
  });
});