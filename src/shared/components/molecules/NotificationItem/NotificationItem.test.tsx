import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from '@/src/context/ThemeContext';
import { NotificationItem, NotificationItemProps } from './NotificationItem';

const mockOnPress = jest.fn();

const defaultProps: NotificationItemProps = {
  id: '1',
  title: 'Test Notification',
  message: 'This is a test message.',
  timestamp: '5 minutes ago',
  type: 'info',
  read: false,
  onPress: mockOnPress,
  testID: 'notification-item',
};

const renderWithTheme = (props: Partial<NotificationItemProps> = {}) => {
  return render(
    <ThemeProvider>
      <NotificationItem {...defaultProps} {...props} />
    </ThemeProvider>
  );
};

describe('NotificationItem', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const { getByText, getByTestId } = renderWithTheme();

    expect(getByText('Test Notification')).toBeTruthy();
    expect(getByText('This is a test message.')).toBeTruthy();
    expect(getByText('5 minutes ago')).toBeTruthy();
    expect(getByTestId('notification-item-unread-indicator')).toBeTruthy();
  });

  it('does not render unread indicator when read is true', () => {
    const { queryByTestId } = renderWithTheme({ read: true });
    expect(queryByTestId('notification-item-unread-indicator')).toBeNull();
  });

  it('calls onPress when the item is pressed', () => {
    const { getByTestId } = renderWithTheme();
    fireEvent.press(getByTestId('notification-item'));
    expect(mockOnPress).toHaveBeenCalledWith('1');
  });

  it('does not call onPress when disabled', () => {
    const { getByTestId } = renderWithTheme({ onPress: undefined });
    const item = getByTestId('notification-item');
    fireEvent.press(item);
    expect(mockOnPress).not.toHaveBeenCalled();
    expect(item.props.accessibilityState.disabled).toBe(true);
  });

  it.each([
    ['success' as const],
    ['error' as const],
    ['info' as const],
    ['warning' as const],
  ])('renders the correct icon for type %s', (type) => {
    const { getByTestId } = renderWithTheme({ type });
    const touchable = getByTestId('notification-item');
    const icon = touchable.findByProps({ name: expect.any(String) });
    expect(icon).toBeTruthy();
  });

  it('renders title, message, and timestamp correctly', () => {
    const props = {
      title: 'Custom Title',
      message: 'Custom message for testing.',
      timestamp: 'Just now',
    };
    const { getByText } = renderWithTheme(props);

    expect(getByText('Custom Title')).toBeTruthy();
    expect(getByText('Custom message for testing.')).toBeTruthy();
    expect(getByText('Just now')).toBeTruthy();
  });
});
