/**
 * Button Component Tests
 * Comprehensive test suite for all button variants, sizes, and states
 */

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { ThemeProvider, useComponentTheme } from '../../../context/ThemeContext';
import { theme } from '../../../styles/theme';
import { Button } from './Button';

// Test wrapper with ThemeProvider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('Button Component', () => {
  // Basic rendering tests
  describe('Rendering', () => {
    it('renders with text content', () => {
      render(
        <TestWrapper>
          <Button>Test Button</Button>
        </TestWrapper>
      );
      
      expect(screen.getByText('Test Button')).toBeTruthy();
    });

    it('renders with accessibility label', () => {
      render(
        <TestWrapper>
          <Button accessibilityLabel="Custom Label">Test Button</Button>
        </TestWrapper>
      );
      
      expect(screen.getByLabelText('Custom Label')).toBeTruthy();
    });

    it('has correct accessibility role', () => {
      render(
        <TestWrapper>
          <Button>Test Button</Button>
        </TestWrapper>
      );
      
      expect(screen.getByRole('button')).toBeTruthy();
    });
  });

  // Variant tests
  describe('Variants', () => {
    const variants = ['primary', 'secondary', 'outline', 'ghost', 'danger'] as const;

    variants.forEach(variant => {
      it(`renders ${variant} variant correctly`, () => {
        render(
          <TestWrapper>
            <Button variant={variant} testID={`button-${variant}`}>
              {variant} Button
            </Button>
          </TestWrapper>
        );
        
        expect(screen.getByTestId(`button-${variant}`)).toBeTruthy();
        expect(screen.getByText(`${variant} Button`)).toBeTruthy();
      });
    });
  });

  // Size tests
  describe('Sizes', () => {
    const sizes = ['small', 'medium', 'large'] as const;

    sizes.forEach(size => {
      it(`renders ${size} size correctly`, () => {
        render(
          <TestWrapper>
            <Button size={size} testID={`button-${size}`}>
              {size} Button
            </Button>
          </TestWrapper>
        );
        
        expect(screen.getByTestId(`button-${size}`)).toBeTruthy();
        expect(screen.getByText(`${size} Button`)).toBeTruthy();
      });
    });
  });

  // State tests
  describe('States', () => {
    it('renders disabled state correctly', () => {
      const onPress = jest.fn();
      
      render(
        <TestWrapper>
          <Button disabled onPress={onPress} testID="disabled-button">
            Disabled Button
          </Button>
        </TestWrapper>
      );
      
      const button = screen.getByTestId('disabled-button');
      expect(button).toBeTruthy();
      
      fireEvent.press(button);
      expect(onPress).not.toHaveBeenCalled();
    });

    it('renders loading state correctly', () => {
      const onPress = jest.fn();
      
      render(
        <TestWrapper>
          <Button loading onPress={onPress} testID="loading-button">
            Loading Button
          </Button>
        </TestWrapper>
      );
      
      const button = screen.getByTestId('loading-button');
      expect(button).toBeTruthy();
      
      fireEvent.press(button);
      expect(onPress).not.toHaveBeenCalled();
    });

    it('shows loading indicator when loading', () => {
      render(
        <TestWrapper>
          <Button loading testID="loading-button">
            Loading Button
          </Button>
        </TestWrapper>
      );
      
      // ActivityIndicator should be present
      expect(screen.getByTestId('loading-button')).toBeTruthy();
    });
  });

  // Icon tests
  describe('Icons', () => {
    it('renders with left icon', () => {
      render(
        <TestWrapper>
          <Button icon="home" iconPosition="left" testID="icon-left-button">
            Icon Left
          </Button>
        </TestWrapper>
      );
      
      expect(screen.getByTestId('icon-left-button')).toBeTruthy();
      expect(screen.getByText('Icon Left')).toBeTruthy();
    });

    it('renders with right icon', () => {
      render(
        <TestWrapper>
          <Button icon="arrow-forward" iconPosition="right" testID="icon-right-button">
            Icon Right
          </Button>
        </TestWrapper>
      );
      
      expect(screen.getByTestId('icon-right-button')).toBeTruthy();
      expect(screen.getByText('Icon Right')).toBeTruthy();
    });

    it('renders icon-only button', () => {
      render(
        <TestWrapper>
          <Button icon="close" iconOnly testID="icon-only-button">
            Hidden Text
          </Button>
        </TestWrapper>
      );
      
      expect(screen.getByTestId('icon-only-button')).toBeTruthy();
      // Text should not be rendered in icon-only mode
      expect(screen.queryByText('Hidden Text')).toBeFalsy();
    });
  });

  // Layout tests
  describe('Layout', () => {
    it('renders full width button', () => {
      render(
        <TestWrapper>
          <Button fullWidth testID="full-width-button">
            Full Width
          </Button>
        </TestWrapper>
      );
      
      expect(screen.getByTestId('full-width-button')).toBeTruthy();
      expect(screen.getByText('Full Width')).toBeTruthy();
    });
  });

  // Interaction tests
  describe('Interactions', () => {
    it('calls onPress when pressed', () => {
      const onPress = jest.fn();
      
      render(
        <TestWrapper>
          <Button onPress={onPress} testID="interactive-button">
            Press Me
          </Button>
        </TestWrapper>
      );
      
      const button = screen.getByTestId('interactive-button');
      fireEvent.press(button);
      
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('does not call onPress when disabled', () => {
      const onPress = jest.fn();
      
      render(
        <TestWrapper>
          <Button disabled onPress={onPress} testID="disabled-button">
            Disabled
          </Button>
        </TestWrapper>
      );
      
      const button = screen.getByTestId('disabled-button');
      fireEvent.press(button);
      
      expect(onPress).not.toHaveBeenCalled();
    });

    it('does not call onPress when loading', () => {
      const onPress = jest.fn();
      
      render(
        <TestWrapper>
          <Button loading onPress={onPress} testID="loading-button">
            Loading
          </Button>
        </TestWrapper>
      );
      
      const button = screen.getByTestId('loading-button');
      fireEvent.press(button);
      
      expect(onPress).not.toHaveBeenCalled();
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    it('has correct accessibility state when disabled', () => {
      render(
        <TestWrapper>
          <Button disabled testID="disabled-button">
            Disabled
          </Button>
        </TestWrapper>
      );
      
      const button = screen.getByTestId('disabled-button');
      expect(button.props.accessibilityState.disabled).toBe(true);
    });

    it('has correct accessibility state when loading', () => {
      render(
        <TestWrapper>
          <Button loading testID="loading-button">
            Loading
          </Button>
        </TestWrapper>
      );
      
      const button = screen.getByTestId('loading-button');
      expect(button.props.accessibilityState.busy).toBe(true);
    });

    it('uses custom accessibility label', () => {
      render(
        <TestWrapper>
          <Button accessibilityLabel="Custom Label" testID="custom-label-button">
            Button Text
          </Button>
        </TestWrapper>
      );
      
      expect(screen.getByLabelText('Custom Label')).toBeTruthy();
    });

    it('uses custom accessibility hint', () => {
      render(
        <TestWrapper>
          <Button accessibilityHint="Custom Hint" testID="custom-hint-button">
            Button Text
          </Button>
        </TestWrapper>
      );
      
      const button = screen.getByTestId('custom-hint-button');
      expect(button.props.accessibilityHint).toBe('Custom Hint');
    });
  });

  // Custom styling tests
  describe('Custom Styling', () => {
    it('applies custom button style', () => {
      const customStyle = { backgroundColor: 'red' };
      
      render(
        <TestWrapper>
          <Button style={customStyle} testID="custom-style-button">
            Custom Style
          </Button>
        </TestWrapper>
      );
      
      expect(screen.getByTestId('custom-style-button')).toBeTruthy();
    });

    it('applies custom text style', () => {
      const customTextStyle = { fontSize: 20 };
      
      render(
        <TestWrapper>
          <Button textStyle={customTextStyle} testID="custom-text-style-button">
            Custom Text Style
          </Button>
        </TestWrapper>
      );
      
      expect(screen.getByTestId('custom-text-style-button')).toBeTruthy();
      expect(screen.getByText('Custom Text Style')).toBeTruthy();
    });
  });

  // Theme integration tests
  describe('Theme Integration', () => {
    it('retrieves correct theme from useComponentTheme hook', () => {
      let buttonTheme;

      const TestComponent = () => {
        buttonTheme = useComponentTheme('button');
        return null;
      };

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      expect(buttonTheme).toBeDefined();
      expect(buttonTheme).toEqual(theme.componentThemes.button);
    });
  });
});
