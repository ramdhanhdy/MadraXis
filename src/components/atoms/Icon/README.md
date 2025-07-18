# Icon Component

A consistent icon wrapper component that provides standardized sizing, colors, and accessibility features for Ionicons throughout the application.

## Features

- **Consistent Sizing**: Predefined size scales (xs, sm, md, lg, xl, 2xl) or custom numeric values
- **Theme Integration**: Semantic color mapping with theme-aware styling
- **Interactive Support**: Optional press handling with proper touch targets
- **Background Options**: Optional circular background with customizable colors
- **Accessibility**: Built-in accessibility support with proper roles and labels
- **Disabled States**: Visual feedback for disabled interactions

## Usage

### Basic Icon

```tsx
import { Icon } from '@/components/atoms/Icon';

// Simple icon
<Icon name="home" />

// With size and color
<Icon name="settings" size="lg" color="primary" />
```

### Interactive Icon

```tsx
// Pressable icon
<Icon 
  name="heart" 
  onPress={() => handleLike()} 
  accessibilityLabel="Like this item"
/>

// With background
<Icon 
  name="add" 
  background 
  onPress={() => handleAdd()} 
  accessibilityLabel="Add new item"
/>
```

### Custom Styling

```tsx
// Custom colors
<Icon name="star" color="#ffd700" />

// Custom background
<Icon 
  name="settings" 
  background 
  backgroundColor="#e3f2fd" 
  color="primary"
/>

// Custom container styling
<Icon 
  name="close" 
  containerStyle={{ margin: 8 }} 
  onPress={() => handleClose()}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `keyof typeof Ionicons.glyphMap` | - | **Required.** Ionicon name to display |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| number` | `'md'` | Icon size |
| `color` | `string \| SemanticColor` | `'primary'` | Icon color (theme color or custom) |
| `onPress` | `() => void` | - | Press handler (makes icon interactive) |
| `disabled` | `boolean` | `false` | Disabled state |
| `background` | `boolean` | `false` | Show circular background |
| `backgroundColor` | `string` | - | Custom background color |
| `containerStyle` | `ViewStyle` | - | Custom container styling |
| `accessibilityLabel` | `string` | - | Accessibility label |
| `accessibilityHint` | `string` | - | Accessibility hint |
| `accessibilityRole` | `'button' \| 'image' \| 'none'` | Auto | Accessibility role |
| `testID` | `string` | - | Test identifier |

### Semantic Colors

- `primary` - Primary theme color
- `secondary` - Secondary theme color  
- `tertiary` - Tertiary theme color
- `disabled` - Disabled text color
- `inverse` - Inverse text color
- `success` - Success color
- `warning` - Warning color
- `error` - Error color

### Size Scale

- `xs` - 12px
- `sm` - 16px
- `md` - 20px (default)
- `lg` - 24px
- `xl` - 32px
- `2xl` - 40px

## Accessibility

The Icon component automatically handles accessibility:

- **Role**: Automatically set to `image` for decorative icons, `button` for interactive icons
- **Labels**: Use `accessibilityLabel` to describe the icon's purpose
- **Hints**: Use `accessibilityHint` to describe the action that will be performed
- **Touch Targets**: Interactive icons have minimum 44px touch targets
- **States**: Disabled state is properly communicated to screen readers

### Best Practices

```tsx
// Decorative icon
<Icon name="star" accessibilityRole="none" />

// Interactive icon
<Icon 
  name="settings" 
  onPress={() => openSettings()} 
  accessibilityLabel="Settings"
  accessibilityHint="Opens the settings menu"
/>

// Status icon
<Icon 
  name="checkmark-circle" 
  color="success" 
  accessibilityLabel="Task completed"
/>
```

## Examples

### Navigation Icons

```tsx
<Icon 
  name="arrow-back" 
  onPress={() => navigation.goBack()} 
  accessibilityLabel="Go back"
/>

<Icon 
  name="menu" 
  onPress={() => openDrawer()} 
  accessibilityLabel="Open menu"
/>
```

### Action Icons

```tsx
<Icon 
  name="edit" 
  onPress={() => startEdit()} 
  accessibilityLabel="Edit item"
/>

<Icon 
  name="trash" 
  color="error" 
  onPress={() => deleteItem()} 
  accessibilityLabel="Delete item"
/>
```

### Status Icons

```tsx
<Icon name="checkmark-circle" color="success" />
<Icon name="warning" color="warning" />
<Icon name="close-circle" color="error" />
```

### Floating Action Button Style

```tsx
<Icon 
  name="add" 
  size="xl" 
  background 
  backgroundColor="#2196f3" 
  color="white" 
  onPress={() => createNew()}
  accessibilityLabel="Create new item"
/>
```

## Testing

The component includes comprehensive test coverage:

- Rendering with different props
- Size and color variations
- Interactive behavior
- Accessibility features
- Custom styling
- Edge cases and error states

Run tests with:
```bash
npm test Icon.test.tsx
```

## Storybook

View all Icon variants and interactions in Storybook:
```bash
npm run storybook
```

Navigate to `Atoms > Icon` to see all available stories and documentation.