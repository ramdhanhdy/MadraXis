-- Add unique constraint to schools.name to prevent duplicate school names
ALTER TABLE public.schools ADD CONSTRAINT schools_name_key UNIQUE (name); 