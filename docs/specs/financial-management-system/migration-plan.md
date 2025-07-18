# Financial Management System Migration Plan

## Executive Summary
This migration plan creates the financial management system tables while maintaining full backward compatibility with the existing schema. The plan addresses data type inconsistencies and implements comprehensive RLS policies.

## Schema Discrepancies Analysis

### 1. Data Type Inconsistency
- **Issue**: Spec defines `school_id` as `uuid`, but existing `schools.id` is `integer`
- **Impact**: Foreign key relationships would fail
- **Resolution**: Use `integer` for `school_id` in financial tables to match existing schema

### 2. Missing Tables
- **Issue**: No financial management tables exist
- **Resolution**: Create all three tables with proper relationships

### 3. Missing RLS Policies
- **Issue**: No access control for financial data
- **Resolution**: Implement management-role restrictions

## Migration SQL

### Step 1: Create expense_categories table
```sql
-- Create expense_categories table
CREATE TABLE public.expense_categories (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    school_id integer NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    
    -- Constraints
    CONSTRAINT expense_categories_name_school_unique UNIQUE (name, school_id),
    CONSTRAINT expense_categories_name_not_empty CHECK (length(trim(name)) > 0)
);

-- Enable RLS
ALTER TABLE public.expense_categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow management to manage expense categories"
    ON public.expense_categories
    FOR ALL
    TO public
    USING (
        school_id = get_my_school_id() 
        AND get_my_role() = 'management'
    );

CREATE POLICY "Allow school members to view expense categories"
    ON public.expense_categories
    FOR SELECT
    TO public
    USING (school_id = get_my_school_id());

-- Create indexes
CREATE INDEX idx_expense_categories_school_id ON public.expense_categories(school_id);
CREATE INDEX idx_expense_categories_name ON public.expense_categories(name);

-- Add updated_at trigger
CREATE TRIGGER set_expense_categories_updated_at
    BEFORE UPDATE ON public.expense_categories
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();
```

### Step 2: Create expenses table
```sql
-- Create expenses table
CREATE TABLE public.expenses (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id uuid NOT NULL REFERENCES public.expense_categories(id) ON DELETE RESTRICT,
    amount decimal(15,2) NOT NULL,
    date date NOT NULL,
    description text NOT NULL,
    notes text,
    attachment_url text,
    school_id integer NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    
    -- Constraints
    CONSTRAINT expenses_amount_positive CHECK (amount > 0),
    CONSTRAINT expenses_description_not_empty CHECK (length(trim(description)) > 0),
    CONSTRAINT expenses_date_not_future CHECK (date <= CURRENT_DATE),
    CONSTRAINT expenses_school_id_matches_category CHECK (
        school_id = (SELECT school_id FROM expense_categories WHERE id = category_id)
    )
);

-- Enable RLS
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow management to manage expenses"
    ON public.expenses
    FOR ALL
    TO public
    USING (
        school_id = get_my_school_id() 
        AND get_my_role() = 'management'
    );

CREATE POLICY "Allow school members to view expenses"
    ON public.expenses
    FOR SELECT
    TO public
    USING (school_id = get_my_school_id());

-- Create indexes
CREATE INDEX idx_expenses_school_id ON public.expenses(school_id);
CREATE INDEX idx_expenses_category_id ON public.expenses(category_id);
CREATE INDEX idx_expenses_date ON public.expenses(date);
CREATE INDEX idx_expenses_created_by ON public.expenses(created_by);
CREATE INDEX idx_expenses_amount ON public.expenses(amount);

-- Add updated_at trigger
CREATE TRIGGER set_expenses_updated_at
    BEFORE UPDATE ON public.expenses
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();
```

### Step 3: Create budgets table
```sql
-- Create budgets table
CREATE TABLE public.budgets (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id uuid NOT NULL REFERENCES public.expense_categories(id) ON DELETE CASCADE,
    month date NOT NULL,
    limit_amount decimal(15,2) NOT NULL,
    school_id integer NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    
    -- Constraints
    CONSTRAINT budgets_limit_amount_positive CHECK (limit_amount > 0),
    CONSTRAINT budgets_month_first_day CHECK (EXTRACT(day FROM month) = 1),
    CONSTRAINT budgets_category_month_school_unique UNIQUE (category_id, month, school_id),
    CONSTRAINT budgets_school_id_matches_category CHECK (
        school_id = (SELECT school_id FROM expense_categories WHERE id = category_id)
    )
);

-- Enable RLS
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow management to manage budgets"
    ON public.budgets
    FOR ALL
    TO public
    USING (
        school_id = get_my_school_id() 
        AND get_my_role() = 'management'
    );

CREATE POLICY "Allow school members to view budgets"
    ON public.budgets
    FOR SELECT
    TO public
    USING (school_id = get_my_school_id());

-- Create indexes
CREATE INDEX idx_budgets_school_id ON public.budgets(school_id);
CREATE INDEX idx_budgets_category_id ON public.budgets(category_id);
CREATE INDEX idx_budgets_month ON public.budgets(month);

-- Add updated_at trigger
CREATE TRIGGER set_budgets_updated_at
    BEFORE UPDATE ON public.budgets
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();
```

### Step 4: Create aggregation functions
```sql
-- Function to get budget health for a category
CREATE OR REPLACE FUNCTION get_budget_health(
    p_category_id uuid,
    p_month date DEFAULT date_trunc('month', CURRENT_DATE)::date
)
RETURNS TABLE (
    category_name text,
    budget_limit decimal,
    total_spent decimal,
    remaining decimal,
    percentage_used decimal,
    status text
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ec.name,
        COALESCE(b.limit_amount, 0::decimal) as budget_limit,
        COALESCE(SUM(e.amount), 0::decimal) as total_spent,
        COALESCE(b.limit_amount, 0::decimal) - COALESCE(SUM(e.amount), 0::decimal) as remaining,
        CASE 
            WHEN b.limit_amount > 0 THEN 
                ROUND((COALESCE(SUM(e.amount), 0::decimal) / b.limit_amount * 100), 2)
            ELSE 0::decimal
        END as percentage_used,
        CASE 
            WHEN b.limit_amount IS NULL THEN 'no_budget'
            WHEN COALESCE(SUM(e.amount), 0) = 0 THEN 'unused'
            WHEN (COALESCE(SUM(e.amount), 0) / b.limit_amount) <= 0.05 THEN 'critical'
            WHEN (COALESCE(SUM(e.amount), 0) / b.limit_amount) <= 0.20 THEN 'warning'
            ELSE 'healthy'
        END as status
    FROM expense_categories ec
    LEFT JOIN budgets b ON ec.id = b.category_id AND b.month = p_month
    LEFT JOIN expenses e ON ec.id = e.category_id 
        AND date_trunc('month', e.date) = p_month
    WHERE ec.id = p_category_id
        AND ec.school_id = get_my_school_id()
    GROUP BY ec.id, ec.name, b.limit_amount;
END;
$$;

-- Function to get dashboard summary
CREATE OR REPLACE FUNCTION get_finance_dashboard_summary(
    p_month date DEFAULT date_trunc('month', CURRENT_DATE)::date
)
RETURNS TABLE (
    total_budget decimal,
    total_spent decimal,
    total_remaining decimal,
    categories_count integer,
    over_budget_count integer
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(b.limit_amount), 0::decimal) as total_budget,
        COALESCE(SUM(expense_totals.total_spent), 0::decimal) as total_spent,
        COALESCE(SUM(b.limit_amount), 0::decimal) - COALESCE(SUM(expense_totals.total_spent), 0::decimal) as total_remaining,
        COUNT(DISTINCT ec.id)::integer as categories_count,
        COUNT(CASE WHEN expense_totals.total_spent > b.limit_amount THEN 1 END)::integer as over_budget_count
    FROM expense_categories ec
    LEFT JOIN budgets b ON ec.id = b.category_id AND b.month = p_month
    LEFT JOIN (
        SELECT 
            category_id,
            SUM(amount) as total_spent
        FROM expenses 
        WHERE date_trunc('month', date) = p_month
        GROUP BY category_id
    ) expense_totals ON ec.id = expense_totals.category_id
    WHERE ec.school_id = get_my_school_id();
END;
$$;
```

### Step 5: Insert default expense categories
```sql
-- Insert default expense categories for existing schools
INSERT INTO public.expense_categories (name, school_id)
SELECT category_name, s.id
FROM (
    VALUES 
        ('Salaries'),
        ('Supplies'),
        ('Utilities'),
        ('Maintenance'),
        ('Transportation'),
        ('Technology'),
        ('Professional Development'),
        ('Insurance'),
        ('Other')
) AS categories(category_name)
CROSS JOIN public.schools s
ON CONFLICT (name, school_id) DO NOTHING;
```

## Specification Amendments

### Updated Database Schema Section
Replace the existing schema section in `design.md` with:

```markdown
## Database Schema

New tables (using existing integer school_id for consistency):

- **expense_categories**:
  - id (uuid, primary key)
  - name (text, unique per school)
  - school_id (integer, foreign key to schools)
  - created_at (timestamp with time zone)
  - updated_at (timestamp with time zone)

- **expenses**:
  - id (uuid, primary key)
  - category_id (uuid, foreign key to expense_categories)
  - amount (decimal(15,2), must be > 0)
  - date (date, cannot be future)
  - description (text, required)
  - notes (text, optional)
  - attachment_url (text, optional)
  - school_id (integer, foreign key to schools)
  - created_by (uuid, foreign key to profiles)
  - created_at (timestamp with time zone)
  - updated_at (timestamp with time zone)

- **budgets**:
  - id (uuid, primary key)
  - category_id (uuid, foreign key to expense_categories)
  - month (date, first day of month)
  - limit_amount (decimal(15,2), must be > 0)
  - school_id (integer, foreign key to schools)
  - created_at (timestamp with time zone)
  - updated_at (timestamp with time zone)

Additional constraints:
- Unique constraint on (category_id, month, school_id) for budgets
- Check constraints ensure data integrity
- Cross-table validation ensures school_id consistency

RLS Policies: 
- Management role can manage all financial data for their school
- All school members can view financial data for their school
- Policies use existing get_my_role() and get_my_school_id() functions
```

## Rollback Plan

```sql
-- Rollback in reverse order
DROP FUNCTION IF EXISTS get_finance_dashboard_summary(date);
DROP FUNCTION IF EXISTS get_budget_health(uuid, date);
DROP TABLE IF EXISTS public.budgets;
DROP TABLE IF EXISTS public.expenses;
DROP TABLE IF EXISTS public.expense_categories;
```

## Validation Queries

```sql
-- Verify table creation
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('expense_categories', 'expenses', 'budgets');

-- Verify RLS policies
SELECT tablename, policyname FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('expense_categories', 'expenses', 'budgets');

-- Verify default categories
SELECT s.name as school_name, COUNT(ec.id) as categories_count
FROM schools s
LEFT JOIN expense_categories ec ON s.id = ec.school_id
GROUP BY s.id, s.name;
```

## Implementation Notes

1. **Zero Data Loss**: No existing data is modified or deleted
2. **Backward Compatibility**: All existing functionality remains intact
3. **Performance**: Indexes created for optimal query performance
4. **Security**: Comprehensive RLS policies using existing role system
5. **Data Integrity**: Multiple constraint layers prevent invalid data
6. **Extensibility**: Schema supports future features like file attachments

## Next Steps

1. Review and approve this migration plan
2. Execute migration in development environment
3. Run validation queries
4. Test with sample data
5. Deploy to production during maintenance window
