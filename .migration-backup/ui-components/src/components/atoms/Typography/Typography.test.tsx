/**
 * Typography Component Tests
 * Comprehensive test suite for all typography variants, colors, and styling options
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { ThemeProvider } from '../../../context/ThemeContext';
import { 
  Typography, 
  Heading1, 
  Heading2, 
  Heading3, 
  Heading4, 
  Body1, 
  Body2, 
  Caption, 
  Overline 
} from './Typography';

// Test wrapper with ThemeProvider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('Typography Component', () => {
  // Basic rendering tests
  describe('Rendering', () => {
    it('renders with text content', () => {
      render(
        <TestWrapper>
          <Typography>Test Text</Typography>
        </TestWrapper>
      );
      
      expect(screen.getByText('Test Text')).toBeTruthy();
    });

    it('renders with default variant (body1)', () => {
      render(
        <TestWrapper>
          <Typography testID="default-typography">Default Text</Typography>
        </TestWrapper>
      );
      
      expect(screen.getByTestId('default-typography')).toBeTruthy();
      expect(screen.getByText('Default Text')).toBeTruthy();
    });

    it('renders with accessibility label', () => {
      render(
        <TestWrapper>
          <Typography accessibilityLabel="Custom Label">Test Text</Typography>
        </TestWrapper>
      );
      
      expect(screen.getByLabelText('Custom Label')).toBeTruthy();
    });
  });

  // Variant tests
  describe('Variants', () => {
    const variants = [
      'h1', 'h2', 'h3', 'h4', 
      'body1', 'body2', 
      'caption', 'overline',
      'button', 'buttonSmall', 'buttonLarge'
    ] as const;

    variants.forEach(variant => {
      it(`renders ${variant} variant correctly`, () => {
        render(
          <TestWrapper>
            <Typography variant={variant} testID={`typography-${variant}`}>
              {variant} Text
            </Typography>
          </TestWrapper>
        );
        
        expect(screen.getByTestId(`typography-${variant}`)).toBeTruthy();
        expect(screen.getByText(`${variant} Text`)).toBeTruthy();
      });
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
            <Typography color={color} testID={`typography-${color}`}>
              {color} Text
            </Typography>
          </TestWrapper>
        );
        
        expect(screen.getByTestId(`typography-${color}`)).toBeTruthy();
        expect(screen.getByText(`${color} Text`)).toBeTruthy();
      });
    });

    it('renders with custom hex color', () => {
      render(
        <TestWrapper>
          <Typography color="#ff0000" testID="custom-color">
            Custom Color Text
          </Typography>
        </TestWrapper>
      );
      
      expect(screen.getByTestId('custom-color')).toBeTruthy();
      expect(screen.getByText('Custom Color Text')).toBeTruthy();
    });
  });

  // Alignment tests
  describe('Text Alignment', () => {
    const alignments = ['left', 'center', 'right', 'justify'] as const;

    alignments.forEach(align => {
      it(`renders with ${align} alignment`, () => {
        render(
          <TestWrapper>
            <Typography align={align} testID={`align-${align}`}>
              {align} aligned text
            </Typography>
          </TestWrapper>
        );
        
        expect(screen.getByTestId(`align-${align}`)).toBeTruthy();
        expect(screen.getByText(`${align} aligned text`)).toBeTruthy();
      });
    });
  });

  // Weight tests
  describe('Font Weight', () => {
    const weights = ['normal', 'medium', 'semibold', 'bold'] as const;

    weights.forEach(weight => {
      it(`renders with ${weight} weight`, () => {
        render(
          <TestWrapper>
            <Typography weight={weight} testID={`weight-${weight}`}>
              {weight} weight text
            </Typography>
          </TestWrapper>
        );
        
        expect(screen.getByTestId(`weight-${weight}`)).toBeTruthy();
        expect(screen.getByText(`${weight} weight text`)).toBeTruthy();
      });
    });
  });

  // Transform tests
  describe('Text Transform', () => {
    const transforms = ['none', 'uppercase', 'lowercase', 'capitalize'] as const;

    transforms.forEach(transform => {
      it(`renders with ${transform} transform`, () => {
        render(
          <TestWrapper>
            <Typography transform={transform} testID={`transform-${transform}`}>
              transform text
            </Typography>
          </TestWrapper>
        );
        
        expect(screen.getByTestId(`transform-${transform}`)).toBeTruthy();
        expect(screen.getByText('transform text')).toBeTruthy();
      });
    });
  });

  // Decoration tests
  describe('Text Decoration', () => {
    const decorations = ['none', 'underline', 'line-through'] as const;

    decorations.forEach(decoration => {
      it(`renders with ${decoration} decoration`, () => {
        render(
          <TestWrapper>
            <Typography decoration={decoration} testID={`decoration-${decoration}`}>
              decorated text
            </Typography>
          </TestWrapper>
        );
        
        expect(screen.getByTestId(`decoration-${decoration}`)).toBeTruthy();
        expect(screen.getByText('decorated text')).toBeTruthy();
      });
    });
  });

  // Line height tests
  describe('Line Height', () => {
    const lineHeights = ['tight', 'normal', 'relaxed'] as const;

    lineHeights.forEach(lineHeight => {
      it(`renders with ${lineHeight} line height`, () => {
        render(
          <TestWrapper>
            <Typography lineHeight={lineHeight} testID={`lineheight-${lineHeight}`}>
              line height text
            </Typography>
          </TestWrapper>
        );
        
        expect(screen.getByTestId(`lineheight-${lineHeight}`)).toBeTruthy();
        expect(screen.getByText('line height text')).toBeTruthy();
      });
    });

    it('renders with custom numeric line height', () => {
      render(
        <TestWrapper>
          <Typography lineHeight={24} testID="custom-lineheight">
            Custom line height
          </Typography>
        </TestWrapper>
      );
      
      expect(screen.getByTestId('custom-lineheight')).toBeTruthy();
      expect(screen.getByText('Custom line height')).toBeTruthy();
    });
  });

  // Truncation tests
  describe('Text Truncation', () => {
    it('renders with numberOfLines', () => {
      render(
        <TestWrapper>
          <Typography numberOfLines={2} testID="truncated-text">
            This is a very long text that should be truncated after two lines
          </Typography>
        </TestWrapper>
      );
      
      expect(screen.getByTestId('truncated-text')).toBeTruthy();
    });

    const ellipsizeModes = ['head', 'middle', 'tail', 'clip'] as const;

    ellipsizeModes.forEach(mode => {
      it(`renders with ${mode} ellipsize mode`, () => {
        render(
          <TestWrapper>
            <Typography 
              numberOfLines={1} 
              ellipsizeMode={mode} 
              testID={`ellipsize-${mode}`}
            >
              Long text to be ellipsized
            </Typography>
          </TestWrapper>
        );
        
        expect(screen.getByTestId(`ellipsize-${mode}`)).toBeTruthy();
      });
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    it('has correct accessibility role for headings', () => {
      render(
        <TestWrapper>
          <Typography variant="h1" testID="heading-text">
            Heading Text
          </Typography>
        </TestWrapper>
      );
      
      const element = screen.getByTestId('heading-text');
      expect(element.props.accessibilityRole).toBe('header');
    });

    it('has correct accessibility role for button variants', () => {
      render(
        <TestWrapper>
          <Typography variant="button" testID="button-text">
            Button Text
          </Typography>
        </TestWrapper>
      );
      
      const element = screen.getByTestId('button-text');
      expect(element.props.accessibilityRole).toBe('button');
    });

    it('has correct accessibility role for body text', () => {
      render(
        <TestWrapper>
          <Typography variant="body1" testID="body-text">
            Body Text
          </Typography>
        </TestWrapper>
      );
      
      const element = screen.getByTestId('body-text');
      expect(element.props.accessibilityRole).toBe('text');
    });

    it('uses custom accessibility role', () => {
      render(
        <TestWrapper>
          <Typography accessibilityRole="link" testID="link-text">
            Link Text
          </Typography>
        </TestWrapper>
      );
      
      const element = screen.getByTestId('link-text');
      expect(element.props.accessibilityRole).toBe('link');
    });

    it('uses custom accessibility hint', () => {
      render(
        <TestWrapper>
          <Typography accessibilityHint="Custom hint" testID="hint-text">
            Text with hint
          </Typography>
        </TestWrapper>
      );
      
      const element = screen.getByTestId('hint-text');
      expect(element.props.accessibilityHint).toBe('Custom hint');
    });
  });

  // Custom styling tests
  describe('Custom Styling', () => {
    it('applies custom styles', () => {
      const customStyle = { fontSize: 20, color: 'blue' };
      
      render(
        <TestWrapper>
          <Typography style={customStyle} testID="custom-style">
            Custom styled text
          </Typography>
        </TestWrapper>
      );
      
      expect(screen.getByTestId('custom-style')).toBeTruthy();
      expect(screen.getByText('Custom styled text')).toBeTruthy();
    });

    it('applies custom font size', () => {
      render(
        <TestWrapper>
          <Typography fontSize={24} testID="custom-fontsize">
            Custom font size
          </Typography>
        </TestWrapper>
      );
      
      expect(screen.getByTestId('custom-fontsize')).toBeTruthy();
      expect(screen.getByText('Custom font size')).toBeTruthy();
    });
  });

  // Convenience component tests
  describe('Convenience Components', () => {
    const convenienceComponents = [
      { Component: Heading1, name: 'Heading1' },
      { Component: Heading2, name: 'Heading2' },
      { Component: Heading3, name: 'Heading3' },
      { Component: Heading4, name: 'Heading4' },
      { Component: Body1, name: 'Body1' },
      { Component: Body2, name: 'Body2' },
      { Component: Caption, name: 'Caption' },
      { Component: Overline, name: 'Overline' },
    ];

    convenienceComponents.forEach(({ Component, name }) => {
      it(`renders ${name} convenience component`, () => {
        render(
          <TestWrapper>
            <Component testID={`convenience-${name.toLowerCase()}`}>
              {name} Text
            </Component>
          </TestWrapper>
        );
        
        expect(screen.getByTestId(`convenience-${name.toLowerCase()}`)).toBeTruthy();
        expect(screen.getByText(`${name} Text`)).toBeTruthy();
      });
    });
  });

  // Complex combinations
  describe('Complex Combinations', () => {
    it('renders with multiple style properties', () => {
      render(
        <TestWrapper>
          <Typography
            variant="h2"
            color="primary"
            align="center"
            weight="bold"
            transform="uppercase"
            decoration="underline"
            testID="complex-typography"
          >
            Complex Typography
          </Typography>
        </TestWrapper>
      );
      
      expect(screen.getByTestId('complex-typography')).toBeTruthy();
      expect(screen.getByText('Complex Typography')).toBeTruthy();
    });
  });
});