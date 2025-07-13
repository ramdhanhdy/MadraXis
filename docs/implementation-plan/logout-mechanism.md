# Logout Mechanism for All User Modes

## Background and Motivation
Currently the MadraXis application implements login (OTP, password) but no explicit logout option. A secure logout mechanism is critical so that users can terminate their session on shared devices and to allow role switching. This plan covers adding a logout feature usable by all four user modes: management, teacher, student, and parent.

## Key Challenges and Analysis
1. **Session Management** – The app uses Supabase; we must call `supabase.auth.signOut()` and clear any cached session/token in local storage or context.
2. **Role-Based Navigation** – Each user mode lands on different stack/tab navigators. We need a consistent place to expose the logout action (e.g., profile/settings menu or header action) without duplicating code.
3. **State Reset** – After logout we must:
   - Clear React Query/Redux or any cached data.
   - Reset React Navigation state to the auth stack (login screen).
4. **Offline Considerations** – Ensure graceful handling if the device is offline while attempting logout.
5. **Testing Across Modes** – Validate logout from each role context.

## High-level Task Breakdown

- [ ] **Branch Setup** – Create feature branch `feature/logout-mechanism` off latest `main`.
- [ ] **Audit Current Auth Context**
  - Locate AuthProvider / context that stores session.
  - Identify current sign-in flow and session persistence.
  - Success: Auth context location and update points documented in this file.
- [ ] **Design Logout Flow**
  - Decide where logout button appears for each role (likely profile/settings screen already shared between modes).
  - Define navigation reset strategy.
  - Success: updated wireframe/description added here.
- [ ] **Implement Auth Context `logout()` helper**
  - Call `supabase.auth.signOut()`.
  - Clear local caches/state.
  - Success: function returns without error and session null.
- [ ] **Add UI Trigger(s)**
  - Insert Logout item in existing Settings/Profile screens.
  - If such screen doesn’t exist for a mode, add simple modal/menu from header.
  - Success: button visible and triggers `logout()`.
- [ ] **Navigation Reset**
  - After logout navigate to `/login` (or root auth stack) and reset stack to prevent back navigation.
  - Success: pressing back after logout does not return to protected screens.
- [ ] **Global State Cleanup**
  - Purge React Query caches if used.
  - Clear any AsyncStorage items storing user data.
  - Success: no residual user data after logout (verified via console).
- [ ] **Offline Handling**
  - If `signOut` fails due to network, still clear local state and show toast.
  - Success: manual network toggle test passes.
- [ ] **E2E Testing**
  - Manual test each role: login → some action → logout → ensure redirect.
  - Add Jest/unit tests for Auth context logout.
  - Success: tests green.
- [ ] **Documentation**
  - Update `docs/auth_flow.md` with logout sequence diagram.
  - Success: Docs merged.

## Current Status / Progress Tracking
- Planner drafted initial plan (2025-07-13). Awaiting user approval.

## Project Status Board
- [ ] Branch created: `feature/logout-mechanism`
- [ ] Auth context audited
- [ ] Logout flow designed
- [ ] `logout()` implemented
- [ ] UI triggers added
- [ ] Navigation reset completed
- [ ] Global state cleanup done
- [ ] Offline handling verified
- [ ] Tests written & passing
- [ ] Documentation updated
- [ ] PR opened & merged

## Executor's Feedback or Assistance Requests
(Empty - to be filled by executor)

## Lessons Learned
(To be populated during execution)
