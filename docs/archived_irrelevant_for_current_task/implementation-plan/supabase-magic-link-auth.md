# Supabase Magic Link Authentication Implementation Plan

**Created:** 2025-07-10

**Branch Name**
`feat/magic-link-auth`

## Background and Motivation
The current authentication uses an invite-only email + password flow (docs/auth_flow.md). User requested switch to Supabase magic links for passwordless auth via email links. This simplifies login but requires careful handling of security, role routing, and user provisioning.

**Note:** Plan assumes full replacement; pending user clarification on scope (e.g., hybrid or role-specific).

## Key Challenges and Analysis
- Maintain invite-only: Keep email sign-ups disabled; admins pre-create users.
- Deep-linking: Handle magic link redirects in app.
- Role routing: Preserve based on metadata/profiles.
- Security: Update RLS if needed; magic links expire quickly.
- Testing: Ensure compatibility with all roles and edge cases (e.g., expired links).
- Minimal disruption: Reuse existing AuthContext and forms where possible.

## High-level Task Breakdown
1. **Create feature branch** `feat/magic-link-auth` off `master`.
   - *Success*: Branch pushed, draft PR opened.
2. **Update Supabase Dashboard Settings** (Executor).
   - Enable magic links; set redirect URL to app scheme (e.g., `madraxis://auth`).
   - *Success*: Dashboard settings match Supabase magic link docs; test email sends.
3. **Refactor Auth UI and Logic** (Executor).
   - Modify AuthForm.tsx to send magic link instead of password login.
   - Add deep-link handler for magic link verification.
   - Update AuthContext.tsx to handle SIGNED_IN event from magic link.
   - *Success*: User can request link, click it, and route to dashboard.
4. **Update Routing and Deep-Linking** (Executor).
   - Configure app.json for magic link scheme.
   - Remove password-related screens/flows (e.g., reset-password.tsx).
   - *Success*: Deep links open app and authenticate correctly.
5. **Database and RLS Review** (Planner/Executor).
   - Confirm no changes needed to profiles/RLS (roles in metadata).
   - *Success*: Auth works with existing RLS; no unauthorized access.
6. **Testing and Documentation** (Executor).
   - Test all roles; update docs/auth_flow.md and README.md.
   - *Success*: All flows work; docs reflect new system.
7. **Merge and Deploy** (Planner).
   - Review PR; squash-merge to master.
   - *Success*: App uses magic links; no regressions.

## Project Status Board
- [ ] Task 1: Create branch
- [ ] Task 2: Supabase settings
- [ ] Task 3: Refactor auth
- [ ] Task 4: Routing updates
- [ ] Task 5: RLS review
- [ ] Task 6: Testing/docs
- [ ] Task 7: Merge

## Executor's Feedback or Assistance Requests
(TBD - Executor to fill during implementation)

## Lessons Learned
(TBD - Append as discovered) 