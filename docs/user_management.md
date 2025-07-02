# User Management Guide for MadraXis

## Overview
This guide explains how to manage users in the MadraXis school management system. The system uses an invite-only authentication flow where admins pre-create users with specific roles.

## User Roles
- **management**: School administrators with full access
- **teacher**: Teaching staff with class management access  
- **parent**: Parents with access to their children's information
- **student**: Students with limited access to their own data

---

## Step-by-Step User Creation

### 1. Access Supabase Dashboard
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `bsjbixlueqoxpxbeygoi` ("Madraxis")
3. Navigate to **Authentication > Users**

### 2. Create New User
Click **"Add user"** and fill in:

**Basic Information:**
- **Email**: User's email address
- **Password**: Leave empty (user will set via password reset)
- **Email Confirm**: ✅ Check this box

**CRITICAL: User Metadata Configuration**

In the **"User Metadata"** section, add this JSON (replace values as needed):

#### For Management User:
```json
{
  "role": "management",
  "school_id": "1",
  "full_name": "John Smith"
}
```

#### For Teacher User:
```json
{
  "role": "teacher", 
  "school_id": "1",
  "full_name": "Jane Doe"
}
```

#### For Parent User:
```json
{
  "role": "parent",
  "school_id": "1", 
  "full_name": "Mike Johnson"
}
```

#### For Student User:
```json
{
  "role": "student",
  "school_id": "1",
  "full_name": "Sarah Wilson"
}
```

### 3. Important Notes
- **Always use string values**: `"school_id": "1"` not `"school_id": 1`
- **Role is required**: Must be one of: `management`, `teacher`, `parent`, `student`
- **Email confirmation**: Always check "Email Confirm" 
- **No initial password**: Leave password empty so user sets it themselves

---

## User First Login Process

### For New Users:
1. **User receives email**: You manually share their email with them
2. **User goes to app**: Opens MadraXis app 
3. **User clicks "Forgot Password"**: On login screen
4. **User enters email**: Their registered email address
5. **User receives reset email**: From Supabase
6. **User clicks link**: Opens app with reset token
7. **User sets password**: Creates their first password
8. **User gets logged in**: Automatically navigated to their role-specific dashboard

### Navigation After Login:
- **Management** → `/management/dashboard` (or `/management/setup` if no school_id)
- **Teacher** → `/screens/teacher/TeacherDashboard`
- **Parent** → `/screens/parent/ParentDashboard`  
- **Student** → `/screens/student/StudentDashboard`

---

## Database Trigger Verification

The system uses database triggers to automatically create profile records. To verify they're working:

```sql
-- Check if user was created properly
SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data,
  p.full_name,
  p.role,
  p.school_id
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'user@example.com';
```

Expected result:
- User should exist in `auth.users` with proper `raw_user_meta_data`
- Profile should exist in `public.profiles` with role and school_id populated

---

## Troubleshooting

### Issue: User login doesn't navigate anywhere
**Cause**: Missing or incorrect role metadata

**Solution**: 
1. Check user in Supabase Dashboard
2. Verify "User Metadata" contains correct role
3. If missing, edit user and add proper metadata JSON
4. User needs to log out and log back in

### Issue: "Role violates not-null constraint" 
**Cause**: Database trigger failed due to malformed metadata

**Solution**:
1. Fix the user metadata in Supabase Dashboard
2. Manually update the profile:
```sql
UPDATE public.profiles 
SET role = 'teacher', school_id = 1 
WHERE id = 'user-uuid-here';
```

### Issue: User gets "Unknown role" error
**Cause**: Role value doesn't match expected values

**Solution**: Ensure role is exactly one of: `management`, `teacher`, `parent`, `student`

---

## Testing Authentication Flow

### Quick Test:
1. Create a test user with proper metadata
2. Open app and click "Forgot Password"  
3. Enter test user email
4. Check email for reset link
5. Click link → should open app
6. Set password → should navigate to role dashboard
7. Log out and log back in → should work normally

### Debug Mode:
Check browser console or React Native logs for these messages:
```
User signed in with role: teacher
User metadata: {...}
Raw user metadata: {...}
Navigating based on role: teacher
```

---

## Best Practices

1. **Always test new users** before sharing credentials
2. **Use consistent school_id values** across all users in same school
3. **Keep role values lowercase** and exact matches
4. **Document user credentials securely** for school administrators
5. **Regularly audit user access** and remove inactive accounts

---

## API Integration (For Developers)

### Create User via API:
```javascript
const { data, error } = await supabase.auth.admin.createUser({
  email: 'user@example.com',
  email_confirm: true,
  user_metadata: {
    role: 'teacher',
    school_id: '1',
    full_name: 'Teacher Name'
  }
});
```

### Update User Role:
```javascript
const { data, error } = await supabase.auth.admin.updateUserById(
  userId, 
  { 
    user_metadata: { 
      role: 'management',
      school_id: '1' 
    } 
  }
);
```

---

*Last updated: January 4, 2025* 