# Component Consolidation Plan

## Overview
This plan consolidates duplicate modal components across role-based folders into shared, reusable components while maintaining backward compatibility.

## Identified Duplicates

### 1. CommunicationModal
**Locations:**
- `app/components/student/CommunicationModal.tsx`
- `app/components/teacher/CommunicationModal.tsx`

### 2. IncidentReportModal
**Locations:**
- `app/components/student/IncidentReportModal.tsx`
- `app/components/teacher/IncidentReportModal.tsx`

### 3. BoardingInfoModal
**Locations:**
- `app/components/student/BoardingInfoModal.tsx`
- `app/components/teacher/BoardingInfoModal.tsx`

## Consolidation Strategy

### Phase 1: Create Shared Components
Create unified components in `src/components/shared/modals/` with role-based customization.

### Phase 2: Implement Role-Based Props
Each shared component will accept a `userRole` prop to customize behavior and UI.

### Phase 3: Update Imports
Update all imports to use the new shared components.

### Phase 4: Deprecate Old Components
Mark old components as deprecated and eventually remove them.

## Shared Component Structure

```
src/components/shared/modals/
├── CommunicationModal/
│   ├── CommunicationModal.tsx
│   ├── CommunicationModal.stories.tsx
│   ├── CommunicationModal.test.tsx
│   ├── types.ts
│   └── index.ts
├── IncidentReportModal/
│   ├── IncidentReportModal.tsx
│   ├── IncidentReportModal.stories.tsx
│   ├── IncidentReportModal.test.tsx
│   ├── types.ts
│   └── index.ts
└── BoardingInfoModal/
    ├── BoardingInfoModal.tsx
    ├── BoardingInfoModal.stories.tsx
    ├── BoardingInfoModal.test.tsx
    ├── types.ts
    └── index.ts
```

## Component API Design

### CommunicationModal Props
```typescript
interface CommunicationModalProps {
  isVisible: boolean;
  onClose: () => void;
  userRole: 'student' | 'teacher' | 'parent' | 'management';
  recipientId?: string;
  recipientName?: string;
  initialMessage?: string;
  onSend: (message: string) => void;
}
```

### IncidentReportModal Props
```typescript
interface IncidentReportModalProps {
  isVisible: boolean;
  onClose: () => void;
  userRole: 'student' | 'teacher' | 'parent';
  studentId?: string;
  incidentType?: string;
  onSubmit: (report: IncidentReportData) => void;
}
```

### BoardingInfoModal Props
```typescript
interface BoardingInfoModalProps {
  isVisible: boolean;
  onClose: () => void;
  userRole: 'student' | 'teacher' | 'parent';
  studentId?: string;
  boardingData?: BoardingInfo;
  onUpdate?: (data: BoardingInfo) => void;
}
```

## Migration Steps

### Step 1: Create Shared Components (Day 1-2)
1. Create new shared component directories
2. Implement unified components with role-based props
3. Add comprehensive TypeScript types
4. Create Storybook stories

### Step 2: Update References (Day 3-4)
1. Update import statements in all files
2. Add role-based props to all component usage
3. Test each component with different roles
4. Update documentation

### Step 3: Testing & Validation (Day 5)
1. Unit tests for each shared component
2. Integration tests for role-based behavior
3. Accessibility testing
4. Performance testing

### Step 4: Cleanup (Day 6)
1. Mark old components as deprecated
2. Update documentation
3. Create migration guide
4. Schedule removal of old components

## Testing Strategy

### Unit Tests
- Role-based rendering behavior
- Props validation
- Event handling
- Accessibility features

### Integration Tests
- Component integration with different roles
- Data flow between components
- Navigation and routing

### Visual Regression Tests
- Role-specific UI differences
- Responsive behavior
- Theme compatibility

## Rollback Plan

### Immediate Rollback
1. Revert import statements to old paths
2. Restore old components if issues arise
3. Disable shared components via feature flag

### Gradual Rollback
1. Use feature flag to toggle between old and new
2. Monitor error rates and user feedback
3. Gradual rollout with percentage-based deployment

## Success Criteria

### Technical Metrics
- **Zero** duplicate modal components
- **100%** test coverage for shared components
- **Reduced** bundle size by eliminating duplicates
- **Consistent** API across all modal components

### Quality Metrics
- **No** breaking changes in existing functionality
- **Improved** maintainability score
- **Faster** development velocity
- **Better** user experience consistency

## Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| Planning & Design | 1 day | ✅ Complete |
| Implementation | 3 days | ⏳ In Progress |
| Testing & Validation | 2 days | ⏳ Pending |
| Migration & Cleanup | 1 day | ⏳ Pending |

## Risk Mitigation

### Potential Risks
1. **Breaking existing functionality**: Comprehensive testing and gradual rollout
2. **Performance impact**: Bundle size analysis and optimization
3. **Developer confusion**: Clear documentation and training

### Mitigation Strategies
1. **Feature flags** for gradual rollout
2. **Comprehensive testing** at each phase
3. **Clear documentation** and examples
4. **Developer training** sessions

## Conclusion

This consolidation plan will eliminate 6 duplicate modal components while creating a maintainable, scalable shared component system. The role-based props approach ensures flexibility while maintaining consistency across the application.