# Supabase OTP Authentication Implementation Plan

**Created:** 2025-07-10  
**Updated:** 2025-07-10 (Post bundling/RLS fixes)

**Branch Name**
`feat/otp-auth-hybrid`

## Background and Motivation
The current authentication uses invite-only email + password flow (docs/auth_flow.md). User requested switch to OTP for passwordless auth. Given small B2B user base (100-200 users per school), approaching deadline, and raw data to import, we'll implement OTP as hybrid option alongside passwords to reduce risks. Users can choose "Send Login Code" (email), enter code in-app, and authenticate passwordlessly while maintaining invite-only model.

## Key Challenges and Analysis
- **Hybrid Implementation**: Keep existing password flow functional while adding OTP option
- **UI/UX**: Add OTP code entry screen and toggle between password/OTP modes
- **Data Import**: Handle raw user data import securely (using admin API)
- **RLS Policies**: Review/update for OTP flow compatibility
- **Testing**: Ensure both flows work for all roles (management, teacher, parent, student)

## High-level Task Breakdown
1. **Create feature branch and draft PR** ✅
2. **Import raw user data** (Paused - focusing on existing users first)
3. **Configure Supabase for OTP** ← COMPLETED
4. **Refactor UI components for hybrid auth** ← COMPLETED
5. **Update AuthContext logic for OTP** ← CURRENT TASK
6. **Review RLS policies for OTP compatibility**
7. **Testing and documentation**
8. **Final merge and cleanup**

## Project Status Board  
- [x] Task 1: Create branch and PR ← COMPLETED
- [⏸️] Task 2: Import raw data (paused per user request)
- [x] Task 3: Configure Supabase OTP ← COMPLETED
- [x] Task 4: Refactor UI components ← COMPLETED
- [x] Task 5: Update AuthContext logic ← COMPLETED
- [x] Task 6: RLS policy review ← COMPLETED (fixed infinite recursion)
- [x] Task 7: Testing and docs ← COMPLETED
- [x] Task 8: Final merge ← READY FOR REVIEW (PR #7 submitted)

## Current Task Details: Update AuthContext Logic for OTP

**Success Criteria:**
- AuthContext handles OTP authentication flow
- Session persistence works for OTP login
- User profile fetching works after OTP verification
- Error handling for OTP failures
- Navigation works correctly after OTP login

**Actions:**
1. Test current OTP UI implementation
2. Verify AuthContext handles OTP session creation
3. Check profile fetching after OTP login
4. Test navigation to dashboard after OTP auth
5. Add any missing error handling

## Executor's Feedback or Assistance Requests  
- **Task 1 COMPLETED**: ✅ Branch `feat/otp-auth-hybrid` created. Later migrated to `feat/otp-auth-with-management` to include management features.
- **Task 2 PAUSED**: Per user request to focus on existing users first. CSV templates created for future data import.
- **Task 3 COMPLETED**: ✅ OTP configuration verified! Email OTP works for existing users (B2B model preserved). Test script confirms: signInWithOtp() sends 6-digit codes to existing users, signup protection active.
- **Task 4 COMPLETED**: ✅ Hybrid OTP/password UI implemented! AuthForm extended with OTP modes (otp, otp-verify), 6-digit code input, mode toggles, proper validation.
- **Task 5 COMPLETED**: ✅ Navigation issue resolved! Merged management features into OTP branch. OTP login now navigates to proper management dashboard.
- **Task 6 COMPLETED**: ✅ RLS policies reviewed and fixed. Resolved infinite recursion in profiles policy.
- **Task 7 COMPLETED**: ✅ End-to-end testing confirmed. OTP flow working with proper navigation.
- **Task 8 COMPLETED**: ✅ **PR #7 SUBMITTED FOR REVIEW** - "feat: implement hybrid OTP/password authentication system"

**READY FOR PLANNER REVIEW**: All implementation tasks completed successfully. OTP authentication working alongside existing password flow. PR ready for final review and merge.

## Lessons Learned
- [2025-07-10] Avoid overriding Expo-managed React Native versions in package.json - causes bundling syntax errors
- [2025-07-10] RLS policies with recursive subqueries (e.g., checking school_id via profiles lookup) cause infinite recursion - simplify to direct user checks only
- [2025-07-10] Use Bun for dependency management - resolves peer dependency conflicts better than npm/yarn
- [2025-07-10] Supabase auth.users table requires proper signup flow - can't directly INSERT; use dashboard for manual password resets during development
- [2025-07-10] OTP configuration: For B2B apps, use signInWithOtp() without shouldCreateUser option to allow existing users only. Signup restrictions prevent unwanted registrations while enabling passwordless login.
- [2025-07-10] Git parallel development: Use cherry-pick to move feature-specific changes to correct branch. Maintains clean separation and avoids merge conflicts between unrelated features.
- [2025-07-10] Branch dependency management: When creating feature branches, ensure they include dependencies (e.g., OTP needs management features for proper navigation). Use merge or rebase to combine related work before testing end-to-end flows.

## Project Status Board  
- [x] Task 1: Create branch  
- [ ] Task 2: Import raw data  
- [ ] Task 3: Configure Supabase  
- [ ] Task 4: Refactor UI  
- [ ] Task 5: Update logic  
- [ ] Task 6: RLS review  
- [ ] Task 7: Testing/docs  
- [ ] Task 8: Merge  

## Executor's Feedback or Assistance Requests  
- Task 1 completed: Branch `feat/otp-auth-hybrid` created and pushed. Draft PR opened: [PR #6](https://github.com/ramdhanhdy/MadraXis/pull/6). No issues encountered. Ready for verification.  
- Task 2 in progress: Proposed CSV template: Columns - email (required), full_name (string [[memory:941290]]), role (student/teacher/parent/management), school_id (integer, likely 1), and role-specific: For students - nis (text), date_of_birth (YYYY-MM-DD), gender (M/F), boarding (true/false); For teachers - employee_id (text), hire_date (YYYY-MM-DD), specialty (text); For parents - phone_number (text), address (text), occupation (text); For management - position (text), hire_date (YYYY-MM-DD). If students have parent links, include parent_email to create/link. Please provide CSV in this format (or note changes). Will use admin API script for import. [[memory:941311]]
(TBD for other tasks) 