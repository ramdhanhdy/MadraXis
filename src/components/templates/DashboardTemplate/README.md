# DashboardTemplate Component

A consistent dashboard template that provides a unified structure with header, content area, and optional tab bar for all user roles in the MadraXis school application.

## Features

- **Consistent Layout**: Standardized dashboard structure across all user roles
- **Flexible Header**: Support for titles, subtitles, and action buttons
- **Tab Navigation**: Optional bottom tab bar with badges and active states
- **Background Patterns**: Integrated Islamic geometric background patterns
- **Responsive Design**: Adapts to different screen sizes and orientations
- **Scrollable Content**: Optional scrollable content area with proper spacing
- **Safe Area Support**: Automatic safe area handling for different devices
- **Custom Styling**: Extensive customization options for colors and layout
- **Accessibility**: Full accessibility support with proper roles and labels

## Usage

### Basic Dashboard Template

```tsx
import { DashboardTemplate } from '../../../components/templates/DashboardTemplate';

<DashboardTemplate
  header={{
    title: 'Dashboard',
    rightActions: [
      {
        icon: 'notifications',
        onPress: () => handleNotifications(),
        badge: 5,
      },
    ],
  }}
>
  <YourDashboardContent />
</DashboardTemplate>
```

### With Subtitle and Back Button

```tsx
<DashboardTemplate
  header={{
    title: 'Assignment Details',
    subtitle: 'Mathematics Chapter 5',
    leftAction: {
      icon: 'arrow-back',
      onPress: () => goBack(),
      accessibilityLabel: 'Go back',
    },
    rightActions: [
      {
        icon: 'share',
        onPress: () => shareAssignment(),
      },
    ],
  }}
>
  <AssignmentContent />
</DashboardTemplate>
```

### With Tab Navigation

```tsx
<DashboardTemplate
  header={{
    title: 'Student Portal',
    subtitle: 'Welcome back, Ahmed!',
    rightActions: [
      {
        icon: 'notifications',
        onPress: () => openNotifications(),
        badge: 3,
      },
    ],
  }}
  tabs={[
    { id: 'dashboard', label: 'Dashboard', icon: 'home' },
    { id: 'assignments', label: 'Assignments', icon: 'book', badge: 2 },
    { id: 'grades', label: 'Grades', icon: 'school' },
    { id: 'profile', label: 'Profile', icon: 'person' },
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
>
  <TabContent activeTab={activeTab} />
</DashboardTemplate>
```

### Custom Styling

```tsx
<DashboardTemplate
  header={{
    title: 'Custom Dashboard',
  }}
  backgroundColor="#1a1a1a"
  contentBackgroundColor="rgba(255, 255, 255, 0.05)"
  backgroundPattern={false}
  contentPadding={false}
>
  <CustomContent />
</DashboardTemplate>
```

### Non-Scrollable Layout

```tsx
<DashboardTemplate
  header={{
    title: 'Fixed Layout',
  }}
  scrollable={false}
  safeArea={false}
>
  <FixedLayoutContent />
</DashboardTemplate>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `header` | `HeaderConfig` | - | Header configuration (required) |
| `tabs` | `TabConfig[]` | - | Tab configuration array |
| `activeTab` | `string` | First tab ID | Currently active tab ID |
| `onTabChange` | `(tabId: string) => void` | - | Tab change handler |
| `children` | `React.ReactNode` | - | Dashboard content (required) |
| `backgroundPattern` | `boolean` | `true` | Whether to show background pattern |
| `backgroundColor` | `string` | Theme background | Custom background color |
| `contentBackgroundColor` | `string` | `'transparent'` | Content area background color |
| `scrollable` | `boolean` | `true` | Whether content is scrollable |
| `safeArea` | `boolean` | `true` | Whether to use SafeAreaView |
| `contentPadding` | `boolean` | `true` | Whether to add content padding |
| `style` | `ViewStyle` | - | Additional container styles |
| `headerStyle` | `ViewStyle` | - | Header area styles |
| `contentStyle` | `ViewStyle` | - | Content area styles |
| `tabBarStyle` | `ViewStyle` | - | Tab bar styles |
| `accessibilityLabel` | `string` | `'Dashboard'` | Accessibility label |
| `testID` | `string` | `'dashboard-template'` | Test identifier |

### HeaderConfig Interface

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Header title (required) |
| `subtitle` | `string` | - | Optional subtitle |
| `leftAction` | `LeftAction` | - | Left action button config |
| `rightActions` | `HeaderAction[]` | - | Right action buttons array |

### LeftAction Interface

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `string` | - | Icon name (required) |
| `onPress` | `() => void` | - | Press handler (required) |
| `accessibilityLabel` | `string` | - | Accessibility label |

### HeaderAction Interface

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `string` | - | Icon name (required) |
| `onPress` | `() => void` | - | Press handler (required) |
| `badge` | `number` | - | Badge number (shows if > 0) |
| `accessibilityLabel` | `string` | - | Accessibility label |

### TabConfig Interface

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | - | Unique tab identifier (required) |
| `label` | `string` | - | Tab label (required) |
| `icon` | `string` | - | Tab icon (required) |
| `badge` | `number` | - | Badge number (shows if > 0) |

## Design Specifications

- **Header Height**: Auto with proper padding and safe area
- **Content Padding**: 24px horizontal (theme.spacing.base.lg)
- **Tab Bar Height**: Auto with proper touch targets
- **Background Pattern**: Islamic geometric pattern with 5% opacity
- **Safe Area**: Automatic handling for different device types
- **Scroll Behavior**: Smooth scrolling with proper content insets

## Accessibility

- Uses proper accessibility roles for all interactive elements
- Provides meaningful accessibility labels for screen readers
- Supports custom accessibility labels for all actions
- Includes proper focus management and navigation
- Badge information is announced to screen readers

## Examples in Context

### Student Dashboard

```tsx
const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  return (
    <DashboardTemplate
      header={{
        title: 'Student Portal',
        subtitle: 'Welcome back, Ahmed!',
        rightActions: [
          {
            icon: 'notifications',
            onPress: () => openNotifications(),
            badge: 4,
            accessibilityLabel: '4 new notifications',
          },
          {
            icon: 'person',
            onPress: () => openProfile(),
            accessibilityLabel: 'View profile',
          },
        ],
      }}
      tabs={[
        { id: 'dashboard', label: 'Dashboard', icon: 'home' },
        { id: 'assignments', label: 'Assignments', icon: 'book', badge: 2 },
        { id: 'grades', label: 'Grades', icon: 'school' },
        { id: 'schedule', label: 'Schedule', icon: 'calendar' },
      ]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <StudentDashboardContent activeTab={activeTab} />
    </DashboardTemplate>
  );
};
```

### Teacher Dashboard

```tsx
const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  return (
    <DashboardTemplate
      header={{
        title: 'Teacher Portal',
        subtitle: 'Ms. Sarah Johnson',
        rightActions: [
          {
            icon: 'notifications',
            onPress: () => openNotifications(),
            badge: 8,
            accessibilityLabel: '8 new notifications',
          },
          {
            icon: 'add',
            onPress: () => createNew(),
            accessibilityLabel: 'Create new content',
          },
        ],
      }}
      tabs={[
        { id: 'dashboard', label: 'Dashboard', icon: 'home' },
        { id: 'classes', label: 'Classes', icon: 'school' },
        { id: 'assignments', label: 'Assignments', icon: 'book', badge: 5 },
        { id: 'grades', label: 'Grades', icon: 'assessment' },
      ]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <TeacherDashboardContent activeTab={activeTab} />
    </DashboardTemplate>
  );
};
```

### Parent Dashboard

```tsx
const ParentDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  return (
    <DashboardTemplate
      header={{
        title: 'Parent Portal',
        subtitle: 'Ahmed Al-Rashid',
        rightActions: [
          {
            icon: 'notifications',
            onPress: () => openNotifications(),
            badge: 2,
            accessibilityLabel: '2 new notifications',
          },
          {
            icon: 'phone',
            onPress: () => emergencyContact(),
            accessibilityLabel: 'Emergency contact',
          },
        ],
      }}
      tabs={[
        { id: 'dashboard', label: 'Dashboard', icon: 'home' },
        { id: 'progress', label: 'Progress', icon: 'trending-up' },
        { id: 'attendance', label: 'Attendance', icon: 'calendar' },
        { id: 'messages', label: 'Messages', icon: 'mail', badge: 1 },
      ]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <ParentDashboardContent activeTab={activeTab} />
    </DashboardTemplate>
  );
};
```

### Management Dashboard

```tsx
const ManagementDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  return (
    <DashboardTemplate
      header={{
        title: 'Management Portal',
        subtitle: 'School Administration',
        rightActions: [
          {
            icon: 'notifications',
            onPress: () => openNotifications(),
            badge: 12,
            accessibilityLabel: '12 new notifications',
          },
          {
            icon: 'analytics',
            onPress: () => viewAnalytics(),
            accessibilityLabel: 'View analytics',
          },
        ],
      }}
      tabs={[
        { id: 'dashboard', label: 'Dashboard', icon: 'home' },
        { id: 'students', label: 'Students', icon: 'people' },
        { id: 'teachers', label: 'Teachers', icon: 'school' },
        { id: 'reports', label: 'Reports', icon: 'assessment', badge: 3 },
      ]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <ManagementDashboardContent activeTab={activeTab} />
    </DashboardTemplate>
  );
};
```

### Detail View (No Tabs)

```tsx
const AssignmentDetail = () => {
  return (
    <DashboardTemplate
      header={{
        title: 'Assignment Details',
        subtitle: 'Mathematics Chapter 5 Exercises',
        leftAction: {
          icon: 'arrow-back',
          onPress: () => goBack(),
          accessibilityLabel: 'Go back to assignments',
        },
        rightActions: [
          {
            icon: 'share',
            onPress: () => shareAssignment(),
            accessibilityLabel: 'Share assignment',
          },
          {
            icon: 'bookmark',
            onPress: () => bookmarkAssignment(),
            accessibilityLabel: 'Bookmark assignment',
          },
        ],
      }}
    >
      <AssignmentDetailContent />
    </DashboardTemplate>
  );
};
```

### Custom Theme Example

```tsx
const DarkThemeDashboard = () => {
  return (
    <DashboardTemplate
      header={{
        title: 'Dark Dashboard',
        rightActions: [
          {
            icon: 'brightness-6',
            onPress: () => toggleTheme(),
            accessibilityLabel: 'Toggle theme',
          },
        ],
      }}
      backgroundColor="#121212"
      contentBackgroundColor="rgba(255, 255, 255, 0.05)"
      backgroundPattern={true}
    >
      <DarkThemedContent />
    </DashboardTemplate>
  );
};
```

### Full-Width Content Example

```tsx
const ListViewDashboard = () => {
  return (
    <DashboardTemplate
      header={{
        title: 'Student List',
        rightActions: [
          {
            icon: 'add',
            onPress: () => addStudent(),
            accessibilityLabel: 'Add new student',
          },
        ],
      }}
      contentPadding={false}
      backgroundPattern={false}
    >
      <StudentListView />
    </DashboardTemplate>
  );
};
```

### State Management Integration

```tsx
const ConnectedDashboard = () => {
  const { user, notifications } = useAppState();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const handleNotifications = () => {
    // Handle notifications
  };
  
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Track analytics, update state, etc.
  };
  
  return (
    <DashboardTemplate
      header={{
        title: `${user.role} Portal`,
        subtitle: `Welcome back, ${user.name}!`,
        rightActions: [
          {
            icon: 'notifications',
            onPress: handleNotifications,
            badge: notifications.unreadCount,
            accessibilityLabel: `${notifications.unreadCount} new notifications`,
          },
        ],
      }}
      tabs={getTabsForRole(user.role)}
      activeTab={activeTab}
      onTabChange={handleTabChange}
    >
      <RoleBasedContent role={user.role} activeTab={activeTab} />
    </DashboardTemplate>
  );
};
```

## Performance Considerations

- **Lazy Loading**: Consider lazy loading tab content for better performance
- **Memoization**: Use React.memo for content components that don't change frequently
- **Image Optimization**: Background patterns are SVG-based for optimal performance
- **Scroll Performance**: Uses optimized ScrollView with proper content sizing
- **Memory Management**: Properly handles component unmounting and cleanup

## Migration Guide

### From Existing Dashboards

1. **Wrap existing content** in DashboardTemplate
2. **Move header logic** to header prop configuration
3. **Convert tab navigation** to tabs prop
4. **Update styling** to use template's built-in options
5. **Test accessibility** with screen readers
6. **Verify responsive behavior** on different screen sizes

### Breaking Changes

- Header structure is now controlled by the template
- Tab navigation is handled internally
- Background patterns are integrated into the template
- Safe area handling is automatic

This template provides a consistent foundation for all dashboard screens while maintaining the flexibility needed for role-specific functionality.