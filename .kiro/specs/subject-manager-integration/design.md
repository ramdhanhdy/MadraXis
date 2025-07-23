# Design Document

## Overview

This design document outlines the integration of the existing SubjectManager component into the teacher's class detail page. The SubjectManager component is already fully implemented and functional, but it needs to be accessible through the class detail page navigation by adding a new "Mata Pelajaran" tab to the existing tab structure.

## Architecture

### Current State Analysis

The project currently has two class detail implementations:
1. **ClassDetailTemplate.tsx** - Currently used in teacher routes with tabs: Overview, Students, Schedule
2. **ClassDetailView.tsx** - More advanced implementation that already includes SubjectManager integration

### Design Decision

Rather than duplicating the SubjectManager integration work, we will update the teacher route to use the existing `ClassDetailView.tsx` component which already has the SubjectManager properly integrated. This approach:
- Leverages existing, tested code
- Maintains consistency with the more advanced implementation
- Reduces code duplication
- Provides immediate access to all advanced features

## Components and Interfaces

### Route Update
- **File**: `app/(teacher)/class/[id]/index.tsx`
- **Change**: Import `ClassDetailView` instead of `ClassDetailTemplate`
- **Impact**: Immediate access to SubjectManager functionality

### Component Structure
```
ClassDetailView
├── Header (with back button and actions)
├── Tab Navigation
│   ├── Detail Tab (class information and statistics)
│   ├── Mata Pelajaran Tab (SubjectManager component)
│   ├── Siswa Tab (students management - placeholder)
│   └── Laporan Tab (reports - placeholder)
└── Content Area (renders active tab content)
```

### SubjectManager Integration
The SubjectManager component is already integrated in ClassDetailView with:
- **Props**: `classId` and `onSubjectCountChange` callback
- **Functionality**: Full CRUD operations for class subjects
- **UI**: Consistent with existing design system
- **State Management**: Independent subject state with real-time updates

## Data Models

### Subject Data Flow
```
ClassDetailView
├── classData.subject_count (displays in statistics)
├── handleSubjectCountChange() (updates count when subjects change)
└── SubjectManager
    ├── subjects[] (list of class subjects)
    ├── availableSubjects[] (predefined subjects)
    └── CRUD operations (add, edit, delete subjects)
```

### API Integration
The SubjectManager uses the existing SubjectService which provides:
- `getClassSubjects(classId)` - Fetch subjects for a class
- `getAvailableSubjects()` - Fetch predefined subjects
- `addSubjectToClass(classId, subjectData)` - Add new subject
- `updateClassSubject(subjectId, subjectData)` - Update existing subject
- `removeSubjectFromClass(subjectId)` - Delete subject

## Error Handling

### Component-Level Error Handling
- **Loading States**: ActivityIndicator during data fetching
- **Empty States**: Friendly message when no subjects exist
- **Network Errors**: Alert dialogs with retry options
- **Validation Errors**: Form validation with user feedback

### Route-Level Error Handling
- **Invalid Class ID**: Error message with back navigation
- **Authentication Errors**: Redirect to login
- **Permission Errors**: Access denied message

## Testing Strategy

### Integration Testing
1. **Route Navigation**: Verify correct component is loaded
2. **Tab Switching**: Ensure smooth navigation between tabs
3. **Subject Count Updates**: Verify real-time count updates in statistics
4. **Data Persistence**: Confirm subject changes persist across tab switches

### Component Testing
1. **SubjectManager CRUD**: Test all subject operations
2. **Form Validation**: Test input validation and error messages
3. **Modal Interactions**: Test add/edit subject modals
4. **Empty States**: Test behavior with no subjects

### User Acceptance Testing
1. **Teacher Workflow**: Complete subject management workflow
2. **UI Consistency**: Verify design matches other tabs
3. **Performance**: Ensure smooth interactions and quick loading
4. **Mobile Responsiveness**: Test on various screen sizes

## Implementation Approach

### Phase 1: Route Update
- Update the import in `app/(teacher)/class/[id]/index.tsx`
- Test basic navigation and functionality
- Verify no breaking changes to existing features

### Phase 2: Cleanup (Optional)
- Evaluate if `ClassDetailTemplate.tsx` is still needed elsewhere
- Consider deprecating if no longer used
- Update any other references if found

### Phase 3: Enhancement (Future)
- Implement placeholder tabs (Students, Reports) if needed
- Add additional subject management features
- Optimize performance if required

## Design Consistency

### Visual Design
The ClassDetailView already follows the established design system:
- **Colors**: Primary (#005e7a), secondary colors consistent with app theme
- **Typography**: Standard font sizes and weights
- **Spacing**: 16px padding, 8px margins following design tokens
- **Shadows**: Consistent elevation and shadow styles

### Interaction Patterns
- **Tab Navigation**: Standard tab switching behavior
- **Modal Dialogs**: Consistent modal presentation for forms
- **Button Styles**: Standard primary/secondary button styling
- **Form Elements**: Consistent input field and picker styling

## Performance Considerations

### Optimization Strategies
- **Lazy Loading**: SubjectManager only loads when tab is active
- **State Management**: Independent state prevents unnecessary re-renders
- **API Caching**: Subject data cached to reduce network requests
- **Memory Management**: Proper cleanup of event listeners and timers

### Monitoring
- **Load Times**: Monitor tab switching performance
- **API Response Times**: Track subject data fetching speed
- **Memory Usage**: Monitor for memory leaks in modal interactions
- **User Interactions**: Track subject management usage patterns