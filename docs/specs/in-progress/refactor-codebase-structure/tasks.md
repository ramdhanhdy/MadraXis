# tasks.md

## Codebase Refactor Tasks

This document outlines the detailed tasks required to refactor the MadraXis codebase according to the new architectural guidelines. Tasks are grouped by category and include estimated story points (SP) for complexity.

### Summary

**Total Story Points: 490 SP**
**Completed: 390 SP (79.6%)**
**Remaining: 100 SP (20.4%)**

**✅ COMPLETED PHASES:**
- Phase 1: Project Setup & Configuration (35 SP)
- Phase 2: Parallel Structure Creation (20 SP)
- Phase 3: Core UI Components Migration (80 SP)
- Phase 4: Domain Logic Refactoring (120 SP)
- Phase 5: Feature Slice Migration (60 SP) - **PARTIAL COMPLETION**
- Phase 6: Enhanced Design System (45 SP) - **INFRASTRUCTURE COMPLETE**
- Phase 7: Shared Utilities & Helpers Migration (30 SP) - **✅ COMPLETED**
- Phase 8: Global State & Context Migration (20 SP) - **✅ COMPLETED**

**🚀 NEXT PHASE:** Phase 9 - Global Type Declarations (10 SP)

| Phase | Description | Story Points |
|-------|-------------|--------------|
| 1 ✅ | Project Setup & Configuration | 35 SP |
| 2 ✅ | Parallel Structure Creation | 20 SP |
| 3 ✅ | Core UI Components (src/ui) Refactoring | 80 SP |
| 4 ✅ | Domain Logic (src/domains) Refactoring | 120 SP |
| 5 🔄 | Routing and Navigation (app/) Refactoring | 60 SP |
| 6 ✅ | Enhanced Design System (src/design-system) Refactoring | 45 SP |
| 7 ✅ | Shared Utilities & Helpers (src/lib) Refactoring | 30 SP |
| 8 ✅ | Global State & Context (src/context) Refactoring | 20 SP |
| 9 | Global Type Declarations (src/types) Refactoring | 10 SP |
| 10 | Testing Infrastructure | 20 SP |
| 11 | Migration Validation & Checkpoints | 25 SP |
| 12 | Cleanup & Final Verification | 20 SP |
| 13 | Rollback Procedures | 15 SP |

### Key Enhancements

- **Enhanced Design System**: New scalable theming architecture with role-based theme support
- **Theme Strategy System**: Easy switching between shared and role-based themes
- **Comprehensive Migration Tools**: Pattern testing and validation scripts
- **Developer Experience**: Runtime validation, debugging tools, and comprehensive documentation

### 1. Project Setup & Configuration (35 SP) ✅ COMPLETED

* [x] **1.1 Backend/Infra:**
  * [x] 1.1.1 Review existing Supabase schema and identify potential impacts of refactor. (5 SP)
  * [x] 1.1.2 Ensure Supabase client configuration is aligned with new domain structure. (5 SP)
* [x] **1.2 Frontend:**
  * [x] 1.2.1 Update `tsconfig.json` to include new path aliases (`@ui`, `@domains`, `@lib`, `@context`, `@types`, `@design-system`, `@app`). (3 SP)
  * [x] 1.2.2 Update `jest.config.ts` with moduleNameMapper for path aliases to prevent test failures. (2 SP)
  * [x] 1.2.3 Configure ESLint and Prettier to enforce new coding standards and architectural patterns. (5 SP)
* [x] **1.3 Migration Infrastructure:**
  * [x] 1.3.1 Create migration automation scripts for import path updates. (8 SP)
  * [x] 1.3.2 Create comprehensive test suite for migration regex patterns. (2 SP)
  * [x] 1.3.3 Set up Storybook configuration (`.storybook/main.js`, `.storybook/preview.js`). (5 SP)
  * [x] 1.3.4 Initialize E2E testing framework (Detox/Playwright setup). (10 SP)
  * [x] 1.3.5 Create migration validation scripts for import checking. (5 SP)

### 2. Parallel Structure Creation (20 SP) ✅ COMPLETED

* [x] **2.1 Directory Structure:**
  * [x] 2.1.1 Create new `src/ui/` directory structure (atoms, molecules, organisms, templates). (3 SP)
  * [x] 2.1.2 Create new `src/domains/` directory structure (class, incidents, users, subjects, dashboard, schools). (3 SP)
  * [x] 2.1.3 Create new `src/lib/` directory structure (hooks, utils, constants, tests). (3 SP)
  * [x] 2.1.4 Set up barrel exports in new directories for backward compatibility. (5 SP)
* [x] **2.2 Migration Preparation:**
  * [x] 2.2.1 Create migration checkpoint validation scripts. (3 SP)
  * [x] 2.2.2 Set up dual import system (old and new paths working simultaneously). (3 SP)

### 3. Core UI Components (src/ui) Refactoring (80 SP) ✅ COMPLETED

* [x] **3.1 Atoms (30 SP)**
  * [x] 3.1.1 Refactor `Button` component to `src/ui/atoms/Button/Button.tsx`. (5 SP)
    * [x] 3.1.1.1 Create `Button.test.tsx` for unit tests. (5 SP)
    * [x] 3.1.1.2 Create `Button.stories.tsx` for Storybook. (5 SP)
    * [x] 3.1.1.3 Create `README.md` for `Button`. (2 SP)
    * [x] 3.1.1.4 Create `index.ts` for barrel export. (1 SP)
  * [x] 3.1.2 Refactor `Avatar` component to `src/ui/atoms/Avatar/Avatar.tsx`. (5 SP)
    * [x] 3.1.2.1 Create `Avatar.test.tsx` for unit tests. (5 SP)
    * [x] 3.1.2.2 Create `Avatar.stories.tsx` for Storybook. (5 SP)
    * [x] 3.1.2.3 Create `README.md` for `Avatar`. (2 SP)
    * [x] 3.1.2.4 Create `index.ts` for barrel export. (1 SP)
  * [x] 3.1.3 Refactor `Icon` component to `src/ui/atoms/Icon/Icon.tsx`. (5 SP)
    * [x] 3.1.3.1 Create `Icon.test.tsx` for unit tests. (5 SP)
    * [x] 3.1.3.2 Create `Icon.stories.tsx` for Storybook. (5 SP)
    * [x] 3.1.3.3 Create `README.md` for `Icon`. (2 SP)
    * [x] 3.1.3.4 Create `index.ts` for barrel export. (1 SP)
  * [x] 3.1.4 Refactor `Input` component to `src/ui/atoms/Input/Input.tsx`. (5 SP)
    * [x] 3.1.4.1 Create `Input.test.tsx` for unit tests. (5 SP)
    * [x] 3.1.4.2 Create `Input.stories.tsx` for Storybook. (5 SP)
    * [x] 3.1.4.3 Create `README.md` for `Input`. (2 SP)
    * [x] 3.1.4.4 Create `index.ts` for barrel export. (1 SP)
  * [x] 3.1.5 Refactor `Typography` component to `src/ui/atoms/Typography/Typography.tsx`. (5 SP)
    * [x] 3.1.5.1 Create `Typography.test.tsx` for unit tests. (5 SP)
    * [x] 3.1.5.2 Create `Typography.stories.tsx` for Storybook. (5 SP)
    * [x] 3.1.5.3 Create `README.md` for `Typography`. (2 SP)
    * [x] 3.1.5.4 Create `index.ts` for barrel export. (1 SP)
  * [x] 3.1.6 Refactor `LoadingSpinner` component to `src/ui/atoms/LoadingSpinner/LoadingSpinner.tsx`. (3 SP)
    * [x] 3.1.6.1 Create `LoadingSpinner.test.tsx` for unit tests. (3 SP)
    * [x] 3.1.6.2 Create `index.ts` for barrel export. (1 SP)
  * [x] 3.1.7 Refactor `BackgroundPattern` component to `src/ui/atoms/BackgroundPattern/BackgroundPattern.tsx`. (3 SP)
    * [x] 3.1.7.1 Create `BackgroundPattern.test.tsx` for unit tests. (3 SP)
    * [x] 3.1.7.2 Create `BackgroundPattern.stories.tsx` for Storybook. (3 SP)
    * [x] 3.1.7.3 Create `README.md` for `BackgroundPattern`. (1 SP)
    * [x] 3.1.7.4 Create `index.ts` for barrel export. (1 SP)

* [x] **3.2 Molecules (30 SP)**
  * [x] 3.2.1 Refactor `Card` component to `src/ui/molecules/Card/Card.tsx`. (5 SP)
    * [x] 3.2.1.1 Create `Card.test.tsx` for unit tests. (5 SP)
    * [x] 3.2.1.2 Create `Card.stories.tsx` for Storybook. (5 SP)
    * [x] 3.2.1.3 Create `README.md` for `Card`. (2 SP)
    * [x] 3.2.1.4 Create `index.ts` for barrel export. (1 SP)
  * [x] 3.2.2 Refactor `ListItem` component to `src/ui/molecules/ListItem/ListItem.tsx`. (5 SP)
    * [x] 3.2.2.1 Create `ListItem.test.tsx` for unit tests. (5 SP)
    * [x] 3.2.2.2 Create `ListItem.stories.tsx` for Storybook. (5 SP)
    * [x] 3.2.2.3 Create `README.md` for `ListItem`. (2 SP)
    * [x] 3.2.2.4 Create `index.ts` for barrel export. (1 SP)
  * [x] 3.2.3 Refactor `NotificationItem` component to `src/ui/molecules/NotificationItem/NotificationItem.tsx`. (5 SP)
    * [x] 3.2.3.1 Create `NotificationItem.test.tsx` for unit tests. (5 SP)
    * [x] 3.2.3.2 Create `NotificationItem.stories.tsx` for Storybook. (5 SP)
    * [x] 3.2.3.3 Create `README.md` for `NotificationItem`. (2 SP)
    * [x] 3.2.3.4 Create `index.ts` for barrel export. (1 SP)
  * [x] 3.2.4 Refactor `ProgressBar` component to `src/ui/molecules/ProgressBar/ProgressBar.tsx`. (5 SP)
    * [x] 3.2.4.1 Create `ProgressBar.test.tsx` for unit tests. (5 SP)
    * [x] 3.2.4.2 Create `ProgressBar.stories.tsx` for Storybook. (5 SP)
    * [x] 3.2.4.3 Create `README.md` for `ProgressBar`. (2 SP)
    * [x] 3.2.4.4 Create `index.ts` for barrel export. (1 SP)
  * [x] 3.2.5 Refactor `QuickAction` component to `src/ui/molecules/QuickAction/QuickAction.tsx`. (5 SP)
    * [x] 3.2.5.1 Create `QuickAction.test.tsx` for unit tests. (5 SP)
    * [x] 3.2.5.2 Create `QuickAction.stories.tsx` for Storybook. (5 SP)
    * [x] 3.2.5.3 Create `README.md` for `QuickAction`. (2 SP)
    * [x] 3.2.5.4 Create `index.ts` for barrel export. (1 SP)
  * [x] 3.2.6 Refactor `StudentSelectionList` component to `src/ui/molecules/StudentSelectionList/StudentSelectionList.tsx`. (5 SP)
    * [x] 3.2.6.1 Create `StudentSelectionList.test.tsx` for unit tests. (5 SP)
    * [x] 3.2.6.2 Create `StudentSelectionList.stories.tsx` for Storybook. (5 SP)
    * [x] 3.2.6.3 Create `README.md` for `StudentSelectionList`. (2 SP)
    * [x] 3.2.6.4 Create `index.ts` for barrel export. (1 SP)
  * [x] 3.2.7 Refactor `BulkActionBar` component to `src/ui/molecules/BulkActionBar/BulkActionBar.tsx`. (5 SP)
    * [x] 3.2.7.1 Create `BulkActionBar.test.tsx` for unit tests. (5 SP)
    * [x] 3.2.7.2 Create `BulkActionBar.stories.tsx` for Storybook. (5 SP)
    * [x] 3.2.7.3 Create `README.md` for `BulkActionBar`. (2 SP)
    * [x] 3.2.7.4 Create `index.ts` for barrel export. (1 SP)
  * [x] 3.2.8 Refactor `BreadcrumbNavigation` component to `src/ui/molecules/BreadcrumbNavigation/BreadcrumbNavigation.tsx`. (3 SP)
    * [x] 3.2.8.1 Create `index.ts` for barrel export. (1 SP)
  * [x] 3.2.9 Refactor `EmptyState` component to `src/ui/molecules/EmptyState/EmptyState.tsx`. (3 SP)
    * [x] 3.2.9.1 Create `EmptyState.test.tsx` for unit tests. (3 SP)
  * [x] 3.2.10 Refactor `ErrorMessage` component to `src/ui/molecules/ErrorMessage/ErrorMessage.tsx`. (3 SP)
  * [x] 3.2.11 Refactor `SkeletonCard` component to `src/ui/molecules/SkeletonCard/SkeletonCard.tsx`. (3 SP)
    * [x] 3.2.11.1 Create `SkeletonCard.test.tsx` for unit tests. (3 SP)
  * [x] 3.2.12 Refactor `LogoutButton` component to `src/ui/molecules/LogoutButton.tsx`. (2 SP)

* [x] **3.3 Organisms (20 SP)**
  * [x] 3.3.1 Refactor `Header` component to `src/ui/organisms/Header/Header.tsx`. (5 SP)
    * [x] 3.3.1.1 Create `Header.test.tsx` for unit tests. (5 SP)
    * [x] 3.3.1.2 Create `Header.stories.tsx` for Storybook. (5 SP)
    * [x] 3.3.1.3 Create `README.md` for `Header`. (2 SP)
    * [x] 3.3.1.4 Create `index.ts` for barrel export. (1 SP)
  * [x] 3.3.2 Refactor `Modal` component to `src/ui/organisms/Modal/Modal.tsx`. (5 SP)
    * [x] 3.3.2.1 Create `Modal.test.tsx` for unit tests. (5 SP)
    * [x] 3.3.2.2 Create `Modal.stories.tsx` for Storybook. (5 SP)
    * [x] 3.3.2.3 Create `README.md` for `Modal`. (2 SP)
    * [x] 3.3.2.4 Create `index.ts` for barrel export. (1 SP)
  * [x] 3.3.3 Refactor `NavigationPanel` component to `src/ui/organisms/NavigationPanel/NavigationPanel.tsx`. (5 SP)
    * [x] 3.3.3.1 Create `NavigationPanel.test.tsx` for unit tests. (5 SP)
    * [x] 3.3.3.2 Create `NavigationPanel.stories.tsx` for Storybook. (5 SP)
    * [x] 3.3.3.3 Create `README.md` for `NavigationPanel`. (2 SP)
    * [x] 3.3.3.4 Create `index.ts` for barrel export. (1 SP)
  * [x] 3.3.4 Refactor `TabBar` component to `src/ui/organisms/TabBar/TabBar.tsx`. (5 SP)
    * [x] 3.3.4.1 Create `TabBar.test.tsx` for unit tests. (5 SP)
    * [x] 3.3.4.2 Create `TabBar.stories.tsx` for Storybook. (5 SP)
    * [x] 3.3.4.3 Create `README.md` for `TabBar`. (2 SP)
    * [x] 3.3.4.4 Create `index.ts` for barrel export. (1 SP)
  * [x] 3.3.5 Refactor `AddStudentsToClassModal` component to `src/ui/organisms/AddStudentsToClassModal/AddStudentsToClassModal.tsx`. (5 SP)
    * [x] 3.3.5.1 Create `AddStudentsToClassModal.test.tsx` for unit tests. (5 SP)
    * [x] 3.3.5.2 Create `AddStudentsToClassModal.stories.tsx` for Storybook. (5 SP)
    * [x] 3.3.5.3 Create `README.md` for `AddStudentsToClassModal`. (2 SP)
    * [x] 3.3.5.4 Create `index.ts` for barrel export. (1 SP)
  * [x] 3.3.6 Refactor `DashboardContent` component to `src/ui/organisms/DashboardContent/DashboardContent.tsx`. (3 SP)
    * [x] 3.3.6.1 Create `README.md` for `DashboardContent`. (1 SP)
    * [x] 3.3.6.2 Create `index.ts` for barrel export. (1 SP)
  * [x] 3.3.7 Refactor `ErrorBoundary` component to `src/ui/organisms/ErrorBoundary/ErrorBoundary.tsx`. (3 SP)
    * [x] 3.3.7.1 Create `index.ts` for barrel export. (1 SP)
  * [x] 3.3.8 Refactor `AnimatedSplashScreen` component to `src/ui/organisms/AnimatedSplashScreen.tsx`. (2 SP)
  * [x] 3.3.9 Refactor `AuthForm` component to `src/ui/organisms/AuthForm.tsx`. (2 SP)
  * [x] 3.3.10 Refactor `ClassFormModal` component to `src/ui/organisms/ClassFormModal.tsx`. (2 SP)
  * [x] 3.3.11 Refactor `StudentBoardingInfoModal` component to `src/ui/organisms/StudentBoardingInfoModal.tsx`. (2 SP)
  * [x] 3.3.12 Refactor `StudentCommunicationModal` component to `src/ui/organisms/StudentCommunicationModal.tsx`. (2 SP)
  * [x] 3.3.13 Refactor `StudentIncidentReportModal` component to `src/ui/organisms/StudentIncidentReportModal.tsx`. (2 SP)
  * [x] 3.3.14 Refactor `SubjectManager` component to `src/ui/organisms/SubjectManager.tsx`. (2 SP)
  * [x] 3.3.15 Refactor `TeacherBoardingInfoModal` component to `src/ui/organisms/TeacherBoardingInfoModal.tsx`. (2 SP)
  * [x] 3.3.16 Refactor `TeacherCommunicationModal` component to `src/ui/organisms/TeacherCommunicationModal.tsx`. (2 SP)
  * [x] 3.3.17 Refactor `TeacherIncidentReportModal` component to `src/ui/organisms/TeacherIncidentReportModal.tsx`. (2 SP)
  * [x] 3.3.18 Refactor `TeacherNotificationPanel` component to `src/ui/organisms/TeacherNotificationPanel.tsx`. (2 SP)
  * [x] 3.3.19 Refactor `TeacherProfileView` component to `src/ui/organisms/TeacherProfileView.tsx`. (2 SP)
* [x] **3.4 Templates (20 SP)**
  * [x] 3.4.1 Refactor `DashboardTemplate` to `src/ui/templates/DashboardTemplate/DashboardTemplate.tsx`. (5 SP)
    * [x] 3.4.1.1 Create `DashboardTemplate.test.tsx` for unit tests. (5 SP)
    * [x] 3.4.1.2 Create `DashboardTemplate.stories.tsx` for Storybook. (5 SP)
    * [x] 3.4.1.3 Create `README.md` for `DashboardTemplate`. (2 SP)
    * [x] 3.4.1.4 Create `index.ts` for barrel export. (1 SP)
  * [x] 3.4.2 Refactor `FormTemplate` to `src/ui/templates/FormTemplate/FormTemplate.tsx`. (5 SP)
    * [x] 3.4.2.1 Create `FormTemplate.test.tsx` for unit tests. (5 SP)
    * [x] 3.4.2.2 Create `FormTemplate.stories.tsx` for Storybook. (5 SP)
    * [x] 3.4.2.3 Create `README.md` for `FormTemplate`. (2 SP)
    * [x] 3.4.2.4 Create `index.ts` for barrel export. (1 SP)
  * [x] 3.4.3 Refactor `ModalTemplate` to `src/ui/templates/ModalTemplate/ModalTemplate.tsx`. (5 SP)
    * [x] 3.4.3.1 Create `ModalTemplate.test.tsx` for unit tests. (5 SP)
    * [x] 3.4.3.2 Create `ModalTemplate.stories.tsx` for Storybook. (5 SP)
    * [x] 3.4.3.3 Create `README.md` for `ModalTemplate`. (2 SP)
    * [x] 3.4.3.4 Create `index.ts` for barrel export. (1 SP)
  * [x] 3.4.4 Refactor `AddStudentTemplate` to `src/ui/templates/AddStudentTemplate.tsx`. (3 SP)
  * [x] 3.4.5 Refactor `AntiBullyingResourcesTemplate` to `src/ui/templates/AntiBullyingResourcesTemplate.tsx`. (3 SP)
  * [x] 3.4.6 Refactor `CCTVAccessRequestTemplate` to `src/ui/templates/CCTVAccessRequestTemplate.tsx`. (3 SP)
  * [x] 3.4.7 Refactor `ClassDetailTemplate` to `src/ui/templates/ClassDetailTemplate.tsx`. (3 SP)
  * [x] 3.4.8 Refactor `ClassDetailView` to `src/ui/templates/ClassDetailView.tsx`. (3 SP)
  * [x] 3.4.9 Refactor `ClassReportsTemplate` to `src/ui/templates/ClassReportsTemplate.tsx`. (3 SP)
  * [x] 3.4.10 Refactor `ClassScheduleTemplate` to `src/ui/templates/ClassScheduleTemplate.tsx`. (3 SP)
  * [x] 3.4.11 Refactor `ClassStudentsTemplate` to `src/ui/templates/ClassStudentsTemplate.tsx`. (3 SP)
  * [x] 3.4.12 Refactor `ClassesListTemplate` to `src/ui/templates/ClassesListTemplate.tsx`. (3 SP)
  * [x] 3.4.13 Refactor `ParentIncidentReportTemplate` to `src/ui/templates/ParentIncidentReportTemplate.tsx`. (3 SP)
  * [x] 3.4.14 Refactor `StudentAntiBullyingTemplate` to `src/ui/templates/StudentAntiBullyingTemplate.tsx`. (3 SP)
  * [x] 3.4.15 Refactor `StudentDetailTemplate` to `src/ui/templates/StudentDetailTemplate.tsx`. (3 SP)
  * [x] 3.4.16 Refactor `StudentIncidentReportTemplate` to `src/ui/templates/StudentIncidentReportTemplate.tsx`. (3 SP)
  * [x] 3.4.17 Refactor `StudentsListTemplate` to `src/ui/templates/StudentsListTemplate.tsx`. (3 SP)

### 4. Domain Logic (src/domains) Refactoring (120 SP)

* [x] **4.1 Class Domain (30 SP)**
  * [x] 4.1.1 Create `src/domains/class/api.ts` for Supabase interactions. (10 SP)
  * [x] 4.1.2 Create `src/domains/class/hooks.ts` for class-related React hooks. (10 SP)
  * [x] 4.1.3 Create `src/domains/class/store.ts` for global class state (Zustand). (5 SP)
  * [x] 4.1.4 Create `src/domains/class/types.ts` for class-related types. (3 SP)
  * [x] 4.1.5 Create `src/domains/class/Class.unit.test.ts`. (5 SP)
  * [x] 4.1.6 Create `src/domains/class/index.ts` for barrel export. (2 SP)
  * [x] 4.1.7 Migrate existing class-related service logic from `src/services/classService.ts` and `src/services/class/` to `src/domains/class/api.ts`. (15 SP)
* [x] **4.2 Incidents Domain (20 SP)**
  * [x] 4.2.1 Create `src/domains/incidents/api.ts` for Supabase interactions. (7 SP)
  * [x] 4.2.2 Create `src/domains/incidents/hooks.ts` for incident-related React hooks. (7 SP)
  * [x] 4.2.3 Create `src/domains/incidents/types.ts` for incident-related types. (3 SP)
  * [x] 4.2.4 Create `src/domains/incidents/index.ts` for barrel export. (2 SP)
  * [x] 4.2.5 Migrate existing incident-related service logic from `src/services/incidents.ts` to `src/domains/incidents/api.ts`. (10 SP)
* [x] **4.3 Users Domain (20 SP)**
  * [x] 4.3.1 Create `src/domains/users/api.ts` for Supabase interactions. (7 SP)
  * [x] 4.3.2 Create `src/domains/users/hooks.ts` for user-related React hooks. (7 SP)
  * [x] 4.3.3 Create `src/domains/users/types.ts` for user-related types. (3 SP)
  * [x] 4.3.4 Create `src/domains/users/index.ts` for barrel export. (2 SP)
  * [x] 4.3.5 Migrate existing user-related service logic from `src/services/users.ts` to `src/domains/users/api.ts`. (10 SP)
* [x] **4.4 Subjects Domain (20 SP)**
  * [x] 4.4.1 Create `src/domains/subjects/api.ts` for Supabase interactions. (7 SP)
  * [x] 4.4.2 Create `src/domains/subjects/hooks.ts` for subject-related React hooks. (7 SP)
  * [x] 4.4.3 Create `src/domains/subjects/types.ts` for subject-related types. (3 SP)
  * [x] 4.4.4 Create `src/domains/subjects/index.ts` for barrel export. (2 SP)
  * [x] 4.4.5 Migrate existing subject-related service logic from `src/services/subjectService.ts` to `src/domains/subjects/api.ts`. (10 SP)
* [x] **4.5 Dashboard Domain (10 SP)**
  * [x] 4.5.1 Create `src/domains/dashboard/api.ts` for Supabase interactions. (5 SP)
  * [x] 4.5.2 Create `src/domains/dashboard/hooks.ts` for dashboard-related React hooks. (5 SP)
  * [x] 4.5.3 Create `src/domains/dashboard/types.ts` for dashboard-related types. (2 SP)
  * [x] 4.5.4 Create `src/domains/dashboard/index.ts` for barrel export. (1 SP)
  * [x] 4.5.5 Migrate existing dashboard-related service logic from `src/services/dashboard.ts` to `src/domains/dashboard/api.ts`. (5 SP)
* [x] **4.6 Schools Domain (10 SP)**
  * [x] 4.6.1 Create `src/domains/schools/api.ts` for Supabase interactions. (5 SP)
  * [x] 4.6.2 Create `src/domains/schools/hooks.ts` for school-related React hooks. (5 SP)
  * [x] 4.6.3 Create `src/domains/schools/types.ts` for school-related types. (2 SP)
  * [x] 4.6.4 Create `src/domains/schools/index.ts` for barrel export. (1 SP)
  * [x] 4.6.5 Migrate existing school-related service logic from `src/services/schools.ts` to `src/domains/schools/api.ts`. (5 SP)
* [x] **4.7 Store Migration (20 SP)**
  * [x] 4.7.1 Migrate `src/stores/authStore.ts` to `src/context/AuthContext/` with React Context pattern. (8 SP)
    * [x] 4.7.1.1 **CRITICAL**: Preserve auth persistence behavior from Zustand's persist middleware. (included)
    * [x] 4.7.1.2 Implement AsyncStorage integration for React Native session persistence. (included)
    * [x] 4.7.1.3 Ensure proper auth state hydration on app startup to prevent logout on reload. (included)
  * [x] 4.7.2 Create domain-specific Zustand stores in each domain module where needed. (7 SP)
  * [x] 4.7.3 Update all store imports throughout the application. (5 SP)

### 5. Routing and Navigation (app/) Refactoring (60 SP) 🔄 PARTIALLY COMPLETED

* [x] **5.1 Authentication Flow (20 SP)**
  * [x] 5.1.1 Migrate `app/(auth)/login.tsx` to `app/(auth)/login/screen.tsx`. (5 SP)
    * [x] 5.1.1.1 Create `app/(auth)/login/model.ts`. (3 SP)
    * [x] 5.1.1.2 Create `app/(auth)/login/ui.tsx`. (3 SP)
    * [x] 5.1.1.3 Create `app/(auth)/login/store.ts` (optional, if local state needed). (2 SP)
    * [x] 5.1.1.4 Create `app/(auth)/login/Login.integration.test.tsx`. (5 SP)
    * [x] 5.1.1.5 Create `app/(auth)/login/Login.stories.tsx`. (3 SP)
    * [x] 5.1.1.6 Create `app/(auth)/login/index.ts`. (1 SP)
  * [x] 5.1.2 Migrate `app/(auth)/reset-password.tsx` to `app/(auth)/reset-password/screen.tsx`. (5 SP)
    * [x] 5.1.2.1 Create `app/(auth)/reset-password/model.ts`. (3 SP)
    * [x] 5.1.2.2 Create `app/(auth)/reset-password/ui.tsx`. (3 SP)
    * [x] 5.1.2.3 Create `app/(auth)/reset-password/index.ts`. (1 SP)
* [x] **5.2 Student Flow (20 SP)**
  * [x] 5.2.1 Migrate `app/(student)/dashboard.tsx` to `app/(student)/dashboard/screen.tsx`. (5 SP)
    * [x] 5.2.1.1 Create `app/(student)/dashboard/widgets/ScoreCard.tsx`. (3 SP)
    * [x] 5.2.1.2 Create `app/(student)/dashboard/widgets/ScoreCard.test.tsx`. (3 SP)
    * [x] 5.2.1.3 Create `app/(student)/dashboard/widgets/ScoreCard.stories.tsx`. (3 SP)
    * [x] 5.2.1.4 Create `app/(student)/dashboard/Dashboard.integration.test.tsx`. (5 SP)
    * [x] 5.2.1.5 Create `app/(student)/dashboard/index.ts`. (1 SP)
  * [x] 5.2.2 Migrate `app/(student)/quran-progress.tsx` to `app/(student)/quran-progress/screen.tsx`. (5 SP)
    * [x] 5.2.2.1 Create `app/(student)/quran-progress/model.ts`. (3 SP)
    * [x] 5.2.2.2 Create `app/(student)/quran-progress/ui.tsx`. (3 SP)
    * [x] 5.2.2.3 Create `app/(student)/quran-progress/index.ts`. (1 SP)
* [x] **5.3 Teacher Flow (20 SP)**
  * [x] 5.3.1 Migrate `app/(teacher)/class/[id]/add-students.tsx` to `app/(teacher)/class/[id]/add-students/screen.tsx`. (5 SP)
    * [x] 5.3.1.1 Create `app/(teacher)/class/[id]/add-students/model.ts`. (3 SP)
    * [x] 5.3.1.2 Create `app/(teacher)/class/[id]/add-students/ui.tsx`. (3 SP)
    * [x] 5.3.1.3 Create `app/(teacher)/class/[id]/add-students/store.ts`. (2 SP)
    * [x] 5.3.1.4 Create `app/(teacher)/class/[id]/add-students/AddStudents.integration.test.tsx`. (5 SP)
    * [x] 5.3.1.5 Create `app/(teacher)/class/[id]/add-students/AddStudents.e2e.spec.ts`. (5 SP)
    * [x] 5.3.1.6 Create `app/(teacher)/class/[id]/add-students/index.ts`. (1 SP)
  * [x] 5.3.2 Migrate `app/(teacher)/class/[id]/schedule/index.tsx` to `app/(teacher)/class/[id]/schedule/screen.tsx`. (5 SP)
    * [x] 5.3.2.1 Create `app/(teacher)/class/[id]/schedule/model.ts`. (3 SP)
    * [x] 5.3.2.2 Create `app/(teacher)/class/[id]/schedule/ui.tsx`. (3 SP)
    * [x] 5.3.2.3 Create `app/(teacher)/class/[id]/schedule/index.ts`. (1 SP)
  * [x] 5.3.3 Migrate `app/(teacher)/class/[id]/reports/index.tsx` to `app/(teacher)/class/[id]/reports/screen.tsx`. (5 SP)
    * [x] 5.3.3.1 Create `app/(teacher)/class/[id]/reports/model.ts`. (3 SP)
    * [x] 5.3.3.2 Create `app/(teacher)/class/[id]/reports/ui.tsx`. (3 SP)
    * [x] 5.3.3.3 Create `app/(teacher)/class/[id]/reports/index.ts`. (1 SP)

### 6. Enhanced Design System (src/design-system) Refactoring (45 SP) ✅ COMPLETED

**📋 NOTE:** The entire design system infrastructure has been built. The remaining work is integration and migration from old `src/styles/` system.

* [x] **6.1 Core Theme System (15 SP)**
  * [x] 6.1.1 Create theme composition engine (`design-system/core/theme-builder.ts`). (5 SP)
    * [x] 6.1.1.1 Implement `createTheme` function with deep merge capability.
    * [x] 6.1.1.2 Add support for base theme selection (light/dark).
    * [x] 6.1.1.3 Add role override and customization support.
  * [x] 6.1.2 Define comprehensive theme types (`design-system/core/types.ts`). (3 SP)
    * [x] 6.1.2.1 Create `ThemeConfig` interface.
    * [x] 6.1.2.2 Create `ThemeStrategy` interface.
    * [x] 6.1.2.3 Create enhanced `Theme` interface with component themes.
  * [x] 6.1.3 Create theme utilities (`design-system/core/utils.ts`). (3 SP)
    * [x] 6.1.3.1 Implement deep merge utility for theme composition.
    * [x] 6.1.3.2 Add color manipulation utilities (lighten, darken, contrast).
    * [x] 6.1.3.3 Create theme validation utilities.
  * [x] 6.1.4 Migrate existing theme system to new architecture. (4 SP)
    * [x] 6.1.4.1 Restructure `src/styles/` to `src/design-system/tokens/`.
    * [x] 6.1.4.2 Update existing theme exports to use new system.
    * [x] 6.1.4.3 Maintain backward compatibility during transition.

* [x] **6.2 Enhanced Design Tokens (10 SP)**
  * [x] 6.2.1 Enhance existing color tokens (`design-system/tokens/colors.ts`). (2 SP)
    * [x] 6.2.1.1 Add missing color variants and semantic mappings.
    * [x] 6.2.1.2 Ensure WCAG AA contrast compliance.
  * [x] 6.2.2 Create animation tokens (`design-system/tokens/animations.ts`). (3 SP)
    * [x] 6.2.2.1 Define duration scale (instant, fast, normal, slow).
    * [x] 6.2.2.2 Define easing functions (linear, spring, ease-in-out).
    * [x] 6.2.2.3 Create common transition presets (fade, slide, scale).
  * [x] 6.2.3 Create accessibility tokens (`design-system/tokens/accessibility.ts`). (3 SP)
    * [x] 6.2.3.1 Define minimum touch target sizes.
    * [x] 6.2.3.2 Define focus ring specifications.
    * [x] 6.2.3.3 Define reduced motion preferences.
  * [x] 6.2.4 Enhance existing tokens (typography, spacing, shadows). (2 SP)
    * [x] 6.2.4.1 Add missing typography variants.
    * [x] 6.2.4.2 Enhance spacing scale with semantic naming.
    * [x] 6.2.4.3 Add elevation-based shadow system.

* [x] **6.3 Theme Strategy System (10 SP)**
  * [x] 6.3.1 Create base theme configurations (`design-system/themes/base/`). (3 SP)
    * [x] 6.3.1.1 Create comprehensive light base theme.
    * [x] 6.3.1.2 Create comprehensive dark base theme.
    * [x] 6.3.1.3 Ensure proper contrast ratios and accessibility.
  * [x] 6.3.2 Create shared theme configuration (`design-system/themes/shared/`). (2 SP)
    * [x] 6.3.2.1 Define default shared theme for all roles.
    * [x] 6.3.2.2 Create theme configuration exports.
  * [x] 6.3.3 Create role-specific theme configurations (`design-system/themes/roles/`). (3 SP)
    * [x] 6.3.3.1 Create student theme configuration with teal primary.
    * [x] 6.3.3.2 Create teacher theme configuration with green primary.
    * [x] 6.3.3.3 Create parent theme configuration with orange primary.
    * [x] 6.3.3.4 Create management theme configuration with red primary.
  * [x] 6.3.4 Implement flexible ThemeProvider with strategy pattern. (2 SP)
    * [x] 6.3.4.1 Create enhanced ThemeProvider component.
    * [x] 6.3.4.2 Add dynamic theme resolution based on strategy.
    * [x] 6.3.4.3 Add memoization for performance optimization.

* [x] **6.4 Component Theme System (5 SP)**
  * [x] 6.4.1 Create component theme definitions (`design-system/components/`). (3 SP)
    * [x] 6.4.1.1 Create enhanced button component theme with variants.
    * [x] 6.4.1.2 Create card component theme with elevation levels.
    * [x] 6.4.1.3 Create modal component theme with size variants.
    * [x] 6.4.1.4 Create navigation component theme with role-specific colors.
  * [x] 6.4.2 Create enhanced style utilities (`design-system/utilities/`). (2 SP)
    * [x] 6.4.2.1 Migrate and enhance existing style helpers.
    * [x] 6.4.2.2 Add responsive design utilities.
    * [x] 6.4.2.3 Add animation and accessibility utilities.

* [x] **6.5 Developer Experience & Tools (5 SP)**
  * [x] 6.5.1 Create theme validation system. (2 SP)
    * [x] 6.5.1.1 Implement runtime theme validation.
    * [x] 6.5.1.2 Add contrast ratio checking.
    * [x] 6.5.1.3 Add required property validation.
  * [x] 6.5.2 Create theme debugging tools. (2 SP)
    * [x] 6.5.2.1 Create `useThemeDebugger` hook.
    * [x] 6.5.2.2 Add theme export and logging utilities.
    * [x] 6.5.2.3 Add development-only theme inspector.
  * [x] 6.5.3 Create theme configuration system. (1 SP)
    * [x] 6.5.3.1 Create `app/theme-config.ts` for strategy management.
    * [x] 6.5.3.2 Add easy switching between shared/role-based themes.

### 7. Shared Utilities & Helpers (src/lib) Refactoring (30 SP) ✅ COMPLETED

* [x] **7.1 Hooks (10 SP)** ✅ COMPLETED
  * [x] 7.1.1 Migrate `useAuth.ts` to `src/lib/hooks/useAuth.ts`. (3 SP)
  * [x] 7.1.2 Migrate `useClassStudentBreakdown.ts` to `src/lib/hooks/useClassStudentBreakdown.ts`. (3 SP)
  * [x] 7.1.3 Migrate `useClassStudentsSubscription.ts` to `src/lib/hooks/useClassStudentsSubscription.ts`. (3 SP)
  * [x] 7.1.4 Migrate `useNavigationGuards.ts` to `src/lib/hooks/useNavigationGuards.ts`. (3 SP)
  * [x] 7.1.5 Migrate `useNavigationHistory.ts` to `src/lib/hooks/useNavigationHistory.ts`. (3 SP)
  * [x] 7.1.6 Migrate `useStudentCountSubscription.ts` to `src/lib/hooks/useStudentCountSubscription.ts`. (3 SP)
  * [x] 7.1.7 Create `src/lib/hooks/usePrevious.ts`. (2 SP)
  * [x] 7.1.8 Create `src/lib/hooks/useDebounce.ts`. (2 SP)
* [x] **7.2 Utils (10 SP)** ✅ COMPLETED
  * [x] 7.2.1 Migrate `logger.ts` to `src/lib/utils/logger.ts`. (3 SP)
  * [x] 7.2.2 Migrate `dateHelpers.ts` to `src/lib/utils/date.ts`. (3 SP)
  * [x] 7.2.3 Migrate `idConversion.ts` to `src/lib/utils/idConversion.ts`. (3 SP)
  * [x] 7.2.4 Migrate `linking.ts` to `src/lib/utils/linking.ts`. (3 SP)
  * [x] 7.2.5 Migrate `navigationGuard.ts` to `src/lib/utils/navigationGuard.ts`. (3 SP)
  * [x] 7.2.6 Migrate `responsive.ts` to `src/lib/utils/responsive.ts`. (3 SP)
  * [x] 7.2.7 Migrate `retry.ts` to `src/lib/utils/retry.ts`. (3 SP)
  * [x] 7.2.8 Migrate `sanitization.ts` to `src/lib/utils/sanitization.ts`. (3 SP)
  * [x] 7.2.9 Remove `styleHelpers.ts` migration (now handled by design-system). (0 SP)
  * [x] 7.2.10 Migrate `supabase.ts` to `src/lib/utils/supabase.ts`. (3 SP)
  * [x] 7.2.11 Migrate `svgPatterns.ts` to `src/lib/utils/svgPatterns.ts`. (3 SP)
  * [x] 7.2.12 Migrate `typeHelpers.ts` to `src/lib/utils/typeHelpers.ts`. (3 SP)
  * [x] 7.2.13 Migrate `backgroundPattern.ts` to `src/lib/utils/backgroundPattern.ts`. (3 SP)
* [x] **7.3 Constants (5 SP)** ✅ COMPLETED
  * [x] 7.3.1 Create `src/lib/constants/roleCapabilities.ts` for RBAC. (5 SP)
* [x] **7.4 Tests (5 SP)** ✅ COMPLETED
  * [x] 7.4.1 Create `src/lib/tests/renderWithProviders.tsx`. (3 SP)
  * [x] 7.4.2 Create `src/lib/tests/navigationMock.ts`. (2 SP)

### 8. Global State & Context (src/context) Refactoring (20 SP) ✅ COMPLETED

* [x] **8.1 Auth Context (5 SP)**
  * [x] 8.1.1 Migrate `AuthContext.tsx` to `src/context/AuthContext/AuthProvider.tsx`. (5 SP)
    * [x] 8.1.1.1 Create `src/context/AuthContext/useAuth.ts`. (3 SP)
    * [x] 8.1.1.2 Create `src/context/AuthContext/AuthContext.test.tsx`. (3 SP)
    * [x] 8.1.1.3 Create `src/context/AuthContext/index.ts`. (1 SP)
* [x] **8.2 Enhanced Theme Context (10 SP)**
  * [x] 8.2.1 Integrate enhanced ThemeProvider with design-system. (5 SP)
    * [x] 8.2.1.1 Update ThemeProvider to use new theme strategy system.
    * [x] 8.2.1.2 Add support for dynamic theme switching.
    * [x] 8.2.1.3 Implement theme memoization for performance.
  * [x] 8.2.2 Create theme configuration integration. (3 SP)
    * [x] 8.2.2.1 Connect theme-config.ts to ThemeProvider.
    * [x] 8.2.2.2 Add runtime theme validation.
  * [x] 8.2.3 Migrate existing ThemeContext usage. (2 SP)
    * [x] 8.2.3.1 Update all theme hook usages.
    * [x] 8.2.3.2 Create backward compatibility layer.
* [x] **8.3 Navigation Context (5 SP)**
  * [x] 8.3.1 Migrate `NavigationHistoryContext.tsx` to `src/context/NavigationHistoryContext/NavigationHistoryContext.tsx`. (5 SP)
    * [x] 8.3.1.1 Create `src/context/NavigationHistoryContext/index.ts`. (1 SP)

### 9. Global Type Declarations (src/types) Refactoring (10 SP)

* [ ] **9.1 Type Consolidation (10 SP)**
  * [ ] 9.1.1 Consolidate all global type declarations into `src/types/index.ts`. (10 SP)
    * [ ] 9.1.1.1 Migrate `class.ts` types.
    * [ ] 9.1.1.2 Migrate `dashboard.ts` types.
    * [ ] 9.1.1.3 Migrate `database.ts` types.
    * [ ] 9.1.1.4 Migrate `exports.ts` types.
    * [ ] 9.1.1.5 Migrate `student.ts` types.

### 10. Testing Infrastructure (20 SP)

* [ ] **10.1 Jest Configuration (5 SP)**
  * [ ] 10.1.1 Configure Jest for new project structure. (5 SP)
    * [ ] 10.1.1.1 Update `jest.setup.js` to `jest/setup.ts`.
    * [ ] 10.1.1.2 Create `jest/mocks/fileMock.js`.
    * [ ] 10.1.1.3 Create `jest/mocks/svgMock.js`.
* [ ] **10.2 Storybook Configuration (5 SP)**
  * [ ] 10.2.1 Configure Storybook for new UI component structure. (5 SP)
    * [ ] 10.2.1.1 Create `.storybook/main.js`.
    * [ ] 10.2.1.2 Create `.storybook/preview.js`.
* [ ] **10.3 E2E Testing Setup (10 SP)**
  * [ ] 10.3.1 Set up E2E testing with Detox/Playwright. (10 SP)
    * [ ] 10.3.1.1 Create `e2e/add-students-flow.spec.ts` as an example.

### 11. Migration Validation & Checkpoints (25 SP)

* [ ] **11.1 Phase Validation (20 SP)**
  * [ ] 11.1.1 Checkpoint 1: Validate infrastructure setup and path aliases working. (3 SP)
  * [ ] 11.1.2 Checkpoint 2: Validate parallel structure creation and dual imports. (3 SP)
  * [ ] 11.1.3 Checkpoint 3: Validate UI component migration and import updates. (5 SP)
  * [ ] 11.1.4 Checkpoint 4: Validate domain migration and service replacement. (5 SP)
  * [ ] 11.1.5 Checkpoint 5: Validate feature slice migration and routing. (4 SP)
* [ ] **11.2 Migration Scripts (5 SP)**
  * [ ] 11.2.1 Run automated import path validation after each phase. (3 SP)
  * [ ] 11.2.2 Execute performance benchmarking before/after migration. (2 SP)

### 12. Cleanup & Final Verification (20 SP)

* [ ] **12.1 Legacy Cleanup (8 SP)**
  * [ ] 12.1.1 Remove old `src/components/` directory after UI migration complete. (3 SP)
  * [ ] 12.1.2 Remove old `src/services/` directory after domain migration complete. (3 SP)
  * [ ] 12.1.3 Remove old `src/hooks/` and `src/utils/` after lib migration complete. (2 SP)
  * [ ] 12.1.4 Remove old `src/styles/` directory after design-system migration complete. (0 SP)
* [ ] **12.2 Final Validation (12 SP)**
  * [ ] 12.2.1 Run complete test suite (unit, integration, e2e) for final validation. (5 SP)
  * [ ] 12.2.2 Perform comprehensive code review for architectural compliance. (3 SP)
  * [ ] 12.2.3 Update `README.md` and all documentation with new structure. (2 SP)
  * [ ] 12.2.4 Create migration completion report and lessons learned. (2 SP)

### 13. Rollback Procedures (15 SP)

* [ ] **13.1 Rollback Scripts (15 SP)**
  * [ ] 13.1.1 Create rollback scripts for each migration phase. (8 SP)
  * [ ] 13.1.2 Test rollback procedures in development environment. (4 SP)
  * [ ] 13.1.3 Document rollback procedures and emergency contacts. (3 SP)

## Migration Scripts Usage

### Setup Scripts
```bash
# Make scripts executable
chmod +x scripts/migration/*.js

# Install dependencies (if needed)
npm install
```

### Import Migration Scripts
```bash
# Migrate UI components
node scripts/migration/update-imports.js --phase=ui-components

# Migrate domain services
node scripts/migration/update-imports.js --phase=domains

# Migrate library utilities
node scripts/migration/update-imports.js --phase=lib

# Dry run (preview changes)
node scripts/migration/update-imports.js --phase=ui-components --dry-run
```

### Validation Scripts
```bash
# Validate all imports
node scripts/migration/validate-imports.js

# Check only broken imports
node scripts/migration/validate-imports.js --check-broken-imports

# Check unused exports
node scripts/migration/validate-imports.js --check-unused-exports
```

### Rollback Scripts
```bash
# List available backups
node scripts/migration/rollback.js --list-backups

# Rollback to specific phase
node scripts/migration/rollback.js --to-phase=2 --force

# Rollback to checkpoint
node scripts/migration/rollback.js --to-checkpoint=ui-components --force
```

### Package.json Scripts
Add these scripts to package.json for easier usage:
```json
{
  "scripts": {
    "migrate:ui": "node scripts/migration/update-imports.js --phase=ui-components",
    "migrate:domains": "node scripts/migration/update-imports.js --phase=domains",
    "migrate:lib": "node scripts/migration/update-imports.js --phase=lib",
    "migrate:validate": "node scripts/migration/validate-imports.js",
    "migrate:rollback": "node scripts/migration/rollback.js",
    "migrate:dry-run": "node scripts/migration/update-imports.js --dry-run"
  }
}
```

### Total Estimated Story Points: ~440 SP

## Migration Checklist

### Pre-Migration
* [x] Backup entire codebase
* [x] Ensure all tests pass
* [x] Create feature branch for migration
* [x] Review migration scripts and validate on small subset

### Phase Execution
* [x] Phase 1: Infrastructure Setup (35 SP) ✅ COMPLETED
* [x] Phase 2: Parallel Structure Creation (20 SP) ✅ COMPLETED
* [x] Phase 3: UI Components Migration (80 SP) ✅ COMPLETED
* [x] Phase 4: Domain Migration (120 SP) ✅ COMPLETED
* [x] Phase 5: Feature Slice Migration (60 SP) ✅ PARTIAL
* [x] Phase 6: Enhanced Design System (45 SP) ✅ COMPLETED
* [ ] Phase 7: Library Migration (30 SP) 🚀 CURRENT
* [ ] Phase 7: Context Migration (15 SP)
* [ ] Phase 8: Types Migration (10 SP)
* [ ] Phase 9: Testing Infrastructure (20 SP)
* [ ] Phase 10: Migration Validation (25 SP)
* [ ] Phase 11: Cleanup & Final Verification (20 SP)
* [ ] Phase 12: Rollback Procedures (15 SP)

### Post-Migration
* [ ] Run full test suite
* [ ] Performance benchmarking
* [ ] Code review and documentation update
* [ ] Deploy to staging environment
* [ ] Monitor for issues and gather feedback