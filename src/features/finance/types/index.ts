// Financial management types for the finance feature

// Expense category interface
export interface ExpenseCategory {
  id: string;
  name: string;
  school_id: number;
  created_at: string;
  updated_at: string;
}

// Expense interface
export interface Expense {
  id: string;
  category_id: string;
  amount: number;
  date: string;
  description: string;
  notes?: string;
  attachment_url?: string;
  school_id: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Budget interface
export interface Budget {
  id: string;
  category_id: string;
  month: string;
  limit_amount: number;
  school_id: number;
  created_at: string;
  updated_at: string;
}

// Budget health tracking
export interface BudgetHealth {
  category_name: string;
  budget_limit: number;
  total_spent: number;
  remaining: number;
  percentage_used: number;
  status: 'no_budget' | 'unused' | 'critical' | 'warning' | 'healthy';
}

// Dashboard summary
export interface DashboardSummary {
  total_budget: number;
  total_spent: number;
  total_remaining: number;
  categories_count: number;
  over_budget_count: number;
}

// Chart data
export interface SpendingByCategory {
  category_name: string;
  total_spent: number;
}

// API response types
export interface FinanceAPIResponse<T> {
  data: T;
  error?: string;
}

// Filter types
export interface ExpenseFilters {
  category_id?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
}

export type TimeFilter = 'today' | 'yesterday' | 'this_week';