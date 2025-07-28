/**
 * ListItem Component Stories
 * Storybook stories demonstrating all ListItem component variants and use cases
 */

import React from 'react';
import { View, Switch } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { ListItem } from './ListItem';
import { Typography } from '../../atoms/Typography';
import { Avatar } from '../../atoms/Avatar';
import { Button } from '../../atoms/Button';
import { Card } from '../Card';

const meta: Meta<typeof ListItem> = {
  title: 'Molecules/ListItem',
  component: ListItem,
  parameters: {
    docs: {
      description: {
        component: 'A consistent list item component with uniform layout, spacing, and interactions.',
      },
    },
  },
  argTypes: {
    title: {
      control: { type: 'text' },
      description: 'Main title text',
    },
    subtitle: {
      control: { type: 'text' },
      description: 'Optional subtitle text',
    },
    leftIcon: {
      control: { type: 'text' },
      description: 'Optional left icon name',
    },
    rightIcon: {
      control: { type: 'text' },
      description: 'Optional right icon name',
    },
    showDivider: {
      control: { type: 'boolean' },
      description: 'Whether to show bottom divider',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the item is disabled',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ListItem>;

// Basic list item
export const Default: Story = {
  args: {
    title: 'Default List Item',
    subtitle: 'This is a basic list item with title and subtitle',
  },
};

// Interactive list item
export const Interactive: Story = {
  args: {
    title: 'Interactive Item',
    subtitle: 'Tap to see interaction',
    onPress: () => alert('List item pressed!'),
  },
};

// List item with icons
export const WithIcons: Story = {
  render: () => (
    <View style={{ gap: 0 }}>
      <ListItem
        title="Left Icon Only"
        subtitle="Item with left icon"
        leftIcon="home"
        showDivider
      />
      <ListItem
        title="Right Icon Only"
        subtitle="Item with right icon"
        rightIcon="chevron-forward"
        showDivider
      />
      <ListItem
        title="Both Icons"
        subtitle="Item with both icons"
        leftIcon="person"
        rightIcon="chevron-forward"
        onPress={() => alert('Both icons pressed')}
      />
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'List items with different icon configurations.',
      },
    },
  },
};

// List item with custom components
export const WithCustomComponents: Story = {
  render: () => (
    <View style={{ gap: 0 }}>
      <ListItem
        title="John Doe"
        subtitle="Student - Grade 10A"
        leftComponent={
          <Avatar
            name="John Doe"
            size="sm"
          />
        }
        rightComponent={
          <Typography variant="caption" color="success">
            Present
          </Typography>
        }
        onPress={() => alert('Student pressed')}
        showDivider
      />
      <ListItem
        title="Settings"
        subtitle="App preferences"
        leftIcon="settings"
        rightComponent={
          <Button variant="outline" size="small">
            Edit
          </Button>
        }
        showDivider
      />
      <ListItem
        title="Notifications"
        subtitle="Push notification settings"
        leftIcon="notifications"
        rightComponent={
          <Switch value={true} onValueChange={() => {}} />
        }
      />
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'List items with custom left and right components.',
      },
    },
  },
};

// List with dividers
export const WithDividers: Story = {
  render: () => (
    <Card padding="none">
      <ListItem
        title="First Item"
        subtitle="First item description"
        leftIcon="document"
        showDivider
      />
      <ListItem
        title="Second Item"
        subtitle="Second item description"
        leftIcon="folder"
        showDivider
      />
      <ListItem
        title="Third Item"
        subtitle="Third item description"
        leftIcon="image"
        showDivider
      />
      <ListItem
        title="Last Item"
        subtitle="Last item without divider"
        leftIcon="star"
      />
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'List items with dividers in a card container.',
      },
    },
  },
};

// Disabled state
export const DisabledState: Story = {
  render: () => (
    <View style={{ gap: 0 }}>
      <ListItem
        title="Normal Item"
        subtitle="This item is enabled"
        leftIcon="checkmark-circle"
        rightIcon="chevron-forward"
        onPress={() => alert('Normal item pressed')}
        showDivider
      />
      <ListItem
        title="Disabled Item"
        subtitle="This item is disabled"
        leftIcon="lock-closed"
        rightIcon="chevron-forward"
        disabled
        onPress={() => alert('This should not fire')}
      />
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison between normal and disabled list items.',
      },
    },
  },
};

// Navigation menu example
export const NavigationMenu: Story = {
  render: () => (
    <Card padding="none">
      <ListItem
        title="Dashboard"
        subtitle="Overview and quick actions"
        leftIcon="home"
        rightIcon="chevron-forward"
        onPress={() => alert('Navigate to Dashboard')}
        showDivider
      />
      <ListItem
        title="Profile"
        subtitle="Personal information"
        leftIcon="person"
        rightIcon="chevron-forward"
        onPress={() => alert('Navigate to Profile')}
        showDivider
      />
      <ListItem
        title="Classes"
        subtitle="View your classes"
        leftIcon="school"
        rightIcon="chevron-forward"
        onPress={() => alert('Navigate to Classes')}
        showDivider
      />
      <ListItem
        title="Settings"
        subtitle="App preferences"
        leftIcon="settings"
        rightIcon="chevron-forward"
        onPress={() => alert('Navigate to Settings')}
      />
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of list items used for navigation menu.',
      },
    },
  },
};

// Student list example
export const StudentList: Story = {
  render: () => (
    <Card padding="none">
      <ListItem
        title="Ahmed Al-Rashid"
        subtitle="Grade 10A - Student ID: 12345"
        leftComponent={
          <Avatar
            name="Ahmed Al-Rashid"
            size="sm"
          />
        }
        rightComponent={
          <View style={{ alignItems: 'flex-end' }}>
            <Typography variant="caption" color="success">
              Present
            </Typography>
            <Typography variant="caption" color="secondary">
              95% Attendance
            </Typography>
          </View>
        }
        onPress={() => alert('View Ahmed\'s profile')}
        showDivider
      />
      <ListItem
        title="Fatima Hassan"
        subtitle="Grade 10A - Student ID: 12346"
        leftComponent={
          <Avatar
            name="Fatima Hassan"
            size="sm"
          />
        }
        rightComponent={
          <View style={{ alignItems: 'flex-end' }}>
            <Typography variant="caption" color="warning">
              Late
            </Typography>
            <Typography variant="caption" color="secondary">
              88% Attendance
            </Typography>
          </View>
        }
        onPress={() => alert('View Fatima\'s profile')}
        showDivider
      />
      <ListItem
        title="Omar Khalil"
        subtitle="Grade 10A - Student ID: 12347"
        leftComponent={
          <Avatar
            name="Omar Khalil"
            size="sm"
          />
        }
        rightComponent={
          <View style={{ alignItems: 'flex-end' }}>
            <Typography variant="caption" color="error">
              Absent
            </Typography>
            <Typography variant="caption" color="secondary">
              76% Attendance
            </Typography>
          </View>
        }
        onPress={() => alert('View Omar\'s profile')}
      />
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of list items used for displaying student information.',
      },
    },
  },
};

// Activity feed example
export const ActivityFeed: Story = {
  render: () => (
    <Card padding="none">
      <ListItem
        title="Assignment Submitted"
        subtitle="Math homework submitted by Ahmed Al-Rashid"
        leftIcon="document-text"
        rightComponent={
          <Typography variant="caption" color="secondary">
            2 min ago
          </Typography>
        }
        onPress={() => alert('View assignment')}
        showDivider
      />
      <ListItem
        title="New Announcement"
        subtitle="Parent-teacher meeting scheduled for next week"
        leftIcon="megaphone"
        rightComponent={
          <Typography variant="caption" color="secondary">
            1 hour ago
          </Typography>
        }
        onPress={() => alert('View announcement')}
        showDivider
      />
      <ListItem
        title="Grade Updated"
        subtitle="Science test grade posted for Grade 10A"
        leftIcon="school"
        rightComponent={
          <Typography variant="caption" color="secondary">
            3 hours ago
          </Typography>
        }
        onPress={() => alert('View grades')}
        showDivider
      />
      <ListItem
        title="Incident Report"
        subtitle="Minor incident reported in playground"
        leftIcon="warning"
        rightComponent={
          <Typography variant="caption" color="secondary">
            1 day ago
          </Typography>
        }
        onPress={() => alert('View incident')}
      />
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of list items used for activity feed.',
      },
    },
  },
};

// Settings list example
const SettingsListComponent = () => {
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
    
    return (
      <Card padding="none">
        <ListItem
          title="Notifications"
          subtitle="Push notifications and alerts"
          leftIcon="notifications"
          rightComponent={
            <Switch
              value={notifications}
              onValueChange={setNotifications}
            />
          }
          showDivider
        />
        <ListItem
          title="Dark Mode"
          subtitle="Use dark theme"
          leftIcon="moon"
          rightComponent={
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
            />
          }
          showDivider
        />
        <ListItem
          title="Privacy"
          subtitle="Privacy and security settings"
          leftIcon="shield"
          rightIcon="chevron-forward"
          onPress={() => alert('Navigate to Privacy')}
          showDivider
        />
        <ListItem
          title="About"
          subtitle="App version and information"
          leftIcon="information-circle"
          rightIcon="chevron-forward"
          onPress={() => alert('Navigate to About')}
        />
      </Card>
    );
};

export const SettingsList: Story = {
  render: () => <SettingsListComponent />,
  parameters: {
    docs: {
      description: {
        story: 'Example of list items used for settings screen.',
      },
    },
  },
};