# Design for Refactoring Directory Structure in MadraXis

## Objective
To streamline the project's directory structure by consolidating components into `src/components/`, eliminating the redundant `app/screens/` directory, and ensuring `app/` is dedicated solely to routes and layouts. This will improve code organization, reduce redundancy, and align with Expo Router best practices for better maintainability and scalability.

## Current Structure
```
MadraXis
├── app/
│   ├── (auth)/
│   ├── (management)/
│   ├── (parent)/
│   ├── (student)/
│   ├── (teacher)/
│   ├── _layout.tsx
│   ├── components/
│   │   ├── AnimatedSplashScreen.tsx
│   │   ├── BackgroundPattern.tsx
│   │   ├── auth/
│   │   ├── student/
│   │   └── teacher/
│   ├── index.tsx
│   └── screens/
│       ├── dashboard/
│       ├── parent/
│       ├── student/
│       └── teacher/
├── src/
│   ├── components/
│   │   ├── atoms/
│   │   ├── molecules/
│   │   ├── organisms/
│   │   └── templates/
│   ├── context/
│   ├── services/
│   ├── styles/
│   ├── types/
│   └── utils/
└── other directories...
```

## Proposed Structure
```
MadraXis
├── app/
│   ├── (auth)/
│   ├── (management)/
│   ├── (parent)/
│   ├── (student)/
│   ├── (teacher)/
│   ├── _layout.tsx
│   └── index.tsx
├── src/
│   ├── components/
│   │   ├── atoms/
│   │   ├── molecules/
│   │   ├── organisms/
│   │   ├── templates/
│   │   ├── auth/
│   │   ├── student/
│   │   └── teacher/
│   ├── context/
│   ├── services/
│   ├── styles/
│   ├── types/
│   └── utils/
└── other directories...
```