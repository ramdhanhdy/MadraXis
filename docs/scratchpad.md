# MadraXis Project Scratchpad

## Current Active Tasks
- ✅ **OTP Authentication Implementation** - `docs/implementation-plan/supabase-otp-auth.md` (COMPLETED - PR #7 submitted)
- 🔄 **Database Security Audit** - `docs/implementation-plan/database-security-audit.md` (Phase 1 - Dashboard config needed)
- 🛠️ **Database Schema Polish** - `docs/implementation-plan/database-schema-polish.md` (planning stage)
- 📝 **Student Detail Enhancement** - `docs/implementation-plan/student-detail-enhancement.md` (planning stage)
- ✅ **AnimatedSplashScreen Bug Fix** - `docs/implementation-plan/animated-splash-screen-fix.md` (COMPLETED)
- 🆕 **Fix Hermes Require Error** - `docs/implementation-plan/fix-hermes-require-error.md` (planning stage)

## Project Status
- ✅ Authentication simplification completed (July 2025)
- ✅ Email/password auth with invite-only flow implemented  
- ✅ Database triggers and RLS configured
- ✅ User management documentation complete
- ✅ Expo SDK 53 upgrade completed
- 🔄 **Database Security Audit** - Phase 1 in progress (critical fixes completed)

## Implementation Plans
| Task | Implementation Plan | Status |
|------|-------------------|--------|
| Auth Simplification | `implementation-plan.md` | ✅ Complete |
| Expo SDK 53 Upgrade | `docs/implementation-plan/expo-sdk-53-upgrade.md` | ✅ Complete |
| **OTP Authentication** | `docs/implementation-plan/supabase-otp-auth.md` | ✅ **Complete - PR #7** |
| **Database Security Audit** | `docs/implementation-plan/database-security-audit.md` | 🔄 Phase 1 |
| **Database Schema Polish** | `docs/implementation-plan/database-schema-polish.md` | 🛠️ Planning |
| **Student Detail Enhancement** | `docs/implementation-plan/student-detail-enhancement.md` | 📝 Planning |
| **AnimatedSplashScreen Bug Fix** | `docs/implementation-plan/animated-splash-screen-fix.md` | ✅ **Complete** |
| **Fix Hermes Require Error** | `docs/implementation-plan/fix-hermes-require-error.md` | 🆕 Planning |

## Lessons Learned

### [2025-01-04] **CRITICAL: UI REGRESSION PREVENTION**
- **NEVER MERGE OUTDATED BRANCHES**: Always rebase or update feature branches before merging
- **UI REGRESSION ISSUE**: Database cleanup branch overwrote newer UI changes when merged
- **ROOT CAUSE**: Feature branch was created from older master, merge brought back old UI code
- **PREVENTION PROTOCOL**:
  1. Always `git pull origin master` before creating feature branches
  2. Before merging any PR, check that it doesn't revert recent UI changes
  3. Use `git rebase master` on feature branches before creating PRs
  4. Review merge commits carefully for file changes in UI directories
  5. Test UI functionality after every merge - NEVER assume database-only changes are safe

### [2025-01-04] **MANDATORY BRANCHING PROTOCOL**
- **BRANCH CREATION**: Always create from latest master: `git checkout master && git pull origin master && git checkout -b feature/name`
- **BEFORE PR MERGE**: 
  1. `git checkout feature-branch`
  2. `git rebase master` (resolve conflicts if any)
  3. Test UI functionality locally
  4. Check diff doesn't include unexpected UI file changes
  5. Only then merge PR
- **CRITICAL FILES TO MONITOR**: Any files in `app/screens/`, `app/components/`, `app/_layout.tsx`
- **RED FLAGS**: If a "database-only" or "docs-only" PR shows changes to UI files, STOP and investigate
- **UI TESTING**: After every merge, manually test key user flows (login, navigation, core features)

### [2025-01-04] Authentication Implementation
- Database trigger `on_auth_user_created` requires proper COALESCE handling for metadata
- User creation via Supabase requires string values in JSON: `"school_id": "1"` not `1`
- Always test trigger functionality after database changes

### [2025-01-04] Supabase with React Native
- ✅ **FIXED**: `@supabase/supabase-js` compatibility with React Native 0.79+ via Metro config
- ✅ **Metro config**: Added resolver workarounds for package exports
- ✅ **App bundling**: Successfully building and running

### [2025-01-10] OTP Authentication Implementation
- ✅ **COMPLETED**: Hybrid OTP/password authentication system implemented and tested
- **Key Features**: 6-digit email OTP codes, seamless UI toggle between password/OTP modes
- **B2B Model Preserved**: OTP only works for existing invited users, prevents unwanted signups
- **Navigation Fixed**: Resolved issue where OTP login went to deprecated setup screen
- **Technical Solution**: Used `signInWithOtp()` without `shouldCreateUser` for existing users only
- **PR Submitted**: [PR #7](https://github.com/ramdhanhdy/MadraXis/pull/7) ready for review and merge

### [2025-01-04] Authentication Issue Resolution
- **Problem**: User login refreshes screen instead of navigating to dashboard
- **Root Cause**: Missing role in `raw_user_meta_data` for some users
- **Solution**: Updated AuthContext to check both metadata sources and fallback to profiles table
- **User Creation**: Must include proper role metadata when creating users

### [2025-01-04] Project Dependencies  
- ✅ **UPGRADED**: Expo SDK 53 with React Native 0.79.4
- ✅ **New Architecture**: Already enabled (`"newArchEnabled": true`)
- ✅ **Key dependencies**: Supabase, React Navigation v7, Expo Router v5.1.2
- ⚠️ **TypeScript conflicts**: SDK 53 upgrade caused some TS config conflicts

### [2025-01-04] Database Security Audit  
- ✅ **CRITICAL FIXES COMPLETED**: Phase 0 successfully resolved all critical security vulnerabilities
- ✅ **RLS Vulnerability**: Fixed schools table policy using insecure user_metadata
- ✅ **Function Security**: Secured 6 database functions with search_path protection
- 🔄 **Phase 1**: Manual dashboard configuration needed for OTP expiry and leaked password protection

### [2025-01-13] Redundant Navigation in SignOut Functions Bug Fix
- ✅ **BUG FIXED**: Fixed redundant navigation calls in signOut functions causing double redirects
- ✅ **ROOT CAUSE**: Both `clearSession` and `handleSignOut` functions explicitly called `router.replace('/screens/auth/login')` when `onAuthStateChange` listener already handles navigation on 'SIGNED_OUT' event
- ✅ **SOLUTION**: Removed redundant navigation calls, relying on auth state change listener for consistent navigation
- ✅ **LESSON**: When using auth state change listeners, avoid explicit navigation in auth functions to prevent double redirects
- ✅ **IMPLEMENTATION**: Quick fix with fallback protection for error scenarios

### [2025-01-13] AnimatedSplashScreen Infinite Restart Bug Fix
- ✅ **BUG FIXED**: Fixed infinite animation restart in AnimatedSplashScreen component
- ✅ **ROOT CAUSE**: useEffect dependency array included `onAnimationFinish` callback, causing infinite re-runs when parent component re-rendered
- ✅ **SOLUTION**: Removed `onAnimationFinish` from useEffect dependencies - animation should only run once on mount
- ✅ **LESSON**: For one-time animations, avoid including callback functions in useEffect dependency arrays
- ✅ **IMPLEMENTATION**: Quick 45-minute fix with proper documentation and testing

### [2025-01-12] Metro Configuration Fix for Supabase and SVG Support
- ✅ **BUG FIXED**: Restored critical Metro configuration settings that were removed
- ✅ **Supabase Support**: Added `unstable_enableSymlinks`, `unstable_enablePackageExports`, and `resolverMainFields` for React Native 0.79+ compatibility
- ✅ **SVG Support**: Configured asset/source extensions to support react-native-svg usage and SVG file imports
- ✅ **Issue Resolved**: Fixed build errors related to Supabase imports and SVG file handling

## Branch Management
- Main development on `main` branch
- Feature branches for major updates
- Always test authentication flow after SDK upgrades

## Common Commands
```bash
# Start development
npm start

# Run linting
npm run lint

# Clean install
rm -rf node_modules package-lock.json && npm install

# Check for issues
npx expo-doctor
```

## Key Project Information
- **Project Name**: MadraXis (School Management App)
- **Current SDK**: Expo 53
- **Previous SDK**: Expo 52 (~52.0.47)
- **React Native**: 0.76.9 → 0.79
- **Supabase Project**: `bsjbixlueqoxpxbeygoi`