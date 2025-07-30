import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text, TouchableOpacity } from 'react-native';

// Simple mock Button component for testing infrastructure
const MockButton: React.FC<{ children: React.ReactNode; onPress?: () => void; loading?: boolean }> = ({
  children,
  onPress,
  loading
}) => (
  <TouchableOpacity onPress={onPress} testID="mock-button">
    <Text>{loading ? 'Loading...' : children}</Text>
    {loading && <Text testID="loading-spinner">Loading</Text>}
  </TouchableOpacity>
);

describe('Button Component Infrastructure Test', () => {
  it('renders correctly with default props', () => {
    const { getByText } = render(<MockButton>Click me</MockButton>);
    const button = getByText('Click me');
    expect(button).toBeDefined();
  });

  it('handles press events', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(<MockButton onPress={onPressMock}>Click me</MockButton>);
    const button = getByTestId('mock-button');
    fireEvent.press(button);
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('shows loading state when loading prop is true', () => {
    const { getByTestId } = render(<MockButton loading>Click me</MockButton>);
    const loadingIndicator = getByTestId('loading-spinner');
    expect(loadingIndicator).toBeDefined();
  });
});
