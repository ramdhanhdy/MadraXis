# Database Testing Guide - full_name Validation

## Overview
This document provides SQL-based tests to verify that the `profiles.full_name` field behaves correctly after our database tidy-up fixes.

## Test Cases

### Test 1: Constraint Prevents Email Storage
**Purpose**: Verify that the `full_name_not_email` constraint blocks email addresses

```sql
-- This should FAIL with constraint violation
INSERT INTO profiles (id, full_name, role) 
VALUES (gen_random_uuid(), 'test@email.com', 'parent');

-- Expected result: ERROR 23514 - violates check constraint "full_name_not_email"
```

### Test 2: Valid Names Are Accepted
**Purpose**: Verify that proper names can be stored

```sql
-- This should SUCCEED
INSERT INTO profiles (id, full_name, role) 
VALUES (gen_random_uuid(), 'John Smith', 'parent');

-- Expected result: INSERT 0 1
```

### Test 3: NULL Values Are Accepted  
**Purpose**: Verify that NULL is acceptable (admin will fill later)

```sql
-- This should SUCCEED
INSERT INTO profiles (id, full_name, role) 
VALUES (gen_random_uuid(), NULL, 'teacher');

-- Expected result: INSERT 0 1
```

### Test 4: Trigger Handles Missing Metadata Correctly
**Purpose**: Verify that new users without full_name metadata get NULL (not email)

```sql
-- Simulate user creation without full_name metadata
-- This tests the handle_new_user() trigger behavior
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, 
                        email_confirmed_at, raw_user_meta_data, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated', 
  'authenticated',
  'newuser@example.com',
  'fake-encrypted-password',
  NOW(),
  '{"role": "parent"}'::jsonb,  -- No full_name in metadata
  NOW(),
  NOW()
);

-- Check that profile was created with full_name = NULL (not email)
SELECT full_name FROM profiles WHERE id = (
  SELECT id FROM auth.users WHERE email = 'newuser@example.com'
);

-- Expected result: full_name should be NULL, not 'newuser@example.com'
```

### Test 5: Trigger Handles Proper Metadata Correctly
**Purpose**: Verify that users WITH full_name metadata get the correct value

```sql
-- Simulate user creation with proper full_name metadata  
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, 
                        email_confirmed_at, raw_user_meta_data, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated', 
  'authenticated',
  'jane@example.com',
  'fake-encrypted-password',
  NOW(),
  '{"role": "teacher", "full_name": "Jane Doe"}'::jsonb,
  NOW(),
  NOW()
);

-- Check that profile was created with the correct full_name
SELECT full_name FROM profiles WHERE id = (
  SELECT id FROM auth.users WHERE email = 'jane@example.com'
);

-- Expected result: full_name should be 'Jane Doe'
```

## Running Tests

### Via Supabase Dashboard
1. Navigate to SQL Editor
2. Copy and paste each test case
3. Execute and verify expected results

### Via MCP Tools
```javascript
// Example using mcp_supabase_execute_sql
await mcp_supabase_execute_sql({
  project_id: "bsjbixlueqoxpxbeygoi",
  query: "INSERT INTO profiles (id, full_name, role) VALUES (gen_random_uuid(), 'test@email.com', 'parent');"
});
// Should return error about constraint violation
```

## Cleanup After Testing

```sql
-- Remove any test data created during testing
DELETE FROM auth.users WHERE email LIKE '%@example.com';
DELETE FROM profiles WHERE full_name IN ('John Smith', 'Jane Doe') OR id IN (
  SELECT id FROM auth.users WHERE email LIKE '%@example.com'
);
```

## Success Criteria

- ✅ Test 1 fails with constraint violation error
- ✅ Test 2 succeeds with proper name insertion  
- ✅ Test 3 succeeds with NULL value
- ✅ Test 4 creates profile with full_name = NULL (not email)
- ✅ Test 5 creates profile with correct full_name from metadata

All tests passing indicates the database fixes are working correctly. 