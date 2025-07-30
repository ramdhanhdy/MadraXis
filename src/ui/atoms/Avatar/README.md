# Avatar Component

A user profile component that displays images, initials, or fallback content with consistent sizing, shapes, and status indicators.

## Features

- **Multiple Display Modes**: Images, initials, or fallback content
- **Flexible Sizing**: Predefined size scales (xs, sm, md, lg, xl, 2xl) or custom numeric values
- **Shape Variants**: Circle, square, or rounded rectangle shapes
- **Status Indicators**: Online, offline, away, and busy status with customizable colors
- **Fallback Handling**: Graceful fallback from images to initials to default content
- **Interactive Support**: Optional press handling for profile navigation
- **Accessibility**: Built-in accessibility support with proper labels and roles
- **Customizable Styling**: Colors, borders, and custom styles

## Usage

### Basic Avatar

```tsx
import { Avatar } from '@ui/atoms/Avatar';

// With name (shows initials)
<Avatar name="John Doe" />

// With image
<Avatar source={{ uri: 'https://example.com/avatar.jpg' }} name="John Doe" />

// Custom initials
<Avatar initials="AB" />
```

### Different Sizes and Shapes

```tsx
// Different sizes
<Avatar name="John Doe" size="xs" />
<Avatar name="John Doe" size="lg" />
<Avatar name="John Doe" size="2xl" />

// Different shapes
<Avatar name="John Doe" shape="circle" />
<Avatar name="John Doe" shape="square" />
<Avatar name="John Doe" shape="rounded" />
```

### With Status Indicators

```tsx
// Online status
<Avatar 
  name="John Doe" 
  showStatus 
  status="online" 
/>

// Custom status color
<Avatar 
  name="Jane Smith" 
  showStatus 
  status="busy" 
  statusColor="#ff4444"
/>
```

### Interactive Avatar

```tsx
<Avatar 
  name="John Doe" 
  onPress={() => navigateToProfile()} 
  accessibilityLabel="John Doe's profile"
  accessibilityHint="Tap to view profile details"
/>
```

### Custom Styling

```tsx
// Custom colors
<Avatar 
  name="John Doe" 
  backgroundColor="#e3f2fd" 
  textColor="#1976d2"
/>

// With border
<Avatar 
  name="Jane Smith" 
  borderWidth={2} 
  borderColor="#4caf50"
/>

// Custom styling
<Avatar 
  name="Bob Johnson" 
  containerStyle={{ margin: 8 }}
  textStyle={{ fontWeight: 'bold' }}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `source` | `{ uri: string } \| number` | - | Image source for avatar |
| `name` | `string` | - | User name for generating initials |
| `initials` | `string` | - | Custom initials (overrides name-based generation) |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| number` | `'md'` | Avatar size |
| `shape` | `'circle' \| 'square' \| 'rounded'` | `'circle'` | Avatar shape |
| `onPress` | `() => void` | - | Press handler for interactive avatars |
| `disabled` | `boolean` | `false` | Disabled state for interactive avatars |
| `backgroundColor` | `string` | - | Custom background color |
| `textColor` | `string` | - | Custom text color for initials |
| `borderColor` | `string` | - | Border color |
| `borderWidth` | `number` | `0` | Border width |
| `containerStyle` | `ViewStyle` | - | Custom container styles |
| `imageStyle` | `ImageStyle` | - | Custom image styles |
| `textStyle` | `TextStyle` | - | Custom text styles |
| `showStatus` | `boolean` | `false` | Show status indicator |
| `status` | `'online' \| 'offline' \| 'away' \| 'busy'` | `'offline'` | Status type |
| `statusColor` | `string` | - | Custom status indicator color |
| `accessibilityLabel` | `string` | - | Custom accessibility label |
| `accessibilityHint` | `string` | - | Custom accessibility hint |
| `testID` | `string` | - | Test identifier |

## Size Reference

| Size | Pixels | Use Case |
|------|--------|----------|
| `xs` | 24px | Small lists, compact UI |
| `sm` | 32px | Navigation, toolbars |
| `md` | 40px | Default size, most use cases |
| `lg` | 48px | Profile cards, prominent display |
| `xl` | 64px | Large profile sections |
| `2xl` | 80px | Profile headers, hero sections |

## Status Colors

| Status | Default Color | Meaning |
|--------|---------------|---------|
| `online` | Green | User is active |
| `offline` | Gray | User is not available |
| `away` | Yellow/Orange | User is temporarily away |
| `busy` | Red | User is busy/do not disturb |

## Accessibility

The Avatar component includes comprehensive accessibility support:

- **Proper Roles**: `image` for display-only, `button` for interactive
- **Automatic Labels**: Generated from name or custom labels
- **State Communication**: Disabled state communicated to screen readers
- **Touch Targets**: Adequate touch target size for interactive avatars

## Examples

### User List Item
```tsx
<Avatar 
  source={{ uri: user.avatarUrl }}
  name={user.fullName}
  size="md"
  showStatus
  status={user.onlineStatus}
  onPress={() => viewProfile(user.id)}
  accessibilityLabel={`${user.fullName}'s profile`}
/>
```

### Profile Header
```tsx
<Avatar 
  source={{ uri: currentUser.avatarUrl }}
  name={currentUser.fullName}
  size="2xl"
  shape="circle"
  borderWidth={3}
  borderColor="#4caf50"
  onPress={() => editProfile()}
/>
```

### Team Member Grid
```tsx
{teamMembers.map(member => (
  <Avatar 
    key={member.id}
    source={{ uri: member.avatarUrl }}
    name={member.name}
    size="lg"
    showStatus
    status={member.status}
    onPress={() => viewMember(member.id)}
  />
))}
```

### Compact Navigation
```tsx
<Avatar 
  source={{ uri: user.avatarUrl }}
  name={user.name}
  size="sm"
  shape="circle"
  onPress={() => openUserMenu()}
/>
```

## Design System Integration

The Avatar component automatically uses design system tokens:

- **Colors**: Consistent color palette for backgrounds and status
- **Typography**: Font weights and sizes from typography scale
- **Spacing**: Consistent spacing for status indicators and borders
- **Border Radius**: Theme-consistent border radius values

## Testing

The component includes comprehensive tests covering:

- All size and shape variations
- Image loading and fallback behavior
- Status indicator functionality
- Interactive behavior and accessibility
- Custom styling and props

Run tests with:
```bash
npm test Avatar.test.tsx
```

## Browser Support

- ✅ iOS Safari
- ✅ Android Chrome  
- ✅ React Native
- ✅ Expo
