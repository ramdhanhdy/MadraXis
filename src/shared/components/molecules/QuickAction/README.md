# QuickAction Component

A consistent dashboard action button component that provides uniform grid layout and visual hierarchy for quick actions across all user roles.

## Features

- **Consistent Grid Layout**: Standardized sizing and spacing for dashboard grids
- **Visual Hierarchy**: Clear icon, title, and subtitle organization
- **Badge Support**: Notification badges with automatic overflow handling
- **Multiple Variants**: Default, primary, and secondary styling options
- **Flexible Layout**: Vertical (default) and horizontal layout options
- **Size Options**: Small, medium, and large sizes for different contexts
- **Accessibility**: Full accessibility support with proper roles and labels

## Usage

### Basic QuickAction

```tsx
import { QuickAction } from '../../../components/molecules/QuickAction';

<QuickAction
  title="View Schedule"
  icon="calendar"
  onPress={() => navigateToSchedule()}
/>
```

### QuickAction with Subtitle

```tsx
<QuickAction
  title="Assignments"
  subtitle="3 pending"
  icon="document-text"
  onPress={() => viewAssignments()}
/>
```

### QuickAction with Badge

```tsx
<QuickAction
  title="Messages"
  subtitle="New messages"
  icon="mail"
  badge={5}
  onPress={() => viewMessages()}
/>
```

### Different Variants

```tsx
// Default variant
<QuickAction
  title="Default Action"
  icon="home"
  variant="default"
  onPress={() => {}}
/>

// Primary variant
<QuickAction
  title="Primary Action"
  icon="star"
  variant="primary"
  onPress={() => {}}
/>

// Secondary variant
<QuickAction
  title="Secondary Action"
  icon="heart"
  variant="secondary"
  onPress={() => {}}
/>
```

### Different Sizes

```tsx
// Small size
<QuickAction
  title="Small"
  icon="home"
  size="small"
  onPress={() => {}}
/>

// Medium size (default)
<QuickAction
  title="Medium"
  icon="home"
  size="medium"
  onPress={() => {}}
/>

// Large size
<QuickAction
  title="Large"
  icon="home"
  size="large"
  onPress={() => {}}
/>
```

### Layout Options

```tsx
// Vertical layout (default)
<QuickAction
  title="Vertical Layout"
  subtitle="Icon above text"
  icon="home"
  layout="vertical"
  onPress={() => {}}
/>

// Horizontal layout
<QuickAction
  title="Horizontal Layout"
  subtitle="Icon beside text"
  icon="home"
  layout="horizontal"
  onPress={() => {}}
/>
```

### Custom Colors

```tsx
<QuickAction
  title="Custom Colors"
  subtitle="Custom styling"
  icon="star"
  iconColor="#9c27b0"
  badgeColor="#ff5722"
  badge={3}
  onPress={() => {}}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Action title (required) |
| `subtitle` | `string` | - | Optional subtitle text |
| `icon` | `keyof typeof Ionicons.glyphMap` | - | Icon name (required) |
| `iconColor` | `string` | Auto | Custom icon color |
| `badge` | `number` | - | Badge number (shows if > 0) |
| `badgeColor` | `string` | Error color | Custom badge background color |
| `variant` | `'default' \| 'primary' \| 'secondary'` | `'default'` | Visual variant |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Component size |
| `layout` | `'vertical' \| 'horizontal'` | `'vertical'` | Icon and text layout |
| `onPress` | `() => void` | - | Press handler (required) |
| `disabled` | `boolean` | `false` | Whether the action is disabled |
| `style` | `ViewStyle` | - | Additional custom styles |
| `accessibilityLabel` | `string` | Auto | Accessibility label |
| `accessibilityHint` | `string` | - | Accessibility hint |
| `testID` | `string` | - | Test identifier |

## Design Specifications

- **Border Radius**: 12px (theme.borderRadius.lg)
- **Shadow**: Card shadow for elevation
- **Sizes**:
  - Small: 80px min height, small padding
  - Medium: 100px min height, medium padding
  - Large: 120px min height, large padding
- **Badge**: 20px diameter, positioned top-right
- **Icon Sizes**: Medium (small), Large (medium), XL (large)
- **Layout**: Flexible vertical/horizontal arrangements

## Accessibility

- Uses `button` accessibility role
- Auto-generates comprehensive accessibility labels
- Includes badge count in accessibility information
- Supports custom accessibility labels and hints
- Properly handles disabled states

## Examples in Context

### Student Dashboard Quick Actions

```tsx
<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
  <QuickAction
    title="Schedule"
    subtitle="Today's classes"
    icon="calendar"
    onPress={() => navigateToSchedule()}
    style={{ flex: 1, minWidth: 150 }}
  />
  
  <QuickAction
    title="Assignments"
    subtitle="3 pending"
    icon="document-text"
    badge={3}
    onPress={() => viewAssignments()}
    style={{ flex: 1, minWidth: 150 }}
  />
  
  <QuickAction
    title="Grades"
    subtitle="View progress"
    icon="school"
    onPress={() => viewGrades()}
    style={{ flex: 1, minWidth: 150 }}
  />
  
  <QuickAction
    title="Messages"
    subtitle="New messages"
    icon="mail"
    badge={2}
    onPress={() => viewMessages()}
    style={{ flex: 1, minWidth: 150 }}
  />
</View>
```

### Teacher Dashboard Quick Actions

```tsx
<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
  <QuickAction
    title="Classes"
    subtitle="Manage classes"
    icon="people"
    onPress={() => manageClasses()}
    variant="primary"
    style={{ flex: 1, minWidth: 150 }}
  />
  
  <QuickAction
    title="Attendance"
    subtitle="Mark attendance"
    icon="checkmark-circle"
    onPress={() => markAttendance()}
    style={{ flex: 1, minWidth: 150 }}
  />
  
  <QuickAction
    title="Assignments"
    subtitle="Create & grade"
    icon="document-text"
    badge={5}
    onPress={() => manageAssignments()}
    style={{ flex: 1, minWidth: 150 }}
  />
  
  <QuickAction
    title="Reports"
    subtitle="Student reports"
    icon="bar-chart"
    onPress={() => viewReports()}
    style={{ flex: 1, minWidth: 150 }}
  />
</View>
```

### Parent Dashboard Quick Actions

```tsx
<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
  <QuickAction
    title="Child Progress"
    subtitle="Ahmed's grades"
    icon="trending-up"
    onPress={() => viewProgress()}
    variant="secondary"
    style={{ flex: 1, minWidth: 150 }}
  />
  
  <QuickAction
    title="Attendance"
    subtitle="95% this month"
    icon="calendar-check"
    onPress={() => viewAttendance()}
    style={{ flex: 1, minWidth: 150 }}
  />
  
  <QuickAction
    title="Messages"
    subtitle="From teachers"
    icon="mail"
    badge={1}
    onPress={() => viewMessages()}
    style={{ flex: 1, minWidth: 150 }}
  />
  
  <QuickAction
    title="Payments"
    subtitle="Fee status"
    icon="card"
    onPress={() => viewPayments()}
    style={{ flex: 1, minWidth: 150 }}
  />
</View>
```

### Horizontal Layout Example

```tsx
<View style={{ gap: 12 }}>
  <QuickAction
    title="Quick Message"
    subtitle="Send to teacher"
    icon="send"
    layout="horizontal"
    size="small"
    onPress={() => sendMessage()}
  />
  
  <QuickAction
    title="Emergency Contact"
    subtitle="Call school office"
    icon="call"
    layout="horizontal"
    size="small"
    variant="primary"
    onPress={() => callSchool()}
  />
  
  <QuickAction
    title="Report Issue"
    subtitle="Safety concern"
    icon="warning"
    layout="horizontal"
    size="small"
    variant="secondary"
    onPress={() => reportIssue()}
  />
</View>
```

### Grid Layout with Different Sizes

```tsx
<View style={{ flexDirection: 'row', gap: 16 }}>
  {/* Large primary action */}
  <QuickAction
    title="Main Action"
    subtitle="Most important"
    icon="star"
    size="large"
    variant="primary"
    onPress={() => mainAction()}
    style={{ flex: 2 }}
  />
  
  {/* Smaller secondary actions */}
  <View style={{ flex: 1, gap: 16 }}>
    <QuickAction
      title="Secondary"
      icon="home"
      size="small"
      onPress={() => secondaryAction()}
    />
    
    <QuickAction
      title="Another"
      icon="settings"
      size="small"
      badge={2}
      onPress={() => anotherAction()}
    />
  </View>
</View>
```