# Database Data Tidy-Up – Full Name Correction & Schema Audit

**Created:** 2025-07-02

## Branch Name
`chore/database-data-tidy-up`

## Background and Motivation
The recent UI simplifications mean that the admin now provisions accounts directly (UI import / CSV). During testing we discovered that the `full_name` column in the `profiles` table is being populated with the user's email address instead of their real name. This is legacy behaviour from the old self-service onboarding flow.  

Leaving email addresses in `full_name` hurts UX, reporting, and future integrations. We need to:  
1. Clean existing data.  
2. Ensure the app & DB stop writing bad data.  
3. Verify other tables are still in sync with the simplified flow.

## Key Challenges and Analysis
- **Data accuracy** – We must avoid losing legitimate names for any existing users.  
- **Migration safety** – Updates should be applied first on a dev branch DB, then production.  
- **Future-proofing** – Prevent regressions by adding a constraint or trigger + automated tests.  
- **CSV workflow** – Admin import script must map `full_name` correctly.

## High-level Task Breakdown
1. **Create feature branch** `chore/database-data-tidy-up` off `master`.
   - *Success*: Branch pushed, draft PR opened.
2. **Schema inventory & analysis** (Planner + Executor)
   - List tables: `profiles`, `students`, `teachers`, `parents`, etc.  
   - Identify columns affected by the new invite-only flow (e.g., `full_name`, optional profile fields).  
   - *Success*: Markdown report committed (`docs/database-audit-2025-07-02.md`).
3. **Data audit on dev database** *(SKIPPED - test data only)*
   - Query `%@%` patterns in `full_name`, count rows.  
   - Export CSV snapshot for backup.  
   - *Success*: Counts & backup file stored in repo `/backups/2025-07-02/`.
   - **Note**: Admin confirmed current data is test data, no backup needed.
4. **Design & test migration script**
   - Strategy A: Derive display name from the part before `@` (Title-cased).  
   - Strategy B: Set to `NULL` and require admin fill later.  
   - Implement SQL migration in `/supabase/migrations/202507021200_fix_full_name.sql`.  
   - *Success*: On branch DB, `SELECT full_name FROM profiles WHERE full_name ILIKE '%@%'` returns `0` rows.
5. **Add DB constraint / trigger**
   - Add a `CHECK` constraint or trigger preventing insertion of `full_name` containing `@`.  
   - *Success*: Attempted insert with `john@example.com` fails.
6. **Update client code**
   - Search for any writes to `profiles.full_name`.  
   - Remove/modify so that default is `NULL` or admin-provided value.  
   - *Success*: CI tests pass; manual signup flow no longer populates `full_name`.
7. **Automated tests**
   - Add unit/integration test ensuring new sign-ups have `full_name IS NULL`.  
   - *Success*: Tests green in CI.
8. **Documentation update**
   - Update `docs/user_management.md` – explain new CSV template & naming rules.  
   - *Success*: Docs merged.
9. **PR review & merge**
   - Obtain code review, run Supabase advisor checks.  
   - *Success*: Squash-merge single semantic commit `chore(database): tidy up full_name and audit schema`.

## Project Status Board
- [x] (1) Create feature branch
- [x] (2) Schema inventory & analysis
- [x] (3) Data audit on dev DB *(skipped - test data only)*
- [ ] (4) Migration script designed & tested
- [ ] (5) Constraint/trigger added
- [ ] (6) Client code updated
- [ ] (7) Automated tests added
- [ ] (8) Documentation updated
- [ ] (9) PR merged

## Current Status / Progress Tracking
> Planner created implementation plan – *2025-07-02*.
> ✅ **Task 1 Complete** - Created feature branch `chore/database-data-tidy-up` off `master` and pushed to remote – *2025-07-02*.
> ✅ **Task 2 Complete** - Schema inventory & analysis completed, comprehensive audit report created at `docs/database-audit-2025-07-02.md` – *2025-07-02*.

## Executor's Feedback or Assistance Requests
- **Task 2 Results**: Confirmed critical data integrity issue in `profiles.full_name`
  - 2 out of 3 profiles contain email addresses instead of proper names
  - Database schema is structurally sound, issue is isolated to this field
  - **Migration strategy updated**: Admin will provide real names (most accurate approach)
- **User Input**: 
  - Admin has access to real names and will manually provide them
  - Current database entries are test data (admin's test accounts), no backup needed
- **Task 3**: Skipped - no backup required for test data

- **🎯 ROOT CAUSE ANALYSIS COMPLETE**: 
  1. **Database Trigger Issue**: Function `handle_new_user()` has fallback logic:
     ```sql
     COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
     ```
     When users created without `full_name` in metadata → trigger uses email as fallback
  
  2. **Client Code Issues**: 
     - `app/management/setup.tsx:68` updates user metadata with `full_name` correctly (this is good)
     - But trigger fallback behavior means any user creation without proper metadata gets email as name

- **EXPANDED SCOPE**: Need to fix both:
  - Database trigger logic (remove email fallback)
  - Any client-side user creation that doesn't provide `full_name` metadata
  - Add proper constraints to prevent future regression

## Lessons Learned
*(empty – append during execution)* 