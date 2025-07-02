-- Step 1: Rename the existing students table to avoid conflict
ALTER TABLE public.students RENAME TO students_legacy;

-- Step 2: Now create the compatibility view
create or replace view public.students as
  select p.id as id,
         p.full_name,
         sd.*
    from public.profiles p
    left join public.student_details sd on sd.user_id = p.id
   where p.role = 'student'; 