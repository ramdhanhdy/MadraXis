# Design for Refactoring Expo Router Structure

## Objective
The goal is to achieve a modular routing structure that separates role-specific navigation into nested layouts, simplifying the root layout, enabling lazy-loading for better performance, and making the codebase easier to maintain and scale as new features are added for different user roles.

## Current Structure
All routes are defined in a single `app/_layout.tsx` file, leading to a flat, bloated structure.

```
app/
├── _layout.tsx  # All Stack.Screen definitions here
├── (student)/
│   └── dashboard.tsx
├── (teacher)/
│   └── dashboard.tsx
├── (parent)/
│   └── dashboard.tsx
├── (management)/
│   └── dashboard.tsx
└── ... other files
```

## Proposed Structure
Introduce nested layouts for each role, grouping related screens and enabling code-splitting.

```
app/
├── _layout.tsx  # Shared screens and route groups
├── (student)/
│   ├── _layout.tsx  # Student-specific routes
│   └── dashboard.tsx
├── (teacher)/
│   ├── _layout.tsx  # Teacher-specific routes
│   └── dashboard.tsx
├── (parent)/
│   ├── _layout.tsx  # Parent-specific routes
│   └── dashboard.tsx
├── (management)/
│   ├── _layout.tsx  # Management-specific routes
│   └── dashboard.tsx
└── ... shared files
```

## Navigation Flow
- Entry: `index.tsx` redirects to login.
- Post-login: `AuthContext` redirects to role-based group (e.g., `/(student)/dashboard`).
- Lazy-loading: Nested layouts load on demand.

## Benefits
- Enhanced modularity and scalability.
- Improved performance via code-splitting.
- Simplified maintenance for role-specific features.