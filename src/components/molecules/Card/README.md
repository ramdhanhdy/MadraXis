# Card Component

A consistent content container component that provides a unified way to display grouped content across all user roles.

## Features

- **Consistent Design**: Follows design system specifications with 12px border radius and standardized shadows
- **Multiple Variants**: Default (with shadow), elevated (enhanced shadow), and outlined (border only)
- **Flexible Padding**: None, small (12px), medium (16px), or large (20px) padding options
- **Interactive Support**: Optional press handling with proper accessibility
- **Loading States**: Built-in loading state support
- **Accessibility**: Full accessibility support with proper roles and labels

## Usage

### Basic Card

```tsx
import { Card } from '../../../components/molecules/Card';
import { Typography } from '../../../components/atoms/Typography';

<Card>
  <Typography variant="h4">Card Title</Typography>
  <Typography variant="body1">Card content goes here</Typography>
</Card>
```

### Interactive Card

```tsx
<Card onPress={() => console.log('Card pressed')}>
  <Typography variant="h4">Clickable Card</Typography>
  <Typography variant="body2">Tap to interact</Typography>
</Card>
```

### Card Variants

```tsx
// Default card with shadow
<Card variant="default">
  <Typography>Default Card</Typography>
</Card>

// Elevated card with enhanced shadow
<Card variant="elevated">
  <Typography>Elevated Card</Typography>
</Card>

// Outlined card with border
<Card variant="outlined">
  <Typography>Outlined Card</Typography>
</Card>
```

### Padding Options

```tsx
// No padding
<Card padding="none">
  <Typography>No padding card</Typography>
</Card>

// Small padding (12px)
<Card padding="small">
  <Typography>Small padding card</Typography>
</Card>

// Medium padding (16px) - default
<Card padding="medium">
  <Typography>Medium padding card</Typography>
</Card>

// Large padding (20px)
<Card padding="large">
  <Typography>Large padding card</Typography>
</Card>
```

### Loading State

```tsx
<Card loading>
  <Typography>Loading content...</Typography>
</Card>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Content to display inside the card |
| `variant` | `'default' \| 'elevated' \| 'outlined'` | `'default'` | Visual variant of the card |
| `padding` | `'none' \| 'small' \| 'medium' \| 'large'` | `'medium'` | Internal padding size |
| `onPress` | `() => void` | - | Optional press handler (makes card interactive) |
| `disabled` | `boolean` | `false` | Whether the card is disabled (if interactive) |
| `loading` | `boolean` | `false` | Whether the card is in loading state |
| `style` | `ViewStyle` | - | Additional custom styles |
| `accessibilityLabel` | `string` | - | Accessibility label |
| `accessibilityHint` | `string` | - | Accessibility hint |
| `accessibilityRole` | `'button' \| 'none'` | Auto | Accessibility role (auto-determined based on interactivity) |
| `testID` | `string` | - | Test identifier |

## Design Specifications

- **Border Radius**: 12px (theme.borderRadius.lg)
- **Background**: Surface primary color (#ffffff)
- **Shadow (default)**: 0px 2px 4px rgba(0, 0, 0, 0.1)
- **Shadow (elevated)**: Enhanced shadow for hover/focus states
- **Border (outlined)**: 1px solid border primary color
- **Padding Options**: 
  - None: 0px
  - Small: 12px
  - Medium: 16px
  - Large: 20px

## Accessibility

- Automatically sets appropriate accessibility roles based on interactivity
- Supports custom accessibility labels and hints
- Properly handles disabled and loading states
- Maintains minimum touch target size when interactive

## Examples in Context

### Dashboard Quick Action Card

```tsx
<Card variant="default" onPress={() => navigateToAction()}>
  <Icon name="book" size="lg" color="primary" />
  <Typography variant="h4">View Schedule</Typography>
  <Typography variant="body2" color="secondary">
    Check your daily classes
  </Typography>
</Card>
```

### Information Display Card

```tsx
<Card variant="outlined" padding="large">
  <Typography variant="h3">Student Progress</Typography>
  <ProgressBar value={75} />
  <Typography variant="body2" color="secondary">
    75% completed this semester
  </Typography>
</Card>
```

### List Container Card

```tsx
<Card padding="none">
  <ListItem title="Math Class" subtitle="Room 101" />
  <ListItem title="Science Class" subtitle="Room 205" />
  <ListItem title="English Class" subtitle="Room 103" />
</Card>
```