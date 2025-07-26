# Design System Component Documentation

## Overview

This documentation provides comprehensive usage examples and API references for all design system components.

## Atomic Components

### Button
```typescript
import { Button } from '@/src/components/atoms/Button';

// Basic usage
<Button onPress={handlePress}>Click me</Button>

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Danger</Button>
<Button variant="ghost">Ghost</Button>

// Sizes
<Button size="small">Small</Button>
<Button size="medium">Medium</Button>
<Button size="large">Large</Button>

// With icon
<Button icon="heart" iconPosition="left">Like</Button>
<Button icon="arrow-forward" iconPosition="right">Next</Button>

// States
<Button loading>Loading...</Button>
<Button disabled>Disabled</Button>
```

### Typography
```typescript
import { Typography } from '@/src/components/atoms/Typography';

// Variants
<Typography variant="h1">Heading 1</Typography>
<Typography variant="h2">Heading 2</Typography>
<Typography variant="h3">Heading 3</Typography>
<Typography variant="h4">Heading 4</Typography>
<Typography variant="h5">Heading 5</Typography>
<Typography variant="body1">Body 1</Typography>
<Typography variant="body2">Body 2</Typography>
<Typography variant="caption">Caption</Typography>

// Weights
<Typography weight="regular">Regular</Typography>
<Typography weight="medium">Medium</Typography>
<Typography weight="semibold">Semibold</Typography>
<Typography weight="bold">Bold</Typography>

// Colors
<Typography color="primary">Primary</Typography>
<Typography color="secondary">Secondary</Typography>
<Typography color="error">Error</Typography>
<Typography color="success">Success</Typography>

// Alignment
<Typography align="left">Left</Typography>
<Typography align="center">Center</Typography>
<Typography align="right">Right</Typography>
```

### Input
```typescript
import { Input } from '@/src/components/atoms/Input';

// Basic usage
<Input
  label="Email"
  placeholder="Enter your email"
  value={email}
  onChangeText={setEmail}
/>

// With icon
<Input
  label="Password"
  placeholder="Enter password"
  secureTextEntry
  leftIcon="lock-closed"
  rightIcon="eye"
/>

// States
<Input
  label="Email"
  error="Invalid email"
  helperText="Enter a valid email address"
/>

<Input
  label="Name"
  disabled
  value="John Doe"
/>
```

### LoadingSpinner
```typescript
import { LoadingSpinner } from '@/src/components/atoms/LoadingSpinner/LoadingSpinner';

// Basic usage
<LoadingSpinner />

// With message
<LoadingSpinner message="Loading data..." />

// Different sizes
<LoadingSpinner size="small" />
<LoadingSpinner size="large" />

// Horizontal layout
<LoadingSpinner message="Please wait" vertical={false} />
```

## Molecular Components

### Card
```typescript
import { Card } from '@/src/components/molecules/Card';

// Variants
<Card variant="default">Default card</Card>
<Card variant="elevated">Elevated card</Card>
<Card variant="outlined">Outlined card</Card>

// Interactive
<Card onPress={handlePress}>Clickable card</Card>
<Card loading>Loading card</Card>

// With custom styling
<Card style={{ margin: 16 }}>
  <Typography>Card content</Typography>
</Card>
```

### ListItem
```typescript
import { ListItem } from '@/src/components/molecules/ListItem';

// Basic usage
<ListItem
  title="Item title"
  subtitle="Item subtitle"
/>

// With icons
<ListItem
  title="Settings"
  leftIcon="settings"
  rightIcon="chevron-forward"
/>

// With custom components
<ListItem
  title="Profile"
  leftComponent={<Avatar source={profileImage} />}
  rightComponent={<Badge count={3} />}
/>

// Interactive
<ListItem
  title="Clickable item"
  onPress={handlePress}
/>
```

### EmptyState
```typescript
import { EmptyState } from '@/src/components/molecules/EmptyState';

// Basic usage
<EmptyState
  title="No Data"
  message="There is no data available"
/>

// With action
<EmptyState
  title="Empty Cart"
  message="Your cart is empty"
  actionLabel="Add Items"
  onAction={handleAddItems}
/>

// Variants
<EmptyState
  message="No search results"
  variant="search"
/>

// Full screen
<EmptyState
  title="404"
  message="Page not found"
  fullScreen
/>
```

### ProgressBar
```typescript
import { ProgressBar } from '@/src/components/molecules/ProgressBar';

// Basic usage
<ProgressBar value={75} />

// With label
<ProgressBar
  value={progress}
  label={`${progress}%`}
/>

// Variants
<ProgressBar value={75} variant="success" />
<ProgressBar value={30} variant="warning" />
<ProgressBar value={10} variant="error" />

// Sizes
<ProgressBar value={50} size="small" />
<ProgressBar value={50} size="medium" />
<ProgressBar value={50} size="large" />
```

### QuickAction
```typescript
import { QuickAction } from '@/src/components/molecules/QuickAction';

// Basic usage
<QuickAction
  title="Action"
  icon="heart"
  onPress={handlePress}
/>

// Variants
<QuickAction
  title="Primary"
  icon="add"
  variant="primary"
/>
<QuickAction
  title="Secondary"
  icon="edit"
  variant="secondary"
/>

// With badge
<QuickAction
  title="Messages"
  icon="chatbubbles"
  badge={3}
/>
```

### SkeletonCard
```typescript
import { SkeletonCard } from '@/src/components/molecules/SkeletonCard';

// Basic usage
<SkeletonCard />

// Variants
<SkeletonCard variant="small" />
<SkeletonCard variant="large" />
<SkeletonCard variant="compact" />

// With avatar
<SkeletonCard showAvatar />

// Horizontal layout
<SkeletonCard horizontal />

// Custom lines
<SkeletonCard lines={5} />
```

## Organism Components

### DashboardTemplate
```typescript
import { DashboardTemplate } from '@/src/components/templates/DashboardTemplate';

<DashboardTemplate
  header={{
    title: 'Dashboard',
    subtitle: 'School Name',
    leftAction: {
      icon: 'arrow-back',
      onPress: handleBack,
    },
    rightActions: [
      {
        icon: 'notifications',
        onPress: handleNotifications,
        badge: 3,
      },
    ],
  }}
  tabs={[
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'profile', label: 'Profile', icon: 'person' },
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  backgroundPattern={true}
>
  {/* Content */}
</DashboardTemplate>
```

### Header
```typescript
import { Header } from '@/src/components/organisms/Header';

<Header
  title="Page Title"
  subtitle="Subtitle"
  leftAction={{
    icon: 'arrow-back',
    onPress: handleBack,
  }}
  rightActions={[
    {
      icon: 'notifications',
      onPress: handleNotifications,
      badge: 5,
    },
  ]}
/>
```

### Modal
```typescript
import { Modal } from '@/src/components/organisms/Modal';

<Modal
  visible={isVisible}
  onClose={handleClose}
  title="Modal Title"
  size="medium"
>
  <Typography>Modal content</Typography>
</Modal>
```

## Theme Integration

### Using Theme Context
```typescript
import { useTheme, useColors } from '@/src/context/ThemeContext';

const MyComponent = () => {
  const { theme } = useTheme();
  const colors = useColors();
  
  return (
    <View style={{ 
      backgroundColor: colors.surface.primary,
      padding: theme.spacing.base.md 
    }}>
      <Typography color="primary">Themed content</Typography>
    </View>
  );
};
```

### Theme Provider Setup
```typescript
import { ThemeProvider } from '@/src/context/ThemeContext';

const App = () => {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
};
```

## Accessibility

All components include comprehensive accessibility support:

- **Screen reader support** with proper labels and hints
- **Keyboard navigation** for web platforms
- **Focus management** for interactive elements
- **Semantic roles** for proper screen reader interpretation

## Testing

### Unit Tests
```bash
npm test
```

### Storybook
```bash
npm run storybook
```

### Visual Regression Tests
```bash
npm run test:visual
```

## Best Practices

### 1. Always Use Theme Provider
Wrap your components with ThemeProvider to ensure consistent styling:

```typescript
<ThemeProvider>
  <YourComponent />
</ThemeProvider>
```

### 2. Use Design Tokens
Instead of hardcoded values:
```typescript
// ❌ Don't
padding: 16

// ✅ Do
padding: theme.spacing.base.md
```

### 3. Component Composition
Combine atomic components to build complex UIs:
```typescript
<Card variant="elevated">
  <Typography variant="h4">Title</Typography>
  <Typography variant="body2">Description</Typography>
  <Button variant="primary">Action</Button>
</Card>
```

### 4. Responsive Design
Use theme breakpoints for responsive layouts:
```typescript
const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.base.md,
    [theme.breakpoints.md]: {
      padding: theme.spacing.base.lg,
    },
  },
});
```

## Troubleshooting

### Common Issues

#### Component Not Found
```bash
# Check if component is exported
import { Button } from '@/src/components/atoms/Button';
# Not from '@/src/components/atoms/Button/Button';
```

#### Missing Theme
```typescript
// Wrap with ThemeProvider
<ThemeProvider>
  <YourComponent />
</ThemeProvider>
```

#### TypeScript Errors
```typescript
// Ensure proper imports
import { Button } from '@/src/components/atoms/Button';
// Not from '@/src/components/atoms/Button/Button';
```

## Support

- **Documentation**: Check individual component README.md files
- **Examples**: View Storybook stories for usage examples
- **Issues**: Create GitHub issues for bugs or feature requests