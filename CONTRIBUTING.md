# MadraXis Codebase Contribution Guidelines

## Architecture Overview: Atomic Design + Feature-Based Structure

This document defines the architectural standards for the MadraXis codebase, combining **Atomic Design principles** with **feature-based organization**.

## Core Principles

### 1. Atomic Design Hierarchy
Every feature MUST maintain the Atomic Design hierarchy:

```
src/features/[feature-name]/
├── atoms/           # Basic building blocks
├── molecules/       # Simple component groups  
├── organisms/       # Complex components
├── templates/       # Page layouts
├── pages/          # Complete screens
├── services/       # Feature-specific business logic
├── types/          # Feature-specific TypeScript types
└── hooks/          # Feature-specific React hooks
```

### 2. Feature-Based Organization
- **High Cohesion**: All code for a feature lives together
- **Low Coupling**: Features don't depend on each other directly
- **Single Source of Truth**: One pattern for routing, state, and components

## Atomic Design Definitions

### Atoms
- **Single-purpose elements** that can't be broken down further
- **Examples**: Button, Input, Label, Icon, Typography
- **Rules**: No internal state, only props
- **Location**: `src/components/atoms/` or `src/features/[feature]/atoms/`

### Molecules
- **Simple groups of atoms** functioning together
- **Examples**: SearchBar (Input + Button), ExpenseCard (atoms combined)
- **Rules**: Minimal internal state, reusable across features
- **Location**: `src/components/molecules/` or `src/features/[feature]/molecules/`

### Organisms
- **Complex components** forming distinct sections
- **Examples**: LogExpenseForm, BudgetOverview, NavigationPanel
- **Rules**: Can contain state, specific to feature or shared
- **Location**: `src/components/organisms/` or `src/features/[feature]/organisms/`

### Templates
- **Page-level layouts** organizing organisms
- **Examples**: DashboardTemplate, FormTemplate
- **Rules**: No business logic, only layout and composition
- **Location**: `src/components/templates/` or `src/features/[feature]/templates/`

### Pages
- **Complete screens** ready for routing
- **Examples**: FinanceDashboard, ExpenseListScreen
- **Rules**: Minimal presentation logic, use feature services
- **Location**: `src/features/[feature]/pages/`

## Directory Structure Rules

### Shared vs Feature-Specific
```typescript
// Shared components (used by multiple features)
src/components/[atomic-level]/

// Feature-specific components (used only by one feature)  
src/features/[feature-name]/[atomic-level]/
```

### File Naming Convention
```typescript
// Components
[ComponentName]/index.ts          // Export barrel
[ComponentName]/[ComponentName].tsx    // Main component
[ComponentName]/[ComponentName].test.tsx  // Tests
[ComponentName]/[ComponentName].stories.tsx // Storybook

// Services
[serviceName].service.ts          // Business logic
[serviceName].service.test.ts     // Service tests
types.ts                          // Service-specific types

// Hooks
use[HookName].hook.ts            // Custom hook
use[HookName].hook.test.ts       // Hook tests
```

## Migration Strategy

### Phase 1: Create Standards
1. Establish this CONTRIBUTING.md
2. Create feature directory templates
3. Document Atomic Design patterns

### Phase 2: Gradual Migration
1. **One feature at a time** (start with finance)
2. **One atomic level at a time** (atoms → molecules → organisms)
3. **Preserve git history** using `git mv`
4. **Update imports incrementally**

### Phase 3: Validation
1. **Atomic Design compliance check**
2. **Import path verification**
3. **Test coverage maintenance**
4. **Build verification**

## Creating New Features

### Step 1: Directory Structure
```bash
mkdir -p src/features/[feature-name]/{atoms,molecules,organisms,templates,pages,services,types,hooks}
```

### Step 2: Service Setup
```typescript
// src/features/[feature-name]/services/[feature].service.ts
export const [feature]Service = {
  // Service methods
}

// src/features/[feature-name]/types/index.ts
export interface [Feature]Type {
  // Type definitions
}
```

### Step 3: Atomic Component Creation
Start with atoms, build up to molecules, then organisms - never skip levels.

## Code Examples

### Atomic Component Structure
```typescript
// src/features/finance/atoms/ExpenseAmount/ExpenseAmount.tsx
interface ExpenseAmountProps {
  amount: number;
  currency?: string;
}

export const ExpenseAmount: React.FC<ExpenseAmountProps> = ({ 
  amount, 
  currency = 'USD' 
}) => (
  <Text style={styles.amount}>
    {currency}{amount.toFixed(2)}
  </Text>
);

// src/features/finance/molecules/ExpenseItem/ExpenseItem.tsx
interface ExpenseItemProps {
  expense: Expense;
  onPress?: () => void;
}

export const ExpenseItem: React.FC<ExpenseItemProps> = ({ 
  expense, 
  onPress 
}) => (
  <TouchableOpacity onPress={onPress}>
    <ExpenseTitle title={expense.title} />
    <ExpenseAmount amount={expense.amount} />
    <ExpenseDate date={expense.date} />
  </TouchableOpacity>
);
```

### Import Guidelines
```typescript
// ✅ Good: Absolute imports
import { ExpenseAmount } from '@/features/finance/atoms/ExpenseAmount';

// ✅ Good: Feature-internal relative imports
import { ExpenseAmount } from '../atoms/ExpenseAmount';

// ❌ Bad: Deep relative imports
import { ExpenseAmount } from '../../../../../atoms/ExpenseAmount';
```

## Testing Standards

### Atomic Design Testing
- **Atoms**: Visual regression tests
- **Molecules**: Interaction tests
- **Organisms**: Integration tests
- **Templates**: Layout tests
- **Pages**: E2E tests

### Test Co-location
```bash
[ComponentName]/
├── [ComponentName].tsx
├── [ComponentName].test.tsx
└── [ComponentName].stories.tsx
```

## Migration Checklist

When migrating existing code:

- [ ] Component follows Atomic Design level
- [ ] File naming matches convention
- [ ] Tests are co-located
- [ ] Imports use absolute paths
- [ ] No cross-feature dependencies
- [ ] Storybook stories exist
- [ ] TypeScript types are feature-scoped

## Common Patterns

### Shared Components
Components used by 3+ features belong in `src/components/[level]/`

### Feature-Specific Components
Components used by only 1-2 features belong in `src/features/[feature]/[level]/`

### Service Organization
- **Shared services**: `src/services/` (cross-feature)
- **Feature services**: `src/features/[feature]/services/` (feature-specific)

## Review Process

All PRs must:
1. **Pass Atomic Design review** - verify correct atomic level
2. **Maintain feature boundaries** - no cross-feature imports
3. **Include tests** - co-located with components
4. **Update documentation** - if adding new patterns
5. **Preserve git history** - use `git mv` for file moves

## Questions?

For architectural questions, tag `@technical-leads` in PRs or create an issue with the `architecture` label.