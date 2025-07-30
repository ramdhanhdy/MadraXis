#!/usr/bin/env node

/**
 * TypeScript Error Summary Script
 * 
 * Analyzes TypeScript compilation output and provides a summary of common errors
 * 
 * Usage:
 *   bun tsc --noEmit 2>&1 | node scripts/tsc-summary.js
 *   bun tsc --noEmit --skipLibCheck 2>&1 | node scripts/tsc-summary.js
 */

const readline = require('readline');

// Error code descriptions
const ERROR_DESCRIPTIONS = {
  '2307': 'Cannot find module',
  '2305': 'Module has no exported member',
  '2322': 'Type is not assignable',
  '2339': 'Property does not exist',
  '2304': 'Cannot find name',
  '2345': 'Argument type mismatch',
  '2571': 'Object is of type unknown',
  '2532': 'Object is possibly undefined',
  '2531': 'Object is possibly null',
  '2740': 'Type is missing properties',
  '2741': 'Property is missing in type',
  '2344': 'Type does not satisfy constraint',
  '2554': 'Expected arguments, but got',
  '2769': 'No overload matches this call',
  '2352': 'Conversion may be a mistake',
  '2538': 'Type cannot be used as index type',
  '2503': 'Cannot find namespace',
  '2694': 'Namespace has no exported member',
  '2315': 'Type is not generic',
  '2314': 'Generic type requires type arguments'
};

// Initialize data structures
const errorCounts = new Map();
const errorsByFile = new Map();
const errorMessages = new Map();
const moduleErrors = new Set();
const typeErrors = new Set();

let totalErrors = 0;
let totalFiles = 0;

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

// Process each line
rl.on('line', (line) => {
  // Match TypeScript error pattern: filename(line,col): error TSxxxx: message
  const errorMatch = line.match(/^(.+?)\((\d+),(\d+)\):\s*error\s+TS(\d+):\s*(.+)$/);
  
  if (errorMatch) {
    const [, filename, lineNum, colNum, errorCode, message] = errorMatch;
    
    totalErrors++;
    
    // Count error codes
    errorCounts.set(errorCode, (errorCounts.get(errorCode) || 0) + 1);
    
    // Track files with errors
    if (!errorsByFile.has(filename)) {
      errorsByFile.set(filename, new Set());
      totalFiles++;
    }
    errorsByFile.get(filename).add(errorCode);
    
    // Store sample error messages
    if (!errorMessages.has(errorCode)) {
      errorMessages.set(errorCode, []);
    }
    if (errorMessages.get(errorCode).length < 3) {
      errorMessages.get(errorCode).push({
        file: filename,
        line: lineNum,
        message: message.substring(0, 100) + (message.length > 100 ? '...' : '')
      });
    }
    
    // Categorize errors
    if (['2307', '2305', '2503', '2694'].includes(errorCode)) {
      moduleErrors.add(errorCode);
    } else if (['2322', '2339', '2304', '2345', '2571', '2532', '2531'].includes(errorCode)) {
      typeErrors.add(errorCode);
    }
  }
});

// Process results when input ends
rl.on('close', () => {
  console.log('\n🔍 TypeScript Error Summary');
  console.log('=' .repeat(50));
  
  if (totalErrors === 0) {
    console.log('✅ No TypeScript errors found!');
    return;
  }
  
  console.log(`📊 Total: ${totalErrors} errors across ${totalFiles} files\n`);
  
  // Top 10 most common errors
  console.log('🔥 Most Common Error Types:');
  console.log('-'.repeat(30));
  
  const sortedErrors = [...errorCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  sortedErrors.forEach(([code, count], index) => {
    const description = ERROR_DESCRIPTIONS[code] || 'Unknown error';
    const percentage = ((count / totalErrors) * 100).toFixed(1);
    console.log(`${index + 1}. TS${code}: ${count} (${percentage}%) - ${description}`);
  });
  
  // Module resolution errors
  if (moduleErrors.size > 0) {
    console.log('\n📦 Module Resolution Issues:');
    console.log('-'.repeat(30));
    moduleErrors.forEach(code => {
      const count = errorCounts.get(code);
      const description = ERROR_DESCRIPTIONS[code];
      console.log(`   TS${code}: ${count} - ${description}`);
    });
  }
  
  // Type errors
  if (typeErrors.size > 0) {
    console.log('\n🏷️  Type System Issues:');
    console.log('-'.repeat(30));
    typeErrors.forEach(code => {
      const count = errorCounts.get(code);
      const description = ERROR_DESCRIPTIONS[code];
      console.log(`   TS${code}: ${count} - ${description}`);
    });
  }
  
  // Sample error messages for top 3 error types
  console.log('\n📝 Sample Error Messages:');
  console.log('-'.repeat(30));
  
  sortedErrors.slice(0, 3).forEach(([code, count]) => {
    const samples = errorMessages.get(code) || [];
    console.log(`\nTS${code} (${count} occurrences):`);
    samples.forEach((sample, i) => {
      console.log(`  ${i + 1}. ${sample.file}:${sample.line}`);
      console.log(`     ${sample.message}`);
    });
  });
  
  // Files with most errors
  console.log('\n📁 Files with Most Errors:');
  console.log('-'.repeat(30));
  
  const fileErrorCounts = [...errorsByFile.entries()]
    .map(([file, errorSet]) => [file, errorSet.size])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  fileErrorCounts.forEach(([file, errorTypeCount], index) => {
    console.log(`${index + 1}. ${file} (${errorTypeCount} different error types)`);
  });
  
  // Recommendations
  console.log('\n💡 Recommendations:');
  console.log('-'.repeat(30));
  
  if (errorCounts.has('2307') || errorCounts.has('2305')) {
    console.log('• Fix module resolution issues first (TS2307, TS2305)');
    console.log('• Check path aliases in tsconfig.json');
    console.log('• Verify export statements in modules');
  }
  
  if (errorCounts.has('2322') || errorCounts.has('2339')) {
    console.log('• Review type definitions and interfaces');
    console.log('• Add proper type annotations');
  }
  
  if (errorCounts.has('2532') || errorCounts.has('2531')) {
    console.log('• Add null/undefined checks');
    console.log('• Use optional chaining (?.) where appropriate');
  }
  
  console.log('\n🚀 Next Steps:');
  console.log('• Focus on the most common error types first');
  console.log('• Fix module resolution before type errors');
  console.log('• Use --skipLibCheck to focus on your code');
  console.log('• Consider fixing one file at a time');
});
