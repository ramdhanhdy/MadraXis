# Fix Hermes Require Error

## Branch Name
fix-hermes-require-error

## Background and Motivation
The app is encountering a runtime error: "[runtime not ready]: ReferenceError: Property 'require' doesn't exist, js engine: hermes" despite successful bundling. This appears after upgrading to Expo SDK 53 and using Supabase. The error likely stems from dependencies (e.g., 'ws' in Supabase) using Node.js-specific modules like 'stream' that aren't compatible with Hermes in React Native. The goal is to resolve this compatibility issue to ensure smooth app runtime without errors.

## Key Challenges and Analysis
- Hermes, the default JS engine in Expo, doesn't support certain Node.js patterns like dynamic 'require'.
- Supabase's real-time features use WebSockets ('ws' library), which may attempt to import Node modules.
- Metro bundler needs configuration to provide fallbacks/shims for these modules.
- Potential need to install polyfills like 'readable-stream'.
- Must test on both development and production builds to ensure no regressions.

## High-level Task Breakdown
1. Create a new feature branch from master.
   - Command: git checkout master && git pull origin master && git checkout -b fix-hermes-require-error
   - Success Criteria: Branch is created, up-to-date with master, and active. Verify with `git status`.

2. Install required polyfill dependencies if not present (e.g., readable-stream).
   - Command: bun add readable-stream
   - Success Criteria: Dependency added to package.json, no installation errors. Verify with `bun list`.

3. Update metro.config.js to include Node module fallbacks.
   - Add: config.resolver.extraNodeModules = { stream: require.resolve('readable-stream') };
   - Also consider adding 'cjs' to sourceExts if needed for CommonJS support.
   - Success Criteria: File updated without syntax errors. Metro config loads successfully on app start.

4. Clear caches and test the app locally.
   - Commands: bun expo start --clear (or equivalent with bun); Test on emulator/device.
   - Success Criteria: App bundles and runs without the 'require' error. Supabase features (auth, realtime) work as expected.

5. Commit changes and create a draft PR.
   - Success Criteria: PR created on GitHub, changes documented. No lint errors.

6. Test on a development build if necessary.
   - Command: eas build --profile development --platform android (or ios)
   - Success Criteria: Build succeeds, app runs on device without error.

## Project Status Board
- [ ] Task 1: Create feature branch
- [ ] Task 2: Install polyfills
- [ ] Task 3: Update metro.config.js
- [ ] Task 4: Test locally
- [ ] Task 5: Commit and create PR
- [ ] Task 6: Test development build

## Executor's Feedback or Assistance Requests
(None at planning stage)

## Lessons Learned
(To be updated during execution) 