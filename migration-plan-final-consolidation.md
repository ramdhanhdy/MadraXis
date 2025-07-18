# Final Consolidation Migration Plan

## Objective
Eliminate legacy `src/components` and `src/services` directories by migrating their contents to the new structure while ensuring theme system integration.

## Current State Analysis

### Legacy Structure
```
src/
├── components/
│   ├── atoms/           # Generic UI elements
│   ├── molecules/       # Composite components
│   ├── organisms/       # Complex components
│   └── templates/       # Layout templates
└── services/            # API services
```

### Target Structure
```
src/
├── shared/
│   ├── components/       # Generic, reusable components
│   │   ├── atoms/
│   │   ├── molecules/
│   │   └── organisms/
│   └── services/       # Global services
├── features/
│   └── finance/
│       ├── components/ # Finance-specific components
│       └── services/   # Finance-specific services
```

## Migration Strategy

### Phase 1: Generic Components Migration
Move generic, reusable components to `src/shared/components/`

#### Generic Atomic Components
- [ ] Button (src/components/atoms/Button/ → src/shared/components/atoms/Button/)
- [ ] Avatar (src/components/atoms/Avatar/ → src/shared/components/atoms/Avatar/)
- [ ] Icon (src/components/atoms/Icon/ → src/shared/components/atoms/Icon/)
- [ ] Input (src/components/atoms/Input/ → src/shared/components/atoms/Input/)
- [ ] Typography (src/components/atoms/Typography/ → src/shared/components/atoms/Typography/)
- [ ] LoadingSpinner (src/components/atoms/LoadingSpinner/ → src/shared/components/atoms/LoadingSpinner/)
- [ ] ProgressRing (src/components/atoms/ProgressRing/ → src/shared/components/atoms/ProgressRing/)
- [ ] SkeletonLoader (src/components/atoms/SkeletonLoader/ → src/shared/components/atoms/SkeletonLoader/)
- [ ] BackgroundPattern (src/components/atoms/BackgroundPattern/ → src/shared/components/atoms/BackgroundPattern/)

#### Generic Molecular Components
- [ ] Card (src/components/molecules/Card/ → src/shared/components/molecules/Card/)
- [ ] ListItem (src/components/molecules/ListItem/ → src/shared/components/molecules/ListItem/)
- [ ] SearchBar (src/components/molecules/SearchBar/ → src/shared/components/molecules/SearchBar/)
- [ ] ProgressBar (src/components/molecules/ProgressBar/ → src/shared/components/molecules/ProgressBar/)
- [ ] QuickAction (src/components/molecules/QuickAction/ → src/shared/components/molecules/QuickAction/)
- [ ] BottomSheetModal (src/components/molecules/BottomSheetModal/ → src/shared/components/molecules/BottomSheetModal/)
- [ ] SwipeableRow (src/components/molecules/SwipeableRow/ → src/shared/components/molecules/SwipeableRow/)

#### Generic Organism Components
- [ ] Header (src/components/organisms/Header/ → src/shared/components/organisms/Header/)
- [ ] Modal (src/components/organisms/Modal/ → src/shared/components/organisms/Modal/)
- [ ] NavigationPanel (src/components/organisms/NavigationPanel/ → src/shared/components/organisms/NavigationPanel/)
- [ ] TabBar (src/components/organisms/TabBar/ → src/shared/components/organisms/TabBar/)
- [ ] DashboardTemplate (src/components/templates/DashboardTemplate/ → src/shared/components/templates/DashboardTemplate/)
- [ ] FormTemplate (src/components/templates/FormTemplate/ → src/shared/components/templates/FormTemplate/)
- [ ] ModalTemplate (src/components/templates/ModalTemplate/ → src/shared/components/templates/ModalTemplate/)

### Phase 2: Finance-Specific Components Migration
Move finance-specific components to `src/features/finance/components/`

#### Finance Components
- [ ] FinanceEmptyState (src/components/molecules/FinanceEmptyState/ → src/features/finance/components/molecules/FinanceEmptyState/)
- [ ] ErrorMessage (src/components/molecules/ErrorMessage/ → src/features/finance/components/molecules/ErrorMessage/)
- [ ] NotificationItem (src/components/molecules/NotificationItem/ → src/features/finance/components/molecules/NotificationItem/)
- [ ] SkeletonCard (src/components/molecules/SkeletonCard/ → src/features/finance/components/molecules/SkeletonCard/)
- [ ] BudgetOverview (src/components/organisms/BudgetOverview/ → src/features/finance/components/organisms/BudgetOverview/)
- [ ] ExpensesList (src/components/organisms/ExpensesList/ → src/features/finance/components/organisms/ExpensesList/)
- [ ] LogExpenseForm (src/components/organisms/LogExpenseForm/ → src/features/finance/components/organisms/LogExpenseForm/)
- [ ] AdjustBudgetForm (src/components/organisms/AdjustBudgetForm/ → src/features/finance/components/organisms/AdjustBudgetForm/)
- [ ] DashboardContent (src/components/organisms/DashboardContent/ → src/features/finance/components/organisms/DashboardContent/)
- [ ] FinanceHub (src/components/pages/FinanceHub/ → src/features/finance/components/pages/FinanceHub/)

### Phase 3: Services Migration

#### Global Services
- [ ] Create `src/shared/services/` directory
- [ ] Identify global utility services (if any)
- [ ] Move generic API client utilities to `src/shared/services/`

#### Finance Services
- [ ] Move `src/services/finance.ts` → `src/features/finance/services/finance.service.ts`
- [ ] Update all imports to use new path

### Phase 4: Import Path Updates
Update all import statements throughout the codebase:

#### Before
```typescript
import { Button } from '../../../components/atoms/Button';
import { FinanceEmptyState } from '../../../components/molecules/FinanceEmptyState';
import { financeService } from '../../../services/finance';
```

#### After
```typescript
import { Button } from '../../../shared/components/atoms/Button';
import { FinanceEmptyState } from '../../../features/finance/components/molecules/FinanceEmptyState';
import { financeService } from '../../../features/finance/services/finance.service';
```

### Phase 5: Theme System Integration
Ensure all migrated components use the theme system:

- [ ] Update component imports to use theme context
- [ ] Replace hard-coded colors with theme tokens
- [ ] Verify consistent styling across all components

### Phase 6: Testing & Verification
- [ ] Test all migrated components
- [ ] Verify all imports work correctly
- [ ] Check theme integration
- [ ] Run application tests

### Phase 7: Cleanup
- [ ] Delete `src/components/` directory
- [ ] Delete `src/services/` directory
- [ ] Verify no remaining references to legacy paths

## Directory Structure Creation

### Create New Structure
```bash
# Create shared directory structure
mkdir -p src/shared/components/{atoms,molecules,organisms,templates}
mkdir -p src/shared/services

# Create feature-specific directories
mkdir -p src/features/finance/components/{atoms,molecules,organisms,pages}
mkdir -p src/features/finance/services
```

## Migration Commands

### File Moving Commands
```bash
# Generic atoms
mv src/components/atoms/Button src/shared/components/atoms/
mv src/components/atoms/Avatar src/shared/components/atoms/
mv src/components/atoms/Icon src/shared/components/atoms/
mv src/components/atoms/Input src/shared/components/atoms/
mv src/components/atoms/Typography src/shared/components/atoms/
mv src/components/atoms/LoadingSpinner src/shared/components/atoms/
mv src/components/atoms/ProgressRing src/shared/components/atoms/
mv src/components/atoms/SkeletonLoader src/shared/components/atoms/
mv src/components/atoms/BackgroundPattern src/shared/components/atoms/

# Generic molecules
mv src/components/molecules/Card src/shared/components/molecules/
mv src/components/molecules/ListItem src/shared/components/molecules/
mv src/components/molecules/SearchBar src/shared/components/molecules/
mv src/components/molecules/ProgressBar src/shared/components/molecules/
mv src/components/molecules/QuickAction src/shared/components/molecules/
mv src/components/molecules/BottomSheetModal src/shared/components/molecules/
mv src/components/molecules/SwipeableRow src/shared/components/molecules/

# Generic organisms
mv src/components/organisms/Header src/shared/components/organisms/
mv src/components/organisms/Modal src/shared/components/organisms/
mv src/components/organisms/NavigationPanel src/shared/components/organisms/
mv src/components/organisms/TabBar src/shared/components/organisms/
mv src/components/templates/DashboardTemplate src/shared/components/templates/
mv src/components/templates/FormTemplate src/shared/components/templates/
mv src/components/templates/ModalTemplate src/shared/components/templates/

# Finance-specific components
mv src/components/molecules/FinanceEmptyState src/features/finance/components/molecules/
mv src/components/molecules/ErrorMessage src/features/finance/components/molecules/
mv src/components/molecules/NotificationItem src/features/finance/components/molecules/
mv src/components/molecules/SkeletonCard src/features/finance/components/molecules/
mv src/components/organisms/BudgetOverview src/features/finance/components/organisms/
mv src/components/organisms/ExpensesList src/features/finance/components/organisms/
mv src/components/organisms/LogExpenseForm src/features/finance/components/organisms/
mv src/components/organisms/AdjustBudgetForm src/features/finance/components/organisms/
mv src/components/organisms/DashboardContent src/features/finance/components/organisms/
mv src/components/pages/FinanceHub src/features/finance/components/pages/

# Services
mv src/services/finance.ts src/features/finance/services/finance.service.ts
```

## Verification Checklist

- [ ] All generic components moved to `src/shared/components/`
- [ ] All finance-specific components moved to `src/features/finance/components/`
- [ ] All services properly categorized and moved
- [ ] All import paths updated
- [ ] Theme system integrated correctly
- [ ] No remaining references to legacy directories
- [ ] Application builds and runs successfully
- [ ] All tests pass
- [ ] Legacy directories successfully deleted

## Risk Mitigation

### Backup Strategy
Before proceeding:
1. Create a git branch for the migration
2. Commit current state as backup
3. Test migration in isolated environment

### Rollback Plan
If issues arise:
1. Revert to previous git commit
2. Restore legacy directories from backup
3. Document any issues for future reference

### Testing Strategy
1. Test each component individually after migration
2. Test component interactions
3. Test theme switching
4. Test on different screen sizes

## Next Steps
1. Review and approve this migration plan
2. Switch to Code mode to execute the migration
3. Execute phases sequentially with verification at each step
4. Complete final verification and cleanup