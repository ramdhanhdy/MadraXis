# Tasks for Refactoring Directory Structure in MadraXis

## Implementation Plan
This document outlines a detailed, step-by-step implementation plan for refactoring the directory structure. Each main task is broken down into sub-steps with specific instructions, verification checks, and references to user stories. Follow the steps in order. If you encounter errors, stop and debug before proceeding. This plan is designed for junior developers, emphasizing careful import updates and testing.

### 1. Preparation
- [ ] 1.1 Review current directory structure
  - Open `tree-maker/20250720012608786-tree.md` and study the current layout, noting locations of `app/components/`, `src/components/`, and `app/screens/`.
  - Create a temporary note listing all files in these directories.
  - Verify: Ensure your list matches the tree file.
  - _Ref: User Story 1, 2_
- [ ] 1.2 Backup the entire project
  - Copy the project to a backup folder, e.g., `project_backup/`.
  - Run `git add .` and `git commit -m "Backup before directory refactoring"`.
  - Verify: Check backup exists and git log shows the commit.
  - _Ref: User Story 3_
- [ ] 1.3 Identify components in `app/components/`
  - List all files in `app/components/` and plan their new paths in `src/components/` (e.g., move `auth/LoginForm.tsx` to `src/components/auth/LoginForm.tsx`).
  - Note any role-specific subfolders (e.g., /student, /teacher).
  - Verify: Cross-check with the tree to ensure nothing is missed.
  - _Ref: User Story 1_
- [ ] 1.4 List files in `app/screens/`
  - List all files in `app/screens/` and decide: integrate into `app/` routes or move to `src/components/` if reusable.
  - Note any that can be deleted as obsolete.
  - Verify: Ensure the list is complete.
  - _Ref: User Story 2_

### 2. Consolidate Components
- [ ] 2.1 Create necessary subdirectories in `src/components/`
  - If needed, create subfolders like `src/components/auth/`, `src/components/student/`, etc., matching the structure in `app/components/`.
  - Verify: Check that new folders exist and are empty.
  - _Ref: User Story 1_
- [ ] 2.2 Move files from `app/components/` to `src/components/`
  - Move each file one by one (e.g., `mv app/components/auth/LoginForm.tsx src/components/auth/LoginForm.tsx`).
  - Do not move if it would cause conflicts; resolve first.
  - Verify: Confirm files are in the new location and old folder is empty.
  - _Ref: User Story 1_
- [ ] 2.3 Update all import statements referencing moved components
  - Use IDE search to find imports like `import { LoginForm } from '../../app/components/auth/LoginForm'`.
  - Replace with new paths, e.g., `import { LoginForm } from '../../src/components/auth/LoginForm'`.
  - Handle relative paths carefully; test each change.
  - _Ref: User Story 1_
- [ ] 2.4 Test the application to ensure no import errors
  - Start the app and navigate through all screens using moved components.
  - Check console for import-related errors.
  - Fix any issues immediately.
  - Verify: App runs without crashes related to imports.
  - _Ref: User Story 1_

### 3. Handle Screens Directory
- [ ] 3.1 Move any reusable screen components
  - For each file in `app/screens/`, move to `src/components/` if reusable, or integrate into `app/` as a route file.
  - Example: If `app/screens/student/Dashboard.tsx` is a route, move to `app/(student)/dashboard.tsx`.
  - Verify: Files are relocated correctly.
  - _Ref: User Story 2_
- [ ] 3.2 Delete obsolete files from `app/screens/`
  - Remove files identified as unnecessary in preparation.
  - Verify: Ensure deleted files are not referenced anywhere (search codebase).
  - _Ref: User Story 2_
- [ ] 3.3 Remove the `app/screens/` directory if empty
  - If no files remain, delete the directory.
  - Verify: Directory no longer exists.
  - _Ref: User Story 2_
- [ ] 3.4 Update navigation and route references
  - Search for imports or references to old `app/screens/` paths and update to new locations.
  - Adjust any navigation config in `_layout.tsx` files.
  - Verify: Test navigation to confirm no broken links.
  - _Ref: User Story 2_
- [ ] 3.5 Test all navigation flows
  - Simulate user flows for each role, checking all routes.
  - Verify: No 404 errors or missing screens.
  - _Ref: User Story 2_

### 4. Standardize Structure
- [ ] 4.1 Ensure `app/` only contains routes and layouts
  - Scan `app/` and move any non-route files to `src/`.
  - Verify: `app/` has only route files, layouts, and groups like `(student)`.
  - _Ref: User Story 3_
- [ ] 4.2 Verify `src/` contains all non-route logic
  - Confirm all components, utils, services are in `src/`.
  - Verify: No logic files outside `src/` except routes.
  - _Ref: User Story 3_
- [ ] 4.3 Remove any duplicate directories
  - Delete empty or redundant folders (e.g., old `app/components/`).
  - Verify: Run a directory tree to confirm cleanliness.
  - _Ref: User Story 3_
- [ ] 4.4 Update README.md and other documentation
  - Edit README.md to describe the new structure.
  - Update any other docs referencing old paths.
  - Verify: Docs match the current setup.
  - _Ref: User Story 3_

### 5. Testing and Cleanup
- [ ] 5.1 Run full test suite
  - Execute all unit and integration tests.
  - Fix any failures.
  - Verify: All tests pass.
  - _Ref: User Story 3_
- [ ] 5.2 Perform manual testing for all roles
  - Test as student, teacher, parent, management.
  - Check for UI issues or broken functionality.
  - Verify: App works as expected.
  - _Ref: User Story 3_
- [ ] 5.3 Clean up any temporary files or backups
  - Remove unnecessary backups if refactoring is successful.
  - Verify: No leftover files.
  - _Ref: User Story 3_
- [ ] 5.4 Commit changes with descriptive messages
  - Commit: `git commit -m "Completed directory structure refactoring: consolidated components and removed screens"`.
  - Verify: Git history shows clear commits.
  - _Ref: User Story 3_