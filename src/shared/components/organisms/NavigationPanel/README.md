# NavigationPanel Component

A consistent notification panel component that provides uniform styling and interactions for displaying notifications across all user roles.

## Features

- **Consistent Layout**: Standardized notification panel structure with header and content
- **Flexible Positioning**: Support for left or right side positioning
- **Animation Support**: Smooth slide-in and slide-out animations
- **Notification Types**: Support for different notification types (info, success, warning, error)
- **Action Support**: Configurable action buttons for notifications
- **Empty State**: Customizable empty state message
- **Bulk Actions**: Support for mark all as read, clear all, and view all actions
- **Accessibility**: Full accessibility support with proper roles and labels

## Usage

### Basic Navigation Panel

```tsx
import { NavigationPanel } from '../../../components/organisms/NavigationPanel';

const [visible, setVisible] = useState(false);
const notifications = [
  {
    id: '1',
    title: 'New Assignment',
    message: 'You have a new mathematics assignment due tomorrow.',
    timestamp: new Date(),
    read: false,
    type: 'info',
    actionLabel: 'View',
    onAction: () => handleViewAssignment(),
  },
  // More notifications...
];

<NavigationPanel
  visible={visible}
  onClose={() => setVisible(false)}
  notifications={notifications}
  onMarkAllAsRead={() => markAllAsRead()}
  onViewAll={() => viewAllNotifications()}
/>
```

### Different Positions

```tsx
// Right side panel (default)
<NavigationPanel
  visible={visible}
  onClose={() => setVisible(false)}
  notifications={notifications}
  position="right"
/>

// Left side panel
<NavigationPanel
  visible={visible}
  onClose={() => setVisible(false)}
  notifications={notifications}
  position="left"
/>
```

### Custom Styling

```tsx
<NavigationPanel
  visible={visible}
  onClose={() => setVisible(false)}
  notifications={notifications}
  backgroundColor="#1a1a1a"
  backdropColor="rgba(0, 0, 0, 0.8)"
  width={400}
  title="Custom Panel"
/>
```

### Empty State

```tsx
<NavigationPanel
  visible={visible}
  onClose={() => setVisible(false)}
  notifications={[]}
  emptyStateMessage="You have no notifications"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | - | Whether the panel is visible (required) |
| `onClose` | `() => void` | - | Close handler (required) |
| `title` | `string` | `'Notifications'` | Panel title |
| `notifications` | `Notification[]` | `[]` | Array of notifications |
| `emptyStateMessage` | `string` | `'No notifications'` | Empty state message |
| `onMarkAllAsRead` | `() => void` | - | Mark all as read handler |
| `onClearAll` | `() => void` | - | Clear all handler |
| `onViewAll` | `() => void` | - | View all handler |
| `position` | `'left' \| 'right'` | `'right'` | Panel position |
| `width` | `number \| string` | `320` | Panel width |
| `maxHeight` | `number \| string` | - | Maximum panel height |
| `animationDuration` | `number` | `300` | Animation duration in ms |
| `backgroundColor` | `string` | - | Custom background color |
| `backdropColor` | `string` | - | Custom backdrop color |
| `backdropOpacity` | `number` | `0.5` | Backdrop opacity |
| `style` | `ViewStyle` | - | Additional panel styles |
| `contentStyle` | `ViewStyle` | - | Content area styles |
| `headerStyle` | `ViewStyle` | - | Header area styles |
| `accessibilityLabel` | `string` | - | Accessibility label |
| `testID` | `string` | - | Test identifier |

### Notification Interface

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | - | Unique identifier (required) |
| `title` | `string` | - | Notification title (required) |
| `message` | `string` | - | Notification message (required) |
| `timestamp` | `string \| Date` | - | Notification timestamp (required) |
| `read` | `boolean` | - | Whether notification is read (required) |
| `type` | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | Notification type |
| `actionLabel` | `string` | - | Action button label |
| `onAction` | `() => void` | - | Action button handler |
| `onPress` | `() => void` | - | Press handler |
| `image` | `string` | - | Optional image URL |
| `sender` | `{ name: string; avatar?: string }` | - | Sender information |
| `testID` | `string` | - | Test identifier |

## Design Specifications

- **Border Radius**: Uses theme border radius values
- **Width**: Default 320px, customizable
- **Animation**: Slide in/out with fade effect
- **Shadow**: Consistent with theme shadow system
- **Backdrop**: Semi-transparent overlay
- **Header Height**: Minimum 60px with proper padding
- **Close Button**: 40x40px touch target

## Accessibility

- Uses `accessibilityViewIsModal` for proper modal behavior
- Provides proper button roles for all interactive elements
- Auto-generates accessibility labels from titles
- Supports custom accessibility labels and hints
- Includes proper focus management for screen readers

## Examples in Context

### Student Notifications

```tsx
const studentNotifications = [
  {
    id: '1',
    title: 'New Assignment',
    message: 'Mathematics: Complete exercises 5-10 from Chapter 7.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    type: 'info',
    actionLabel: 'View',
    onAction: () => viewAssignment(),
  },
  {
    id: '2',
    title: 'Quiz Grade Posted',
    message: 'You scored 92% on your recent Science quiz.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    read: true,
    type: 'success',
    actionLabel: 'View Grade',
    onAction: () => viewGrade(),
  },
];

<NavigationPanel
  visible={visible}
  onClose={() => setVisible(false)}
  notifications={studentNotifications}
  title="My Notifications"
  onMarkAllAsRead={() => markAllAsRead()}
  onViewAll={() => viewAllNotifications()}
/>
```

### Teacher Notifications

```tsx
const teacherNotifications = [
  {
    id: '1',
    title: 'Assignments to Grade',
    message: '8 new student submissions for Mathematics Chapter 7 exercises.',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    read: false,
    type: 'info',
    actionLabel: 'Grade Now',
    onAction: () => gradeAssignments(),
  },
  {
    id: '2',
    title: 'Parent Request',
    message: 'Ahmed\'s parent has requested a meeting to discuss his progress.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    read: true,
    sender: {
      name: 'Mr. Al-Rashid',
      avatar: 'https://i.pravatar.cc/150?img=68',
    },
    actionLabel: 'Schedule',
    onAction: () => scheduleMeeting(),
  },
];

<NavigationPanel
  visible={visible}
  onClose={() => setVisible(false)}
  notifications={teacherNotifications}
  title="Notifications"
  onMarkAllAsRead={() => markAllAsRead()}
  onClearAll={() => clearAllNotifications()}
  onViewAll={() => viewAllNotifications()}
/>
```

### Parent Notifications

```tsx
const parentNotifications = [
  {
    id: '1',
    title: 'Ahmed\'s Test Result',
    message: 'Ahmed scored 88% on his Mathematics test.',
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    read: false,
    type: 'success',
    actionLabel: 'View Details',
    onAction: () => viewTestDetails(),
  },
  {
    id: '2',
    title: 'Message from Ms. Sarah',
    message: 'I\'d like to discuss Ahmed\'s progress in Mathematics. He\'s showing great improvement!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    read: true,
    sender: {
      name: 'Ms. Sarah',
      avatar: 'https://i.pravatar.cc/150?img=32',
    },
    actionLabel: 'Reply',
    onAction: () => replyToMessage(),
  },
];

<NavigationPanel
  visible={visible}
  onClose={() => setVisible(false)}
  notifications={parentNotifications}
  title="Ahmed's Updates"
  onMarkAllAsRead={() => markAllAsRead()}
  onViewAll={() => viewAllNotifications()}
/>
```

### Management Notifications

```tsx
const managementNotifications = [
  {
    id: '1',
    title: 'Incident Report',
    message: 'New incident reported in Grade 10 classroom. Requires immediate attention.',
    timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
    read: false,
    type: 'error',
    actionLabel: 'Review',
    onAction: () => reviewIncident(),
  },
  {
    id: '2',
    title: 'Teacher Absence',
    message: 'Mr. Khalid has reported sick leave for tomorrow. Substitute needed.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    read: false,
    type: 'warning',
    actionLabel: 'Arrange Sub',
    onAction: () => arrangeSubstitute(),
  },
];

<NavigationPanel
  visible={visible}
  onClose={() => setVisible(false)}
  notifications={managementNotifications}
  title="School Notifications"
  onMarkAllAsRead={() => markAllAsRead()}
  onClearAll={() => clearAllNotifications()}
  onViewAll={() => viewAllNotifications()}
/>
```

### State Management Example

```tsx
const [visible, setVisible] = useState(false);
const [notifications, setNotifications] = useState(initialNotifications);

const handleMarkAllAsRead = () => {
  setNotifications(prev => prev.map(n => ({ ...n, read: true })));
};

const handleClearAll = () => {
  setNotifications([]);
};

const handleDismissNotification = (id: string) => {
  setNotifications(prev => prev.filter(n => n.id !== id));
};

<NavigationPanel
  visible={visible}
  onClose={() => setVisible(false)}
  notifications={notifications}
  onMarkAllAsRead={handleMarkAllAsRead}
  onClearAll={handleClearAll}
  onViewAll={() => navigateToNotifications()}
/>
```