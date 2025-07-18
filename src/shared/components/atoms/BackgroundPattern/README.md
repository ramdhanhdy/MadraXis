# BackgroundPattern Component

A flexible background pattern component featuring Islamic geometric designs and other pattern variants, integrated with the design token system for consistent theming across all user roles.

## Features

- **Multiple Variants**: Geometric, minimal, dots, waves, and none patterns
- **Intensity Levels**: Subtle, light, medium, and strong intensity options
- **Design Token Integration**: Uses theme colors and spacing automatically
- **Custom Colors**: Override theme colors with custom pattern colors
- **Flexible Opacity**: Control pattern visibility with intensity or custom opacity
- **Responsive Design**: Adapts to different container sizes
- **Performance Optimized**: SVG-based patterns for optimal rendering
- **Accessibility**: Proper accessibility labels and non-interactive behavior
- **Cultural Sensitivity**: Traditional Islamic geometric patterns

## Usage

### Basic Background Pattern

```tsx
import { BackgroundPattern } from '../../../components/atoms/BackgroundPattern';

// Default geometric pattern with subtle intensity
<BackgroundPattern />

// In a container with content
<View style={{ position: 'relative', flex: 1 }}>
  <BackgroundPattern />
  <YourContent />
</View>
```

### Different Pattern Variants

```tsx
// Islamic geometric pattern (default)
<BackgroundPattern variant="geometric" intensity="light" />

// Minimal pattern with dots and lines
<BackgroundPattern variant="minimal" intensity="subtle" />

// Simple dots grid
<BackgroundPattern variant="dots" intensity="medium" />

// Flowing waves
<BackgroundPattern variant="waves" intensity="light" />

// No pattern (useful for conditional rendering)
<BackgroundPattern variant="none" />
```

### Intensity Levels

```tsx
// Very subtle background
<BackgroundPattern intensity="subtle" />

// Light visibility
<BackgroundPattern intensity="light" />

// Medium visibility
<BackgroundPattern intensity="medium" />

// Strong visibility
<BackgroundPattern intensity="strong" />
```

### Custom Colors and Opacity

```tsx
// Custom color with theme-based opacity
<BackgroundPattern 
  color="#005e7a" 
  intensity="light" 
/>

// Custom color with specific opacity
<BackgroundPattern 
  color="#f0c75e" 
  opacity={0.08} 
/>

// White pattern for dark backgrounds
<BackgroundPattern 
  color="#ffffff" 
  intensity="medium" 
/>
```

### Custom Dimensions

```tsx
// Custom size
<BackgroundPattern 
  width={300} 
  height={400} 
/>

// Percentage dimensions
<BackgroundPattern 
  width="80%" 
  height="100%" 
/>

// Full container coverage (default)
<BackgroundPattern 
  width="100%" 
  height="100%" 
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'geometric' \| 'minimal' \| 'dots' \| 'waves' \| 'none'` | `'geometric'` | Pattern variant |
| `intensity` | `'subtle' \| 'light' \| 'medium' \| 'strong'` | `'subtle'` | Pattern intensity level |
| `color` | `string` | Theme primary | Custom pattern color |
| `opacity` | `number` | Auto | Custom opacity (0-1, overrides intensity) |
| `width` | `number \| string` | `'100%'` | Pattern width |
| `height` | `number \| string` | `'100%'` | Pattern height |
| `style` | `ViewStyle` | - | Additional container styles |
| `accessibilityLabel` | `string` | - | Accessibility label |
| `testID` | `string` | - | Test identifier |

## Pattern Variants

### Geometric Pattern
Traditional Islamic geometric pattern featuring:
- Triangular tessellations
- Eight-pointed stars (Khatam)
- Interlocking geometric shapes
- Decorative circular elements
- Cultural authenticity and respect

### Minimal Pattern
Clean, modern pattern featuring:
- Sparse dot placement
- Subtle horizontal lines
- Minimal visual noise
- Professional appearance

### Dots Pattern
Simple grid pattern featuring:
- Evenly spaced dots
- Clean geometric arrangement
- Subtle texture effect
- Universal appeal

### Waves Pattern
Flowing pattern featuring:
- Curved wave lines
- Organic movement
- Gentle visual flow
- Calming effect

## Intensity Levels

| Intensity | Opacity | Use Case |
|-----------|---------|----------|
| `subtle` | 0.03 | Very light background texture |
| `light` | 0.05 | Standard dashboard backgrounds |
| `medium` | 0.08 | Prominent but not distracting |
| `strong` | 0.12 | High visibility, decorative use |

## Design Specifications

- **SVG-based**: Vector graphics for crisp rendering at all sizes
- **Absolute Positioning**: Positioned behind content with `position: absolute`
- **Non-interactive**: `pointerEvents: none` to avoid interfering with content
- **Responsive**: Scales to container dimensions
- **Performance**: Optimized SVG markup for fast rendering

## Accessibility

- Uses `accessibilityLabel` for screen reader description
- Non-interactive with `pointerEvents="none"`
- Sufficient contrast maintained with content
- Cultural patterns used respectfully
- Optional visibility control for accessibility needs

## Examples in Context

### Dashboard Background

```tsx
const DashboardScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <BackgroundPattern 
        variant="geometric" 
        intensity="subtle" 
        color="#005e7a"
      />
      
      <ScrollView style={{ flex: 1, padding: 20 }}>
        <Typography variant="h2">Dashboard</Typography>
        <Card>
          <Typography>Your content here</Typography>
        </Card>
      </ScrollView>
    </View>
  );
};
```

### Role-Specific Themes

```tsx
// Student Portal
<BackgroundPattern 
  variant="geometric" 
  intensity="subtle" 
  color="#005e7a" 
/>

// Teacher Portal
<BackgroundPattern 
  variant="minimal" 
  intensity="light" 
  color="#2e7d32" 
/>

// Parent Portal
<BackgroundPattern 
  variant="waves" 
  intensity="subtle" 
  color="#1976d2" 
/>

// Management Portal
<BackgroundPattern 
  variant="dots" 
  intensity="light" 
  color="#424242" 
/>
```

### Dark Theme Support

```tsx
const DarkDashboard = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#1a1a1a' }}>
      <BackgroundPattern 
        variant="geometric" 
        intensity="medium" 
        color="#ffffff" 
      />
      
      <YourDarkThemedContent />
    </View>
  );
};
```

### Modal Background

```tsx
const ModalWithPattern = () => {
  return (
    <Modal visible={visible}>
      <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
        <BackgroundPattern 
          variant="minimal" 
          intensity="subtle" 
          width="100%" 
          height="100%" 
        />
        
        <ModalContent />
      </View>
    </Modal>
  );
};
```

### Card Background

```tsx
const PatternCard = () => {
  return (
    <View style={{ 
      position: 'relative', 
      backgroundColor: '#ffffff',
      borderRadius: 12,
      padding: 20,
      overflow: 'hidden'
    }}>
      <BackgroundPattern 
        variant="dots" 
        intensity="subtle" 
        color="#005e7a" 
      />
      
      <View style={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="h4">Card Title</Typography>
        <Typography variant="body2">Card content</Typography>
      </View>
    </View>
  );
};
```

### Conditional Patterns

```tsx
const ConditionalPattern = ({ showPattern, userRole }) => {
  const getPatternConfig = () => {
    if (!showPattern) return { variant: 'none' };
    
    switch (userRole) {
      case 'student':
        return { variant: 'geometric', color: '#005e7a' };
      case 'teacher':
        return { variant: 'minimal', color: '#2e7d32' };
      case 'parent':
        return { variant: 'waves', color: '#1976d2' };
      case 'management':
        return { variant: 'dots', color: '#424242' };
      default:
        return { variant: 'geometric' };
    }
  };
  
  return (
    <BackgroundPattern 
      {...getPatternConfig()}
      intensity="light"
    />
  );
};
```

### Animation Integration

```tsx
const AnimatedPattern = () => {
  const [intensity, setIntensity] = useState('subtle');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIntensity(prev => 
        prev === 'subtle' ? 'light' : 'subtle'
      );
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <BackgroundPattern 
      variant="geometric" 
      intensity={intensity}
      color="#005e7a"
    />
  );
};
```

### Layered Patterns

```tsx
const LayeredPatterns = () => {
  return (
    <View style={{ position: 'relative', flex: 1 }}>
      {/* Base pattern */}
      <BackgroundPattern 
        variant="geometric" 
        intensity="subtle" 
        color="#005e7a"
      />
      
      {/* Overlay pattern */}
      <BackgroundPattern 
        variant="dots" 
        intensity="subtle" 
        color="#f0c75e"
        style={{ opacity: 0.5 }}
      />
      
      <YourContent />
    </View>
  );
};
```

### Responsive Pattern

```tsx
const ResponsivePattern = () => {
  const { width } = useWindowDimensions();
  
  const getPatternVariant = () => {
    if (width < 768) return 'minimal';
    if (width < 1024) return 'dots';
    return 'geometric';
  };
  
  return (
    <BackgroundPattern 
      variant={getPatternVariant()}
      intensity="light"
      color="#005e7a"
    />
  );
};
```

## Cultural Considerations

The geometric pattern variant is inspired by traditional Islamic geometric art:

- **Respectful Implementation**: Patterns are used as decorative elements, not religious symbols
- **Cultural Authenticity**: Based on traditional tessellation patterns
- **Educational Value**: Introduces users to beautiful mathematical art
- **Inclusive Design**: Patterns are subtle and non-intrusive
- **Alternative Options**: Multiple variants available for different preferences

## Performance Considerations

- **SVG Optimization**: Patterns use optimized SVG markup
- **Render Efficiency**: Patterns are rendered once and cached
- **Memory Usage**: Minimal memory footprint with vector graphics
- **Scaling**: Vector-based patterns scale without quality loss
- **Animation**: Smooth transitions between intensity levels

## Migration Guide

### From Legacy BackgroundPattern

```tsx
// Old usage
<BackgroundPattern color="#006e8a" opacity={0.1} />

// New usage
<BackgroundPattern 
  variant="geometric" 
  color="#006e8a" 
  opacity={0.1} 
/>

// Or using intensity
<BackgroundPattern 
  variant="geometric" 
  color="#006e8a" 
  intensity="light" 
/>
```

### Integration with DashboardTemplate

```tsx
// The DashboardTemplate automatically includes BackgroundPattern
<DashboardTemplate
  backgroundPattern={true} // Uses default geometric pattern
  // ... other props
>
  <YourContent />
</DashboardTemplate>

// For custom pattern control
<DashboardTemplate
  backgroundPattern={false} // Disable automatic pattern
  // ... other props
>
  <BackgroundPattern variant="minimal" intensity="light" />
  <YourContent />
</DashboardTemplate>
```

This component provides a flexible and culturally respectful way to add visual interest to backgrounds while maintaining excellent performance and accessibility.