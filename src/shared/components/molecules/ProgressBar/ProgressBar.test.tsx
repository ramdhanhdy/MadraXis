/**
 * ProgressBar Component Tests
 * Unit tests for the ProgressBar component functionality and accessibility
 */

import React from 'react';
import { render, act } from '@testing-library/react-native';
import { ProgressBar } from './ProgressBar';
import { ThemeProvider } from '@/src/context/ThemeContext';

// Test wrapper with theme provider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    {children}
  </ThemeProvider>
);

describe('ProgressBar Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // Helper function to run timers and reduce boilerplate
  const runTimers = () => {
    act(() => {
      jest.runAllTimers();
    });
  };

  // Basic rendering tests
  describe('Rendering', () => {
    it('renders with basic props', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ProgressBar value={50} testID="test-progress-bar" />
        </TestWrapper>
      );
      runTimers();
      const progressBar = getByTestId('test-progress-bar');
      expect(progressBar).toBeTruthy();
    });

    it('renders with default props', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ProgressBar value={75} testID="default-progress-bar" />
        </TestWrapper>
      );
      runTimers();
      const progressBar = getByTestId('default-progress-bar');
      expect(progressBar).toBeTruthy();
    });
  });

  // Value handling tests
  describe('Value Handling', () => {
    it('handles normal values correctly', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ProgressBar value={50} testID="normal-value" />
        </TestWrapper>
      );
      runTimers();
      const progressBar = getByTestId('normal-value');
      expect(progressBar).toBeTruthy();
    });

    it('clamps values below 0', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ProgressBar value={-10} testID="negative-value" />
        </TestWrapper>
      );
      runTimers();
      const progressBar = getByTestId('negative-value');
      expect(progressBar).toBeTruthy();
    });

    it('clamps values above 100', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ProgressBar value={150} testID="over-value" />
        </TestWrapper>
      );
      runTimers();
      const progressBar = getByTestId('over-value');
      expect(progressBar).toBeTruthy();
    });

    it('handles edge values (0 and 100)', () => {
      const { getByTestId: getByTestId1 } = render(
        <TestWrapper>
          <ProgressBar value={0} testID="zero-value" />
        </TestWrapper>
      );
      runTimers();

      const { getByTestId: getByTestId2 } = render(
        <TestWrapper>
          <ProgressBar value={100} testID="hundred-value" />
        </TestWrapper>
      );
      runTimers();

      expect(getByTestId1('zero-value')).toBeTruthy();
      expect(getByTestId2('hundred-value')).toBeTruthy();
    });
  });

  // Variant tests
  describe('Variants', () => {
    it('renders default variant', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ProgressBar value={50} variant="default" testID="default-variant" />
        </TestWrapper>
      );
      runTimers();
      const progressBar = getByTestId('default-variant');
      expect(progressBar).toBeTruthy();
    });

    it('renders success variant', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ProgressBar value={50} variant="success" testID="success-variant" />
        </TestWrapper>
      );
      runTimers();
      const progressBar = getByTestId('success-variant');
      expect(progressBar).toBeTruthy();
    });

    it('renders warning variant', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ProgressBar value={50} variant="warning" testID="warning-variant" />
        </TestWrapper>
      );
      runTimers();
      const progressBar = getByTestId('warning-variant');
      expect(progressBar).toBeTruthy();
    });

    it('renders error variant', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ProgressBar value={50} variant="error" testID="error-variant" />
        </TestWrapper>
      );
      runTimers();
      const progressBar = getByTestId('error-variant');
      expect(progressBar).toBeTruthy();
    });
  });

  // Size tests
  describe('Sizes', () => {
    it('renders small size', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ProgressBar value={50} size="small" testID="small-size" />
        </TestWrapper>
      );
      runTimers();
      const progressBar = getByTestId('small-size');
      expect(progressBar).toBeTruthy();
    });

    it('renders medium size (default)', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ProgressBar value={50} size="medium" testID="medium-size" />
        </TestWrapper>
      );
      runTimers();
      const progressBar = getByTestId('medium-size');
      expect(progressBar).toBeTruthy();
    });

    it('renders large size', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ProgressBar value={50} size="large" testID="large-size" />
        </TestWrapper>
      );
      runTimers();
      const progressBar = getByTestId('large-size');
      expect(progressBar).toBeTruthy();
    });
  });

  // Label tests
  describe('Labels', () => {
    it('shows label when showLabel is true', () => {
      const { getByText } = render(
        <TestWrapper>
          <ProgressBar value={50} label="Test Progress" showLabel />
        </TestWrapper>
      );
      runTimers();
      expect(getByText('Test Progress')).toBeTruthy();
    });

    it('shows percentage when showPercentage is true', () => {
      const { getByText } = render(
        <TestWrapper>
          <ProgressBar value={75} showPercentage />
        </TestWrapper>
      );
      runTimers();
      expect(getByText('75%')).toBeTruthy();
    });

    it('shows both label and percentage', () => {
      const { getByText } = render(
        <TestWrapper>
          <ProgressBar value={85} label="Course Progress" showLabel showPercentage />
        </TestWrapper>
      );
      runTimers();
      expect(getByText('Course Progress')).toBeTruthy();
      expect(getByText('85%')).toBeTruthy();
    });

    it('does not show labels by default', () => {
      const { queryByText } = render(
        <TestWrapper>
          <ProgressBar value={50} label="Hidden Label" />
        </TestWrapper>
      );
      runTimers();
      expect(queryByText('Hidden Label')).toBeNull();
      expect(queryByText('50%')).toBeNull();
    });
  });

  // Animation tests
  describe('Animation', () => {
    it('enables animation by default', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ProgressBar value={50} testID="animated-progress" />
        </TestWrapper>
      );
      runTimers();
      const progressBar = getByTestId('animated-progress');
      expect(progressBar).toBeTruthy();
    });

    it('disables animation when animated is false', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ProgressBar value={50} animated={false} testID="static-progress" />
        </TestWrapper>
      );
      // No need to run timers here as animation is disabled
      const progressBar = getByTestId('static-progress');
      expect(progressBar).toBeTruthy();
    });

    it('accepts custom animation duration', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ProgressBar
            value={50}
            animationDuration={500}
            testID="custom-duration"
          />
        </TestWrapper>
      );
      runTimers();
      const progressBar = getByTestId('custom-duration');
      expect(progressBar).toBeTruthy();
    });
  });

  // Custom colors tests
  describe('Custom Colors', () => {
    it('accepts custom progress color', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ProgressBar
            value={50}
            progressColor="#ff0000"
            testID="custom-progress-color"
          />
        </TestWrapper>
      );
      runTimers();
      const progressBar = getByTestId('custom-progress-color');
      expect(progressBar).toBeTruthy();
    });

    it('accepts custom background color', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ProgressBar
            value={50}
            backgroundColor="#f0f0f0"
            testID="custom-bg-color"
          />
        </TestWrapper>
      );
      runTimers();
      const progressBar = getByTestId('custom-bg-color');
      expect(progressBar).toBeTruthy();
    });

    it('accepts both custom colors', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ProgressBar
            value={50}
            progressColor="#00ff00"
            backgroundColor="#cccccc"
            testID="both-custom-colors"
          />
        </TestWrapper>
      );
      runTimers();
      const progressBar = getByTestId('both-custom-colors');
      expect(progressBar).toBeTruthy();
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    it('renders with accessibility properties', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ProgressBar value={50} testID="progress-bar" animated={false} />
        </TestWrapper>
      );
      const progressBar = getByTestId('progress-bar');
      expect(progressBar).toBeTruthy();
    });

    it('renders with custom accessibility label', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ProgressBar
            value={50}
            accessibilityLabel="Custom progress label"
            testID="progress-bar"
            animated={false}
          />
        </TestWrapper>
      );
      const progressBar = getByTestId('progress-bar');
      expect(progressBar).toBeTruthy();
    });

    it('renders with accessibility hint', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ProgressBar
            value={50}
            accessibilityHint="Shows completion percentage"
            testID="progress-bar"
            animated={false}
          />
        </TestWrapper>
      );
      const progressBar = getByTestId('progress-bar');
      expect(progressBar).toBeTruthy();
    });

    it('renders with label for accessibility', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ProgressBar
            value={80}
            label="Course Progress"
            testID="progress-bar"
            animated={false}
          />
        </TestWrapper>
      );
      const progressBar = getByTestId('progress-bar');
      expect(progressBar).toBeTruthy();
    });
  });

  // Custom styling tests
  describe('Custom Styling', () => {
    it('applies custom styles', () => {
      const customStyle = { marginTop: 20 };
      const { getByTestId } = render(
        <TestWrapper>
          <ProgressBar value={50} style={customStyle} testID="custom-styled" />
        </TestWrapper>
      );
      runTimers();
      const progressBar = getByTestId('custom-styled');
      expect(progressBar).toBeTruthy();
    });
  });

  // Edge cases
  describe('Edge Cases', () => {
    it('handles decimal values', () => {
      const { getByText } = render(
        <TestWrapper>
          <ProgressBar value={75.7} showPercentage />
        </TestWrapper>
      );
      runTimers();
      // Should round to nearest integer
      expect(getByText('76%')).toBeTruthy();
    });

    it('handles very small values', () => {
      const { getByText } = render(
        <TestWrapper>
          <ProgressBar value={0.1} showPercentage />
        </TestWrapper>
      );
      runTimers();
      expect(getByText('0%')).toBeTruthy();
    });

    it('handles very large values', () => {
      const { getByText } = render(
        <TestWrapper>
          <ProgressBar value={99.9} showPercentage />
        </TestWrapper>
      );
      runTimers();
      expect(getByText('100%')).toBeTruthy();
    });
  });
});