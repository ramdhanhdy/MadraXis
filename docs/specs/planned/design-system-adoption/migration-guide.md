# Design System Adoption - Migration Guide

**Document Version:** 1.0  
**Last Updated:** 2025-01-30  
**Status:** 📋 DRAFT  

## 🎯 Migration Overview

This guide provides step-by-step instructions for migrating components from legacy styling approaches to the MadraXis Design System. Follow these patterns to ensure consistent and efficient migration.

## 📋 Pre-Migration Checklist

### Before Starting Migration
- [ ] **Codebase Refactoring Complete** - All phases 1-13 finished
- [ ] **Design System Available** - `src/design-system/` fully implemented
- [ ] **UI Components Ready** - `src/ui/` components available
- [ ] **Testing Infrastructure** - Jest and React Native Testing Library configured
- [ ] **Migration Tools** - Scripts in `scripts/design-system/` ready

### Component Assessment
- [ ] **Identify Current Pattern** - StyleSheet, old theme, or hardcoded
- [ ] **Assess Complexity** - Simple, moderate, or complex migration
- [ ] **Check Dependencies** - Other components that depend on this one
- [ ] **Review Tests** - Existing test coverage and requirements

## 🔄 Migration Patterns

### Pattern 1: StyleSheet.create Migration

#### Before (Legacy StyleSheet)
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MyComponent = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello World</Text>
      <View style={styles.button}>
        <Text style={styles.buttonText}>Click me</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 16,
    margin: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});
```

#### After (Design System)
```typescript
import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@design-system';
import { Typography, Button, Card } from '@ui/atoms';

const MyComponent = () => {
  const { theme } = useTheme();
  
  const containerStyle = {
    margin: theme.spacing.lg,
  };
  
  return (
    <View style={containerStyle}>
      <Card>
        <Typography 
          variant="h3" 
          color={theme.colors.text.primary}
          style={{ marginBottom: theme.spacing.sm }}
        >
          Hello World
        </Typography>
        <Button variant="primary" size="medium">
          Click me
        </Button>
      </Card>
    </View>
  );
};
```

### Pattern 2: Old Theme Context Migration

#### Before (Old Theme Context)
```typescript
import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

const MyComponent = () => {
  const { colors, typography, spacing } = useTheme();
  
  return (
    <View style={{
      backgroundColor: colors.background,
      padding: spacing.medium,
    }}>
      <Text style={{
        color: colors.text,
        fontSize: typography.sizes.large,
      }}>
        Content
      </Text>
    </View>
  );
};
```

#### After (Design System)
```typescript
import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@design-system';
import { Typography } from '@ui/atoms';

const MyComponent = () => {
  const { theme } = useTheme();
  
  return (
    <View style={{
      backgroundColor: theme.colors.background.primary,
      padding: theme.spacing.md,
    }}>
      <Typography 
        variant="body1" 
        color={theme.colors.text.primary}
      >
        Content
      </Typography>
    </View>
  );
};
```

### Pattern 3: Hardcoded Values Migration

#### Before (Hardcoded Values)
```typescript
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const MyComponent = () => {
  return (
    <View style={{ 
      backgroundColor: '#f8f9fa', 
      padding: 20, 
      margin: 16 
    }}>
      <Text style={{ 
        fontSize: 16, 
        color: '#212529', 
        fontWeight: '500' 
      }}>
        Title
      </Text>
      <TouchableOpacity style={{
        backgroundColor: '#28a745',
        padding: 12,
        borderRadius: 4,
        marginTop: 10,
      }}>
        <Text style={{ color: '#ffffff', textAlign: 'center' }}>
          Success Button
        </Text>
      </TouchableOpacity>
    </View>
  );
};
```

#### After (Design System)
```typescript
import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@design-system';
import { Typography, Button } from '@ui/atoms';

const MyComponent = () => {
  const { theme } = useTheme();
  
  return (
    <View style={{ 
      backgroundColor: theme.colors.background.secondary, 
      padding: theme.spacing.lg, 
      margin: theme.spacing.md 
    }}>
      <Typography 
        variant="body1" 
        weight="medium"
        color={theme.colors.text.primary}
      >
        Title
      </Typography>
      <Button 
        variant="success" 
        size="medium"
        style={{ marginTop: theme.spacing.sm }}
      >
        Success Button
      </Button>
    </View>
  );
};
```

## 🛠️ Step-by-Step Migration Process

### Step 1: Analyze Current Component
```bash
# Run component analysis
node scripts/design-system/inventory.js --component=MyComponent

# Check for patterns that need migration
node scripts/design-system/detect-patterns.js --file=src/ui/MyComponent.tsx
```

### Step 2: Create Component Backup
```bash
# Create backup before migration
node scripts/design-system/backup.js --component=MyComponent
```

### Step 3: Update Imports
```typescript
// Remove old imports
// import { StyleSheet } from 'react-native';
// import { useTheme } from '../../../context/ThemeContext';

// Add design system imports
import { useTheme, useColors, useSpacing } from '@design-system';
import { Button, Typography, Card } from '@ui/atoms';
```

### Step 4: Replace Styling Patterns
```typescript
// Replace StyleSheet.create
// const styles = StyleSheet.create({ ... });

// With design system tokens
const { theme } = useTheme();
const styles = {
  container: {
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  }
};
```

### Step 5: Update Component Usage
```typescript
// Replace custom styled elements
// <View style={styles.button}>
//   <Text style={styles.buttonText}>Click</Text>
// </View>

// With design system components
<Button variant="primary" size="medium">
  Click
</Button>
```

### Step 6: Test Migration
```bash
# Run component tests
npm test -- MyComponent.test.tsx

# Run visual regression test
node scripts/design-system/visual-test.js --component=MyComponent

# Run linting validation
npx eslint src/ui/MyComponent.tsx
```

### Step 7: Update Tests
```typescript
// Update test imports
import { render } from '@testing-library/react-native';
import { AppThemeProvider } from '@context/ThemeContext';

// Wrap component with theme provider
const renderWithTheme = (component) => {
  return render(
    <AppThemeProvider>
      {component}
    </AppThemeProvider>
  );
};
```

## 🎨 Design System Usage Patterns

### Theme Hook Usage
```typescript
// Basic theme usage
const { theme } = useTheme();

// Specific token usage
const colors = useColors();
const spacing = useSpacing();
const typography = useTypography();

// Style helpers
const styleHelpers = useStyleHelpers();
const buttonStyles = useButtonStyles('primary', 'medium');
```

### Component Composition
```typescript
// Compose complex components from atoms
const ComplexComponent = () => {
  return (
    <Card>
      <Typography variant="h2">Title</Typography>
      <Typography variant="body1">Description</Typography>
      <Button variant="primary">Action</Button>
    </Card>
  );
};
```

### Role-Based Theming
```typescript
// Access role-specific colors
const roleColors = useRoleColors('student'); // teal accent
const roleColors = useRoleColors('teacher'); // green accent
const roleColors = useRoleColors('parent');  // amber accent
const roleColors = useRoleColors('management'); // rose accent
```

## 🧪 Testing Migrated Components

### Unit Tests
```typescript
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { AppThemeProvider } from '@context/ThemeContext';
import MyComponent from './MyComponent';

const renderWithTheme = (component) => {
  return render(
    <AppThemeProvider>
      {component}
    </AppThemeProvider>
  );
};

describe('MyComponent', () => {
  it('should render with design system styles', () => {
    renderWithTheme(<MyComponent />);
    expect(screen.getByText('Hello World')).toBeTruthy();
  });
  
  it('should support theme switching', () => {
    renderWithTheme(<MyComponent />);
    // Test theme switching functionality
  });
});
```

### Visual Regression Tests
```typescript
// Use visual testing tools
import { captureScreen } from '@testing-library/react-native';

describe('MyComponent Visual Tests', () => {
  it('should match visual snapshot', async () => {
    const component = renderWithTheme(<MyComponent />);
    const screenshot = await captureScreen(component);
    expect(screenshot).toMatchSnapshot();
  });
});
```

## 🚨 Common Migration Issues

### Issue 1: Performance Degradation
```typescript
// Problem: Re-creating styles on every render
const MyComponent = () => {
  const { theme } = useTheme();
  
  // ❌ BAD: Creates new object every render
  const styles = {
    container: { backgroundColor: theme.colors.background.primary }
  };
  
  // ✅ GOOD: Memoize expensive calculations
  const styles = useMemo(() => ({
    container: { backgroundColor: theme.colors.background.primary }
  }), [theme]);
};
```

### Issue 2: Missing Theme Context
```typescript
// Problem: Component not wrapped with theme provider
// ❌ BAD: Will throw error
const MyComponent = () => {
  const { theme } = useTheme(); // Error: useTheme must be used within ThemeProvider
};

// ✅ GOOD: Ensure proper provider wrapping
const App = () => (
  <AppThemeProvider>
    <MyComponent />
  </AppThemeProvider>
);
```

### Issue 3: Inconsistent Token Usage
```typescript
// ❌ BAD: Mixing hardcoded and token values
const styles = {
  container: {
    backgroundColor: theme.colors.background.primary,
    padding: 16, // Hardcoded value
    margin: theme.spacing.md,
  }
};

// ✅ GOOD: Use tokens consistently
const styles = {
  container: {
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.md,
    margin: theme.spacing.md,
  }
};
```

## 📚 Additional Resources

### Documentation Links
- [Design System Overview](../../../design-system/README.md)
- [Theme Provider Documentation](../../../context/ThemeContext/README.md)
- [UI Component Library](../../../ui/README.md)
- [Testing Guidelines](../../../lib/tests/README.md)

### Migration Tools
- `scripts/design-system/inventory.js` - Component inventory and analysis
- `scripts/design-system/migrate-imports.js` - Automated import migration
- `scripts/design-system/detect-patterns.js` - Pattern detection and reporting
- `scripts/design-system/validate.js` - Migration validation

### Support Resources
- **Storybook** - Visual component documentation
- **ESLint Rules** - Automated compliance checking
- **Migration Scripts** - Automated migration assistance
- **Rollback Procedures** - Safety net for migration issues

---

**Next Steps:** Start with Phase 1 tasks in tasks.md to begin the migration process.
