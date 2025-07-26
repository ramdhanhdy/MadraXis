# Requirements for Refactoring Directory Structure in MadraXis

## Objective
To reorganize the project's directory structure following best practices for modern Expo projects using Expo Router, improving maintainability, reducing redundancy, and enhancing code organization by consolidating components and eliminating unnecessary directories.

## User Stories

### User Story 1: Consolidate Components
As a developer, I want all non-route components consolidated into `src/components/` so that the codebase is easier to navigate and maintain.

**Acceptance Criteria:**
- All components currently in `app/components/` (e.g., role-specific modals and forms) are moved to appropriate subdirectories in `src/components/`.
- Existing atomic design pattern in `src/components/` is maintained or extended for the moved components.
- No components remain in `app/components/` after refactoring.
- All imports referencing moved components are updated across the codebase.
- The application builds and runs without errors related to component imports.

### User Story 2: Eliminate Redundant Screens Directory
As a developer, I want to remove the `app/screens/` directory if it is redundant with Expo Router's routing system so that the structure is simplified.

**Acceptance Criteria:**
- Verify that all screens in `app/screens/` are either obsolete or can be integrated directly into the `app/` directory as routes.
- Move any necessary screen components from `app/screens/` to appropriate locations in `app/` or `src/components/`.
- Delete the `app/screens/` directory and any empty subdirectories.
- Update all imports and navigation references to reflect the new locations.
- Test all routes to ensure no broken navigation or missing screens.

### User Story 3: Standardize Directory Structure
As a developer, I want the project to follow a standardized structure with `app/` dedicated to routes and layouts, and `src/` for components, services, etc., to align with Expo best practices.

**Acceptance Criteria:**
- `app/` contains only route files, layouts, and necessary wrappers.
- `src/` houses components, contexts, services, styles, types, and utils.
- No duplicate or conflicting directories (e.g., multiple `components/` folders).
- Documentation (e.g., README.md) is updated to reflect the new structure.
- Run linter and tests to ensure no issues introduced by the refactoring.