# Typography Component

A comprehensive, accessible typography component built with the MadraXis design system. Provides consistent text rendering across all user roles with multiple variants, colors, and styling options.

## Features

- ✅ **11 Typography Variants**: H1-H4, Body1-2, Caption, Overline, Button variants
- ✅ **8 Semantic Colors**: Primary, Secondary, Tertiary, Disabled, Inverse, Success, Warning, Error
- ✅ **Custom Colors**: Support for hex, RGB, HSL color values
- ✅ **Text Alignment**: Left, Center, Right, Justify
- ✅ **Font Weights**: Normal, Medium, Semibold, Bold
- ✅ **Text Transforms**: None, Uppercase, Lowercase, Capitalize
- ✅ **Text Decorations**: None, Underline, Line-through
- ✅ **Line Height Control**: Tight, Normal, Relaxed, Custom numeric
- ✅ **Text Truncation**: Multi-line with ellipsis modes
- ✅ **Full Accessibility**: WCAG compliant with proper ARIA attributes
- ✅ **Convenience Components**: Pre-configured components for common use cases
- ✅ **Theme Integration**: Uses design system tokens consistently
- ✅ **TypeScript**: Fully typed with comprehensive interfaces

## Basic Usage

```tsx
import { Typography, Heading1, Body1, Caption } from '@/src/components/atoms/Typography';

// Basic typography
<Typography>Default body text</Typography>

// Using variants
<Typography variant="h1">Main Heading</Typography>
<Typography variant="body2" color="secondary">
  Secondary body text
</Typography>

// Using convenience components
<Heading1>Page Title</Heading1>
<Body1>Main content paragraph</Body1>
<Caption color="disabled">Small metadata text</Caption>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Text content (required) |
| `variant` | `'h1' \| 'h2' \| 'h3' \| 'h4' \| 'body1' \| 'body2' \| 'caption' \| 'overline' \| 'button' \| 'buttonSmall' \| 'buttonLarge'` | `'body1'` | Typography variant |
| `color` | `'primary' \| 'secondary' \| 'tertiary' \| 'disabled' \| 'inverse' \| 'success' \| 'warning' \| 'error' \| string` | `'primary'` | Text color |
| `align` | `'left' \| 'center' \| 'right' \| 'justify'` | `'left'` | Text alignment |
| `weight` | `'normal' \| 'medium' \| 'semibold' \| 'bold'` | - | Font weight override |
| `transform` | `'none' \| 'uppercase' \| 'lowercase' \| 'capitalize'` | `'none'` | Text transform |
| `decoration` | `'none' \| 'underline' \| 'line-through'` | `'none'` | Text decoration |
| `lineHeight` | `'tight' \| 'normal' \| 'relaxed' \| number` | - | Line height override |
| `fontSize` | `number` | - | Font size override (use sparingly) |
| `numberOfLines` | `number` | - | Maximum number of lines |
| `ellipsizeMode` | `'head' \| 'middle' \| 'tail' \| 'clip'` | `'tail'` | Ellipsis position for truncation |
| `style` | `TextStyle` | - | Custom text styles |
| `accessibilityLabel` | `string` | - | Custom accessibility label |
| `accessibilityHint` | `string` | - | Custom accessibility hint |
| `accessibilityRole` | `'text' \| 'header' \| 'link' \| 'button'` | - | Custom accessibility role |

## Typography Variants

### Headings

#### H1 (32px, Bold)
Main page titles and primary headings.

```tsx
<Typography variant="h1">Main Page Title</Typography>
<Heading1>Main Page Title</Heading1>
```

#### H2 (24px, Bold)
Section titles and secondary headings.

```tsx
<Typography variant="h2">Section Title</Typography>
<Heading2>Section Title</Heading2>
```

#### H3 (20px, Semibold)
Subsection titles and tertiary headings.

```tsx
<Typography variant="h3">Subsection Title</Typography>
<Heading3>Subsection Title</Heading3>
```

#### H4 (18px, Semibold)
Card titles and quaternary headings.

```tsx
<Typography variant="h4">Card Title</Typography>
<Heading4>Card Title</Heading4>
```

### Body Text

#### Body1 (16px, Normal)
Main body text for paragraphs and content.

```tsx
<Typography variant="body1">Main paragraph text</Typography>
<Body1>Main paragraph text</Body1>
```

#### Body2 (14px, Normal)
Secondary body text for descriptions and supporting content.

```tsx
<Typography variant="body2">Secondary description text</Typography>
<Body2>Secondary description text</Body2>
```

### Utility Text

#### Caption (12px, Normal)
Small text for labels, metadata, and captions.

```tsx
<Typography variant="caption">Image caption or metadata</Typography>
<Caption>Image caption or metadata</Caption>
```

#### Overline (12px, Medium, Uppercase)
Uppercase labels and category indicators.

```tsx
<Typography variant="overline">CATEGORY LABEL</Typography>
<Overline>CATEGORY LABEL</Overline>
```

### Button Text

#### Button (16px, Semibold)
Standard button text styling.

```tsx
<Typography variant="button">Button Text</Typography>
```

#### Button Small (14px, Semibold)
Small button text styling.

```tsx
<Typography variant="buttonSmall">Small Button</Typography>
```

#### Button Large (18px, Semibold)
Large button text styling.

```tsx
<Typography variant="buttonLarge">Large Button</Typography>
```

## Colors

### Semantic Colors

```tsx
<Typography color="primary">Primary text color</Typography>
<Typography color="secondary">Secondary text color</Typography>
<Typography color="tertiary">Tertiary text color</Typography>
<Typography color="disabled">Disabled text color</Typography>
<Typography color="inverse">Inverse text color (for dark backgrounds)</Typography>
<Typography color="success">Success message color</Typography>
<Typography color="warning">Warning message color</Typography>
<Typography color="error">Error message color</Typography>
```

### Custom Colors

```tsx
<Typography color="#ff6b35">Custom hex color</Typography>
<Typography color="rgb(255, 107, 53)">Custom RGB color</Typography>
<Typography color="hsl(15, 100%, 60%)">Custom HSL color</Typography>
```

## Text Styling

### Alignment

```tsx
<Typography align="left">Left aligned (default)</Typography>
<Typography align="center">Center aligned</Typography>
<Typography align="right">Right aligned</Typography>
<Typography align="justify">Justified text</Typography>
```

### Font Weight

```tsx
<Typography weight="normal">Normal weight</Typography>
<Typography weight="medium">Medium weight</Typography>
<Typography weight="semibold">Semibold weight</Typography>
<Typography weight="bold">Bold weight</Typography>
```

### Text Transform

```tsx
<Typography transform="none">No transform</Typography>
<Typography transform="uppercase">UPPERCASE TEXT</Typography>
<Typography transform="lowercase">lowercase text</Typography>
<Typography transform="capitalize">Capitalize Each Word</Typography>
```

### Text Decoration

```tsx
<Typography decoration="none">No decoration</Typography>
<Typography decoration="underline">Underlined text</Typography>
<Typography decoration="line-through">Strikethrough text</Typography>
```

### Line Height

```tsx
<Typography lineHeight="tight">Tight line spacing</Typography>
<Typography lineHeight="normal">Normal line spacing</Typography>
<Typography lineHeight="relaxed">Relaxed line spacing</Typography>
<Typography lineHeight={24}>Custom line height (24px)</Typography>
```

## Text Truncation

### Single Line Truncation

```tsx
<Typography numberOfLines={1}>
  This text will be truncated to one line...
</Typography>
```

### Multi-line Truncation

```tsx
<Typography numberOfLines={3}>
  This text will be truncated to three lines with an ellipsis at the end when it exceeds the specified number of lines.
</Typography>
```

### Ellipsis Modes

```tsx
<Typography numberOfLines={1} ellipsizeMode="head">
  ...Text truncated at beginning
</Typography>

<Typography numberOfLines={1} ellipsizeMode="middle">
  Text truncated in... middle
</Typography>

<Typography numberOfLines={1} ellipsizeMode="tail">
  Text truncated at end...
</Typography>

<Typography numberOfLines={1} ellipsizeMode="clip">
  Text clipped without ellipsis
</Typography>
```

## Accessibility

The Typography component is fully accessible and includes:

- **Automatic Role Assignment**: Headers get `header` role, button variants get `button` role
- **Custom Roles**: Override with `accessibilityRole` prop
- **Screen Reader Support**: Proper text announcement and navigation
- **High Contrast**: Semantic colors meet WCAG contrast requirements

```tsx
<Typography 
  variant="h1" 
  accessibilityRole="header"
  accessibilityLabel="Main page heading"
>
  Page Title
</Typography>

<Typography 
  variant="body1"
  accessibilityHint="This is the main content description"
>
  Content text
</Typography>
```

## Advanced Examples

### Article Layout

```tsx
<View>
  <Heading1 color="primary">Article Title</Heading1>
  <Caption color="secondary">Published March 15, 2024</Caption>
  <Body2 color="tertiary">By John Doe</Body2>
  
  <Heading3>Introduction</Heading3>
  <Body1 lineHeight="relaxed">
    Article introduction with relaxed line height for better readability.
  </Body1>
  
  <Heading3>Main Content</Heading3>
  <Body1 lineHeight="relaxed">
    Main article content with proper typography hierarchy.
  </Body1>
</View>
```

### Form Labels and Descriptions

```tsx
<View>
  <Typography variant="body1" weight="semibold">
    Email Address
  </Typography>
  <Typography variant="body2" color="secondary">
    We'll never share your email with anyone else.
  </Typography>
  <Typography variant="caption" color="error">
    Please enter a valid email address.
  </Typography>
</View>
```

### Status Messages

```tsx
<Typography variant="body2" color="success">
  ✓ Profile updated successfully
</Typography>

<Typography variant="body2" color="warning">
  ⚠ Please verify your email address
</Typography>

<Typography variant="body2" color="error">
  ✗ Failed to save changes
</Typography>
```

### Complex Styling

```tsx
<Typography
  variant="h2"
  color="primary"
  align="center"
  weight="bold"
  transform="uppercase"
  decoration="underline"
  lineHeight="tight"
>
  Styled Heading
</Typography>
```

## Design System Integration

The Typography component automatically uses design system tokens:

- **Colors**: Text colors from theme color palette
- **Font Sizes**: Typography scale from design system
- **Font Weights**: Consistent weight values
- **Line Heights**: Calculated from typography scale
- **Letter Spacing**: Optimized for each variant

## Convenience Components

Pre-configured components for common use cases:

```tsx
import { 
  Heading1, Heading2, Heading3, Heading4,
  Body1, Body2, Caption, Overline 
} from '@/src/components/atoms/Typography';

<Heading1>Page Title</Heading1>
<Heading2>Section Title</Heading2>
<Body1>Main content</Body1>
<Caption>Small text</Caption>
```

## Testing

The component includes comprehensive tests covering:

- All typography variants
- All color options
- Text styling properties
- Truncation and ellipsis
- Accessibility features
- Convenience components
- Custom styling

Run tests with:
```bash
npm test Typography.test.tsx
```

## Migration from Existing Text Components

Replace existing text implementations:

```tsx
// Before
<Text style={{ fontSize: 24, fontWeight: 'bold', color: '#005e7a' }}>
  Heading Text
</Text>

// After
<Typography variant="h2" color="primary">
  Heading Text
</Typography>

// Or use convenience component
<Heading2 color="primary">Heading Text</Heading2>
```

## Performance Considerations

- Typography components are lightweight and optimized for performance
- Styles are calculated once and cached
- No unnecessary re-renders when theme doesn't change
- Efficient text measurement and layout