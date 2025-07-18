# Project Structure

## Root Directory Organization
```
├── app/                    # Expo Router app directory (main navigation)
├── src/                    # Source code (components, utilities, services)
├── assets/                 # Static assets (images, fonts, animations)
├── docs/                   # Project documentation
├── supabase/              # Database migrations and tests
└── .kiro/                 # Kiro AI assistant configuration
```

## App Directory (Expo Router)
- **File-based routing** with grouped routes for each user role
- **Route groups**: `(auth)`, `(management)`, `(teacher)`, `(parent)`, `(student)`
- **Shared layouts**: `_layout.tsx` files for consistent navigation structure
- **Entry points**: `index.tsx` (landing), `home.tsx` (authenticated home)

## Source Code Structure
```
src/
├── components/            # Reusable UI components
│   ├── atoms/            # Basic building blocks (Button, Input, Typography)
│   ├── molecules/        # Composed components (Card, ListItem, ProgressBar)
│   ├── organisms/        # Complex components (Header, Modal, NavigationPanel)
│   └── templates/        # Page-level layouts (FormTemplate, DashboardTemplate)
├── context/              # React Context providers (ThemeContext)
├── services/             # API and external service integrations
├── styles/               # Design system (colors, typography, spacing, shadows)
├── types/                # TypeScript type definitions
└── utils/                # Helper functions and utilities
```

## Component Architecture
- **Atomic Design Pattern**: Atoms → Molecules → Organisms → Templates
- **Consistent design system** across all user roles
- **Storybook integration** for component documentation
- **Comprehensive testing** with Jest and React Native Testing Library

## Key Conventions
- **TypeScript strict mode** for all source files
- **Barrel exports** using `index.ts` files for clean imports
- **Co-located tests** with `.test.tsx` suffix
- **Storybook stories** with `.stories.tsx` suffix
- **README files** for component documentation

## Role-Based Organization
Each user role has dedicated route groups in the `app/` directory:
- **Management**: School administration and financial oversight
- **Teacher**: Class management and student tracking
- **Parent**: Child progress monitoring and communication
- **Student**: Academic progress and incident reporting

## Design System Location
- **Theme configuration**: `src/styles/theme.ts`
- **Component styles**: Co-located with components
- **Shared utilities**: `src/utils/styleHelpers.ts`
- **Responsive helpers**: `src/utils/responsive.ts`