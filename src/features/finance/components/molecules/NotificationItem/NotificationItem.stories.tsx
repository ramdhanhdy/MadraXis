/**
 * NotificationItem Component Stories
 * Storybook stories demonstrating all NotificationItem component variants and use cases
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { NotificationItem } from './NotificationItem';
import { Typography } from '../../atoms/Typography';
import { Card } from '../Card';

const meta: Meta<typeof NotificationItem> = {
  title: 'Molecules/NotificationItem',
  component: NotificationItem,
  parameters: {
    docs: {
      description: {
        component: 'A consistent notification display component with status indicators and actions.',
      },
    },
  },
  argTypes: {
    title: {
      control: { type: 'text' },
      description: 'Notification title',
    },
    message: {
      control: { type: 'text' },
      description: 'Notification message',
    },
    type: {
      control: { type: 'select' },
      options: ['info', 'success', 'warning', 'error'],
      description: 'Notification type with color coding',
    },
    timestamp: {
      control: { type: 'text' },
      description: 'Optional timestamp text',
    },
    read: {
      control: { type: 'boolean' },
      description: 'Whether notification has been read',
    },
    compact: {
      control: { type: 'boolean' },
      description: 'Whether to use compact layout',
    },
    showDismiss: {
      control: { type: 'boolean' },
      description: 'Whether to show dismiss button',
    },
  },
};

export default meta;
type Story = StoryObj<typeof NotificationItem>;

// Basic notification
export const Default: Story = {
  args: {
    title: 'New Assignment',
    message: 'Math homework has been assigned for tomorrow',
    timestamp: '2 hours ago',
  },
};

// Different notification types
export const NotificationTypes: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <NotificationItem
        type="info"
        title="Class Schedule Update"
        message="Your Monday schedule has been updated"
        timestamp="1 hour ago"
      />
      
      <NotificationItem
        type="success"
        title="Assignment Submitted"
        message="Your science project has been successfully submitted"
        timestamp="30 minutes ago"
      />
      
      <NotificationItem
        type="warning"
        title="Low Attendance"
        message="Your attendance is below the required threshold"
        timestamp="1 day ago"
      />
      
      <NotificationItem
        type="error"
        title="Payment Failed"
        message="Unable to process your fee payment. Please try again"
        timestamp="2 days ago"
      />
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different notification types with appropriate color coding.',
      },
    },
  },
};

// Read vs Unread states
export const ReadStates: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <NotificationItem
        title="Unread Notification"
        message="This notification has not been read yet"
        timestamp="1 hour ago"
        read={false}
      />
      
      <NotificationItem
        title="Read Notification"
        message="This notification has already been read"
        timestamp="2 hours ago"
        read={true}
      />
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison between read and unread notification states.',
      },
    },
  },
};

// Interactive notifications
export const InteractiveNotifications: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <NotificationItem
        title="Parent-Teacher Meeting"
        message="Scheduled for next Friday at 3:00 PM"
        timestamp="1 hour ago"
        onPress={() => alert('Notification pressed')}
        onDismiss={() => alert('Notification dismissed')}
      />
      
      <NotificationItem
        type="warning"
        title="Fee Payment Due"
        message="Your semester fee payment is due in 3 days"
        timestamp="2 days ago"
        onPress={() => alert('View payment details')}
        onAction={() => alert('Make payment')}
        actionLabel="Pay Now"
        onDismiss={() => alert('Dismissed')}
      />
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Interactive notifications with press, action, and dismiss handlers.',
      },
    },
  },
};

// Compact mode
export const CompactMode: Story = {
  render: () => (
    <Card>
      <Typography variant="h4" style={{ marginBottom: 12 }}>
        Recent Updates
      </Typography>
      
      <View style={{ gap: 8 }}>
        <NotificationItem
          title="New Assignment"
          message="Math homework assigned"
          timestamp="1h"
          compact
          showDismiss={false}
        />
        
        <NotificationItem
          title="Grade Updated"
          message="Science test graded"
          timestamp="2h"
          type="success"
          compact
          showDismiss={false}
        />
        
        <NotificationItem
          title="Meeting Reminder"
          message="Parent meeting tomorrow"
          timestamp="1d"
          type="warning"
          compact
          showDismiss={false}
        />
        
        <NotificationItem
          title="System Maintenance"
          message="Scheduled for tonight"
          timestamp="3h"
          type="info"
          compact
          showDismiss={false}
        />
      </View>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compact notifications for dense information display.',
      },
    },
  },
};

// Custom icons
export const CustomIcons: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <NotificationItem
        title="Star Achievement"
        message="You've earned a gold star for excellent performance"
        icon="star"
        type="success"
        timestamp="1 hour ago"
      />
      
      <NotificationItem
        title="Book Recommendation"
        message="New book added to your reading list"
        icon="book"
        type="info"
        timestamp="2 hours ago"
      />
      
      <NotificationItem
        title="Calendar Event"
        message="Sports day scheduled for next week"
        icon="calendar"
        type="warning"
        timestamp="1 day ago"
      />
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Notifications with custom icons instead of default type icons.',
      },
    },
  },
};

// Notification feed example
export const NotificationFeed: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Typography variant="h3" style={{ marginBottom: 16 }}>
        Notifications
      </Typography>
      
      <NotificationItem
        type="info"
        title="Class Schedule Change"
        message="Your Physics class has been moved to Room 205"
        timestamp="2 hours ago"
        onPress={() => alert('View schedule')}
        onDismiss={() => alert('Dismissed')}
      />
      
      <NotificationItem
        type="success"
        title="Assignment Graded"
        message="Your English essay received an A grade"
        timestamp="1 day ago"
        read={true}
        onPress={() => alert('View grade')}
        onDismiss={() => alert('Dismissed')}
      />
      
      <NotificationItem
        type="warning"
        title="Fee Payment Due"
        message="Your semester fee payment is due in 3 days"
        timestamp="2 days ago"
        onPress={() => alert('View payment')}
        onAction={() => alert('Make payment')}
        actionLabel="Pay Now"
        onDismiss={() => alert('Dismissed')}
      />
      
      <NotificationItem
        type="error"
        title="Incident Report Required"
        message="Please submit an incident report for today's playground incident"
        timestamp="3 days ago"
        onPress={() => alert('View incident')}
        onAction={() => alert('Create report')}
        actionLabel="Create Report"
        onDismiss={() => alert('Dismissed')}
      />
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of a complete notification feed with various types and states.',
      },
    },
  },
};

// Student notifications
export const StudentNotifications: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Typography variant="h3" style={{ marginBottom: 16 }}>
        Student Dashboard Notifications
      </Typography>
      
      <NotificationItem
        type="info"
        title="New Assignment Posted"
        message="Math Chapter 5 exercises are now available in your assignments"
        timestamp="30 minutes ago"
        onPress={() => alert('View assignment')}
        onAction={() => alert('Start assignment')}
        actionLabel="Start Now"
        onDismiss={() => alert('Dismissed')}
      />
      
      <NotificationItem
        type="success"
        title="Quiz Results Available"
        message="Your Science quiz results have been published. Great job!"
        timestamp="2 hours ago"
        onPress={() => alert('View results')}
        onDismiss={() => alert('Dismissed')}
      />
      
      <NotificationItem
        type="warning"
        title="Library Book Due"
        message="'Introduction to Physics' is due for return tomorrow"
        timestamp="1 day ago"
        onPress={() => alert('View library')}
        onAction={() => alert('Renew book')}
        actionLabel="Renew"
        onDismiss={() => alert('Dismissed')}
      />
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Student-specific notifications with relevant actions.',
      },
    },
  },
};

// Teacher notifications
export const TeacherNotifications: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Typography variant="h3" style={{ marginBottom: 16 }}>
        Teacher Dashboard Notifications
      </Typography>
      
      <NotificationItem
        type="info"
        title="New Student Enrollment"
        message="Sarah Ahmed has been enrolled in your Grade 10A class"
        timestamp="1 hour ago"
        onPress={() => alert('View student profile')}
        onAction={() => alert('Send welcome message')}
        actionLabel="Welcome"
        onDismiss={() => alert('Dismissed')}
      />
      
      <NotificationItem
        type="warning"
        title="Assignment Deadline Approaching"
        message="Math homework deadline is tomorrow. 5 students haven't submitted yet"
        timestamp="3 hours ago"
        onPress={() => alert('View submissions')}
        onAction={() => alert('Send reminder')}
        actionLabel="Remind Students"
        onDismiss={() => alert('Dismissed')}
      />
      
      <NotificationItem
        type="success"
        title="Parent Meeting Confirmed"
        message="Ahmed's parent has confirmed attendance for tomorrow's meeting"
        timestamp="1 day ago"
        read={true}
        onPress={() => alert('View meeting details')}
        onDismiss={() => alert('Dismissed')}
      />
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Teacher-specific notifications with classroom management actions.',
      },
    },
  },
};

// Parent notifications
export const ParentNotifications: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Typography variant="h3" style={{ marginBottom: 16 }}>
        Parent Dashboard Notifications
      </Typography>
      
      <NotificationItem
        type="success"
        title="Excellent Performance"
        message="Ahmed scored 95% in the Mathematics test. Congratulations!"
        timestamp="2 hours ago"
        onPress={() => alert('View detailed results')}
        onDismiss={() => alert('Dismissed')}
      />
      
      <NotificationItem
        type="warning"
        title="Attendance Notice"
        message="Ahmed was absent from school today. Please confirm if this was planned"
        timestamp="4 hours ago"
        onPress={() => alert('View attendance')}
        onAction={() => alert('Confirm absence')}
        actionLabel="Confirm"
        onDismiss={() => alert('Dismissed')}
      />
      
      <NotificationItem
        type="info"
        title="Parent-Teacher Meeting"
        message="Scheduled meeting with Ahmed's class teacher for next Friday at 3 PM"
        timestamp="1 day ago"
        onPress={() => alert('View meeting details')}
        onAction={() => alert('Confirm attendance')}
        actionLabel="Confirm"
        onDismiss={() => alert('Dismissed')}
      />
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Parent-specific notifications with child monitoring actions.',
      },
    },
  },
};