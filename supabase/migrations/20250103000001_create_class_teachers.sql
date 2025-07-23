-- Create class_teachers table for managing teacher-class relationships
CREATE TABLE IF NOT EXISTS class_teachers (
  id SERIAL PRIMARY KEY,
  class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL DEFAULT 'primary', -- 'primary', 'assistant', 'substitute'
  assigned_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique combination of class and user
  UNIQUE(class_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_class_teachers_class_id ON class_teachers(class_id);
CREATE INDEX IF NOT EXISTS idx_class_teachers_user_id ON class_teachers(user_id);
CREATE INDEX IF NOT EXISTS idx_class_teachers_role ON class_teachers(role);

-- Enable RLS
ALTER TABLE class_teachers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view class_teachers for their school" ON class_teachers
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM classes c
      JOIN profiles p ON p.school_id = c.school_id
      WHERE c.id = class_teachers.class_id
      AND p.id = auth.uid()::integer
    )
  );

CREATE POLICY "Users can insert class_teachers for their school" ON class_teachers
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM classes c
      JOIN profiles p ON p.school_id = c.school_id
      WHERE c.id = class_teachers.class_id
      AND p.id = auth.uid()::integer
    )
  );

CREATE POLICY "Users can update class_teachers for their school" ON class_teachers
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM classes c
      JOIN profiles p ON p.school_id = c.school_id
      WHERE c.id = class_teachers.class_id
      AND p.id = auth.uid()::integer
    )
  );

CREATE POLICY "Users can delete class_teachers for their school" ON class_teachers
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM classes c
      JOIN profiles p ON p.school_id = c.school_id
      WHERE c.id = class_teachers.class_id
      AND p.id = auth.uid()::integer
    )
  );