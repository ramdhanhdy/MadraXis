-- RLS Policies for Detail and Performance Tables

-- Allow users to see their own detail records
CREATE POLICY "Enable read access for own user details" ON public.student_details FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Enable read access for own user details" ON public.teacher_details FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Enable read access for own user details" ON public.parent_details FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Enable read access for own user details" ON public.management_details FOR SELECT USING (auth.uid() = user_id);

-- Allow users to see their own performance records
CREATE POLICY "Enable read access for own performance records" ON public.student_performance FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Enable read access for own performance records" ON public.teacher_performance FOR SELECT USING (auth.uid() = user_id); 