/**
 * NavigationPanel Component Stories
 * Storybook stories demonstrating all NavigationPanel component variants and use cases
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { NavigationPanel } from './NavigationPanel';
import { Typography } from '../../atoms/Typography';
import { Button } from '../../atoms/Button';

const meta: Meta<typeof NavigationPanel> = {
  title: 'Organisms/NavigationPanel',
  component: NavigationPanel,
  parameters: {
    docs: {
      description: {
        component: 'A consistent navigation panel component with styling and interactions for different notification types and navigation items.',
      },
    },
  },
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['notifications', 'navigation', 'mixed'],
      description: 'Panel type',
    },
    title: {
      control: { type: 'text' },
      description: 'Panel title',
    },
    subtitle: {
      control: { type: 'text' },
      description: 'Optional subtitle',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'elevated', 'transparent'],
      description: 'Visual variant',
    },
    showHeader: {
      control: { type: 'boolean' },
      description: 'Whether to show header',
    },
    showActions: {
      control: { type: 'boolean' },
      description: 'Whether to show action buttons',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Loading state',
    },
  },
};

export default meta;
type Story = StoryObj<typeof NavigationPanel>;

// Mock notifications
const mockNotifications = [
  {
    id: '1',
    title: 'New Assignment Posted',
    message: 'Math Chapter 5 exercises are now available',
    type: 'info' as const,
    timestamp: '2 hours ago',
    read: false,
    onPress: () => alert('View assignment'),
    onDismiss: () => alert('Dismissed'),
  },
  {
    id: '2',
    title: 'Grade Updated',
    message: 'Your Science test has been graded',
    type: 'success' as const,
    timestamp: '1 day ago',
    read: true,
    onPress: () => alert('View grade'),
    onDismiss: () => alert('Dismissed'),
  },
  {
    id: '3',
    title: 'Assignment Due Soon',
    message: 'Math homework is due tomorrow',
    type: 'warning' as const,
    timestamp: '3 hours ago',
    read: false,
    onPress: () => alert('View assignment'),
    onAction: () => alert('Submit now'),
    actionLabel: 'Submit',
    onDismiss: () => alert('Dismissed'),
  },
];

// Mock navigation items
const mockNavigationItems = [
  {
    id: '1',
    title: 'Dashboard',
    subtitle: 'Overview and quick actions',
    icon: 'home' as const,
    onPress: () => alert('Navigate to Dashboard'),
  },
  {
    id: '2',
    title: 'Messages',
    subtitle: 'View your messages',
    icon: 'mail' as const,
    badge: 3,
    onPress: () => alert('Navigate to Messages'),
  },
  {
    id: '3',
    title: 'Settings',
    subtitle: 'App preferences',
    icon: 'settings' as const,
    onPress: () => alert('Navigate to Settings'),
  },
  {
    id: '4',
    title: 'Help & Support',
    subtitle: 'Get help and support',
    icon: 'help-circle' as const,
    onPress: () => alert('Navigate to Help'),
  },
];

// Basic notifications panel
export const NotificationsPanel: Story = {
  render: () => (
    <NavigationPanel
      type="notifications"
      title="Notifications"
      notifications={mockNotifications}
      onMarkAllRead={() => alert('Mark all as read')}
      onClearAll={() => alert('Clear all')}
      onRefresh={() => alert('Refresh')}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Basic notifications panel with various notification types.',
      },
    },
  },
};

// Navigation panel
export const NavigationOnly: Story = {
  render: () => (
    <NavigationPanel
      type="navigation"
      title="Quick Navigation"
      navigationItems={mockNavigationItems}
      onRefresh={() => alert('Refresh')}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Navigation panel with menu items and badges.',
      },
    },
  },
};

// Mixed panel
export const MixedPanel: Story = {
  render: () => (
    <NavigationPanel
      type="mixed"
      title="Dashboard Panel"
      navigationItems={mockNavigationItems.slice(0, 2)}
      notifications={mockNotifications.slice(0, 2)}
      onMarkAllRead={() => alert('Mark all as read')}
      onClearAll={() => alert('Clear all')}
      onRefresh={() => alert('Refresh')}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Mixed panel with both navigation items and notifications.',
      },
    },
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
        <NavigationPanel
          type="notifications"
          title="Default Panel"
          notifications={mockNotifications.slice(0, 2)}
          variant="default"
        />
      </View>
      
      <View>
        <Typography variant="body2" style={{ marginBottom: 8, paddingHorizontal: 16 }}>
          Elevated Variant
        </Typography>
        <NavigationPanel
          type="notifications"
          title="Elevated Panel"
          notifications={mockNotifications.slice(0, 2)}
          variant="elevated"
        />
      </View>
      
      <View>
        <Typography variant="body2" style={{ marginBottom: 8, paddingHorizontal: 16 }}>
          Transparent Variant
        </Typography>
        <NavigationPanel
          type="notifications"
          title="Transparent Panel"
          notifications={mockNotifications.slice(0, 2)}
          variant="transparent"
        />
      </View>
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different panel variants for various contexts.',
      },
    },
  },
};

// Empty states
export const EmptyStates: Story = {
  render: () => (
    <View style={{ gap: 20 }}>
      <View>
        <Typography variant="body2" style={{ marginBottom: 8, paddingHorizontal: 16 }}>
          Empty Notifications
        </Typography>
        <NavigationPanel
          type="notifications"
          title="Notifications"
          notifications={[]}
          emptyTitle="No notifications"
          emptyMessage="You're all caught up!"
          emptyIcon="checkmark-circle"
          onRefresh={() => alert('Refresh')}
        />
      </View>
      
      <View>
        <Typography variant="body2" style={{ marginBottom: 8, paddingHorizontal: 16 }}>
          Empty Navigation
        </Typography>
        <NavigationPanel
          type="navigation"
          title="Navigation"
          navigationItems={[]}
          emptyTitle="No menu items"
          emptyMessage="No navigation items available"
          emptyIcon="menu"
        />
      </View>
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Empty states for different panel types.',
      },
    },
  },
};

// Loading state
export const LoadingState: Story = {
  render: () => (
    <NavigationPanel
      type="notifications"
      title="Loading Notifications"
      notifications={[]}
      loading={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Loading state with animated indicator.',
      },
    },
  },
};

// Student notifications panel
export const StudentNotifications: Story = {
  render: () => {
    const studentNotifications = [
      {
        id: '1',
        title: 'New Assignment Posted',
        message: 'Math Chapter 5 exercises are now available in your assignments',
        type: 'info' as const,
        timestamp: '30 minutes ago',
        read: false,
        onPress: () => alert('View assignment'),
        onAction: () => alert('Start assignment'),
        actionLabel: 'Start Now',
        onDismiss: () => alert('Dismissed'),
      },
      {
        id: '2',
        title: 'Quiz Results Available',
        message: 'Your Science quiz results have been published. Great job!',
        type: 'success' as const,
        timestamp: '2 hours ago',
        read: false,
        onPress: () => alert('View results'),
        onDismiss: () => alert('Dismissed'),
      },
      {
        id: '3',
        title: 'Library Book Due',
        message: 'Introduction to Physics is due for return tomorrow',
        type: 'warning' as const,
        timestamp: '1 day ago',
        read: true,
        onPress: () => alert('View library'),
        onAction: () => alert('Renew book'),
        actionLabel: 'Renew',
        onDismiss: () => alert('Dismissed'),
      },
    ];
    
    return (
      <NavigationPanel
        type="notifications"
        title="Student Notifications"
        subtitle="Stay updated with your academic progress"
        notifications={studentNotifications}
        onMarkAllRead={() => alert('Mark all as read')}
        onClearAll={() => alert('Clear all')}
        onRefresh={() => alert('Refresh')}
        variant="elevated"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Student-specific notifications panel.',
      },
    },
  },
};

// Teacher notifications panel
export const TeacherNotifications: Story = {
  render: () => {
    const teacherNotifications = [
      {
        id: '1',
        title: 'New Student Enrollment',
        message: 'Sarah Ahmed has been enrolled in your Grade 10A class',
        type: 'info' as const,
        timestamp: '1 hour ago',
        read: false,
        onPress: () => alert('View student profile'),
        onAction: () => alert('Send welcome message'),
        actionLabel: 'Welcome',
        onDismiss: () => alert('Dismissed'),
      },
      {
        id: '2',
        title: 'Assignment Deadline Approaching',
        message: 'Math homework deadline is tomorrow. 5 students haven\'t submitted yet',
        type: 'warning' as const,
        timestamp: '3 hours ago',
        read: false,
        onPress: () => alert('View submissions'),
        onAction: () => alert('Send reminder'),
        actionLabel: 'Remind Students',
        onDismiss: () => alert('Dismissed'),
      },
      {
        id: '3',
        title: 'Parent Meeting Confirmed',
        message: 'Ahmed\'s parent has confirmed attendance for tomorrow\'s meeting',
        type: 'success' as const,
        timestamp: '1 day ago',
        read: true,
        onPress: () => alert('View meeting details'),
        onDismiss: () => alert('Dismissed'),
      },
    ];
    
    return (
      <NavigationPanel
        type="notifications"
        title="Teacher Notifications"
        subtitle="Classroom updates and reminders"
        notifications={teacherNotifications}
        onMarkAllRead={() => alert('Mark all as read')}
        onClearAll={() => alert('Clear all')}
        onRefresh={() => alert('Refresh')}
        variant="elevated"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Teacher-specific notifications panel.',
      },
    },
  },
};

// Parent notifications panel
export const ParentNotifications: Story = {
  render: () => {
    const parentNotifications = [
      {
        id: '1',
        title: 'Excellent Performance',
        message: 'Ahmed scored 95% in the Mathematics test. Congratulations!',
        type: 'success' as const,
        timestamp: '2 hours ago',
        read: false,
        onPress: () => alert('View detailed results'),
        onDismiss: () => alert('Dismissed'),
      },
      {
        id: '2',
        title: 'Attendance Notice',
        message: 'Ahmed was absent from school today. Please confirm if this was planned',
        type: 'warning' as const,
        timestamp: '4 hours ago',
        read: false,
        onPress: () => alert('View attendance'),
        onAction: () => alert('Confirm absence'),
        actionLabel: 'Confirm',
        onDismiss: () => alert('Dismissed'),
      },
      {
        id: '3',
        title: 'Parent-Teacher Meeting',
        message: 'Scheduled meeting with Ahmed\'s class teacher for next Friday at 3 PM',
        type: 'info' as const,
        timestamp: '1 day ago',
        read: true,
        onPress: () => alert('View meeting details'),
        onAction: () => alert('Confirm attendance'),
        actionLabel: 'Confirm',
        onDismiss: () => alert('Dismissed'),
      },
    ];
    
    return (
      <NavigationPanel
        type="notifications"
        title="Parent Notifications"
        subtitle="Updates about Ahmed's progress"
        notifications={parentNotifications}
        onMarkAllRead={() => alert('Mark all as read')}
        onClearAll={() => alert('Clear all')}
        onRefresh={() => alert('Refresh')}
        variant="elevated"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Parent-specific notifications panel.',
      },
    },
  },
};

// Management navigation panel
export const ManagementNavigation: Story = {
  render: () => {
    const managementItems = [
      {
        id: '1',
        title: 'School Analytics',
        subtitle: 'View performance metrics',
        icon: 'analytics' as const,
        onPress: () => alert('Navigate to Analytics'),
      },
      {
        id: '2',
        title: 'Incident Reports',
        subtitle: 'Review pending incidents',
        icon: 'warning' as const,
        badge: 3,
        badgeColor: '#ff9800',
        onPress: () => alert('Navigate to Incidents'),
      },
      {
        id: '3',
        title: 'Staff Management',
        subtitle: 'Manage teachers and staff',
        icon: 'people' as const,
        onPress: () => alert('Navigate to Staff'),
      },
      {
        id: '4',
        title: 'System Settings',
        subtitle: 'Configure school settings',
        icon: 'settings' as const,
        onPress: () => alert('Navigate to Settings'),
      },
      {
        id: '5',
        title: 'Reports & Export',
        subtitle: 'Generate and export reports',
        icon: 'document-text' as const,
        onPress: () => alert('Navigate to Reports'),
      },
    ];
    
    return (
      <NavigationPanel
        type="navigation"
        title="Management Tools"
        subtitle="Administrative functions"
        navigationItems={managementItems}
        onRefresh={() => alert('Refresh')}
        variant="elevated"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Management navigation panel with administrative tools.',
      },
    },
  },
};

// Quick actions panel
export const QuickActionsPanel: Story = {
  render: () => {
    const quickActions = [
      {
        id: '1',
        title: 'Create Assignment',
        subtitle: 'Add a new assignment',
        icon: 'add-circle' as const,
        onPress: () => alert('Create assignment'),
      },
      {
        id: '2',
        title: 'Mark Attendance',
        subtitle: 'Take class attendance',
        icon: 'checkmark-circle' as const,
        onPress: () => alert('Mark attendance'),
      },
      {
        id: '3',
        title: 'Send Announcement',
        subtitle: 'Notify students and parents',
        icon: 'megaphone' as const,
        onPress: () => alert('Send announcement'),
      },
      {
        id: '4',
        title: 'Grade Assignments',
        subtitle: 'Review submitted work',
        icon: 'school' as const,
        badge: 8,
        onPress: () => alert('Grade assignments'),
      },
    ];
    
    return (
      <NavigationPanel
        type="navigation"
        title="Quick Actions"
        subtitle="Common tasks and shortcuts"
        navigationItems={quickActions}
        showActions={false}
        variant="elevated"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Quick actions panel for common tasks.',
      },
    },
  },
};

// Compact panel
export const CompactPanel: Story = {
  render: () => (
    <NavigationPanel
      type="notifications"
      title="Recent Updates"
      notifications={mockNotifications.slice(0, 3).map(n => ({ ...n, compact: true }))}
      showHeader={false}
      maxHeight={200}
      variant="transparent"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compact panel without header for embedded use.',
      },
    },
  },
};

// Interactive example
export const InteractiveExample: Story = {
  render: () => {
    const [notifications, setNotifications] = React.useState(mockNotifications);
    const [refreshing, setRefreshing] = React.useState(false);
    
    const handleMarkAllRead = () => {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };
    
    const handleClearAll = () => {
      setNotifications([]);
    };
    
    const handleRefresh = () => {
      setRefreshing(true);
      setTimeout(() => {
        setNotifications(mockNotifications);
        setRefreshing(false);
      }, 1000);
    };
    
    const handleDismiss = (id: string) => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    };
    
    return (
      <View>
        <Typography variant="h3" style={{ marginBottom: 16, paddingHorizontal: 16 }}>
          Interactive Notifications Panel
        </Typography>
        
        <NavigationPanel
          type="notifications"
          title="Notifications"
          notifications={notifications.map(n => ({
            ...n,
            onDismiss: () => handleDismiss(n.id),
          }))}
          onMarkAllRead={handleMarkAllRead}
          onClearAll={handleClearAll}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          variant="elevated"
        />
        
        <View style={{ marginTop: 16, paddingHorizontal: 16 }}>
          <Button
            variant="outline"
            onPress={() => setNotifications(mockNotifications)}
            style={{ marginBottom: 8 }}
          >
            Reset Notifications
          </Button>
        </View>
      </View>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example with working actions and state management.',
      },
    },
  },
};