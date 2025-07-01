# MadraXis Authentication Flow Documentation (Updated July 1, 2025)

This document outlines the simplified invite-only authentication flow that replaces the previous magic-link/OTP system.

## Overview

The authentication system now uses an invite-only approach where:
1. Users are pre-created in Supabase by administrators
2. Users set their own passwords via email reset links
3. Subsequent logins use email + password

## 1. User Provisioning (Administrative)

### Supabase Dashboard Setup
- **Auth Settings**: Email sign-ups are **disabled** to prevent unauthorized registrations
- **Email Provider**: Enabled with email confirmation ON
- **Reset Password URL**: Set to `madraxis://reset-password`

### User Creation Process
Administrators create users via Supabase Dashboard → Auth → Users:

1. **Required Fields**:
   - Email address
   - Phone number (optional)
   - Full name

2. **User Metadata**:
   ```json
   {
     "role": "teacher" | "management" | "student" | "parent", 
     "school_id": 1
   }
   ```

3. **Important**: Do NOT set a password during creation - users will create their own.

## 2. First-Time User Flow

### Initial Login Attempt
1. User opens app → redirected to `/screens/auth/login`
2. User enters email (no password set yet)
3. User clicks "Forgot password? Set/Reset Password"
4. User receives password reset email with deep-link

### Password Creation
1. User clicks email link → opens `madraxis://reset-password` in app
2. App extracts `access_token` and `refresh_token` from URL hash
3. App calls `supabase.auth.setSession()` to establish session
4. User sets new password via `supabase.auth.updateUser({ password })`
5. User is redirected to appropriate dashboard based on role

## 3. Subsequent Logins

### Standard Login Flow
1. User enters email + password
2. App calls `supabase.auth.signInWithPassword({ email, password })`
3. AuthProvider detects `SIGNED_IN` event
4. User is routed to dashboard based on `user_metadata.role`:
   - `teacher` → `/screens/teacher/TeacherDashboard`
   - `management` → `/management/dashboard` (or `/management/setup` if no school_id)
   - Other roles → default dashboard

## 4. Role-Based Routing

The AuthContext (`src/context/AuthContext.tsx`) handles automatic routing:

```tsx
switch (userRole) {
  case 'teacher':
    router.replace('/screens/teacher/TeacherDashboard');
    break;
  case 'management':
    if (session?.user?.user_metadata?.school_id) {
      router.replace('/management/dashboard');
    } else {
      router.replace('/management/setup');
    }
    break;
  default:
    router.replace('/screens/auth/login');
    break;
}
```

## 5. Database Integration

### Profiles Table
- Automatically maintained via trigger when `auth.users` is updated
- Contains: `id`, `full_name`, `role`, `school_id`, `updated_at`
- RLS policies ensure users can only access their own data

### RLS Security
```sql
-- Example policy for profiles table
CREATE POLICY "Profiles are only accessible by owner"
  ON profiles FOR ALL 
  USING (id = auth.uid());
```

## 6. Deep-Link Configuration

### App Configuration (`app.json`)
```json
{
  "expo": {
    "scheme": "madraxis",
    "deepLinking": {
      "prefixes": ["madraxis://"]
    }
  }
}
```

### Supported Deep-Links
- `madraxis://reset-password` - Password reset/creation flow

## 7. Security Features

### Invite-Only Registration
- Email sign-ups disabled in Supabase
- Only pre-created users can authenticate
- Prevents unauthorized access

### Password Requirements
- Minimum 6 characters (enforced in reset screen)
- Users must create their own passwords
- No default or temporary passwords

### Session Management
- Automatic token refresh
- Persistent sessions via AsyncStorage
- Proper logout handling

## 8. Error Handling

### Common Scenarios
- **Unknown email**: "User not found" error (good - prevents email enumeration)
- **Wrong password**: Standard authentication error
- **Password too short**: Validation before API call
- **Network issues**: Graceful error display

## Implementation Notes

### Files Modified
- `app/components/auth/AuthForm.tsx` - Unified login/reset form
- `app/(auth)/reset-password.tsx` - Deep-link password setting
- `src/context/AuthContext.tsx` - Updated routing logic
- `app/index.tsx` - Root redirect to login

### Files Removed
- `app/screens/auth/RoleSelectionScreen.tsx`
- `app/screens/auth/OtpVerificationScreen.tsx`
- `app/screens/auth/OtpVerifyScreen.tsx`
- `app/otp.tsx`

### Testing Checklist
- [ ] App opens to login screen
- [ ] Unknown email shows appropriate error
- [ ] Password reset email received and deep-link works
- [ ] Password creation successful
- [ ] Role-based routing works correctly
- [ ] Logout and re-login with password works
- [ ] RLS policies prevent unauthorized data access

## Future Enhancements

### Potential Improvements
- SMS-based authentication for phone verification
- Multi-factor authentication
- Password complexity requirements
- Session timeout settings
- Audit logging for authentication events

### Administrative Features
- Bulk user import from CSV
- Role management interface
- Password policy enforcement
- User suspension/activation
