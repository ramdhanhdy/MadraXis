/**
 * TabBar Component Stories
 * Storybook stories demonstrating all TabBar component variants and use cases
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { TabBar } from './TabBar';
import { Typography } from '../../atoms/Typography';

const meta: Meta<typeof TabBar> = {
  title: 'Organisms/TabBar',
  component: TabBar,
  parameters: {
    docs: {
      description: {
        component: 'A consistent bottom navigation component with tab styling, active states, and transitions.',
      },
    },
  },
  argTypes: {
    activeTab: {
      control: { type: 'text' },
      description: 'Currently active tab ID',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'elevated', 'transparent'],
      description: 'Visual variant',
    },
    showLabels: {
      control: { type: 'boolean' },
      description: 'Whether to show tab labels',
    },
    animated: {
      control: { type: 'boolean' },
      description: 'Whether to animate tab transitions',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TabBar>;

// Basic tab bar
export const Default: Story = {
  render: function DefaultRender() {
    const [activeTab, setActiveTab] = React.useState('home');
    
    const tabs = [
      { id: 'home', label: 'Home', icon: 'home' as const },
      { id: 'search', label: 'Search', icon: 'search' as const },
      { id: 'notifications', label: 'Notifications', icon: 'notifications' as const },
      { id: 'profile', label: 'Profile', icon: 'person' as const },
    ];
    
    return (
      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />
    );
  },
};

// Tab bar with badges
export const WithBadges: Story = {
  render: function WithBadgesRender() {
    const [activeTab, setActiveTab] = React.useState('home');
    
    const tabs = [
      { id: 'home', label: 'Home', icon: 'home' as const },
      { id: 'messages', label: 'Messages', icon: 'mail' as const, badge: 3 },
      { id: 'notifications', label: 'Notifications', icon: 'notifications' as const, badge: 12 },
      { id: 'profile', label: 'Profile', icon: 'person' as const },
    ];
    
    return (
      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Tab bar with notification badges on some tabs.',
      },
    },
  },
};

// Different variants
export const Variants: Story = {
  render: function VariantsRender() {
    const [activeTab1, setActiveTab1] = React.useState('home');
    const [activeTab2, setActiveTab2] = React.useState('home');
    const [activeTab3, setActiveTab3] = React.useState('home');
    
    const tabs = [
      { id: 'home', label: 'Home', icon: 'home' as const },
      { id: 'search', label: 'Search', icon: 'search' as const },
      { id: 'notifications', label: 'Notifications', icon: 'notifications' as const, badge: 2 },
      { id: 'profile', label: 'Profile', icon: 'person' as const },
    ];
    
    return (
      <View style={{ gap: 20 }}>
        <View>
          <Typography variant="body2" style={{ marginBottom: 8, paddingHorizontal: 16 }}>
            Default Variant
          </Typography>
          <TabBar
            tabs={tabs}
            activeTab={activeTab1}
            onTabPress={setActiveTab1}
            variant="default"
          />
        </View>
        
        <View>
          <Typography variant="body2" style={{ marginBottom: 8, paddingHorizontal: 16 }}>
            Elevated Variant
          </Typography>
          <TabBar
            tabs={tabs}
            activeTab={activeTab2}
            onTabPress={setActiveTab2}
            variant="elevated"
          />
        </View>
        
        <View>
          <Typography variant="body2" style={{ marginBottom: 8, paddingHorizontal: 16 }}>
            Transparent Variant
          </Typography>
          <TabBar
            tabs={tabs}
            activeTab={activeTab3}
            onTabPress={setActiveTab3}
            variant="transparent"
          />
        </View>
      </View>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Different tab bar variants for various contexts.',
      },
    },
  },
};

// Without labels
export const WithoutLabels: Story = {
  render: function WithoutLabelsRender() {
    const [activeTab, setActiveTab] = React.useState('home');
    
    const tabs = [
      { id: 'home', label: 'Home', icon: 'home' as const },
      { id: 'search', label: 'Search', icon: 'search' as const },
      { id: 'notifications', label: 'Notifications', icon: 'notifications' as const, badge: 5 },
      { id: 'profile', label: 'Profile', icon: 'person' as const },
    ];
    
    return (
      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabPress={setActiveTab}
        showLabels={false}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Tab bar without labels, showing only icons.',
      },
    },
  },
};

// Student dashboard tabs
export const StudentDashboard: Story = {
  render: function StudentDashboardRender() {
    const [activeTab, setActiveTab] = React.useState('dashboard');
    
    const tabs = [
      { 
        id: 'dashboard', 
        label: 'Dashboard', 
        icon: 'home' as const,
        accessibilityLabel: 'Dashboard',
        accessibilityHint: 'View your dashboard and overview'
      },
      { 
        id: 'assignments', 
        label: 'Assignments', 
        icon: 'document-text' as const, 
        badge: 3,
        accessibilityLabel: 'Assignments',
        accessibilityHint: '3 pending assignments'
      },
      { 
        id: 'grades', 
        label: 'Grades', 
        icon: 'school' as const,
        accessibilityLabel: 'Grades',
        accessibilityHint: 'View your grades and progress'
      },
      { 
        id: 'schedule', 
        label: 'Schedule', 
        icon: 'calendar' as const,
        accessibilityLabel: 'Schedule',
        accessibilityHint: 'View your class schedule'
      },
      { 
        id: 'profile', 
        label: 'Profile', 
        icon: 'person' as const,
        accessibilityLabel: 'Profile',
        accessibilityHint: 'View and edit your profile'
      },
    ];
    
    return (
      <View>
        <Typography variant="h3" style={{ marginBottom: 16, paddingHorizontal: 16 }}>
          Student Dashboard Navigation
        </Typography>
        <TabBar
          tabs={tabs}
          activeTab={activeTab}
          onTabPress={setActiveTab}
          variant="elevated"
        />
      </View>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Tab bar example for student dashboard navigation.',
      },
    },
  },
};

// Teacher dashboard tabs
export const TeacherDashboard: Story = {
  render: function TeacherDashboardRender() {
    const [activeTab, setActiveTab] = React.useState('dashboard');
    
    const tabs = [
      { 
        id: 'dashboard', 
        label: 'Dashboard', 
        icon: 'home' as const,
        accessibilityLabel: 'Dashboard',
        accessibilityHint: 'View your teaching dashboard'
      },
      { 
        id: 'classes', 
        label: 'Classes', 
        icon: 'people' as const,
        accessibilityLabel: 'Classes',
        accessibilityHint: 'Manage your classes'
      },
      { 
        id: 'assignments', 
        label: 'Assignments', 
        icon: 'document-text' as const, 
        badge: 8,
        accessibilityLabel: 'Assignments',
        accessibilityHint: '8 assignments to review'
      },
      { 
        id: 'reports', 
        label: 'Reports', 
        icon: 'bar-chart' as const,
        accessibilityLabel: 'Reports',
        accessibilityHint: 'View student reports and analytics'
      },
      { 
        id: 'profile', 
        label: 'Profile', 
        icon: 'person' as const,
        accessibilityLabel: 'Profile',
        accessibilityHint: 'View and edit your profile'
      },
    ];
    
    return (
      <View>
        <Typography variant="h3" style={{ marginBottom: 16, paddingHorizontal: 16 }}>
          Teacher Dashboard Navigation
        </Typography>
        <TabBar
          tabs={tabs}
          activeTab={activeTab}
          onTabPress={setActiveTab}
          variant="elevated"
        />
      </View>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Tab bar example for teacher dashboard navigation.',
      },
    },
  },
};

// Parent dashboard tabs
export const ParentDashboard: Story = {
  render: function ParentDashboardRender() {
    const [activeTab, setActiveTab] = React.useState('dashboard');
    
    const tabs = [
      { 
        id: 'dashboard', 
        label: 'Dashboard', 
        icon: 'home' as const,
        accessibilityLabel: 'Dashboard',
        accessibilityHint: 'View your child\'s overview'
      },
      { 
        id: 'progress', 
        label: 'Progress', 
        icon: 'trending-up' as const,
        accessibilityLabel: 'Progress',
        accessibilityHint: 'View your child\'s academic progress'
      },
      { 
        id: 'attendance', 
        label: 'Attendance', 
        icon: 'calendar-outline' as const,
        accessibilityLabel: 'Attendance',
        accessibilityHint: 'View attendance records'
      },
      { 
        id: 'messages', 
        label: 'Messages', 
        icon: 'mail' as const, 
        badge: 2,
        accessibilityLabel: 'Messages',
        accessibilityHint: '2 unread messages from teachers'
      },
      { 
        id: 'profile', 
        label: 'Profile', 
        icon: 'person' as const,
        accessibilityLabel: 'Profile',
        accessibilityHint: 'View and edit family profile'
      },
    ];
    
    return (
      <View>
        <Typography variant="h3" style={{ marginBottom: 16, paddingHorizontal: 16 }}>
          Parent Dashboard Navigation
        </Typography>
        <TabBar
          tabs={tabs}
          activeTab={activeTab}
          onTabPress={setActiveTab}
          variant="elevated"
        />
      </View>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Tab bar example for parent dashboard navigation.',
      },
    },
  },
};

// Management dashboard tabs
export const ManagementDashboard: Story = {
  render: function ManagementDashboardRender() {
    const [activeTab, setActiveTab] = React.useState('dashboard');
    
    const tabs = [
      { 
        id: 'dashboard', 
        label: 'Dashboard', 
        icon: 'home' as const,
        accessibilityLabel: 'Dashboard',
        accessibilityHint: 'View school management dashboard'
      },
      { 
        id: 'students', 
        label: 'Students', 
        icon: 'school' as const,
        accessibilityLabel: 'Students',
        accessibilityHint: 'Manage student records'
      },
      { 
        id: 'teachers', 
        label: 'Teachers', 
        icon: 'people' as const,
        accessibilityLabel: 'Teachers',
        accessibilityHint: 'Manage teaching staff'
      },
      { 
        id: 'incidents', 
        label: 'Incidents', 
        icon: 'warning' as const, 
        badge: 3,
        badgeColor: '#ff9800',
        accessibilityLabel: 'Incidents',
        accessibilityHint: '3 pending incidents to review'
      },
      { 
        id: 'reports', 
        label: 'Reports', 
        icon: 'analytics' as const,
        accessibilityLabel: 'Reports',
        accessibilityHint: 'View school analytics and reports'
      },
    ];
    
    return (
      <View>
        <Typography variant="h3" style={{ marginBottom: 16, paddingHorizontal: 16 }}>
          Management Dashboard Navigation
        </Typography>
        <TabBar
          tabs={tabs}
          activeTab={activeTab}
          onTabPress={setActiveTab}
          variant="elevated"
        />
      </View>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Tab bar example for management dashboard navigation.',
      },
    },
  },
};

// Disabled tabs
export const DisabledTabs: Story = {
  render: function DisabledTabsRender() {
    const [activeTab, setActiveTab] = React.useState('home');
    
    const tabs = [
      { id: 'home', label: 'Home', icon: 'home' as const },
      { id: 'search', label: 'Search', icon: 'search' as const, disabled: true },
      { id: 'notifications', label: 'Notifications', icon: 'notifications' as const, badge: 5 },
      { id: 'profile', label: 'Profile', icon: 'person' as const, disabled: true },
    ];
    
    return (
      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Tab bar with some disabled tabs.',
      },
    },
  },
};

// Custom colors
export const CustomColors: Story = {
  render: function CustomColorsRender() {
    const [activeTab1, setActiveTab1] = React.useState('home');
    const [activeTab2, setActiveTab2] = React.useState('home');
    
    const tabs = [
      { id: 'home', label: 'Home', icon: 'home' as const },
      { id: 'search', label: 'Search', icon: 'search' as const },
      { id: 'notifications', label: 'Notifications', icon: 'notifications' as const, badge: 3 },
      { id: 'profile', label: 'Profile', icon: 'person' as const },
    ];
    
    return (
      <View style={{ gap: 20 }}>
        <View>
          <Typography variant="body2" style={{ marginBottom: 8, paddingHorizontal: 16 }}>
            Custom Blue Theme
          </Typography>
          <TabBar
            tabs={tabs}
            activeTab={activeTab1}
            onTabPress={setActiveTab1}
            backgroundColor="#e3f2fd"
            activeColor="#1976d2"
            inactiveColor="#90a4ae"
          />
        </View>
        
        <View>
          <Typography variant="body2" style={{ marginBottom: 8, paddingHorizontal: 16 }}>
            Dark Theme
          </Typography>
          <TabBar
            tabs={tabs}
            activeTab={activeTab2}
            onTabPress={setActiveTab2}
            backgroundColor="#1a1a1a"
            activeColor="#bb86fc"
            inactiveColor="#666666"
          />
        </View>
      </View>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Tab bars with custom colors and theming.',
      },
    },
  },
};

// Badge overflow
export const BadgeOverflow: Story = {
  render: function BadgeOverflowRender() {
    const [activeTab, setActiveTab] = React.useState('home');
    
    const tabs = [
      { id: 'home', label: 'Home', icon: 'home' as const },
      { id: 'messages', label: 'Messages', icon: 'mail' as const, badge: 1 },
      { id: 'notifications', label: 'Notifications', icon: 'notifications' as const, badge: 25 },
      { id: 'alerts', label: 'Alerts', icon: 'warning' as const, badge: 150, badgeColor: '#ff5722' },
    ];
    
    return (
      <View>
        <Typography variant="h4" style={{ marginBottom: 16, paddingHorizontal: 16 }}>
          Badge Overflow Examples
        </Typography>
        <TabBar
          tabs={tabs}
          activeTab={activeTab}
          onTabPress={setActiveTab}
        />
      </View>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Examples of badge overflow handling (99+ for large numbers).',
      },
    },
  },
};

// Animation comparison
export const AnimationComparison: Story = {
  render: function AnimationComparisonRender() {
    const [activeTab1, setActiveTab1] = React.useState('home');
    const [activeTab2, setActiveTab2] = React.useState('home');
    
    const tabs = [
      { id: 'home', label: 'Home', icon: 'home' as const },
      { id: 'search', label: 'Search', icon: 'search' as const },
      { id: 'notifications', label: 'Notifications', icon: 'notifications' as const },
      { id: 'profile', label: 'Profile', icon: 'person' as const },
    ];
    
    return (
      <View style={{ gap: 20 }}>
        <View>
          <Typography variant="body2" style={{ marginBottom: 8, paddingHorizontal: 16 }}>
            With Animation (Default)
          </Typography>
          <TabBar
            tabs={tabs}
            activeTab={activeTab1}
            onTabPress={setActiveTab1}
            animated={true}
          />
        </View>
        
        <View>
          <Typography variant="body2" style={{ marginBottom: 8, paddingHorizontal: 16 }}>
            Without Animation
          </Typography>
          <TabBar
            tabs={tabs}
            activeTab={activeTab2}
            onTabPress={setActiveTab2}
            animated={false}
          />
        </View>
      </View>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Comparison between animated and non-animated tab transitions.',
      },
    },
  },
};