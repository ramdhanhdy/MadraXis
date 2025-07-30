#!/usr/bin/env node

/**
 * Migration Pattern Test Suite
 * 
 * Comprehensive testing for all migration regex patterns to ensure:
 * - Forward transformations work correctly
 * - Rollback transformations properly reverse forward changes
 * - Both single (../) and double (../../) relative paths are handled
 * - Global regex lastIndex is properly reset to avoid flakiness
 * 
 * Usage:
 *   node scripts/migration/test-patterns.js
 *   node scripts/migration/test-patterns.js --phase=ui-components
 *   node scripts/migration/test-patterns.js --verbose
 */

// No additional imports needed

// Import the migration phases configuration
// We need to temporarily disable the main execution in update-imports.js
let MIGRATION_PHASES;
try {
  const updateImportsModule = require('./update-imports');
  MIGRATION_PHASES = updateImportsModule.MIGRATION_PHASES;
} catch (error) {
  console.error('❌ Failed to import MIGRATION_PHASES:', error.message);
  console.error('Make sure update-imports.js exports MIGRATION_PHASES');
  process.exit(1);
}

// Command line arguments
const args = process.argv.slice(2);
const specificPhase = args.find(arg => arg.startsWith('--phase='))?.split('=')[1];
const verbose = args.includes('--verbose');

// Test samples for each migration phase
const TEST_SAMPLES = {
  'ui-components': [
    // Atoms
    { input: "from '../../src/components/atoms/Button'", expected: "from '@ui/atoms/Button'" },
    { input: "from '../src/components/atoms/Input'", expected: "from '@ui/atoms/Input'" },
    { input: 'from "../../src/components/atoms/Icon"', expected: 'from "@ui/atoms/Icon"' },
    { input: 'from "../src/components/atoms/Badge"', expected: 'from "@ui/atoms/Badge"' },
    
    // Molecules
    { input: "from '../../src/components/molecules/Card'", expected: "from '@ui/molecules/Card'" },
    { input: "from '../src/components/molecules/Form'", expected: "from '@ui/molecules/Form'" },
    { input: 'from "../../src/components/molecules/Modal"', expected: 'from "@ui/molecules/Modal"' },
    { input: 'from "../src/components/molecules/Dropdown"', expected: 'from "@ui/molecules/Dropdown"' },
    
    // Organisms
    { input: "from '../../src/components/organisms/Header'", expected: "from '@ui/organisms/Header'" },
    { input: "from '../src/components/organisms/Sidebar'", expected: "from '@ui/organisms/Sidebar'" },
    { input: 'from "../../src/components/organisms/Navigation"', expected: 'from "@ui/organisms/Navigation"' },
    { input: 'from "../src/components/organisms/Footer"', expected: 'from "@ui/organisms/Footer"' },
    
    // Templates
    { input: "from '../../src/components/templates/Page'", expected: "from '@ui/templates/Page'" },
    { input: "from '../src/components/templates/Layout'", expected: "from '@ui/templates/Layout'" },
    { input: 'from "../../src/components/templates/Dashboard"', expected: 'from "@ui/templates/Dashboard"' },
    { input: 'from "../src/components/templates/Profile"', expected: 'from "@ui/templates/Profile"' },
    
    // Generic components
    { input: "from '../src/components/Logo'", expected: "from '@ui/Logo'" },
    { input: "from '../../src/components/LoadingSpinner'", expected: "from '@ui/LoadingSpinner'" },
    { input: 'from "../src/components/ErrorBoundary"', expected: 'from "@ui/ErrorBoundary"' }
  ],
  
  'domains': [
    // Specific service mappings
    { input: "from '../../src/services/classService'", expected: "from '@domains/class'" },
    { input: "from '../src/services/classService'", expected: "from '@domains/class'" },
    { input: 'from "../../src/services/classService"', expected: 'from "@domains/class"' },
    { input: 'from "../src/services/classService"', expected: 'from "@domains/class"' },
    
    // Generic service mappings
    { input: "from '../../src/services/userService'", expected: "from '@domains/userService'" },
    { input: "from '../src/services/userService'", expected: "from '@domains/userService'" },
    { input: "from '../../src/services/incidentService'", expected: "from '@domains/incidentService'" },
    { input: "from '../src/services/incidentService'", expected: "from '@domains/incidentService'" },
    { input: "from '../../src/services/schoolService'", expected: "from '@domains/schoolService'" },
    { input: "from '../src/services/schoolService'", expected: "from '@domains/schoolService'" },
    { input: "from '../../src/services/subjectService'", expected: "from '@domains/subjectService'" },
    { input: "from '../src/services/subjectService'", expected: "from '@domains/subjectService'" },
    { input: "from '../../src/services/dashboard'", expected: "from '@domains/dashboard'" },
    { input: "from '../src/services/dashboard'", expected: "from '@domains/dashboard'" },
    
    // Mixed quote styles
    { input: 'from "../../src/services/authService"', expected: 'from "@domains/authService"' },
    { input: 'from "../src/services/authService"', expected: 'from "@domains/authService"' }
  ],
  
  'lib': [
    // Hooks
    { input: "from '../../src/hooks/useAuth'", expected: "from '@lib/hooks/useAuth'" },
    { input: "from '../src/hooks/useAuth'", expected: "from '@lib/hooks/useAuth'" },
    { input: "from '../../src/hooks/useFetch'", expected: "from '@lib/hooks/useFetch'" },
    { input: "from '../src/hooks/useFetch'", expected: "from '@lib/hooks/useFetch'" },
    { input: "from '../../src/hooks/useClassStudentBreakdown'", expected: "from '@lib/hooks/useClassStudentBreakdown'" },
    { input: "from '../src/hooks/useClassStudentBreakdown'", expected: "from '@lib/hooks/useClassStudentBreakdown'" },
    
    // Utils
    { input: "from '../../src/utils/parser'", expected: "from '@lib/utils/parser'" },
    { input: "from '../src/utils/parser'", expected: "from '@lib/utils/parser'" },
    { input: "from '../../src/utils/formatter'", expected: "from '@lib/utils/formatter'" },
    { input: "from '../src/utils/formatter'", expected: "from '@lib/utils/formatter'" },
    { input: "from '../../src/utils/validation'", expected: "from '@lib/utils/validation'" },
    { input: "from '../src/utils/validation'", expected: "from '@lib/utils/validation'" },
    
    // Mixed quote styles
    { input: 'from "../../src/hooks/useLocalStorage"', expected: 'from "@lib/hooks/useLocalStorage"' },
    { input: 'from "../src/utils/dateHelpers"', expected: 'from "@lib/utils/dateHelpers"' }
  ]
};

// Rollback test samples (reverse of forward transformations)
// Note: Rollback patterns match the first applicable pattern. Due to pattern ordering,
// single-level patterns match first for most cases, except for specific patterns like classService
const ROLLBACK_SAMPLES = {
  'ui-components': [
    { input: "from '@ui/atoms/Button'", expected: "from '../src/components/atoms/Button'" },
    { input: "from '@ui/molecules/Card'", expected: "from '../src/components/molecules/Card'" },
    { input: 'from "@ui/organisms/Header"', expected: 'from "../src/components/organisms/Header"' },
    { input: 'from "@ui/templates/Page"', expected: 'from "../src/components/templates/Page"' },
    { input: "from '@ui/Logo'", expected: "from '../src/components/Logo'" }
  ],

  'domains': [
    { input: "from '@domains/class'", expected: "from '../src/services/classService'" },
    { input: "from '@domains/userService'", expected: "from '../src/services/userService'" },
    { input: 'from "@domains/incidentService"', expected: 'from "../src/services/incidentService"' }
  ],

  'lib': [
    { input: "from '@lib/hooks/useAuth'", expected: "from '../src/hooks/useAuth'" },
    { input: "from '@lib/utils/parser'", expected: "from '../src/utils/parser'" },
    { input: 'from "@lib/hooks/useFetch"', expected: 'from "../src/hooks/useFetch"' }
  ]
};

/**
 * Reset global regex lastIndex to prevent flakiness
 */
function resetRegexLastIndex(patterns) {
  patterns.forEach(pattern => {
    if (pattern.forward.from.global) {
      pattern.forward.from.lastIndex = 0;
    }
    if (pattern.rollback.from.global) {
      pattern.rollback.from.lastIndex = 0;
    }
  });
}

/**
 * Test forward transformations for a specific phase
 */
function testForwardTransformations(phaseKey, patterns, samples) {
  let passed = 0;
  let failed = 0;
  
  if (verbose) {
    console.log(`\n🔄 Testing forward transformations for ${phaseKey}:`);
  }
  
  samples.forEach((sample, index) => {
    resetRegexLastIndex(patterns);
    
    let transformed = sample.input;
    let matchFound = false;
    
    // Apply all patterns to see which one matches
    patterns.forEach(pattern => {
      const { from, to } = pattern.forward;
      if (from.test(sample.input)) {
        from.lastIndex = 0; // Reset after test
        transformed = sample.input.replace(from, to);
        matchFound = true;
      }
    });
    
    if (transformed === sample.expected) {
      passed++;
      if (verbose) {
        console.log(`  ✅ ${sample.input} → ${transformed}`);
      }
    } else {
      failed++;
      console.error(`  ❌ [${phaseKey}] Forward test ${index + 1} failed:`);
      console.error(`     Input:    ${sample.input}`);
      console.error(`     Output:   ${transformed}`);
      console.error(`     Expected: ${sample.expected}`);
      console.error(`     Matched:  ${matchFound}`);
    }
  });
  
  return { passed, failed };
}

/**
 * Test rollback transformations for a specific phase
 */
function testRollbackTransformations(phaseKey, patterns, samples) {
  let passed = 0;
  let failed = 0;
  
  if (verbose) {
    console.log(`\n🔙 Testing rollback transformations for ${phaseKey}:`);
  }
  
  samples.forEach((sample, index) => {
    resetRegexLastIndex(patterns);
    
    let transformed = sample.input;
    let matchFound = false;
    
    // Apply all rollback patterns to see which one matches
    patterns.forEach(pattern => {
      const { from, to } = pattern.rollback;
      if (from.test(sample.input)) {
        from.lastIndex = 0; // Reset after test
        transformed = sample.input.replace(from, to);
        matchFound = true;
      }
    });
    
    if (transformed === sample.expected) {
      passed++;
      if (verbose) {
        console.log(`  ✅ ${sample.input} → ${transformed}`);
      }
    } else {
      failed++;
      console.error(`  ❌ [${phaseKey}] Rollback test ${index + 1} failed:`);
      console.error(`     Input:    ${sample.input}`);
      console.error(`     Output:   ${transformed}`);
      console.error(`     Expected: ${sample.expected}`);
      console.error(`     Matched:  ${matchFound}`);
    }
  });
  
  return { passed, failed };
}

/**
 * Main test runner
 */
function runTests() {
  console.log('🧪 Running Migration Pattern Tests...\n');
  
  const phasesToTest = specificPhase ? [specificPhase] : Object.keys(MIGRATION_PHASES);
  let totalPassed = 0;
  let totalFailed = 0;
  
  phasesToTest.forEach(phaseKey => {
    if (!MIGRATION_PHASES[phaseKey]) {
      console.error(`❌ Unknown phase: ${phaseKey}`);
      process.exit(1);
    }
    
    const { patterns } = MIGRATION_PHASES[phaseKey];
    const forwardSamples = TEST_SAMPLES[phaseKey] || [];
    const rollbackSamples = ROLLBACK_SAMPLES[phaseKey] || [];
    
    console.log(`📋 Testing phase: ${phaseKey} (${MIGRATION_PHASES[phaseKey].name})`);
    
    // Test forward transformations
    const forwardResults = testForwardTransformations(phaseKey, patterns, forwardSamples);
    totalPassed += forwardResults.passed;
    totalFailed += forwardResults.failed;
    
    // Test rollback transformations
    const rollbackResults = testRollbackTransformations(phaseKey, patterns, rollbackSamples);
    totalPassed += rollbackResults.passed;
    totalFailed += rollbackResults.failed;
    
    console.log(`   Forward: ${forwardResults.passed} passed, ${forwardResults.failed} failed`);
    console.log(`   Rollback: ${rollbackResults.passed} passed, ${rollbackResults.failed} failed`);
    console.log('');
  });
  
  // Final results
  console.log('📊 Test Results Summary:');
  console.log(`   Total Passed: ${totalPassed}`);
  console.log(`   Total Failed: ${totalFailed}`);
  
  if (totalFailed > 0) {
    console.log('\n❌ Some tests failed. Please fix the regex patterns.');
    process.exit(1);
  } else {
    console.log('\n✅ All migration regex tests passed!');
    console.log('💡 The migration patterns are ready for production use.');
  }
}

// Run the tests
try {
  runTests();
} catch (error) {
  console.error('❌ Test execution failed:', error.message);
  process.exit(1);
}
