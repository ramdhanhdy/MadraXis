# Design System Migration Scripts

This directory contains automated tools for migrating components to the MadraXis Design System.

## 📋 Available Scripts

### 1. Component Inventory (`inventory.js`)
Analyzes all components and creates migration priority lists.

```bash
# Scan all components
node scripts/design-system/inventory.js

# Scan specific directory
node scripts/design-system/inventory.js --dir=src/ui/atoms

# Generate detailed report
node scripts/design-system/inventory.js --report --output=migration-report.json
```

### 2. Pattern Detection (`detect-patterns.js`)
Identifies legacy styling patterns that need migration.

```bash
# Detect all patterns
node scripts/design-system/detect-patterns.js

# Detect specific patterns
node scripts/design-system/detect-patterns.js --pattern=hardcoded-colors
node scripts/design-system/detect-patterns.js --pattern=old-theme-imports
node scripts/design-system/detect-patterns.js --pattern=stylesheet-create

# Scan specific file
node scripts/design-system/detect-patterns.js --file=src/ui/atoms/Button.tsx
```

### 3. Import Migration (`migrate-imports.js`)
Automatically updates import statements to use design system.

```bash
# Migrate all imports
node scripts/design-system/migrate-imports.js

# Migrate specific component
node scripts/design-system/migrate-imports.js --component=Button

# Dry run (preview changes)
node scripts/design-system/migrate-imports.js --dry-run
```

### 4. Migration Validation (`validate.js`)
Validates that components comply with design system requirements.

```bash
# Validate all components
node scripts/design-system/validate.js

# Validate specific component
node scripts/design-system/validate.js --component=Button

# Generate compliance report
node scripts/design-system/validate.js --report
```

### 5. Component Backup (`backup.js`)
Creates backups of components before migration.

```bash
# Backup specific component
node scripts/design-system/backup.js --component=Button

# Backup entire directory
node scripts/design-system/backup.js --dir=src/ui/atoms

# List available backups
node scripts/design-system/backup.js --list
```

### 6. Rollback (`rollback.js`)
Restores components from backups if migration fails.

```bash
# Rollback specific component
node scripts/design-system/rollback.js --component=Button

# Rollback to specific checkpoint
node scripts/design-system/rollback.js --checkpoint=phase-1-complete

# List rollback options
node scripts/design-system/rollback.js --list
```

## 🎯 Usage Workflow

### Phase 1: Analysis
```bash
# 1. Create component inventory
node scripts/design-system/inventory.js --report

# 2. Detect migration patterns
node scripts/design-system/detect-patterns.js --report

# 3. Review generated reports
cat migration-report.json
cat pattern-analysis.json
```

### Phase 2: Migration
```bash
# 1. Backup components before migration
node scripts/design-system/backup.js --dir=src/ui/atoms

# 2. Migrate imports (dry run first)
node scripts/design-system/migrate-imports.js --dry-run
node scripts/design-system/migrate-imports.js

# 3. Validate migration
node scripts/design-system/validate.js --report
```

### Phase 3: Validation
```bash
# 1. Run comprehensive validation
node scripts/design-system/validate.js --comprehensive

# 2. Generate final compliance report
node scripts/design-system/validate.js --final-report

# 3. Clean up backups (optional)
node scripts/design-system/backup.js --cleanup
```

## 🔧 Script Configuration

### Configuration File (`config.json`)
```json
{
  "directories": {
    "ui": "src/ui",
    "app": "app",
    "backup": ".migration-backups"
  },
  "patterns": {
    "hardcodedColors": "['\"](#[0-9a-fA-F]{3,6})['\"]",
    "oldThemeImports": "from ['\"].*ThemeContext['\"]",
    "stylesheetCreate": "StyleSheet\\.create\\s*\\("
  },
  "designSystem": {
    "themeImport": "@design-system",
    "componentImport": "@ui"
  }
}
```

### Environment Variables
```bash
# Set custom configuration
export DS_CONFIG_PATH="./custom-config.json"

# Enable verbose logging
export DS_VERBOSE=true

# Set backup directory
export DS_BACKUP_DIR="./.migration-backups"
```

## 📊 Report Formats

### Component Inventory Report
```json
{
  "summary": {
    "totalComponents": 150,
    "alreadyMigrated": 45,
    "needsMigration": 105
  },
  "components": [
    {
      "name": "Button",
      "path": "src/ui/atoms/Button/Button.tsx",
      "status": "migrated",
      "complexity": "simple",
      "priority": "high"
    }
  ]
}
```

### Pattern Analysis Report
```json
{
  "patterns": {
    "hardcodedColors": {
      "count": 23,
      "files": ["src/ui/atoms/Card.tsx", "app/login.tsx"]
    },
    "oldThemeImports": {
      "count": 8,
      "files": ["src/ui/molecules/Header.tsx"]
    }
  }
}
```

## 🚨 Safety Features

### Automatic Backups
- All scripts create backups before making changes
- Backups include timestamps and checksums
- Rollback capability for any migration step

### Validation Checks
- Syntax validation after each change
- Import path verification
- Component functionality testing

### Dry Run Mode
- Preview changes before applying
- Detailed change reports
- Risk assessment for each change

## 🛠️ Development

### Adding New Scripts
1. Create script in `scripts/design-system/`
2. Follow existing naming conventions
3. Include help documentation
4. Add tests in `__tests__/` directory

### Testing Scripts
```bash
# Run script tests
npm test scripts/design-system/

# Test specific script
npm test scripts/design-system/inventory.test.js
```

---

**Note:** Always run scripts in dry-run mode first to preview changes before applying them.
