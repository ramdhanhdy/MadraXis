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
  });

  describe('Status Indicator', () => {
    it('shows status indicator when enabled', () => {
      render(
        <TestWrapper>
          <Avatar name="John Doe" showStatus status="online" testID="status-avatar" />
        </TestWrapper>
      );
      expect(screen.getByTestId('status-indicator')).toBeTruthy();
    });

    it('hides status indicator by default', () => {
      render(
        <TestWrapper>
          <Avatar name="John Doe" testID="no-status-avatar" />
        </TestWrapper>
      );
      expect(screen.queryByTestId('status-indicator')).toBeNull();
    });
  });

  describe('Interactive Behavior', () => {
    it('calls onPress when pressed', () => {
      const onPress = jest.fn();
      render(
        <TestWrapper>
          <Avatar name="John Doe" onPress={onPress} testID="interactive-avatar" />
        </TestWrapper>
      );
      
      const avatar = screen.getByTestId('interactive-avatar');
      fireEvent.press(avatar);
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('does not call onPress when disabled', () => {
      const onPress = jest.fn();
      render(
        <TestWrapper>
          <Avatar name="John Doe" onPress={onPress} disabled testID="disabled-avatar" />
        </TestWrapper>
      );
      
      const avatar = screen.getByTestId('disabled-avatar');
      fireEvent.press(avatar);
      expect(onPress).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has correct accessibility role for interactive avatar', () => {
      render(
        <TestWrapper>
          <Avatar name="John Doe" onPress={() => {}} testID="button-avatar" />
        </TestWrapper>
      );
      
      const avatar = screen.getByTestId('button-avatar');
      expect(avatar.props.accessibilityRole).toBe('button');
    });

    it('has correct accessibility role for non-interactive avatar', () => {
      render(
        <TestWrapper>
          <Avatar name="John Doe" testID="image-avatar" />
        </TestWrapper>
      );
      
      const avatar = screen.getByTestId('image-avatar');
      expect(avatar.props.accessibilityRole).toBe('image');
    });

    it('generates default accessibility label from name', () => {
      render(
        <TestWrapper>
          <Avatar name="John Doe" testID="default-label-avatar" />
        </TestWrapper>
      );
      
      expect(screen.getByLabelText('Avatar for John Doe')).toBeTruthy();
    });

    it('uses custom accessibility label when provided', () => {
      render(
        <TestWrapper>
          <Avatar name="John Doe" accessibilityLabel="Custom Label" testID="custom-label-avatar" />
        </TestWrapper>
      );
      
      expect(screen.getByLabelText('Custom Label')).toBeTruthy();
    });

    it('has correct accessibility state when disabled', () => {
      render(
        <TestWrapper>
          <Avatar name="John Doe" onPress={() => {}} disabled testID="disabled-avatar" />
        </TestWrapper>
      );
      
      const avatar = screen.getByTestId('disabled-avatar');
      expect(avatar.props.accessibilityState.disabled).toBe(true);
    });
  });

  describe('Custom Styling', () => {
    it('applies custom container styles', () => {
      const customStyle = { backgroundColor: 'red' };
      render(
        <TestWrapper>
          <Avatar name="John Doe" containerStyle={customStyle} testID="custom-style-avatar" />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('custom-style-avatar')).toBeTruthy();
    });

    it('applies custom text styles', () => {
      const customTextStyle = { fontSize: 20 };
      render(
        <TestWrapper>
          <Avatar name="John Doe" textStyle={customTextStyle} testID="custom-text-avatar" />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('custom-text-avatar')).toBeTruthy();
    });

    it('uses custom colors when provided', () => {
      render(
        <TestWrapper>
          <Avatar 
            name="John Doe" 
            backgroundColor="blue" 
            textColor="white"
            testID="custom-color-avatar" 
          />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('custom-color-avatar')).toBeTruthy();
    });
  });

  describe('Size Variations', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
    
    sizes.forEach(size => {
      it(`renders ${size} size correctly`, () => {
        render(
          <TestWrapper>
            <Avatar name="John Doe" size={size} testID={`avatar-${size}`} />
          </TestWrapper>
        );
        
        expect(screen.getByTestId(`avatar-${size}`)).toBeTruthy();
      });
    });

    it('renders with custom numeric size', () => {
      render(
        <TestWrapper>
          <Avatar name="John Doe" size={100} testID="avatar-custom-size" />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('avatar-custom-size')).toBeTruthy();
    });
  });

  describe('Shape Variations', () => {
    const shapes = ['circle', 'square', 'rounded'] as const;
    
    shapes.forEach(shape => {
      it(`renders ${shape} shape correctly`, () => {
        render(
          <TestWrapper>
            <Avatar name="John Doe" shape={shape} testID={`avatar-${shape}`} />
          </TestWrapper>
        );
        
        expect(screen.getByTestId(`avatar-${shape}`)).toBeTruthy();
      });
    });
  });

  describe('Status Variations', () => {
    const statuses = ['online', 'offline', 'away', 'busy'] as const;
    
    statuses.forEach(status => {
      it(`renders ${status} status correctly`, () => {
        render(
          <TestWrapper>
            <Avatar name="John Doe" showStatus status={status} testID={`avatar-${status}`} />
          </TestWrapper>
        );
        
        expect(screen.getByTestId(`avatar-${status}`)).toBeTruthy();
        expect(screen.getByTestId('status-indicator')).toBeTruthy();
      });
    });
  });
});
