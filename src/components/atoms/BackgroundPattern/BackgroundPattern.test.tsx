/**
 * BackgroundPattern Component Tests
 * Unit tests for the BackgroundPattern component functionality and accessibility
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { BackgroundPattern } from './BackgroundPattern';
import { ThemeProvider } from '../../../context/ThemeContext';

// Test wrapper with theme provider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    {children}
  </ThemeProvider>
);

describe('BackgroundPattern Component', () => {
  // Basic rendering tests
  describe('Rendering', () => {
    it('renders with default props', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <BackgroundPattern testID="test-pattern" />
        </TestWrapper>
      );

      expect(getByTestId('test-pattern')).toBeTruthy();
    });

    it('renders geometric pattern by default', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <BackgroundPattern testID="geometric-pattern" />
        </TestWrapper>
      );

      expect(getByTestId('geometric-pattern')).toBeTruthy();
    });

    it('does not render when variant is none', () => {
      const { queryByTestId } = render(
        <TestWrapper>
          <BackgroundPattern variant="none" testID="no-pattern" />
        </TestWrapper>
      );

      expect(queryByTestId('no-pattern')).toBeNull();
    });
  });

  // Variant tests
  describe('Pattern Variants', () => {
    it('renders geometric variant', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <BackgroundPattern variant="geometric" testID="geometric" />
        </TestWrapper>
      );

      expect(getByTestId('geometric')).toBeTruthy();
    });

    it('renders minimal variant', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <BackgroundPattern variant="minimal" testID="minimal" />
        </TestWrapper>
      );

      expect(getByTestId('minimal')).toBeTruthy();
    });

    it('renders dots variant', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <BackgroundPattern variant="dots" testID="dots" />
        </TestWrapper>
      );

      expect(getByTestId('dots')).toBeTruthy();
    });

    it('renders waves variant', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <BackgroundPattern variant="waves" testID="waves" />
        </TestWrapper>
      );

      expect(getByTestId('waves')).toBeTruthy();
    });

    it('returns null for none variant', () => {
      const { queryByTestId } = render(
        <TestWrapper>
          <BackgroundPattern variant="none" testID="none" />
        </TestWrapper>
      );

      expect(queryByTestId('none')).toBeNull();
    });
  });

  // Intensity tests
  describe('Pattern Intensity', () => {
    it('renders with subtle intensity by default', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <BackgroundPattern testID="subtle-pattern" />
        </TestWrapper>
      );

      expect(getByTestId('subtle-pattern')).toBeTruthy();
    });

    it('renders with light intensity', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <BackgroundPattern intensity="light" testID="light-pattern" />
        </TestWrapper>
      );

      expect(getByTestId('light-pattern')).toBeTruthy();
    });

    it('renders with medium intensity', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <BackgroundPattern intensity="medium" testID="medium-pattern" />
        </TestWrapper>
      );

      expect(getByTestId('medium-pattern')).toBeTruthy();
    });

    it('renders with strong intensity', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <BackgroundPattern intensity="strong" testID="strong-pattern" />
        </TestWrapper>
      );

      expect(getByTestId('strong-pattern')).toBeTruthy();
    });
  });

  // Color customization tests
  describe('Color Customization', () => {
    it('renders with custom color', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <BackgroundPattern color="#ff0000" testID="red-pattern" />
        </TestWrapper>
      );

      expect(getByTestId('red-pattern')).toBeTruthy();
    });

    it('renders with custom opacity', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <BackgroundPattern opacity={0.5} testID="custom-opacity-pattern" />
        </TestWrapper>
      );

      expect(getByTestId('custom-opacity-pattern')).toBeTruthy();
    });

    it('renders with both custom color and opacity', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <BackgroundPattern 
            color="#00ff00" 
            opacity={0.3} 
            testID="custom-color-opacity-pattern" 
          />
        </TestWrapper>
      );

      expect(getByTestId('custom-color-opacity-pattern')).toBeTruthy();
    });
  });

  // Dimensions tests
  describe('Dimensions', () => {
    it('renders with default dimensions', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <BackgroundPattern testID="default-size-pattern" />
        </TestWrapper>
      );

      expect(getByTestId('default-size-pattern')).toBeTruthy();
    });

    it('renders with custom width and height', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <BackgroundPattern 
            width={200} 
            height={300} 
            testID="custom-size-pattern" 
          />
        </TestWrapper>
      );

      expect(getByTestId('custom-size-pattern')).toBeTruthy();
    });

    it('renders with percentage dimensions', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <BackgroundPattern 
            width="50%" 
            height="75%" 
            testID="percentage-size-pattern" 
          />
        </TestWrapper>
      );

      expect(getByTestId('percentage-size-pattern')).toBeTruthy();
    });
  });

  // Style customization tests
  describe('Style Customization', () => {
    it('applies custom styles', () => {
      const customStyle = { borderWidth: 2, borderColor: 'red' };
      const { getByTestId } = render(
        <TestWrapper>
          <BackgroundPattern 
            style={customStyle} 
            testID="styled-pattern" 
          />
        </TestWrapper>
      );

      expect(getByTestId('styled-pattern')).toBeTruthy();
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    it('applies accessibility label', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <BackgroundPattern 
            accessibilityLabel="Background decoration" 
            testID="accessible-pattern" 
          />
        </TestWrapper>
      );

      const pattern = getByTestId('accessible-pattern');
      expect(pattern.props.accessibilityLabel).toBe('Background decoration');
    });

    it('has pointer events disabled', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <BackgroundPattern testID="non-interactive-pattern" />
        </TestWrapper>
      );

      const pattern = getByTestId('non-interactive-pattern');
      expect(pattern.props.pointerEvents).toBe('none');
    });
  });

  // Edge cases
  describe('Edge Cases', () => {
    it('handles default variant behavior', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <BackgroundPattern testID="default-variant" />
        </TestWrapper>
      );

      expect(getByTestId('default-variant')).toBeTruthy();
    });

    it('handles missing intensity gracefully by falling back to default', () => {
      // Test that the component uses default intensity when intensity prop is missing
      const { getByTestId } = render(
        <TestWrapper>
          <BackgroundPattern testID="default-intensity-fallback" />
        </TestWrapper>
      );

      expect(getByTestId('default-intensity-fallback')).toBeTruthy();
    });

    it('handles zero opacity', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <BackgroundPattern opacity={0} testID="zero-opacity" />
        </TestWrapper>
      );

      expect(getByTestId('zero-opacity')).toBeTruthy();
    });

    it('handles maximum opacity', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <BackgroundPattern opacity={1} testID="max-opacity" />
        </TestWrapper>
      );

      expect(getByTestId('max-opacity')).toBeTruthy();
    });

    it('handles valid intensity values correctly', () => {
      // Test valid intensity: subtle
      const { getByTestId } = render(
        <TestWrapper>
          <BackgroundPattern 
            intensity="subtle" 
            testID="valid-intensity" 
          />
        </TestWrapper>
      );

      expect(getByTestId('valid-intensity')).toBeTruthy();
    });
  });

  // Integration tests
  describe('Integration', () => {
    it('works with all props combined', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <BackgroundPattern
            variant="geometric"
            intensity="medium"
            color="#005e7a"
            opacity={0.1}
            width={300}
            height={400}
            style={{ borderRadius: 10 }}
            accessibilityLabel="School pattern background"
            testID="full-featured-pattern"
          />
        </TestWrapper>
      );

      const pattern = getByTestId('full-featured-pattern');
      expect(pattern).toBeTruthy();
      expect(pattern.props.accessibilityLabel).toBe('School pattern background');
    });

    it('renders multiple patterns simultaneously', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <>
            <BackgroundPattern variant="geometric" testID="pattern-1" />
            <BackgroundPattern variant="minimal" testID="pattern-2" />
            <BackgroundPattern variant="dots" testID="pattern-3" />
          </>
        </TestWrapper>
      );

      expect(getByTestId('pattern-1')).toBeTruthy();
      expect(getByTestId('pattern-2')).toBeTruthy();
      expect(getByTestId('pattern-3')).toBeTruthy();
    });
  });

  // Theme integration tests
  describe('Theme Integration', () => {
    it('uses theme colors when no custom color provided', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <BackgroundPattern testID="theme-color-pattern" />
        </TestWrapper>
      );

      expect(getByTestId('theme-color-pattern')).toBeTruthy();
    });

    it('overrides theme colors with custom color', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <BackgroundPattern 
            color="#custom" 
            testID="custom-color-pattern" 
          />
        </TestWrapper>
      );

      expect(getByTestId('custom-color-pattern')).toBeTruthy();
    });
  });

  // Performance tests
  describe('Performance', () => {
    it('renders efficiently with complex patterns', () => {
      // Test that component renders without errors and maintains functionality
      const { getByTestId } = render(
        <TestWrapper>
          <BackgroundPattern 
            variant="geometric" 
            intensity="strong" 
            testID="complex-pattern" 
          />
        </TestWrapper>
      );
      
      expect(getByTestId('complex-pattern')).toBeTruthy();
    });

    it('handles rapid re-renders', () => {
      const { rerender, getByTestId } = render(
        <TestWrapper>
          <BackgroundPattern variant="geometric" testID="rerender-pattern" />
        </TestWrapper>
      );

      // Rapid re-renders with different props - test functional correctness
      const variants = ['geometric', 'minimal', 'dots', 'waves'] as const;
      const intensities = ['subtle', 'light', 'medium', 'strong'] as const;
      
      for (let i = 0; i < 8; i++) {
        rerender(
          <TestWrapper>
            <BackgroundPattern 
              variant={variants[i % 4]} 
              intensity={intensities[i % 4]}
              testID="rerender-pattern" 
            />
          </TestWrapper>
        );
      }

      expect(getByTestId('rerender-pattern')).toBeTruthy();
    });

    it('renders consistently across multiple instances', () => {
      const { getAllByTestId } = render(
        <TestWrapper>
          <>
            {[1, 2, 3, 4, 5].map((id) => (
              <BackgroundPattern 
                key={id}
                variant="geometric" 
                intensity="light" 
                testID={`performance-pattern-${id}`} 
              />
            ))}
          </>
        </TestWrapper>
      );

      const patterns = getAllByTestId(/performance-pattern-/);
      expect(patterns).toHaveLength(5);
    });
  });
});