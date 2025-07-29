## Existing Codebase Structure
```
. 📂 MadraXis
├── 📄 DEEP_LINKING_GUIDE.md
├── 📄 README.md
└── 📂 android/
└── 📂 app/
├── 📄 app.config.js
│  └── 📂 (auth)/
│    ├── 📄 _layout.tsx
│    ├── 📄 login.tsx
│    ├── 📄 reset-password.tsx
│  └── 📂 (management)/
│    ├── 📄 _layout.tsx
│    ├── 📄 dashboard.tsx
│    ├── 📄 index.tsx
│    ├── 📄 setup.tsx
│    ├── 📄 user-management.tsx
│  └── 📂 (parent)/
│    ├── 📄 _layout.tsx
│    ├── 📄 anti-bullying.tsx
│    ├── 📄 cctv-request.tsx
│    ├── 📄 dashboard.tsx
│    ├── 📄 incident-report.tsx
│    ├── 📄 index.tsx
│  └── 📂 (student)/
│    ├── 📄 _layout.tsx
│    ├── 📄 anti-bullying.tsx
│    ├── 📄 boarding-info.tsx
│    ├── 📄 dashboard.tsx
│    ├── 📄 incident-report.tsx
│    ├── 📄 index.tsx
│    ├── 📄 quran-progress.tsx
│    ├── 📄 schedule.tsx
│  └── 📂 (teacher)/
│    ├── 📄 _layout.tsx
│    └── 📂 class/
│      └── 📂 [id]/
│        ├── 📄 add-students.tsx
│        ├── 📄 index.tsx
│        └── 📂 reports/
│          ├── 📄 index.tsx
│        └── 📂 schedule/
│          ├── 📄 index.tsx
│        └── 📂 students/
│          ├── 📄 index.tsx
│      ├── 📄 index.tsx
│    ├── 📄 dashboard.tsx
│    ├── 📄 index.tsx
│    └── 📂 students/
│      ├── 📄 [id].tsx
│      ├── 📄 add.tsx
│      ├── 📄 index.tsx
│  ├── 📄 _layout.tsx
│  ├── 📄 index.tsx
└── 📂 assets/
│  └── 📂 animations/
│    ├── 📄 splash.json
│    ├── 📄 splash_screen.riv
│  └── 📂 fonts/
│    ├── 📄 SpaceMono-Regular.ttf
│  └── 📂 images/
│    ├── 📄 adaptive-icon.png
│    ├── 📄 favicon.png
│    ├── 📄 icon.png
│    ├── 📄 partial-react-logo.png
│    ├── 📄 react-logo.png
│    ├── 📄 react-logo@2x.png
│    ├── 📄 react-logo@3x.png
│    ├── 📄 splash.png
│    └── 📂 svg/
│      ├── 📄 logo.svg
│      └── 📂 onboarding/
│        ├── 📄 onboarding1.svg
│        ├── 📄 onboarding2.svg
│        ├── 📄 onboarding3.svg
│      ├── 📄 zaid_logo.svg
│    ├── 📄 zaid_logo.png
├── 📄 babel.config.js
├── 📄 bun.lock
└── 📂 docs/
│  └── 📂 management/
│    ├── 📄 prd-management-overview.md
│  └── 📂 parents/
│    ├── 📄 prd-parents-school-edition.md
│  └── 📂 specs/
│    └── 📂 completed/
│      └── 📂 class-subject-crud/
│        ├── 📄 design.md
│        ├── 📄 refactor_tasks.md
│        ├── 📄 requirements.md
│        ├── 📄 tasks.md
│      └── 📂 consistent-design-system/
│        ├── 📄 COMMIT_STRATEGY.md
│        ├── 📄 component-documentation.md
│        ├── 📄 design.md
│        ├── 📄 migration-guide.md
│        ├── 📄 project_discovery.md
│        ├── 📄 requirements.md
│        ├── 📄 tasks.md
│      └── 📂 refactor-directory-structure/
│        ├── 📄 REMAINING_WORK.md
│        ├── 📄 design.md
│        ├── 📄 requirements.md
│        ├── 📄 tasks.md
│      └── 📂 refactor-router-structure/
│        ├── 📄 design.md
│        ├── 📄 requirements.md
│        ├── 📄 tasks.md
│    └── 📂 in-progress/
│      └── 📂 add-students-to-classes/
│        ├── 📄 app-config-update-plan.md
│        ├── 📄 debug-tasks.md
│        ├── 📄 deep-linking-plan.md
│        ├── 📄 design.md
│        ├── 📄 error-boundary-implementation-plan.md
│        ├── 📄 navigation-implementation-plan.md
│        ├── 📄 quality-assessment-report.md
│        ├── 📄 requirements.md
│        ├── 📄 sql-injection-fix.md
│        ├── 📄 tasks.md
│    └── 📂 planned/
│      └── 📂 financial-management-phase1/
│        ├── 📄 design.md
│        ├── 📄 requirements.md
│        ├── 📄 tasks.md
│    ├── 📄 teacher_calendar_spec.md
│  └── 📂 students/
│    └── 📂 features/
│      ├── 📄 prd-add-students-to-classes.md
│      ├── 📄 prd-goal-setting-weekend-focus.md
│    ├── 📄 prd-students-overview.md
│  └── 📂 teachers/
│    └── 📂 features/
│      ├── 📄 prd-class-subject-crud.md
│      ├── 📄 prd-classroom-management.md
│      ├── 📄 prd-subject-management.md
│      ├── 📄 prd-teacher-calendar-schedule.md
│    ├── 📄 prd-teachers-overview.md
├── 📄 eas.json
├── 📄 eslint.config.js
├── 📄 jest.setup.js
├── 📄 metro.config.js
├── 📄 package.json
└── 📂 scripts/
│  └── 📂 security/
│    ├── 📄 README.md
│    ├── 📄 audit-auth.js
│    ├── 📄 audit-input.js
│    ├── 📄 audit-logging.js
│    ├── 📄 fix-logging.js
│    ├── 📄 test-fix-logging.js
└── 📂 src/
│  └── 📂 components/
│    ├── 📄 LogoIcon.tsx
│    └── 📂 atoms/
│      └── 📂 Avatar/
│        ├── 📄 Avatar.stories.tsx
│        ├── 📄 Avatar.test.tsx
│        ├── 📄 Avatar.tsx
│        ├── 📄 README.md
│        ├── 📄 index.ts
│      └── 📂 BackgroundPattern/
│        ├── 📄 BackgroundPattern.stories.tsx
│        ├── 📄 BackgroundPattern.test.tsx
│        ├── 📄 BackgroundPattern.tsx
│        ├── 📄 README.md
│        ├── 📄 index.ts
│      └── 📂 Button/
│        ├── 📄 Button.stories.tsx
│        ├── 📄 Button.test.tsx
│        ├── 📄 Button.tsx
│        ├── 📄 README.md
│        ├── 📄 index.ts
│      └── 📂 Icon/
│        ├── 📄 Icon.stories.tsx
│        ├── 📄 Icon.test.tsx
│        ├── 📄 Icon.tsx
│        ├── 📄 README.md
│        ├── 📄 index.ts
│      └── 📂 Input/
│        ├── 📄 Input.stories.tsx
│        ├── 📄 Input.test.tsx
│        ├── 📄 Input.tsx
│        ├── 📄 README.md
│        ├── 📄 index.ts
│      └── 📂 LoadingSpinner/
│        ├── 📄 LoadingSpinner.test.tsx
│        ├── 📄 LoadingSpinner.tsx
│        ├── 📄 index.ts
│      └── 📂 Typography/
│        ├── 📄 README.md
│        ├── 📄 Typography.stories.tsx
│        ├── 📄 Typography.test.tsx
│        ├── 📄 Typography.tsx
│        ├── 📄 index.ts
│      ├── 📄 index.ts
│    ├── 📄 index.ts
│    └── 📂 molecules/
│      └── 📂 BreadcrumbNavigation/
│        ├── 📄 BreadcrumbNavigation.tsx
│        ├── 📄 index.ts
│      └── 📂 BulkActionBar/
│        ├── 📄 BulkActionBar.stories.tsx
│        ├── 📄 BulkActionBar.test.tsx
│        ├── 📄 BulkActionBar.tsx
│        ├── 📄 README.md
│        ├── 📄 index.ts
│      └── 📂 Card/
│        ├── 📄 Card.stories.tsx
│        ├── 📄 Card.test.tsx
│        ├── 📄 Card.tsx
│        ├── 📄 README.md
│        ├── 📄 index.ts
│      └── 📂 EmptyState/
│        ├── 📄 EmptyState.test.tsx
│        ├── 📄 EmptyState.tsx
│      └── 📂 ErrorMessage/
│        ├── 📄 ErrorMessage.tsx
│      └── 📂 ListItem/
│        ├── 📄 ListItem.stories.tsx
│        ├── 📄 ListItem.test.tsx
│        ├── 📄 ListItem.tsx
│        ├── 📄 README.md
│        ├── 📄 index.ts
│      ├── 📄 LogoutButton.tsx
│      └── 📂 NotificationItem/
│        ├── 📄 NotificationItem.stories.tsx
│        ├── 📄 NotificationItem.test.tsx
│        ├── 📄 NotificationItem.tsx
│        ├── 📄 README.md
│        ├── 📄 index.ts
│      └── 📂 ProgressBar/
│        ├── 📄 ProgressBar.stories.tsx
│        ├── 📄 ProgressBar.test.tsx
│        ├── 📄 ProgressBar.tsx
│        ├── 📄 README.md
│        ├── 📄 index.ts
│      └── 📂 QuickAction/
│        ├── 📄 QuickAction.stories.tsx
│        ├── 📄 QuickAction.test.tsx
│        ├── 📄 QuickAction.tsx
│        ├── 📄 README.md
│        ├── 📄 index.ts
│      └── 📂 SkeletonCard/
│        ├── 📄 SkeletonCard.test.tsx
│        ├── 📄 SkeletonCard.tsx
│      └── 📂 StudentSelectionList/
│        ├── 📄 README.md
│        ├── 📄 StudentSelectionItem.tsx
│        ├── 📄 StudentSelectionList.stories.tsx
│        ├── 📄 StudentSelectionList.test.tsx
│        ├── 📄 StudentSelectionList.tsx
│        ├── 📄 index.ts
│      ├── 📄 index.ts
│    └── 📂 organisms/
│      └── 📂 AddStudentsToClassModal/
│        ├── 📄 AddStudentsToClassModal.stories.tsx
│        ├── 📄 AddStudentsToClassModal.test.tsx
│        ├── 📄 AddStudentsToClassModal.tsx
│        ├── 📄 README.md
│        ├── 📄 index.ts
│      ├── 📄 AnimatedSplashScreen.tsx
│      ├── 📄 AuthForm.tsx
│      ├── 📄 ClassFormModal.tsx
│      └── 📂 DashboardContent/
│        ├── 📄 DashboardContent.tsx
│        ├── 📄 README.md
│        ├── 📄 index.ts
│      └── 📂 ErrorBoundary/
│        ├── 📄 ErrorBoundary.tsx
│        ├── 📄 index.ts
│      └── 📂 Header/
│        ├── 📄 Header.stories.tsx
│        ├── 📄 Header.test.tsx
│        ├── 📄 Header.tsx
│        ├── 📄 README.md
│        ├── 📄 index.ts
│      └── 📂 Modal/
│        ├── 📄 Modal.stories.tsx
│        ├── 📄 Modal.test.tsx
│        ├── 📄 Modal.tsx
│        ├── 📄 README.md
│        ├── 📄 index.ts
│      └── 📂 NavigationPanel/
│        ├── 📄 NavigationPanel.stories.tsx
│        ├── 📄 NavigationPanel.test.tsx
│        ├── 📄 NavigationPanel.tsx
│        ├── 📄 README.md
│        ├── 📄 index.ts
│      ├── 📄 StudentBoardingInfoModal.tsx
│      ├── 📄 StudentCommunicationModal.tsx
│      ├── 📄 StudentIncidentReportModal.tsx
│      ├── 📄 SubjectManager.tsx
│      └── 📂 TabBar/
│        ├── 📄 README.md
│        ├── 📄 TabBar.stories.tsx
│        ├── 📄 TabBar.test.tsx
│        ├── 📄 TabBar.tsx
│        ├── 📄 index.ts
│      ├── 📄 TeacherBoardingInfoModal.tsx
│      ├── 📄 TeacherCommunicationModal.tsx
│      ├── 📄 TeacherIncidentReportModal.tsx
│      ├── 📄 TeacherNotificationPanel.tsx
│      ├── 📄 TeacherProfileView.tsx
│      ├── 📄 index.ts
│    └── 📂 templates/
│      ├── 📄 AddStudentTemplate.tsx
│      ├── 📄 AntiBullyingResourcesTemplate.tsx
│      ├── 📄 CCTVAccessRequestTemplate.tsx
│      ├── 📄 ClassDetailTemplate.tsx
│      ├── 📄 ClassDetailView.tsx
│      ├── 📄 ClassReportsTemplate.tsx
│      ├── 📄 ClassScheduleTemplate.tsx
│      ├── 📄 ClassStudentsTemplate.tsx
│      ├── 📄 ClassesListTemplate.tsx
│      └── 📂 DashboardTemplate/
│        ├── 📄 DashboardTemplate.stories.tsx
│        ├── 📄 DashboardTemplate.test.tsx
│        ├── 📄 DashboardTemplate.tsx
│        ├── 📄 README.md
│        ├── 📄 index.ts
│      └── 📂 FormTemplate/
│        ├── 📄 FormTemplate.stories.tsx
│        ├── 📄 FormTemplate.test.tsx
│        ├── 📄 FormTemplate.tsx
│        ├── 📄 README.md
│        ├── 📄 index.ts
│      └── 📂 ModalTemplate/
│        ├── 📄 ModalTemplate.stories.tsx
│        ├── 📄 ModalTemplate.test.tsx
│        ├── 📄 ModalTemplate.tsx
│        ├── 📄 README.md
│        ├── 📄 index.ts
│      ├── 📄 ParentIncidentReportTemplate.tsx
│      ├── 📄 StudentAntiBullyingTemplate.tsx
│      ├── 📄 StudentDetailTemplate.tsx
│      ├── 📄 StudentIncidentReportTemplate.tsx
│      ├── 📄 StudentsListTemplate.tsx
│      ├── 📄 index.ts
│  └── 📂 context/
│    ├── 📄 NavigationHistoryContext.tsx
│    ├── 📄 ThemeContext.tsx
│    └── 📂 __tests__/
│      ├── 📄 NavigationHistoryContext.test.tsx
│    ├── 📄 index.ts
│  └── 📂 hooks/
│    ├── 📄 README.md
│    ├── 📄 index.ts
│    ├── 📄 useAuth.ts
│    ├── 📄 useClassStudentBreakdown.ts
│    ├── 📄 useClassStudentsSubscription.ts
│    ├── 📄 useNavigationGuards.ts
│    ├── 📄 useNavigationHistory.ts
│    ├── 📄 useStudentCountSubscription.ts
│  └── 📂 mocks/
│    ├── 📄 classData.ts
│  └── 📂 services/
│    └── 📂 __tests__/
│      ├── 📄 README.md
│      ├── 📄 classService.security.test.ts
│      ├── 📄 classService.simple.test.ts
│      ├── 📄 classService.test.ts
│      ├── 📄 integration.test.ts
│      ├── 📄 runTests.ts
│      ├── 📄 test-report.json
│      ├── 📄 test-report.md
│      ├── 📄 testHelpers.ts
│      ├── 📄 verify-completion.ts
│    └── 📂 class/
│      └── 📂 __tests__/
│        ├── 📄 access.test.ts
│        ├── 📄 enrollment.test.ts
│      ├── 📄 access.ts
│      ├── 📄 audit.ts
│      ├── 📄 bulk.ts
│      ├── 📄 enrollment.ts
│      ├── 📄 index.ts
│      ├── 📄 repository.ts
│      ├── 📄 types.ts
│    ├── 📄 classService.ts
│    ├── 📄 dashboard.ts
│    ├── 📄 incidents.ts
│    ├── 📄 schools.ts
│    ├── 📄 subjectService.ts
│    ├── 📄 users.ts
│  └── 📂 stores/
│    ├── 📄 authStore.ts
│    ├── 📄 index.ts
│  └── 📂 styles/
│    ├── 📄 colors.ts
│    ├── 📄 shadows.ts
│    ├── 📄 spacing.ts
│    ├── 📄 theme.ts
│    ├── 📄 typography.ts
│  └── 📂 types/
│    ├── 📄 class.ts
│    ├── 📄 dashboard.ts
│    ├── 📄 database.ts
│    ├── 📄 exports.ts
│    ├── 📄 index.ts
│    ├── 📄 student.ts
│  └── 📂 utils/
│    └── 📂 __tests__/
│      ├── 📄 deep-linking.test.ts
│      ├── 📄 retry-debug.test.ts
│      ├── 📄 retry.test.ts
│      ├── 📄 sanitization.test.ts
│    ├── 📄 backgroundPattern.ts
│    ├── 📄 dateHelpers.ts
│    ├── 📄 idConversion.ts
│    ├── 📄 linking.ts
│    ├── 📄 logger.ts
│    ├── 📄 navigationGuard.ts
│    ├── 📄 responsive.ts
│    ├── 📄 retry.ts
│    ├── 📄 sanitization.ts
│    ├── 📄 styleHelpers.ts
│    ├── 📄 supabase.ts
│    ├── 📄 svgPatterns.ts
│    ├── 📄 typeHelpers.ts
└── 📂 supabase/
│  └── 📂 tests/
│    ├── 📄 schema-polish-tests.sql
├── 📄 test_atomic_enrollment.ts
└── 📄 tsconfig.json
```

## Target Codebase Structure

### Architecture Overview

- UI Components: Atomic design pattern (atoms → molecules → organisms)
- Domains: Business logic separated from UI concerns
- Context: React context providers for global state
- Lib: Shared utilities, hooks, and helpers
- Testing: Unit, integration, e2e, and Storybook stories
- Feature Slices: Each feature contains screen, model, ui, store, tests

```
MadraXis
+-- app                            # Expo Router surface
|   +-- _layout.tsx
|   +-- (auth)
|   |   +-- _layout.tsx
|   |   +-- login
|   |   |   +-- screen.tsx
|   |   |   +-- model.ts
|   |   |   +-- ui.tsx
|   |   |   +-- store.ts                     # optional local Zustand store
|   |   |   +-- Login.integration.test.tsx
|   |   |   +-- Login.stories.tsx
|   |   |   +-- Login.md
|   |   |   +-- index.ts                     # barrel for cleaner imports
|   |   +-- reset-password
|   |       ...                              # same pattern as login
|   |
|   +-- (student)
|   |   +-- dashboard
|   |   |   +-- screen.tsx
|   |   |   +-- widgets
|   |   |   |   +-- ScoreCard.tsx
|   |   |   |   +-- ScoreCard.test.tsx
|   |   |   |   +-- ScoreCard.stories.tsx
|   |   |   +-- Dashboard.integration.test.tsx
|   |   |   +-- index.ts
|   |   +-- quran-progress
|   |       ...                              # same pattern
|   |
|   +-- (teacher)
|       +-- class
|           +-- [id]
|               +-- add-students
|               |   +-- screen.tsx
|               |   +-- model.ts
|               |   +-- ui.tsx
|               |   +-- store.ts
|               |   +-- AddStudents.integration.test.tsx
|               |   +-- AddStudents.e2e.spec.ts
|               |   +-- index.ts
|               +-- schedule
|               |   ...                      # schedule feature
|               +-- reports
|                   ...                      # reports feature
|
+-- src
|   +-- ui                                   # pure, role-agnostic visual kit
|   |   +-- atoms
|   |   |   +-- Button
|   |   |   |   +-- Button.tsx
|   |   |   |   +-- Button.test.tsx
|   |   |   |   +-- Button.stories.tsx
|   |   |   |   +-- README.md
|   |   |   |   +-- index.ts
|   |   |   +-- Avatar
|   |   |       ...                          # same layout
|   |   +-- molecules
|   |   |   +-- Card
|   |   |       ...                          # files as above
|   |   +-- organisms
|   |   |   +-- Header
|   |   |       ...
|   |   +-- index.ts                         # exports everything from ui/*
|   |
|   +-- domains                              # business logic, no RN imports
|   |   +-- class
|   |   |   +-- api.ts
|   |   |   +-- hooks.ts
|   |   |   +-- store.ts                     # global class state (zustand)
|   |   |   +-- types.ts
|   |   |   +-- Class.unit.test.ts
|   |   |   +-- index.ts
|   |   +-- incidents
|   |   |   +-- api.ts
|   |   |   +-- hooks.ts
|   |   |   +-- types.ts
|   |   |   +-- index.ts
|   |   +-- subjects
|   |   +-- users
|   |
|   +-- lib                                  # cross-cutting helpers
|   |   +-- hooks
|   |   |   +-- usePrevious.ts
|   |   |   +-- useDebounce.ts
|   |   +-- utils
|   |   |   +-- logger.ts
|   |   |   +-- date.ts
|   |   +-- constants
|   |   |   +-- roleCapabilities.ts          # single source of RBAC truth
|   |   +-- tests
|   |       +-- renderWithProviders.tsx
|   |       +-- navigationMock.ts
|   |
|   +-- context
|   |   +-- AuthContext
|   |   |   +-- AuthProvider.tsx
|   |   |   +-- useAuth.ts
|   |   |   +-- AuthContext.test.tsx
|   |   |   +-- index.ts
|   |   +-- ThemeContext
|   |       ...
|   |
|   +-- types                                # global TS declarations
|       +-- index.ts
|
+-- .storybook
|   +-- main.js
|   +-- preview.js
|
+-- jest
|   +-- setup.ts
|   +-- mocks
|       +-- fileMock.js
|       +-- svgMock.js
|
+-- e2e                                      # Detox / Playwright specs
|   +-- add-students-flow.spec.ts
|
+-- assets                                   # fonts, images, animations
+-- scripts                                  # automation / security / build
|
+-- metro.config.js
+-- tsconfig.json                            # path aliases for @ui, @domains, …
+-- jest.config.ts
+-- .eslintrc.js
+-- prettier.config.js
+-- package.json
+-- README.md
```