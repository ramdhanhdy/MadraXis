#!/usr/bin/env bun

const fs = require('fs');
const path = require('path');

/**
 * Security Audit Script for Input Validation & Sanitization
 * Scans codebase for potential XSS, injection, and validation vulnerabilities
 * Optimized for Bun runtime
 */

const VALIDATION_PATTERNS = [
  // Missing input validation patterns
  {
    pattern: /onChangeText=\{[^}]*\}\s*(?!.*(?:validate|sanitize|schema|zod|yup))/gi,
    type: 'missing_validation',
    severity: 'MEDIUM',
    description: 'Input field without validation'
  },
  
  // Direct HTML rendering without sanitization
  {
    pattern: /dangerouslySetInnerHTML\s*=\s*\{\s*__html:\s*[^}]*\}/gi,
    type: 'xss_risk',
    severity: 'HIGH',
    description: 'Potentially unsafe HTML rendering'
  },
  
  // Direct user input in SQL-like queries
  {
    pattern: /\.from\(['"`][^'"`]*\$\{[^}]*\}[^'"`]*['"`]\)/gi,
    type: 'sql_injection_risk',
    severity: 'HIGH',
    description: 'Potential SQL injection in query'
  },
  
  // Unvalidated email inputs
  {
    pattern: /keyboardType=['"`]email-address['"`](?!.*(?:validate|isValidEmail|emailSchema))/gi,
    type: 'email_validation_missing',
    severity: 'MEDIUM',
    description: 'Email input without validation'
  },
  
  // Unvalidated numeric inputs
  {
    pattern: /keyboardType=['"`](?:numeric|number-pad)['"`](?!.*(?:validate|isNumber|numericSchema))/gi,
    type: 'numeric_validation_missing',
    severity: 'MEDIUM',
    description: 'Numeric input without validation'
  },
  
  // Direct user input in URLs
  {
    pattern: /(?:fetch|axios|supabase\.functions\.invoke)\s*\(\s*['"`][^'"`]*\$\{[^}]*\}[^'"`]*['"`]/gi,
    type: 'url_injection_risk',
    severity: 'HIGH',
    description: 'User input directly in URL without validation'
  },
  
  // Missing maxLength on text inputs
  {
    pattern: /<Input[^>]*(?!.*maxLength)[^>]*multiline[^>]*>/gi,
    type: 'missing_length_limit',
    severity: 'LOW',
    description: 'Multiline input without length limit'
  },
  
  // Unsafe regex patterns
  {
    pattern: /new RegExp\s*\(\s*[^,)]*(?:\$\{[^}]*\}|[+*?{}[\]().|^$\\])[^,)]*\s*[,)]/gi,
    type: 'regex_injection_risk',
    severity: 'HIGH',
    description: 'Dynamic regex construction with user input'
  }
];

const SANITIZATION_PATTERNS = [
  // Missing sanitization before storage
  {
    pattern: /\.insert\s*\(\s*\{[^}]*[^}]*\$\{[^}]*\}[^}]*\}/gi,
    type: 'unsanitized_storage',
    severity: 'HIGH',
    description: 'Direct user input stored without sanitization'
  },
  
  // Missing sanitization in search queries
  {
    pattern: /\.ilike\s*\(\s*['"`]%\$\{[^}]*\}%['"`]\s*\)/gi,
    type: 'search_injection_risk',
    severity: 'MEDIUM',
    description: 'Search query without proper sanitization'
  }
];

const VALIDATION_KEYWORDS = [
  'validate', 'sanitize', 'schema', 'zod', 'yup', 'joi', 'isValid', 'clean'
];

const SCAN_DIRECTORIES = [
  'src/components',
  'src/services',
  'src/hooks',
  'src/utils',
  'src/context'
];

const EXCLUDE_PATTERNS = [
  /node_modules/,
  /\.git/,
  /dist/,
  /build/,
  /coverage/,
  /\.expo/,
  /android/,
  /ios/,
  /scripts\/security/,
  /\.stories\./,
  /\.test\./,
  /\.spec\./
];

class InputSecurityAuditor {
  constructor() {
    this.findings = [];
    this.scannedFiles = 0;
  }

  async scanFile(filePath) {
    try {
      const file = Bun.file(filePath);
      const content = await file.text();
      const lines = content.split('\n');
      
      lines.forEach((line, lineNumber) => {
        this.checkLineForValidationIssues(line, filePath, lineNumber + 1);
        this.checkLineForSanitizationIssues(line, filePath, lineNumber + 1);
      });
      
      // Check file-level patterns
      this.checkFileForPatterns(content, filePath);
      
      this.scannedFiles++;
    } catch (error) {
      console.warn(`Warning: Could not read file ${filePath}: ${error.message}`);
    }
  }

  checkLineForValidationIssues(line, filePath, lineNumber) {
    // Skip comments and imports
    if (line.trim().startsWith('//') || 
        line.trim().startsWith('*') || 
        line.trim().startsWith('import')) {
      return;
    }

    VALIDATION_PATTERNS.forEach(({ pattern, type, severity, description }) => {
      const matches = line.match(pattern);
      if (matches) {
        this.findings.push({
          file: filePath,
          line: lineNumber,
          content: line.trim(),
          type,
          severity,
          description,
          recommendation: this.getValidationRecommendation(type)
        });
      }
    });
  }

  checkLineForSanitizationIssues(line, filePath, lineNumber) {
    SANITIZATION_PATTERNS.forEach(({ pattern, type, severity, description }) => {
      const matches = line.match(pattern);
      if (matches) {
        this.findings.push({
          file: filePath,
          line: lineNumber,
          content: line.trim(),
          type,
          severity,
          description,
          recommendation: this.getSanitizationRecommendation(type)
        });
      }
    });
  }

  checkFileForPatterns(content, filePath) {
    // Check for forms without validation schemas
    if (content.includes('<Input') && !this.hasValidationSchema(content)) {
      this.findings.push({
        file: filePath,
        line: 1,
        content: 'File contains Input components',
        type: 'missing_form_validation',
        severity: 'MEDIUM',
        description: 'Form with inputs but no validation schema found',
        recommendation: 'Add Zod schema validation for form inputs'
      });
    }

    // Check for API calls without input validation
    if (this.hasAPICall(content) && !this.hasInputValidation(content)) {
      this.findings.push({
        file: filePath,
        line: 1,
        content: 'File contains API calls',
        type: 'api_without_validation',
        severity: 'HIGH',
        description: 'API calls without proper input validation',
        recommendation: 'Validate all inputs before API calls'
      });
    }
  }

  hasValidationSchema(content) {
    return /(?:Schema|schema)\s*=\s*z\.|yup\.|joi\./.test(content) ||
           /validate(?:Form|Input|Data)/.test(content);
  }

  hasAPICall(content) {
    return /supabase\.|fetch\(|axios\.|\.invoke\(/.test(content);
  }

  hasInputValidation(content) {
    return VALIDATION_KEYWORDS.some(keyword => 
      new RegExp(`\\b${keyword}\\b`, 'i').test(content)
    );
  }

  getValidationRecommendation(type) {
    const recommendations = {
      'missing_validation': 'Add input validation using Zod schema or custom validation',
      'xss_risk': 'Use safe HTML rendering or sanitize content with DOMPurify',
      'sql_injection_risk': 'Use parameterized queries and input sanitization',
      'email_validation_missing': 'Add email format validation',
      'numeric_validation_missing': 'Add numeric range and format validation',
      'url_injection_risk': 'Validate and sanitize URL parameters',
      'missing_length_limit': 'Add maxLength prop to prevent buffer overflow',
      'regex_injection_risk': 'Use static regex patterns or escape user input',
      'missing_form_validation': 'Implement comprehensive form validation schema',
      'api_without_validation': 'Validate all inputs before making API calls'
    };
    return recommendations[type] || 'Review and add appropriate validation';
  }

  getSanitizationRecommendation(type) {
    const recommendations = {
      'unsanitized_storage': 'Sanitize input using sanitizeString() before database storage',
      'search_injection_risk': 'Use sanitizeLikeInput() for search queries'
    };
    return recommendations[type] || 'Sanitize input before use';
  }

  async scanDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
      console.warn(`Warning: Directory ${dirPath} does not exist`);
      return;
    }

    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      
      if (EXCLUDE_PATTERNS.some(pattern => pattern.test(fullPath))) {
        continue;
      }
      
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        await this.scanDirectory(fullPath);
      } else if (this.shouldScanFile(fullPath)) {
        await this.scanFile(fullPath);
      }
    }
  }

  shouldScanFile(filePath) {
    const ext = path.extname(filePath);
    return ['.ts', '.tsx', '.js', '.jsx'].includes(ext);
  }

  generateReport() {
    const report = {
      summary: {
        totalFiles: this.scannedFiles,
        totalFindings: this.findings.length,
        highSeverity: this.findings.filter(f => f.severity === 'HIGH').length,
        mediumSeverity: this.findings.filter(f => f.severity === 'MEDIUM').length,
        lowSeverity: this.findings.filter(f => f.severity === 'LOW').length,
        byType: this.getTypeBreakdown()
      },
      findings: this.findings.sort((a, b) => {
        const severityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      })
    };

    return report;
  }

  getTypeBreakdown() {
    const breakdown = {};
    this.findings.forEach(finding => {
      breakdown[finding.type] = (breakdown[finding.type] || 0) + 1;
    });
    return breakdown;
  }

  async run() {
    console.log('🔍 Starting input validation security audit...\n');
    
    for (const dir of SCAN_DIRECTORIES) {
      console.log(`Scanning ${dir}...`);
      await this.scanDirectory(dir);
    }
    
    const report = this.generateReport();
    this.printReport(report);
    
    return report.summary.highSeverity === 0 ? 0 : 1;
  }

  printReport(report) {
    console.log('\n📊 INPUT VALIDATION SECURITY AUDIT');
    console.log('===================================\n');
    
    console.log(`Files scanned: ${report.summary.totalFiles}`);
    console.log(`Total findings: ${report.summary.totalFindings}`);
    console.log(`🔴 High severity: ${report.summary.highSeverity}`);
    console.log(`🟡 Medium severity: ${report.summary.mediumSeverity}`);
    console.log(`🟢 Low severity: ${report.summary.lowSeverity}\n`);
    
    if (Object.keys(report.summary.byType).length > 0) {
      console.log('Issue breakdown by type:');
      Object.entries(report.summary.byType).forEach(([type, count]) => {
        console.log(`  ${type}: ${count}`);
      });
      console.log('');
    }
    
    if (report.findings.length === 0) {
      console.log('✅ No input validation security issues found!');
      return;
    }
    
    console.log('DETAILED FINDINGS:');
    console.log('==================\n');
    
    report.findings.slice(0, 20).forEach((finding, index) => {
      const severityIcon = finding.severity === 'HIGH' ? '🔴' : 
                          finding.severity === 'MEDIUM' ? '🟡' : '🟢';
      
      console.log(`${index + 1}. ${severityIcon} ${finding.severity} - ${finding.file}:${finding.line}`);
      console.log(`   Issue: ${finding.description}`);
      console.log(`   Code: ${finding.content}`);
      console.log(`   Fix: ${finding.recommendation}\n`);
    });
    
    if (report.findings.length > 20) {
      console.log(`... and ${report.findings.length - 20} more findings`);
    }
    
    if (report.summary.highSeverity > 0) {
      console.log('⚠️  CRITICAL: High severity input validation issues found!');
      console.log('   These could lead to XSS, injection attacks, or data corruption.');
    }
  }
}

// Run the audit
if (import.meta.main) {
  const auditor = new InputSecurityAuditor();
  const exitCode = await auditor.run();
  process.exit(exitCode);
}

export default InputSecurityAuditor;