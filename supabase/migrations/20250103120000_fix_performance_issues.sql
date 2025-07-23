-- Fix Performance Issues Identified by Supabase Advisor
-- This migration addresses:
-- 1. Unindexed foreign keys
-- 2. RLS policy optimization for auth functions

-- Add missing indexes for foreign keys
-- Note: CONCURRENTLY cannot be used in migrations, but these indexes are small enough
CREATE INDEX IF NOT EXISTS idx_class_audit_log_performed_by 
  ON public.class_audit_log (performed_by);

CREATE INDEX IF NOT EXISTS idx_classes_updated_by 
  ON public.classes (updated_by);

-- Optimize RLS policies by wrapping auth functions in SELECT statements
-- This prevents re-evaluation for each row

-- Drop existing policies that have performance issues
DROP POLICY IF EXISTS "Allow SELECT on profiles table" ON public.profiles;
DROP POLICY IF EXISTS "Teachers can access their classes" ON public.classes;
DROP POLICY IF EXISTS "Administrators can access all classes" ON public.classes;
DROP POLICY IF EXISTS "Users can create classes in their school" ON public.classes;
DROP POLICY IF EXISTS "Class owners can update their classes" ON public.classes;
DROP POLICY IF EXISTS "Class owners can delete their classes" ON public.classes;
DROP POLICY IF EXISTS "Teachers can access subjects for their classes" ON public.class_subjects;
DROP POLICY IF EXISTS "Administrators can access all subjects" ON public.class_subjects;
DROP POLICY IF EXISTS "Teachers can create subjects in their classes" ON public.class_subjects;
DROP POLICY IF EXISTS "Teachers can update subjects in their classes" ON public.class_subjects;
DROP POLICY IF EXISTS "Teachers can delete subjects from their classes" ON public.class_subjects;
DROP POLICY IF EXISTS "Teachers can read audit logs for their classes" ON public.class_audit_log;
DROP POLICY IF EXISTS "Administrators can access all audit logs" ON public.class_audit_log;
DROP POLICY IF EXISTS "Only authenticated users can create audit logs" ON public.class_audit_log;
DROP POLICY IF EXISTS "Only administrators can delete audit logs" ON public.class_audit_log;

-- Recreate optimized policies with SELECT-wrapped auth functions

-- Profiles table policies
CREATE POLICY "Allow SELECT on profiles table" ON public.profiles
  FOR SELECT USING (
    id = (SELECT auth.uid())
  );

-- Classes table policies
CREATE POLICY "Teachers can access their classes" ON public.classes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.class_teachers ct 
      WHERE ct.class_id = classes.id 
      AND ct.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Administrators can access all classes" ON public.classes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = (SELECT auth.uid()) 
      AND p.role = 'administrator'
    )
  );

CREATE POLICY "Users can create classes in their school" ON public.classes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = (SELECT auth.uid()) 
      AND p.school_id = classes.school_id
    )
  );

CREATE POLICY "Class owners can update their classes" ON public.classes
  FOR UPDATE USING (
    created_by = (SELECT auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = (SELECT auth.uid()) 
      AND p.role = 'administrator'
    )
  );

CREATE POLICY "Class owners can delete their classes" ON public.classes
  FOR DELETE USING (
    created_by = (SELECT auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = (SELECT auth.uid()) 
      AND p.role = 'administrator'
    )
  );

-- Class subjects table policies
CREATE POLICY "Teachers can access subjects for their classes" ON public.class_subjects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.class_teachers ct 
      WHERE ct.class_id = class_subjects.class_id 
      AND ct.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Administrators can access all subjects" ON public.class_subjects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = (SELECT auth.uid()) 
      AND p.role = 'administrator'
    )
  );

CREATE POLICY "Teachers can create subjects in their classes" ON public.class_subjects
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.class_teachers ct 
      WHERE ct.class_id = class_subjects.class_id 
      AND ct.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Teachers can update subjects in their classes" ON public.class_subjects
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.class_teachers ct 
      WHERE ct.class_id = class_subjects.class_id 
      AND ct.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Teachers can delete subjects from their classes" ON public.class_subjects
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.class_teachers ct 
      WHERE ct.class_id = class_subjects.class_id 
      AND ct.user_id = (SELECT auth.uid())
    )
  );

-- Class audit log table policies
CREATE POLICY "Teachers can read audit logs for their classes" ON public.class_audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.class_teachers ct 
      WHERE ct.class_id = class_audit_log.class_id 
      AND ct.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Administrators can access all audit logs" ON public.class_audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = (SELECT auth.uid()) 
      AND p.role = 'administrator'
    )
  );

CREATE POLICY "Only authenticated users can create audit logs" ON public.class_audit_log
  FOR INSERT WITH CHECK (
    (SELECT auth.uid()) IS NOT NULL
  );

CREATE POLICY "Only administrators can delete audit logs" ON public.class_audit_log
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = (SELECT auth.uid()) 
      AND p.role = 'administrator'
    )
  );

-- Add comment explaining the optimization
COMMENT ON INDEX idx_class_audit_log_performed_by IS 'Index for foreign key performance optimization';
COMMENT ON INDEX idx_classes_updated_by IS 'Index for foreign key performance optimization';