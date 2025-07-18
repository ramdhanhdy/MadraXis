/**
 * ModalTemplate Component Tests
 * Unit tests for the ModalTemplate component functionality and accessibility
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import { ModalTemplate } from './ModalTemplate';
import { ThemeProvider } from '../../../context/ThemeContext';

// Test wrapper with theme provider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    {children}
  </ThemeProvider>
);

// Sample content component
const SampleContent: React.FC = () => (
  <View>
    <Text>Sample modal content</Text>
  </View>
);

describe('ModalTemplate Component', () => {
  // Basic rendering tests
  describe('Rendering', () => {
    it('renders with basic props', () => {
      const { getByText } = render(
        <TestWrapper>
          <ModalTemplate
            visible={true}
            title="Test Modal"
            onClose={() => {}}
          >
            <SampleContent />
          </ModalTemplate>
        </TestWrapper>
      );

      expect(getByText('Test Modal')).toBeTruthy();
      expect(getByText('Sample modal content')).toBeTruthy();
    });

    it('renders with subtitle', () => {
      const { getByText } = render(
        <TestWrapper>
          <ModalTemplate
            visible={true}
            title="Test Modal"
            subtitle="Test Subtitle"
            onClose={() => {}}
          >
            <SampleContent />
          </ModalTemplate>
        </TestWrapper>
      );

      expect(getByText('Test Modal')).toBeTruthy();
      expect(getByText('Test Subtitle')).toBeTruthy();
    });

    it('renders with testID', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ModalTemplate
            visible={true}
            title="Test Modal"
            onClose={() => {}}
            testID="test-modal"
          >
            <SampleContent />
          </ModalTemplate>
        </TestWrapper>
      );

      expect(getByTestId('test-modal')).toBeTruthy();
    });
  });

  // Close button tests
  describe('Close Button', () => {
    it('shows close button by default', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ModalTemplate
            visible={true}
            title="Test Modal"
            onClose={() => {}}
            testID="modal-with-close"
          >
            <SampleContent />
          </ModalTemplate>
        </TestWrapper>
      );

      expect(getByTestId('modal-with-close-close-button')).toBeTruthy();
    });

    it('hides close button when showCloseButton is false', () => {
      const { queryByTestId } = render(
        <TestWrapper>
          <ModalTemplate
            visible={true}
            title="Test Modal"
            onClose={() => {}}
            showCloseButton={false}
            testID="modal-no-close"
          >
            <SampleContent />
          </ModalTemplate>
        </TestWrapper>
      );

      expect(queryByTestId('modal-no-close-close-button')).toBeNull();
    });

    it('handles close button press', () => {
      const mockOnClose = jest.fn();
      const { getByTestId } = render(
        <TestWrapper>
          <ModalTemplate
            visible={true}
            title="Test Modal"
            onClose={mockOnClose}
            testID="closable-modal"
          >
            <SampleContent />
          </ModalTemplate>
        </TestWrapper>
      );

      const closeButton = getByTestId('closable-modal-close-button');
      fireEvent.press(closeButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  // Actions tests
  describe('Actions', () => {
    it('renders primary action', () => {
      const mockPrimaryAction = jest.fn();
      const { getByTestId } = render(
        <TestWrapper>
          <ModalTemplate
            visible={true}
            title="Test Modal"
            onClose={() => {}}
            primaryAction={{
              label: 'Save',
              onPress: mockPrimaryAction,
            }}
            testID="modal-with-primary"
          >
            <SampleContent />
          </ModalTemplate>
        </TestWrapper>
      );

      const primaryButton = getByTestId('modal-with-primary-action-0');
      expect(primaryButton).toBeTruthy();
    });

    it('renders secondary action', () => {
      const mockSecondaryAction = jest.fn();
      const { getByTestId } = render(
        <TestWrapper>
          <ModalTemplate
            visible={true}
            title="Test Modal"
            onClose={() => {}}
            secondaryAction={{
              label: 'Cancel',
              onPress: mockSecondaryAction,
            }}
            testID="modal-with-secondary"
          >
            <SampleContent />
          </ModalTemplate>
        </TestWrapper>
      );

      const secondaryButton = getByTestId('modal-with-secondary-action-0');
      expect(secondaryButton).toBeTruthy();
    });

    it('renders both primary and secondary actions', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ModalTemplate
            visible={true}
            title="Test Modal"
            onClose={() => {}}
            primaryAction={{
              label: 'Save',
              onPress: () => {},
            }}
            secondaryAction={{
              label: 'Cancel',
              onPress: () => {},
            }}
            testID="modal-with-both"
          >
            <SampleContent />
          </ModalTemplate>
        </TestWrapper>
      );

      expect(getByTestId('modal-with-both-action-0')).toBeTruthy(); // Secondary
      expect(getByTestId('modal-with-both-action-1')).toBeTruthy(); // Primary
    });

    it('renders multiple actions', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ModalTemplate
            visible={true}
            title="Test Modal"
            onClose={() => {}}
            actions={[
              { label: 'Action 1', onPress: () => {} },
              { label: 'Action 2', onPress: () => {} },
              { label: 'Action 3', onPress: () => {} },
            ]}
            testID="modal-with-multiple"
          >
            <SampleContent />
          </ModalTemplate>
        </TestWrapper>
      );

      expect(getByTestId('modal-with-multiple-action-0')).toBeTruthy();
      expect(getByTestId('modal-with-multiple-action-1')).toBeTruthy();
      expect(getByTestId('modal-with-multiple-action-2')).toBeTruthy();
    });

    it('handles action button press', () => {
      const mockAction = jest.fn();
      const { getByTestId } = render(
        <TestWrapper>
          <ModalTemplate
            visible={true}
            title="Test Modal"
            onClose={() => {}}
            primaryAction={{
              label: 'Test Action',
              onPress: mockAction,
            }}
            testID="action-modal"
          >
            <SampleContent />
          </ModalTemplate>
        </TestWrapper>
      );

      const actionButton = getByTestId('action-modal-action-0');
      fireEvent.press(actionButton);
      expect(mockAction).toHaveBeenCalledTimes(1);
    });

    it('does not render actions when none provided', () => {
      const { queryByTestId } = render(
        <TestWrapper>
          <ModalTemplate
            visible={true}
            title="Test Modal"
            onClose={() => {}}
            testID="no-actions-modal"
          >
            <SampleContent />
          </ModalTemplate>
        </TestWrapper>
      );

      expect(queryByTestId('no-actions-modal-action-0')).toBeNull();
    });
  });

  // Size tests
  describe('Modal Sizes', () => {
    it('renders with default size', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ModalTemplate
            visible={true}
            title="Test Modal"
            onClose={() => {}}
            testID="default-size-modal"
          >
            <SampleContent />
          </ModalTemplate>
        </TestWrapper>
      );

      expect(getByTestId('default-size-modal')).toBeTruthy();
    });

    it('renders with small size', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ModalTemplate
            visible={true}
            title="Test Modal"
            onClose={() => {}}
            size="small"
            testID="small-modal"
          >
            <SampleContent />
          </ModalTemplate>
        </TestWrapper>
      );

      expect(getByTestId('small-modal')).toBeTruthy();
    });

    it('renders with large size', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ModalTemplate
            visible={true}
            title="Test Modal"
            onClose={() => {}}
            size="large"
            testID="large-modal"
          >
            <SampleContent />
          </ModalTemplate>
        </TestWrapper>
      );

      expect(getByTestId('large-modal')).toBeTruthy();
    });

    it('renders with fullscreen size', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ModalTemplate
            visible={true}
            title="Test Modal"
            onClose={() => {}}
            size="fullscreen"
            testID="fullscreen-modal"
          >
            <SampleContent />
          </ModalTemplate>
        </TestWrapper>
      );

      expect(getByTestId('fullscreen-modal')).toBeTruthy();
    });
  });

  // Content tests
  describe('Content', () => {
    it('renders children content', () => {
      const { getByText } = render(
        <TestWrapper>
          <ModalTemplate
            visible={true}
            title="Test Modal"
            onClose={() => {}}
          >
            <Text>Custom content here</Text>
          </ModalTemplate>
        </TestWrapper>
      );

      expect(getByText('Custom content here')).toBeTruthy();
    });

    it('renders scrollable content by default', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ModalTemplate
            visible={true}
            title="Test Modal"
            onClose={() => {}}
            testID="scrollable-modal"
          >
            <SampleContent />
          </ModalTemplate>
        </TestWrapper>
      );

      expect(getByTestId('scrollable-modal-scroll')).toBeTruthy();
    });

    it('renders non-scrollable content when specified', () => {
      const { queryByTestId } = render(
        <TestWrapper>
          <ModalTemplate
            visible={true}
            title="Test Modal"
            onClose={() => {}}
            scrollable={false}
            testID="non-scrollable-modal"
          >
            <SampleContent />
          </ModalTemplate>
        </TestWrapper>
      );

      expect(queryByTestId('non-scrollable-modal-scroll')).toBeNull();
    });
  });

  // Layout options tests
  describe('Layout Options', () => {
    it('applies content padding by default', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ModalTemplate
            visible={true}
            title="Test Modal"
            onClose={() => {}}
            testID="padded-modal"
          >
            <SampleContent />
          </ModalTemplate>
        </TestWrapper>
      );

      expect(getByTestId('padded-modal')).toBeTruthy();
    });

    it('removes content padding when disabled', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ModalTemplate
            visible={true}
            title="Test Modal"
            onClose={() => {}}
            contentPadding={false}
            testID="no-padding-modal"
          >
            <SampleContent />
          </ModalTemplate>
        </TestWrapper>
      );

      expect(getByTestId('no-padding-modal')).toBeTruthy();
    });
  });

  // Custom styling tests
  describe('Custom Styling', () => {
    it('applies custom styles', () => {
      const customStyle = { borderWidth: 2 };
      const customHeaderStyle = { backgroundColor: 'red' };
      const customContentStyle = { padding: 20 };
      const customActionsStyle = { backgroundColor: 'blue' };

      const { getByTestId } = render(
        <TestWrapper>
          <ModalTemplate
            visible={true}
            title="Test Modal"
            onClose={() => {}}
            style={customStyle}
            headerStyle={customHeaderStyle}
            contentStyle={customContentStyle}
            actionsStyle={customActionsStyle}
            primaryAction={{ label: 'Test', onPress: () => {} }}
            testID="styled-modal"
          >
            <SampleContent />
          </ModalTemplate>
        </TestWrapper>
      );

      expect(getByTestId('styled-modal')).toBeTruthy();
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    it('has default accessibility label', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ModalTemplate
            visible={true}
            title="Test Modal"
            onClose={() => {}}
            testID="accessible-modal"
          >
            <SampleContent />
          </ModalTemplate>
        </TestWrapper>
      );

      const modal = getByTestId('accessible-modal');
      expect(modal).toBeTruthy();
    });

    it('applies custom accessibility label', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ModalTemplate
            visible={true}
            title="Test Modal"
            onClose={() => {}}
            accessibilityLabel="Custom modal label"
            testID="custom-accessible-modal"
          >
            <SampleContent />
          </ModalTemplate>
        </TestWrapper>
      );

      const modal = getByTestId('custom-accessible-modal');
      expect(modal).toBeTruthy();
    });

    it('provides proper accessibility for close button', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ModalTemplate
            visible={true}
            title="Test Modal"
            onClose={() => {}}
            testID="close-accessible-modal"
          >
            <SampleContent />
          </ModalTemplate>
        </TestWrapper>
      );

      const closeButton = getByTestId('close-accessible-modal-close-button');
      expect(closeButton).toBeTruthy();
    });
  });

  // Action states tests
  describe('Action States', () => {
    it('renders loading action', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ModalTemplate
            visible={true}
            title="Test Modal"
            onClose={() => {}}
            primaryAction={{
              label: 'Loading...',
              onPress: () => {},
              loading: true,
            }}
            testID="loading-modal"
          >
            <SampleContent />
          </ModalTemplate>
        </TestWrapper>
      );

      expect(getByTestId('loading-modal-action-0')).toBeTruthy();
    });

    it('renders disabled action', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ModalTemplate
            visible={true}
            title="Test Modal"
            onClose={() => {}}
            primaryAction={{
              label: 'Disabled',
              onPress: () => {},
              disabled: true,
            }}
            testID="disabled-modal"
          >
            <SampleContent />
          </ModalTemplate>
        </TestWrapper>
      );

      expect(getByTestId('disabled-modal-action-0')).toBeTruthy();
    });

    it('renders action with icon', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <ModalTemplate
            visible={true}
            title="Test Modal"
            onClose={() => {}}
            primaryAction={{
              label: 'Save',
              onPress: () => {},
              icon: 'save',
            }}
            testID="icon-modal"
          >
            <SampleContent />
          </ModalTemplate>
        </TestWrapper>
      );

      expect(getByTestId('icon-modal-action-0')).toBeTruthy();
    });
  });

  // Edge cases
  describe('Edge Cases', () => {
    it('handles complex content', () => {
      const ComplexContent = () => (
        <View>
          <Text>Title</Text>
          <View>
            <Text>Nested content</Text>
            <Text>More nested content</Text>
          </View>
        </View>
      );

      const { getByText } = render(
        <TestWrapper>
          <ModalTemplate
            visible={true}
            title="Test Modal"
            onClose={() => {}}
          >
            <ComplexContent />
          </ModalTemplate>
        </TestWrapper>
      );

      expect(getByText('Title')).toBeTruthy();
      expect(getByText('Nested content')).toBeTruthy();
      expect(getByText('More nested content')).toBeTruthy();
    });

    it('handles empty actions array', () => {
      const { queryByTestId } = render(
        <TestWrapper>
          <ModalTemplate
            visible={true}
            title="Test Modal"
            onClose={() => {}}
            actions={[]}
            testID="empty-actions-modal"
          >
            <SampleContent />
          </ModalTemplate>
        </TestWrapper>
      );

      expect(queryByTestId('empty-actions-modal-action-0')).toBeNull();
    });
  });

  // Integration tests
  describe('Integration', () => {
    it('works with all features enabled', () => {
      const mockOnClose = jest.fn();
      const mockPrimaryAction = jest.fn();
      const mockSecondaryAction = jest.fn();

      const { getByTestId, getByText } = render(
        <TestWrapper>
          <ModalTemplate
            visible={true}
            title="Full Modal"
            subtitle="Complete example"
            onClose={mockOnClose}
            primaryAction={{
              label: 'Save',
              onPress: mockPrimaryAction,
              icon: 'save',
            }}
            secondaryAction={{
              label: 'Cancel',
              onPress: mockSecondaryAction,
            }}
            size="large"
            scrollable={true}
            showCloseButton={true}
            contentPadding={true}
            testID="full-modal"
          >
            <Text>Full featured content</Text>
          </ModalTemplate>
        </TestWrapper>
      );

      expect(getByTestId('full-modal')).toBeTruthy();
      expect(getByTestId('full-modal-close-button')).toBeTruthy();
      expect(getByTestId('full-modal-scroll')).toBeTruthy();
      expect(getByTestId('full-modal-action-0')).toBeTruthy(); // Secondary
      expect(getByTestId('full-modal-action-1')).toBeTruthy(); // Primary
      expect(getByText('Full Modal')).toBeTruthy();
      expect(getByText('Complete example')).toBeTruthy();
      expect(getByText('Full featured content')).toBeTruthy();
    });
  });
});