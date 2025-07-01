# MadraXis Project Scratchpad

## Current Active Tasks
- **Expo SDK 53 Upgrade** - `docs/implementation-plan/expo-sdk-53-upgrade.md`

## Project Status
- ✅ Authentication simplification completed (July 2025)
- ✅ Email/password auth with invite-only flow implemented  
- ✅ Database triggers and RLS configured
- ✅ User management documentation complete
- 🟡 **CURRENT**: Expo SDK 53 upgrade in progress

## Implementation Plans
| Task | Implementation Plan | Status |
|------|-------------------|--------|
| Auth Simplification | `implementation-plan.md` | ✅ Complete |
| Expo SDK 53 Upgrade | `docs/implementation-plan/expo-sdk-53-upgrade.md` | 🚀 Active |

## Lessons Learned

### [2025-01-04] Authentication Implementation
- Database trigger `on_auth_user_created` requires proper COALESCE handling for metadata
- User creation via Supabase requires string values in JSON: `"school_id": "1"` not `1`
- Always test trigger functionality after database changes

### [2025-01-04] Supabase with React Native
- `@supabase/supabase-js` has known compatibility issues with package.json exports in React Native 0.79+
- May require Metro config workarounds or library updates for SDK 53 upgrade

### [2025-01-04] Project Dependencies
- Current project uses Expo SDK 52 with React Native 0.76.9
- New Architecture already enabled (`"newArchEnabled": true`)
- Key dependencies: Supabase, React Navigation v7, Expo Router v4

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