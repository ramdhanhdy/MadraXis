# ListItem Component

A consistent list item component that provides uniform layout, spacing, and interactions for displaying information in lists across all user roles.

## Features

- **Consistent Layout**: Standard 56px minimum height with proper touch targets
- **Flexible Content**: Support for title, subtitle, and custom components
- **Icon Support**: Left and right icons with consistent sizing and colors
- **Custom Components**: Alternative to icons for complex content
- **Divider Support**: Optional dividers with proper alignment
- **Interactive Support**: Optional press handling with accessibility
- **Accessibility**: Full accessibility support with proper roles and labels

## Usage

### Basic ListItem

```tsx
import { ListItem } from '../../../components/molecules/ListItem';

<ListItem
  title="Basic List Item"
  subtitle="This is a subtitle"
/>
```

### Interactive ListItem

```tsx
<ListItem
  title="Clickable Item"
  subtitle="Tap to interact"
  onPress={() => console.log('Item pressed')}
/>
```

### ListItem with Icons

```tsx
// Left icon
<ListItem
  title="Settings"
  subtitle="App preferences"
  leftIcon="settings"
  onPress={() => navigateToSettings()}
/>

// Right icon (typically chevron)
<ListItem
  title="Profile"
  subtitle="View your profile"
  leftIcon="person"
  rightIcon="chevron-forward"
  onPress={() => navigateToProfile()}
/>

// Both icons
<ListItem
  title="Notifications"
  subtitle="Manage notifications"
  leftIcon="notifications"
  rightIcon="chevron-forward"
  onPress={() => navigateToNotifications()}
/>
```

### ListItem with Custom Components

```tsx
import { Avatar } from '../../../components/atoms/Avatar';
import { Button } from '../../../components/atoms/Button';

// Custom left component
<ListItem
  title="John Doe"
  subtitle="Student - Grade 10A"
  leftComponent={
    <Avatar
      name="John Doe"
      size="sm"
      source={{ uri: 'https://example.com/avatar.jpg' }}
    />
  }
  rightComponent={
    <Button variant="outline" size="small">
      Contact
    </Button>
  }
/>
```

### ListItem with Dividers

```tsx
// Multiple items with dividers
<View>
  <ListItem
    title="First Item"
    subtitle="First description"
    showDivider
  />
  <ListItem
    title="Second Item"
    subtitle="Second description"
    showDivider
  />
  <ListItem
    title="Third Item"
    subtitle="Third description"
  />
</View>
```

### Disabled ListItem

```tsx
<ListItem
  title="Disabled Item"
  subtitle="This item is disabled"
  leftIcon="lock"
  disabled
  onPress={() => {}}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Main title text (required) |
| `subtitle` | `string` | - | Optional subtitle text |
| `leftIcon` | `keyof typeof Ionicons.glyphMap` | - | Optional left icon |
| `rightIcon` | `keyof typeof Ionicons.glyphMap` | - | Optional right icon |
| `leftComponent` | `React.ReactNode` | - | Custom left component (overrides leftIcon) |
| `rightComponent` | `React.ReactNode` | - | Custom right component (overrides rightIcon) |
| `showDivider` | `boolean` | `false` | Whether to show bottom divider |
| `onPress` | `() => void` | - | Optional press handler (makes item interactive) |
| `disabled` | `boolean` | `false` | Whether the item is disabled |
| `style` | `ViewStyle` | - | Additional custom styles |
| `titleStyle` | `ViewStyle` | - | Custom styles for title text |
| `subtitleStyle` | `ViewStyle` | - | Custom styles for subtitle text |
| `accessibilityLabel` | `string` | Auto | Accessibility label (auto-generated from title/subtitle) |
| `accessibilityHint` | `string` | - | Accessibility hint |
| `accessibilityRole` | `'button' \| 'none'` | Auto | Accessibility role (auto-determined) |
| `testID` | `string` | - | Test identifier |

## Design Specifications

- **Minimum Height**: 56px for proper touch targets
- **Horizontal Padding**: 16px (theme.spacing.base.md)
- **Vertical Padding**: 8px (theme.spacing.base.sm)
- **Icon Size**: Medium (20px)
- **Icon Spacing**: 8px from content
- **Divider**: 1px height, aligned with content
- **Typography**: 
  - Title: Body1 variant
  - Subtitle: Body2 variant with 2px top margin

## Accessibility

- Automatically combines title and subtitle for screen readers
- Sets appropriate accessibility roles based on interactivity
- Supports custom accessibility labels and hints
- Properly handles disabled states
- Maintains minimum touch target size when interactive

## Examples in Context

### Navigation Menu

```tsx
<Card padding="none">
  <ListItem
    title="Dashboard"
    leftIcon="home"
    rightIcon="chevron-forward"
    onPress={() => navigate('Dashboard')}
    showDivider
  />
  <ListItem
    title="Profile"
    leftIcon="person"
    rightIcon="chevron-forward"
    onPress={() => navigate('Profile')}
    showDivider
  />
  <ListItem
    title="Settings"
    leftIcon="settings"
    rightIcon="chevron-forward"
    onPress={() => navigate('Settings')}
  />
</Card>
```

### Student List

```tsx
<Card padding="none">
  {students.map((student, index) => (
    <ListItem
      key={student.id}
      title={student.name}
      subtitle={`Grade ${student.grade} - ${student.class}`}
      leftComponent={
        <Avatar
          name={student.name}
          source={student.avatar}
          size="sm"
        />
      }
      rightComponent={
        <Typography variant="caption" color="success">
          Present
        </Typography>
      }
      onPress={() => viewStudent(student.id)}
      showDivider={index < students.length - 1}
    />
  ))}
</Card>
```

### Activity Feed

```tsx
<Card padding="none">
  {activities.map((activity, index) => (
    <ListItem
      key={activity.id}
      title={activity.title}
      subtitle={activity.description}
      leftIcon={activity.icon}
      rightComponent={
        <Typography variant="caption" color="secondary">
          {activity.time}
        </Typography>
      }
      onPress={() => viewActivity(activity.id)}
      showDivider={index < activities.length - 1}
    />
  ))}
</Card>
```

### Settings List

```tsx
<Card padding="none">
  <ListItem
    title="Notifications"
    subtitle="Manage notification preferences"
    leftIcon="notifications"
    rightComponent={
      <Switch
        value={notificationsEnabled}
        onValueChange={setNotificationsEnabled}
      />
    }
    showDivider
  />
  <ListItem
    title="Privacy"
    subtitle="Privacy and security settings"
    leftIcon="shield"
    rightIcon="chevron-forward"
    onPress={() => navigate('Privacy')}
    showDivider
  />
  <ListItem
    title="About"
    subtitle="App version and information"
    leftIcon="information-circle"
    rightIcon="chevron-forward"
    onPress={() => navigate('About')}
  />
</Card>
```