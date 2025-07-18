# ProgressBar Component

A consistent progress indicator component that provides visual feedback for completion status across all user roles.

## Features

- **Consistent Visual Patterns**: Standardized progress visualization with color coding
- **Multiple Variants**: Default, success, warning, and error states
- **Size Options**: Small (4px), medium (8px), and large (12px) heights
- **Label Support**: Optional labels and percentage display
- **Animation**: Smooth animated progress transitions
- **Accessibility**: Full accessibility support with progress values

## Usage

### Basic ProgressBar

```tsx
import { ProgressBar } from '../../../components/molecules/ProgressBar';

<ProgressBar value={75} />
```

### ProgressBar with Label and Percentage

```tsx
<ProgressBar
  value={85}
  label="Course Progress"
  showLabel
  showPercentage
/>
```

### Different Variants

```tsx
// Default (primary color)
<ProgressBar value={60} variant="default" />

// Success (green)
<ProgressBar value={100} variant="success" />

// Warning (orange)
<ProgressBar value={30} variant="warning" />

// Error (red)
<ProgressBar value={15} variant="error" />
```

### Different Sizes

```tsx
// Small (4px height)
<ProgressBar value={50} size="small" />

// Medium (8px height) - default
<ProgressBar value={50} size="medium" />

// Large (12px height)
<ProgressBar value={50} size="large" />
```

### Custom Colors

```tsx
<ProgressBar
  value={70}
  progressColor="#9c27b0"
  backgroundColor="#e1bee7"
/>
```

### Without Animation

```tsx
<ProgressBar
  value={80}
  animated={false}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | - | Progress value (0-100) |
| `variant` | `'default' \| 'success' \| 'warning' \| 'error'` | `'default'` | Visual variant with color coding |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Height of the progress bar |
| `showLabel` | `boolean` | `false` | Whether to show the label |
| `showPercentage` | `boolean` | `false` | Whether to show percentage |
| `label` | `string` | - | Optional label text |
| `backgroundColor` | `string` | - | Custom background color |
| `progressColor` | `string` | - | Custom progress color |
| `animated` | `boolean` | `true` | Whether to animate progress changes |
| `animationDuration` | `number` | `300` | Animation duration in milliseconds |
| `style` | `ViewStyle` | - | Additional custom styles |
| `accessibilityLabel` | `string` | Auto | Accessibility label |
| `accessibilityHint` | `string` | - | Accessibility hint |
| `testID` | `string` | - | Test identifier |

## Design Specifications

- **Heights**: Small (4px), Medium (8px), Large (12px)
- **Border Radius**: Half of height for rounded ends
- **Colors**:
  - Default: Primary theme color
  - Success: Success theme color
  - Warning: Warning theme color
  - Error: Error theme color
- **Background**: Surface secondary color
- **Animation**: 300ms timing with native driver

## Accessibility

- Uses `progressbar` accessibility role
- Provides current value, min (0), and max (100) to screen readers
- Auto-generates accessibility labels from label and value
- Supports custom accessibility labels and hints

## Examples in Context

### Student Progress Card

```tsx
<Card>
  <Typography variant="h4">Semester Progress</Typography>
  <ProgressBar
    value={78}
    label="Overall Grade"
    showLabel
    showPercentage
    variant="success"
    style={{ marginTop: 12 }}
  />
  <ProgressBar
    value={65}
    label="Attendance"
    showLabel
    showPercentage
    variant="warning"
    style={{ marginTop: 8 }}
  />
  <ProgressBar
    value={92}
    label="Assignment Completion"
    showLabel
    showPercentage
    variant="success"
    style={{ marginTop: 8 }}
  />
</Card>
```

### Class Performance Overview

```tsx
<Card>
  <Typography variant="h4">Class Performance</Typography>
  <View style={{ gap: 12, marginTop: 16 }}>
    <ProgressBar
      value={85}
      label="Math"
      showLabel
      showPercentage
      size="large"
    />
    <ProgressBar
      value={72}
      label="Science"
      showLabel
      showPercentage
      size="large"
      variant="warning"
    />
    <ProgressBar
      value={95}
      label="English"
      showLabel
      showPercentage
      size="large"
      variant="success"
    />
  </View>
</Card>
```

### Loading Progress

```tsx
<Card>
  <Typography variant="body1">Uploading assignment...</Typography>
  <ProgressBar
    value={uploadProgress}
    showPercentage
    style={{ marginTop: 8 }}
  />
</Card>
```