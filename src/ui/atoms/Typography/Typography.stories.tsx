import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Typography } from './Typography';
import { View } from 'react-native';

const meta: Meta<typeof Typography> = {
  title: 'UI/Atoms/Typography',
  component: Typography,
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
        component: 'Typography component for consistent text styling across the app.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Typography>;

export const Heading1: Story = {
  args: {
    children: 'Heading 1 - Bold and Large',
    variant: 'h1',
  },
};

export const Heading2: Story = {
  args: {
    children: 'Heading 2 - Subheading Style',
    variant: 'h2',
  },
};

export const Body1: Story = {
  args: {
    children: 'This is body text with regular styling. It provides the main content for your interface.',
    variant: 'body1',
  },
};

export const Body2: Story = {
  args: {
    children: 'This is secondary body text with smaller styling.',
    variant: 'body2',
  },
};

export const Caption: Story = {
  args: {
    children: 'Small caption text for secondary information.',
    variant: 'caption',
  },
};

export const Centered: Story = {
  args: {
    children: 'Centered text example',
    variant: 'body1',
    align: 'center',
  },
};

export const ColoredText: Story = {
  args: {
    children: 'This text has custom color styling',
    variant: 'body1',
    color: 'success',
  },
};