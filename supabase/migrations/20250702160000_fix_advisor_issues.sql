-- Migration to fix issues reported by Supabase Advisor

-- 1. PERFORMANCE: Add index to unindexed foreign key
-- Issue: Unindexed foreign key `profiles_school_id_fkey` on `public.profiles`.
-- Fix: Create an index on the `school_id` column.
CREATE INDEX IF NOT EXISTS profiles_school_id_idx ON public.profiles(school_id);

-- 2. PERFORMANCE: Optimize RLS policies by using stable functions
-- Issue: `auth_rls_initplan` warnings due to `auth.uid()` being re-evaluated per row.
-- Fix: Wrap `auth.uid()` in `(SELECT auth.uid())` to make it stable.

-- Table: incidents
ALTER POLICY "Allow authenticated users to report incidents" ON public.incidents WITH CHECK ((reporter_id = (SELECT auth.uid())) AND (school_id = (SELECT get_my_school_id())));
ALTER POLICY "Allow incident viewing based on role" ON public.incidents FOR SELECT USING (((reporter_id = (SELECT auth.uid())) OR ((school_id = (SELECT get_my_school_id())) AND ((SELECT get_my_role()) = ANY (ARRAY['teacher'::text, 'management'::text])))));
ALTER POLICY "Allow management to delete incidents" ON public.incidents FOR DELETE USING (((school_id = (SELECT get_my_school_id())) AND ((SELECT get_my_role()) = 'management'::text)));
ALTER POLICY "Allow management to update incidents" ON public.incidents FOR UPDATE USING (((school_id = (SELECT get_my_school_id())) AND ((SELECT get_my_role()) = 'management'::text))) WITH CHECK (((school_id = (SELECT get_my_school_id())) AND ((SELECT get_my_role()) = 'management'::text)));

-- Table: student_details
ALTER POLICY "Allow read access to student details" ON public.student_details FOR SELECT USING ((((SELECT auth.uid()) = user_id) OR is_in_my_school(user_id)));
ALTER POLICY "Allow updates to student details" ON public.student_details FOR UPDATE USING ((((SELECT auth.uid()) = user_id) OR (((SELECT get_my_role()) = 'management'::text) AND is_in_my_school(user_id)))) WITH CHECK ((((SELECT auth.uid()) = user_id) OR (((SELECT get_my_role()) = 'management'::text) AND is_in_my_school(user_id))));
ALTER POLICY "Allow management to delete student details" ON public.student_details FOR DELETE USING ((((SELECT get_my_role()) = 'management'::text) AND is_in_my_school(user_id)));
ALTER POLICY "Allow management to insert student details" ON public.student_details FOR INSERT WITH CHECK ((((SELECT get_my_role()) = 'management'::text) AND is_in_my_school(user_id)));

-- Table: teacher_details
ALTER POLICY "Allow read access to teacher details" ON public.teacher_details FOR SELECT USING ((((SELECT auth.uid()) = user_id) OR is_in_my_school(user_id)));
ALTER POLICY "Allow updates to teacher details" ON public.teacher_details FOR UPDATE USING ((((SELECT auth.uid()) = user_id) OR (((SELECT get_my_role()) = 'management'::text) AND is_in_my_school(user_id)))) WITH CHECK ((((SELECT auth.uid()) = user_id) OR (((SELECT get_my_role()) = 'management'::text) AND is_in_my_school(user_id))));
ALTER POLICY "Allow management to delete teacher details" ON public.teacher_details FOR DELETE USING ((((SELECT get_my_role()) = 'management'::text) AND is_in_my_school(user_id)));
ALTER POLICY "Allow management to insert teacher details" ON public.teacher_details FOR INSERT WITH CHECK ((((SELECT get_my_role()) = 'management'::text) AND is_in_my_school(user_id)));

-- Table: parent_details
ALTER POLICY "Allow read access to parent details" ON public.parent_details FOR SELECT USING ((((SELECT auth.uid()) = user_id) OR is_in_my_school(user_id)));
ALTER POLICY "Allow updates to parent details" ON public.parent_details FOR UPDATE USING ((((SELECT auth.uid()) = user_id) OR (((SELECT get_my_role()) = 'management'::text) AND is_in_my_school(user_id)))) WITH CHECK ((((SELECT auth.uid()) = user_id) OR (((SELECT get_my_role()) = 'management'::text) AND is_in_my_school(user_id))));
ALTER POLICY "Allow management to delete parent details" ON public.parent_details FOR DELETE USING ((((SELECT get_my_role()) = 'management'::text) AND is_in_my_school(user_id)));
ALTER POLICY "Allow management to insert parent details" ON public.parent_details FOR INSERT WITH CHECK ((((SELECT get_my_role()) = 'management'::text) AND is_in_my_school(user_id)));

-- Table: management_details
ALTER POLICY "Allow read access to management details" ON public.management_details FOR SELECT USING ((((SELECT auth.uid()) = user_id) OR is_in_my_school(user_id)));
ALTER POLICY "Allow updates to management details" ON public.management_details FOR UPDATE USING ((((SELECT auth.uid()) = user_id) OR (((SELECT get_my_role()) = 'management'::text) AND is_in_my_school(user_id)))) WITH CHECK ((((SELECT auth.uid()) = user_id) OR (((SELECT get_my_role()) = 'management'::text) AND is_in_my_school(user_id))));
ALTER POLICY "Allow management to delete management details" ON public.management_details FOR DELETE USING ((((SELECT get_my_role()) = 'management'::text) AND is_in_my_school(user_id) AND (user_id <> (SELECT auth.uid()))));
ALTER POLICY "Allow management to insert management details" ON public.management_details FOR INSERT WITH CHECK ((((SELECT get_my_role()) = 'management'::text) AND is_in_my_school(user_id)));

-- Table: student_performance
ALTER POLICY "Allow read access to student performance records" ON public.student_performance FOR SELECT USING ((((SELECT auth.uid()) = user_id) OR (((SELECT get_my_role()) = ANY (ARRAY['teacher'::text, 'management'::text])) AND is_in_my_school(user_id))));

-- Table: teacher_performance
ALTER POLICY "Allow read access to teacher performance records" ON public.teacher_performance FOR SELECT USING ((((SELECT auth.uid()) = user_id) OR (((SELECT get_my_role()) = 'management'::text) AND is_in_my_school(user_id))));


-- 3. PERFORMANCE: Consolidate multiple permissive RLS policies
-- Issue: `multiple_permissive_policies` warnings for SELECT action on several tables.
-- Fix: Change the command for the more restrictive "staff" policies from ALL to INSERT, UPDATE, DELETE,
-- which leaves only one permissive policy for the SELECT command.

ALTER POLICY "Allow class schedule management by staff" ON public.class_schedules FOR INSERT, UPDATE, DELETE USING ((is_class_in_my_school(class_id) AND ((SELECT get_my_role()) = ANY (ARRAY['management'::text, 'teacher'::text])))) WITH CHECK ((is_class_in_my_school(class_id) AND ((SELECT get_my_role()) = ANY (ARRAY['management'::text, 'teacher'::text]))));
ALTER POLICY "Allow class student management by staff" ON public.class_students FOR INSERT, UPDATE, DELETE USING ((is_class_in_my_school(class_id) AND ((SELECT get_my_role()) = ANY (ARRAY['management'::text, 'teacher'::text])))) WITH CHECK ((is_class_in_my_school(class_id) AND ((SELECT get_my_role()) = ANY (ARRAY['management'::text, 'teacher'::text]))));
ALTER POLICY "Allow class teacher management by staff" ON public.class_teachers FOR INSERT, UPDATE, DELETE USING ((is_class_in_my_school(class_id) AND ((SELECT get_my_role()) = ANY (ARRAY['management'::text, 'teacher'::text])))) WITH CHECK ((is_class_in_my_school(class_id) AND ((SELECT get_my_role()) = ANY (ARRAY['management'::text, 'teacher'::text]))));
ALTER POLICY "Allow class management by staff" ON public.classes FOR INSERT, UPDATE, DELETE USING (((school_id = (SELECT get_my_school_id())) AND ((SELECT get_my_role()) = ANY (ARRAY['management'::text, 'teacher'::text])))) WITH CHECK (((school_id = (SELECT get_my_school_id())) AND ((SELECT get_my_role()) = ANY (ARRAY['management'::text, 'teacher'::text]))));
ALTER POLICY "Allow management of student performance by staff" ON public.student_performance FOR INSERT, UPDATE, DELETE USING ((((SELECT get_my_role()) = ANY (ARRAY['teacher'::text, 'management'::text])) AND is_in_my_school(user_id))) WITH CHECK ((((SELECT get_my_role()) = ANY (ARRAY['teacher'::text, 'management'::text])) AND is_in_my_school(user_id)));
ALTER POLICY "Allow management of teacher performance by management" ON public.teacher_performance FOR INSERT, UPDATE, DELETE USING ((((SELECT get_my_role()) = 'management'::text) AND is_in_my_school(user_id))) WITH CHECK ((((SELECT get_my_role()) = 'management'::text) AND is_in_my_school(user_id))); 