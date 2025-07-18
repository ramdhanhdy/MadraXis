/**
 * QuickAction Component Stories
 * Storybook stories demonstrating all QuickAction component variants and use cases
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { QuickAction } from './QuickAction';
import { Typography } from '../../atoms/Typography';

const meta: Meta<typeof QuickAction> = {
  title: 'Molecules/QuickAction',
  component: QuickAction,
  parameters: {
    docs: {
      description: {
        component: 'A consistent dashboard action button with grid layout and visual hierarchy.',
      },
    },
  },
  argTypes: {
    title: {
      control: { type: 'text' },
      description: 'Action title',
    },
    subtitle: {
      control: { type: 'text' },
      description: 'Optional subtitle text',
    },
    icon: {
      control: { type: 'text' },
      description: 'Icon name',
    },
    badge: {
      control: { type: 'number', min: 0, max: 999 },
      description: 'Badge number',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'primary', 'secondary'],
      description: 'Visual variant',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Component size',
    },
    layout: {
      control: { type: 'select' },
      options: ['vertical', 'horizontal'],
      description: 'Icon and text layout',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the action is disabled',
    },
  },
};

export default meta;
type Story = StoryObj<typeof QuickAction>;

// Basic quick action
export const Default: Story = {
  args: {
    title: 'View Schedule',
    icon: 'calendar',
    onPress: () => alert('Schedule pressed!'),
  },
};

// Quick action with subtitle
export const WithSubtitle: Story = {
  args: {
    title: 'Assignments',
    subtitle: '3 pending',
    icon: 'document-text',
    onPress: () => alert('Assignments pressed!'),
  },
};

// Quick action with badge
export const WithBadge: Story = {
  args: {
    title: 'Messages',
    subtitle: 'New messages',
    icon: 'mail',
    badge: 5,
    onPress: () => alert('Messages pressed!'),
  },
};

// Different variants
export const Variants: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
      <QuickAction
        title="Default"
        subtitle="Default variant"
        icon="home"
        variant="default"
        onPress={() => alert('Default pressed')}
        style={{ flex: 1, minWidth: 120 }}
      />
      
      <QuickAction
        title="Primary"
        subtitle="Primary variant"
        icon="star"
        variant="primary"
        onPress={() => alert('Primary pressed')}
        style={{ flex: 1, minWidth: 120 }}
      />
      
      <QuickAction
        title="Secondary"
        subtitle="Secondary variant"
        icon="heart"
        variant="secondary"
        onPress={() => alert('Secondary pressed')}
        style={{ flex: 1, minWidth: 120 }}
      />
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different visual variants for various contexts and emphasis levels.',
      },
    },
  },
};

// Different sizes
export const Sizes: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16, alignItems: 'flex-start' }}>
      <QuickAction
        title="Small"
        subtitle="Small size"
        icon="home"
        size="small"
        onPress={() => alert('Small pressed')}
      />
      
      <QuickAction
        title="Medium"
        subtitle="Medium size"
        icon="home"
        size="medium"
        onPress={() => alert('Medium pressed')}
      />
      
      <QuickAction
        title="Large"
        subtitle="Large size"
        icon="home"
        size="large"
        onPress={() => alert('Large pressed')}
      />
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different sizes for various use cases and visual hierarchy.',
      },
    },
  },
};

// Layout options
export const Layouts: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <View>
        <Typography variant="h4" style={{ marginBottom: 12 }}>
          Vertical Layout (Default)
        </Typography>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <QuickAction
            title="Schedule"
            subtitle="Today's classes"
            icon="calendar"
            layout="vertical"
            onPress={() => alert('Vertical pressed')}
            style={{ flex: 1 }}
          />
          
          <QuickAction
            title="Messages"
            subtitle="New messages"
            icon="mail"
            badge={3}
            layout="vertical"
            onPress={() => alert('Vertical with badge pressed')}
            style={{ flex: 1 }}
          />
        </View>
      </View>
      
      <View>
        <Typography variant="h4" style={{ marginBottom: 12 }}>
          Horizontal Layout
        </Typography>
        <View style={{ gap: 12 }}>
          <QuickAction
            title="Quick Message"
            subtitle="Send to teacher"
            icon="send"
            layout="horizontal"
            onPress={() => alert('Horizontal pressed')}
          />
          
          <QuickAction
            title="Emergency Contact"
            subtitle="Call school office"
            icon="call"
            layout="horizontal"
            badge={1}
            onPress={() => alert('Horizontal with badge pressed')}
          />
        </View>
      </View>
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different layout options for various design needs.',
      },
    },
  },
};

// Badge examples
export const BadgeExamples: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
      <QuickAction
        title="No Badge"
        subtitle="Normal action"
        icon="home"
        onPress={() => alert('No badge pressed')}
        style={{ flex: 1, minWidth: 120 }}
      />
      
      <QuickAction
        title="Small Badge"
        subtitle="Few notifications"
        icon="notifications"
        badge={3}
        onPress={() => alert('Small badge pressed')}
        style={{ flex: 1, minWidth: 120 }}
      />
      
      <QuickAction
        title="Large Badge"
        subtitle="Many notifications"
        icon="mail"
        badge={25}
        onPress={() => alert('Large badge pressed')}
        style={{ flex: 1, minWidth: 120 }}
      />
      
      <QuickAction
        title="Max Badge"
        subtitle="Too many notifications"
        icon="warning"
        badge={150}
        onPress={() => alert('Max badge pressed')}
        style={{ flex: 1, minWidth: 120 }}
      />
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badge examples showing different notification counts and overflow handling.',
      },
    },
  },
};

// Disabled state
export const DisabledState: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16 }}>
      <QuickAction
        title="Enabled"
        subtitle="Normal state"
        icon="checkmark-circle"
        onPress={() => alert('Enabled pressed')}
        style={{ flex: 1 }}
      />
      
      <QuickAction
        title="Disabled"
        subtitle="Cannot interact"
        icon="ban"
        badge={5}
        disabled
        onPress={() => alert('This should not fire')}
        style={{ flex: 1 }}
      />
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison between enabled and disabled quick actions.',
      },
    },
  },
};

// Student dashboard example
export const StudentDashboard: Story = {
  render: () => (
    <View>
      <Typography variant="h3" style={{ marginBottom: 16 }}>
        Student Quick Actions
      </Typography>
      
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
        <QuickAction
          title="Schedule"
          subtitle="Today's classes"
          icon="calendar"
          onPress={() => alert('Navigate to schedule')}
          style={{ flex: 1, minWidth: 150 }}
        />
        
        <QuickAction
          title="Assignments"
          subtitle="3 pending"
          icon="document-text"
          badge={3}
          onPress={() => alert('View assignments')}
          style={{ flex: 1, minWidth: 150 }}
        />
        
        <QuickAction
          title="Grades"
          subtitle="View progress"
          icon="school"
          onPress={() => alert('View grades')}
          style={{ flex: 1, minWidth: 150 }}
        />
        
        <QuickAction
          title="Messages"
          subtitle="New messages"
          icon="mail"
          badge={2}
          onPress={() => alert('View messages')}
          style={{ flex: 1, minWidth: 150 }}
        />
      </View>
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of quick actions used in a student dashboard.',
      },
    },
  },
};

// Teacher dashboard example
export const TeacherDashboard: Story = {
  render: () => (
    <View>
      <Typography variant="h3" style={{ marginBottom: 16 }}>
        Teacher Quick Actions
      </Typography>
      
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
        <QuickAction
          title="Classes"
          subtitle="Manage classes"
          icon="people"
          variant="primary"
          onPress={() => alert('Manage classes')}
          style={{ flex: 1, minWidth: 150 }}
        />
        
        <QuickAction
          title="Attendance"
          subtitle="Mark attendance"
          icon="checkmark-circle"
          onPress={() => alert('Mark attendance')}
          style={{ flex: 1, minWidth: 150 }}
        />
        
        <QuickAction
          title="Assignments"
          subtitle="Create & grade"
          icon="document-text"
          badge={5}
          onPress={() => alert('Manage assignments')}
          style={{ flex: 1, minWidth: 150 }}
        />
        
        <QuickAction
          title="Reports"
          subtitle="Student reports"
          icon="bar-chart"
          onPress={() => alert('View reports')}
          style={{ flex: 1, minWidth: 150 }}
        />
      </View>
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of quick actions used in a teacher dashboard.',
      },
    },
  },
};

// Parent dashboard example
export const ParentDashboard: Story = {
  render: () => (
    <View>
      <Typography variant="h3" style={{ marginBottom: 16 }}>
        Parent Quick Actions
      </Typography>
      
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
        <QuickAction
          title="Child Progress"
          subtitle="Ahmed's grades"
          icon="trending-up"
          variant="secondary"
          onPress={() => alert('View progress')}
          style={{ flex: 1, minWidth: 150 }}
        />
        
        <QuickAction
          title="Attendance"
          subtitle="95% this month"
          icon="calendar-outline"
          onPress={() => alert('View attendance')}
          style={{ flex: 1, minWidth: 150 }}
        />
        
        <QuickAction
          title="Messages"
          subtitle="From teachers"
          icon="mail"
          badge={1}
          onPress={() => alert('View messages')}
          style={{ flex: 1, minWidth: 150 }}
        />
        
        <QuickAction
          title="Payments"
          subtitle="Fee status"
          icon="card"
          onPress={() => alert('View payments')}
          style={{ flex: 1, minWidth: 150 }}
        />
      </View>
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of quick actions used in a parent dashboard.',
      },
    },
  },
};

// Custom colors example
export const CustomColors: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
      <QuickAction
        title="Custom Purple"
        subtitle="Purple icon"
        icon="star"
        iconColor="#9c27b0"
        onPress={() => alert('Purple pressed')}
        style={{ flex: 1, minWidth: 120 }}
      />
      
      <QuickAction
        title="Custom Badge"
        subtitle="Orange badge"
        icon="notifications"
        badge={7}
        badgeColor="#ff5722"
        onPress={() => alert('Orange badge pressed')}
        style={{ flex: 1, minWidth: 120 }}
      />
      
      <QuickAction
        title="Both Custom"
        subtitle="Custom colors"
        icon="heart"
        iconColor="#e91e63"
        badge={12}
        badgeColor="#4caf50"
        onPress={() => alert('Both custom pressed')}
        style={{ flex: 1, minWidth: 120 }}
      />
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Quick actions with custom icon and badge colors.',
      },
    },
  },
};