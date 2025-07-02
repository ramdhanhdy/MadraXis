# Database Row Level Security (RLS) Notes

## Current Implementation (Phase 1 - MVP for Single Client)

**Objective:** Allow initial app functionality, particularly for the 'management' role to set up their school.

1.  **Role Source for RLS:**
    *   RLS policies, specifically for the `public.schools` table `INSERT` operations, are currently configured to check `(auth.jwt() -> 'user_metadata' ->> 'role') = 'management'`.
    *   This was a pragmatic decision to unblock development due to initial complexities with ensuring `app_metadata.role` was consistently available and used by RLS policies at the point of school creation.

2.  **`schools` Table `INSERT` Policy:**
    ```sql
    CREATE POLICY "Allow management to insert schools" 
    ON public.schools 
    FOR INSERT 
    TO authenticated 
    WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'management');
    ```

3.  **`app_metadata.role` Population:**
    *   A PostgreSQL database trigger (`on_auth_user_created_set_app_role`) and its associated function (`public.handle_new_user_set_app_role`) are in place.
    *   This trigger successfully populates `app_metadata.role = 'management'` for new users who sign up with `role: 'management'` in their `user_metadata` (passed during `supabase.auth.signUp()`).
    *   This means `app_metadata.role` *is* being set correctly, but RLS policies for `schools` (and potentially other tables) are not yet using it.

## Future Enhancements (Phase 2 - Security Hardening & Scalability)

1.  **Transition RLS to `app_metadata`:**
    *   **Security:** `user_metadata` is client-editable and should not be trusted for RLS. All RLS policies must be transitioned to use `(auth.jwt() -> 'app_metadata' ->> 'role')`.
    *   This will leverage the already functional database trigger that populates `app_metadata.role`.

2.  **Implement `owner_id` for Data Scoping:**
    *   Add an `owner_id` (or similar, e.g., `created_by_user_id`) column to the `public.schools` table (and other relevant tables like `classes`, `students`, `teachers` if they are directly owned by a school or management user).
    *   This column should be a foreign key referencing `auth.users(id)`.
    *   RLS policies for `SELECT`, `UPDATE`, `DELETE` (and `INSERT`) should then be updated to check `owner_id = auth.uid()`, ensuring users can only affect data linked to them.

3.  **Comprehensive RLS Policies:**
    *   Define and implement robust RLS policies for `SELECT`, `UPDATE`, and `DELETE` operations for all relevant tables, using `app_metadata.role` and `owner_id` checks.

## Action Items for Next Development Phase:

*   [ ] Review all tables requiring RLS.
*   [ ] Add `owner_id` columns where appropriate (e.g., `public.schools`).
*   [ ] Update/Create RLS policies for all tables and operations (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) to use `app_metadata.role` and `owner_id`.
*   [ ] Thoroughly test all RLS policies to ensure correct data access and restriction.
