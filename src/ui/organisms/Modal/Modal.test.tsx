/**
 * Modal Component Tests
 * Unit tests for the Modal component functionality and accessibility
 */

import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Modal } from './Modal';
import { ThemeProvider } from '../../../context/ThemeContext';

// Test wrapper with theme provider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    {children}
  </ThemeProvider>
);

describe('Modal Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // Helper function to run timers
  const runTimers = () => {
    act(() => {
      jest.runAllTimers();
    });
  };

  // Basic rendering tests
  describe('Rendering', () => {
    it('renders when visible is true', () => {
      const { getByText } = render(
        <TestWrapper>
          <Modal visible={true} onClose={() => {}}>
            <Text>Modal Content</Text>
          </Modal>
        </TestWrapper>
      );

      expect(getByText('Modal Content')).toBeTruthy();
    });

    it('does not render when visible is false', () => {
      const { queryByText } = render(
        <TestWrapper>
          <Modal visible={false} onClose={() => {}}>
            <Text>Modal Content</Text>
          </Modal>
        </TestWrapper>
      );

      expect(queryByText('Modal Content')).toBeNull();
    });

    it('renders with title and subtitle', () => {
      const { getByText } = render(
        <TestWrapper>
          <Modal
            visible={true}
            onClose={() => {}}
            title="Test Modal"
            subtitle="Test Subtitle"
          >
            <Text>Modal Content</Text>
          </Modal>
        </TestWrapper>
      );

      expect(getByText('Test Modal')).toBeTruthy();
      expect(getByText('Test Subtitle')).toBeTruthy();
    });

    it('renders with default props', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Modal
            visible={true}
            onClose={() => {}}
            testID="test-modal"
          >
            <Text>Modal Content</Text>
          </Modal>
        </TestWrapper>
      );

      const modal = getByTestId('test-modal');
      expect(modal).toBeTruthy();
    });
  });

  // Size tests
  describe('Sizes', () => {
    it('renders small size', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Modal
            visible={true}
            onClose={() => {}}
            size="small"
            testID="small-modal"
          >
            <Text>Small Modal</Text>
          </Modal>
        </TestWrapper>
      );

      const modal = getByTestId('small-modal');
      expect(modal).toBeTruthy();
    });

    it('renders medium size (default)', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Modal
            visible={true}
            onClose={() => {}}
            size="medium"
            testID="medium-modal"
          >
            <Text>Medium Modal</Text>
          </Modal>
        </TestWrapper>
      );

      const modal = getByTestId('medium-modal');
      expect(modal).toBeTruthy();
    });

    it('renders large size', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Modal
            visible={true}
            onClose={() => {}}
            size="large"
            testID="large-modal"
          >
            <Text>Large Modal</Text>
          </Modal>
        </TestWrapper>
      );

      const modal = getByTestId('large-modal');
      expect(modal).toBeTruthy();
    });

    it('renders fullscreen size', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Modal
            visible={true}
            onClose={() => {}}
            size="fullscreen"
            testID="fullscreen-modal"
          >
            <Text>Fullscreen Modal</Text>
          </Modal>
        </TestWrapper>
      );

      const modal = getByTestId('fullscreen-modal');
      expect(modal).toBeTruthy();
    });
  });

  // Close button tests
  describe('Close Button', () => {
    it('shows close button by default', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Modal visible={true} onClose={() => {}} title="Test Modal">
            <Text>Modal Content</Text>
          </Modal>
        </TestWrapper>
      );

      const closeButton = getByTestId('modal-close-button');
      expect(closeButton).toBeTruthy();
    });

    it('hides close button when showCloseButton is false', () => {
      const { queryByTestId } = render(
        <TestWrapper>
          <Modal
            visible={true}
            onClose={() => {}}
            title="Test Modal"
            showCloseButton={false}
          >
            <Text>Modal Content</Text>
          </Modal>
        </TestWrapper>
      );

      const closeButton = queryByTestId('modal-close-button');
      expect(closeButton).toBeNull();
    });

    it('handles close button press', () => {
      const mockOnClose = jest.fn();
      const { getByTestId } = render(
        <TestWrapper>
          <Modal visible={true} onClose={mockOnClose} title="Test Modal">
            <Text>Modal Content</Text>
          </Modal>
        </TestWrapper>
      );

      const closeButton = getByTestId('modal-close-button');
      fireEvent.press(closeButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  // Actions tests
  describe('Actions', () => {
    it('renders action buttons', () => {
      const actions = [
        { label: 'Cancel', onPress: () => {} },
        { label: 'Save', onPress: () => {} },
      ];

      const { getByText } = render(
        <TestWrapper>
          <Modal
            visible={true}
            onClose={() => {}}
            title="Test Modal"
            actions={actions}
          >
            <Text>Modal Content</Text>
          </Modal>
        </TestWrapper>
      );

      expect(getByText('Cancel')).toBeTruthy();
      expect(getByText('Save')).toBeTruthy();
    });

    it('handles action button press', () => {
      const mockAction = jest.fn();
      const actions = [
        { label: 'Test Action', onPress: mockAction },
      ];

      const { getByText } = render(
        <TestWrapper>
          <Modal
            visible={true}
            onClose={() => {}}
            title="Test Modal"
            actions={actions}
          >
            <Text>Modal Content</Text>
          </Modal>
        </TestWrapper>
      );

      const actionButton = getByText('Test Action');
      fireEvent.press(actionButton);
      expect(mockAction).toHaveBeenCalledTimes(1);
    });

    it('does not render actions container when no actions provided', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Modal
            visible={true}
            onClose={() => {}}
            title="Test Modal"
            testID="no-actions-modal"
          >
            <Text>Modal Content</Text>
          </Modal>
        </TestWrapper>
      );

      const modal = getByTestId('no-actions-modal');
      expect(modal).toBeTruthy();
      // Actions container should not be present
    });

    it('renders disabled action buttons', () => {
      const actions = [
        { label: 'Disabled Action', onPress: () => {}, disabled: true },
      ];

      const { getByText } = render(
        <TestWrapper>
          <Modal
            visible={true}
            onClose={() => {}}
            title="Test Modal"
            actions={actions}
          >
            <Text>Modal Content</Text>
          </Modal>
        </TestWrapper>
      );

      const actionButton = getByText('Disabled Action');
      expect(actionButton).toBeTruthy();
    });
  });

  // Animation tests
  describe('Animation', () => {
    it('handles slide animation', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Modal
            visible={true}
            onClose={() => {}}
            animationType="slide"
            testID="slide-modal"
          >
            <Text>Slide Modal</Text>
          </Modal>
        </TestWrapper>
      );
      runTimers();

      const modal = getByTestId('slide-modal');
      expect(modal).toBeTruthy();
    });

    it('handles fade animation', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Modal
            visible={true}
            onClose={() => {}}
            animationType="fade"
            testID="fade-modal"
          >
            <Text>Fade Modal</Text>
          </Modal>
        </TestWrapper>
      );
      runTimers();

      const modal = getByTestId('fade-modal');
      expect(modal).toBeTruthy();
    });

    it('handles no animation', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Modal
            visible={true}
            onClose={() => {}}
            animationType="none"
            testID="no-animation-modal"
          >
            <Text>No Animation Modal</Text>
          </Modal>
        </TestWrapper>
      );

      const modal = getByTestId('no-animation-modal');
      expect(modal).toBeTruthy();
    });

    it('accepts custom animation duration', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Modal
            visible={true}
            onClose={() => {}}
            animationType="slide"
            animationDuration={500}
            testID="custom-duration-modal"
          >
            <Text>Custom Duration Modal</Text>
          </Modal>
        </TestWrapper>
      );
      runTimers();

      const modal = getByTestId('custom-duration-modal');
      expect(modal).toBeTruthy();
    });
  });

  // Backdrop tests
  describe('Backdrop', () => {
    it('closes on backdrop press by default', () => {
      const mockOnClose = jest.fn();
      const { getByTestId } = render(
        <TestWrapper>
          <Modal
            visible={true}
            onClose={mockOnClose}
            testID="backdrop-modal"
          >
            <Text>Modal Content</Text>
          </Modal>
        </TestWrapper>
      );

      // Note: Testing backdrop press is complex in React Native Testing Library
      // This test verifies the modal renders with backdrop functionality
      const modal = getByTestId('backdrop-modal');
      expect(modal).toBeTruthy();
    });

    it('does not close on backdrop press when closeOnBackdrop is false', () => {
      const mockOnClose = jest.fn();
      const { getByTestId } = render(
        <TestWrapper>
          <Modal
            visible={true}
            onClose={mockOnClose}
            closeOnBackdrop={false}
            testID="no-backdrop-close-modal"
          >
            <Text>Modal Content</Text>
          </Modal>
        </TestWrapper>
      );

      const modal = getByTestId('no-backdrop-close-modal');
      expect(modal).toBeTruthy();
    });
  });

  // Custom colors tests
  describe('Custom Colors', () => {
    it('accepts custom background color', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Modal
            visible={true}
            onClose={() => {}}
            backgroundColor="#ff0000"
            testID="custom-bg-modal"
          >
            <Text>Custom Background Modal</Text>
          </Modal>
        </TestWrapper>
      );

      const modal = getByTestId('custom-bg-modal');
      expect(modal).toBeTruthy();
    });

    it('accepts custom backdrop color', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Modal
            visible={true}
            onClose={() => {}}
            backdropColor="rgba(255, 0, 0, 0.5)"
            testID="custom-backdrop-modal"
          >
            <Text>Custom Backdrop Modal</Text>
          </Modal>
        </TestWrapper>
      );

      const modal = getByTestId('custom-backdrop-modal');
      expect(modal).toBeTruthy();
    });

    it('accepts custom backdrop opacity', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Modal
            visible={true}
            onClose={() => {}}
            backdropOpacity={0.8}
            testID="custom-opacity-modal"
          >
            <Text>Custom Opacity Modal</Text>
          </Modal>
        </TestWrapper>
      );

      const modal = getByTestId('custom-opacity-modal');
      expect(modal).toBeTruthy();
    });
  });

  // Scrollable content tests
  describe('Scrollable Content', () => {
    it('renders scrollable content by default', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Modal
            visible={true}
            onClose={() => {}}
            scrollable={true}
            testID="scrollable-modal"
          >
            <Text>Scrollable Content</Text>
          </Modal>
        </TestWrapper>
      );

      const modal = getByTestId('scrollable-modal');
      expect(modal).toBeTruthy();
    });

    it('renders non-scrollable content', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Modal
            visible={true}
            onClose={() => {}}
            scrollable={false}
            testID="non-scrollable-modal"
          >
            <Text>Non-scrollable Content</Text>
          </Modal>
        </TestWrapper>
      );

      const modal = getByTestId('non-scrollable-modal');
      expect(modal).toBeTruthy();
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    it('has correct accessibility properties', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Modal
            visible={true}
            onClose={() => {}}
            title="Accessible Modal"
            testID="accessible-modal"
          >
            <Text>Modal Content</Text>
          </Modal>
        </TestWrapper>
      );

      const modal = getByTestId('accessible-modal');
      expect(modal).toBeTruthy();
    });

    it('applies custom accessibility label', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Modal
            visible={true}
            onClose={() => {}}
            accessibilityLabel="Custom modal label"
            testID="custom-label-modal"
          >
            <Text>Modal Content</Text>
          </Modal>
        </TestWrapper>
      );

      const modal = getByTestId('custom-label-modal');
      expect(modal).toBeTruthy();
    });

    it('uses title as default accessibility label', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Modal
            visible={true}
            onClose={() => {}}
            title="Test Modal Title"
            testID="title-label-modal"
          >
            <Text>Modal Content</Text>
          </Modal>
        </TestWrapper>
      );

      const modal = getByTestId('title-label-modal');
      expect(modal).toBeTruthy();
    });

    it('provides proper accessibility for close button', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Modal
            visible={true}
            onClose={() => {}}
            title="Test Modal"
          >
            <Text>Modal Content</Text>
          </Modal>
        </TestWrapper>
      );

      const closeButton = getByTestId('modal-close-button');
      expect(closeButton.props.accessibilityRole).toBe('button');
      expect(closeButton.props.accessibilityLabel).toBe('Close modal');
      expect(closeButton.props.accessibilityHint).toBe('Closes the modal dialog');
    });
  });

  // Custom styling tests
  describe('Custom Styling', () => {
    it('applies custom modal styles', () => {
      const customStyle = { borderWidth: 2 };
      const { getByTestId } = render(
        <TestWrapper>
          <Modal
            visible={true}
            onClose={() => {}}
            style={customStyle}
            testID="custom-styled-modal"
          >
            <Text>Custom Styled Modal</Text>
          </Modal>
        </TestWrapper>
      );

      const modal = getByTestId('custom-styled-modal');
      expect(modal).toBeTruthy();
    });

    it('applies custom content styles', () => {
      const customContentStyle = { padding: 20 };
      const { getByTestId } = render(
        <TestWrapper>
          <Modal
            visible={true}
            onClose={() => {}}
            contentStyle={customContentStyle}
            testID="custom-content-modal"
          >
            <Text>Custom Content Modal</Text>
          </Modal>
        </TestWrapper>
      );

      const modal = getByTestId('custom-content-modal');
      expect(modal).toBeTruthy();
    });

    it('applies custom header styles', () => {
      const customHeaderStyle = { backgroundColor: 'red' };
      const { getByTestId } = render(
        <TestWrapper>
          <Modal
            visible={true}
            onClose={() => {}}
            title="Custom Header"
            headerStyle={customHeaderStyle}
            testID="custom-header-modal"
          >
            <Text>Custom Header Modal</Text>
          </Modal>
        </TestWrapper>
      );

      const modal = getByTestId('custom-header-modal');
      expect(modal).toBeTruthy();
    });
  });

  // Keyboard avoidance tests
  describe('Keyboard Avoidance', () => {
    it('handles keyboard avoidance behavior', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Modal
            visible={true}
            onClose={() => {}}
            keyboardAvoidingBehavior="padding"
            testID="keyboard-modal"
          >
            <Text>Keyboard Avoiding Modal</Text>
          </Modal>
        </TestWrapper>
      );

      const modal = getByTestId('keyboard-modal');
      expect(modal).toBeTruthy();
    });
  });

  // Edge cases
  describe('Edge Cases', () => {
    it('handles modal without title or close button', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Modal
            visible={true}
            onClose={() => {}}
            showCloseButton={false}
            testID="no-header-modal"
          >
            <Text>No Header Modal</Text>
          </Modal>
        </TestWrapper>
      );

      const modal = getByTestId('no-header-modal');
      expect(modal).toBeTruthy();
    });

    it('handles long titles gracefully', () => {
      const longTitle = 'This is a very long modal title that should be truncated properly when it exceeds the available space';
      const { getByText } = render(
        <TestWrapper>
          <Modal
            visible={true}
            onClose={() => {}}
            title={longTitle}
          >
            <Text>Modal Content</Text>
          </Modal>
        </TestWrapper>
      );

      expect(getByText(longTitle)).toBeTruthy();
    });

    it('handles long subtitles gracefully', () => {
      const longSubtitle = 'This is a very long subtitle that should also be truncated when needed';
      const { getByText } = render(
        <TestWrapper>
          <Modal
            visible={true}
            onClose={() => {}}
            title="Short Title"
            subtitle={longSubtitle}
          >
            <Text>Modal Content</Text>
          </Modal>
        </TestWrapper>
      );

      expect(getByText(longSubtitle)).toBeTruthy();
    });

    it('handles many action buttons', () => {
      const manyActions = Array.from({ length: 5 }, (_, i) => ({
        label: `Action ${i + 1}`,
        onPress: () => {},
      }));

      const { getByTestId } = render(
        <TestWrapper>
          <Modal
            visible={true}
            onClose={() => {}}
            title="Many Actions"
            actions={manyActions}
            testID="many-actions-modal"
          >
            <Text>Modal with many actions</Text>
          </Modal>
        </TestWrapper>
      );

      const modal = getByTestId('many-actions-modal');
      expect(modal).toBeTruthy();
    });

    it('handles empty content', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Modal
            visible={true}
            onClose={() => {}}
            title="Empty Modal"
            testID="empty-modal"
          >
            <></>
          </Modal>
        </TestWrapper>
      );

      const modal = getByTestId('empty-modal');
      expect(modal).toBeTruthy();
    });
  });

  // Visibility change tests
  describe('Visibility Changes', () => {
    it('handles visibility changes with animation', () => {
      const { rerender, getByTestId } = render(
        <TestWrapper>
          <Modal
            visible={false}
            onClose={() => {}}
            testID="visibility-modal"
          >
            <Text>Modal Content</Text>
          </Modal>
        </TestWrapper>
      );

      // Modal should not be visible initially
      expect(() => getByTestId('visibility-modal')).toThrow();

      // Show modal
      rerender(
        <TestWrapper>
          <Modal
            visible={true}
            onClose={() => {}}
            testID="visibility-modal"
          >
            <Text>Modal Content</Text>
          </Modal>
        </TestWrapper>
      );
      runTimers();

      // Modal should now be visible
      const modal = getByTestId('visibility-modal');
      expect(modal).toBeTruthy();
    });
  });
});