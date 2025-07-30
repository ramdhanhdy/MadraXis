## Existing Codebase Structure (Line 2 - Line 427)
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

## Target Codebase Structure (Line 430 - Line 610)

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
|   |   |   +-- store.ts                     # local Zustand store
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
|   +-- design-system                        # enhanced theming system
|   |   +-- core
|   |   |   +-- theme-builder.ts             # theme composition engine
|   |   |   +-- types.ts                     # all theme types
|   |   |   +-- utils.ts                     # theme utilities
|   |   +-- tokens                           # design tokens (atomic)
|   |   |   +-- colors.ts                    # base color palette
|   |   |   +-- typography.ts                # typography scale
|   |   |   +-- spacing.ts                   # spacing scale
|   |   |   +-- shadows.ts                   # shadow definitions
|   |   |   +-- animations.ts                # animation tokens
|   |   |   +-- accessibility.ts             # accessibility tokens
|   |   |   +-- index.ts
|   |   +-- themes                           # theme compositions
|   |   |   +-- base
|   |   |   |   +-- light.ts                 # light base theme
|   |   |   |   +-- dark.ts                  # dark base theme
|   |   |   |   +-- index.ts
|   |   |   +-- shared                       # shared theme configurations
|   |   |   |   +-- default.ts               # default shared theme
|   |   |   |   +-- index.ts
|   |   |   +-- roles                        # role-specific configurations
|   |   |   |   +-- student.ts               # student theme overrides
|   |   |   |   +-- teacher.ts               # teacher theme overrides
|   |   |   |   +-- parent.ts                # parent theme overrides
|   |   |   |   +-- management.ts            # management theme overrides
|   |   |   |   +-- index.ts
|   |   |   +-- index.ts
|   |   +-- components                       # component theme definitions
|   |   |   +-- button.ts                    # button component theme
|   |   |   +-- card.ts                      # card component theme
|   |   |   +-- modal.ts                     # modal component theme
|   |   |   +-- navigation.ts                # navigation component theme
|   |   |   +-- index.ts
|   |   +-- utilities                        # style utilities
|   |   |   +-- style-helpers.ts             # enhanced style helpers
|   |   |   +-- responsive.ts                # responsive utilities
|   |   |   +-- animations.ts                # animation utilities
|   |   |   +-- accessibility.ts             # accessibility utilities
|   |   |   +-- index.ts
|   |   +-- index.ts                         # main export
|   |
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
+-- tsconfig.json                            # path aliases for @ui, @domains, @lib, @design-system, …
+-- jest.config.ts
+-- .eslintrc.js
+-- prettier.config.js
+-- package.json
+-- README.md
```

## Migration Strategy (Line 613 - Line 824)

### Path Aliases Configuration

The enhanced architecture requires comprehensive path aliases to support clean imports and maintainable code organization:

#### TypeScript Configuration (tsconfig.json)
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@ui/*": ["src/ui/*"],
      "@domains/*": ["src/domains/*"],
      "@lib/*": ["src/lib/*"],
      "@design-system/*": ["src/design-system/*"],
      "@context/*": ["src/context/*"],
      "@types/*": ["src/types/*"],
      "@app/*": ["app/*"]
    }
  }
}
```

#### Jest Configuration (jest.config.ts)
```typescript
export default {
  moduleNameMapper: {
    '^@ui/(.*)$': '<rootDir>/src/ui/$1',
    '^@domains/(.*)$': '<rootDir>/src/domains/$1',
    '^@lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@design-system/(.*)$': '<rootDir>/src/design-system/$1',
    '^@context/(.*)$': '<rootDir>/src/context/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
    '^@app/(.*)$': '<rootDir>/app/$1',
  },
};
```

#### Import Examples
```typescript
// UI Components
import { Button } from '@ui/atoms/Button';
import { Card } from '@ui/molecules/Card';
import { Header } from '@ui/organisms/Header';
import { DashboardTemplate } from '@ui/templates/DashboardTemplate';

// Domain Logic
import { classService } from '@domains/class';
import { useStudents } from '@domains/users';
import { incidentApi } from '@domains/incidents';

// Design System
import { useTheme } from '@design-system';
import { colors, spacing } from '@design-system/tokens';
import { createTheme } from '@design-system/core/theme-builder';

// Shared Libraries
import { useAuth } from '@lib/hooks/useAuth';
import { logger } from '@lib/utils/logger';
import { formatDate } from '@lib/utils/date';

// Context & Types
import { AuthProvider } from '@context/AuthContext';
import { UserRole, ClassData } from '@types';
```

### Migration Phases

The refactoring will be executed in 6 carefully planned phases:

#### Phase 1: Infrastructure Setup
- Configure path aliases in `tsconfig.json` and `jest.config.ts`
- Set up Storybook and E2E testing frameworks
- Create migration automation scripts
- **Checkpoint**: Validate path aliases and tooling setup (including test compilation)

#### Phase 2: Parallel Structure Creation
- Create new directory structures alongside existing ones
- Set up barrel exports for backward compatibility
- Implement dual import system
- **Checkpoint**: Validate parallel structure and dual imports

#### Phase 3: UI Component Migration
- Migrate components from `src/components/` to `src/ui/`
- Update imports using automation scripts
- Maintain backward compatibility during transition
- **Checkpoint**: Validate component migration and imports

#### Phase 4: Domain Migration
- Create domain modules and migrate from `src/services/`
- Migrate stores to appropriate contexts/domains
- Update business logic imports
- **Checkpoint**: Validate domain structure and service replacement

#### Phase 5: Feature Slice Migration
- Convert flat route files to feature directories
- Implement feature-specific patterns
- Update routing and navigation
- **Checkpoint**: Validate feature slices and routing

#### Phase 6: Cleanup and Validation
- Remove old directory structures
- Final validation and performance testing
- Documentation updates
- **Checkpoint**: Migration completion validation

### Migration Automation

#### Import Update Scripts
```bash
# scripts/migration/update-imports.js
# Automatically updates import paths from old to new structure
node scripts/migration/update-imports.js --phase=ui-components
node scripts/migration/update-imports.js --phase=domains
node scripts/migration/update-imports.js --phase=lib
```

#### Validation Scripts
```bash
# scripts/migration/validate-imports.js
# Validates all imports are working after migration phase
node scripts/migration/validate-imports.js --check-broken-imports
node scripts/migration/validate-imports.js --check-unused-exports
```

#### Rollback Scripts
```bash
# scripts/migration/rollback.js
# Rollback to previous migration phase if issues occur
node scripts/migration/rollback.js --to-phase=2
node scripts/migration/rollback.js --to-checkpoint=ui-components
```

### Store Migration Strategy

#### Current State
```typescript
// src/stores/authStore.ts - Zustand store with persistence
export const useAuthStore = create(
  persist(
    (set) => ({
      session: null,
      user: null,
      // ... auth logic
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

#### Target State
```typescript
// src/context/AuthContext/AuthProvider.tsx - React Context with persistence
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  // Preserve persistence behavior from Zustand
  useEffect(() => {
    // Hydrate auth state on app startup
    const loadPersistedAuth = async () => {
      try {
        const persistedAuth = await AsyncStorage.getItem('auth-storage');
        if (persistedAuth) {
          dispatch({ type: 'HYDRATE', payload: JSON.parse(persistedAuth) });
        }
      } catch (error) {
        console.error('Failed to load persisted auth:', error);
      }
    };

    loadPersistedAuth();
  }, []);

  // Persist auth state changes
  useEffect(() => {
    const persistAuth = async () => {
      try {
        await AsyncStorage.setItem('auth-storage', JSON.stringify(authState));
      } catch (error) {
        console.error('Failed to persist auth:', error);
      }
    };

    if (authState.session || authState.user) {
      persistAuth();
    }
  }, [authState]);

  // ... rest of auth logic
};

// src/domains/class/store.ts - Domain-specific Zustand store
export const useClassStore = create((set) => ({
  classes: [],
  selectedClass: null,
  // ... class-specific state
}));
```

#### Migration Rules
1. **Global State** → React Context (auth, theme, navigation)
2. **Auth Persistence** → Replicate Zustand persist behavior with AsyncStorage and proper hydration
3. **Domain State** → Domain-specific Zustand stores
4. **Feature State** → Local Zustand stores in feature directories
5. **Maintain Interfaces** → Keep existing hook interfaces during transition
6. **Session Continuity** → Ensure users remain logged in across app restarts and reloads

## Enhanced Theming System Architecture

### Design Principles

The enhanced theming system prioritizes **scalability**, **maintainability**, and **flexibility** to support both shared and role-based theming scenarios with easy migration between approaches.

#### Core Principles
1. **Composable Architecture**: Theme building through composition rather than hardcoded themes
2. **Strategy Pattern**: Easy switching between shared and role-based theming strategies
3. **Future-Proof Design**: Support for dark mode, accessibility, and responsive design
4. **Developer Experience**: Clear APIs, runtime validation, and debugging tools
5. **Performance**: Memoized theme computation and efficient context usage

### Theme Composition System

#### Theme Builder Engine
```typescript
// design-system/core/theme-builder.ts
export interface ThemeConfig {
  baseTheme: 'light' | 'dark';
  roleOverrides?: Partial<Theme>;
  customizations?: Partial<Theme>;
}

export const createTheme = (config: ThemeConfig): Theme => {
  const base = config.baseTheme === 'dark' ? darkBaseTheme : lightBaseTheme;

  return deepMerge(
    base,
    config.roleOverrides || {},
    config.customizations || {}
  );
};
```

#### Flexible Theme Strategy
```typescript
// Enhanced ThemeProvider with strategy pattern
interface ThemeStrategy {
  type: 'shared' | 'role-based';
  themes: {
    shared?: Theme;
    roles?: Record<UserRole, Theme>;
  };
}

export const ThemeProvider = ({ children, strategy }) => {
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');

  // Dynamic theme resolution based on strategy
  const activeTheme = useMemo(() => {
    if (strategy.type === 'shared') {
      return strategy.themes.shared!;
    }

    if (strategy.type === 'role-based' && currentRole) {
      return strategy.themes.roles![currentRole];
    }

    return strategy.themes.shared || createTheme({ baseTheme: colorScheme });
  }, [strategy, currentRole, colorScheme]);

  return (
    <ThemeContext.Provider value={{
      theme: activeTheme,
      currentRole,
      setCurrentRole,
      colorScheme,
      setColorScheme,
      strategy: strategy.type
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

### Design Token Architecture

#### Atomic Design Tokens
```typescript
// design-system/tokens/colors.ts - Base color palette
export const baseColors = {
  teal: { 50: '#f0fdfa', 500: '#005e7a', 900: '#001d29' },
  gold: { 50: '#fffbeb', 400: '#f0c75e', 900: '#451a03' },
  neutral: { 50: '#fafafa', 500: '#737373', 900: '#171717' },
  // ... semantic colors
};

// design-system/tokens/accessibility.ts - Accessibility-first tokens
export const accessibility = {
  minTouchTarget: 44,
  focusRing: { width: 2, offset: 2, color: 'primary.main' },
  contrast: { minimum: 4.5, enhanced: 7 },
  reducedMotion: { duration: 0, easing: 'linear' },
};

// design-system/tokens/animations.ts - Animation system
export const animations = {
  duration: { instant: 0, fast: 150, normal: 300, slow: 500 },
  easing: {
    linear: 'linear',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  },
  transitions: {
    fade: { opacity: [0, 1] },
    slide: { transform: [{ translateY: 20 }, { translateY: 0 }] },
  }
};
```

#### Theme Configurations
```typescript
// design-system/themes/shared/default.ts - Shared theme for all roles
export const sharedThemeConfig = {
  colors: {
    primary: { main: '#007bff', light: '#66b3ff', dark: '#0056b3' },
    secondary: { main: '#6c757d', light: '#adb5bd', dark: '#495057' },
  },
};

// design-system/themes/roles/student.ts - Role-specific overrides
export const studentThemeConfig = {
  colors: {
    primary: { main: '#005e7a', light: '#4dd0e1', dark: '#00344a' },
    secondary: { main: '#2dd4bf', light: '#a7f3d0', dark: '#0d9488' },
  },
  components: {
    navigationBar: { backgroundColor: '#005e7a', accentColor: '#2dd4bf' },
    dashboard: { cardStyle: 'elevated', primaryAction: 'teal' },
  },
};
```

### Component Theme System

#### Enhanced Component Themes
```typescript
// design-system/components/button.ts
export const buttonTheme = {
  baseStyle: {
    borderRadius: 'md',
    fontWeight: 'medium',
    transition: 'all 150ms ease',
  },
  variants: {
    solid: ({ colorScheme, role }) => ({
      bg: `${role || 'primary'}.main`,
      color: 'white',
      _hover: { bg: `${role || 'primary'}.dark` },
      _pressed: { bg: `${role || 'primary'}.darker` },
    }),
    outline: ({ colorScheme, role }) => ({
      bg: 'transparent',
      borderWidth: 1,
      borderColor: `${role || 'primary'}.main`,
      color: `${role || 'primary'}.main`,
    }),
  },
  sizes: {
    sm: { px: 3, py: 2, fontSize: 'sm' },
    md: { px: 4, py: 2.5, fontSize: 'md' },
    lg: { px: 6, py: 3, fontSize: 'lg' },
  },
};
```

### Migration Scenarios

#### Easy Configuration System
```typescript
// app/theme-config.ts - Single source of truth for theme strategy
export const THEME_STRATEGY: ThemeStrategy = {
  type: 'shared', // Easy to change to 'role-based'
  themes: {
    shared: createTheme({
      baseTheme: 'light',
      roleOverrides: sharedThemeConfig,
    }),
    // Uncomment when switching to role-based:
    // roles: {
    //   student: createTheme({ baseTheme: 'light', roleOverrides: studentThemeConfig }),
    //   teacher: createTheme({ baseTheme: 'light', roleOverrides: teacherThemeConfig }),
    //   parent: createTheme({ baseTheme: 'light', roleOverrides: parentThemeConfig }),
    //   management: createTheme({ baseTheme: 'light', roleOverrides: managementThemeConfig }),
    // }
  },
};
```

#### Flexible Migration Paths
```typescript
// Scenario 1: Mixed approach - test role-based for one role
const MIXED_STRATEGY: ThemeStrategy = {
  type: 'role-based',
  themes: {
    shared: sharedTheme, // Fallback for most roles
    roles: {
      student: studentTheme, // Only student gets custom theme
      teacher: sharedTheme,  // Others use shared
      parent: sharedTheme,
      management: sharedTheme,
    }
  }
};

// Scenario 2: A/B testing different themes
const AB_TEST_STRATEGY: ThemeStrategy = {
  type: 'role-based',
  themes: {
    roles: {
      student: userIsInTestGroup ? experimentalStudentTheme : standardStudentTheme,
      teacher: teacherTheme,
      // ...
    }
  }
};

// Scenario 3: Seasonal or event-based themes
const SEASONAL_STRATEGY: ThemeStrategy = {
  type: 'shared',
  themes: {
    shared: createTheme({
      baseTheme: 'light',
      customizations: isRamadan ? ramadanThemeOverrides : {},
    })
  }
};
```

### Developer Experience

#### Runtime Validation & Debugging
```typescript
// design-system/utilities/theme-validator.ts
export const validateTheme = (theme: Theme): ValidationResult => {
  const errors: string[] = [];

  // Check required colors exist
  if (!theme.colors.primary.main) errors.push('Missing primary.main color');

  // Check contrast ratios
  const contrastRatio = calculateContrast(
    theme.colors.text.primary,
    theme.colors.background.primary
  );
  if (contrastRatio < 4.5) errors.push('Insufficient contrast ratio');

  return { isValid: errors.length === 0, errors };
};

// design-system/utilities/theme-debugger.ts
export const useThemeDebugger = () => {
  const { theme, strategy } = useTheme();

  return {
    logTheme: () => console.table(theme.colors),
    validateTheme: () => validateTheme(theme),
    exportTheme: () => JSON.stringify(theme, null, 2),
    strategy,
  };
};
```

### Benefits

#### Scalability
- ✅ Add new roles without touching existing code
- ✅ Support unlimited theme variations
- ✅ Easy A/B testing and experimentation
- ✅ Gradual migration from shared to role-based

#### Maintainability
- ✅ Single source of truth for theme strategy
- ✅ Composable theme system reduces duplication
- ✅ Clear separation of concerns
- ✅ Runtime validation and debugging tools

#### Flexibility
- ✅ Switch between shared/role-based with one line change
- ✅ Mix and match: some roles custom, others shared
- ✅ Easy seasonal/event themes
- ✅ Support for user preferences and accessibility