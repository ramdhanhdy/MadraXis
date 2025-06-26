# ZaidApp Authentication and Onboarding Flow Documentation

This document outlines the authentication flow, automatic role assignment for new users, and the initial setup process for management users.

## 1. User Sign-up and Role Assignment

When a new user signs up through the application, their intended role (e.g., 'management', 'teacher', 'student') is captured during the registration process.

- **Client-Side (LoginScreen.tsx)**:
  - During the `supabase.auth.signUp()` call, the selected role is passed in the `options.data` field:
    ```javascript
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: { role: selectedRole }, // e.g., { role: 'management' }
      },
    });
    ```
  - This `options.data` is initially stored in the new user's `raw_user_meta_data` in the `auth.users` table.

- **Server-Side (Supabase Auth Hook - Edge Function: `set-default-role`)**:
  - A Supabase Database Webhook is configured to trigger the `set-default-role` Edge Function on every `INSERT` into the `auth.users` table.
  - **Webhook Configuration**:
    - **Name**: `Set Management Role on Signup` (or similar)
    - **Table**: `auth.users`
    - **Events**: `INSERT`
    - **HTTP Request Method**: `POST`
    - **URL**: `https://<YOUR_PROJECT_REF>.supabase.co/functions/v1/set-default-role`
  - **`set-default-role` Edge Function Logic**:
    1. Receives the new user record from the webhook payload.
    2. Reads the `role` from `record.raw_user_meta_data.role`.
    3. If the `requestedRole` is `'management'` (or any other role that needs specific `app_metadata` setup):
       - It uses the Supabase Admin client (with `SUPABASE_SERVICE_ROLE_KEY`) to update the new user's record.
       - The primary action is to set `app_metadata.role` to the determined role (e.g., `'management'`).
         ```javascript
         // Inside the Edge Function
         const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
           record.id,
           { app_metadata: { ...record.app_metadata, role: 'management' } }
         );
         ```
    4. This ensures that critical role information is stored securely in `app_metadata`, which can only be modified by server-side processes with admin privileges.

## 2. Management User Initial School Setup

After a management user logs in for the first time, the system checks if they have completed their initial school setup.

- **Redirection Logic (`app/_layout.tsx`)**:
  - When a user with the 'management' role (determined from `session.user.user_metadata.role` or ideally from `session.user.app_metadata.role` after the auth hook runs and session is refreshed) logs in:
  - The system checks if `session.user.user_metadata.school_id` exists.
    - If `school_id` **exists**, the user is redirected to `/management/dashboard`.
    - If `school_id` **is null/undefined**, the user is redirected to `/management/setup` (the School Setup Screen).

- **School Setup Screen (`app/management/setup.tsx`)**:
  - The management user provides basic information for their school (e.g., School Name, NPSN) and their own Full Name.
  - **Form Submission Logic**:
    1. An attempt is made to `INSERT` a new record into the `public.schools` table with the provided details.
    2. **RLS Policy for `schools` Table (`allow_management_insert_schools_v3`)**: This policy ensures that only authenticated users with `app_metadata.role = 'management'` can insert new schools.
       ```sql
       CREATE POLICY allow_management_insert_schools_v3
       ON public.schools
       FOR INSERT
       TO authenticated
       WITH CHECK (
         ((auth.jwt()->>'app_metadata')::jsonb->>'role' = 'management')
       );
       ```
    3. If the school insertion is successful, the client then updates the current user's `user_metadata` to include the `school_id` of the newly created school and their `full_name`.
       ```javascript
       // In setup.tsx
       const { error: userError } = await supabase.auth.updateUser({
         data: {
           school_id: schoolData.id, // ID from the newly inserted school
           full_name: managerName,
         }
       });
       ```
    4. The user's session is refreshed (`supabase.auth.refreshSession()`) to ensure the client has the latest `user_metadata`.
    5. The user is then typically redirected to the main dashboard, and the redirection logic in `_layout.tsx` will now grant access.

## 3. RLS Policies Summary for this Flow

- **`public.schools` Table**:
  - **INSERT**: `allow_management_insert_schools_v3` - Allows users with `app_metadata.role = 'management'` to insert.
  - (Other SELECT, UPDATE, DELETE policies for schools will apply based on `school_id` and role).

## Important Notes & Future Improvements:

- **Security of `user_metadata`**: While `user_metadata.role` is used as an initial signal for the Auth Hook, the authoritative role for RLS and application logic should always come from `app_metadata.role`.
- **Error Handling**: Robust error handling should be present in both client-side code and Edge Functions.
- **Transaction for Setup**: The school creation and user metadata update in `setup.tsx` should ideally be moved to a single Edge Function to ensure atomicity (both operations succeed or fail together). This is currently a TODO.
- **Role Management**: For more complex role systems or if roles can change, dedicated admin interfaces or Edge Functions would be needed to manage `app_metadata.role`.
