-- Step 1: Copy student-specific data into the new details table
INSERT INTO public.student_details (user_id, date_of_birth)
SELECT
    user_id,
    date_of_birth
FROM
    public.students_legacy
ON CONFLICT (user_id) DO NOTHING;

-- Step 2: Update the profiles full_name from the legacy table
UPDATE public.profiles p
SET
    full_name = sl.first_name || ' ' || sl.last_name
FROM
    public.students_legacy sl
WHERE
    p.id = sl.user_id;

-- Step 3: Drop the legacy table
DROP TABLE public.students_legacy; 