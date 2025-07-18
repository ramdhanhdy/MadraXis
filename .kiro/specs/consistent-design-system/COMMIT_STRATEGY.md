# Commit Strategy for Consistent Design System

## Branch Strategy
- **Feature Branch**: `feature/consistent-design-system`
- **Base Branch**: `master`
- **Merge Strategy**: Squash and merge when complete

## Commit Guidelines

### Commit Message Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types
- `feat`: New feature or component
- `refactor`: Code refactoring without functionality change
- `style`: Styling changes (CSS, design tokens)
- `test`: Adding or updating tests
- `docs`: Documentation updates
- `fix`: Bug fixes

### Scopes
- `tokens`: Design tokens (colors, spacing, typography)
- `atoms`: Atomic components (Button, Input, Typography)
- `molecules`: Molecular components (Card, ListItem)
- `organisms`: Organism components (Header, Modal, TabBar)
- `templates`: Template components (DashboardTemplate)
- `student`: Student dashboard refactoring
- `teacher`: Teacher dashboard refactoring
- `parent`: Parent dashboard refactoring
- `management`: Management dashboard refactoring

## Incremental Commit Plan

### Phase 1: Foundation (Tasks 1.1-1.3)
```bash
# After completing task 1.1
git add src/styles/
git commit -m "feat(tokens): implement design token system

- Add complete color palette with semantic mappings
- Define typography scale with consistent font sizes
- Create spacing system with 7-step scale
- Add shadow definitions for elevation system"

# After completing task 1.2
git add src/context/ThemeContext.tsx
git commit -m "feat(tokens): add theme provider and context

- Create ThemeContext with design token access
- Add custom hooks for theme consumption
- Update root layout with theme provider
- Enable theme switching for future extensibility"

# After completing task 1.3
git add src/utils/styleHelpers.ts
git commit -m "feat(tokens): add styling utility functions

- Create helper functions for common styling patterns
- Add responsive design utilities
- Implement shadow, border, and spacing generators"
```

### Phase 2: Atomic Components (Tasks 2.1-2.4)
```bash
# After completing task 2.1
git add src/components/atoms/Button/
git commit -m "feat(atoms): implement Button component

- Add all variants: primary, secondary, outline, ghost, danger
- Support all sizes with proper touch targets (44px minimum)
- Include loading states, disabled states, and icon support
- Add comprehensive TypeScript interfaces and tests"

# After completing task 2.2
git add src/components/atoms/Typography/
git commit -m "feat(atoms): implement Typography component

- Add all text variants: H1-H4, Body1-2, Caption
- Support color variants, alignment, and font weights
- Ensure consistent line heights and spacing"

# Continue pattern for Input, Icon, Avatar components...
```

### Phase 3: Molecular Components (Tasks 3.1-3.4)
```bash
# After completing task 3.1
git add src/components/molecules/Card/
git commit -m "feat(molecules): implement Card component

- Add variants: default, elevated, outlined
- Support consistent padding options and border radius
- Include press interactions and loading states
- Ensure consistent shadow and elevation"
```

### Phase 4: Organism Components (Tasks 4.1-4.4)
```bash
# After completing task 4.1
git add src/components/organisms/Header/
git commit -m "feat(organisms): implement Header component

- Create consistent header layout for all roles
- Support title positioning and action buttons
- Add notification icon support with badges
- Include back button variant support"
```

### Phase 5: Templates (Tasks 5.1-5.3)
```bash
# After completing task 5.1
git add src/components/templates/DashboardTemplate/
git commit -m "feat(templates): implement DashboardTemplate

- Create consistent dashboard structure
- Support header, content area, and tab bar layout
- Add background pattern integration
- Ensure responsive layout for different screen sizes"
```

### Phase 6: States (Tasks 6.1-6.3)
```bash
# After completing all state components
git add src/components/atoms/LoadingSpinner/ src/components/molecules/SkeletonCard/ src/components/molecules/ErrorMessage/ src/components/molecules/EmptyState/
git commit -m "feat(molecules): implement loading, error, and empty states

- Add consistent loading indicators and skeleton screens
- Create standardized error display components
- Implement empty state components with role-appropriate content"
```

### Phase 7-10: Dashboard Refactoring
```bash
# After completing task 7 (Student dashboard)
git add app/\(student\)/
git commit -m "refactor(student): migrate to design system

- Replace all components with design system equivalents
- Update styling to use design tokens
- Implement DashboardTemplate for consistent layout
- Ensure all interactions use standardized components"

# Similar pattern for Teacher, Parent, Management dashboards...
```

### Phase 11-12: Shared Components and Testing
```bash
# After completing shared component updates
git add app/components/
git commit -m "refactor(shared): update shared components to design system

- Migrate LogoutButton to use design system Button
- Update authentication components with new styling
- Ensure all utility components follow design patterns"

# After completing testing
git add **/*.test.ts **/*.test.tsx
git commit -m "test: add comprehensive component testing

- Add unit tests for all atomic components
- Include integration tests for molecular components
- Add visual regression tests for consistency validation"
```

## Quality Gates

### Before Each Commit
1. **Functionality**: All existing features continue to work
2. **Consistency**: New components follow design system patterns
3. **Testing**: Components have appropriate test coverage
4. **TypeScript**: No TypeScript errors
5. **Linting**: Code passes ESLint and Prettier checks

### Before Merge to Master
1. **Cross-Role Testing**: All four user roles work consistently
2. **Visual Regression**: No unintended visual changes
3. **Performance**: No significant performance degradation
4. **Accessibility**: All components meet accessibility standards
5. **Documentation**: Component usage is documented

## Rollback Strategy
- Each commit should be atomic and reversible
- If issues arise, can revert specific commits without losing other work
- Feature branch allows for safe experimentation
- Regular pushes to remote branch for backup

## Review Process
1. **Self-Review**: Check each commit before pushing
2. **Incremental Reviews**: Request reviews for major milestones
3. **Final Review**: Comprehensive review before merge to master
4. **Testing**: Manual testing across all user roles before merge