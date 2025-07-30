# 🚀 Phase 3: UI Components Migration - Getting Started Guide

**Welcome!** This guide will help you understand the project and start working on Phase 3 of the MadraXis codebase refactoring.

## 📖 Project Overview

### What is MadraXis?
MadraXis is a React Native school management application built with Expo. It serves different user roles (students, teachers, parents, management) with role-specific dashboards and functionality.

### What is this Refactoring About?
We're modernizing the codebase architecture from a service-oriented structure to a domain-driven, atomic design pattern. This improves maintainability, scalability, and developer experience.

### Current Progress
- ✅ **Phase 1 Complete**: Infrastructure setup (TypeScript, Jest, ESLint, Storybook, E2E)
- ✅ **Phase 2 Complete**: Parallel structure creation (new directories alongside old ones)
- 🎯 **Phase 3 (Your Task)**: Migrate UI components to new atomic design structure

## 🎯 Your Mission: Phase 3 - UI Components Migration

### Goal
Move 95 existing UI components from `src/components/` to the new `src/ui/` structure following atomic design principles, while maintaining backward compatibility.

### What You'll Accomplish
- Migrate components to atomic design structure (atoms → molecules → organisms → templates)
- Create Storybook stories for visual documentation
- Write comprehensive unit tests
- Update imports using automation scripts
- Ensure zero breaking changes

## 🏗️ Understanding the Architecture

### Current State (What Exists)
```
src/
├── components/           # 🔄 OLD STRUCTURE (95 components to migrate)
│   ├── atoms/           # 7 basic components (Button, Input, etc.)
│   ├── molecules/       # 12 composite components (Card, Form, etc.)
│   ├── organisms/       # 19 complex components (Header, Modal, etc.)
│   └── templates/       # 17 page layouts
└── ui/                  # ✅ NEW STRUCTURE (empty, ready for migration)
    ├── atoms/           # Target for basic components
    ├── molecules/       # Target for composite components
    ├── organisms/       # Target for complex components
    └── templates/       # Target for page layouts
```

### Target Architecture (Atomic Design)
- **Atoms**: Basic building blocks (Button, Input, Icon)
- **Molecules**: Simple combinations of atoms (Card, SearchForm)
- **Organisms**: Complex UI sections (Header, NavigationPanel)
- **Templates**: Page-level layouts (DashboardTemplate, FormTemplate)

## 🛠️ Tools & Scripts Available

### Essential Commands
```bash
# 1. Validate current state
bun run migrate:checkpoint --checkpoint=parallel-structure

# 2. Test migration patterns (should show 60/60 passing)
bun run migrate:test-patterns

# 3. Migrate UI components (after manual migration)
bun run migrate:ui

# 4. Validate imports
bun run migrate:validate

# 5. Start Storybook for testing
bun run storybook
```

### Development Workflow
```bash
# Start development
bun install
bun run storybook  # For component testing

# Run tests
bun test

# Validate progress
bun run migrate:checkpoint --checkpoint=ui-components
```

## 📋 Step-by-Step Migration Process

### Step 1: Understand What to Migrate
1. Explore `src/components/` to see existing components
2. Check `docs/specs/in-progress/refactor-codebase-structure/tasks.md` lines 61-214 for detailed task breakdown
3. Review `CHECKPOINT_PHASE_2_COMPLETE.md` for context

### Step 2: Migration Pattern (Repeat for Each Component)
```bash
# Example: Migrating Button component

# 1. Move the component file
# FROM: src/components/atoms/Button/Button.tsx
# TO:   src/ui/atoms/Button/Button.tsx

# 2. Create test file
# CREATE: src/ui/atoms/Button/Button.test.tsx

# 3. Create Storybook story
# CREATE: src/ui/atoms/Button/Button.stories.tsx

# 4. Update barrel export
# EDIT: src/ui/atoms/index.ts
# ADD: export { Button } from './Button';

# 5. Test the component
bun run storybook  # Verify story works
bun test Button    # Verify tests pass
```

### Step 3: Use Automation Scripts
```bash
# After manually migrating components, update imports
bun run migrate:ui

# Validate everything works
bun run migrate:validate
```

### Step 4: Validate Progress
```bash
# Check if phase is complete
bun run migrate:checkpoint --checkpoint=ui-components
```

## 📁 Key Files to Know

### Documentation
- `docs/specs/in-progress/refactor-codebase-structure/tasks.md` - Detailed task breakdown
- `docs/specs/in-progress/refactor-codebase-structure/design.md` - Architecture overview
- `docs/specs/in-progress/refactor-codebase-structure/requirements.md` - Project requirements

### Configuration
- `tsconfig.json` - Path aliases configured (@ui, @domains, @lib, etc.)
- `jest.config.ts` - Test configuration with path mapping
- `.storybook/` - Storybook configuration (ready to use)

### Scripts
- `scripts/migration/` - All migration automation tools
- `package.json` - Available npm scripts

## 🎯 Phase 3 Task Breakdown (80 SP Total)

### 3.1 Atoms (30 SP) - Start Here!
- Button, Avatar, Icon, Input, Typography, LoadingSpinner, BackgroundPattern
- Each needs: migration + test + story + README

### 3.2 Molecules (30 SP)
- Card, ListItem, NotificationItem, ProgressBar, QuickAction, etc.
- 12 components total

### 3.3 Organisms (20 SP)
- Header, Modal, NavigationPanel, TabBar, etc.
- 19 components total

### 3.4 Templates (20 SP)
- DashboardTemplate, FormTemplate, ModalTemplate, etc.
- 17 components total

## ⚠️ Important Rules

### DO's
- ✅ Always maintain backward compatibility
- ✅ Use the migration scripts for import updates
- ✅ Write tests and stories for every component
- ✅ Follow the atomic design hierarchy
- ✅ Run validation after each milestone

### DON'Ts
- ❌ Never break existing imports
- ❌ Don't manually update import paths (use scripts)
- ❌ Don't skip tests or stories
- ❌ Don't change component functionality during migration
- ❌ Don't proceed if checkpoint validation fails

## 🆘 Getting Help

### If You're Stuck
1. **Check the specs**: Read the design.md and requirements.md files
2. **Run validation**: Use `bun run migrate:checkpoint` to see what's missing
3. **Test patterns**: Run `bun run migrate:test-patterns` to ensure scripts work
4. **Check existing work**: Look at `CHECKPOINT_PHASE_2_COMPLETE.md` for context

### Common Issues
- **TypeScript errors**: Expected until migration is complete
- **Import errors**: Use the migration scripts, don't update manually
- **Test failures**: Ensure path aliases are working in jest.config.ts

## 🎉 Success Criteria

You'll know Phase 3 is complete when:
- [ ] All 95 components migrated to `src/ui/`
- [ ] All components have Storybook stories
- [ ] All components have unit tests
- [ ] `bun run migrate:checkpoint --checkpoint=ui-components` passes
- [ ] All existing functionality still works
- [ ] TypeScript compilation passes

## 🚀 Ready to Start?

1. **First**: Read `CHECKPOINT_PHASE_2_COMPLETE.md` for full context
2. **Then**: Start with atoms (simplest components)
3. **Begin with**: `src/components/atoms/Button/` → `src/ui/atoms/Button/`
4. **Follow**: The migration pattern above
5. **Validate**: Use checkpoint validation frequently

**Good luck! The foundation is solid and ready for your work!** 🎯
