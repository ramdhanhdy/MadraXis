# Expo SDK 53 Upgrade Implementation Plan

**Project**: MadraXis School Management App  
**Current SDK**: Expo 52 (~52.0.47) with React Native 0.76.9  
**Target SDK**: Expo 53 with React Native 0.79  
**Date**: January 4, 2025  

## Executive Summary

This plan upgrades MadraXis from Expo SDK 52 to SDK 53 to match the user's phone version (SDK 53). The upgrade includes React Native 0.76 → 0.79, New Architecture improvements, and addressing known compatibility issues with Supabase and Metro bundler.

---

## PHASE 0 — Pre-Upgrade Assessment & Risk Analysis

### 0-A Current Project State
- ✅ **Expo SDK 52** (~52.0.47) 
- ✅ **React Native 0.76.9**
- ✅ **New Architecture**: Already enabled (`"newArchEnabled": true`)
- ✅ **Authentication**: Email/password system working
- ✅ **Supabase**: `@supabase/supabase-js` integration functional

### 0-B Known Issues & Risks
**HIGH RISK**: Supabase JS package exports compatibility
- `@supabase/supabase-js` has package.json exports issues with React Native 0.79+
- Metro bundler may fail to resolve modules correctly
- **Mitigation**: Metro config workarounds available

**MEDIUM RISK**: Breaking changes in React Native 0.79
- New requirements for native modules
- Potential styling and layout changes
- **Mitigation**: Test thoroughly and use compatibility packages

**LOW RISK**: Expo Router and Navigation
- Generally stable across SDK versions
- Minor API adjustments possible

### 0-C Compatibility Check
```bash
npx expo-doctor            # Check for issues
npm outdated               # See what needs updating
npm audit                  # Security vulnerabilities
```

---

## PHASE 1 — Automated Upgrade & Base Dependencies

### 1-A Backup Current State
```bash
git add . && git commit -m "Pre-SDK53 upgrade snapshot"
git branch backup-sdk52
```

### 1-B Run Expo Upgrade Tool
```bash
npx expo install --fix       # Fix existing dependencies first
npx expo upgrade 53           # Upgrade to SDK 53
```

### 1-C Verify Core Changes
- **package.json**: SDK version ~53.0.0
- **app.json**: SDK version "53.0.0"  
- **React Native**: 0.79.x

### 1-D Handle Upgrade Conflicts
If automation fails:
```bash
npm uninstall expo
npm install expo@~53.0.0
npx expo install --fix
```

---

## PHASE 2 — Dependency Audit & Compatibility Updates

### 2-A Critical Dependencies Review
Check these packages for SDK 53 compatibility:

| Package | Current | Target | Notes |
|---------|---------|---------|-------|
| `@supabase/supabase-js` | Latest | Latest | **⚠️ Metro config needed** |
| `@react-navigation/native` | v6/v7 | v7+ | Should be compatible |
| `expo-router` | v4 | v4+ | Update if available |
| `react-native-url-polyfill` | - | Check | Supabase dependency |

### 2-B Update Dependencies
```bash
npx expo install --fix                    # Auto-fix Expo packages
npm update @supabase/supabase-js           # Update Supabase
npm install react-native-url-polyfill     # If needed for Supabase
```

### 2-C Metro Configuration (Supabase Fix)
**Create/Update `metro.config.js`:**
```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Fix for @supabase/supabase-js package exports issue
config.resolver.unstable_enableSymlinks = true;
config.resolver.unstable_enablePackageExports = true;

// Alternative: Force specific resolution for problematic packages
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config;
```

---

## PHASE 3 — Code Fixes & New Architecture Updates

### 3-A React Native 0.79 Breaking Changes
Review and fix:

1. **StyleSheet and Layout Changes**
   - Check for deprecated style properties
   - Verify Flexbox behavior consistency

2. **Native Module Updates**
   - Ensure all native dependencies support RN 0.79
   - Check Expo modules compatibility

3. **TypeScript Updates**
   - Update `@types/react-native` if needed
   - Fix any new type errors

### 3-B Authentication System Verification
Priority check since auth is core functionality:

1. **Supabase Auth Methods**
   ```tsx
   // Verify these still work:
   supabase.auth.signInWithPassword()
   supabase.auth.resetPasswordForEmail()
   supabase.auth.updateUser()
   supabase.auth.setSession()
   ```

2. **Deep Linking**
   ```tsx
   // Verify reset-password deep links work:
   // madraxis://reset-password#access_token=...
   ```

### 3-C Common Fix Patterns

**If Metro bundling fails:**
```bash
npx expo start --clear              # Clear cache
rm -rf node_modules .expo
npm install
```

**If Supabase imports fail:**
```javascript
// Try alternative import in problematic files:
import { createClient } from '@supabase/supabase-js/dist/main';
```

---

## PHASE 4 — Native Build Validation

### 4-A Clean Native Build
```bash
npx expo prebuild --clean --platform all
```

### 4-B Development Build Test
```bash
npx expo run:android              # Test Android
npx expo run:ios                  # Test iOS (if available)
```

### 4-C Build Issues Troubleshooting

**Common React Native 0.79 Build Issues:**
1. **Gradle Issues**: Update Android Gradle Plugin
2. **iOS Issues**: Update CocoaPods and iOS deployment target
3. **New Architecture**: Verify all modules support it

**Metro Resolution Issues:**
```bash
# Clear all caches
npx expo start --clear
npx react-native start --reset-cache
rm -rf /tmp/metro-* ~/.metro
```

---

## PHASE 5 — Comprehensive Testing & Validation

### 5-A Authentication Flow Testing
**Critical Path Tests:**
1. 🔄 **Email/Password Login** → Dashboard routing by role
2. 🔄 **Password Reset Flow** → Deep link → Password update  
3. 🔄 **Session Persistence** → App restart → Stay logged in
4. 🔄 **Role-based Navigation** → Teacher/Parent/Student/Management

### 5-B Core Functionality Testing
1. **Navigation**: All screens accessible
2. **Forms**: Input validation and submission
3. **Database**: Supabase queries and mutations
4. **Styling**: No layout regressions
5. **Performance**: App startup and screen transitions

### 5-C Device Testing
- **Development**: Expo Go or Development Build
- **Production**: EAS Build test
- **Multiple Devices**: Different screen sizes and OS versions

---

## PHASE 6 — Documentation & Cleanup

### 6-A Update Documentation
**Update these files:**
```
README.md                    # New SDK requirements
docs/scratchpad.md          # Lessons learned
package.json                # Verify scripts still work
```

### 6-B Clean Up Build Artifacts
```bash
rm -rf .expo
rm -rf android/build        # If exists
rm -rf ios/build            # If exists
git clean -fdx               # Remove all untracked files
```

### 6-C Commit Upgrade
```bash
git add .
git commit -m "✅ Upgrade to Expo SDK 53 (React Native 0.79)

- Updated all Expo packages to SDK 53
- Fixed Metro config for Supabase compatibility  
- Verified authentication flow works
- Tested core app functionality
- Updated documentation"
```

---

## Risk Mitigation & Rollback Plan

### Quick Rollback Strategy
```bash
git checkout backup-sdk52                    # Return to pre-upgrade state
npm install                                  # Restore dependencies
```

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Metro bundling fails | Update `metro.config.js` with resolver fixes |
| Supabase import errors | Use alternative import paths or polyfills |
| Build failures | Clean all caches and rebuild |
| Auth flow broken | Verify deep-link configuration |
| Performance degradation | Profile and optimize with React DevTools |

---

## Success Criteria Checklist

### Core Functionality
- [ ] **App starts successfully** on development device
- [ ] **Authentication flow** works end-to-end
- [ ] **Role-based routing** functions correctly  
- [ ] **Database operations** via Supabase work
- [ ] **Deep linking** for password reset works
- [ ] **No console errors** during normal usage

### Technical Requirements  
- [ ] **Build succeeds** without errors
- [ ] **Metro bundling** completes successfully
- [ ] **TypeScript compilation** passes
- [ ] **Linting** passes (`npm run lint`)
- [ ] **All dependencies** updated to SDK 53 compatible versions

### Quality Assurance
- [ ] **Performance** acceptable (startup < 3s)
- [ ] **UI rendering** correct on test devices
- [ ] **Navigation** smooth between screens  
- [ ] **Forms and inputs** work properly
- [ ] **Error handling** graceful

---

## Post-Upgrade Monitoring

### Week 1: Immediate Issues
- Monitor app crashes and errors
- Test all user flows extensively  
- Check performance metrics

### Week 2-4: Stability Assessment
- User feedback on any issues
- Performance monitoring
- Consider EAS Build for production testing

---

**Implementation Timeline**: 2-4 hours for upgrade + 1-2 days for thorough testing  
**Risk Level**: Medium (due to Supabase compatibility)  
**Rollback Time**: ~15 minutes if major issues found 