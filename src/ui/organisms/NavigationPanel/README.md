# NavigationPanel Component

A versatile navigation and notification panel component that provides consistent styling and interactions for different content types across all user roles.

## Component Structure

```
┌─────────────────────────────────────────┐
│ NavigationPanel                         │
├─────────────────────────────────────────┤
│ Header (optional)                       │
│ ┌─────────────────────┬─────────────────┐ │
│ │ Title & Subtitle    │ Action Buttons  │ │
│ │ • Main title        │ • Refresh       │ │
│ │ • Optional subtitle │ • Mark all read │ │
│ │ • Unread count      │ • Clear all     │ │
│ └─────────────────────┴─────────────────┘ │
├─────────────────────────────────────────┤
│ Content Area (scrollable)               │
│                                         │
│ Navigation Items:                       │
│ ┌─────────────────────────────────────┐ │
│ │ [Icon] Title           Badge    [>] │ │
│ │        Subtitle                     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Notifications:                          │
│ ┌─────────────────────────────────────┐ │
│ │ [●] Title              [Action Btn] │ │
│ │     Message                         │ │
│ │     Timestamp                       │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Empty State:                            │
│ ┌─────────────────────────────────────┐ │
│ │           [Large Icon]              │ │
│ │           Empty Title               │ │
│ │         Empty Message               │ │
│ │         [Refresh Button]            │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘

Panel Types:
• notifications: Shows only notification items
• navigation: Shows only navigation items  
• mixed: Shows navigation items + notifications

Variants:
• default: Standard background with border
• elevated: Includes shadow/elevation
• transparent: No background color
```

## Features

- **Multi-Purpose Panel**: Supports notifications, navigation items, or mixed content
- **Flexible Content Types**: Display notifications, navigation items, or both
- **Consistent Layout**: Standardized panel structure with header and scrollable content
- **Visual Variants**: Default, elevated, and transparent styling options
- **Loading States**: Built-in loading animations and refresh functionality
- **Empty State**: Customizable empty state with icon and message
- **Bulk Actions**: Support for mark all as read, clear all, and refresh actions
- **Accessibility**: Full accessibility support with proper semantic roles and labels
- **Responsive Design**: Adapts to screen size with configurable max height

## Usage

### Basic Notification Panel

```tsx
import { NavigationPanel } from '../../../components/organisms/NavigationPanel';

const notifications = [
  {
    id: '1',
    title: 'New Assignment',
    message: 'You have a new mathematics assignment due tomorrow.',
    timestamp: '2 hours ago',
    read: false,
    type: 'info',
    actionLabel: 'View',
    onAction: () => handleViewAssignment(),
  },
  // More notifications...
];

<NavigationPanel
  type="notifications"
  title="Notifications"
  notifications={notifications}
  onMarkAllRead={() => markAllAsRead()}
  onClearAll={() => clearAllNotifications()}
  onRefresh={() => refreshNotifications()}
/>
```

### Navigation Items Panel

```tsx
const navigationItems = [
  {
    id: '1',
    title: 'Dashboard',
    subtitle: 'Overview and statistics',
    icon: 'home',
    onPress: () => navigateToDashboard(),
  },
  {
    id: '2',
    title: 'Classes',
    subtitle: 'Manage your classes',
    icon: 'school',
    badge: 3,
    onPress: () => navigateToClasses(),
  },
  // More navigation items...
];

<NavigationPanel
  type="navigation"
  title="Quick Navigation"
  navigationItems={navigationItems}
/>
```

### Mixed Content Panel

```tsx
<NavigationPanel
  type="mixed"
  title="Dashboard Panel"
  navigationItems={navigationItems}
  notifications={notifications}
  onMarkAllRead={() => markAllAsRead()}
  onRefresh={() => refreshContent()}
/>
```

### Different Variants

```tsx
// Elevated panel with shadow
<NavigationPanel
  variant="elevated"
  notifications={notifications}
/>

// Transparent panel
<NavigationPanel
  variant="transparent"
  notifications={notifications}
/>

// Custom max height
<NavigationPanel
  notifications={notifications}
  maxHeight={400}
  scrollable={true}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'notifications' \| 'navigation' \| 'mixed'` | `'notifications'` | Panel content type |
| `title` | `string` | - | Panel title |
| `subtitle` | `string` | - | Panel subtitle |
| `navigationItems` | `NavigationItem[]` | `[]` | Array of navigation items |
| `notifications` | `PanelNotification[]` | `[]` | Array of notifications |
| `onClearAll` | `() => void` | - | Clear all items handler |
| `onMarkAllRead` | `() => void` | - | Mark all notifications as read handler |
| `onRefresh` | `() => void` | - | Refresh content handler |
| `variant` | `'default' \| 'elevated' \| 'transparent'` | `'default'` | Visual variant |
| `showHeader` | `boolean` | `true` | Whether to show header |
| `showActions` | `boolean` | `true` | Whether to show action buttons |
| `maxHeight` | `number` | - | Maximum panel height |
| `scrollable` | `boolean` | `true` | Whether content is scrollable |
| `emptyTitle` | `string` | `'No items'` | Empty state title |
| `emptyMessage` | `string` | `'There are no items to display'` | Empty state message |
| `emptyIcon` | `keyof typeof Ionicons.glyphMap` | `'inbox'` | Empty state icon |
| `loading` | `boolean` | `false` | Loading state |
| `refreshing` | `boolean` | `false` | Refreshing state |
| `style` | `ViewStyle` | - | Additional panel styles |
| `headerStyle` | `ViewStyle` | - | Header area styles |
| `contentStyle` | `ViewStyle` | - | Content area styles |
| `accessibilityLabel` | `string` | - | Accessibility label |
| `testID` | `string` | - | Test identifier |

### NavigationItem Interface

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | - | Unique identifier (required) |
| `title` | `string` | - | Item title (required) |
| `subtitle` | `string` | - | Item subtitle |
| `icon` | `keyof typeof Ionicons.glyphMap` | - | Item icon |
| `badge` | `number` | - | Badge count |
| `badgeColor` | `string` | - | Badge background color |
| `onPress` | `() => void` | - | Press handler (required) |
| `disabled` | `boolean` | - | Whether item is disabled |
| `testID` | `string` | - | Test identifier |

### PanelNotification Interface

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | - | Unique identifier (required) |
| `title` | `string` | - | Notification title (required) |
| `message` | `string` | - | Notification message (required) |
| `type` | `NotificationType` | - | Notification type |
| `timestamp` | `string` | - | Notification timestamp |
| `read` | `boolean` | - | Whether notification is read |
| `icon` | `keyof typeof Ionicons.glyphMap` | - | Notification icon |
| `onPress` | `() => void` | - | Press handler |
| `onDismiss` | `() => void` | - | Dismiss handler |
| `onAction` | `() => void` | - | Action button handler |
| `actionLabel` | `string` | - | Action button label |

## Design Specifications

- **Border Radius**: Uses theme border radius (lg) values
- **Max Height**: Default 70% of screen height, customizable
- **Animation**: Loading fade animation for content
- **Shadow**: Elevated variant includes theme card shadows
- **Background**: Theme surface colors with transparency support
- **Header**: Flexible layout with title, subtitle, and action buttons
- **Action Buttons**: 32x32px touch targets with proper spacing

## Accessibility

- Uses `accessibilityRole="menu"` for proper semantic navigation
- Provides proper button roles for all interactive elements
- Auto-generates accessibility labels from titles and content
- Supports custom accessibility labels and hints
- Includes proper focus management for screen readers
- Badge announcements for navigation items with counts
- Loading state announcements for screen readers

## Examples in Context

### Student Dashboard Navigation

```tsx
const studentNavigation = [
  {
    id: '1',
    title: 'My Classes',
    subtitle: 'View your enrolled classes',
    icon: 'school',
    badge: 3,
    onPress: () => navigateToClasses(),
  },
  {
    id: '2',
    title: 'Assignments',
    subtitle: '2 pending submissions',
    icon: 'document-text',
    badge: 2,
    badgeColor: '#FF6B6B',
    onPress: () => navigateToAssignments(),
  },
  {
    id: '3',
    title: 'Grades',
    subtitle: 'Check your academic progress',
    icon: 'trophy',
    onPress: () => navigateToGrades(),
  },
];

<NavigationPanel
  type="navigation"
  title="Quick Access"
  navigationItems={studentNavigation}
  variant="elevated"
/>
```

### Teacher Notification Center

```tsx
const teacherNotifications = [
  {
    id: '1',
    title: 'New Assignment Submissions',
    message: '8 students have submitted their Mathematics homework.',
    timestamp: '15 minutes ago',
    read: false,
    type: 'info',
    icon: 'document',
    actionLabel: 'Review',
    onAction: () => reviewSubmissions(),
  },
  {
    id: '2',
    title: 'Parent Meeting Request',
    message: 'Ahmed\'s parent has requested a meeting to discuss progress.',
    timestamp: '2 hours ago',
    read: false,
    type: 'warning',
    icon: 'people',
    actionLabel: 'Schedule',
    onAction: () => scheduleMeeting(),
  },
];

<NavigationPanel
  type="notifications"
  title="Teacher Notifications"
  subtitle="Stay updated with classroom activities"
  notifications={teacherNotifications}
  onMarkAllRead={() => markAllAsRead()}
  onClearAll={() => clearAllNotifications()}
  onRefresh={() => refreshNotifications()}
  showActions={true}
/>
```

### Management Mixed Panel

```tsx
const managementNavigation = [
  {
    id: '1',
    title: 'School Overview',
    subtitle: 'Dashboard and statistics',
    icon: 'analytics',
    onPress: () => navigateToDashboard(),
  },
  {
    id: '2',
    title: 'Staff Management',
    subtitle: 'Manage teachers and staff',
    icon: 'people',
    onPress: () => navigateToStaff(),
  },
];

const managementNotifications = [
  {
    id: '1',
    title: 'Urgent: Incident Report',
    message: 'New incident reported requiring immediate attention.',
    timestamp: '5 minutes ago',
    read: false,
    type: 'error',
    icon: 'warning',
    actionLabel: 'Review',
    onAction: () => reviewIncident(),
  },
];

<NavigationPanel
  type="mixed"
  title="Management Center"
  navigationItems={managementNavigation}
  notifications={managementNotifications}
  onMarkAllRead={() => markAllAsRead()}
  onRefresh={() => refreshContent()}
  variant="elevated"
  maxHeight={500}
/>
```

### Loading and Empty States

```tsx
// Loading state
<NavigationPanel
  type="notifications"
  title="Loading Notifications"
  notifications={[]}
  loading={true}
/>

// Empty state with custom message
<NavigationPanel
  type="notifications"
  title="Notifications"
  notifications={[]}
  emptyTitle="All caught up!"
  emptyMessage="You have no new notifications at this time."
  emptyIcon="checkmark-circle"
  onRefresh={() => refreshNotifications()}
/>

// Refreshing state
<NavigationPanel
  type="notifications"
  notifications={notifications}
  refreshing={true}
  onRefresh={() => refreshNotifications()}
/>
```

### Custom Styling Examples

```tsx
// Transparent variant for overlay
<NavigationPanel
  type="navigation"
  navigationItems={quickActions}
  variant="transparent"
  showHeader={false}
  style={{
    position: 'absolute',
    top: 100,
    right: 20,
    width: 280,
  }}
/>

// Compact panel with custom height
<NavigationPanel
  type="notifications"
  notifications={recentNotifications}
  maxHeight={300}
  title="Recent Updates"
  showActions={false}
  style={{
    borderRadius: 12,
    margin: 16,
  }}
/>
```