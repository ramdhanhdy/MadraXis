# Financial Management System Migration Guide

## Overview

This guide provides steps to integrate the Financial Management System into the existing MadraXis application. As this is a new feature with no prior data, minimal migration is required. Focus on adding new components, updating navigation, and ensuring compatibility with the consistent design system.

## Prerequisites

- Complete the consistent-design-system specs and implementation.
- Ensure Supabase database is up to date with latest migrations.
- Backup the database before applying new migrations.

## Step 1: Apply Database Migrations

1. Run the new migration scripts in supabase/migrations/ for expense_categories, expenses, and budgets tables.
2. Verify RLS policies are applied correctly for management role.
3. Test inserts with a management user to ensure school_id filtering works.

No data migration needed, as tables are new. Seed initial categories if desired (e.g., salaries, supplies, utilities) via a script or admin interface.

## Step 2: Update Backend Services

1. Add src/services/finance.ts and import it where needed (e.g., in management screens).
2. Update any existing services (e.g., dashboard.ts) to include financial metrics queries.
3. Test API functions with Jest, ensuring error handling and authentication.

## Step 3: Integrate Frontend Components

1. Add new screens in app/(management)/finance/ (e.g., index.tsx for dashboard, add-expense.tsx, set-budget.tsx).
2. Update app/_layout.tsx to include new routes under management stack.
3. In app/(management)/dashboard.tsx, add summary cards for financial metrics using design system Card components.
4. Replace any hardcoded styles with design tokens.

## Step 4: Update Navigation and Access

1. Add finance tab or quick action in management dashboard navigation.
2. Ensure role-based routing prevents non-management access.
3. Use existing AuthContext to gate financial features.

## Step 5: Testing

1. Unit test new components and services.
2. Integration test: Log expense, set budget, verify dashboard updates.
3. Manual test on device/emulator for UI consistency.
4. Check for conflicts with existing features (e.g., incident reporting).

## Deployment Notes

- Deploy updated Supabase schema first.
- Update app version and test on staging environment.
- Monitor for any performance issues with new queries.

If issues arise, refer to tasks.md for rollback steps.