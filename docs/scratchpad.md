# MadraXis Project Scratchpad

## Current Active Tasks
- 🔄 **Database Security Audit** - `docs/implementation-plan/database-security-audit.md` (Phase 1 - Dashboard config needed)
- **Auth Role Navigation Fix** - User login authentication working

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
| **Database Security Audit** | `docs/implementation-plan/database-security-audit.md` | 🔄 Phase 1 |

## Lessons Learned

### [2025-01-04] Authentication Implementation
- Database trigger `on_auth_user_created` requires proper COALESCE handling for metadata
- User creation via Supabase requires string values in JSON: `"school_id": "1"` not `1`
- Always test trigger functionality after database changes

### [2025-01-04] Supabase with React Native
- ✅ **FIXED**: `@supabase/supabase-js` compatibility with React Native 0.79+ via Metro config
- ✅ **Metro config**: Added resolver workarounds for package exports
- ✅ **App bundling**: Successfully building and running

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
- **Current SDK**: Expo 52 (~52.0.47)
- **Target SDK**: Expo 53
- **React Native**: 0.76.9 → 0.79
- **Supabase Project**: `bsjbixlueqoxpxbeygoi` ("Madraxis")
- **Deep Linking**: `madraxis://` 