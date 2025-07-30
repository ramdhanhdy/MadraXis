# TabBar Component

A consistent bottom navigation component that provides uniform tab styling, active states, and transitions across all user roles.

## Features

- **Consistent Navigation**: Standardized bottom navigation with proper spacing and alignment
- **Active State Indicator**: Animated indicator showing the currently active tab
- **Badge Support**: Notification badges on tabs with automatic overflow handling (99+)
- **Multiple Variants**: Default, elevated, and transparent styling options
- **Flexible Layout**: Support for labels or icon-only modes
- **Animation Support**: Smooth transitions between tabs with customizable duration
- **Accessibility**: Full accessibility support with proper tab roles and states

## Usage

### Basic TabBar

```tsx
import { TabBar } from '../../../components/organisms/TabBar';

const [activeTab, setActiveTab] = useState('home');

const tabs = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'search', label: 'Search', icon: 'search' },
  { id: 'notifications', label: 'Notifications', icon: 'notifications' },
  { id: 'profile', label: 'Profile', icon: 'person' },
];

<TabBar
  tabs={tabs}
  activeTab={activeTab}
  onTabPress={setActiveTab}
/>
```

### TabBar with Badges

```tsx
const tabs = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'messages', label: 'Messages', icon: 'mail', badge: 3 },
  { id: 'notifications', label: 'Notifications', icon: 'notifications', badge: 12 },
  { id: 'profile', label: 'Profile', icon: 'person' },
];

<TabBar
  tabs={tabs}
  activeTab={activeTab}
  onTabPress={setActiveTab}
/>
```

### Different Variants

```tsx
// Default variant
<TabBar
  tabs={tabs}
  activeTab={activeTab}
  onTabPress={setActiveTab}
  variant="default"
/>

// Elevated variant (with shadow)
<TabBar
  tabs={tabs}
  activeTab={activeTab}
  onTabPress={setActiveTab}
  variant="elevated"
/>

// Transparent variant
<TabBar
  tabs={tabs}
  activeTab={activeTab}
  onTabPress={setActiveTab}
  variant="transparent"
/>
```

### Icon-Only Mode

```tsx
<TabBar
  tabs={tabs}
  activeTab={activeTab}
  onTabPress={setActiveTab}
  showLabels={false}
/>
```

### Custom Colors

```tsx
<TabBar
  tabs={tabs}
  activeTab={activeTab}
  onTabPress={setActiveTab}
  backgroundColor="#1a1a1a"
  activeColor="#bb86fc"
  inactiveColor="#666666"
/>
```

### With Safe Area Insets

```tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const insets = useSafeAreaInsets();

<TabBar
  tabs={tabs}
  activeTab={activeTab}
  onTabPress={setActiveTab}
  safeAreaInsets={{ bottom: insets.bottom }}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` | `TabConfig[]` | - | Array of tab configurations (required) |
| `activeTab` | `string` | - | ID of currently active tab (required) |
| `onTabPress` | `(tabId: string) => void` | - | Tab press handler (required) |
| `variant` | `'default' \| 'elevated' \| 'transparent'` | `'default'` | Visual variant |
| `showLabels` | `boolean` | `true` | Whether to show tab labels |
| `backgroundColor` | `string` | Auto | Custom background color |
| `activeColor` | `string` | Auto | Custom active tab color |
| `inactiveColor` | `string` | Auto | Custom inactive tab color |
| `animated` | `boolean` | `true` | Whether to animate tab transitions |
| `animationDuration` | `number` | `200` | Animation duration in milliseconds |
| `safeAreaInsets` | `{ bottom?: number }` | - | Safe area insets for proper spacing |
| `style` | `ViewStyle` | - | Additional custom styles |
| `accessibilityLabel` | `string` | Auto | Accessibility label |
| `testID` | `string` | - | Test identifier |

### TabConfig Interface

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | - | Unique tab identifier (required) |
| `label` | `string` | - | Tab label text (required) |
| `icon` | `keyof typeof Ionicons.glyphMap` | - | Icon name (required) |
| `badge` | `number` | - | Badge number (shows if > 0) |
| `badgeColor` | `string` | Error color | Custom badge background color |
| `disabled` | `boolean` | `false` | Whether the tab is disabled |
| `accessibilityLabel` | `string` | Auto | Accessibility label |
| `accessibilityHint` | `string` | - | Accessibility hint |
| `testID` | `string` | Auto | Test identifier |

## Design Specifications

- **Height**: 64px (with labels) or 56px (icon-only)
- **Active Indicator**: 3px height, positioned at top of tab bar
- **Badge Size**: 16px diameter for tab badges
- **Icon Size**: Medium (20px)
- **Animation**: 200ms duration for smooth transitions
- **Safe Area**: Automatic bottom padding support

## Accessibility

- Uses `tablist` accessibility role for the container
- Each tab uses `tab` accessibility role
- Provides proper selected/unselected states
- Supports disabled state indication
- Auto-generates accessibility labels from tab labels
- Includes badge information in accessibility context

## Examples in Context

### Student Dashboard Navigation

```tsx
const studentTabs = [
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    icon: 'home',
    accessibilityLabel: 'Dashboard',
    accessibilityHint: 'View your dashboard and overview'
  },
  { 
    id: 'assignments', 
    label: 'Assignments', 
    icon: 'document-text', 
    badge: 3,
    accessibilityLabel: 'Assignments',
    accessibilityHint: '3 pending assignments'
  },
  { 
    id: 'grades', 
    label: 'Grades', 
    icon: 'school',
    accessibilityLabel: 'Grades',
    accessibilityHint: 'View your grades and progress'
  },
  { 
    id: 'schedule', 
    label: 'Schedule', 
    icon: 'calendar',
    accessibilityLabel: 'Schedule',
    accessibilityHint: 'View your class schedule'
  },
  { 
    id: 'profile', 
    label: 'Profile', 
    icon: 'person',
    accessibilityLabel: 'Profile',
    accessibilityHint: 'View and edit your profile'
  },
];

<TabBar
  tabs={studentTabs}
  activeTab={activeTab}
  onTabPress={setActiveTab}
  variant="elevated"
/>
```

### Teacher Dashboard Navigation

```tsx
const teacherTabs = [
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    icon: 'home',
    accessibilityLabel: 'Dashboard',
    accessibilityHint: 'View your teaching dashboard'
  },
  { 
    id: 'classes', 
    label: 'Classes', 
    icon: 'people',
    accessibilityLabel: 'Classes',
    accessibilityHint: 'Manage your classes'
  },
  { 
    id: 'assignments', 
    label: 'Assignments', 
    icon: 'document-text', 
    badge: 8,
    accessibilityLabel: 'Assignments',
    accessibilityHint: '8 assignments to review'
  },
  { 
    id: 'reports', 
    label: 'Reports', 
    icon: 'bar-chart',
    accessibilityLabel: 'Reports',
    accessibilityHint: 'View student reports and analytics'
  },
  { 
    id: 'profile', 
    label: 'Profile', 
    icon: 'person',
    accessibilityLabel: 'Profile',
    accessibilityHint: 'View and edit your profile'
  },
];

<TabBar
  tabs={teacherTabs}
  activeTab={activeTab}
  onTabPress={setActiveTab}
  variant="elevated"
/>
```

### Parent Dashboard Navigation

```tsx
const parentTabs = [
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    icon: 'home',
    accessibilityLabel: 'Dashboard',
    accessibilityHint: 'View your child\'s overview'
  },
  { 
    id: 'progress', 
    label: 'Progress', 
    icon: 'trending-up',
    accessibilityLabel: 'Progress',
    accessibilityHint: 'View your child\'s academic progress'
  },
  { 
    id: 'attendance', 
    label: 'Attendance', 
    icon: 'calendar-outline',
    accessibilityLabel: 'Attendance',
    accessibilityHint: 'View attendance records'
  },
  { 
    id: 'messages', 
    label: 'Messages', 
    icon: 'mail', 
    badge: 2,
    accessibilityLabel: 'Messages',
    accessibilityHint: '2 unread messages from teachers'
  },
  { 
    id: 'profile', 
    label: 'Profile', 
    icon: 'person',
    accessibilityLabel: 'Profile',
    accessibilityHint: 'View and edit family profile'
  },
];

<TabBar
  tabs={parentTabs}
  activeTab={activeTab}
  onTabPress={setActiveTab}
  variant="elevated"
/>
```

### Management Dashboard Navigation

```tsx
const managementTabs = [
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    icon: 'home',
    accessibilityLabel: 'Dashboard',
    accessibilityHint: 'View school management dashboard'
  },
  { 
    id: 'students', 
    label: 'Students', 
    icon: 'school',
    accessibilityLabel: 'Students',
    accessibilityHint: 'Manage student records'
  },
  { 
    id: 'teachers', 
    label: 'Teachers', 
    icon: 'people',
    accessibilityLabel: 'Teachers',
    accessibilityHint: 'Manage teaching staff'
  },
  { 
    id: 'incidents', 
    label: 'Incidents', 
    icon: 'warning', 
    badge: 3,
    badgeColor: '#ff9800',
    accessibilityLabel: 'Incidents',
    accessibilityHint: '3 pending incidents to review'
  },
  { 
    id: 'reports', 
    label: 'Reports', 
    icon: 'analytics',
    accessibilityLabel: 'Reports',
    accessibilityHint: 'View school analytics and reports'
  },
];

<TabBar
  tabs={managementTabs}
  activeTab={activeTab}
  onTabPress={setActiveTab}
  variant="elevated"
/>
```

### Compact Navigation (Icon-Only)

```tsx
const compactTabs = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'search', label: 'Search', icon: 'search' },
  { id: 'notifications', label: 'Notifications', icon: 'notifications', badge: 5 },
  { id: 'profile', label: 'Profile', icon: 'person' },
];

<TabBar
  tabs={compactTabs}
  activeTab={activeTab}
  onTabPress={setActiveTab}
  showLabels={false}
  variant="elevated"
/>
```

### Custom Theme Integration

```tsx
// Dark theme example
<TabBar
  tabs={tabs}
  activeTab={activeTab}
  onTabPress={setActiveTab}
  backgroundColor="#1a1a1a"
  activeColor="#bb86fc"
  inactiveColor="#666666"
  variant="elevated"
/>

// Custom brand colors
<TabBar
  tabs={tabs}
  activeTab={activeTab}
  onTabPress={setActiveTab}
  backgroundColor="#e3f2fd"
  activeColor="#1976d2"
  inactiveColor="#90a4ae"
/>
```

### With Disabled Tabs

```tsx
const tabsWithDisabled = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'search', label: 'Search', icon: 'search', disabled: true },
  { id: 'notifications', label: 'Notifications', icon: 'notifications', badge: 5 },
  { id: 'profile', label: 'Profile', icon: 'person' },
];

<TabBar
  tabs={tabsWithDisabled}
  activeTab={activeTab}
  onTabPress={setActiveTab}
/>
```

### Integration with Navigation

```tsx
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();

const handleTabPress = (tabId: string) => {
  setActiveTab(tabId);
  navigation.navigate(tabId);
};

<TabBar
  tabs={tabs}
  activeTab={activeTab}
  onTabPress={handleTabPress}
  variant="elevated"
  safeAreaInsets={{ bottom: insets.bottom }}
/>
```