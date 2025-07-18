/**
 * DashboardTemplate Component Stories
 * Storybook stories demonstrating all DashboardTemplate component variants and use cases
 */

import React from 'react';
import { View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { DashboardTemplate } from './DashboardTemplate';
import { Card } from '../../molecules/Card';
import { QuickAction } from '../../molecules/QuickAction';
import { Typography } from '../../atoms/Typography';
import { Button } from '../../atoms/Button';

const meta: Meta<typeof DashboardTemplate> = {
  title: 'Templates/DashboardTemplate',
  component: DashboardTemplate,
  parameters: {
    docs: {
      description: {
        component: 'A consistent dashboard template with header, content area, and optional tab bar for all user roles.',
      },
    },
  },
  argTypes: {
    backgroundPattern: {
      control: { type: 'boolean' },
      description: 'Whether to show background pattern',
    },
    scrollable: {
      control: { type: 'boolean' },
      description: 'Whether content is scrollable',
    },
    safeArea: {
      control: { type: 'boolean' },
      description: 'Whether to use SafeAreaView',
    },
    contentPadding: {
      control: { type: 'boolean' },
      description: 'Whether to add padding to content',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DashboardTemplate>;

// Sample content components
const SampleContent: React.FC = () => (
  <View style={{ gap: 16 }}>
    <Typography variant="h3">Welcome Back!</Typography>
    <Typography variant="body1" color="secondary">
      Here's what's happening in your dashboard today.
    </Typography>
    
    <Card variant="elevated" padding="medium">
      <Typography variant="h4" style={{ marginBottom: 8 }}>
        Quick Stats
      </Typography>
      <Typography variant="body2" color="secondary">
        Your activity summary for today
      </Typography>
    </Card>
    
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <View style={{ flex: 1 }}>
        <QuickAction
          title="Messages"
          icon="mail"
          iconColor="#005e7a"
          onPress={() => alert('Messages')}
          badge={3}
        />
      </View>
      <View style={{ flex: 1 }}>
        <QuickAction
          title="Calendar"
          icon="calendar"
          iconColor="#f0c75e"
          onPress={() => alert('Calendar')}
        />
      </View>
    </View>
    
    <Card variant="default" padding="medium">
      <Typography variant="h4" style={{ marginBottom: 8 }}>
        Recent Activity
      </Typography>
      <Typography variant="body2" color="secondary">
        No recent activity to show
      </Typography>
    </Card>
  </View>
);

const LongContent: React.FC = () => (
  <View style={{ gap: 16 }}>
    {Array.from({ length: 10 }, (_, i) => (
      <Card key={i} variant="elevated" padding="medium">
        <Typography variant="h4" style={{ marginBottom: 8 }}>
          Card {i + 1}
        </Typography>
        <Typography variant="body2" color="secondary">
          This is sample content for card {i + 1}. It demonstrates scrollable content in the dashboard template.
        </Typography>
      </Card>
    ))}
  </View>
);

// Basic dashboard template
export const Default: Story = {
  args: {
    header: {
      title: 'Dashboard',
      rightActions: [
        {
          icon: 'notifications',
          onPress: () => alert('Notifications'),
          badge: 5,
        },
        {
          icon: 'settings',
          onPress: () => alert('Settings'),
        },
      ],
    },
    children: <SampleContent />,
  },
};

// With subtitle
export const WithSubtitle: Story = {
  args: {
    header: {
      title: 'Student Dashboard',
      subtitle: 'Welcome back, Ahmed!',
      rightActions: [
        {
          icon: 'notifications',
          onPress: () => alert('Notifications'),
          badge: 3,
        },
      ],
    },
    children: <SampleContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard template with header subtitle.',
      },
    },
  },
};

// With back button
export const WithBackButton: Story = {
  args: {
    header: {
      title: 'Assignment Details',
      leftAction: {
        icon: 'arrow-back',
        onPress: () => alert('Go back'),
        accessibilityLabel: 'Go back',
      },
      rightActions: [
        {
          icon: 'share',
          onPress: () => alert('Share'),
        },
      ],
    },
    children: <SampleContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard template with back button navigation.',
      },
    },
  },
};

// With tabs
export const WithTabs: Story = {
  args: {
    header: {
      title: 'Dashboard',
      rightActions: [
        {
          icon: 'notifications',
          onPress: () => alert('Notifications'),
          badge: 2,
        },
      ],
    },
    tabs: [
      { id: 'home', label: 'Home', icon: 'home' },
      { id: 'assignments', label: 'Assignments', icon: 'book', badge: 3 },
      { id: 'grades', label: 'Grades', icon: 'school' },
      { id: 'profile', label: 'Profile', icon: 'person' },
    ],
    activeTab: 'home',
    onTabChange: (tabId) => alert(`Switched to ${tabId}`),
    children: <SampleContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard template with bottom tab navigation.',
      },
    },
  },
};

// Scrollable content
export const ScrollableContent: Story = {
  args: {
    header: {
      title: 'Long Content',
      rightActions: [
        {
          icon: 'ellipsis-vertical',
          onPress: () => alert('More options'),
        },
      ],
    },
    scrollable: true,
    children: <LongContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard template with scrollable content.',
      },
    },
  },
};

// Without background pattern
export const NoBackgroundPattern: Story = {
  args: {
    header: {
      title: 'Clean Dashboard',
      rightActions: [
        {
          icon: 'notifications',
          onPress: () => alert('Notifications'),
        },
      ],
    },
    backgroundPattern: false,
    children: <SampleContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard template without background pattern.',
      },
    },
  },
};

// Custom colors
export const CustomColors: Story = {
  args: {
    header: {
      title: 'Custom Theme',
      rightActions: [
        {
          icon: 'color-palette',
          onPress: () => alert('Theme'),
        },
      ],
    },
    backgroundColor: '#1a1a1a',
    contentBackgroundColor: 'rgba(255, 255, 255, 0.05)',
    children: <SampleContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard template with custom colors.',
      },
    },
  },
};

// Student dashboard example
export const StudentDashboard: Story = {
  args: {
    header: {
      title: 'Student Portal',
      subtitle: 'Welcome back, Ahmed!',
      rightActions: [
        {
          icon: 'notifications',
          onPress: () => alert('Notifications'),
          badge: 4,
          accessibilityLabel: '4 new notifications',
        },
        {
          icon: 'person',
          onPress: () => alert('Profile'),
          accessibilityLabel: 'View profile',
        },
      ],
    },
    tabs: [
      { id: 'dashboard', label: 'Dashboard', icon: 'home' },
      { id: 'assignments', label: 'Assignments', icon: 'book', badge: 2 },
      { id: 'grades', label: 'Grades', icon: 'school' },
      { id: 'schedule', label: 'Schedule', icon: 'calendar' },
    ],
    activeTab: 'dashboard',
    onTabChange: (tabId) => alert(`Navigate to ${tabId}`),
    children: (
      <View style={{ gap: 16 }}>
        <Typography variant="h3">Good Morning, Ahmed!</Typography>
        <Typography variant="body1" color="secondary">
          You have 2 assignments due this week and 1 upcoming test.
        </Typography>
        
        <Card variant="elevated" padding="medium">
          <Typography variant="h4" style={{ marginBottom: 8 }}>
            Today's Schedule
          </Typography>
          <Typography variant="body2" color="secondary">
            Mathematics - 9:00 AM
          </Typography>
          <Typography variant="body2" color="secondary">
            Science - 11:00 AM
          </Typography>
          <Typography variant="body2" color="secondary">
            English - 2:00 PM
          </Typography>
        </Card>
        
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <QuickAction
              title="Assignments"
              icon="book"
              iconColor="#005e7a"
              onPress={() => alert('View assignments')}
              badge={2}
            />
          </View>
          <View style={{ flex: 1 }}>
            <QuickAction
              title="Messages"
              icon="mail"
              iconColor="#f0c75e"
              onPress={() => alert('View messages')}
              badge={1}
            />
          </View>
        </View>
        
        <Card variant="default" padding="medium">
          <Typography variant="h4" style={{ marginBottom: 8 }}>
            Recent Grades
          </Typography>
          <Typography variant="body2" color="secondary">
            Mathematics Test: 92%
          </Typography>
          <Typography variant="body2" color="secondary">
            Science Quiz: 88%
          </Typography>
        </Card>
      </View>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete student dashboard example with role-specific content.',
      },
    },
  },
};

// Teacher dashboard example
export const TeacherDashboard: Story = {
  args: {
    header: {
      title: 'Teacher Portal',
      subtitle: 'Ms. Sarah Johnson',
      rightActions: [
        {
          icon: 'notifications',
          onPress: () => alert('Notifications'),
          badge: 8,
          accessibilityLabel: '8 new notifications',
        },
        {
          icon: 'add',
          onPress: () => alert('Create new'),
          accessibilityLabel: 'Create new content',
        },
      ],
    },
    tabs: [
      { id: 'dashboard', label: 'Dashboard', icon: 'home' },
      { id: 'classes', label: 'Classes', icon: 'school' },
      { id: 'assignments', label: 'Assignments', icon: 'book', badge: 5 },
      { id: 'grades', label: 'Grades', icon: 'analytics' },
    ],
    activeTab: 'dashboard',
    onTabChange: (tabId) => alert(`Navigate to ${tabId}`),
    children: (
      <View style={{ gap: 16 }}>
        <Typography variant="h3">Welcome Back, Ms. Johnson!</Typography>
        <Typography variant="body1" color="secondary">
          You have 5 assignments to grade and 2 parent meetings scheduled.
        </Typography>
        
        <Card variant="elevated" padding="medium">
          <Typography variant="h4" style={{ marginBottom: 8 }}>
            Today's Classes
          </Typography>
          <Typography variant="body2" color="secondary">
            Grade 10A Mathematics - 9:00 AM
          </Typography>
          <Typography variant="body2" color="secondary">
            Grade 10B Mathematics - 11:00 AM
          </Typography>
          <Typography variant="body2" color="secondary">
            Grade 9A Mathematics - 2:00 PM
          </Typography>
        </Card>
        
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <QuickAction
              title="Grade Work"
              icon="analytics"
              iconColor="#005e7a"
              onPress={() => alert('Grade assignments')}
              badge={5}
            />
          </View>
          <View style={{ flex: 1 }}>
            <QuickAction
              title="Messages"
              icon="mail"
              iconColor="#f0c75e"
              onPress={() => alert('View messages')}
              badge={3}
            />
          </View>
        </View>
        
        <Card variant="default" padding="medium">
          <Typography variant="h4" style={{ marginBottom: 8 }}>
            Recent Activity
          </Typography>
          <Typography variant="body2" color="secondary">
            Ahmed submitted Math Assignment 5
          </Typography>
          <Typography variant="body2" color="secondary">
            Fatima completed Science Quiz
          </Typography>
        </Card>
      </View>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete teacher dashboard example with role-specific content.',
      },
    },
  },
};

// Parent dashboard example
export const ParentDashboard: Story = {
  args: {
    header: {
      title: 'Parent Portal',
      subtitle: 'Ahmed Al-Rashid',
      rightActions: [
        {
          icon: 'notifications',
          onPress: () => alert('Notifications'),
          badge: 2,
          accessibilityLabel: '2 new notifications',
        },
        {
          icon: 'call',
          onPress: () => alert('Emergency contact'),
          accessibilityLabel: 'Emergency contact',
        },
      ],
    },
    tabs: [
      { id: 'dashboard', label: 'Dashboard', icon: 'home' },
      { id: 'progress', label: 'Progress', icon: 'trending-up' },
      { id: 'attendance', label: 'Attendance', icon: 'calendar' },
      { id: 'messages', label: 'Messages', icon: 'mail', badge: 1 },
    ],
    activeTab: 'dashboard',
    onTabChange: (tabId) => alert(`Navigate to ${tabId}`),
    children: (
      <View style={{ gap: 16 }}>
        <Typography variant="h3">Ahmed's Progress</Typography>
        <Typography variant="body1" color="secondary">
          Your child is performing well across all subjects.
        </Typography>
        
        <Card variant="elevated" padding="medium">
          <Typography variant="h4" style={{ marginBottom: 8 }}>
            Recent Test Results
          </Typography>
          <Typography variant="body2" color="secondary">
            Mathematics: 92% (Excellent)
          </Typography>
          <Typography variant="body2" color="secondary">
            Science: 88% (Very Good)
          </Typography>
          <Typography variant="body2" color="secondary">
            English: 85% (Good)
          </Typography>
        </Card>
        
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <QuickAction
              title="Attendance"
              icon="calendar"
              iconColor="#4caf50"
              onPress={() => alert('View attendance')}
            />
          </View>
          <View style={{ flex: 1 }}>
            <QuickAction
              title="Contact Teacher"
              icon="mail"
              iconColor="#005e7a"
              onPress={() => alert('Contact teacher')}
            />
          </View>
        </View>
        
        <Card variant="default" padding="medium">
          <Typography variant="h4" style={{ marginBottom: 8 }}>
            Upcoming Events
          </Typography>
          <Typography variant="body2" color="secondary">
            Parent-Teacher Meeting - Friday 3:00 PM
          </Typography>
          <Typography variant="body2" color="secondary">
            Science Fair - Next Monday
          </Typography>
        </Card>
      </View>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete parent dashboard example with role-specific content.',
      },
    },
  },
};

// Management dashboard example
export const ManagementDashboard: Story = {
  args: {
    header: {
      title: 'Management Portal',
      subtitle: 'School Administration',
      rightActions: [
        {
          icon: 'notifications',
          onPress: () => alert('Notifications'),
          badge: 12,
          accessibilityLabel: '12 new notifications',
        },
        {
          icon: 'analytics',
          onPress: () => alert('Analytics'),
          accessibilityLabel: 'View analytics',
        },
      ],
    },
    tabs: [
      { id: 'dashboard', label: 'Dashboard', icon: 'home' },
      { id: 'students', label: 'Students', icon: 'people' },
      { id: 'teachers', label: 'Teachers', icon: 'school' },
      { id: 'reports', label: 'Reports', icon: 'analytics', badge: 3 },
    ],
    activeTab: 'dashboard',
    onTabChange: (tabId) => alert(`Navigate to ${tabId}`),
    children: (
      <View style={{ gap: 16 }}>
        <Typography variant="h3">School Overview</Typography>
        <Typography variant="body1" color="secondary">
          Monitor school performance and manage administrative tasks.
        </Typography>
        
        <Card variant="elevated" padding="medium">
          <Typography variant="h4" style={{ marginBottom: 8 }}>
            Key Metrics
          </Typography>
          <Typography variant="body2" color="secondary">
            Total Students: 1,247
          </Typography>
          <Typography variant="body2" color="secondary">
            Active Teachers: 68
          </Typography>
          <Typography variant="body2" color="secondary">
            Attendance Rate: 94.2%
          </Typography>
        </Card>
        
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <QuickAction
              title="Incidents"
              icon="warning"
              iconColor="#ff9800"
              onPress={() => alert('View incidents')}
              badge={2}
            />
          </View>
          <View style={{ flex: 1 }}>
            <QuickAction
              title="Reports"
              icon="analytics"
              iconColor="#005e7a"
              onPress={() => alert('View reports')}
              badge={3}
            />
          </View>
        </View>
        
        <Card variant="default" padding="medium">
          <Typography variant="h4" style={{ marginBottom: 8 }}>
            Recent Activities
          </Typography>
          <Typography variant="body2" color="secondary">
            New teacher registration: Ms. Ahmed
          </Typography>
          <Typography variant="body2" color="secondary">
            Budget approval: Science Department
          </Typography>
        </Card>
      </View>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete management dashboard example with role-specific content.',
      },
    },
  },
};

// Non-scrollable content
export const NonScrollable: Story = {
  args: {
    header: {
      title: 'Fixed Layout',
      rightActions: [
        {
          icon: 'settings',
          onPress: () => alert('Settings'),
        },
      ],
    },
    scrollable: false,
    children: (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h3" align="center">
          Fixed Content
        </Typography>
        <Typography variant="body1" color="secondary" align="center" style={{ marginTop: 8 }}>
          This content doesn't scroll
        </Typography>
      </View>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard template with non-scrollable content.',
      },
    },
  },
};

// Without content padding
export const NoContentPadding: Story = {
  args: {
    header: {
      title: 'Full Width Content',
      rightActions: [
        {
          icon: 'expand',
          onPress: () => alert('Full screen'),
        },
      ],
    },
    contentPadding: false,
    children: (
      <View style={{ gap: 0 }}>
        <Card variant="default" padding="large" style={{ borderRadius: 0 }}>
          <Typography variant="h4" style={{ marginBottom: 8 }}>
            Full Width Card
          </Typography>
          <Typography variant="body2" color="secondary">
            This card extends to the edges of the screen
          </Typography>
        </Card>
        <View style={{ height: 1, backgroundColor: '#e0e0e0' }} />
        <Card variant="default" padding="large" style={{ borderRadius: 0 }}>
          <Typography variant="h4" style={{ marginBottom: 8 }}>
            Another Full Width Card
          </Typography>
          <Typography variant="body2" color="secondary">
            Perfect for list-style layouts
          </Typography>
        </Card>
      </View>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard template without content padding for full-width layouts.',
      },
    },
  },
};
