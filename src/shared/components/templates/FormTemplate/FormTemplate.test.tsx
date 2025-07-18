/**
 * FormTemplate Component Tests
 * Unit tests for the FormTemplate component functionality and accessibility
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import { FormTemplate } from './FormTemplate';
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
    <Text>Sample form content</Text>
  </View>
);

describe('FormTemplate Component', () => {
  // Basic rendering tests
  describe('Rendering', () => {
    it('renders with basic props', () => {
      const { getByText } = render(
        <TestWrapper>
          <FormTemplate title="Test Form">
            <SampleContent />
          </FormTemplate>
        </TestWrapper>
      );

      expect(getByText('Test Form')).toBeTruthy();
      expect(getByText('Sample form content')).toBeTruthy();
    });

    it('renders with subtitle', () => {
      const { getByText } = render(
        <TestWrapper>
          <FormTemplate
            title="Test Form"
            subtitle="Test Subtitle"
          >
            <SampleContent />
          </FormTemplate>
        </TestWrapper>
      );

      expect(getByText('Test Form')).toBeTruthy();
      expect(getByText('Test Subtitle')).toBeTruthy();
    });

    it('renders with description', () => {
      const { getByText } = render(
        <TestWrapper>
          <FormTemplate
            title="Test Form"
            description="Test description"
          >
            <SampleContent />
          </FormTemplate>
        </TestWrapper>
      );

      expect(getByText('Test Form')).toBeTruthy();
      expect(getByText('Test description')).toBeTruthy();
    });

    it('renders with testID', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <FormTemplate
            title="Test Form"
            testID="test-form"
          >
            <SampleContent />
          </FormTemplate>
        </TestWrapper>
      );

      expect(getByTestId('test-form')).toBeTruthy();
    });
  });

  // Variant tests
  describe('Form Variants', () => {
    it('renders default variant', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <FormTemplate
            title="Default Form"
            testID="default-form"
          >
            <SampleContent />
          </FormTemplate>
        </TestWrapper>
      );

      expect(getByTestId('default-form')).toBeTruthy();
    });

    it('renders card variant', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <FormTemplate
            title="Card Form"
            variant="card"
            testID="card-form"
          >
            <SampleContent />
          </FormTemplate>
        </TestWrapper>
      );

      expect(getByTestId('card-form')).toBeTruthy();
    });

    it('renders modal variant', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <FormTemplate
            title="Modal Form"
            variant="modal"
            testID="modal-form"
          >
            <SampleContent />
          </FormTemplate>
        </TestWrapper>
      );

      expect(getByTestId('modal-form')).toBeTruthy();
    });
  });

  // Actions tests
  describe('Actions', () => {
    it('renders primary action', () => {
      const mockPrimaryAction = jest.fn();
      const { getByTestId } = render(
        <TestWrapper>
          <FormTemplate
            title="Test Form"
            primaryAction={{
              label: 'Submit',
              onPress: mockPrimaryAction,
            }}
            testID="form-with-primary"
          >
            <SampleContent />
          </FormTemplate>
        </TestWrapper>
      );

      const primaryButton = getByTestId('form-with-primary-action-0');
      expect(primaryButton).toBeTruthy();
    });

    it('renders secondary action', () => {
      const mockSecondaryAction = jest.fn();
      const { getByTestId } = render(
        <TestWrapper>
          <FormTemplate
            title="Test Form"
            secondaryAction={{
              label: 'Cancel',
              onPress: mockSecondaryAction,
            }}
            testID="form-with-secondary"
          >
            <SampleContent />
          </FormTemplate>
        </TestWrapper>
      );

      const secondaryButton = getByTestId('form-with-secondary-action-0');
      expect(secondaryButton).toBeTruthy();
    });

    it('renders both primary and secondary actions', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <FormTemplate
            title="Test Form"
            primaryAction={{
              label: 'Submit',
              onPress: () => {},
            }}
            secondaryAction={{
              label: 'Cancel',
              onPress: () => {},
            }}
            testID="form-with-both"
          >
            <SampleContent />
          </FormTemplate>
        </TestWrapper>
      );

      expect(getByTestId('form-with-both-action-0')).toBeTruthy(); // Secondary
      expect(getByTestId('form-with-both-action-1')).toBeTruthy(); // Primary
    });

    it('renders multiple actions', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <FormTemplate
            title="Test Form"
            actions={[
              { label: 'Action 1', onPress: () => {} },
              { label: 'Action 2', onPress: () => {} },
              { label: 'Action 3', onPress: () => {} },
            ]}
            testID="form-with-multiple"
          >
            <SampleContent />
          </FormTemplate>
        </TestWrapper>
      );

      expect(getByTestId('form-with-multiple-action-0')).toBeTruthy();
      expect(getByTestId('form-with-multiple-action-1')).toBeTruthy();
      expect(getByTestId('form-with-multiple-action-2')).toBeTruthy();
    });

    it('handles action button press', () => {
      const mockAction = jest.fn();
      const { getByTestId } = render(
        <TestWrapper>
          <FormTemplate
            title="Test Form"
            primaryAction={{
              label: 'Test Action',
              onPress: mockAction,
            }}
            testID="action-form"
          >
            <SampleContent />
          </FormTemplate>
        </TestWrapper>
      );

      const actionButton = getByTestId('action-form-action-0');
      fireEvent.press(actionButton);
      expect(mockAction).toHaveBeenCalledTimes(1);
    });

    it('does not render actions when none provided', () => {
      const { queryByTestId } = render(
        <TestWrapper>
          <FormTemplate
            title="Test Form"
            testID="no-actions-form"
          >
            <SampleContent />
          </FormTemplate>
        </TestWrapper>
      );

      expect(queryByTestId('no-actions-form-action-0')).toBeNull();
    });
  });

  // Sections tests
  describe('Form Sections', () => {
    it('renders form sections', () => {
      const sections = [
        {
          id: 'section1',
          title: 'Section 1',
          description: 'First section',
          children: <Text>Section 1 content</Text>,
        },
        {
          id: 'section2',
          title: 'Section 2',
          children: <Text>Section 2 content</Text>,
        },
      ];

      const { getByText } = render(
        <TestWrapper>
          <FormTemplate
            title="Test Form"
            sections={sections}
          />
        </TestWrapper>
      );

      expect(getByText('Section 1')).toBeTruthy();
      expect(getByText('First section')).toBeTruthy();
      expect(getByText('Section 1 content')).toBeTruthy();
      expect(getByText('Section 2')).toBeTruthy();
      expect(getByText('Section 2 content')).toBeTruthy();
    });

    it('renders sections without titles', () => {
      const sections = [
        {
          id: 'section1',
          children: <Text>Untitled section content</Text>,
        },
      ];

      const { getByText } = render(
        <TestWrapper>
          <FormTemplate
            title="Test Form"
            sections={sections}
          />
        </TestWrapper>
      );

      expect(getByText('Untitled section content')).toBeTruthy();
    });

    it('does not render sections when none provided', () => {
      const { getByText } = render(
        <TestWrapper>
          <FormTemplate title="Test Form">
            <SampleContent />
          </FormTemplate>
        </TestWrapper>
      );

      expect(getByText('Sample form content')).toBeTruthy();
    });
  });

  // Layout options tests
  describe('Layout Options', () => {
    it('renders scrollable content by default', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <FormTemplate
            title="Test Form"
            testID="scrollable-form"
          >
            <SampleContent />
          </FormTemplate>
        </TestWrapper>
      );

      expect(getByTestId('scrollable-form-scroll')).toBeTruthy();
    });

    it('renders non-scrollable content when specified', () => {
      const { queryByTestId } = render(
        <TestWrapper>
          <FormTemplate
            title="Test Form"
            scrollable={false}
            testID="non-scrollable-form"
          >
            <SampleContent />
          </FormTemplate>
        </TestWrapper>
      );

      expect(queryByTestId('non-scrollable-form-scroll')).toBeNull();
    });

    it('applies content padding by default', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <FormTemplate
            title="Test Form"
            testID="padded-form"
          >
            <SampleContent />
          </FormTemplate>
        </TestWrapper>
      );

      expect(getByTestId('padded-form')).toBeTruthy();
    });

    it('removes content padding when disabled', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <FormTemplate
            title="Test Form"
            contentPadding={false}
            testID="no-padding-form"
          >
            <SampleContent />
          </FormTemplate>
        </TestWrapper>
      );

      expect(getByTestId('no-padding-form')).toBeTruthy();
    });

    it('enables keyboard avoiding by default', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <FormTemplate
            title="Test Form"
            testID="keyboard-avoiding-form"
          >
            <SampleContent />
          </FormTemplate>
        </TestWrapper>
      );

      expect(getByTestId('keyboard-avoiding-form')).toBeTruthy();
    });

    it('disables keyboard avoiding when specified', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <FormTemplate
            title="Test Form"
            keyboardAvoiding={false}
            testID="no-keyboard-avoiding-form"
          >
            <SampleContent />
          </FormTemplate>
        </TestWrapper>
      );

      expect(getByTestId('no-keyboard-avoiding-form')).toBeTruthy();
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
          <FormTemplate
            title="Test Form"
            style={customStyle}
            headerStyle={customHeaderStyle}
            contentStyle={customContentStyle}
            actionsStyle={customActionsStyle}
            primaryAction={{ label: 'Test', onPress: () => {} }}
            testID="styled-form"
          >
            <SampleContent />
          </FormTemplate>
        </TestWrapper>
      );

      expect(getByTestId('styled-form')).toBeTruthy();
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    it('has default accessibility label', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <FormTemplate
            title="Test Form"
            testID="accessible-form"
          >
            <SampleContent />
          </FormTemplate>
        </TestWrapper>
      );

      const form = getByTestId('accessible-form');
      expect(form.props.accessibilityLabel).toBe('Test Form form');
    });

    it('applies custom accessibility label', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <FormTemplate
            title="Test Form"
            accessibilityLabel="Custom form label"
            testID="custom-accessible-form"
          >
            <SampleContent />
          </FormTemplate>
        </TestWrapper>
      );

      const form = getByTestId('custom-accessible-form');
      expect(form.props.accessibilityLabel).toBe('Custom form label');
    });
  });

  // Action states tests
  describe('Action States', () => {
    it('renders loading action', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <FormTemplate
            title="Test Form"
            primaryAction={{
              label: 'Loading...',
              onPress: () => {},
              loading: true,
            }}
            testID="loading-form"
          >
            <SampleContent />
          </FormTemplate>
        </TestWrapper>
      );

      expect(getByTestId('loading-form-action-0')).toBeTruthy();
    });

    it('renders disabled action', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <FormTemplate
            title="Test Form"
            primaryAction={{
              label: 'Disabled',
              onPress: () => {},
              disabled: true,
            }}
            testID="disabled-form"
          >
            <SampleContent />
          </FormTemplate>
        </TestWrapper>
      );

      expect(getByTestId('disabled-form-action-0')).toBeTruthy();
    });

    it('renders action with icon', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <FormTemplate
            title="Test Form"
            primaryAction={{
              label: 'Submit',
              onPress: () => {},
              icon: 'checkmark',
            }}
            testID="icon-form"
          >
            <SampleContent />
          </FormTemplate>
        </TestWrapper>
      );

      expect(getByTestId('icon-form-action-0')).toBeTruthy();
    });

    it('renders full width actions', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <FormTemplate
            title="Test Form"
            primaryAction={{
              label: 'Full Width',
              onPress: () => {},
              fullWidth: true,
            }}
            testID="fullwidth-form"
          >
            <SampleContent />
          </FormTemplate>
        </TestWrapper>
      );

      expect(getByTestId('fullwidth-form-action-0')).toBeTruthy();
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
          <FormTemplate title="Test Form">
            <ComplexContent />
          </FormTemplate>
        </TestWrapper>
      );

      expect(getByText('Title')).toBeTruthy();
      expect(getByText('Nested content')).toBeTruthy();
      expect(getByText('More nested content')).toBeTruthy();
    });

    it('handles empty sections array', () => {
      const { getByText } = render(
        <TestWrapper>
          <FormTemplate
            title="Test Form"
            sections={[]}
          >
            <SampleContent />
          </FormTemplate>
        </TestWrapper>
      );

      expect(getByText('Sample form content')).toBeTruthy();
    });

    it('handles empty actions array', () => {
      const { queryByTestId } = render(
        <TestWrapper>
          <FormTemplate
            title="Test Form"
            actions={[]}
            testID="empty-actions-form"
          >
            <SampleContent />
          </FormTemplate>
        </TestWrapper>
      );

      expect(queryByTestId('empty-actions-form-action-0')).toBeNull();
    });
  });

  // Integration tests
  describe('Integration', () => {
    it('works with all features enabled', () => {
      const mockPrimaryAction = jest.fn();
      const mockSecondaryAction = jest.fn();

      const sections = [
        {
          id: 'section1',
          title: 'Test Section',
          description: 'Test description',
          children: <Text>Section content</Text>,
        },
      ];

      const { getByTestId, getByText } = render(
        <TestWrapper>
          <FormTemplate
            title="Full Form"
            subtitle="Complete example"
            description="Full form description"
            sections={sections}
            primaryAction={{
              label: 'Submit',
              onPress: mockPrimaryAction,
              icon: 'checkmark',
            }}
            secondaryAction={{
              label: 'Cancel',
              onPress: mockSecondaryAction,
            }}
            variant="card"
            scrollable={true}
            keyboardAvoiding={true}
            contentPadding={true}
            testID="full-form"
          >
            <Text>Additional content</Text>
          </FormTemplate>
        </TestWrapper>
      );

      expect(getByTestId('full-form')).toBeTruthy();
      expect(getByTestId('full-form-scroll')).toBeTruthy();
      expect(getByTestId('full-form-action-0')).toBeTruthy(); // Secondary
      expect(getByTestId('full-form-action-1')).toBeTruthy(); // Primary
      expect(getByText('Full Form')).toBeTruthy();
      expect(getByText('Complete example')).toBeTruthy();
      expect(getByText('Full form description')).toBeTruthy();
      expect(getByText('Test Section')).toBeTruthy();
      expect(getByText('Test description')).toBeTruthy();
      expect(getByText('Section content')).toBeTruthy();
      expect(getByText('Additional content')).toBeTruthy();
    });
  });
});