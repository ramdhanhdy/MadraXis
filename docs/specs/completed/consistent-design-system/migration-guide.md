# Design System Migration Guide

## Overview

This guide provides step-by-step instructions for migrating existing components to use the new consistent design system. The migration is designed to be incremental and low-risk.

## Migration Strategy

### Phase 1: Setup (Completed ✅)
- ✅ Design system foundation established
- ✅ Core components created
- ✅ Theme provider implemented
- ✅ All role-based dashboards refactored

### Phase 2: Component Replacement (Completed ✅)
- ✅ Replace old Button components with new Button
- ✅ Replace old Input components with new Input
- ✅ Replace old Typography with new Typography
- ✅ Replace old Card components with new Card
- ✅ Replace old ListItem components with new ListItem

### Phase 3: Testing & Documentation (Current Focus)

## Migration Checklist

### ✅ Completed Components
- [x] `Button` - Replaced with `src/components/atoms/Button/Button.tsx`
- [x] `Typography` - Replaced with `src/components/atoms/Typography/Typography.tsx`
- [x] `Input` - Replaced with `src/components/atoms/Input/Input.tsx`
- [x] `Card` - Replaced with `src/components/molecules/Card/Card.tsx`
- [x] `ListItem` - Replaced with `src/components/molecules/ListItem/ListItem.tsx`
- [x] `ProgressBar` - Replaced with `src/components/molecules/ProgressBar/ProgressBar.tsx`
- [x] `EmptyState` - Replaced with `src/components/molecules/EmptyState/EmptyState.tsx`
- [x] `ErrorMessage` - Replaced with `src/components/molecules/ErrorMessage/ErrorMessage.tsx`
- [x] `LoadingSpinner` - Replaced with `src/components/atoms/LoadingSpinner/LoadingSpinner.tsx`
- [x] `SkeletonCard` - Replaced with `src/components/molecules/SkeletonCard/SkeletonCard.tsx`

### 🔄 Pending Components
- [ ] `Modal` - Use `src/components/organisms/Modal/Modal.tsx`
- [ ] `Header` - Use `src/components/organisms/Header/Header.tsx`
- [ ] `TabBar` - Use `src/components/organisms/TabBar/TabBar.tsx`

## Migration Examples

### Before (Old Component)
```typescript
// app/components/OldButton.tsx
import { TouchableOpacity, Text } from 'react-native';

<Button
  onPress={handlePress}
  style={[styles.button, { backgroundColor: '#007bff' }]}
>
  <Text style={styles.buttonText}>Click Me</Text>
</Button>
```

### After (New Component)
```typescript
// Using new Button component
import { Button } from '@/src/components/atoms/Button';

<Button
  variant="primary"
  size="medium"
  onPress={handlePress}
  fullWidth
>
  Click Me
</Button>
```

### Before (Old Card)
```typescript
// app/components/OldCard.tsx
import { View, StyleSheet } from 'react-native';

<View style={[styles.card, styles.elevated]}>
  <Text style={styles.title}>Title</Text>
  <Text style={styles.content}>Content</Text>
</View>

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 8,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
```

### After (New Card)
```typescript
// Using new Card component
import { Card } from '@/src/components/molecules/Card';

<Card variant="elevated" style={{ margin: 8 }}>
  <Typography variant="h5">Title</Typography>
  <Typography variant="body2">Content</Typography>
</Card>
```

## Color Migration

### Before (Hardcoded Colors)
```typescript
const colors = {
  primary: '#007bff',
  secondary: '#6c757d',
  background: '#ffffff',
  text: '#212529',
};
```

### After (Design Tokens)
```typescript
// Use theme context
import { useColors } from '@/src/context/ThemeContext';

const colors = useColors();
// colors.primary.main
// colors.secondary.main
// colors.text.primary
```

## Layout Migration

### Before (Manual Layout)
```typescript
<View style={{ padding: 16, margin: 8 }}>
  <Text>Content</Text>
</View>
```

### After (Theme Spacing)
```typescript
import { useTheme } from '@/src/context/ThemeContext';

const { theme } = useTheme();

<View style={{ 
  padding: theme.spacing.base.md, 
  margin: theme.spacing.base.sm 
}}>
  <Typography>Content</Typography>
</View>
```

## Dashboard Template Migration

### Before (Manual Layout)
```typescript
// app/screens/StudentDashboard.tsx
<View style={styles.container}>
  <View style={styles.header}>
    <Text style={styles.title}>Student Dashboard</Text>
  </View>
  <ScrollView>
    {/* Content */}
  </ScrollView>
  <View style={styles.tabBar}>
    {/* Tab items */}
  </View>
</View>
```

### After (DashboardTemplate)
```typescript
// app/(student)/dashboard.tsx
import { DashboardTemplate } from '@/src/components/templates/DashboardTemplate';

<DashboardTemplate
  header={{
    title: 'Student Dashboard',
    subtitle: schoolName,
    leftAction: { icon: 'arrow-back', onPress: handleBack },
    rightActions: [{ icon: 'notifications', onPress: handleNotifications }],
  }}
  tabs={tabs}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  backgroundPattern={true}
>
  {/* Content */}
</DashboardTemplate>
```

## Testing Migration

### Before (Component Tests)
```typescript
// Old test structure
describe('Button', () => {
  it('should render correctly', () => {
    const { getByText } = render(<Button title="Test" />);
    expect(getByText('Test')).toBeTruthy();
  });
});
```

### After (New Test Structure)
```typescript
// New test structure with proper theming
import { ThemeProvider } from '@/src/context/ThemeContext';

describe('Button', () => {
  it('should render correctly', () => {
    const { getByText } = render(
      <ThemeProvider>
        <Button>Test</Button>
      </ThemeProvider>
    );
    expect(getByText('Test')).toBeTruthy();
  });
});
```

## Migration Steps

### 1. Identify Components to Migrate
```bash
# Find components using old patterns
grep -r "StyleSheet.create" app/components/
grep -r "colors\[" app/components/
```

### 2. Update Imports
```typescript
// Before
import { Button } from '../components/Button';

// After
import { Button } from '@/src/components/atoms/Button';
```

### 3. Replace Props
```typescript
// Before
<Button title="Click" style={styles.button} />

// After
<Button variant="primary" size="medium">Click</Button>
```

### 4. Test Migration
```bash
# Run tests to ensure no regressions
npm test
npm run test:storybook
```

## Common Patterns

### Loading States
```typescript
// Before
{isLoading && <ActivityIndicator size="large" />}

// After
{isLoading && <LoadingSpinner message="Loading..." />}
```

### Error States
```typescript
// Before
{error && <Text style={styles.error}>{error}</Text>}

// After
{error && <ErrorMessage message={error} onRetry={refetch} />}
```

### Empty States
```typescript
// Before
{data.length === 0 && <Text>No data</Text>}

// After
{data.length === 0 && (
  <EmptyState
    title="No Data"
    message="There is no data available"
    actionLabel="Refresh"
    onAction={refetch}
  />
)}
```

## Migration Tools

### Automated Migration Script
```bash
# Run migration helper
npm run migrate:design-system

# Check migration status
npm run check:migration
```

### Manual Checklist
- [ ] Replace all StyleSheet.create with theme tokens
- [ ] Replace hardcoded colors with design tokens
- [ ] Replace custom components with design system components
- [ ] Update all imports to use new component paths
- [ ] Update all tests to use ThemeProvider wrapper
- [ ] Update all stories to use new component APIs

## Support

For questions or issues during migration:
- Check component documentation in `src/components/**/README.md`
- Review Storybook examples
- Consult the design system team
- Use the migration helper scripts