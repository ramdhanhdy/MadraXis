# Authentication Simplification – Implementation Plan (July 1, 2025)

This document guides an executor step-by-step to replace the existing magic-link/OTP flow with an invite-only email-and-password flow while keeping security intact.

---

## PHASE 0 — Context & Discovery

**0-A  Verify Supabase project**  
• Project ID: `bsjbixlueqoxpxbeygoi` ("Madraxis").  
• Confirm tables: `profiles`, `auth.users`, etc., already exist and RLS is enabled.

**0-B  Note useful columns**  
`profiles`: `id`, `full_name`, `role`, `school_id`, `updated_at`.  
No schema edits needed.

---

## PHASE 1 — Supabase Auth Settings

1-A  Dashboard ➜ **Auth → Settings**  
1. Disable **Enable email sign-ups**.  
2. Keep **Email** provider enabled & "Confirm email" ON.  
3. Set **Reset-password redirect URL** ➜ `madraxis://reset-password`.

1-B  Dashboard ➜ **Auth → Users** (invite flow)  
• Add each user (email, phone, full name).  
• In _user metadata_ set:
```json
{
  "role": "teacher" | "management" | "student" | "parent",
  "school_id": 1
}
```
Do **not** set an initial password; they will create it.

---

## PHASE 2 — Front-End Routing Cleanup

2-A  Delete unused screens & references
```
app/screens/auth/RoleSelectionScreen.tsx
app/screens/auth/OtpVerificationScreen.tsx
```
Remove all imports/usages of `/screens/RoleSelectionScreen`.

2-B  Root redirect
```tsx
// app/index.tsx
import { Redirect } from 'expo-router';
export default function Index() {
  return <Redirect href="/(auth)/login" />;
}
```

---

## PHASE 3 — Auth UI Refactor

3-A  (Optional) Rename `LoginScreen` ➜ `AuthScreen`.

3-B  **Refactor `app/components/auth/AuthForm.tsx`**

Two modes inside one component:

| Mode | Fields | Primary Button | Supabase Call |
|------|--------|----------------|---------------|
| `login` (default) | Email + Password | "Login" | `supabase.auth.signInWithPassword()` |
| `reset` | Email | "Send Reset Link" | `supabase.auth.resetPasswordForEmail()` |

Additional details:
* Toggle link between modes ("Forgot / Set password?" ↔ "Back to Login").
* Remove old `handleSendOtp` & OTP magic-link logic.

3-C  **Update `app/(auth)/reset-password.tsx`**
1. On mount parse hash fragment to extract `access_token` & `refresh_token`, then call `supabase.auth.setSession()`.
2. Allow user to set a new password via `supabase.auth.updateUser({ password })`.
3. On success: `router.replace('/')` (AuthProvider handles role-based routing).

3-D  **Ensure deep-linking config** in `app.json` / `expo-router`:
```json
"scheme": "madraxis",
"deepLinking": { "prefixes": ["madraxis://"] }
```

---

## PHASE 4 — Auth Context Adjustments

4-A  In `src/context/AuthContext.tsx` remove the OTP navigation (`router.push('/otp'…)`).  
Routing by `user_metadata.role` stays as-is.

4-B  Purge remaining references to `/otp` and RoleSelection screen.

---

## PHASE 5 — Database & RLS Checks

5-A  Confirm trigger that maintains `public.profiles` from `auth.users` still exists.

5-B  Sample profiles RLS policy (already likely present but verify):
```sql
alter table public.profiles enable row level security;
create policy "Profiles are only accessible by owner"
  on profiles for all using (id = auth.uid());
```

5-C  No extra enforcement needed; invite-only + password reset covers password presence.

---

## PHASE 6 — Codebase Hygiene

6-A  Delete unused imports after file removals.  
6-B  Run `npm run lint` and ensure type/ESLint passes.  
6-C  Build with Expo (`expo prebuild --clean` or `eas build`) to confirm no linking errors.  
6-D  Update `README.md` and `docs/auth_flow.md`; remove `docs/otp_auth_flow.md`.

---

## PHASE 7 — Smoke & Regression Tests

1. Launch app ➜ Email+Password form appears.
2. Enter invited email w/o password ➜ choose "Set password" ➜ receive email ➜ deep-link opens reset screen ➜ set password ➜ lands in dashboard.
3. Logout ➜ login with new password works.
4. Unknown email shows "User not found" error.
5. Role-based redirects (teacher, management, etc.) still work.

---

### Deliverables Checklist
- [ ] Supabase auth settings updated.
- [ ] Deleted obsolete screens & routes.
- [ ] Unified `AuthForm` with login + reset.
- [ ] Deep-link reset-password screen updated.
- [ ] Navigation references fixed.
- [ ] Lint/build succeed.
- [ ] README & docs updated.


> **Completion Criterion:** The entire login sequence uses email + password with invite-only users; no OTP screens remain; app builds and routes correctly by role. 