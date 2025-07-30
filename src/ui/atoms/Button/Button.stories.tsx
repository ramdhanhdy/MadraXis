import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Button } from './Button';
import { View } from 'react-native';

const meta: Meta<typeof Button> = {
  title: 'UI/Atoms/Button',
  component: Button,
  decorators: [
    (Story) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: 'A reusable Button component that supports multiple variants and sizes.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
};

export const Destructive: Story = {
  args: {
    children: 'Destructive Button',
    variant: 'danger',
  },
};

export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'large',
  },
};

export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 'small',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    children: 'Loading Button',
    loading: true,
  },
};

export const WithIcon: Story = {
  args: {
    children: 'Button with Icon',
    icon: 'heart-outline',
    iconPosition: 'left',
  },
};
