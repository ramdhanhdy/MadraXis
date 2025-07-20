# Remaining Work - Directory Structure Refactoring

## Overview
The directory structure refactoring has been successfully completed with the following achievements:
- ✅ All components from `app/components/` moved to `src/components/` following atomic design patterns
- ✅ Import statements updated and tested
- ✅ `app/components/` directory completely removed
- ✅ Directory structure standardized with `app/` for routes and `src/` for logic
- ✅ Documentation updated to reflect new structure

## Remaining Components in app/screens/

The following screen components are still located in `app/screens/` and are **actively being used** by the application. These should be migrated to `src/components/templates/` in a future iteration:

### Parent Screens
- `app/screens/parent/AntiBullyingResources.tsx` → **COMPLETED** (moved to `src/components/templates/AntiBullyingResourcesTemplate.tsx`)
- `app/screens/parent/CCTVAccessRequest.tsx` → Should move to `src/components/templates/CCTVAccessRequestTemplate.tsx`
- `app/screens/parent/IncidentReport.tsx` → Should move to `src/components/templates/ParentIncidentReportTemplate.tsx`

### Student Screens  
- `app/screens/student/AntiBullying.tsx` → Should move to `src/components/templates/StudentAntiBullyingTemplate.tsx`
- `app/screens/student/IncidentReport.tsx` → Should move to `src/components/templates/StudentIncidentReportTemplate.tsx`

### Teacher Screens
- `app/screens/teacher/AddStudent.tsx` → Should move to `src/components/templates/AddStudentTemplate.tsx`
- `app/screens/teacher/ClassDetail.tsx` → Should move to `src/components/templates/ClassDetailTemplate.tsx`
- `app/screens/teacher/ClassReports.tsx` → Should move to `src/components/templates/ClassReportsTemplate.tsx`
- `app/screens/teacher/ClassSchedule.tsx` → Should move to `src/components/templates/ClassScheduleTemplate.tsx`
- `app/screens/teacher/ClassStudents.tsx` → Should move to `src/components/templates/ClassStudentsTemplate.tsx`
- `app/screens/teacher/ClassesList.tsx` → Should move to `src/components/templates/ClassesListTemplate.tsx`
- `app/screens/teacher/StudentDetail.tsx` → Should move to `src/components/templates/StudentDetailTemplate.tsx`
- `app/screens/teacher/StudentsList.tsx` → Should move to `src/components/templates/StudentsListTemplate.tsx`

## Current Import References

These route files currently import from the `app/screens/` directory and will need their imports updated when the migration is completed:

### Parent Routes
- `app/(parent)/cctv-request.tsx` imports `../screens/parent/CCTVAccessRequest`
- `app/(parent)/incident-report.tsx` imports `../screens/parent/IncidentReport`

### Student Routes
- `app/(student)/anti-bullying.tsx` imports `../screens/student/AntiBullying`
- `app/(student)/incident-report.tsx` imports `../screens/student/IncidentReport`

### Teacher Routes
- `app/(teacher)/class/index.tsx` redirects to `/screens/teacher/ClassesList`
- `app/(teacher)/class/[id]/index.tsx` redirects to `/screens/teacher/ClassDetail`
- `app/(teacher)/class/[id]/reports/index.tsx` redirects to `/screens/teacher/ClassReports`
- `app/(teacher)/class/[id]/schedule/index.tsx` redirects to `/screens/teacher/ClassSchedule`
- `app/(teacher)/class/[id]/students/index.tsx` redirects to `/screens/teacher/ClassStudents`

## Migration Strategy for Future Work

When migrating the remaining screen components:

1. **Copy the component** from `app/screens/` to `src/components/templates/` with appropriate naming
2. **Update the import** in the corresponding route file to point to the new template location
3. **Test the functionality** to ensure the component works correctly in its new location
4. **Remove the old file** from `app/screens/`
5. **Update any internal navigation** that references the old screen paths

## Example Migration Pattern

```typescript
// Before (in route file)
import CCTVAccessRequest from '../screens/parent/CCTVAccessRequest';

// After (in route file)  
import CCTVAccessRequest from '../../src/components/templates/CCTVAccessRequestTemplate';
```

## Notes

- All screen components are currently functional and should not be moved until proper testing can be performed
- The `app/screens/` directory structure should remain intact until all components are successfully migrated
- Each migration should be done incrementally with testing to ensure no functionality is broken
- Consider creating index.ts files in the templates directory for cleaner imports

## Status

- **Phase 1 (Component Consolidation)**: ✅ COMPLETE
- **Phase 2 (Screen Migration)**: 🔄 PENDING - Ready for future iteration
- **Phase 3 (Final Cleanup)**: ⏳ WAITING - Remove `app/screens/` directory after Phase 2
