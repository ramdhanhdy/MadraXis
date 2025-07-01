# User Management Guide - Adding Users via Supabase

This guide provides step-by-step instructions for administrators to add new users to the MadraXis system using the Supabase dashboard.

## Prerequisites

- Administrative access to the Supabase project dashboard
- User information: email, full name, phone number (optional), and role
- School ID (typically `1` for single-school setup)

## Step-by-Step User Creation Process

### 1. Access Supabase Dashboard

1. Navigate to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Select the **Madraxis** project
4. Go to **Authentication** → **Users** in the left sidebar

### 2. Create New User

1. Click the **"Add user"** button (usually green, located in the top-right area)
2. Choose **"Create new user"** from the dropdown options

### 3. Fill User Information

#### Basic Information
- **Email**: Enter the user's email address (required)
  - This will be their login username
  - Must be a valid email format
  - Will receive password reset emails

- **Phone**: Enter phone number (optional)
  - Format: `+62812345678` (include country code)
  - Used for future SMS features

- **Password**: **LEAVE BLANK**
  - Do NOT set a password here
  - Users will create their own via email reset link

- **Email Confirm**: Leave unchecked (users will confirm via password reset)

#### User Metadata
In the **"User Metadata"** section, add the following JSON:

```json
{
  "full_name": "User's Full Name",
  "role": "teacher",
  "school_id": "1"
}
```

⚠️ **Important Notes:**
- All values must be strings in JSON (use quotes around numbers like `"1"`)
- The `role` field is required - do not omit it
- If you don't set `full_name`, the email will be used as default

**Role Options:**
- `"teacher"` - For teaching staff
- `"management"` - For school administrators
- `"student"` - For students (if they have app access)
- `"parent"` - For parents/guardians

**School ID:**
- Use `"1"` for the primary school (as string)
- For multi-school setups, use appropriate school ID as string

### 4. Complete User Creation

1. Review all information for accuracy
2. Click **"Create user"** button
3. The user will appear in the users list with status "Unconfirmed"

### 5. User Onboarding Process

Once created, the user follows this process:

1. **User receives notification** (via email or manual communication)
2. **User opens the app** → sees login screen
3. **User enters email** → clicks "Forgot password? Set/Reset Password"
4. **User receives password reset email** from Supabase
5. **User clicks email link** → app opens to password creation screen
6. **User sets password** → automatically logged in and routed to appropriate dashboard

## Example User Metadata Templates

### Teacher Example
```json
{
  "full_name": "Ahmad Fauzi",
  "role": "teacher",
  "school_id": "1"
}
```

### Management Example
```json
{
  "full_name": "Siti Nurhaliza",
  "role": "management",
  "school_id": "1"
}
```

### Parent Example
```json
{
  "full_name": "Budi Santoso",
  "role": "parent",
  "school_id": "1"
}
```

### Student Example
```json
{
  "full_name": "Fatimah Az-Zahra",
  "role": "student",
  "school_id": "1"
}
```

## Alternative Method: Invite via Email

If the direct user creation method doesn't work, try this approach:

1. Click **"Add user"** → **"Invite via email"**
2. Enter email address
3. After the user is created, edit their metadata:
   - Find the user in the list
   - Click on their email
   - Scroll to **"Raw User Meta Data"** section
   - Add the required JSON metadata
   - Click **"Update user"**

## Troubleshooting User Creation Issues

### Error: "null value in column role violates not-null constraint"

This error has been fixed with the database trigger update. If you still encounter it:

1. **Verify metadata format**: Ensure your JSON is properly formatted
2. **Include required role**: Always include the `role` field in user metadata
3. **Use string values**: Ensure `school_id` is quoted as a string: `"1"`

### Error: "Failed to invite user"

1. **Check email format**: Ensure the email is valid
2. **Verify Supabase settings**: Confirm email provider is enabled
3. **Try alternative method**: Use the "Invite via email" option instead

### User created but no profile data

1. Check if the database trigger is working properly
2. Manually add the user to the profiles table if needed
3. Verify the user metadata is properly formatted

## Bulk User Import (Advanced)

For adding multiple users at once:

### Using CSV Import
1. Prepare a CSV file with columns:
   ```
   email,phone,full_name,role,school_id
   teacher1@school.com,+6281234567,Ahmad Fauzi,teacher,1
   parent1@gmail.com,+6287654321,Siti Aminah,parent,1
   ```

2. In Supabase dashboard, look for **"Import users"** option
3. Upload your CSV file
4. Map columns to appropriate fields
5. Ensure metadata is properly formatted

### Using Supabase API (Developer Method)
```javascript
// Example API call for bulk creation
const users = [
  {
    email: "teacher@school.com",
    user_metadata: {
      full_name: "Ahmad Fauzi",
      role: "teacher",
      school_id: "1"
    }
  }
  // ... more users
];

// Use Supabase Admin API to create users
```

## User Status and Management

### User Statuses
- **Unconfirmed**: User created but hasn't set password
- **Confirmed**: User has set password and can log in
- **Disabled**: User account is suspended

### Managing Existing Users

#### Edit User Information
1. Find user in the users list
2. Click on the user email
3. Edit metadata in the **"Raw User Meta Data"** section
4. Save changes

#### Reset User Password
1. Select user from list
2. Click **"Reset password"**
3. User will receive reset email
4. They can set a new password

#### Disable/Enable User
1. Select user from list
2. Use toggle or menu option to disable/enable
3. Disabled users cannot log in

## Security Best Practices

### Email Verification
- Always use valid, verified email addresses
- Users should confirm email ownership before account activation

### Role Assignment
- Double-check role assignments before creation
- Use principle of least privilege
- Regularly audit user roles and permissions

### Password Policy
- Users must create passwords of at least 6 characters
- Encourage strong password practices
- Consider implementing password complexity requirements

## Monitoring and Maintenance

### Regular Tasks
- Review user list for inactive accounts
- Update user information as needed
- Monitor failed login attempts
- Clean up disabled/unused accounts

### Audit Trail
- Keep records of user creation dates
- Document role changes and reasons
- Monitor user activity patterns

## Support and Contact

For technical issues with user creation:
1. Check Supabase documentation
2. Review error messages in dashboard
3. Contact system administrator
4. Escalate to development team if needed

---

**Note**: This process ensures secure, invite-only access to the MadraXis system while maintaining proper user role segregation and school-specific data access. 