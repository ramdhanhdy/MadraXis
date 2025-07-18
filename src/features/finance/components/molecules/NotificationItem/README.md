# NotificationItem Component

A consistent notification display component that provides uniform styling and interactions for notifications across all user roles.

## Features

- **Consistent Visual Patterns**: Standardized notification layout with color coding
- **Type-based Styling**: Info, success, warning, and error variants with appropriate colors
- **Status Indicators**: Visual distinction between read and unread notifications
- **Action Support**: Optional action buttons and dismiss functionality
- **Compact Mode**: Space-efficient layout for dense notification lists
- **Accessibility**: Full accessibility support with proper roles and labels

## Usage

### Basic NotificationItem

```tsx
import { NotificationItem } from '../../../components/molecules/NotificationItem';

<NotificationItem
  title="New Assignment"
  message="Math homework has been assigned for tomorrow"
  timestamp="2 hours ago"
/>
```

### Different Notification Types

```tsx
// Info notification (default)
<NotificationItem
  type="info"
  title="Class Schedule Update"
  message="Your Monday schedule has been updated"
  timestamp="1 hour ago"
/>

// Success notification
<NotificationItem
  type="success"
  title="Assignment Submitted"
  message="Your science project has been successfully submitted"
  timestamp="30 minutes ago"
/>

// Warning notification
<NotificationItem
  type="warning"
  title="Low Attendance"
  message="Your attendance is below the required threshold"
  timestamp="1 day ago"
/>

// Error notification
<NotificationItem
  type="error"
  title="Payment Failed"
  message="Unable to process your fee payment. Please try again"
  timestamp="2 days ago"
/>
```

### Interactive Notifications

```tsx
<NotificationItem
  title="Parent-Teacher Meeting"
  message="Scheduled for next Friday at 3:00 PM"
  timestamp="1 hour ago"
  onPress={() => viewMeetingDetails()}
  onDismiss={() => dismissNotification()}
  onAction={() => confirmAttendance()}
  actionLabel="Confirm"
/>
```

### Read/Unread States

```tsx
// Unread notification (default)
<NotificationItem
  title="New Message"
  message="You have received a new message from your teacher"
  read={false}
/>

// Read notification
<NotificationItem
  title="Grade Posted"
  message="Your math test grade has been posted"
  read={true}
/>
```

### Compact Mode

```tsx
<NotificationItem
  title="Quick Update"
  message="Brief notification message"
  compact
  timestamp="5m"
/>
```

### Custom Icons

```tsx
<NotificationItem
  title="Custom Notification"
  message="Notification with custom icon"
  icon="star"
  type="success"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Notification title (required) |
| `message` | `string` | - | Notification message (required) |
| `type` | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | Notification type with color coding |
| `timestamp` | `string` | - | Optional timestamp text |
| `read` | `boolean` | `false` | Whether notification has been read |
| `icon` | `keyof typeof Ionicons.glyphMap` | Auto | Custom icon (overrides type icon) |
| `onPress` | `() => void` | - | Optional press handler |
| `onDismiss` | `() => void` | - | Optional dismiss handler |
| `onAction` | `() => void` | - | Optional action handler |
| `actionLabel` | `string` | - | Action button label |
| `showDismiss` | `boolean` | `true` | Whether to show dismiss button |
| `compact` | `boolean` | `false` | Whether to use compact layout |
| `style` | `ViewStyle` | - | Additional custom styles |
| `accessibilityLabel` | `string` | Auto | Accessibility label |
| `accessibilityHint` | `string` | - | Accessibility hint |
| `testID` | `string` | - | Test identifier |

## Design Specifications

- **Border**: 4px left border with type-specific color
- **Padding**: 16px (normal), 8px (compact)
- **Border Radius**: 8px (theme.borderRadius.md)
- **Shadow**: Card shadow for elevation
- **Colors**:
  - Info: Primary theme color
  - Success: Success theme color
  - Warning: Warning theme color
  - Error: Error theme color
- **Read State**: 80% opacity and secondary background
- **Icon Size**: Large (24px) normal, Medium (20px) compact

## Accessibility

- Uses appropriate accessibility roles (`button` for interactive, `text` for static)
- Auto-generates comprehensive accessibility labels
- Includes read/unread status in accessibility information
- Proper accessibility hints for actions
- Dismiss button has dedicated accessibility support

## Examples in Context

### Notification Feed

```tsx
<View style={{ gap: 12 }}>
  <NotificationItem
    type="info"
    title="Class Schedule Change"
    message="Your Physics class has been moved to Room 205"
    timestamp="2 hours ago"
    onPress={() => viewSchedule()}
    onDismiss={() => dismissNotification('1')}
  />
  
  <NotificationItem
    type="success"
    title="Assignment Graded"
    message="Your English essay received an A grade"
    timestamp="1 day ago"
    read={true}
    onPress={() => viewGrade()}
    onDismiss={() => dismissNotification('2')}
  />
  
  <NotificationItem
    type="warning"
    title="Fee Payment Due"
    message="Your semester fee payment is due in 3 days"
    timestamp="2 days ago"
    onPress={() => makePayment()}
    onAction={() => makePayment()}
    actionLabel="Pay Now"
    onDismiss={() => dismissNotification('3')}
  />
</View>
```

### Compact Notification List

```tsx
<Card padding="small">
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
  </View>
</Card>
```

### Action-Heavy Notifications

```tsx
<NotificationItem
  type="warning"
  title="Incident Report Required"
  message="Please submit an incident report for today's playground incident"
  timestamp="30 minutes ago"
  onPress={() => viewIncident()}
  onAction={() => createReport()}
  actionLabel="Create Report"
  onDismiss={() => dismissNotification()}
/>

<NotificationItem
  type="info"
  title="Parent Consent Needed"
  message="Field trip permission form requires parent signature"
  timestamp="1 hour ago"
  onPress={() => viewForm()}
  onAction={() => requestSignature()}
  actionLabel="Request Signature"
  onDismiss={() => dismissNotification()}
/>
```