# MadraXis Project Architecture

**Version:** 2.0  
**Last Updated:** 2025-07-30  
**Status:** 🟢 ACTIVE  

## 1. Overview

This document outlines the official codebase structure for the MadraXis application. The architecture is based on **Feature-Sliced Design (FSD)** for routing and feature organization, and **Atomic Design** for UI components. This structure promotes scalability, maintainability, and a clear separation of concerns.

## 2. Directory Structure

```
MadraXis/
├── app/                             # ROUTING & FEATURES (Feature-Sliced Design)
│   ├── (auth)/
│   │   └── login/
│   │       ├── model.ts
│   │       ├── screen.tsx
│   │       ├── store.ts
│   │       └── ui.tsx
│   ├── (student)/
│   │   └── dashboard/
│   ├── (teacher)/
│   │   └── class/
│   ├── (parent)/
│   └── (management)/
│
├── src/                              # SOURCE CODE
│   ├── design-system/               # THEME & STYLING
│   │   ├── core/
│   │   ├── tokens/
│   │   └── themes/
│   │
│   ├── ui/                          # SHARED UI COMPONENTS (Atomic Design)
│   │   ├── atoms/
│   │   ├── molecules/
│   │   └── organisms/
│   │
│   ├── domains/                     # BUSINESS LOGIC
│   │   ├── class/
│   │   ├── incidents/
│   │   └── users/
│   │
│   ├── lib/                         # SHARED LIBRARIES
│   │   ├── constants/
│   │   ├── hooks/
│   │   ├── tests/
│   │   └── utils/
│   │
│   ├── context/                     # GLOBAL STATE (React Context)
│   │   ├── AuthContext/
│   │   └── ThemeContext/
│   │
│   └── types/                       # GLOBAL TYPES
│       └── index.ts
│
├── .storybook/                      # Storybook configuration for UI component development.
├── assets/                          # Static assets (fonts, images, animations).
├── docs/                            # Project documentation and specifications.
├── e2e/                             # End-to-end tests (Detox, Playwright).
├── jest/                            # Jest test runner configuration and mocks.
├── scripts/                         # Automation, security, and build scripts.
├── supabase/                        # Supabase backend configuration and migrations.
│
├── .eslintrc.js                     # ESLint configuration.
├── jest.config.ts                   # Jest configuration.
├── metro.config.js                  # Metro bundler configuration.
├── package.json                     # Project dependencies and scripts.
├── prettier.config.js               # Prettier code formatting rules.
└── tsconfig.json                    # TypeScript configuration with path aliases.
```

## 3. Directory Explanations

### `app/`
- **Purpose**: Manages all application routes and feature logic using **Expo Router**.
- **Methodology**: Follows **Feature-Sliced Design (FSD)**. Each route is a "slice" containing its own `screen.tsx` (UI), `model.ts` (business logic), `ui.tsx` (feature-specific components), and `store.ts` (local state).
- **Example**: The login feature is entirely self-contained within `app/(auth)/login/`.

### `src/`
This is the main source code directory, organized by architectural layer.

- **`src/design-system/`**: The core of the visual identity. Contains theme definitions, design tokens (colors, spacing, typography), and theming utilities.
- **`src/ui/`**: A library of pure, reusable UI components following **Atomic Design**. These components are shared across all features and are unaware of business logic.
  - `atoms/`: Basic building blocks (e.g., `Button`, `Input`).
  - `molecules/`: Simple combinations of atoms (e.g., `Card`, `ListItem`).
  - `organisms/`: Complex UI sections (e.g., `Header`, `AddStudentsToClassModal`).
- **`src/domains/`**: Contains all business logic, decoupled from the UI. Each sub-directory represents a business domain (e.g., `class`, `users`). It includes API services, hooks, and domain-specific types.
- **`src/lib/`**: A shared library for cross-cutting concerns.
  - `constants/`: Application-wide constants (e.g., `roleCapabilities`).
  - `hooks/`: Globally reusable React hooks (e.g., `useDebounce`).
  - `utils/`: Pure utility functions (e.g., `logger`, `formatDate`).
  - `tests/`: Shared testing utilities (e.g., `renderWithProviders`).
- **`src/context/`**: Global state management using React Context. This is for state that is truly global and shared across the entire app (e.g., `AuthContext`).
- **`src/types/`**: A single source of truth for all global TypeScript type definitions.

### Root Directories

- **`.storybook/`**: Configuration for Storybook, used for isolated UI component development and testing.
- **`assets/`**: Static assets like fonts, images, and animations.
- **`docs/`**: All project documentation, including specifications, architecture design, and meeting notes.
- **`e2e/`**: End-to-end tests that simulate user flows through the entire application.
- **`jest/`**: Configuration and mocks for the Jest testing framework.
- **`scripts/`**: Utility scripts for automation, security audits, and build processes.
- **`supabase/`**: Configuration, migrations, and tests for the Supabase backend.

