# Passwordless OTP Authentication Flow

This document outlines the passwordless authentication flow using One-Time Passwords (OTP) via magic links and 6-digit codes, implemented with Supabase.

## 1. Initiating the Login Process

The user begins the login process on a screen that uses the `AuthForm` component.

-   **Client-Side (`AuthForm.tsx`)**:
    -   The user enters their email address into the provided input field.
    -   Upon clicking "Send Magic Link", the `handleSendOtp` function is triggered.
    -   This function calls `supabase.auth.signInWithOtp`, passing the user's email.
        ```typescript
        const { error } = await supabase.auth.signInWithOtp({
          email: email,
          options: {
            // shouldCreateUser: true, // This is true by default
            emailRedirectTo: 'madraxis://otp',
          },
        });
        ```
    -   Supabase sends an email to the user containing both a magic link and a 6-digit OTP code.
    -   The application then navigates the user to the OTP verification screen (`/otp`), passing the email as a parameter for context.

## 2. Verifying the User's Identity

The user has two options to complete the login: using the magic link or manually entering the OTP code.

### Option A: Magic Link (Deep Linking)

1.  The user opens their email and clicks the magic link.
2.  The link follows the custom scheme `madraxis://otp`, which opens the MadraXis application directly.
3.  The Supabase client library handles the token from the URL.
4.  The `AuthProvider` listens for Supabase auth events. Upon detecting a `SIGNED_IN` event, it retrieves the user's session and role.
5.  The `AuthProvider` then automatically navigates the user to the appropriate dashboard (e.g., `/teacher`, `/student`, `/management`).

### Option B: Manual OTP Code Entry

1.  The user opens their email and notes the 6-digit OTP code.
2.  In the application's OTP verification screen (`OtpVerifyScreen.tsx`), they enter the code into the input field.
3.  The `handleVerifyOtp` function is called, which uses `supabase.auth.verifyOtp`.
    ```typescript
    const { error } = await supabase.auth.verifyOtp({
      email: email,
      token: token,
      type: 'email',
    });
    ```
4.  If the token is valid, Supabase creates a new session and triggers the `SIGNED_IN` event.
5.  Similar to the magic link flow, the `AuthProvider` detects the `SIGNED_IN` event and navigates the user to their role-specific dashboard.

## 3. Session Management

-   Once authenticated, the user's session is managed by the `AuthProvider` and persisted securely using `AsyncStorage`.
-   The `AuthProvider` ensures that the user remains logged in across app restarts until they explicitly sign out.
-   Signing out clears the session from Supabase and the local storage, redirecting the user back to the login screen.
