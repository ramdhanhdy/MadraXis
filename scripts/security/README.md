# Security Scripts

This directory contains security audit and remediation scripts for the MadraXis codebase, optimized for Bun runtime.

## Available Security Audits

### Quick Start
```bash
# Run all security audits
bun run security:audit

# Individual audits
bun run security:audit-logging    # Console logging security
bun run security:audit-input      # Input validation & XSS
bun run security:audit-auth       # Authentication & authorization

# Automated fixes
bun run security:fix-logging      # Fix console logging issues
```

## 1. Logging Security Audit (`audit-logging.js`)
Scans for potential sensitive data leaks through console logging statements.

**Detects:**
- Console statements with sensitive keywords
- Potential data exposure in logs
- Missing structured logging

## 2. Input Validation Audit (`audit-input.js`)
Scans for input validation vulnerabilities and XSS risks.

**Detects:**
- Missing input validation on forms
- XSS vulnerabilities (dangerouslySetInnerHTML)
- SQL injection risks in queries
- Unvalidated email/numeric inputs
- Missing length limits on text inputs
- Unsafe regex patterns
- Unsanitized data storage

## 3. Authentication & Authorization Audit (`audit-auth.js`)
Scans for authentication and access control vulnerabilities.

**Detects:**
- Unprotected routes/screens
- Weak role-based access control
- Hardcoded credentials or tokens
- Insecure token storage
- Missing user-based filtering in queries
- Weak session validation
- Missing CSRF protection
- Password logging (critical!)
- Missing rate limiting
- Weak password policies
- Missing ownership checks
- Admin privilege escalation risks
- Multi-tenancy violations (school_id)

## Security Levels

- **HIGH**: Critical vulnerabilities requiring immediate attention
- **MEDIUM**: Important security issues that should be addressed
- **LOW**: Best practice violations or minor security improvements

## Integration with CI/CD

```yaml
- name: Security Audit
  run: bun run security:audit
  # Fails build if high severity issues found (exit code 1)
```

## MadraXis-Specific Checks

These audits are tailored for the MadraXis codebase and check for:
- Supabase RLS bypass patterns
- Multi-tenant data isolation (school_id validation)
- Role-based access (admin/teacher/student)
- Input sanitization using project utilities
- Proper authentication flows
- Secure token handling with Supabase Auth

## Performance

Optimized for Bun runtime:
- Fast file I/O with `Bun.file()`
- Efficient regex pattern matching
- Minimal memory footprint
- Parallel directory scanning
```



