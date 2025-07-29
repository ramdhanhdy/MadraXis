/**
 * Card Component Stories
 * Storybook stories demonstrating all Card component variants and use cases
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Card } from './Card';
import { Typography } from '../../atoms/Typography';
import { Icon } from '../../atoms/Icon';
import { Button } from '../../atoms/Button';

const meta: Meta<typeof Card> = {
  title: 'Molecules/Card',
  component: Card,
  parameters: {
    docs: {
      description: {
        component: 'A consistent content container component with multiple variants and padding options.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'elevated', 'outlined'],
      description: 'Visual variant of the card',
    },
    padding: {
      control: { type: 'select' },
      options: ['none', 'small', 'medium', 'large'],
      description: 'Internal padding size',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the card is disabled (if interactive)',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Whether the card is in loading state',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

// Basic card with default settings
export const Default: Story = {
  args: {
    children: (
      <View>
        <Typography variant="h4">Default Card</Typography>
        <Typography variant="body1">This is a default card with medium padding and shadow.</Typography>
      </View>
    ),
  },
};

// All variants side by side
export const Variants: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Card variant="default">
        <Typography variant="h4">Default Card</Typography>
        <Typography variant="body2">With shadow elevation</Typography>
      </Card>
      
      <Card variant="elevated">
        <Typography variant="h4">Elevated Card</Typography>
        <Typography variant="body2">With enhanced shadow</Typography>
      </Card>
      
      <Card variant="outlined">
        <Typography variant="h4">Outlined Card</Typography>
        <Typography variant="body2">With border, no shadow</Typography>
      </Card>
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different visual variants of the Card component.',
      },
    },
  },
};

// All padding options
export const PaddingOptions: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Card padding="none" variant="outlined">
        <Typography variant="body2">No Padding (0px)</Typography>
      </Card>
      
      <Card padding="small" variant="outlined">
        <Typography variant="body2">Small Padding (12px)</Typography>
      </Card>
      
      <Card padding="medium" variant="outlined">
        <Typography variant="body2">Medium Padding (16px)</Typography>
      </Card>
      
      <Card padding="large" variant="outlined">
        <Typography variant="body2">Large Padding (20px)</Typography>
      </Card>
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different padding options for the Card component.',
      },
    },
  },
};

// Interactive card
export const Interactive: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Card onPress={() => alert('Card pressed!')}>
        <Typography variant="h4">Interactive Card</Typography>
        <Typography variant="body2">Tap me to see the interaction</Typography>
      </Card>
      
      <Card onPress={() => alert('Disabled card')} disabled>
        <Typography variant="h4">Disabled Card</Typography>
        <Typography variant="body2" color="disabled">This card is disabled</Typography>
      </Card>
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Interactive cards with press handling and disabled states.',
      },
    },
  },
};

// Loading state
export const LoadingState: Story = {
  args: {
    loading: true,
    children: (
      <View>
        <Typography variant="h4">Loading Card</Typography>
        <Typography variant="body1">Content is loading...</Typography>
      </View>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Card in loading state with reduced opacity.',
      },
    },
  },
};

// Dashboard quick action example
export const DashboardQuickAction: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
      <Card 
        style={{ flex: 1, minWidth: 150, alignItems: 'center' }}
        onPress={() => alert('View Schedule')}
      >
        <Icon name="calendar" size="xl" color="primary" />
        <Typography variant="h4" align="center" style={{ marginTop: 8 }}>
          Schedule
        </Typography>
        <Typography variant="body2" color="secondary" align="center">
          View daily classes
        </Typography>
      </Card>
      
      <Card 
        style={{ flex: 1, minWidth: 150, alignItems: 'center' }}
        onPress={() => alert('View Grades')}
      >
        <Icon name="school" size="xl" color="success" />
        <Typography variant="h4" align="center" style={{ marginTop: 8 }}>
          Grades
        </Typography>
        <Typography variant="body2" color="secondary" align="center">
          Check your progress
        </Typography>
      </Card>
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of cards used as dashboard quick actions.',
      },
    },
  },
};

// Information display card
export const InformationDisplay: Story = {
  render: () => (
    <Card variant="outlined" padding="large">
      <Typography variant="h3" style={{ marginBottom: 16 }}>
        Student Information
      </Typography>
      
      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Typography variant="body1" weight="medium">Name:</Typography>
          <Typography variant="body1">Ahmed Al-Rashid</Typography>
        </View>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Typography variant="body1" weight="medium">Class:</Typography>
          <Typography variant="body1">Grade 10-A</Typography>
        </View>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Typography variant="body1" weight="medium">Status:</Typography>
          <Typography variant="body1" color="success">Active</Typography>
        </View>
      </View>
      
      <Button 
        variant="outline" 
        size="small" 
        style={{ marginTop: 16 }}
        onPress={() => alert('View Details')}
      >
        View Details
      </Button>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of card used for displaying structured information.',
      },
    },
  },
};

// Complex content card
export const ComplexContent: Story = {
  render: () => (
    <Card>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <Icon name="notifications" size="md" color="warning" />
        <Typography variant="h4" style={{ marginLeft: 8, flex: 1 }}>
          Important Notice
        </Typography>
        <Typography variant="caption" color="secondary">
          2 hours ago
        </Typography>
      </View>
      
      <Typography variant="body1" style={{ marginBottom: 16 }}>
        Parent-teacher conference scheduled for next week. Please confirm your attendance.
      </Typography>
      
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Button variant="primary" size="small" style={{ flex: 1 }}>
          Confirm
        </Button>
        <Button variant="outline" size="small" style={{ flex: 1 }}>
          Reschedule
        </Button>
      </View>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of card with complex content including icons, text, and actions.',
      },
    },
  },
};