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
import { Avatar } from '@/components/atoms/Avatar';

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
| `source` | `ImageSourcePropType` | - | Image source (local or remote) |
| `name` | `string` | - | User name for generating initials |
| `initials` | `string` | - | Custom initials (overrides name-based generation) |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| number` | `'md'` | Avatar size |
| `shape` | `'circle' \| 'square' \| 'rounded'` | `'circle'` | Avatar shape |
| `onPress` | `() => void` | - | Press handler (makes avatar interactive) |
| `disabled` | `boolean` | `false` | Disabled state |
| `backgroundColor` | `string` | Auto | Custom background color |
| `textColor` | `string` | Auto | Custom text color for initials |
| `borderColor` | `string` | - | Border color |
| `borderWidth` | `number` | `0` | Border width |
| `showStatus` | `boolean` | `false` | Show status indicator |
| `status` | `'online' \| 'offline' \| 'away' \| 'busy'` | `'offline'` | Status type |
| `statusColor` | `string` | Auto | Custom status indicator color |
| `containerStyle` | `ViewStyle` | - | Custom container styling |
| `imageStyle` | `ImageStyle` | - | Custom image styling |
| `textStyle` | `TextStyle` | - | Custom text styling |
| `accessibilityLabel` | `string` | Auto | Accessibility label |
| `accessibilityHint` | `string` | - | Accessibility hint |
| `testID` | `string` | - | Test identifier |

### Size Scale

- `xs` - 24px
- `sm` - 32px
- `md` - 40px (default)
- `lg` - 48px
- `xl` - 64px
- `2xl` - 80px

### Status Colors

- `online` - Success color (green)
- `offline` - Disabled color (gray)
- `away` - Warning color (orange)
- `busy` - Error color (red)

## Initials Generation

The component automatically generates initials from names:

- **Single name**: "John" → "J"
- **Two names**: "John Doe" → "JD"
- **Multiple names**: "John Michael Doe" → "JD" (first and last)
- **Special characters**: "José María" → "JM"
- **Custom initials**: Override with `initials` prop
- **Fallback**: "?" when no name or initials provided

## Accessibility

The Avatar component provides comprehensive accessibility support:

- **Role**: Automatically set to `image` for display, `button` for interactive avatars
- **Labels**: Auto-generated from name or custom via `accessibilityLabel`
- **Hints**: Use `accessibilityHint` to describe press actions
- **States**: Disabled state properly communicated to screen readers

### Best Practices

```tsx
// Display avatar
<Avatar 
  name="John Doe" 
  accessibilityLabel="John Doe's profile picture"
/>

// Interactive avatar
<Avatar 
  name="Jane Smith" 
  onPress={() => viewProfile()} 
  accessibilityLabel="Jane Smith's profile"
  accessibilityHint="Tap to view profile details"
/>

// Status avatar
<Avatar 
  name="Bob Johnson" 
  showStatus 
  status="online"
  accessibilityLabel="Bob Johnson is online"
/>
```

## Examples

### User List

```tsx
const users = [
  { name: "Alice Johnson", status: "online" },
  { name: "Bob Smith", status: "away" },
  { name: "Carol Davis", status: "busy" },
];

{users.map(user => (
  <Avatar
    key={user.name}
    name={user.name}
    showStatus
    status={user.status}
    onPress={() => viewProfile(user)}
  />
))}
```

### Profile Header

```tsx
<Avatar
  source={{ uri: user.profileImage }}
  name={user.fullName}
  size="2xl"
  shape="circle"
  borderWidth={3}
  borderColor="#ffffff"
  onPress={() => editProfile()}
  accessibilityLabel={`${user.fullName}'s profile picture`}
  accessibilityHint="Tap to edit profile"
/>
```

### Team Members

```tsx
<Avatar
  name="Teacher Name"
  backgroundColor="#2196f3"
  textColor="#ffffff"
  showStatus
  status="online"
  size="lg"
/>

<Avatar
  name="Student Name"
  backgroundColor="#4caf50"
  textColor="#ffffff"
  size="md"
/>
```

### Chat Interface

```tsx
<Avatar
  source={{ uri: message.sender.avatar }}
  name={message.sender.name}
  size="sm"
  shape="circle"
  onPress={() => viewSenderProfile()}
/>
```

### Fallback Handling

```tsx
// Image with fallback to initials
<Avatar
  source={{ uri: user.profileImage }}
  name={user.fullName}
  // Automatically falls back to initials if image fails
/>

// Multiple fallback levels
<Avatar
  source={{ uri: user.profileImage }}
  name={user.fullName}
  initials={user.customInitials}
  // Falls back: image → custom initials → name initials → "?"
/>
```

## Testing

The component includes comprehensive test coverage:

- Rendering with different props
- Size, shape, and color variations
- Initials generation logic
- Image loading and error handling
- Interactive behavior
- Status indicators
- Accessibility features
- Custom styling
- Edge cases and fallback scenarios

Run tests with:
```bash
npm test Avatar.test.tsx
```

## Storybook

View all Avatar variants and interactions in Storybook:
```bash
npm run storybook
```

Navigate to `Atoms > Avatar` to see all available stories and documentation.

## Performance Considerations

- Images are loaded asynchronously with error handling
- Initials are generated once and cached
- Status indicators are rendered only when needed
- Consistent color generation based on name/initials for visual consistency
- Optimized re-renders through proper prop handling