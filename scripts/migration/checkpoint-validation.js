#!/usr/bin/env node

/**
 * Migration Checkpoint Validation Script
 * 
 * Validates that each migration checkpoint meets its requirements
 * and that the system is ready to proceed to the next phase.
 * 
 * Usage:
 *   node scripts/migration/checkpoint-validation.js --checkpoint=infrastructure
 *   node scripts/migration/checkpoint-validation.js --checkpoint=parallel-structure
 *   node scripts/migration/checkpoint-validation.js --checkpoint=ui-components
 *   node scripts/migration/checkpoint-validation.js --checkpoint=domains
 *   node scripts/migration/checkpoint-validation.js --checkpoint=feature-slices
 *   node scripts/migration/checkpoint-validation.js --checkpoint=cleanup
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Command line arguments
const args = process.argv.slice(2);
const checkpoint = args.find(arg => arg.startsWith('--checkpoint='))?.split('=')[1];

if (!checkpoint) {
  console.error('❌ Please specify a checkpoint: --checkpoint=<checkpoint-name>');
  console.log('Available checkpoints: infrastructure, parallel-structure, ui-components, domains, feature-slices, cleanup');
  process.exit(1);
}

// Checkpoint validation configurations
const CHECKPOINTS = {
  'infrastructure': {
    name: 'Infrastructure Setup',
    validations: [
      () => validatePathAliases(),
      () => validateJestConfig(),
      () => validateESLintConfig(),
      () => validateStorybookConfig(),
      () => validateE2EConfig(),
      () => validateMigrationScripts(),
    ]
  },
  'parallel-structure': {
    name: 'Parallel Structure Creation',
    validations: [
      () => validateDirectoryStructure(),
      () => validateBarrelExports(),
      () => validateDualImports(),
      () => validateTypeScriptCompilation(),
    ]
  },
  'ui-components': {
    name: 'UI Components Migration',
    validations: [
      () => validateUIComponentMigration(),
      () => validateStorybookStories(),
      () => validateComponentTests(),
    ]
  },
  'domains': {
    name: 'Domain Migration',
    validations: [
      () => validateDomainMigration(),
      () => validateServiceReplacement(),
      () => validateDomainTests(),
    ]
  },
  'feature-slices': {
    name: 'Feature Slice Migration',
    validations: [
      () => validateFeatureSlices(),
      () => validateRouting(),
      () => validateE2ETests(),
    ]
  },
  'cleanup': {
    name: 'Cleanup and Validation',
    validations: [
      () => validateLegacyCleanup(),
      () => validateFinalTests(),
      () => validatePerformance(),
    ]
  }
};

/**
 * Main validation function
 */
async function validateCheckpoint() {
  const checkpointConfig = CHECKPOINTS[checkpoint];
  
  if (!checkpointConfig) {
    console.error(`❌ Unknown checkpoint: ${checkpoint}`);
    process.exit(1);
  }

  console.log(`🔍 Validating checkpoint: ${checkpointConfig.name}\n`);

  let passed = 0;
  let failed = 0;

  for (const validation of checkpointConfig.validations) {
    try {
      const result = await validation();
      if (result.success) {
        console.log(`✅ ${result.message}`);
        passed++;
      } else {
        console.log(`❌ ${result.message}`);
        if (result.details) {
          console.log(`   ${result.details}`);
        }
        failed++;
      }
    } catch (error) {
      console.log(`❌ Validation error: ${error.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Checkpoint Validation Summary:`);
  console.log(`   - Passed: ${passed}`);
  console.log(`   - Failed: ${failed}`);
  console.log(`   - Status: ${failed === 0 ? '✅ READY' : '❌ NOT READY'}`);

  if (failed > 0) {
    console.log(`\n💡 Fix the issues above before proceeding to the next phase.`);
    process.exit(1);
  } else {
    console.log(`\n🚀 Checkpoint validated successfully! Ready to proceed.`);
  }
}

/**
 * Validation functions for each checkpoint
 */

function validatePathAliases() {
  const tsconfigPath = 'tsconfig.json';
  if (!fs.existsSync(tsconfigPath)) {
    return { success: false, message: 'tsconfig.json not found' };
  }

  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
  const paths = tsconfig.compilerOptions?.paths || {};
  
  const requiredAliases = ['@ui/*', '@domains/*', '@lib/*', '@design-system/*', '@context/*', '@types/*', '@app/*'];
  const missingAliases = requiredAliases.filter(alias => !paths[alias]);
  
  if (missingAliases.length > 0) {
    return { 
      success: false, 
      message: 'Missing path aliases in tsconfig.json',
      details: `Missing: ${missingAliases.join(', ')}`
    };
  }

  return { success: true, message: 'Path aliases configured correctly' };
}

function validateJestConfig() {
  const jestConfigPath = 'jest.config.ts';
  if (!fs.existsSync(jestConfigPath)) {
    return { success: false, message: 'jest.config.ts not found' };
  }

  return { success: true, message: 'Jest configuration exists' };
}

function validateESLintConfig() {
  const eslintConfigPath = 'eslint.config.js';
  if (!fs.existsSync(eslintConfigPath)) {
    return { success: false, message: 'eslint.config.js not found' };
  }

  return { success: true, message: 'ESLint configuration exists' };
}

function validateStorybookConfig() {
  const storybookDir = '.storybook';
  if (!fs.existsSync(storybookDir)) {
    return { success: false, message: 'Storybook configuration not found' };
  }

  const mainJs = path.join(storybookDir, 'main.js');
  const previewJs = path.join(storybookDir, 'preview.js');
  
  if (!fs.existsSync(mainJs) || !fs.existsSync(previewJs)) {
    return { success: false, message: 'Storybook configuration incomplete' };
  }

  return { success: true, message: 'Storybook configuration complete' };
}

function validateE2EConfig() {
  const e2eDir = 'e2e';
  if (!fs.existsSync(e2eDir)) {
    return { success: false, message: 'E2E configuration not found' };
  }

  return { success: true, message: 'E2E configuration exists' };
}

function validateMigrationScripts() {
  const scriptsDir = 'scripts/migration';
  const requiredScripts = ['update-imports.js', 'validate-imports.js', 'test-patterns.js', 'rollback.js'];
  
  for (const script of requiredScripts) {
    if (!fs.existsSync(path.join(scriptsDir, script))) {
      return { 
        success: false, 
        message: 'Migration scripts incomplete',
        details: `Missing: ${script}`
      };
    }
  }

  return { success: true, message: 'Migration scripts complete' };
}

function validateDirectoryStructure() {
  const requiredDirs = [
    'src/ui',
    'src/ui/atoms',
    'src/ui/molecules', 
    'src/ui/organisms',
    'src/ui/templates',
    'src/domains',
    'src/domains/class',
    'src/domains/incidents',
    'src/domains/users',
    'src/domains/subjects',
    'src/domains/dashboard',
    'src/domains/schools',
    'src/lib',
    'src/lib/hooks',
    'src/lib/utils',
    'src/lib/constants',
    'src/lib/tests',
    'src/design-system'
  ];

  for (const dir of requiredDirs) {
    if (!fs.existsSync(dir)) {
      return { 
        success: false, 
        message: 'Directory structure incomplete',
        details: `Missing: ${dir}`
      };
    }
  }

  return { success: true, message: 'Directory structure complete' };
}

function validateBarrelExports() {
  const requiredIndexFiles = [
    'src/ui/index.ts',
    'src/ui/atoms/index.ts',
    'src/ui/molecules/index.ts',
    'src/ui/organisms/index.ts',
    'src/ui/templates/index.ts',
    'src/domains/index.ts',
    'src/lib/index.ts'
  ];

  for (const indexFile of requiredIndexFiles) {
    if (!fs.existsSync(indexFile)) {
      return { 
        success: false, 
        message: 'Barrel exports incomplete',
        details: `Missing: ${indexFile}`
      };
    }
  }

  return { success: true, message: 'Barrel exports complete' };
}

function validateDualImports() {
  // Check that compatibility layers exist
  const compatibilityFiles = [
    'src/components/index.ts',
    'src/hooks/index.ts',
    'src/services/index.ts'
  ];

  for (const file of compatibilityFiles) {
    if (!fs.existsSync(file)) {
      return { 
        success: false, 
        message: 'Dual import system incomplete',
        details: `Missing: ${file}`
      };
    }
  }

  return { success: true, message: 'Dual import system ready' };
}

function validateTypeScriptCompilation() {
  try {
    execSync('bun tsc --noEmit', { stdio: 'pipe' });
    return { success: true, message: 'TypeScript compilation successful' };
  } catch (error) {
    return { 
      success: false, 
      message: 'TypeScript compilation failed',
      details: 'Run "bun tsc --noEmit" for details'
    };
  }
}

// Placeholder validation functions for future checkpoints
function validateUIComponentMigration() {
  return { success: true, message: 'UI component migration validation (placeholder)' };
}

function validateStorybookStories() {
  return { success: true, message: 'Storybook stories validation (placeholder)' };
}

function validateComponentTests() {
  return { success: true, message: 'Component tests validation (placeholder)' };
}

function validateDomainMigration() {
  return { success: true, message: 'Domain migration validation (placeholder)' };
}

function validateServiceReplacement() {
  return { success: true, message: 'Service replacement validation (placeholder)' };
}

function validateDomainTests() {
  return { success: true, message: 'Domain tests validation (placeholder)' };
}

function validateFeatureSlices() {
  return { success: true, message: 'Feature slices validation (placeholder)' };
}

function validateRouting() {
  return { success: true, message: 'Routing validation (placeholder)' };
}

function validateE2ETests() {
  return { success: true, message: 'E2E tests validation (placeholder)' };
}

function validateLegacyCleanup() {
  return { success: true, message: 'Legacy cleanup validation (placeholder)' };
}

function validateFinalTests() {
  return { success: true, message: 'Final tests validation (placeholder)' };
}

function validatePerformance() {
  return { success: true, message: 'Performance validation (placeholder)' };
}

// Run the validation
validateCheckpoint().catch(error => {
  console.error('❌ Validation failed:', error.message);
  process.exit(1);
});
