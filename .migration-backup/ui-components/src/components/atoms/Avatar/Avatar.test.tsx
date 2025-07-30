import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { ThemeProvider } from '../../../context/ThemeContext';
import { Avatar } from './Avatar';

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

const mockImageSource = { uri: 'https://example.com/avatar.jpg' };

describe('Avatar Component', () => {
  describe('Rendering', () => {
    it('renders basic avatar with initials', () => {
      render(
        <TestWrapper>
          <Avatar name="John Doe" testID="basic-avatar" />
        </TestWrapper>
      );
      expect(screen.getByTestId('basic-avatar')).toBeTruthy();
      expect(screen.getByText('JD')).toBeTruthy();
    });

    it('renders with accessibility label', () => {
      render(
        <TestWrapper>
          <Avatar name="John Doe" accessibilityLabel="John Doe's avatar" testID="labeled-avatar" />
        </TestWrapper>
      );
      expect(screen.getByLabelText("John Doe's avatar")).toBeTruthy();
    });
  });

  describe('Sizes and Shapes', () => {
    it('renders md size correctly', () => {
      render(
        <TestWrapper>
          <Avatar name="John Doe" size="md" testID="avatar-md" />
        </TestWrapper>
      );
      expect(screen.getByTestId('avatar-md')).toBeTruthy();
    });

    it('renders with circle shape', () => {
      render(
        <TestWrapper>
          <Avatar name="John Doe" shape="circle" testID="avatar-circle" />
        </TestWrapper>
      );
      expect(screen.getByTestId('avatar-circle')).toBeTruthy();
    });
  });

  describe('Initials Generation', () => {
    it('generates initials from full name', () => {
      render(
        <TestWrapper>
          <Avatar name="John Doe" />
        </TestWrapper>
      );
      expect(screen.getByText('JD')).toBeTruthy();
    });

    it('uses custom initials when provided', () => {
      render(
        <TestWrapper>
          <Avatar name="John Doe" initials="AB" />
        </TestWrapper>
      );
      expect(screen.getByText('AB')).toBeTruthy();
    });

    it('shows fallback when no name or initials', () => {
      render(
        <TestWrapper>
          <Avatar />
        </TestWrapper>
      );
      expect(screen.getByText('?')).toBeTruthy();
    });
  });

  describe('Image Handling', () => {
    it('renders with image source', () => {
      render(
        <TestWrapper>
          <Avatar source={mockImageSource} name="John Doe" testID="image-avatar" />
        </TestWrapper>
      );
      expect(screen.getByTestId('image-avatar')).toBeTruthy();
    });

    it('falls back to initials when image fails to load', () => {
      render(
        <TestWrapper>
          <Avatar source={{ uri: 'invalid-url' }} name="John Doe" />
        </TestWrapper>
      );
      const image = screen.getByTestId('avatar-image');
      fireEvent(image, 'error');
      expect(screen.getByText('JD')).toBeTruthy();
    });

    it('renders with local image source', () => {
      const localSource = 1; // Mock require result
      render(
        <TestWrapper>
          <Avatar source={localSource} name="John Doe" testID="local-image-avatar" />
        </TestWrapper>
      );
      expect(screen.getByTestId('local-image-avatar')).toBeTruthy();
    });
  });

  describe('Interactivity', () => {
    it('calls onPress when pressed', () => {
      const onPress = jest.fn();
      render(
        <TestWrapper>
          <Avatar name="John Doe" onPress={onPress} testID="pressable-avatar" />
        </TestWrapper>
      );
      fireEvent.press(screen.getByTestId('pressable-avatar'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('does not call onPress when disabled', () => {
      const onPress = jest.fn();
      render(
        <TestWrapper>
          <Avatar name="John Doe" onPress={onPress} disabled testID="disabled-avatar" />
        </TestWrapper>
      );
      fireEvent.press(screen.getByTestId('disabled-avatar'));
      expect(onPress).not.toHaveBeenCalled();
    });
  });

  describe('Status Indicators', () => {
    it('renders with online status', () => {
      render(
        <TestWrapper>
          <Avatar name="John Doe" showStatus status="online" testID="avatar-online" />
        </TestWrapper>
      );
      expect(screen.getByTestId('avatar-online')).toBeTruthy();
      expect(screen.getByTestId('status-indicator')).toBeTruthy();
    });
  });

  describe('Customization', () => {
    it('renders with custom image source', () => {
      const customImageSource = { uri: 'https://example.com/custom-avatar.jpg' };
      render(
        <TestWrapper>
          <Avatar source={customImageSource} name="John Doe" testID="custom-image-avatar" />
        </TestWrapper>
      );
      expect(screen.getByTestId('custom-image-avatar')).toBeTruthy();
    });

    it('applies custom text style', () => {
      const customTextStyle = { fontStyle: 'italic' as const };
      render(
        <TestWrapper>
          <Avatar name="John Doe" textStyle={customTextStyle} testID="custom-text-style-avatar" />
        </TestWrapper>
      );
      expect(screen.getByTestId('custom-text-style-avatar')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('uses custom accessibility hint', () => {
      render(
        <TestWrapper>
          <Avatar name="John Doe" onPress={() => {}} accessibilityHint="View user profile" testID="hint-avatar" />
        </TestWrapper>
      );
      const avatar = screen.getByTestId('hint-avatar');
      expect(avatar.props.accessibilityHint).toBe('View user profile');
    });

    it('provides default accessibility label', () => {
      render(
        <TestWrapper>
          <Avatar testID="default-label-avatar" />
        </TestWrapper>
      );
      expect(screen.getByLabelText('User avatar')).toBeTruthy();
    });
  });

  describe('Complex Combinations', () => {
    it('renders with all features combined', () => {
      const onPress = jest.fn();
      render(
        <TestWrapper>
          <Avatar
            source={mockImageSource}
            name="John Doe"
            size="lg"
            shape="rounded"
            backgroundColor="#f0f0f0"
            textColor="#333333"
            borderColor="#cccccc"
            borderWidth={1}
            showStatus
            status="online"
            statusColor="#00ff00"
            onPress={onPress}
            accessibilityLabel="John Doe's profile picture"
            accessibilityHint="Tap to view profile"
            testID="complex-avatar"
          />
        </TestWrapper>
      );
      const avatar = screen.getByTestId('complex-avatar');
      expect(avatar).toBeTruthy();
      expect(avatar.props.accessibilityRole).toBe('button');
      expect(avatar.props.accessibilityLabel).toBe("John Doe's profile picture");
      expect(avatar.props.accessibilityHint).toBe('Tap to view profile');
      fireEvent.press(avatar);
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('handles image error with all features', () => {
      const onPress = jest.fn();
      render(
        <TestWrapper>
          <Avatar
            source={mockImageSource}
            name="John Doe"
            size="xl"
            shape="circle"
            showStatus
            status="busy"
            onPress={onPress}
            testID="error-handling-avatar"
          />
        </TestWrapper>
      );
      const avatar = screen.getByTestId('error-handling-avatar');
      expect(avatar).toBeTruthy();
      fireEvent.press(avatar);
      expect(onPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty name gracefully', () => {
      render(
        <TestWrapper>
          <Avatar name="" testID="empty-name-avatar" />
        </TestWrapper>
      );
      expect(screen.getByTestId('empty-name-avatar')).toBeTruthy();
      expect(screen.getByText('?')).toBeTruthy();
    });

    it('handles whitespace-only name', () => {
      render(
        <TestWrapper>
          <Avatar name="   " testID="whitespace-name-avatar" />
        </TestWrapper>
      );
      expect(screen.getByTestId('whitespace-name-avatar')).toBeTruthy();
    });

    it('handles special characters in name', () => {
      render(
        <TestWrapper>
          <Avatar name="José María" testID="special-chars-avatar" />
        </TestWrapper>
      );
      expect(screen.getByTestId('special-chars-avatar')).toBeTruthy();
      expect(screen.getByText('JM')).toBeTruthy();
    });

    it('handles very long names', () => {
      render(
        <TestWrapper>
          <Avatar name="Very Long Name With Many Words That Should Be Truncated" testID="long-name-avatar" />
        </TestWrapper>
      );
      expect(screen.getByTestId('long-name-avatar')).toBeTruthy();
      expect(screen.getByText('VT')).toBeTruthy();
    });
  });
});