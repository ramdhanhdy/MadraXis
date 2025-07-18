# Header Component

A consistent page header component that provides uniform title positioning, action buttons, and notification icons across all user roles.

## Features

- **Consistent Layout**: Standardized header structure with proper spacing and alignment
- **Flexible Actions**: Support for left action (typically back button) and multiple right actions
- **Badge Support**: Notification badges on action buttons with automatic overflow handling
- **Multiple Variants**: Default, transparent, and elevated styling options
- **Title Alignment**: Centered or left-aligned title options
- **Status Bar Integration**: Automatic status bar styling and spacing
- **Accessibility**: Full accessibility support with proper roles and labels

## Usage

### Basic Header

```tsx
import { Header } from '../../../components/organisms/Header';

<Header title="Dashboard" />
```

### Header with Subtitle

```tsx
<Header
  title="Student Dashboard"
  subtitle="Welcome back, Ahmed"
/>
```

### Header with Back Button

```tsx
<Header
  title="Assignment Details"
  leftAction={{
    icon: 'arrow-back',
    onPress: () => navigation.goBack(),
    accessibilityLabel: 'Go back',
  }}
/>
```

### Header with Actions

```tsx
<Header
  title="Messages"
  rightActions={[
    {
      icon: 'search',
      onPress: () => openSearch(),
      accessibilityLabel: 'Search messages',
    },
    {
      icon: 'add',
      onPress: () => createMessage(),
      accessibilityLabel: 'New message',
    },
  ]}
/>
```

### Header with Notifications

```tsx
<Header
  title="Dashboard"
  rightActions={[
    {
      icon: 'notifications',
      onPress: () => viewNotifications(),
      badge: 3,
      accessibilityLabel: 'Notifications',
      accessibilityHint: '3 unread notifications',
    },
    {
      icon: 'person-circle',
      onPress: () => openProfile(),
      accessibilityLabel: 'Profile',
    },
  ]}
/>
```

### Different Variants

```tsx
// Default variant
<Header
  title="Default Header"
  variant="default"
/>

// Transparent variant
<Header
  title="Transparent Header"
  variant="transparent"
/>

// Elevated variant (with shadow)
<Header
  title="Elevated Header"
  variant="elevated"
/>
```

### Custom Colors

```tsx
<Header
  title="Custom Header"
  backgroundColor="#2196f3"
  textColor="#ffffff"
  rightActions={[
    {
      icon: 'settings',
      onPress: () => openSettings(),
    },
  ]}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Header title (required) |
| `subtitle` | `string` | - | Optional subtitle text |
| `leftAction` | `HeaderAction` | - | Left action button (typically back) |
| `rightActions` | `HeaderAction[]` | `[]` | Array of right action buttons |
| `variant` | `'default' \| 'transparent' \| 'elevated'` | `'default'` | Visual variant |
| `backgroundColor` | `string` | Auto | Custom background color |
| `textColor` | `string` | Auto | Custom text color |
| `centerTitle` | `boolean` | `true` | Whether to center the title |
| `showStatusBar` | `boolean` | `true` | Whether to show status bar |
| `statusBarStyle` | `'default' \| 'light-content' \| 'dark-content'` | `'dark-content'` | Status bar style |
| `style` | `ViewStyle` | - | Additional custom styles |
| `accessibilityLabel` | `string` | Auto | Accessibility label |
| `testID` | `string` | - | Test identifier |

### HeaderAction Interface

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `keyof typeof Ionicons.glyphMap` | - | Icon name (required) |
| `onPress` | `() => void` | - | Press handler (required) |
| `badge` | `number` | - | Badge number (shows if > 0) |
| `badgeColor` | `string` | Error color | Custom badge background color |
| `accessibilityLabel` | `string` | Auto | Accessibility label |
| `accessibilityHint` | `string` | - | Accessibility hint |
| `testID` | `string` | - | Test identifier |

## Design Specifications

- **Height**: 56px + status bar height (when shown)
- **Horizontal Padding**: 16px (theme.spacing.base.md)
- **Vertical Padding**: 8px (theme.spacing.base.sm)
- **Action Button Size**: 44px x 44px (minimum touch target)
- **Badge Size**: 16px diameter for header badges
- **Status Bar**: Automatic spacing and styling integration

## Accessibility

- Uses `header` accessibility role
- Auto-generates accessibility labels from title
- Supports custom accessibility labels and hints for actions
- Provides proper button roles for all interactive elements
- Includes badge information in accessibility labels

## Examples in Context

### Student Dashboard Header

```tsx
<Header
  title="Student Dashboard"
  subtitle="Welcome back, Ahmed Al-Rashid"
  variant="elevated"
  rightActions={[
    {
      icon: 'notifications',
      onPress: () => viewNotifications(),
      badge: 2,
      accessibilityLabel: 'Notifications',
      accessibilityHint: '2 unread notifications',
    },
    {
      icon: 'person-circle',
      onPress: () => openProfile(),
      accessibilityLabel: 'Profile menu',
    },
  ]}
/>
```

### Teacher Dashboard Header

```tsx
<Header
  title="Teacher Dashboard"
  subtitle="Grade 10A - Mathematics"
  variant="elevated"
  rightActions={[
    {
      icon: 'add-circle',
      onPress: () => quickAdd(),
      accessibilityLabel: 'Quick add',
      accessibilityHint: 'Add assignment or announcement',
    },
    {
      icon: 'notifications',
      onPress: () => viewNotifications(),
      badge: 5,
      accessibilityLabel: 'Notifications',
      accessibilityHint: '5 unread notifications',
    },
    {
      icon: 'person-circle',
      onPress: () => openProfile(),
      accessibilityLabel: 'Profile menu',
    },
  ]}
/>
```

### Parent Dashboard Header

```tsx
<Header
  title="Parent Dashboard"
  subtitle="Ahmed Al-Rashid - Grade 10A"
  variant="elevated"
  rightActions={[
    {
      icon: 'call',
      onPress: () => emergencyContact(),
      accessibilityLabel: 'Emergency contact',
      accessibilityHint: 'Call school for emergency',
    },
    {
      icon: 'notifications',
      onPress: () => viewNotifications(),
      badge: 1,
      accessibilityLabel: 'Notifications',
      accessibilityHint: '1 unread notification',
    },
    {
      icon: 'person-circle',
      onPress: () => openProfile(),
      accessibilityLabel: 'Profile menu',
    },
  ]}
/>
```

### Management Dashboard Header

```tsx
<Header
  title="Management Dashboard"
  subtitle="Al-Noor Islamic School"
  variant="elevated"
  rightActions={[
    {
      icon: 'analytics',
      onPress: () => viewAnalytics(),
      accessibilityLabel: 'Analytics',
      accessibilityHint: 'View school analytics',
    },
    {
      icon: 'warning',
      onPress: () => viewIncidents(),
      badge: 2,
      badgeColor: '#ff9800',
      accessibilityLabel: 'Incidents',
      accessibilityHint: '2 pending incidents',
    },
    {
      icon: 'notifications',
      onPress: () => viewNotifications(),
      badge: 8,
      accessibilityLabel: 'Notifications',
      accessibilityHint: '8 unread notifications',
    },
    {
      icon: 'person-circle',
      onPress: () => openProfile(),
      accessibilityLabel: 'Profile menu',
    },
  ]}
/>
```

### Detail Page Header

```tsx
<Header
  title="Assignment Details"
  subtitle="Mathematics - Chapter 5 Exercises"
  leftAction={{
    icon: 'arrow-back',
    onPress: () => navigation.goBack(),
    accessibilityLabel: 'Go back',
    accessibilityHint: 'Return to assignments list',
  }}
  rightActions={[
    {
      icon: 'share',
      onPress: () => shareAssignment(),
      accessibilityLabel: 'Share',
      accessibilityHint: 'Share assignment details',
    },
    {
      icon: 'bookmark',
      onPress: () => bookmarkAssignment(),
      accessibilityLabel: 'Bookmark',
      accessibilityHint: 'Save assignment for later',
    },
    {
      icon: 'more-vertical',
      onPress: () => showMoreOptions(),
      accessibilityLabel: 'More options',
    },
  ]}
/>
```

### Search Header

```tsx
<Header
  title="Search Students"
  centerTitle={false}
  leftAction={{
    icon: 'arrow-back',
    onPress: () => cancelSearch(),
    accessibilityLabel: 'Cancel search',
  }}
  rightActions={[
    {
      icon: 'filter',
      onPress: () => showFilters(),
      accessibilityLabel: 'Filter',
      accessibilityHint: 'Filter search results',
    },
  ]}
/>
```

### Modal Header

```tsx
<Header
  title="Create Assignment"
  variant="transparent"
  centerTitle={false}
  showStatusBar={false}
  leftAction={{
    icon: 'close',
    onPress: () => closeModal(),
    accessibilityLabel: 'Close',
    accessibilityHint: 'Close create assignment modal',
  }}
  rightActions={[
    {
      icon: 'checkmark',
      onPress: () => saveAssignment(),
      accessibilityLabel: 'Save',
      accessibilityHint: 'Save assignment',
    },
  ]}
/>
```