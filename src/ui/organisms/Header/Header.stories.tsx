/**
 * Header Component Stories
 * Storybook stories demonstrating all Header component variants and use cases
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Header } from './Header';
import { Typography } from '../../atoms/Typography';

const meta: Meta<typeof Header> = {
  title: 'Organisms/Header',
  component: Header,
  parameters: {
    docs: {
      description: {
        component: 'A consistent page header component with title positioning, action buttons, and notification icons.',
      },
    },
  },
  argTypes: {
    title: {
      control: { type: 'text' },
      description: 'Header title',
    },
    subtitle: {
      control: { type: 'text' },
      description: 'Optional subtitle',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'transparent', 'elevated'],
      description: 'Visual variant',
    },
    centerTitle: {
      control: { type: 'boolean' },
      description: 'Whether to center the title',
    },
    showStatusBar: {
      control: { type: 'boolean' },
      description: 'Whether to show status bar',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

// Basic header
export const Default: Story = {
  args: {
    title: 'Dashboard',
  },
};

// Header with subtitle
export const WithSubtitle: Story = {
  args: {
    title: 'Student Dashboard',
    subtitle: 'Welcome back, Ahmed',
  },
};

// Header with back button
export const WithBackButton: Story = {
  args: {
    title: 'Assignment Details',
    leftAction: {
      icon: 'arrow-back',
      onPress: () => alert('Back pressed'),
      accessibilityLabel: 'Go back',
    },
  },
};

// Header with actions
export const WithActions: Story = {
  args: {
    title: 'Messages',
    rightActions: [
      {
        icon: 'search',
        onPress: () => alert('Search pressed'),
        accessibilityLabel: 'Search messages',
      },
      {
        icon: 'add',
        onPress: () => alert('Add pressed'),
        accessibilityLabel: 'New message',
      },
    ],
  },
};

// Header with notifications
export const WithNotifications: Story = {
  args: {
    title: 'Dashboard',
    rightActions: [
      {
        icon: 'notifications',
        onPress: () => alert('Notifications pressed'),
        badge: 3,
        accessibilityLabel: 'Notifications',
        accessibilityHint: '3 unread notifications',
      },
      {
        icon: 'person-circle',
        onPress: () => alert('Profile pressed'),
        accessibilityLabel: 'Profile',
      },
    ],
  },
};

// Different variants
export const Variants: Story = {
  render: () => (
    <View style={{ gap: 20 }}>
      <View>
        <Typography variant="body2" style={{ marginBottom: 8, paddingHorizontal: 16 }}>
          Default Variant
        </Typography>
        <Header
          title="Default Header"
          subtitle="Standard background"
          variant="default"
          rightActions={[
            {
              icon: 'settings',
              onPress: () => alert('Settings'),
            },
          ]}
        />
      </View>
      
      <View>
        <Typography variant="body2" style={{ marginBottom: 8, paddingHorizontal: 16 }}>
          Transparent Variant
        </Typography>
        <Header
          title="Transparent Header"
          subtitle="No background"
          variant="transparent"
          rightActions={[
            {
              icon: 'settings',
              onPress: () => alert('Settings'),
            },
          ]}
        />
      </View>
      
      <View>
        <Typography variant="body2" style={{ marginBottom: 8, paddingHorizontal: 16 }}>
          Elevated Variant
        </Typography>
        <Header
          title="Elevated Header"
          subtitle="With shadow"
          variant="elevated"
          rightActions={[
            {
              icon: 'settings',
              onPress: () => alert('Settings'),
            },
          ]}
        />
      </View>
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different header variants for various contexts.',
      },
    },
  },
};

// Title alignment options
export const TitleAlignment: Story = {
  render: () => (
    <View style={{ gap: 20 }}>
      <View>
        <Typography variant="body2" style={{ marginBottom: 8, paddingHorizontal: 16 }}>
          Centered Title (Default)
        </Typography>
        <Header
          title="Centered Title"
          subtitle="Title is centered"
          centerTitle={true}
          leftAction={{
            icon: 'arrow-back',
            onPress: () => alert('Back'),
          }}
          rightActions={[
            {
              icon: 'ellipsis-vertical',
              onPress: () => alert('More'),
            },
          ]}
        />
      </View>
      
      <View>
        <Typography variant="body2" style={{ marginBottom: 8, paddingHorizontal: 16 }}>
          Left-Aligned Title
        </Typography>
        <Header
          title="Left-Aligned Title"
          subtitle="Title is left-aligned"
          centerTitle={false}
          leftAction={{
            icon: 'arrow-back',
            onPress: () => alert('Back'),
          }}
          rightActions={[
            {
              icon: 'ellipsis-vertical',
              onPress: () => alert('More'),
            },
          ]}
        />
      </View>
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different title alignment options.',
      },
    },
  },
};

// Student dashboard header
export const StudentDashboard: Story = {
  render: () => (
    <Header
      title="Student Dashboard"
      subtitle="Welcome back, Ahmed Al-Rashid"
      variant="elevated"
      rightActions={[
        {
          icon: 'notifications',
          onPress: () => alert('View notifications'),
          badge: 2,
          accessibilityLabel: 'Notifications',
          accessibilityHint: '2 unread notifications',
        },
        {
          icon: 'person-circle',
          onPress: () => alert('View profile'),
          accessibilityLabel: 'Profile menu',
        },
      ]}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Header example for student dashboard.',
      },
    },
  },
};

// Teacher dashboard header
export const TeacherDashboard: Story = {
  render: () => (
    <Header
      title="Teacher Dashboard"
      subtitle="Grade 10A - Mathematics"
      variant="elevated"
      rightActions={[
        {
          icon: 'add-circle',
          onPress: () => alert('Quick add'),
          accessibilityLabel: 'Quick add',
          accessibilityHint: 'Add assignment or announcement',
        },
        {
          icon: 'notifications',
          onPress: () => alert('View notifications'),
          badge: 5,
          accessibilityLabel: 'Notifications',
          accessibilityHint: '5 unread notifications',
        },
        {
          icon: 'person-circle',
          onPress: () => alert('View profile'),
          accessibilityLabel: 'Profile menu',
        },
      ]}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Header example for teacher dashboard.',
      },
    },
  },
};

// Parent dashboard header
export const ParentDashboard: Story = {
  render: () => (
    <Header
      title="Parent Dashboard"
      subtitle="Ahmed Al-Rashid - Grade 10A"
      variant="elevated"
      rightActions={[
        {
          icon: 'call',
          onPress: () => alert('Emergency contact'),
          accessibilityLabel: 'Emergency contact',
          accessibilityHint: 'Call school for emergency',
        },
        {
          icon: 'notifications',
          onPress: () => alert('View notifications'),
          badge: 1,
          accessibilityLabel: 'Notifications',
          accessibilityHint: '1 unread notification',
        },
        {
          icon: 'person-circle',
          onPress: () => alert('View profile'),
          accessibilityLabel: 'Profile menu',
        },
      ]}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Header example for parent dashboard.',
      },
    },
  },
};

// Management dashboard header
export const ManagementDashboard: Story = {
  render: () => (
    <Header
      title="Management Dashboard"
      subtitle="Al-Noor Islamic School"
      variant="elevated"
      rightActions={[
        {
          icon: 'analytics',
          onPress: () => alert('View analytics'),
          accessibilityLabel: 'Analytics',
          accessibilityHint: 'View school analytics',
        },
        {
          icon: 'warning',
          onPress: () => alert('View incidents'),
          badge: 2,
          badgeColor: '#ff9800',
          accessibilityLabel: 'Incidents',
          accessibilityHint: '2 pending incidents',
        },
        {
          icon: 'notifications',
          onPress: () => alert('View notifications'),
          badge: 8,
          accessibilityLabel: 'Notifications',
          accessibilityHint: '8 unread notifications',
        },
        {
          icon: 'person-circle',
          onPress: () => alert('View profile'),
          accessibilityLabel: 'Profile menu',
        },
      ]}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Header example for management dashboard.',
      },
    },
  },
};

// Detail page header
export const DetailPageHeader: Story = {
  render: () => (
    <Header
      title="Assignment Details"
      subtitle="Mathematics - Chapter 5 Exercises"
      leftAction={{
        icon: 'arrow-back',
        onPress: () => alert('Go back'),
        accessibilityLabel: 'Go back',
        accessibilityHint: 'Return to assignments list',
      }}
      rightActions={[
        {
          icon: 'share',
          onPress: () => alert('Share assignment'),
          accessibilityLabel: 'Share',
          accessibilityHint: 'Share assignment details',
        },
        {
          icon: 'bookmark',
          onPress: () => alert('Bookmark assignment'),
          accessibilityLabel: 'Bookmark',
          accessibilityHint: 'Save assignment for later',
        },
        {
          icon: 'ellipsis-vertical',
          onPress: () => alert('More options'),
          accessibilityLabel: 'More options',
        },
      ]}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Header example for detail pages with back navigation.',
      },
    },
  },
};

// Search header
export const SearchHeader: Story = {
  render: () => (
    <Header
      title="Search Students"
      leftAction={{
        icon: 'arrow-back',
        onPress: () => alert('Cancel search'),
        accessibilityLabel: 'Cancel search',
      }}
      rightActions={[
        {
          icon: 'filter',
          onPress: () => alert('Filter results'),
          accessibilityLabel: 'Filter',
          accessibilityHint: 'Filter search results',
        },
      ]}
      centerTitle={false}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Header example for search screens.',
      },
    },
  },
};

// Custom colors
export const CustomColors: Story = {
  render: () => (
    <View style={{ gap: 20 }}>
      <View>
        <Typography variant="body2" style={{ marginBottom: 8, paddingHorizontal: 16 }}>
          Custom Background Color
        </Typography>
        <Header
          title="Custom Header"
          subtitle="Custom background"
          backgroundColor="#2196f3"
          textColor="#ffffff"
          rightActions={[
            {
              icon: 'settings',
              onPress: () => alert('Settings'),
            },
          ]}
        />
      </View>
      
      <View>
        <Typography variant="body2" style={{ marginBottom: 8, paddingHorizontal: 16 }}>
          Dark Theme Header
        </Typography>
        <Header
          title="Dark Header"
          subtitle="Dark theme styling"
          backgroundColor="#1a1a1a"
          textColor="#ffffff"
          rightActions={[
            {
              icon: 'notifications',
              onPress: () => alert('Notifications'),
              badge: 3,
              badgeColor: '#ff4444',
            },
          ]}
        />
      </View>
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Headers with custom colors and theming.',
      },
    },
  },
};

// Badge examples
export const BadgeExamples: Story = {
  render: () => (
    <Header
      title="Badge Examples"
      subtitle="Different badge configurations"
      rightActions={[
        {
          icon: 'mail',
          onPress: () => alert('Messages'),
          badge: 1,
          accessibilityLabel: 'Messages',
          accessibilityHint: '1 unread message',
        },
        {
          icon: 'notifications',
          onPress: () => alert('Notifications'),
          badge: 25,
          accessibilityLabel: 'Notifications',
          accessibilityHint: '25 unread notifications',
        },
        {
          icon: 'warning',
          onPress: () => alert('Alerts'),
          badge: 150,
          badgeColor: '#ff9800',
          accessibilityLabel: 'Alerts',
          accessibilityHint: 'Many unread alerts',
        },
      ]}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Examples of different badge counts and colors.',
      },
    },
  },
};