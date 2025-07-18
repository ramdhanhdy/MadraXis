/**
 * Card Component Tests
 * Unit tests for the Card component functionality and accessibility
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Card } from './Card';
import { Typography } from '../../atoms/Typography';
import { ThemeProvider } from '../../../context/ThemeContext';

// Test wrapper with theme provider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    {children}
  </ThemeProvider>
);

describe('Card Component', () => {
  // Basic rendering tests
  describe('Rendering', () => {
    it('renders children correctly', () => {
      const { getByText } = render(
        <TestWrapper>
          <Card>
            <Typography>Test Content</Typography>
          </Card>
        </TestWrapper>
      );

      expect(getByText('Test Content')).toBeTruthy();
    });

    it('renders with default props', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Card testID="test-card">
            <Typography>Content</Typography>
          </Card>
        </TestWrapper>
      );

      const card = getByTestId('test-card');
      expect(card).toBeTruthy();
    });
  });

  // Variant tests
  describe('Variants', () => {
    it('applies default variant styles', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Card testID="default-card" variant="default">
            <Typography>Default Card</Typography>
          </Card>
        </TestWrapper>
      );

      const card = getByTestId('default-card');
      expect(card).toBeTruthy();
      // Note: Style testing would require more complex setup with react-native-testing-library
    });

    it('applies elevated variant styles', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Card testID="elevated-card" variant="elevated">
            <Typography>Elevated Card</Typography>
          </Card>
        </TestWrapper>
      );

      const card = getByTestId('elevated-card');
      expect(card).toBeTruthy();
    });

    it('applies outlined variant styles', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Card testID="outlined-card" variant="outlined">
            <Typography>Outlined Card</Typography>
          </Card>
        </TestWrapper>
      );

      const card = getByTestId('outlined-card');
      expect(card).toBeTruthy();
    });
  });

  // Padding tests
  describe('Padding Options', () => {
    it('applies no padding', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Card testID="no-padding-card" padding="none">
            <Typography>No Padding</Typography>
          </Card>
        </TestWrapper>
      );

      const card = getByTestId('no-padding-card');
      expect(card).toBeTruthy();
    });

    it('applies small padding', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Card testID="small-padding-card" padding="small">
            <Typography>Small Padding</Typography>
          </Card>
        </TestWrapper>
      );

      const card = getByTestId('small-padding-card');
      expect(card).toBeTruthy();
    });

    it('applies medium padding (default)', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Card testID="medium-padding-card" padding="medium">
            <Typography>Medium Padding</Typography>
          </Card>
        </TestWrapper>
      );

      const card = getByTestId('medium-padding-card');
      expect(card).toBeTruthy();
    });

    it('applies large padding', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Card testID="large-padding-card" padding="large">
            <Typography>Large Padding</Typography>
          </Card>
        </TestWrapper>
      );

      const card = getByTestId('large-padding-card');
      expect(card).toBeTruthy();
    });
  });

  // Interaction tests
  describe('Interactions', () => {
    it('handles press events when onPress is provided', () => {
      const mockOnPress = jest.fn();
      const { getByTestId } = render(
        <TestWrapper>
          <Card testID="interactive-card" onPress={mockOnPress}>
            <Typography>Interactive Card</Typography>
          </Card>
        </TestWrapper>
      );

      const card = getByTestId('interactive-card');
      fireEvent.press(card);
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('does not handle press events when disabled', () => {
      const mockOnPress = jest.fn();
      const { getByTestId } = render(
        <TestWrapper>
          <Card testID="disabled-card" onPress={mockOnPress} disabled>
            <Typography>Disabled Card</Typography>
          </Card>
        </TestWrapper>
      );

      const card = getByTestId('disabled-card');
      fireEvent.press(card);
      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it('does not handle press events when loading', () => {
      const mockOnPress = jest.fn();
      const { getByTestId } = render(
        <TestWrapper>
          <Card testID="loading-card" onPress={mockOnPress} loading>
            <Typography>Loading Card</Typography>
          </Card>
        </TestWrapper>
      );

      const card = getByTestId('loading-card');
      fireEvent.press(card);
      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it('renders as View when no onPress is provided', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Card testID="static-card">
            <Typography>Static Card</Typography>
          </Card>
        </TestWrapper>
      );

      const card = getByTestId('static-card');
      expect(card).toBeTruthy();
      // Static cards should not be pressable
    });
  });

  // State tests
  describe('States', () => {
    it('applies loading state', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Card testID="loading-card" loading>
            <Typography>Loading Content</Typography>
          </Card>
        </TestWrapper>
      );

      const card = getByTestId('loading-card');
      expect(card).toBeTruthy();
    });

    it('applies disabled state', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Card testID="disabled-card" onPress={() => {}} disabled>
            <Typography>Disabled Content</Typography>
          </Card>
        </TestWrapper>
      );

      const card = getByTestId('disabled-card');
      expect(card).toBeTruthy();
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    it('sets correct accessibility role for interactive cards', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Card testID="interactive-card" onPress={() => {}}>
            <Typography>Interactive Card</Typography>
          </Card>
        </TestWrapper>
      );

      const card = getByTestId('interactive-card');
      expect(card.props.accessibilityRole).toBe('button');
    });

    it('sets correct accessibility role for static cards', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Card testID="static-card">
            <Typography>Static Card</Typography>
          </Card>
        </TestWrapper>
      );

      const card = getByTestId('static-card');
      expect(card.props.accessibilityRole).toBe('none');
    });

    it('applies custom accessibility label', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Card testID="labeled-card" accessibilityLabel="Custom Card Label">
            <Typography>Card Content</Typography>
          </Card>
        </TestWrapper>
      );

      const card = getByTestId('labeled-card');
      expect(card.props.accessibilityLabel).toBe('Custom Card Label');
    });

    it('applies custom accessibility hint', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Card 
            testID="hinted-card" 
            onPress={() => {}}
            accessibilityHint="Tap to view details"
          >
            <Typography>Card Content</Typography>
          </Card>
        </TestWrapper>
      );

      const card = getByTestId('hinted-card');
      expect(card.props.accessibilityHint).toBe('Tap to view details');
    });

    it('sets correct accessibility state for disabled cards', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Card testID="disabled-card" onPress={() => {}} disabled>
            <Typography>Disabled Card</Typography>
          </Card>
        </TestWrapper>
      );

      const card = getByTestId('disabled-card');
      expect(card.props.accessibilityState.disabled).toBe(true);
    });

    it('sets correct accessibility state for loading cards', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Card testID="loading-card" onPress={() => {}} loading>
            <Typography>Loading Card</Typography>
          </Card>
        </TestWrapper>
      );

      const card = getByTestId('loading-card');
      expect(card.props.accessibilityState.busy).toBe(true);
    });
  });

  // Custom styling tests
  describe('Custom Styling', () => {
    it('applies custom styles', () => {
      const customStyle = { backgroundColor: 'red' };
      const { getByTestId } = render(
        <TestWrapper>
          <Card testID="custom-styled-card" style={customStyle}>
            <Typography>Custom Styled Card</Typography>
          </Card>
        </TestWrapper>
      );

      const card = getByTestId('custom-styled-card');
      expect(card).toBeTruthy();
      // Note: Testing actual style application would require more complex setup
    });
  });
});