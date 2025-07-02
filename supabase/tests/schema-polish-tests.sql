-- Comprehensive Test Suite for Schema Polish & RLS Policies
-- Requires pg_tle extension to be enabled.

-- Setup: Create two schools for cross-school RLS testing
INSERT INTO public.schools (name) VALUES ('School A'), ('School B') ON CONFLICT (name) DO NOTHING;

-- Helper function to create a test user and profile
CREATE OR REPLACE FUNCTION test.create_user(
    p_email TEXT,
    p_role TEXT,
    p_school_name TEXT
) RETURNS uuid AS $$
DECLARE
    user_id uuid;
    school_id int;
BEGIN
    SELECT id INTO school_id FROM public.schools WHERE name = p_school_name;

    -- Create user in auth.users
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at)
    VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', p_email, 'test_password', now(), jsonb_build_object('role', p_role, 'school_id', school_id, 'full_name', p_email), now(), now())
    RETURNING id INTO user_id;

    -- Create profile via trigger
    -- The handle_new_user trigger should create the profile automatically.
    
    -- Create role-specific details
    IF p_role = 'student' THEN
        INSERT INTO public.student_details (user_id, nis) VALUES (user_id, 'NIS-' || p_email);
    ELSIF p_role = 'teacher' THEN
        INSERT INTO public.teacher_details (user_id, employee_id) VALUES (user_id, 'EMP-' || p_email);
    END IF;

    RETURN user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Test 1: Data Integrity & View Creation
CREATE OR REPLACE FUNCTION test.test_data_integrity() RETURNS TEXT AS $$
DECLARE
    student_id uuid;
    view_count int;
BEGIN
    student_id := test.create_user('studentA@schoolA.com', 'student', 'School A');
    
    SELECT count(*) INTO view_count FROM public.students WHERE id = student_id;

    IF view_count = 1 THEN
        RETURN 'Test 1 Passed: Student visible in view.';
    ELSE
        RETURN 'Test 1 Failed: Student not found in view.';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Test 2: RLS - Student can only see their own data
CREATE OR REPLACE FUNCTION test.test_rls_student() RETURNS TEXT AS $$
DECLARE
    studentA_id uuid;
    studentB_id uuid;
    record_count int;
BEGIN
    studentA_id := test.create_user('studentA.rls@schoolA.com', 'student', 'School A');
    studentB_id := test.create_user('studentB.rls@schoolA.com', 'student', 'School A');

    -- Impersonate studentA
    SET LOCAL ROLE postgres;
    SET LOCAL "request.jwt.claims" TO jsonb_build_object('sub', studentA_id, 'role', 'student', 'school_id', (SELECT id FROM schools WHERE name = 'School A'));
    
    SELECT count(*) INTO record_count FROM public.profiles;

    IF record_count = 1 THEN
        RETURN 'Test 2 Passed: Student can only see their own profile.';
    ELSE
        RETURN 'Test 2 Failed: Student can see ' || record_count || ' profiles.';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Test 3: RLS - Teacher can see students in their own school
CREATE OR REPLACE FUNCTION test.test_rls_teacher() RETURNS TEXT AS $$
DECLARE
    teacherA_id uuid;
    studentA_id uuid;
    studentB_id uuid;
    studentC_id uuid; -- From another school
    record_count int;
BEGIN
    teacherA_id := test.create_user('teacherA.rls@schoolA.com', 'teacher', 'School A');
    studentA_id := test.create_user('studentA.teacher.rls@schoolA.com', 'student', 'School A');
    studentB_id := test.create_user('studentB.teacher.rls@schoolA.com', 'student', 'School A');
    studentC_id := test.create_user('studentC.teacher.rls@schoolB.com', 'student', 'School B');

    -- Impersonate teacherA
    SET LOCAL ROLE postgres;
    SET LOCAL "request.jwt.claims" TO jsonb_build_object('sub', teacherA_id, 'role', 'teacher', 'school_id', (SELECT id FROM schools WHERE name = 'School A'));

    SELECT count(*) INTO record_count FROM public.students;

    IF record_count = 2 THEN
        RETURN 'Test 3 Passed: Teacher can see all students in their school.';
    ELSE
        RETURN 'Test 3 Failed: Teacher can see ' || record_count || ' students.';
    END IF;
END;
$$ LANGUAGE plpgsql;


-- Running the tests
SELECT test.test_data_integrity();
SELECT test.test_rls_student();
SELECT test.test_rls_teacher();

-- Cleanup: Remove all test data
TRUNCATE TABLE public.student_details, public.teacher_details, public.parent_details, public.management_details, public.student_performance, public.teacher_performance RESTART IDENTITY CASCADE;
DELETE FROM public.profiles WHERE id IN (SELECT id FROM auth.users WHERE email LIKE '%.rls@%');
DELETE FROM auth.users WHERE email LIKE '%.rls@%';
DELETE FROM auth.users WHERE email LIKE 'studentA@schoolA.com';
TRUNCATE TABLE public.schools RESTART IDENTITY CASCADE;
DROP FUNCTION test.create_user(text,text,text);
DROP FUNCTION test.test_data_integrity();
DROP FUNCTION test.test_rls_student();
DROP FUNCTION test.test_rls_teacher(); 