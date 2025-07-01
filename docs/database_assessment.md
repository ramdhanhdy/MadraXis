# Database Assessment

This document provides a comprehensive assessment of the MadraXis Supabase database, including security and performance analysis. The assessment was conducted after fixing a critical user signup bug and several related security vulnerabilities.

## Summary of Fixes

- **User Signup Bug:** Resolved the "Database error saving new user" error by setting a default `parent` role for new users in the `profiles` table.
- **Security Vulnerabilities:** Updated insecure Row Level Security (RLS) policies on the `incidents` table to use a secure method for checking user roles and school associations.

## Outstanding Issues and Recommendations

### Security (High Priority)

| Issue | Details | Recommendation |
| --- | --- | --- |
| **RLS Policies** | The `schools` table still has a policy that references the insecure `user_metadata`. | Update the policy to use the `profiles` table for role checks. |
| **Function Security** | Several database functions have a mutable search path, which can be a security risk. | Set a secure search path for all functions. |
| **Auth Settings** | OTP expiry is longer than recommended, and leaked password protection is disabled. | Reduce OTP expiry to one hour or less and enable leaked password protection. |

### Performance (Medium Priority)

| Issue | Details | Recommendation |
| --- | --- | --- |
| **Unindexed Foreign Keys** | Several tables have foreign keys without covering indexes, which can slow down queries. | Add indexes to all foreign keys. |
| **Multiple Permissive Policies** | The `schools` and `students` tables have multiple permissive RLS policies for the same role and action, which can impact performance. | Consolidate multiple permissive policies into a single policy where possible. |

## Detailed Findings

### Security

#### RLS Policies

The following policy on the `schools` table references the insecure `user_metadata`:

- `Allow management to insert schools`

This should be updated to use the `profiles` table for role checks, similar to the fixes applied to the `incidents` table.

#### Function Security

The following functions have a mutable search path:

- `handle_updated_at`
- `trigger_set_timestamp`
- `get_my_school_id`
- `get_my_role`
- `handle_new_user`
- `handle_new_user_set_app_role`

This can be a security risk if an attacker is able to create objects in a schema that is earlier in the search path. To mitigate this, you should set a secure search path for all functions. For example:

```sql
ALTER FUNCTION public.handle_updated_at() SET search_path = public;
```

#### Auth Settings

- **OTP Expiry:** The OTP expiry is currently set to more than an hour. It is recommended to set this value to less than an hour to reduce the window of opportunity for an attacker to use a stolen OTP.
- **Leaked Password Protection:** Leaked password protection is currently disabled. Enabling this feature will prevent users from using passwords that have been compromised in data breaches.

### Performance

#### Unindexed Foreign Keys

The following tables have foreign keys without covering indexes:

- `class_schedules`
- `class_students`
- `class_teachers`
- `incidents`
- `profiles`
- `schools`
- `students`

This can lead to suboptimal query performance. You should add indexes to all foreign keys to improve performance. For example:

```sql
CREATE INDEX ON public.class_schedules (class_id);
```

#### Multiple Permissive Policies

The following tables have multiple permissive RLS policies for the same role and action:

- `schools`
- `students`

This can impact performance as each policy must be executed for every relevant query. You should consolidate multiple permissive policies into a single policy where possible.
