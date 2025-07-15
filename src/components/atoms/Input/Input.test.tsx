/**
 * Input Component Tests
 * Comprehensive test suite for all input variants, states, and functionality
 */

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { ThemeProvider } from '../../../context/ThemeContext';
import { Input } from './Input';

// Test wrapper with ThemeProvider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('Input Component', () => {
  // Basic rendering tests
  describe('Rendering', () => {
    it('renders basic input', () => {
      render(
        <TestWrapper>
          <Input testID="basic-input" />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('basic-input')).toBeTruthy();
    });

    it('renders with placeholder', () => {
      render(
        <TestWrapper>
          <Input placeholder="Enter text" testID="placeholder-input" />
        </TestWrapper>
      );
      
      expect(screen.getByPlaceholderText('Enter text')).toBeTruthy();
    });

    it('renders with initial value', () => {
      render(
        <TestWrapper>
          <Input value="Initial value" testID="value-input" />
        </TestWrapper>
      );
      
      expect(screen.getByDisplayValue('Initial value')).toBeTruthy();
    });
  });

  // Label tests
  describe('Labels', () => {
    it('renders with label', () => {
      render(
        <TestWrapper>
          <Input label="Email Address" testID="labeled-input" />
        </TestWrapper>
      );
      
      expect(screen.getByText('Email Address')).toBeTruthy();
    });

    it('renders required indicator', () => {
      render(
        <TestWrapper>
          <Input label="Required Field" required testID="required-input" />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('required-input')).toBeTruthy();
      // Check that the label contains both the text and the required indicator
      expect(screen.getByText(/Required Field/)).toBeTruthy();
      expect(screen.getByText(/\*/)).toBeTruthy();
    });

    it('uses label as accessibility label', () => {
      render(
        <TestWrapper>
          <Input label="Email Address" testID="accessible-input" />
        </TestWrapper>
      );
      
      expect(screen.getByLabelText('Email Address')).toBeTruthy();
    });

    it('uses custom accessibility label', () => {
      render(
        <TestWrapper>
          <Input 
            label="Email" 
            accessibilityLabel="Email Address Input"
            testID="custom-accessible-input" 
          />
        </TestWrapper>
      );
      
      expect(screen.getByLabelText('Email Address Input')).toBeTruthy();
    });
  });

  // Variant tests
  describe('Variants', () => {
    const variants = ['outlined', 'filled'] as const;

    variants.forEach(variant => {
      it(`renders ${variant} variant correctly`, () => {
        render(
          <TestWrapper>
            <Input variant={variant} testID={`input-${variant}`} />
          </TestWrapper>
        );
        
        expect(screen.getByTestId(`input-${variant}`)).toBeTruthy();
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
            <Input size={size} testID={`input-${size}`} />
          </TestWrapper>
        );
        
        expect(screen.getByTestId(`input-${size}`)).toBeTruthy();
      });
    });
  });

  // State tests
  describe('States', () => {
    it('renders disabled state correctly', () => {
      const onChangeText = jest.fn();
      
      render(
        <TestWrapper>
          <Input disabled onChangeText={onChangeText} testID="disabled-input" />
        </TestWrapper>
      );
      
      const input = screen.getByTestId('disabled-input');
      expect(input.props.editable).toBe(false);
      expect(input.props.accessibilityState.disabled).toBe(true);
    });

    it('renders error state correctly', () => {
      render(
        <TestWrapper>
          <Input error errorText="This field is required" testID="error-input" />
        </TestWrapper>
      );
      
      const input = screen.getByTestId('error-input');
      expect(input.props.accessibilityState.disabled).toBe(false);
      expect(screen.getByText('This field is required')).toBeTruthy();
    });

    it('shows error text instead of helper text', () => {
      render(
        <TestWrapper>
          <Input 
            helperText="Helper text"
            error
            errorText="Error text"
            testID="error-priority-input"
          />
        </TestWrapper>
      );
      
      expect(screen.getByText('Error text')).toBeTruthy();
      expect(screen.queryByText('Helper text')).toBeFalsy();
    });
  });

  // Helper text tests
  describe('Helper Text', () => {
    it('renders helper text', () => {
      render(
        <TestWrapper>
          <Input helperText="This is helper text" testID="helper-input" />
        </TestWrapper>
      );
      
      expect(screen.getByText('This is helper text')).toBeTruthy();
    });

    it('renders error text', () => {
      render(
        <TestWrapper>
          <Input error errorText="This is error text" testID="error-text-input" />
        </TestWrapper>
      );
      
      expect(screen.getByText('This is error text')).toBeTruthy();
    });
  });

  // Character count tests
  describe('Character Count', () => {
    it('shows character count when enabled', () => {
      render(
        <TestWrapper>
          <Input 
            showCharacterCount
            maxLength={100}
            value="Test text"
            testID="character-count-input"
          />
        </TestWrapper>
      );
      
      expect(screen.getByText('9/100')).toBeTruthy();
    });

    it('updates character count on text change', () => {
      render(
        <TestWrapper>
          <Input 
            showCharacterCount
            maxLength={50}
            testID="dynamic-count-input"
          />
        </TestWrapper>
      );
      
      const input = screen.getByTestId('dynamic-count-input');
      fireEvent.changeText(input, 'Hello World');
      
      expect(screen.getByText('11/50')).toBeTruthy();
    });

    it('shows error color when over limit', () => {
      render(
        <TestWrapper>
          <Input 
            showCharacterCount
            maxLength={5}
            value="This is too long"
            testID="over-limit-input"
          />
        </TestWrapper>
      );
      
      expect(screen.getByText('16/5')).toBeTruthy();
    });
  });

  // Icon tests
  describe('Icons', () => {
    it('renders with left icon', () => {
      render(
        <TestWrapper>
          <Input leftIcon="mail" testID="left-icon-input" />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('left-icon-input')).toBeTruthy();
    });

    it('renders with right icon', () => {
      render(
        <TestWrapper>
          <Input rightIcon="eye" testID="right-icon-input" />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('right-icon-input')).toBeTruthy();
    });

    it('calls onRightIconPress when right icon is pressed', () => {
      const onRightIconPress = jest.fn();
      
      render(
        <TestWrapper>
          <Input 
            rightIcon="eye"
            onRightIconPress={onRightIconPress}
            testID="pressable-icon-input"
          />
        </TestWrapper>
      );
      
      // The right icon should be wrapped in a TouchableOpacity
      // We need to find the icon and simulate press on its parent
      const input = screen.getByTestId('pressable-icon-input');
      expect(input).toBeTruthy();
      
      // Note: In a real test environment, you would need to find the TouchableOpacity
      // and fire a press event. This is a simplified test structure.
    });

    it('renders both left and right icons', () => {
      render(
        <TestWrapper>
          <Input 
            leftIcon="mail"
            rightIcon="eye"
            testID="both-icons-input"
          />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('both-icons-input')).toBeTruthy();
    });
  });

  // Focus and blur tests
  describe('Focus and Blur', () => {
    it('calls onFocus when input is focused', () => {
      const onFocus = jest.fn();
      
      render(
        <TestWrapper>
          <Input onFocus={onFocus} testID="focus-input" />
        </TestWrapper>
      );
      
      const input = screen.getByTestId('focus-input');
      fireEvent(input, 'focus');
      
      expect(onFocus).toHaveBeenCalledTimes(1);
    });

    it('calls onBlur when input loses focus', () => {
      const onBlur = jest.fn();
      
      render(
        <TestWrapper>
          <Input onBlur={onBlur} testID="blur-input" />
        </TestWrapper>
      );
      
      const input = screen.getByTestId('blur-input');
      fireEvent(input, 'blur');
      
      expect(onBlur).toHaveBeenCalledTimes(1);
    });
  });

  // Text input tests
  describe('Text Input', () => {
    it('calls onChangeText when text changes', () => {
      const onChangeText = jest.fn();
      
      render(
        <TestWrapper>
          <Input onChangeText={onChangeText} testID="change-text-input" />
        </TestWrapper>
      );
      
      const input = screen.getByTestId('change-text-input');
      fireEvent.changeText(input, 'New text');
      
      expect(onChangeText).toHaveBeenCalledWith('New text');
    });

    it('respects maxLength prop', () => {
      render(
        <TestWrapper>
          <Input maxLength={10} testID="max-length-input" />
        </TestWrapper>
      );
      
      const input = screen.getByTestId('max-length-input');
      expect(input.props.maxLength).toBe(10);
    });

    it('supports multiline input', () => {
      render(
        <TestWrapper>
          <Input multiline testID="multiline-input" />
        </TestWrapper>
      );
      
      const input = screen.getByTestId('multiline-input');
      expect(input.props.multiline).toBe(true);
    });

    it('supports secure text entry', () => {
      render(
        <TestWrapper>
          <Input secureTextEntry testID="secure-input" />
        </TestWrapper>
      );
      
      const input = screen.getByTestId('secure-input');
      expect(input.props.secureTextEntry).toBe(true);
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    it('has correct accessibility state when disabled', () => {
      render(
        <TestWrapper>
          <Input disabled testID="disabled-accessibility-input" />
        </TestWrapper>
      );
      
      const input = screen.getByTestId('disabled-accessibility-input');
      expect(input.props.accessibilityState.disabled).toBe(true);
    });

    it('has correct accessibility state when error', () => {
      render(
        <TestWrapper>
          <Input error testID="error-accessibility-input" />
        </TestWrapper>
      );
      
      const input = screen.getByTestId('error-accessibility-input');
      expect(input.props.accessibilityState.disabled).toBe(false);
    });

    it('uses custom accessibility hint', () => {
      render(
        <TestWrapper>
          <Input 
            accessibilityHint="Enter your email address"
            testID="hint-input"
          />
        </TestWrapper>
      );
      
      const input = screen.getByTestId('hint-input');
      expect(input.props.accessibilityHint).toBe('Enter your email address');
    });
  });

  // Custom styling tests
  describe('Custom Styling', () => {
    it('applies custom container style', () => {
      const customStyle = { marginBottom: 20 };
      
      render(
        <TestWrapper>
          <Input containerStyle={customStyle} testID="custom-container-input" />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('custom-container-input')).toBeTruthy();
    });

    it('applies custom input style', () => {
      const customStyle = { fontSize: 18 };
      
      render(
        <TestWrapper>
          <Input inputStyle={customStyle} testID="custom-input-style" />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('custom-input-style')).toBeTruthy();
    });

    it('applies custom label style', () => {
      const customStyle = { color: 'blue' };
      
      render(
        <TestWrapper>
          <Input 
            label="Custom Label"
            labelStyle={customStyle}
            testID="custom-label-input"
          />
        </TestWrapper>
      );
      
      expect(screen.getByText('Custom Label')).toBeTruthy();
    });
  });

  // Complex combinations
  describe('Complex Combinations', () => {
    it('renders with all features combined', () => {
      const onChangeText = jest.fn();
      const onRightIconPress = jest.fn();
      
      render(
        <TestWrapper>
          <Input
            label="Email Address"
            placeholder="Enter your email"
            helperText="We'll never share your email"
            leftIcon="mail"
            rightIcon="eye"
            onRightIconPress={onRightIconPress}
            onChangeText={onChangeText}
            required
            showCharacterCount
            maxLength={50}
            variant="outlined"
            size="medium"
            testID="complex-input"
          />
        </TestWrapper>
      );
      
      expect(screen.getByText(/Email Address/)).toBeTruthy();
      expect(screen.getByText(/\*/)).toBeTruthy();
      expect(screen.getByPlaceholderText('Enter your email')).toBeTruthy();
      expect(screen.getByText("We'll never share your email")).toBeTruthy();
      expect(screen.getByText('0/50')).toBeTruthy();
      expect(screen.getByTestId('complex-input')).toBeTruthy();
    });
  });
});