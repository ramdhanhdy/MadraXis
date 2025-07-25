# Implementation Tasks: Adding Students to Classes by Teachers

> **Note:** This project uses Supabase MCP server for all database-related operations. All database queries, schema modifications, and RLS policies should be implemented through the Supabase MCP server tools.

## 1. Database Schema Validation and Setup

### 1.1 Verify existing schema compatibility using Supabase MCP
- [ ] 1.1.1 Use Supabase MCP to confirm `class_students` table structure
- [ ] 1.1.2 Use Supabase MCP to verify `profiles` table has required fields
- [ ] 1.1.3 Use Supabase MCP to check `student_details` table for grade level information
- [ ] 1.1.4 Use Supabase MCP to validate foreign key relationships

### 1.2 Add missing indexes for performance using Supabase MCP
- [ ] 1.2.1 Create composite index on `class_students(class_id, student_id)` via Supabase MCP
- [ ] 1.2.2 Create index on `profiles(school_id, role)` via Supabase MCP
- [ ] 1.2.3 Create index on `student_details(boarding)` via Supabase MCP

### 1.3 Verify and update Row Level Security policies using Supabase MCP
- [ ] 1.3.1 Test teacher access to class_students table via Supabase MCP
- [ ] 1.3.2 Test student visibility restrictions via Supabase MCP
- [ ] 1.3.3 Validate school boundary enforcement via Supabase MCP

## 2. Audit Trail Implementation

### 2.1 Create audit log table using Supabase MCP
- [ ] 2.1.1 Use Supabase MCP to create `class_enrollment_audit` table with proper schema
- [ ] 2.1.2 Add RLS policies for audit table via Supabase MCP
- [ ] 2.1.3 Create indexes for audit queries via Supabase MCP

## 3. ClassService Extension
**Path**: `src/services/classService.ts` (existing file)

### 3.1 Add student enrollment methods
- [ ] 3.1.1 Implement `addStudentsToClass(classId, studentIds, teacherId)` using Supabase MCP
- [ ] 3.1.2 Implement `removeStudentFromClass(classId, studentId, teacherId)` using Supabase MCP
- [ ] 3.1.3 Add batch processing for multiple students
- [ ] 3.1.4 Include error handling for each operation

### 3.2 Add student query methods
- [ ] 3.2.1 Implement `getAvailableStudents(classId, schoolId, filters)` using Supabase MCP
- [ ] 3.2.2 Add search functionality (name, NIS)
- [ ] 3.2.3 Add filtering (grade level, boarding status)
- [ ] 3.2.4 Implement pagination support

### 3.3 Add validation methods
- [ ] 3.3.1 Implement `validateTeacherAccess(classId, teacherId)` using Supabase MCP
- [ ] 3.3.2 Add grade level compatibility validation
- [ ] 3.3.3 Add duplicate enrollment prevention

## 4. Audit Trail Integration

### 4.1 Create audit logging utility
- [ ] 4.1.1 Implement `logEnrollmentAction(action, classId, studentId, teacherId)` using Supabase MCP
- [ ] 4.1.2 Add metadata capture (timestamp, IP, user agent)
- [ ] 4.1.3 Handle audit failures gracefully

### 4.2 Integrate audit logging in ClassService
- [ ] 4.2.1 Add audit calls to addStudentsToClass
- [ ] 4.2.2 Add audit calls to removeStudentFromClass
- [ ] 4.2.3 Ensure audit logging doesn't block main operations

## 5. Real-time Subscription Support

### 5.1 Set up Supabase real-time subscriptions
- [ ] 5.1.1 Configure subscription for class_students table using Supabase MCP
- [ ] 5.1.2 Handle connection management
- [ ] 5.1.3 Add error recovery for lost connections

### 5.2 Create subscription hooks
- [ ] 5.2.1 Implement `useClassStudentsSubscription(classId)`
- [ ] 5.2.2 Implement `useStudentCountSubscription(classIds)`
- [ ] 5.2.3 Add cleanup on component unmount

## 6. AddStudentsToClassModal Component
**Path**: `src/components/organisms/AddStudentsToClassModal.tsx`

### 6.1 Set up modal structure
- [ ] 6.1.1 Create modal component with proper navigation
- [ ] 6.1.2 Add header with title and close button
- [ ] 6.1.3 Implement full-screen modal layout
- [ ] 6.1.4 Add loading states and error handling

### 6.2 Integrate search and filter functionality
- [ ] 6.2.1 Add search input with debounced queries
- [ ] 6.2.2 Add grade level filter dropdown
- [ ] 6.2.3 Add boarding status filter toggle
- [ ] 6.2.4 Add clear filters functionality

### 6.3 Add student selection interface
- [ ] 6.3.1 Implement StudentSelectionList component
- [ ] 6.3.2 Add multi-select with checkboxes
- [ ] 6.3.3 Show selected count in header
- [ ] 6.3.4 Add select all/clear all functionality

## 7. StudentSelectionList Component
**Path**: `src/components/molecules/StudentSelectionList/`

### 7.1 Set up component directory structure
- [ ] 7.1.1 Create `StudentSelectionList/` directory
- [ ] 7.1.2 Create `StudentSelectionList.tsx` main component file
- [ ] 7.1.3 Create `StudentSelectionList.test.tsx` test file
- [ ] 7.1.4 Create `StudentSelectionList.stories.tsx` Storybook file
- [ ] 7.1.5 Create `README.md` documentation file
- [ ] 7.1.6 Create `index.ts` export file

### 7.2 Implement student list display
- [ ] 7.2.1 Create StudentSelectionItem component
- [ ] 7.2.2 Add student information display (name, NIS, grade, boarding)
- [ ] 7.2.3 Implement checkbox selection
- [ ] 7.2.4 Add visual feedback for selection state

### 7.3 Add pagination support
- [ ] 7.3.1 Implement infinite scroll or pagination
- [ ] 7.3.2 Add loading indicators for additional pages
- [ ] 7.3.3 Handle empty states gracefully

### 7.4 Optimize performance
- [ ] 7.4.1 Implement virtual scrolling for large lists
- [ ] 7.4.2 Add memoization for student items
- [ ] 7.4.3 Optimize re-renders on selection changes

## 8. BulkActionBar Component
**Path**: `src/components/molecules/BulkActionBar/`

### 8.1 Set up component directory structure
- [ ] 8.1.1 Create `BulkActionBar/` directory
- [ ] 8.1.2 Create `BulkActionBar.tsx` main component file
- [ ] 8.1.3 Create `BulkActionBar.test.tsx` test file
- [ ] 8.1.4 Create `BulkActionBar.stories.tsx` Storybook file
- [ ] 8.1.5 Create `README.md` documentation file
- [ ] 8.1.6 Create `index.ts` export file

### 8.2 Implement selection summary
- [ ] 8.2.1 Show count of selected students
- [ ] 8.2.2 Display selected student names (truncated)
- [ ] 8.2.3 Add clear selection button

### 8.3 Add action buttons
- [ ] 8.3.1 Implement "Add Selected" button
- [ ] 8.3.2 Add confirmation dialog
- [ ] 8.3.3 Show loading state during operation
- [ ] 8.3.4 Display success/error feedback

## 9. Enhance ClassStudentsTemplate Component
**Path**: `src/components/templates/ClassStudentsTemplate.tsx` (existing file)

### 9.1 Add "Add Students" button
- [ ] 9.1.1 Place button in header or floating action button
- [ ] 9.1.2 Implement navigation to AddStudentsToClassModal
- [ ] 9.1.3 Pass class context to modal

### 9.2 Implement student removal functionality
- [ ] 9.2.1 Add swipe-to-delete gesture
- [ ] 9.2.2 Add long-press menu with remove option
- [ ] 9.2.3 Implement confirmation dialog
- [ ] 9.2.4 Show success feedback after removal

### 9.3 Add real-time updates
- [ ] 9.3.1 Integrate real-time subscription
- [ ] 9.3.2 Update student list automatically
- [ ] 9.3.3 Handle concurrent modifications

## 10. Update ClassesListTemplate Component

### 10.1 Update student count display
- [ ] 10.1.1 Integrate real-time student count updates
- [ ] 10.1.2 Show loading state during count updates
- [ ] 10.1.3 Handle count update errors gracefully

### 10.2 Add visual indicators
- [ ] 10.2.1 Show enrollment status (full, partial, empty)
- [ ] 10.2.2 Add boarding vs day student breakdown
- [ ] 10.2.3 Implement progress indicators for class capacity

## 11. Navigation Implementation
**Path**: `app/(teacher)/class/[id]/add-students.tsx` (new modal route)

### 11.1 Set up modal navigation
- [ ] 11.1.1 Configure expo-router for modal presentation
- [ ] 11.1.2 Add proper navigation params passing
- [ ] 11.1.3 Implement back navigation handling

### 11.2 Add deep linking support
- [ ] 11.2.1 Support direct links to add students flow
- [ ] 11.2.2 Handle navigation state restoration
- [ ] 11.2.3 Add proper error boundaries

### 11.3 Integrate with existing navigation
- [ ] 11.3.1 Ensure proper integration with existing routes
- [ ] 11.3.2 Add navigation guards for teacher permissions
- [ ] 11.3.3 Handle navigation errors gracefully

### 11.4 Add breadcrumb navigation
- [ ] 11.4.1 Show current location in navigation flow
- [ ] 11.4.2 Add quick navigation to parent screens
- [ ] 11.4.3 Implement navigation history

## 12. Testing Implementation

### 12.1 Unit Tests for Services
**Path**: `__tests__/services/classService.test.ts`
- [ ] 12.1.1 Test addStudentsToClass with various scenarios
- [ ] 12.1.2 Test removeStudentFromClass functionality
- [ ] 12.1.3 Test getAvailableStudents with filters
- [ ] 12.1.4 Test permission validation methods
- [ ] 12.1.5 Test network error scenarios
- [ ] 12.1.6 Test permission denied scenarios
- [ ] 12.1.7 Test database constraint violations
- [ ] 12.1.8 Test with empty student lists
- [ ] 12.1.9 Test with large student datasets
- [ ] 12.1.10 Test concurrent operations

### 12.2 Component Unit Tests
**Path**: `__tests__/components/AddStudentsToClassModal.test.tsx`
- [ ] 12.2.1 Test AddStudentsToClassModal opening and closing
- [ ] 12.2.2 Test search functionality
- [ ] 12.2.3 Test filter functionality
- [ ] 12.2.4 Test student selection

**Path**: `src/components/molecules/StudentSelectionList/StudentSelectionList.test.tsx`
- [ ] 12.2.5 Test StudentSelectionList rendering
- [ ] 12.2.6 Test selection state management
- [ ] 12.2.7 Test pagination

**Path**: `src/components/molecules/BulkActionBar/BulkActionBar.test.tsx`
- [ ] 12.2.8 Test BulkActionBar selection count display
- [ ] 12.2.9 Test bulk actions
- [ ] 12.2.10 Test confirmation dialogs

### 12.3 Integration Tests
**Path**: `__tests__/integration/addStudentsFlow.test.ts`
- [ ] 12.3.1 Test end-to-end add students workflow
- [ ] 12.3.2 Test end-to-end remove students workflow
- [ ] 12.3.3 Test real-time updates across components
- [ ] 12.3.4 Test teacher access validation
- [ ] 12.3.5 Test cross-school access prevention
- [ ] 12.3.6 Test unauthorized access handling
- [ ] 12.3.7 Test with large student lists (1000+ students)
- [ ] 12.3.8 Test search performance
- [ ] 12.3.9 Test concurrent user operations

### 12.4 End-to-End Tests
**Path**: `e2e/addStudentsToClass.e2e.ts`
- [ ] 12.4.1 Configure Detox or similar framework
- [ ] 12.4.2 Set up test data and mock scenarios using Supabase MCP
- [ ] 12.4.3 Create test user accounts
- [ ] 12.4.4 Test complete user journey
- [ ] 12.4.5 Test error scenarios
- [ ] 12.4.6 Test multi-device synchronization
- [ ] 12.4.7 Test app performance with large datasets
- [ ] 12.4.8 Test memory usage during operations
- [ ] 12.4.9 Test battery usage impact

## 13. Documentation

### 13.1 Technical Documentation
**Path**: `docs/technical/add-students-feature.md`
- [ ] 13.1.1 Document new ClassService methods
- [ ] 13.1.2 Add request/response examples
- [ ] 13.1.3 Document error codes and handling
- [ ] 13.1.4 Document new component props and usage
- [ ] 13.1.5 Add code examples

**Path**: `src/components/organisms/AddStudentsToClassModal.stories.tsx`
- [ ] 13.1.6 Create Storybook stories for AddStudentsToClassModal

**Path**: `src/components/molecules/StudentSelectionList/StudentSelectionList.stories.tsx`
- [ ] 13.1.7 Create Storybook stories for StudentSelectionList

**Path**: `src/components/molecules/BulkActionBar/BulkActionBar.stories.tsx`
- [ ] 13.1.8 Create Storybook stories for BulkActionBar

**Path**: `docs/database/schema-updates.md`
- [ ] 13.1.7 Document schema changes
- [ ] 13.1.8 Update ERD diagrams
- [ ] 13.1.9 Document RLS policies

### 13.2 User Documentation
**Path**: `docs/user-guides/teacher-add-students.md`
- [ ] 13.2.1 Write step-by-step instructions for teachers
- [ ] 13.2.2 Add screenshots and examples
- [ ] 13.2.3 Create troubleshooting guide
- [ ] 13.2.4 Update teacher training documentation
- [ ] 13.2.5 Create video tutorials
- [ ] 13.2.6 Add FAQ section

## Summary

This implementation plan focuses on creating a functional "Adding Students to Classes by Teachers" feature using the existing MadraXis codebase and Supabase MCP server. The tasks are arranged in logical execution order, starting with database validation and setup, followed by service layer implementation, frontend components, navigation, testing, and documentation.

All database operations will be performed through the Supabase MCP server, ensuring proper integration with the existing infrastructure. The feature will provide teachers with an intuitive interface to manage class rosters while maintaining proper security and audit trails.