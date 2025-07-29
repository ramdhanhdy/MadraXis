/**
 * Simple test to verify the theme system works
 */

import { createTheme, validateTheme } from './core/theme-builder';
import { roleBasedThemeStrategy } from './themes/strategies';

// Test basic theme creation
const testTheme = createTheme({
  strategy: 'role-based',
  baseTheme: 'light',
}, 'student');

console.log('✅ Theme created successfully');
console.log('Primary color:', testTheme.colors.primary.main);

// Test theme validation
const validation = validateTheme(testTheme);
console.log('✅ Theme validation:', validation.isValid ? 'PASSED' : 'FAILED');

if (!validation.isValid) {
  console.log('Errors:', validation.errors);
}

if (validation.warnings.length > 0) {
  console.log('Warnings:', validation.warnings);
}

// Test strategy resolver
const resolvedTheme = roleBasedThemeStrategy.resolver({
  strategy: 'role-based',
  baseTheme: 'light',
}, 'teacher');

console.log('✅ Strategy resolver works');
console.log('Teacher theme primary:', resolvedTheme.colors.primary.main);

console.log('🎉 Theme system test completed successfully!');
