# Button Component

A comprehensive, accessible button component built with the MadraXis design system. Supports multiple variants, sizes, states, and icon configurations.

## Features

- ✅ **5 Variants**: Primary, Secondary, Outline, Ghost, Danger
- ✅ **3 Sizes**: Small, Medium, Large
- ✅ **Multiple States**: Normal, Disabled, Loading
- ✅ **Icon Support**: Left, Right, Icon-only configurations
- ✅ **Full Accessibility**: WCAG compliant with proper ARIA attributes
- ✅ **Touch Targets**: Minimum 44px touch target for accessibility
- ✅ **Theme Integration**: Uses design system tokens consistently
- ✅ **TypeScript**: Fully typed with comprehensive interfaces

## Basic Usage

```tsx
import { Button } from '@/src/components/atoms/Button';

// Basic button
<Button onPress={() => console.log('Pressed')}>
  Click Me
</Button>

// Primary button with icon
<Button 
  variant="primary" 
  icon="home" 
  iconPosition="left"
  onPress={handlePress}
>
  Go Home
</Button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Button content (required) |
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger'` | `'primary'` | Button style variant |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Button size |
| `loading` | `boolean` | `false` | Shows loading indicator and disables interaction |
| `disabled` | `boolean` | `false` | Disables button interaction |
| `icon` | `keyof typeof Ionicons.glyphMap` | - | Icon name from Ionicons |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Icon position relative to text |
| `iconOnly` | `boolean` | `false` | Shows only icon, hides text |
| `fullWidth` | `boolean` | `false` | Makes button take full container width |
| `style` | `ViewStyle` | - | Custom button container styles |
| `textStyle` | `TextStyle` | - | Custom text styles |
| `accessibilityLabel` | `string` | - | Custom accessibility label |
| `accessibilityHint` | `string` | - | Custom accessibility hint |
| `onPress` | `() => void` | - | Press handler function |

## Variants

### Primary
The main call-to-action button with solid background and high contrast.

```tsx
<Button variant="primary" onPress={handleSubmit}>
  Submit Form
</Button>
```

### Secondary
Alternative action button with secondary brand color.

```tsx
<Button variant="secondary" onPress={handleCancel}>
  Cancel
</Button>
```

### Outline
Button with transparent background and colored border.

```tsx
<Button variant="outline" onPress={handleEdit}>
  Edit Profile
</Button>
```

### Ghost
Minimal button with no background or border.

```tsx
<Button variant="ghost" onPress={handleSkip}>
  Skip This Step
</Button>
```

### Danger
For destructive actions with error color styling.

```tsx
<Button variant="danger" onPress={handleDelete}>
  Delete Account
</Button>
```

## Sizes

### Small (32px height)
Compact button for secondary actions or tight spaces.

```tsx
<Button size="small" onPress={handleAction}>
  Small Action
</Button>
```

### Medium (40px height)
Default size for most use cases.

```tsx
<Button size="medium" onPress={handleAction}>
  Medium Action
</Button>
```

### Large (48px height)
Prominent button for primary actions.

```tsx
<Button size="large" onPress={handleAction}>
  Large Action
</Button>
```

## States

### Loading
Shows activity indicator and prevents interaction.

```tsx
<Button loading onPress={handleSubmit}>
  {isSubmitting ? 'Submitting...' : 'Submit'}
</Button>
```

### Disabled
Prevents interaction and shows disabled styling.

```tsx
<Button disabled={!isFormValid} onPress={handleSubmit}>
  Submit Form
</Button>
```

## Icons

### Left Icon
Icon positioned to the left of text.

```tsx
<Button icon="download" iconPosition="left" onPress={handleDownload}>
  Download File
</Button>
```

### Right Icon
Icon positioned to the right of text.

```tsx
<Button icon="arrow-forward" iconPosition="right" onPress={handleNext}>
  Next Step
</Button>
```

### Icon Only
Shows only the icon, useful for compact interfaces.

```tsx
<Button 
  icon="close" 
  iconOnly 
  accessibilityLabel="Close dialog"
  onPress={handleClose}
/>
```

## Layout

### Full Width
Button takes the full width of its container.

```tsx
<Button fullWidth variant="primary" onPress={handleSubmit}>
  Submit Application
</Button>
```

## Accessibility

The Button component is fully accessible and includes:

- **Proper Role**: `accessibilityRole="button"`
- **State Communication**: Disabled and loading states are communicated to screen readers
- **Touch Targets**: Minimum 44px touch target size
- **Labels**: Automatic or custom accessibility labels
- **Hints**: Optional accessibility hints for complex interactions

```tsx
<Button 
  accessibilityLabel="Save document"
  accessibilityHint="Saves the current document to your account"
  onPress={handleSave}
>
  Save
</Button>
```

## Advanced Examples

### Form Submit Button
```tsx
<Button 
  variant="primary"
  size="large"
  fullWidth
  loading={isSubmitting}
  disabled={!isFormValid}
  icon="checkmark"
  iconPosition="left"
  onPress={handleSubmit}
>
  {isSubmitting ? 'Submitting...' : 'Submit Application'}
</Button>
```

### Toolbar Action Button
```tsx
<Button 
  variant="ghost"
  size="small"
  icon="settings"
  iconOnly
  accessibilityLabel="Open settings"
  onPress={handleOpenSettings}
/>
```

### Destructive Action
```tsx
<Button 
  variant="danger"
  icon="trash"
  iconPosition="left"
  onPress={handleDelete}
  accessibilityLabel="Delete item"
  accessibilityHint="This action cannot be undone"
>
  Delete
</Button>
```

## Design System Integration

The Button component automatically uses design system tokens:

- **Colors**: Primary, secondary, error colors from theme
- **Typography**: Font sizes and weights from typography scale
- **Spacing**: Padding and margins from spacing system
- **Shadows**: Elevation from shadow system
- **Border Radius**: Consistent corner radius from theme

## Testing

The component includes comprehensive tests covering:

- All variants and sizes
- All states (normal, disabled, loading)
- Icon configurations
- Accessibility features
- User interactions
- Custom styling

Run tests with:
```bash
npm test Button.test.tsx
```

## Browser Support

- ✅ iOS Safari
- ✅ Android Chrome
- ✅ React Native
- ✅ Expo

## Migration from Existing Buttons

Replace existing button implementations:

```tsx
// Before
<TouchableOpacity style={customButtonStyle} onPress={handlePress}>
  <Text style={customTextStyle}>Button Text</Text>
</TouchableOpacity>

// After
<Button variant="primary" onPress={handlePress}>
  Button Text
</Button>
```