#!/usr/bin/env node

/**
 * List TS2304 Errors Script
 * 
 * This script extracts and lists all TS2304 "Cannot find name" errors from TypeScript compilation.
 * It provides a clean, organized list of all undefined variables, types, and names.
 * 
 * Usage:
 *   bun tsc --noEmit 2>&1 | node scripts/list-ts2304-errors.js
 *   bun tsc --noEmit --skipLibCheck 2>&1 | node scripts/list-ts2304-errors.js
 *   
 * Or save TypeScript output to file first:
 *   bun tsc --noEmit 2> tsc-errors.txt
 *   cat tsc-errors.txt | node scripts/list-ts2304-errors.js
 */

const readline = require('readline');

// Data structures to collect TS2304 errors
const ts2304Errors = [];
const errorsByFile = new Map();
const undefinedNames = new Map(); // Track frequency of each undefined name
const errorPatterns = new Map(); // Track common error patterns

let totalTS2304Count = 0;

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

// Process each line
rl.on('line', (line) => {
  // Match TS2304 error pattern: filename(line,col): error TS2304: Cannot find name 'VariableName'.
  const ts2304Match = line.match(/^(.+?)\((\d+),(\d+)\):\s*error\s+TS2304:\s*Cannot find name '([^']+)'\.?\s*(.*)$/);
  
  if (ts2304Match) {
    const [, filename, lineNum, colNum, undefinedName, additionalInfo] = ts2304Match;
    
    totalTS2304Count++;
    
    const errorInfo = {
      file: filename,
      line: parseInt(lineNum),
      column: parseInt(colNum),
      undefinedName: undefinedName,
      additionalInfo: additionalInfo.trim(),
      fullMessage: line
    };
    
    ts2304Errors.push(errorInfo);
    
    // Group by file
    if (!errorsByFile.has(filename)) {
      errorsByFile.set(filename, []);
    }
    errorsByFile.get(filename).push(errorInfo);
    
    // Track undefined name frequency
    undefinedNames.set(undefinedName, (undefinedNames.get(undefinedName) || 0) + 1);
    
    // Track error patterns (common undefined names)
    const pattern = undefinedName.toLowerCase();
    errorPatterns.set(pattern, (errorPatterns.get(pattern) || 0) + 1);
  }
});

// Process results when input ends
rl.on('close', () => {
  console.log('\n🔍 TS2304 "Cannot find name" Errors Analysis');
  console.log('=' .repeat(60));
  
  if (totalTS2304Count === 0) {
    console.log('✅ No TS2304 errors found!');
    return;
  }
  
  console.log(`📊 Total TS2304 errors: ${totalTS2304Count} across ${errorsByFile.size} files\n`);
  
  // Most common undefined names
  console.log('🔥 Most Common Undefined Names:');
  console.log('-'.repeat(40));
  
  const sortedNames = [...undefinedNames.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);
  
  sortedNames.forEach(([name, count], index) => {
    const percentage = ((count / totalTS2304Count) * 100).toFixed(1);
    console.log(`${index + 1}. '${name}': ${count} occurrences (${percentage}%)`);
  });
  
  // Files with most TS2304 errors
  console.log('\n📁 Files with Most TS2304 Errors:');
  console.log('-'.repeat(40));
  
  const sortedFiles = [...errorsByFile.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 10);
  
  sortedFiles.forEach(([filename, errors], index) => {
    console.log(`${index + 1}. ${filename}: ${errors.length} errors`);
    
    // Show the undefined names in this file
    const namesInFile = errors.map(e => e.undefinedName);
    const uniqueNames = [...new Set(namesInFile)];
    console.log(`   Undefined: ${uniqueNames.join(', ')}`);
  });
  
  // Detailed error list
  console.log('\n📝 Detailed TS2304 Error List:');
  console.log('-'.repeat(40));
  
  ts2304Errors.forEach((error, index) => {
    console.log(`${index + 1}. ${error.file}:${error.line}:${error.column}`);
    console.log(`   Cannot find name '${error.undefinedName}'`);
    if (error.additionalInfo) {
      console.log(`   ${error.additionalInfo}`);
    }
    console.log('');
  });
  
  // Pattern analysis
  console.log('\n🔍 Pattern Analysis:');
  console.log('-'.repeat(40));
  
  const commonPatterns = {
    types: [],
    variables: [],
    functions: [],
    imports: [],
    other: []
  };
  
  sortedNames.forEach(([name, count]) => {
    // Categorize by naming patterns
    if (name.match(/^[A-Z][a-zA-Z]*$/)) {
      commonPatterns.types.push(`${name} (${count})`);
    } else if (name.match(/^[a-z][a-zA-Z]*$/)) {
      if (name.includes('use') || name.includes('get') || name.includes('set')) {
        commonPatterns.functions.push(`${name} (${count})`);
      } else {
        commonPatterns.variables.push(`${name} (${count})`);
      }
    } else {
      commonPatterns.other.push(`${name} (${count})`);
    }
  });
  
  if (commonPatterns.types.length > 0) {
    console.log(`Types/Interfaces: ${commonPatterns.types.slice(0, 5).join(', ')}`);
  }
  if (commonPatterns.variables.length > 0) {
    console.log(`Variables: ${commonPatterns.variables.slice(0, 5).join(', ')}`);
  }
  if (commonPatterns.functions.length > 0) {
    console.log(`Functions/Hooks: ${commonPatterns.functions.slice(0, 5).join(', ')}`);
  }
  if (commonPatterns.other.length > 0) {
    console.log(`Other: ${commonPatterns.other.slice(0, 5).join(', ')}`);
  }
  
  // Recommendations
  console.log('\n💡 Recommendations:');
  console.log('-'.repeat(40));
  
  const topUndefinedName = sortedNames[0];
  if (topUndefinedName) {
    console.log(`• Most common issue: '${topUndefinedName[0]}' (${topUndefinedName[1]} occurrences)`);
    console.log(`• Focus on fixing '${topUndefinedName[0]}' first for maximum impact`);
  }
  
  if (errorsByFile.size > 5) {
    console.log('• Consider fixing files with most errors first');
  }
  
  console.log('• Check for missing imports, type definitions, or variable declarations');
  console.log('• Verify path aliases and module resolution in tsconfig.json');
  
  console.log('\n🚀 Next Steps:');
  console.log('• Fix the most common undefined names first');
  console.log('• Check if undefined names need imports or type definitions');
  console.log('• Consider creating missing type definitions or interfaces');
});
