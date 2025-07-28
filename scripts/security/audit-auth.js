#!/usr/bin/env bun

const fs = require('fs');
const path = require('path');

/**
 * Security Audit Script for Authentication & Authorization
 * Scans codebase for auth vulnerabilities and access control issues
 * Optimized for Bun runtime
 */

const AUTH_PATTERNS = [
  // Unprotected routes/screens
  {
    pattern: /export default function \w+Screen\(\)(?!.*(?:useAuth|requireAuth|ProtectedRoute))/gi,
    type: 'unprotected_screen',
    severity: 'HIGH',
    description: 'Screen component without authentication check'
  },
  
  // Missing role-based access control
  {
    pattern: /role\s*===?\s*['"`](?:admin|teacher|student)['"`](?!.*(?:hasPermission|checkRole|authorize))/gi,
    type: 'weak_role_check',
    severity: 'MEDIUM',
    description: 'Simple role check without proper authorization'
  },
  
  // Hardcoded credentials or tokens
  {
    pattern: /(?:password|token|secret|key)\s*[:=]\s*['"`][^'"`]{8,}['"`]/gi,
    type: 'hardcoded_credentials',
    severity: 'HIGH',
    description: 'Hardcoded credentials or secrets'
  },
  
  // Insecure token storage
  {
    pattern: /(?:localStorage|AsyncStorage)\.setItem\s*\(\s*['"`][^'"`]*(?:token|auth|session)[^'"`]*['"`]/gi,
    type: 'insecure_token_storage',
    severity: 'HIGH',
    description: 'Token stored in insecure storage'
  },
  
  // Missing authentication on API calls
  {
    pattern: /supabase\.from\(['"`]\w+['"`]\)\.(?:select|insert|update|delete)(?!.*\.eq\(['"`]user_id['"`])/gi,
    type: 'missing_user_filter',
    severity: 'HIGH',
    description: 'Database query without user-based filtering'
  },
  
  // Weak session validation
  {
    pattern: /session\s*&&\s*session\.user(?!.*(?:expires|valid|active))/gi,
    type: 'weak_session_check',
    severity: 'MEDIUM',
    description: 'Session check without expiration validation'
  },
  
  // Missing CSRF protection
  {
    pattern: /method:\s*['"`]POST['"`](?!.*(?:csrf|xsrf|token))/gi,
    type: 'missing_csrf_protection',
    severity: 'MEDIUM',
    description: 'POST request without CSRF protection'
  },
  
  // Insecure password handling
  {
    pattern: /password.*console\.log|console\.log.*password/gi,
    type: 'password_logging',
    severity: 'HIGH',
    description: 'Password being logged to console'
  },
  
  // Missing rate limiting indicators
  {
    pattern: /signInWithPassword|signUp|resetPassword(?!.*(?:throttle|limit|delay))/gi,
    type: 'missing_rate_limiting',
    severity: 'MEDIUM',
    description: 'Auth operation without rate limiting'
  },
  
  // Weak password validation
  {
    pattern: /password.*length\s*[<>=]+\s*[1-7](?!\d)/gi,
    type: 'weak_password_policy',
    severity: 'MEDIUM',
    description: 'Weak password length requirement'
  }
];

const AUTHORIZATION_PATTERNS = [
  // Direct user ID usage without validation
  {
    pattern: /user\.id(?!.*(?:validate|sanitize|check))/gi,
    type: 'unvalidated_user_id',
    severity: 'MEDIUM',
    description: 'User ID used without validation'
  },
  
  // Missing ownership checks
  {
    pattern: /\.eq\(['"`]id['"`],\s*\w+Id\)(?!.*\.eq\(['"`](?:user_id|teacher_id|owner_id)['"`])/gi,
    type: 'missing_ownership_check',
    severity: 'HIGH',
    description: 'Resource access without ownership verification'
  },
  
  // Admin privilege escalation risks
  {
    pattern: /role\s*=\s*['"`]admin['"`](?!.*(?:verify|validate|authorize))/gi,
    type: 'admin_privilege_risk',
    severity: 'HIGH',
    description: 'Admin role assignment without proper validation'
  },
  
  // Missing school_id validation
  {
    pattern: /school_id(?!.*(?:validate|check|verify))/gi,
    type: 'missing_school_validation',
    severity: 'HIGH',
    description: 'School ID used without validation (multi-tenancy risk)'
  }
];

const SCAN_DIRECTORIES = [
  'src/components',
  'src/services',
  'src/hooks',
  'src/context',
  'app'
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

class AuthSecurityAuditor {
  constructor() {
    this.findings = [];
    this.scannedFiles = 0;
    this.authFiles = new Set();
    this.protectedRoutes = new Set();
  }

  async scanFile(filePath) {
    try {
      const file = Bun.file(filePath);
      const content = await file.text();
      const lines = content.split('\n');
      
      // Track auth-related files
      if (this.isAuthFile(content)) {
        this.authFiles.add(filePath);
      }
      
      lines.forEach((line, lineNumber) => {
        this.checkLineForAuthIssues(line, filePath, lineNumber + 1);
        this.checkLineForAuthorizationIssues(line, filePath, lineNumber + 1);
      });
      
      // Check file-level patterns
      this.checkFileForAuthPatterns(content, filePath);
      
      this.scannedFiles++;
    } catch (error) {
      console.warn(`Warning: Could not read file ${filePath}: ${error.message}`);
    }
  }

  isAuthFile(content) {
    return /(?:auth|login|signup|session|token|credential)/i.test(content);
  }

  checkLineForAuthIssues(line, filePath, lineNumber) {
    if (line.trim().startsWith('//') || 
        line.trim().startsWith('*') || 
        line.trim().startsWith('import')) {
      return;
    }

    AUTH_PATTERNS.forEach(({ pattern, type, severity, description }) => {
      const matches = line.match(pattern);
      if (matches) {
        this.findings.push({
          file: filePath,
          line: lineNumber,
          content: line.trim(),
          type,
          severity,
          description,
          recommendation: this.getAuthRecommendation(type)
        });
      }
    });
  }

  checkLineForAuthorizationIssues(line, filePath, lineNumber) {
    AUTHORIZATION_PATTERNS.forEach(({ pattern, type, severity, description }) => {
      const matches = line.match(pattern);
      if (matches) {
        this.findings.push({
          file: filePath,
          line: lineNumber,
          content: line.trim(),
          type,
          severity,
          description,
          recommendation: this.getAuthorizationRecommendation(type)
        });
      }
    });
  }

  checkFileForAuthPatterns(content, filePath) {
    // Check for screens without auth protection
    if (filePath.includes('app/') && filePath.endsWith('.tsx')) {
      if (!this.hasAuthProtection(content)) {
        this.findings.push({
          file: filePath,
          line: 1,
          content: 'Screen file',
          type: 'unprotected_route',
          severity: 'HIGH',
          description: 'Route/screen without authentication protection',
          recommendation: 'Add authentication check or use ProtectedRoute wrapper'
        });
      }
    }

    // Check for API services without proper auth
    if (filePath.includes('services/') && this.hasAPICall(content)) {
      if (!this.hasProperAuthHeaders(content)) {
        this.findings.push({
          file: filePath,
          line: 1,
          content: 'Service file with API calls',
          type: 'api_missing_auth',
          severity: 'HIGH',
          description: 'API service without proper authentication headers',
          recommendation: 'Ensure all API calls include proper authentication'
        });
      }
    }

    // Check for context providers without security measures
    if (filePath.includes('Context.tsx') && content.includes('createContext')) {
      if (!this.hasSecurityMeasures(content)) {
        this.findings.push({
          file: filePath,
          line: 1,
          content: 'Context provider',
          type: 'insecure_context',
          severity: 'MEDIUM',
          description: 'Context provider without security measures',
          recommendation: 'Add input validation and security checks to context'
        });
      }
    }
  }

  hasAuthProtection(content) {
    return /useAuth|requireAuth|ProtectedRoute|session.*user|isAuthenticated/.test(content);
  }

  hasAPICall(content) {
    return /supabase\.|fetch\(|axios\.|\.invoke\(/.test(content);
  }

  hasProperAuthHeaders(content) {
    return /Authorization|Bearer|auth.*header|session.*token/.test(content);
  }

  hasSecurityMeasures(content) {
    return /validate|sanitize|authorize|permission|security/.test(content);
  }

  getAuthRecommendation(type) {
    const recommendations = {
      'unprotected_screen': 'Add useAuth hook or wrap with ProtectedRoute component',
      'weak_role_check': 'Use centralized authorization service with proper permission checks',
      'hardcoded_credentials': 'Move credentials to environment variables or secure storage',
      'insecure_token_storage': 'Use secure storage (Keychain/Keystore) for sensitive tokens',
      'missing_user_filter': 'Add user-based filtering to prevent data leakage',
      'weak_session_check': 'Validate session expiration and active status',
      'missing_csrf_protection': 'Implement CSRF token validation for state-changing operations',
      'password_logging': 'Remove password from logs immediately - security breach!',
      'missing_rate_limiting': 'Implement rate limiting for authentication operations',
      'weak_password_policy': 'Enforce stronger password requirements (min 8 chars, complexity)',
      'unprotected_route': 'Add authentication middleware or route guards',
      'api_missing_auth': 'Ensure all API calls include proper authentication headers',
      'insecure_context': 'Add security validation to context providers'
    };
    return recommendations[type] || 'Review and implement proper authentication';
  }

  getAuthorizationRecommendation(type) {
    const recommendations = {
      'unvalidated_user_id': 'Validate user ID against session before use',
      'missing_ownership_check': 'Add ownership verification before resource access',
      'admin_privilege_risk': 'Implement proper admin privilege validation',
      'missing_school_validation': 'Validate school_id to prevent cross-tenant access'
    };
    return recommendations[type] || 'Implement proper authorization checks';
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
        authFiles: this.authFiles.size,
        totalFindings: this.findings.length,
        highSeverity: this.findings.filter(f => f.severity === 'HIGH').length,
        mediumSeverity: this.findings.filter(f => f.severity === 'MEDIUM').length,
        lowSeverity: this.findings.filter(f => f.severity === 'LOW').length,
        byType: this.getTypeBreakdown(),
        criticalIssues: this.getCriticalIssues()
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

  getCriticalIssues() {
    return this.findings.filter(f => 
      ['hardcoded_credentials', 'password_logging', 'insecure_token_storage', 'missing_ownership_check']
      .includes(f.type)
    ).length;
  }

  async run() {
    console.log('🔍 Starting authentication & authorization security audit...\n');
    
    for (const dir of SCAN_DIRECTORIES) {
      console.log(`Scanning ${dir}...`);
      await this.scanDirectory(dir);
    }
    
    const report = this.generateReport();
    this.printReport(report);
    
    return report.summary.highSeverity === 0 ? 0 : 1;
  }

  printReport(report) {
    console.log('\n🔐 AUTHENTICATION & AUTHORIZATION AUDIT');
    console.log('=======================================\n');
    
    console.log(`Files scanned: ${report.summary.totalFiles}`);
    console.log(`Auth-related files: ${report.summary.authFiles}`);
    console.log(`Total findings: ${report.summary.totalFindings}`);
    console.log(`🔴 High severity: ${report.summary.highSeverity}`);
    console.log(`🟡 Medium severity: ${report.summary.mediumSeverity}`);
    console.log(`🟢 Low severity: ${report.summary.lowSeverity}`);
    console.log(`⚠️  Critical issues: ${report.summary.criticalIssues}\n`);
    
    if (Object.keys(report.summary.byType).length > 0) {
      console.log('Issue breakdown by type:');
      Object.entries(report.summary.byType).forEach(([type, count]) => {
        console.log(`  ${type}: ${count}`);
      });
      console.log('');
    }
    
    if (report.findings.length === 0) {
      console.log('✅ No authentication/authorization security issues found!');
      return;
    }
    
    console.log('DETAILED FINDINGS:');
    console.log('==================\n');
    
    report.findings.slice(0, 15).forEach((finding, index) => {
      const severityIcon = finding.severity === 'HIGH' ? '🔴' : 
                          finding.severity === 'MEDIUM' ? '🟡' : '🟢';
      
      console.log(`${index + 1}. ${severityIcon} ${finding.severity} - ${finding.file}:${finding.line}`);
      console.log(`   Issue: ${finding.description}`);
      console.log(`   Code: ${finding.content}`);
      console.log(`   Fix: ${finding.recommendation}\n`);
    });
    
    if (report.findings.length > 15) {
      console.log(`... and ${report.findings.length - 15} more findings`);
    }
    
    if (report.summary.criticalIssues > 0) {
      console.log('🚨 CRITICAL SECURITY BREACH DETECTED!');
      console.log('   Hardcoded credentials or password logging found.');
      console.log('   Fix immediately to prevent security compromise!');
    } else if (report.summary.highSeverity > 0) {
      console.log('⚠️  HIGH PRIORITY: Authentication vulnerabilities found!');
      console.log('   These could lead to unauthorized access or privilege escalation.');
    }
  }
}

// Run the audit
if (import.meta.main) {
  const auditor = new AuthSecurityAuditor();
  const exitCode = await auditor.run();
  process.exit(exitCode);
}

export default AuthSecurityAuditor;