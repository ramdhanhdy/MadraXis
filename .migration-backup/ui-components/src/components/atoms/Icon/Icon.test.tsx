/**
 * Icon Component Tests
 * Comprehensive test suite for all icon variants, sizes, and interactions
 */

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { ThemeProvider } from '../../../context/ThemeContext';
import { Icon } from './Icon';

// Test wrapper with ThemeProvider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('Icon Component', () => {
  // Basic rendering tests
  describe('Rendering', () => {
    it('renders basic icon', () => {
      render(
        <TestWrapper>
          <Icon name="home" testID="basic-icon" />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('basic-icon')).toBeTruthy();
    });

    it('renders with accessibility label', () => {
      render(
        <TestWrapper>
          <Icon name="home" accessibilityLabel="Home icon" testID="labeled-icon" />
        </TestWrapper>
      );
      
      expect(screen.getByLabelText('Home icon')).toBeTruthy();
    });

    it('has correct accessibility role for image', () => {
      render(
        <TestWrapper>
          <Icon name="home" testID="image-icon" />
        </TestWrapper>
      );
      
      const icon = screen.getByTestId('image-icon');
      expect(icon.props.accessibilityRole).toBe('image');
    });
  });

  // Size tests
  describe('Sizes', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

    sizes.forEach(size => {
      it(`renders ${size} size correctly`, () => {
        render(
          <TestWrapper>
            <Icon name="home" size={size} testID={`icon-${size}`} />
          </TestWrapper>
        );
        
        expect(screen.getByTestId(`icon-${size}`)).toBeTruthy();
      });
    });

    it('renders with custom numeric size', () => {
      render(
        <TestWrapper>
          <Icon name="home" size={48} testID="custom-size-icon" />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('custom-size-icon')).toBeTruthy();
    });
  });

  // Color tests
  describe('Colors', () => {
    const colors = [
      'primary', 'secondary', 'tertiary', 'disabled', 'inverse',
      'success', 'warning', 'error'
    ] as const;

    colors.forEach(color => {
      it(`renders with ${color} color`, () => {
        render(
          <TestWrapper>
            <Icon name="home" color={color} testID={`icon-${color}`} />
          </TestWrapper>
        );
        
        expect(screen.getByTestId(`icon-${color}`)).toBeTruthy();
      });
    });

    it('renders with custom hex color', () => {
      render(
        <TestWrapper>
          <Icon name="home" color="#ff0000" testID="custom-color-icon" />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('custom-color-icon')).toBeTruthy();
    });

    it('renders with custom RGB color', () => {
      render(
        <TestWrapper>
          <Icon name="home" color="rgb(255, 0, 0)" testID="rgb-color-icon" />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('rgb-color-icon')).toBeTruthy();
    });
  });

  // Interactive tests
  describe('Interactive Icons', () => {
    it('renders as button when onPress is provided', () => {
      const onPress = jest.fn();
      
      render(
        <TestWrapper>
          <Icon name="home" onPress={onPress} testID="interactive-icon" />
        </TestWrapper>
      );
      
      const icon = screen.getByTestId('interactive-icon');
      expect(icon.props.accessibilityRole).toBe('button');
    });

    it('calls onPress when pressed', () => {
      const onPress = jest.fn();
      
      render(
        <TestWrapper>
          <Icon name="home" onPress={onPress} testID="pressable-icon" />
        </TestWrapper>
      );
      
      const icon = screen.getByTestId('pressable-icon');
      fireEvent.press(icon);
      
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('does not call onPress when disabled', () => {
      const onPress = jest.fn();
      
      render(
        <TestWrapper>
          <Icon name="home" onPress={onPress} disabled testID="disabled-icon" />
        </TestWrapper>
      );
      
      const icon = screen.getByTestId('disabled-icon');
      fireEvent.press(icon);
      
      expect(onPress).not.toHaveBeenCalled();
    });

    it('has correct accessibility state when disabled', () => {
      render(
        <TestWrapper>
          <Icon name="home" onPress={() => {}} disabled testID="disabled-state-icon" />
        </TestWrapper>
      );
      
      const icon = screen.getByTestId('disabled-state-icon');
      expect(icon.props.accessibilityState.disabled).toBe(true);
    });
  });

  // Background tests
  describe('Background', () => {
    it('renders with background', () => {
      render(
        <TestWrapper>
          <Icon name="home" background testID="background-icon" />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('background-icon')).toBeTruthy();
    });

    it('renders with custom background color', () => {
      render(
        <TestWrapper>
          <Icon 
            name="home" 
            background 
            backgroundColor="#ff0000" 
            testID="custom-bg-icon" 
          />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('custom-bg-icon')).toBeTruthy();
    });

    it('renders interactive icon with background', () => {
      const onPress = jest.fn();
      
      render(
        <TestWrapper>
          <Icon 
            name="home" 
            background 
            onPress={onPress} 
            testID="interactive-bg-icon" 
          />
        </TestWrapper>
      );
      
      const icon = screen.getByTestId('interactive-bg-icon');
      fireEvent.press(icon);
      
      expect(onPress).toHaveBeenCalledTimes(1);
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    it('uses custom accessibility role', () => {
      render(
        <TestWrapper>
          <Icon name="home" accessibilityRole="button" testID="custom-role-icon" />
        </TestWrapper>
      );
      
      const icon = screen.getByTestId('custom-role-icon');
      expect(icon.props.accessibilityRole).toBe('button');
    });

    it('uses custom accessibility hint', () => {
      render(
        <TestWrapper>
          <Icon 
            name="home" 
            accessibilityHint="Navigate to home screen" 
            testID="hint-icon" 
          />
        </TestWrapper>
      );
      
      const icon = screen.getByTestId('hint-icon');
      expect(icon.props.accessibilityHint).toBe('Navigate to home screen');
    });

    it('has none accessibility role when specified', () => {
      render(
        <TestWrapper>
          <Icon name="home" accessibilityRole="none" testID="none-role-icon" />
        </TestWrapper>
      );
      
      const icon = screen.getByTestId('none-role-icon');
      expect(icon.props.accessibilityRole).toBe('none');
    });
  });

  // Custom styling tests
  describe('Custom Styling', () => {
    it('applies custom container style', () => {
      const customStyle = { margin: 10 };
      
      render(
        <TestWrapper>
          <Icon 
            name="home" 
            containerStyle={customStyle} 
            testID="custom-style-icon" 
          />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('custom-style-icon')).toBeTruthy();
    });

    it('applies custom container style with background', () => {
      const customStyle = { margin: 10 };
      
      render(
        <TestWrapper>
          <Icon 
            name="home" 
            background
            containerStyle={customStyle} 
            testID="custom-bg-style-icon" 
          />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('custom-bg-style-icon')).toBeTruthy();
    });
  });

  // Complex combinations
  describe('Complex Combinations', () => {
    it('renders with all features combined', () => {
      const onPress = jest.fn();
      
      render(
        <TestWrapper>
          <Icon
            name="settings"
            size="lg"
            color="primary"
            background
            backgroundColor="#f0f0f0"
            onPress={onPress}
            accessibilityLabel="Settings button"
            accessibilityHint="Open settings menu"
            testID="complex-icon"
          />
        </TestWrapper>
      );
      
      const icon = screen.getByTestId('complex-icon');
      expect(icon).toBeTruthy();
      expect(icon.props.accessibilityRole).toBe('button');
      expect(icon.props.accessibilityLabel).toBe('Settings button');
      expect(icon.props.accessibilityHint).toBe('Open settings menu');
      
      fireEvent.press(icon);
      expect(onPress).toHaveBeenCalledTimes(1);
    });
  });
});