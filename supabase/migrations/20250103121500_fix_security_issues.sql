-- Fix security advisor warnings
-- 1. Set search_path for functions to prevent search path injection attacks
-- 2. Enable leaked password protection

-- Drop and recreate get_user_role_and_school function with proper search_path
DROP FUNCTION IF EXISTS public.get_user_role_and_school(uuid);
CREATE FUNCTION public.get_user_role_and_school(user_id uuid)
RETURNS TABLE(role text, school_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN QUERY
  SELECT p.role::TEXT, p.school_id
  FROM profiles p
  WHERE p.id = user_id;
END;
$$;

-- Drop and recreate get_budget_health function with proper search_path
DROP FUNCTION IF EXISTS public.get_budget_health(uuid, date);
CREATE FUNCTION public.get_budget_health(p_category_id uuid, p_month date)
RETURNS TABLE(
    name character varying,
    budget_limit decimal,
    total_spent decimal,
    remaining decimal,
    percentage_used decimal,
    status text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
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

-- Drop and recreate get_finance_dashboard_summary function with proper search_path
DROP FUNCTION IF EXISTS public.get_finance_dashboard_summary(date);
CREATE FUNCTION public.get_finance_dashboard_summary(p_month date)
RETURNS TABLE(
    total_budget decimal,
    total_spent decimal,
    total_remaining decimal,
    categories_count integer,
    over_budget_count integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
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

-- Note: Leaked password protection must be enabled through the Supabase Dashboard
-- Go to Authentication > Settings > Password Protection and enable "Check for leaked passwords"
-- This cannot be done via SQL migration as it's a configuration setting