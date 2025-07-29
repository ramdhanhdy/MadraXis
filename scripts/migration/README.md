# MadraXis Codebase Migration Scripts

This directory contains automated scripts for migrating the MadraXis codebase from the current service-oriented structure to a modern domain-driven architecture.

## 🎯 Migration Overview

The migration transforms the codebase from:
```
src/
├── components/     # Current UI structure
├── services/       # Current business logic
├── hooks/          # Current utilities
└── utils/          # Current helpers
```

To:
```
src/
├── ui/             # Atomic design components
├── domains/        # Domain-driven business logic
├── lib/            # Shared utilities and helpers
└── context/        # Global state management
```

## 📋 Migration Phases

### Phase 1: Infrastructure Setup (35 SP)
- Configure path aliases in `tsconfig.json`
- Set up Storybook and E2E testing
- Create migration automation scripts

### Phase 2: Parallel Structure Creation (20 SP)
- Create new directory structures alongside existing ones
- Set up barrel exports for backward compatibility

### Phase 3: UI Components Migration (80 SP)
- Migrate from `src/components/` to `src/ui/`
- Update all component imports
- Maintain atomic design structure

### Phase 4: Domain Migration (120 SP)
- Create domain modules from `src/services/`
- Migrate business logic to domain-specific modules
- Update service imports throughout codebase

### Phase 5: Feature Slice Migration (60 SP)
- Convert flat route files to feature directories
- Implement feature-specific patterns

### Phase 6: Library Migration (30 SP)
- Migrate utilities from `src/hooks/` and `src/utils/` to `src/lib/`

## 🛠️ Available Scripts

### 1. Import Update Script (`update-imports.js`)

Automatically updates import paths during migration phases.

```bash
# Migrate UI component imports
node scripts/migration/update-imports.js --phase=ui-components

# Migrate domain service imports
node scripts/migration/update-imports.js --phase=domains

# Migrate library utility imports
node scripts/migration/update-imports.js --phase=lib

# Preview changes without applying them
node scripts/migration/update-imports.js --phase=ui-components --dry-run

# Rollback a specific phase
node scripts/migration/update-imports.js --phase=ui-components --rollback
```

**Supported Phases:**
- `ui-components`: Migrates component imports to `@ui/*` aliases
- `domains`: Migrates service imports to `@domains/*` aliases
- `lib`: Migrates utility imports to `@lib/*` aliases

### 2. Import Validation Script (`validate-imports.js`)

Validates that all imports are working correctly after migration.

```bash
# Run all validations
node scripts/migration/validate-imports.js

# Check only for broken imports
node scripts/migration/validate-imports.js --check-broken-imports

# Check for unused exports
node scripts/migration/validate-imports.js --check-unused-exports

# Check for circular dependencies
node scripts/migration/validate-imports.js --check-circular-deps
```

**Validation Checks:**
- ✅ Broken import detection
- ✅ TypeScript compilation validation
- ✅ Unused export identification
- ✅ Path alias resolution

### 3. Rollback Script (`rollback.js`)

Provides rollback capabilities for migration phases.

```bash
# List available backups
node scripts/migration/rollback.js --list-backups

# Rollback to specific phase
node scripts/migration/rollback.js --to-phase=2 --force

# Rollback to named checkpoint
node scripts/migration/rollback.js --to-checkpoint=ui-components --force
```

**Available Checkpoints:**
- `infrastructure`: Phase 1 - Infrastructure Setup
- `parallel-structure`: Phase 2 - Parallel Structure Creation
- `ui-components`: Phase 3 - UI Components Migration
- `domains`: Phase 4 - Domain Migration
- `feature-slices`: Phase 5 - Feature Slice Migration
- `cleanup`: Phase 6 - Cleanup and Validation

## 🚀 Quick Start Guide

### 1. Pre-Migration Setup

```bash
# Ensure you're on a clean branch
git checkout -b feature/codebase-refactor

# Make scripts executable
chmod +x scripts/migration/*.js

# Create initial backup
git add . && git commit -m "Pre-migration backup"
```

### 2. Run Migration Phases

```bash
# Phase 1: Set up infrastructure
# (Manual setup of tsconfig.json, Storybook, etc.)

# Phase 2: Create parallel structure
# (Manual creation of new directories)

# Phase 3: Migrate UI components
node scripts/migration/update-imports.js --phase=ui-components
node scripts/migration/validate-imports.js

# Phase 4: Migrate domains
node scripts/migration/update-imports.js --phase=domains
node scripts/migration/validate-imports.js

# Phase 5: Migrate libraries
node scripts/migration/update-imports.js --phase=lib
node scripts/migration/validate-imports.js
```

### 3. Validation and Testing

```bash
# Run comprehensive validation
node scripts/migration/validate-imports.js

# Run test suite
npm run test

# Check TypeScript compilation
npx tsc --noEmit
```

## 🔧 Configuration

### Path Aliases

The scripts expect these path aliases to be configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@ui/*": ["src/ui/*"],
      "@domains/*": ["src/domains/*"],
      "@lib/*": ["src/lib/*"],
      "@context/*": ["src/context/*"],
      "@types/*": ["src/types/*"]
    }
  }
}
```

### Package.json Scripts

Add these convenience scripts to your `package.json`:

```json
{
  "scripts": {
    "migrate:ui": "node scripts/migration/update-imports.js --phase=ui-components",
    "migrate:domains": "node scripts/migration/update-imports.js --phase=domains",
    "migrate:lib": "node scripts/migration/update-imports.js --phase=lib",
    "migrate:validate": "node scripts/migration/validate-imports.js",
    "migrate:rollback": "node scripts/migration/rollback.js --list-backups"
  }
}
```

## 🛡️ Safety Features

### Automatic Backups
- Scripts automatically create backups before making changes
- Backups are stored in `.migration-backup/` directory
- Each phase creates a separate backup

### Dry Run Mode
- Preview changes before applying them
- Use `--dry-run` flag with update scripts

### Rollback Capabilities
- Rollback to any previous phase
- Automatic cleanup of migration artifacts
- Restore from backups

### Validation
- Comprehensive import validation
- TypeScript compilation checks
- Broken import detection

## 🚨 Troubleshooting

### Common Issues

1. **Broken Imports After Migration**
   ```bash
   # Run validation to identify issues
   node scripts/migration/validate-imports.js --check-broken-imports
   
   # Check TypeScript compilation
   npx tsc --noEmit
   ```

2. **Path Aliases Not Working**
   - Ensure `tsconfig.json` is properly configured
   - Restart TypeScript server in your IDE
   - Check Metro bundler configuration for React Native

3. **Migration Script Errors**
   ```bash
   # Check if files are locked or in use
   # Ensure you have write permissions
   # Try running with --dry-run first
   ```

### Recovery Procedures

1. **Partial Migration Failure**
   ```bash
   # Rollback to last successful phase
   node scripts/migration/rollback.js --to-phase=2 --force
   
   # Fix issues and retry
   node scripts/migration/update-imports.js --phase=ui-components
   ```

2. **Complete Migration Failure**
   ```bash
   # Rollback to beginning
   node scripts/migration/rollback.js --to-phase=1 --force
   
   # Or restore from git
   git reset --hard HEAD~1
   ```

## 📊 Progress Tracking

Track your migration progress using the checklist in `tasks.md`:

- [ ] Phase 1: Infrastructure Setup (35 SP)
- [ ] Phase 2: Parallel Structure Creation (20 SP)
- [ ] Phase 3: UI Components Migration (80 SP)
- [ ] Phase 4: Domain Migration (120 SP)
- [ ] Phase 5: Feature Slice Migration (60 SP)
- [ ] Phase 6: Library Migration (30 SP)

**Total Estimated Effort:** 440 Story Points

## 🤝 Contributing

When modifying migration scripts:

1. Test thoroughly with `--dry-run` mode
2. Update this README with any new features
3. Add appropriate error handling
4. Include rollback procedures for new changes

## 📞 Support

If you encounter issues during migration:

1. Check this README for troubleshooting steps
2. Run validation scripts to identify specific problems
3. Use rollback procedures to recover from failures
4. Consult the main project documentation in `docs/specs/`
