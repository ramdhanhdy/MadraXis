# Design Document

## Overview

This design establishes a comprehensive design system for the MadraXis school application that ensures visual and functional consistency across all four user roles (management, teacher, student, parent). The design system will be implemented through a shared component library, standardized styling patterns, and unified layout structures while maintaining role-specific functionality.

The design system follows atomic design principles, creating a hierarchy of reusable components from basic atoms (buttons, inputs) to complex organisms (dashboards, modals). This approach ensures maintainability, scalability, and consistency across the entire application.

## Architecture

### Design System Structure

```
src/
├── components/
│   ├── atoms/           # Basic UI elements
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Icon/
│   │   ├── Typography/
│   │   └── Avatar/
│   ├── molecules/       # Combined atoms
│   │   ├── Card/
│   │   ├── ListItem/
│   │   ├── ProgressBar/
│   │   ├── NotificationItem/
│   │   └── QuickAction/
│   ├── organisms/       # Complex components
│   │   ├── Header/
│   │   ├── TabBar/
│   │   ├── Modal/
│   │   ├── Dashboard/
│   │   └── NavigationPanel/
│   └── templates/       # Page layouts
│       ├── DashboardTemplate/
│       ├── ModalTemplate/
│       └── FormTemplate/
├── styles/
│   ├── theme.ts         # Design tokens
│   ├── typography.ts    # Text styles
│   ├── colors.ts        # Color palette
│   ├── spacing.ts       # Spacing system
│   └── shadows.ts       # Shadow definitions
└── utils/
    ├── styleHelpers.ts  # Style utilities
    └── responsive.ts    # Responsive helpers
```

### Design Token System

The design system will be built on a foundation of design tokens that define:

- **Colors**: Primary, secondary, semantic colors, and their variants
- **Typography**: Font families, sizes, weights, and line heights
- **Spacing**: Consistent spacing scale for margins, padding, and gaps
- **Shadows**: Elevation system for depth and hierarchy
- **Border Radius**: Consistent corner radius values
- **Breakpoints**: Responsive design breakpoints

## Components and Interfaces

### Atomic Components (Atoms)

#### Button Component
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size: 'small' | 'medium' | 'large';
  icon?: string;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onPress: () => void;
  children: React.ReactNode;
}
```

#### Typography Component
```typescript
interface TypographyProps {
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'body1' | 'body2' | 'caption' | 'overline';
  color?: string;
  align?: 'left' | 'center' | 'right';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  children: React.ReactNode;
}
```

#### Input Component
```typescript
interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  disabled?: boolean;
  multiline?: boolean;
  secureTextEntry?: boolean;
  leftIcon?: string;
  rightIcon?: string;
}
```

### Molecular Components (Molecules)

#### Card Component
```typescript
interface CardProps {
  variant: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
  children: React.ReactNode;
  onPress?: () => void;
}
```

#### ListItem Component
```typescript
interface ListItemProps {
  title: string;
  subtitle?: string;
  leftIcon?: string;
  rightIcon?: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  onPress?: () => void;
  showDivider?: boolean;
}
```

#### QuickAction Component
```typescript
interface QuickActionProps {
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
  badge?: number;
}
```

### Organism Components (Organisms)

#### Header Component
```typescript
interface HeaderProps {
  title: string;
  leftAction?: {
    icon: string;
    onPress: () => void;
  };
  rightActions?: Array<{
    icon: string;
    onPress: () => void;
    badge?: number;
  }>;
  backgroundColor?: string;
  textColor?: string;
}
```

#### TabBar Component
```typescript
interface TabBarProps {
  tabs: Array<{
    id: string;
    label: string;
    icon: string;
    badge?: number;
  }>;
  activeTab: string;
  onTabPress: (tabId: string) => void;
}
```

#### Modal Component
```typescript
interface ModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  children: React.ReactNode;
}
```

### Template Components (Templates)

#### DashboardTemplate Component
```typescript
interface DashboardTemplateProps {
  header: {
    title: string;
    actions?: HeaderAction[];
  };
  tabs?: TabConfig[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  children: React.ReactNode;
  backgroundPattern?: boolean;
}
```

## Data Models

### Theme Configuration
```typescript
interface Theme {
  colors: {
    primary: ColorPalette;
    secondary: ColorPalette;
    success: ColorPalette;
    warning: ColorPalette;
    error: ColorPalette;
    neutral: ColorPalette;
    background: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    text: {
      primary: string;
      secondary: string;
      disabled: string;
      inverse: string;
    };
  };
  typography: {
    fontFamily: {
      regular: string;
      medium: string;
      semibold: string;
      bold: string;
    };
    fontSize: {
      xs: number;
      sm: number;
      base: number;
      lg: number;
      xl: number;
      '2xl': number;
      '3xl': number;
      '4xl': number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
  };
  borderRadius: {
    none: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  shadows: {
    sm: ShadowStyle;
    md: ShadowStyle;
    lg: ShadowStyle;
    xl: ShadowStyle;
  };
}
```

### Component Style Configuration
```typescript
interface ComponentStyles {
  button: {
    variants: Record<ButtonVariant, StyleSheet>;
    sizes: Record<ButtonSize, StyleSheet>;
  };
  card: {
    variants: Record<CardVariant, StyleSheet>;
    padding: Record<PaddingSize, number>;
  };
  modal: {
    sizes: Record<ModalSize, Dimensions>;
    animations: AnimationConfig;
  };
}
```

## Error Handling

### Component Error Boundaries
- Implement error boundaries for each major component to prevent cascading failures
- Provide fallback UI components that maintain the design system consistency
- Log errors with context information for debugging

### Loading States
- Standardized loading indicators across all components
- Skeleton screens for content-heavy components
- Progressive loading for better perceived performance

### Empty States
- Consistent empty state illustrations and messaging
- Actionable empty states with clear next steps
- Role-appropriate empty state content

## Testing Strategy

### Visual Regression Testing
- Automated screenshot testing for all components
- Cross-platform consistency validation
- Theme variation testing

### Component Testing
- Unit tests for all atomic components
- Integration tests for molecular and organism components
- Accessibility testing for all interactive elements

### Design System Documentation
- Interactive component library with Storybook
- Usage guidelines and best practices
- Code examples and implementation guides

### Performance Testing
- Component rendering performance benchmarks
- Memory usage optimization
- Bundle size impact analysis

## Implementation Phases

### Phase 1: Foundation
1. Create design token system
2. Implement atomic components (Button, Typography, Input, Icon)
3. Set up theme provider and styling utilities
4. Create basic layout templates

### Phase 2: Building Blocks
1. Implement molecular components (Card, ListItem, ProgressBar)
2. Create organism components (Header, TabBar, Modal)
3. Develop dashboard template structure
4. Implement background pattern system

### Phase 3: Integration
1. Refactor existing dashboards to use new components
2. Implement consistent navigation patterns
3. Standardize modal and overlay systems
4. Create shared loading and error states

### Phase 4: Refinement
1. Optimize component performance
2. Add advanced animations and transitions
3. Implement accessibility improvements
4. Create comprehensive documentation

## Design Specifications

### Color System
- **Primary**: #005e7a (Teal) - Main brand color
- **Secondary**: #f0c75e (Gold) - Accent color
- **Success**: #4caf50 (Green) - Success states
- **Warning**: #ff9800 (Orange) - Warning states
- **Error**: #f44336 (Red) - Error states
- **Background**: #f5f5f5 (Light Gray) - Main background
- **Surface**: #ffffff (White) - Card backgrounds
- **Text Primary**: #333333 (Dark Gray) - Main text
- **Text Secondary**: #666666 (Medium Gray) - Secondary text

### Typography Scale
- **H1**: 32px, Bold - Page titles
- **H2**: 24px, Bold - Section titles
- **H3**: 20px, SemiBold - Subsection titles
- **H4**: 18px, SemiBold - Card titles
- **Body1**: 16px, Regular - Main body text
- **Body2**: 14px, Regular - Secondary body text
- **Caption**: 12px, Regular - Small text, labels

### Spacing System
- **XS**: 4px - Minimal spacing
- **SM**: 8px - Small spacing
- **MD**: 16px - Medium spacing (base unit)
- **LG**: 24px - Large spacing
- **XL**: 32px - Extra large spacing
- **2XL**: 48px - Section spacing
- **3XL**: 64px - Page spacing

### Component Specifications

#### Button Specifications
- **Height**: Small (32px), Medium (40px), Large (48px)
- **Padding**: Horizontal 16px (small), 20px (medium), 24px (large)
- **Border Radius**: 8px for all sizes
- **Font Weight**: SemiBold (600)
- **Minimum Touch Target**: 44px x 44px

#### Card Specifications
- **Border Radius**: 12px
- **Shadow**: 0px 2px 4px rgba(0, 0, 0, 0.1)
- **Padding**: Small (12px), Medium (16px), Large (20px)
- **Background**: #ffffff
- **Border**: None (shadow provides separation)

#### Modal Specifications
- **Border Radius**: 20px (top corners only for bottom sheets)
- **Max Height**: 80% of screen height
- **Backdrop**: rgba(0, 0, 0, 0.5)
- **Animation**: Slide up from bottom with 300ms duration
- **Header Height**: 60px with consistent padding

This design system ensures that all user roles will have a consistent, professional, and maintainable interface while preserving the unique functionality requirements of each role.