-- Migration to fix RLS policy syntax errors from previous migration

-- Re-create policies with optimized, stable function calls

-- Drop incorrect policies first to avoid conflicts
DROP POLICY IF EXISTS "Allow incident viewing based on role" ON public.incidents;
DROP POLICY IF EXISTS "Allow management to delete incidents" ON public.incidents;
DROP POLICY IF EXISTS "Allow management to update incidents" ON public.incidents;
DROP POLICY IF EXISTS "Allow read access to student details" ON public.student_details;
DROP POLICY IF EXISTS "Allow updates to student details" ON public.student_details;
DROP POLICY IF EXISTS "Allow management to delete student details" ON public.student_details;
DROP POLICY IF EXISTS "Allow read access to teacher details" ON public.teacher_details;
DROP POLICY IF EXISTS "Allow updates to teacher details" ON public.teacher_details;
DROP POLICY IF EXISTS "Allow management to delete teacher details" ON public.teacher_details;
DROP POLICY IF EXISTS "Allow read access to parent details" ON public.parent_details;
DROP POLICY IF EXISTS "Allow updates to parent details" ON public.parent_details;
DROP POLICY IF EXISTS "Allow management to delete parent details" ON public.parent_details;
DROP POLICY IF EXISTS "Allow read access to management details" ON public.management_details;
DROP POLICY IF EXISTS "Allow updates to management details" ON public.management_details;
DROP POLICY IF EXISTS "Allow management to delete management details" ON public.management_details;
DROP POLICY IF EXISTS "Allow read access to student performance records" ON public.student_performance;
DROP POLICY IF EXISTS "Allow read access to teacher performance records" ON public.teacher_performance;

-- Now, create the corrected policies

-- Table: incidents
CREATE POLICY "Allow incident viewing based on role" ON public.incidents FOR SELECT USING (((reporter_id = (SELECT auth.uid())) OR ((school_id = (SELECT get_my_school_id())) AND ((SELECT get_my_role()) = ANY (ARRAY['teacher'::text, 'management'::text])))));
CREATE POLICY "Allow management to delete incidents" ON public.incidents FOR DELETE USING (((school_id = (SELECT get_my_school_id())) AND ((SELECT get_my_role()) = 'management'::text)));
CREATE POLICY "Allow management to update incidents" ON public.incidents FOR UPDATE USING (((school_id = (SELECT get_my_school_id())) AND ((SELECT get_my_role()) = 'management'::text))) WITH CHECK (((school_id = (SELECT get_my_school_id())) AND ((SELECT get_my_role()) = 'management'::text)));

-- Table: student_details
CREATE POLICY "Allow read access to student details" ON public.student_details FOR SELECT USING ((((SELECT auth.uid()) = user_id) OR is_in_my_school(user_id)));
CREATE POLICY "Allow updates to student details" ON public.student_details FOR UPDATE USING ((((SELECT auth.uid()) = user_id) OR (((SELECT get_my_role()) = 'management'::text) AND is_in_my_school(user_id)))) WITH CHECK ((((SELECT auth.uid()) = user_id) OR (((SELECT get_my_role()) = 'management'::text) AND is_in_my_school(user_id))));
CREATE POLICY "Allow management to delete student details" ON public.student_details FOR DELETE USING ((((SELECT get_my_role()) = 'management'::text) AND is_in_my_school(user_id)));

-- Table: teacher_details
CREATE POLICY "Allow read access to teacher details" ON public.teacher_details FOR SELECT USING ((((SELECT auth.uid()) = user_id) OR is_in_my_school(user_id)));
CREATE POLICY "Allow updates to teacher details" ON public.teacher_details FOR UPDATE USING ((((SELECT auth.uid()) = user_id) OR (((SELECT get_my_role()) = 'management'::text) AND is_in_my_school(user_id)))) WITH CHECK ((((SELECT auth.uid()) = user_id) OR (((SELECT get_my_role()) = 'management'::text) AND is_in_my_school(user_id))));
CREATE POLICY "Allow management to delete teacher details" ON public.teacher_details FOR DELETE USING ((((SELECT get_my_role()) = 'management'::text) AND is_in_my_school(user_id)));

-- Table: parent_details
CREATE POLICY "Allow read access to parent details" ON public.parent_details FOR SELECT USING ((((SELECT auth.uid()) = user_id) OR is_in_my_school(user_id)));
CREATE POLICY "Allow updates to parent details" ON public.parent_details FOR UPDATE USING ((((SELECT auth.uid()) = user_id) OR (((SELECT get_my_role()) = 'management'::text) AND is_in_my_school(user_id)))) WITH CHECK ((((SELECT auth.uid()) = user_id) OR (((SELECT get_my_role()) = 'management'::text) AND is_in_my_school(user_id))));
CREATE POLICY "Allow management to delete parent details" ON public.parent_details FOR DELETE USING ((((SELECT get_my_role()) = 'management'::text) AND is_in_my_school(user_id)));

-- Table: management_details
CREATE POLICY "Allow read access to management details" ON public.management_details FOR SELECT USING ((((SELECT auth.uid()) = user_id) OR is_in_my_school(user_id)));
CREATE POLICY "Allow updates to management details" ON public.management_details FOR UPDATE USING ((((SELECT auth.uid()) = user_id) OR (((SELECT get_my_role()) = 'management'::text) AND is_in_my_school(user_id)))) WITH CHECK ((((SELECT auth.uid()) = user_id) OR (((SELECT get_my_role()) = 'management'::text) AND is_in_my_school(user_id))));
CREATE POLICY "Allow management to delete management details" ON public.management_details FOR DELETE USING ((((SELECT get_my_role()) = 'management'::text) AND is_in_my_school(user_id) AND (user_id <> (SELECT auth.uid()))));

-- Table: student_performance
CREATE POLICY "Allow read access to student performance records" ON public.student_performance FOR SELECT USING ((((SELECT auth.uid()) = user_id) OR (((SELECT get_my_role()) = ANY (ARRAY['teacher'::text, 'management'::text])) AND is_in_my_school(user_id))));

-- Table: teacher_performance
CREATE POLICY "Allow read access to teacher performance records" ON public.teacher_performance FOR SELECT USING ((((SELECT auth.uid()) = user_id) OR (((SELECT get_my_role()) = 'management'::text) AND is_in_my_school(user_id)))); 