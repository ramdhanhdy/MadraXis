-- Create class_audit_log table for tracking class changes
CREATE TABLE IF NOT EXISTS class_audit_log (
  id SERIAL PRIMARY KEY,
  class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete', 'restore'
  old_data JSONB,
  new_data JSONB,
  changed_by INTEGER NOT NULL REFERENCES profiles(id),
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_class_audit_log_class_id ON class_audit_log(class_id);
CREATE INDEX IF NOT EXISTS idx_class_audit_log_changed_by ON class_audit_log(changed_by);
CREATE INDEX IF NOT EXISTS idx_class_audit_log_changed_at ON class_audit_log(changed_at);

-- Enable RLS
ALTER TABLE class_audit_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view audit logs for their school" ON class_audit_log
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM classes c
      JOIN profiles p ON p.school_id = c.school_id
      WHERE c.id = class_audit_log.class_id
      AND p.id = auth.uid()::integer
    )
  );

CREATE POLICY "Users can insert audit logs for their school" ON class_audit_log
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM classes c
      JOIN profiles p ON p.school_id = c.school_id
      WHERE c.id = class_audit_log.class_id
      AND p.id = auth.uid()::integer
    )
  );