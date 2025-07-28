// Test file for AST-based console replacement
// This file contains console statements in various contexts to test the new AST-based approach

// Regular console statements (should be replaced)
console.log('This should be replaced');
console.info('This should be replaced');
console.warn('This should be replaced');
console.error('This should be replaced');
console.debug('This should be replaced');

// Console statements in comments (should NOT be replaced)
// console.log('This should NOT be replaced');
// console.info('This should NOT be replaced');

// Console statements in strings (should NOT be replaced)
const str1 = "console.log('This should NOT be replaced')";
const str2 = 'console.error("This should NOT be replaced")';
const templateStr = `console.warn('This should NOT be replaced')`;

// Console statements in template literal expressions (should be replaced)
const template = `This is a template with ${console.log('This should be replaced')} inside`;

// Console statements in object properties (should NOT be replaced)
const obj = {
  console: {
    log: 'This should NOT be replaced'
  }
};

// Function with console statements
function testFunction() {
  console.log('This should be replaced');
  return 'test';
}

// Class with console statements
class TestClass {
  method() {
    console.info('This should be replaced');
  }
}

// Already has logger import - should not add duplicate
import { logger } from '../../src/utils/logger';
logger.info('This should remain as logger');