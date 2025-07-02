# Database Schema Polish – Unified User Model & Naming Rationalisation

**Created:** 2025-07-02

## Branch Name
`refactor/schema-polish`

## Background and Motivation
The current schema mixes two design approaches:
1. A generic `profiles` table (linked 1-to-1 with `auth.users`) covering **parents, teachers, and management**.
2. A dedicated `students` table that duplicates identity information (first/last name, user_id) and stores student-specific attributes.

This split leads to inconsistent naming conventions and additional join complexity. We also discovered cultural mismatches: Indonesian names often do **not** follow a strict first/last pattern. The recent `full_name` correction in `profiles` further highlights the need for a coherent, single-source-of-truth identity model.

## Key Challenges and Analysis
- **Identity vs Domain Data** – Separate core identity (name, email, school_id, role) from role-specific domain data (e.g., date_of_birth for students).
- **Migration Safety** – Existing data must be migrated without loss.
- **RLS & Security** – Any refactor must preserve (or improve) row-level-security policies.
- **Name Flexibility** – Support cultures without surnames; rely exclusively on `full_name` and avoid any first/last name split.
- **Minimal App Disruption** – Front-end expects current shape; staged rollout required.

## High-level Task Breakdown
1. **Create feature branch** `refactor/schema-polish` off `master`.
   - *Success*: Branch pushed, draft PR opened.
2. **Stakeholder Review & Requirements Gathering** (Planner)
   - Confirm there is no requirement for first/last names—`full_name` is the sole canonical field.
   - ✅ *Completed* – Unified approach confirmed on **2025-07-02**.
   - Decide on unified user model approach: a) Move students into `profiles` + `students_details`, or b) Split `profiles` into role tables.
   - *Success*: Decision recorded in this file.
3. **Schema Draft & Migration Plan** (Planner)
   - Draft ERD with `profiles` + detail tables (`student_details`, `teacher_details`, `parent_details`, `management_details`).
   - Design performance/analytics tables (`student_performance`, `teacher_performance`).
   - Write migration steps (add new tables, copy data, create views `students`, `teachers`, etc.).
   - *Success*: Migration SQL script drafted in `/supabase/migrations/`.
4. **Implement Phase 1 Migration** (Executor)
   - Create detail tables (empty) and compatibility views.
   - Add `full_name` to any legacy table that still needs it during transition.
   - Provide fallback virtual column or view for legacy queries.
   - *Success*: CI tests pass on branch database.
5. **Performance Tables & Indexes** (Executor)
   - Add `student_performance` and `teacher_performance` tables keyed by UID.
   - Index for common dashboard queries.
   - *Success*: Sample inserts + selects verified.
6. **Update Client Code** (Executor)
   - Refactor dashboard fetches to use new views/tables.
   - Remove assumptions of `first_name`/`last_name`.
   - *Success*: TypeScript passes; manual UI test shows correct data rendering.
7. **RLS & Function Updates** (Executor)
   - Adjust/extend RLS policies for new tables.
   - Update any trigger functions referencing legacy columns.
   - *Success*: Supabase advisor shows no policy regressions.
8. **Data Migration & Cleanup** (Executor)
   - Backfill `full_name` where missing.
   - Remove deprecated columns after verification.
   - *Success*: Old columns dropped; no orphaned data.
9. **Automated Tests** (Executor)
   - Extend SQL test suite for new constraints (e.g., `full_name_not_email` enforced across all user roles).
   - *Success*: Tests green in CI.
10. **Documentation Update** (Planner + Executor)
    - Update `docs/user_management.md` and ERD diagrams.
    - *Success*: Docs merged.
11. **PR Review & Merge**
    - *Success*: Squash-merge single semantic commit `refactor(db): unify user model & polish schema`.

## Project Status Board
- [ ] (1) Create feature branch
- [ ] (2) Stakeholder review & requirements  **(Completed 2025-07-02)**
- [ ] (3) Schema draft & migration plan **(In progress – draft committed 2025-07-02)**
- [ ] (4) Phase 1 migration implemented
- [ ] (5) Client code updated
- [ ] (6) RLS & functions updated
- [ ] (7) Data migration & cleanup
- [ ] (8) Automated tests added/updated
- [ ] (9) Documentation updated
- [ ] (10) PR review & merge

## Current Status / Progress Tracking
> Planner drafted implementation plan – *2025-07-02*.

## Executor's Feedback or Assistance Requests
*(empty – to be filled during execution)*

## Lessons Learned
- **[2025-07-02]** Cultural naming conventions should drive schema design; avoid rigid first/last name splits.

### **Decision**
We will proceed with **Option A – Unified `profiles` identity table plus role-specific detail tables**. Dedicated role tables will store extra attributes; all names live in `profiles.full_name`. Option B (new user_core table) is deferred. 

---
#### 📐 Proposed Table Definitions (Draft)

```sql
-- 1️⃣ Role-Specific Detail Tables
create table public.student_details (
  user_id        uuid primary key references public.profiles(id) on delete cascade,
  nis            text,                  -- National Student Number (optional)
  date_of_birth  date,
  gender         text check (gender in ('M','F')),
  boarding       boolean default false,
  created_at     timestamp with time zone default now(),
  updated_at     timestamp with time zone default now()
);

create table public.teacher_details (
  user_id        uuid primary key references public.profiles(id) on delete cascade,
  employee_id    text,
  hire_date      date,
  specialty      text,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

create table public.parent_details (
  user_id        uuid primary key references public.profiles(id) on delete cascade,
  phone_number   text,
  address        text,
  occupation     text,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

create table public.management_details (
  user_id        uuid primary key references public.profiles(id) on delete cascade,
  position       text,
  hire_date      date,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- 2️⃣ Performance / Analytics Tables
create table public.student_performance (
  id              bigserial primary key,
  user_id         uuid references public.profiles(id) on delete cascade,
  period_start    date not null,
  period_end      date not null,
  academic_score  numeric,
  quran_score     numeric,
  attendance_pct  numeric,
  created_at      timestamptz default now()
);

create table public.teacher_performance (
  id                 bigserial primary key,
  user_id            uuid references public.profiles(id) on delete cascade,
  period_start       date not null,
  period_end         date not null,
  class_observation  numeric,
  punctuality_score  numeric,
  created_at         timestamptz default now()
);

-- 3️⃣ Compatibility Views (legacy)
create or replace view public.students as
  select p.id as id,
         p.full_name,
         sd.*
    from public.profiles p
    join public.student_details sd on sd.user_id = p.id;

create or replace view public.teachers as
  select p.id as id,
         p.full_name,
         td.*
    from public.profiles p
    join public.teacher_details td on td.user_id = p.id;
```

#### 🛠️ Migration Outline (Dev Branch)
1. **Create new tables** (non-destructive).
2. **Back-fill detail tables** from existing `students` rows (map `students.id → profiles.id`).
3. **Re-point FKs** – e.g., `class_students.student_id` to reference `profiles.id`.
4. **Create compatibility views** so legacy queries continue to work.
5. **Deprecate old `students` table** after code refactor and data validation.

*ETA for migration script draft*: 0.5 day.

--- 