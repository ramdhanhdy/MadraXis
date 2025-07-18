# Atomic Design Migration Plan - Finance Feature

## Overview
Complete migration plan for finance feature to Atomic Design + Feature-based architecture while preserving git history and maintaining test coverage.

## Component Classification & Migration Map

### Finance-Specific Components to Migrate

#### Molecules (Feature-Specific)
| Current Location | New Location | Atomic Level | Risk Level |
|------------------|--------------|--------------|------------|
| `src/components/molecules/ExpenseCard/` | `src/features/finance/molecules/ExpenseCard/` | Molecule | Low |
| `src/components/molecules/FinanceEmptyState/` | `src/features/finance/molecules/FinanceEmptyState/` | Molecule | Low |

#### Organisms (Feature-Specific)
| Current Location | New Location | Atomic Level | Risk Level |
|------------------|--------------|--------------|------------|
| `src/components/organisms/LogExpenseForm/` | `src/features/finance/organisms/LogExpenseForm/` | Organism | Medium |
| `src/components/organisms/BudgetOverview/` | `src/features/finance/organisms/BudgetOverview/` | Organism | Medium |
| `src/components/organisms/ExpensesList/` | `src/features/finance/organisms/ExpensesList/` | Organism | Medium |
| `src/components/organisms/AdjustBudgetForm/` | `src/features/finance/organisms/AdjustBudgetForm/` | Organism | Medium |

#### Service Layer
| Current Location | New Location | Type | Risk Level |
|------------------|--------------|------|------------|
| `src/services/finance.ts` | `src/features/finance/services/finance.service.ts` | Service | High |
| N/A | `src/features/finance/types/index.ts` | Types | Low |
| N/A | `src/features/finance/hooks/` | Hooks | Medium |

## Atomic Migration Sequence

### Phase 1: Foundation (Low Risk)
1. **Create feature directory structure**
2. **Migrate Types** - Extract types from finance service
3. **Migrate Molecules** - Start with lowest atomic level

### Phase 2: Core Components (Medium Risk)
1. **Migrate Organisms** - Complex components
2. **Migrate Service** - Business logic layer
3. **Create Hooks** - Custom hooks for finance logic

### Phase 3: Integration (High Risk)
1. **Update import paths** - All consumers of finance components
2. **Validate tests** - Ensure all tests pass
3. **Update routes** - Any route-related changes

## Git Commands for Atomic Moves

### Step 1: Create Feature Directory Structure
```bash
mkdir -p src/features/finance/{atoms,molecules,organisms,templates,pages,services,types,hooks}
```

### Step 2: Type Migration (Atomic Step 1)
```bash
# Extract types first - lowest risk
git mv src/services/finance.ts src/features/finance/services/finance.service.ts.temp
# Extract types to separate file
# Then: git mv src/features/finance/services/finance.service.ts.temp src/features/finance/services/finance.service.ts
```

### Step 3: Molecule Migration (Atomic Step 2)
```bash
# ExpenseCard - low risk molecule
git mv src/components/molecules/ExpenseCard src/features/finance/molecules/

# FinanceEmptyState - low risk molecule  
git mv src/components/molecules/FinanceEmptyState src/features/finance/molecules/
```

### Step 4: Organism Migration (Atomic Step 3)
```bash
# LogExpenseForm - medium risk organism
git mv src/components/organisms/LogExpenseForm src/features/finance/organisms/

# BudgetOverview - medium risk organism
git mv src/components/organisms/BudgetOverview src/features/finance/organisms/

# ExpensesList - medium risk organism
git mv src/components/organisms/ExpensesList src/features/finance/organisms/

# AdjustBudgetForm - medium risk organism
git mv src/components/organisms/AdjustBudgetForm src/features/finance/organisms/
```

### Step 5: Import Path Updates
```bash
# Find and replace imports
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|@/components/molecules/ExpenseCard|@/features/finance/molecules/ExpenseCard|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|@/components/organisms/LogExpenseForm|@/features/finance/organisms/LogExpenseForm|g'
# Continue for all migrated components
```

## Atomic Design Testing Checkpoints

### After Each Migration Step:
1. **Atomic Level Verification** - Confirm correct hierarchy
2. **Import Path Validation** - No broken imports
3. **Test Execution** - All related tests pass
4. **Storybook Verification** - Components render correctly
5. **Build Check** - Application builds without errors

### Test Commands:
```bash
# After each atomic step
npm test -- --watchAll=false --testPathPattern="finance|ExpenseCard|BudgetOverview"
npm run build
```

## Rollback Strategy

### Per-Component Rollback
Each atomic migration can be rolled back independently:

```bash
# Rollback ExpenseCard migration
git mv src/features/finance/molecules/ExpenseCard src/components/molecules/
# Revert import changes
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|@/features/finance/molecules/ExpenseCard|@/components/molecules/ExpenseCard|g'
```

### Full Feature Rollback
```bash
# Reset to pre-migration state
git reset --hard HEAD~[number-of-atomic-steps]
```

## Validation Checklist

### Pre-Migration:
- [ ] All tests passing on main branch
- [ ] No active PRs on finance components
- [ ] Feature flags disabled for finance (if applicable)

### During Migration:
- [ ] Each atomic step committed separately
- [ ] Atomic Design level verified
- [ ] Import paths updated
- [ ] Tests updated and passing

### Post-Migration:
- [ ] All finance components in feature directory
- [ ] No finance code in shared components (except truly shared)
- [ ] All tests passing
- [ ] Application builds successfully
- [ ] Storybook stories updated

## Timeline

### Day 1: Foundation
- Create directory structure
- Migrate types
- Migrate molecules

### Day 2: Core Components  
- Migrate organisms
- Migrate service
- Create hooks

### Day 3: Integration
- Update import paths
- Validate tests
- Final verification

## Commands for Implementation

### Execute Migration:
```bash
# Start migration
git checkout -b feature/atomic-design-migration-finance

# Execute Phase 1
./scripts/migrate-finance-phase1.sh

# Execute Phase 2  
./scripts/migrate-finance-phase2.sh

# Execute Phase 3
./scripts/migrate-finance-phase3.sh
```

### Validation:
```bash
# Run validation after each phase
./scripts/validate-migration.sh
```

## Risk Mitigation

### High-Risk Components:
1. **Finance Service** - Central dependency
2. **LogExpenseForm** - Used in multiple routes
3. **BudgetOverview** - Dashboard dependency

### Mitigation Strategy:
1. **Feature flags** for new vs old paths
2. **Gradual rollout** with rollback capability
3. **Extensive testing** before final merge

## Next Steps

1. **Review this plan** for completeness
2. **Create migration scripts** based on commands above
3. **Schedule migration** during low-development period
4. **Execute Phase 1** (types and molecules)
5. **Validate and proceed** to Phase 2