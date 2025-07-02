-- Step 1: Drop existing foreign key constraints pointing to students_legacy
ALTER TABLE public.class_students DROP CONSTRAINT IF EXISTS class_students_student_id_fkey;
ALTER TABLE public.incidents DROP CONSTRAINT IF EXISTS incidents_student_id_fkey;

-- Step 2: Add new foreign key constraints pointing to profiles
ALTER TABLE public.class_students ADD CONSTRAINT class_students_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.incidents ADD CONSTRAINT incidents_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.profiles(id) ON DELETE SET NULL; 