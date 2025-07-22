# Refactoring Tasks: Migrate Class & Subject CRUD to Mobile-Only Expo + Supabase

## Overview
This document outlines the step-by-step refactoring plan to transform the existing implementation (which includes Next.js API routes) into a pure client-side mobile application using Expo React Native and direct Supabase integration. The focus is on refactoring services and components to use Supabase client directly, ensuring functionality is preserved and tested before removing any obsolete server-side code.

Key Principles:
- Maintain existing functionality during refactor.
- Implement direct Supabase calls in services (e.g., classService.ts, subjectService.ts).
- Update components to use these refactored services.
- Test thoroughly at each step.
- Only remove Next.js API routes after confirming the new implementation works.

## Phase 1: Preparation and Analysis (Sprint 1)

### Task 1.1: Audit Current Implementation
- Review all API routes in src/app/api/teacher (classes, subjects).
- Identify all fetch calls in services and components that use these routes.
- Document dependencies and data flows.
- **Estimate**: 3 story points

### Task 1.2: Set Up Supabase Client Configuration
- Ensure supabase.ts is properly configured for client-side auth and queries.
- Add any necessary RLS policies in Supabase dashboard for direct client access.
- Test basic Supabase connectivity from the app.
- **Estimate**: 2 story points

## Phase 2: Refactor Services (Sprint 2)

### Task 2.1: Refactor ClassService
- Modify getTeacherClasses to use direct Supabase query instead of API fetch.
- Update createClass, updateClass, deleteClass (soft delete) to use Supabase insert/update.
- Implement error handling and validation client-side.
- **Estimate**: 5 story points

### Task 2.2: Refactor SubjectService
- Update getClassSubjects, addSubjectToClass, updateClassSubject, removeSubjectFromClass to direct Supabase operations.
- Handle subject validation and duplicates client-side.
- **Estimate**: 4 story points

### Task 2.3: Implement Client-Side Authentication
- Ensure all service methods use Supabase auth session for user ID and permissions.
- Add offline handling using Expo's AsyncStorage if needed.
- **Estimate**: 3 story points

## Phase 3: Update Frontend Components (Sprint 3)

### Task 3.1: Update ClassesListTemplate
- Replace API fetches with calls to refactored ClassService.
- Test filtering, sorting, and pagination client-side.
- **Estimate**: 4 story points

### Task 3.2: Update Form and Detail Components
- Modify ClassFormModal and ClassDetailView to use new services.
- Ensure SubjectManager uses refactored SubjectService.
- **Estimate**: 5 story points

## Phase 4: Testing and Validation (Sprint 4)

### Task 4.1: Unit and Integration Tests
- Write tests for refactored services using direct Supabase mocks.
- Test components with new service calls.
- **Estimate**: 6 story points

### Task 4.2: End-to-End Testing
- Test full CRUD workflows on device/emulator.
- Verify offline behavior and error handling.
- **Estimate**: 5 story points

## Phase 5: Cleanup (Sprint 5)

### Task 5.1: Remove Obsolete API Routes
- Once all tests pass, delete src/app/api/teacher directory.
- Remove any remaining references to Next.js routes.
- **Estimate**: 2 story points

### Task 5.2: Final Optimization and Documentation
- Optimize queries for mobile performance.
- Update documentation to reflect client-side implementation.
- **Estimate**: 3 story points

## Estimation Summary
| Phase | Story Points |
|-------|--------------|
| Phase 1 | 5 |
| Phase 2 | 12 |
| Phase 3 | 9 |
| Phase 4 | 11 |
| Phase 5 | 5 |
| **Total** | **42** |

This plan ensures a safe migration without disrupting existing functionality.