import { supabase } from '../utils/supabase';

// Types for financial management
export interface ExpenseCategory {
  id: string;
  name: string;
  school_id: number;
  created_at: string;
  updated_at: string;
}

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

export interface Budget {
  id: string;
  category_id: string;
  month: string;
  limit_amount: number;
  school_id: number;
  created_at: string;
  updated_at: string;
}

export interface BudgetHealth {
  category_name: string;
  budget_limit: number;
  total_spent: number;
  remaining: number;
  percentage_used: number;
  status: 'no_budget' | 'unused' | 'critical' | 'warning' | 'healthy';
}

export interface DashboardSummary {
  total_budget: number;
  total_spent: number;
  total_remaining: number;
  categories_count: number;
  over_budget_count: number;
}

// Expense Categories CRUD Operations
export const expenseCategories = {
  // Get all expense categories for current school
  async getAll(): Promise<ExpenseCategory[]> {
    const { data, error } = await supabase
      .from('expense_categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  // Create new expense category
  async create(name: string): Promise<ExpenseCategory> {
    const { data, error } = await supabase
      .from('expense_categories')
      .insert({ name })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update expense category
  async update(id: string, name: string): Promise<ExpenseCategory> {
    const { data, error } = await supabase
      .from('expense_categories')
      .update({ name })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete expense category
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('expense_categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Expenses CRUD Operations
export const expenses = {
  // Get all expenses with optional filters
  async getAll(filters?: {
    category_id?: string;
    date_from?: string;
    date_to?: string;
    limit?: number;
  }): Promise<Expense[]> {
    let query = supabase
      .from('expenses')
      .select(`
        *,
        expense_categories (
          id,
          name
        )
      `)
      .order('date', { ascending: false });

    if (filters?.category_id) {
      query = query.eq('category_id', filters.category_id);
    }

    if (filters?.date_from) {
      query = query.gte('date', filters.date_from);
    }

    if (filters?.date_to) {
      query = query.lte('date', filters.date_to);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  // Get recent expenses (latest 3)
  async getRecent(): Promise<Expense[]> {
    return this.getAll({ limit: 3 });
  },

  // Create new expense
  async create(expense: Omit<Expense, 'id' | 'created_at' | 'updated_at' | 'school_id' | 'created_by'>): Promise<Expense> {
    const { data, error } = await supabase
      .from('expenses')
      .insert(expense)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update expense
  async update(id: string, expense: Partial<Omit<Expense, 'id' | 'created_at' | 'updated_at' | 'school_id' | 'created_by'>>): Promise<Expense> {
    const { data, error } = await supabase
      .from('expenses')
      .update(expense)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete expense
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Duplicate expense (for recurring items)
  async duplicate(id: string): Promise<Expense> {
    const { data: original, error: fetchError } = await supabase
      .from('expenses')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    const duplicated = {
      category_id: original.category_id,
      amount: original.amount,
      date: new Date().toISOString().split('T')[0], // Today's date
      description: original.description,
      notes: original.notes,
      attachment_url: original.attachment_url
    };

    return this.create(duplicated);
  }
};

// Budgets CRUD Operations
export const budgets = {
  // Get all budgets for current month
  async getAll(month?: string): Promise<Budget[]> {
    const targetMonth = month || new Date().toISOString().slice(0, 7) + '-01';
    
    const { data, error } = await supabase
      .from('budgets')
      .select(`
        *,
        expense_categories (
          id,
          name
        )
      `)
      .eq('month', targetMonth)
      .order('expense_categories(name)');

    if (error) throw error;
    return data || [];
  },

  // Create or update budget (upsert)
  async upsert(budget: Omit<Budget, 'id' | 'created_at' | 'updated_at' | 'school_id'>): Promise<Budget> {
    const { data, error } = await supabase
      .from('budgets')
      .upsert(budget, {
        onConflict: 'category_id,month,school_id'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete budget
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Quick adjust budget by percentage
  async adjustByPercentage(id: string, percentage: number): Promise<Budget> {
    const { data: current, error: fetchError } = await supabase
      .from('budgets')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    const newAmount = current.limit_amount * (1 + percentage / 100);
    
    const { data, error } = await supabase
      .from('budgets')
      .update({ limit_amount: newAmount })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Dashboard and Analytics Functions
export const analytics = {
  // Get budget health for a specific category
  async getBudgetHealth(categoryId: string, month?: string): Promise<BudgetHealth> {
    const targetMonth = month || new Date().toISOString().slice(0, 7) + '-01';
    
    const { data, error } = await supabase
      .rpc('get_budget_health', {
        p_category_id: categoryId,
        p_month: targetMonth
      });

    if (error) throw error;
    return data?.[0] || null;
  },

  // Get dashboard summary
  async getDashboardSummary(month?: string): Promise<DashboardSummary> {
    const targetMonth = month || new Date().toISOString().slice(0, 7) + '-01';
    
    const { data, error } = await supabase
      .rpc('get_finance_dashboard_summary', {
        p_month: targetMonth
      });

    if (error) throw error;
    return data?.[0] || {
      total_budget: 0,
      total_spent: 0,
      total_remaining: 0,
      categories_count: 0,
      over_budget_count: 0
    };
  },

  // Get spending by category for charts
  async getSpendingByCategory(month?: string): Promise<Array<{ category_name: string; total_spent: number }>> {
    const targetMonth = month || new Date().toISOString().slice(0, 7) + '-01';
    
    const { data, error } = await supabase
      .from('expenses')
      .select(`
        amount,
        expense_categories (
          name
        )
      `)
      .gte('date', targetMonth)
      .lt('date', new Date(new Date(targetMonth).getFullYear(), new Date(targetMonth).getMonth() + 1, 1).toISOString().slice(0, 10));

    if (error) throw error;

    // Aggregate spending by category
    const spending = data?.reduce((acc, expense) => {
      const categoryName = (expense.expense_categories as any)?.name || 'Unknown';
      acc[categoryName] = (acc[categoryName] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>) || {};

    return Object.entries(spending).map(([category_name, total_spent]) => ({
      category_name,
      total_spent
    }));
  }
};

// Search and Filter Functions
export const search = {
  // Search expenses by description
  async searchExpenses(query: string, filters?: {
    category_id?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<Expense[]> {
    let supabaseQuery = supabase
      .from('expenses')
      .select(`
        *,
        expense_categories (
          id,
          name
        )
      `)
      .ilike('description', `%${query}%`)
      .order('date', { ascending: false });

    if (filters?.category_id) {
      supabaseQuery = supabaseQuery.eq('category_id', filters.category_id);
    }

    if (filters?.date_from) {
      supabaseQuery = supabaseQuery.gte('date', filters.date_from);
    }

    if (filters?.date_to) {
      supabaseQuery = supabaseQuery.lte('date', filters.date_to);
    }

    const { data, error } = await supabaseQuery;

    if (error) throw error;
    return data || [];
  },

  // Get expenses by predefined filters (Today, Yesterday, This Week)
  async getExpensesByTimeFilter(filter: 'today' | 'yesterday' | 'this_week'): Promise<Expense[]> {
    const today = new Date();
    let dateFrom: string;
    let dateTo: string;

    switch (filter) {
      case 'today':
        dateFrom = dateTo = today.toISOString().split('T')[0];
        break;
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        dateFrom = dateTo = yesterday.toISOString().split('T')[0];
        break;
      case 'this_week':
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        dateFrom = startOfWeek.toISOString().split('T')[0];
        dateTo = today.toISOString().split('T')[0];
        break;
    }

    return expenses.getAll({ date_from: dateFrom, date_to: dateTo });
  }
};

// Utility functions for date handling
export const utils = {
  // Get current month as first day of month
  getCurrentMonth(): string {
    return new Date().toISOString().slice(0, 7) + '-01';
  },

  // Get first day of month for any date
  getFirstDayOfMonth(date: string): string {
    return date.slice(0, 7) + '-01';
  },

  // Format currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  },

  // Calculate days remaining in month
  getDaysRemainingInMonth(): number {
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return lastDay.getDate() - today.getDate();
  }
};
