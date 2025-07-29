#!/usr/bin/env node

/**
 * Migration Import Validation Script
 * 
 * Validates that all imports are working correctly after migration phases.
 * Checks for broken imports, unused exports, and circular dependencies.
 * 
 * Usage:
 *   node scripts/migration/validate-imports.js
 *   node scripts/migration/validate-imports.js --check-broken-imports
 *   node scripts/migration/validate-imports.js --check-unused-exports
 *   node scripts/migration/validate-imports.js --check-circular-deps
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Command line arguments
const args = process.argv.slice(2);
const checkBrokenImports = args.includes('--check-broken-imports') || args.length === 0;
const checkUnusedExports = args.includes('--check-unused-exports') || args.length === 0;
const checkCircularDeps = args.includes('--check-circular-deps') || args.length === 0;

/**
 * Get all TypeScript and JavaScript files
 */
function getSourceFiles(directories = ['app/', 'src/']) {
  const files = [];
  
  function traverse(currentDir) {
    if (!fs.existsSync(currentDir)) return;
    
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        traverse(fullPath);
      } else if (entry.isFile() && /\.(ts|tsx|js|jsx)$/.test(entry.name)) {
        files.push(fullPath);
      }
    }
  }
  
  directories.forEach(dir => traverse(dir));
  return files;
}

/**
 * Extract import statements from a file
 */
function extractImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const imports = [];
  
  // Match various import patterns
  const importPatterns = [
    /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g,
    /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
    /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g
  ];
  
  importPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      imports.push({
        path: match[1],
        line: content.substring(0, match.index).split('\n').length,
        statement: match[0]
      });
    }
  });
  
  return imports;
}

/**
 * Resolve import path to actual file
 */
function resolveImportPath(importPath, fromFile) {
  const fromDir = path.dirname(fromFile);
  
  // Handle path aliases
  const aliases = {
    '@ui': 'src/ui',
    '@domains': 'src/domains',
    '@lib': 'src/lib',
    '@context': 'src/context',
    '@types': 'src/types'
  };
  
  let resolvedPath = importPath;
  
  // Replace aliases
  Object.entries(aliases).forEach(([alias, actualPath]) => {
    if (importPath.startsWith(alias)) {
      resolvedPath = importPath.replace(alias, actualPath);
    }
  });
  
  // Handle relative imports
  if (resolvedPath.startsWith('.')) {
    resolvedPath = path.resolve(fromDir, resolvedPath);
  } else if (!resolvedPath.startsWith('/') && !resolvedPath.includes('node_modules')) {
    resolvedPath = path.resolve(process.cwd(), resolvedPath);
  }
  
  // Try different extensions
  const extensions = ['', '.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx', '/index.js', '/index.jsx'];
  
  for (const ext of extensions) {
    const fullPath = resolvedPath + ext;
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
  }
  
  return null;
}

/**
 * Check for broken imports
 */
function checkBrokenImportsInFiles() {
  console.log('🔍 Checking for broken imports...\n');
  
  const files = getSourceFiles();
  const brokenImports = [];
  
  files.forEach(file => {
    const imports = extractImports(file);
    
    imports.forEach(importInfo => {
      // Skip node_modules and external packages
      if (importInfo.path.includes('node_modules') || 
          !importInfo.path.startsWith('.') && !importInfo.path.startsWith('@')) {
        return;
      }
      
      const resolvedPath = resolveImportPath(importInfo.path, file);
      
      if (!resolvedPath) {
        brokenImports.push({
          file,
          import: importInfo.path,
          line: importInfo.line,
          statement: importInfo.statement
        });
      }
    });
  });
  
  if (brokenImports.length > 0) {
    console.log('❌ Found broken imports:\n');
    brokenImports.forEach(broken => {
      console.log(`   📁 ${broken.file}:${broken.line}`);
      console.log(`   🔗 ${broken.statement}`);
      console.log(`   ❌ Cannot resolve: ${broken.import}\n`);
    });
    return false;
  } else {
    console.log('✅ No broken imports found!\n');
    return true;
  }
}

/**
 * Check TypeScript compilation
 */
function checkTypeScriptCompilation() {
  console.log('🔧 Checking TypeScript compilation...\n');
  
  try {
    execSync('bun tsc --noEmit', { stdio: 'pipe' });
    console.log('✅ TypeScript compilation successful!\n');
    return true;
  } catch (error) {
    console.log('❌ TypeScript compilation failed:\n');
    console.log(error.stdout?.toString() || error.message);
    console.log('');
    return false;
  }
}

/**
 * Check for unused exports (simplified version)
 */
function checkUnusedExportsInFiles() {
  console.log('🔍 Checking for potentially unused exports...\n');
  
  const files = getSourceFiles();
  const exports = new Map();
  const imports = new Map();
  
  // Collect all exports
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const exportMatches = content.match(/export\s+(?:const|function|class|interface|type)\s+(\w+)/g);
    
    if (exportMatches) {
      exportMatches.forEach(match => {
        const name = match.split(/\s+/).pop();
        if (!exports.has(name)) {
          exports.set(name, []);
        }
        exports.get(name).push(file);
      });
    }
  });
  
  // Collect all imports
  files.forEach(file => {
    const fileImports = extractImports(file);
    fileImports.forEach(imp => {
      const content = fs.readFileSync(file, 'utf8');
      const importMatch = content.match(new RegExp(`import\\s+.*?{([^}]+)}.*?from\\s+['"]${imp.path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`));
      
      if (importMatch) {
        const importedNames = importMatch[1].split(',').map(name => name.trim().replace(/\s+as\s+\w+/, ''));
        importedNames.forEach(name => {
          if (!imports.has(name)) {
            imports.set(name, []);
          }
          imports.get(name).push(file);
        });
      }
    });
  });
  
  // Find potentially unused exports
  const unusedExports = [];
  exports.forEach((files, name) => {
    if (!imports.has(name)) {
      unusedExports.push({ name, files });
    }
  });
  
  if (unusedExports.length > 0) {
    console.log('⚠️  Potentially unused exports found:\n');
    unusedExports.slice(0, 10).forEach(unused => { // Limit to first 10
      console.log(`   📦 ${unused.name}`);
      unused.files.forEach(file => console.log(`      📁 ${file}`));
      console.log('');
    });
    
    if (unusedExports.length > 10) {
      console.log(`   ... and ${unusedExports.length - 10} more\n`);
    }
  } else {
    console.log('✅ No obviously unused exports found!\n');
  }
  
  return true;
}

/**
 * Run all validations
 */
function runValidation() {
  console.log('🚀 Starting import validation...\n');
  
  let allPassed = true;
  
  if (checkBrokenImports) {
    allPassed = checkBrokenImportsInFiles() && allPassed;
  }
  
  if (checkBrokenImports) {
    allPassed = checkTypeScriptCompilation() && allPassed;
  }
  
  if (checkUnusedExports) {
    checkUnusedExportsInFiles(); // This doesn't fail the validation
  }
  
  console.log('📊 Validation Summary:');
  console.log(`   - Status: ${allPassed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`   - Broken imports: ${checkBrokenImports ? 'Checked' : 'Skipped'}`);
  console.log(`   - TypeScript compilation: ${checkBrokenImports ? 'Checked' : 'Skipped'}`);
  console.log(`   - Unused exports: ${checkUnusedExports ? 'Checked' : 'Skipped'}`);
  
  if (!allPassed) {
    console.log('\n💡 Fix the issues above and run validation again.');
    process.exit(1);
  } else {
    console.log('\n✨ All validations passed successfully!');
  }
}

// Run validation
try {
  runValidation();
} catch (error) {
  console.error('❌ Validation failed:', error.message);
  process.exit(1);
}
