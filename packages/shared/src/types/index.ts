export type TransactionType = 'expense' | 'income';

export type PaymentMethod = 'UPI' | 'Card' | 'Cash' | 'Net Banking' | 'Others';

export type DefaultCategory = 
  | 'Food'
  | 'Shopping'
  | 'Travel'
  | 'Fuel'
  | 'Entertainment'
  | 'Medical'
  | 'Education'
  | 'Salary'
  | 'Investment'
  | 'Utilities'
  | 'Bills'
  | 'Rent'
  | 'Insurance'
  | 'Subscription'
  | 'Others';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  currency: string;
  monthly_budget_target?: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  user_id?: string | null;
  name: string;
  icon: string;
  color: string;
  is_default: boolean;
  created_at?: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: TransactionType;
  category: string;
  merchant: string;
  description?: string;
  payment_method: PaymentMethod;
  date: string;
  notes?: string;
  receipt_url?: string;
  account_last4?: string;
  is_recurring?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category: string;
  monthly_limit: number;
  spent_amount?: number;
  period_month: string; // "YYYY-MM"
  created_at?: string;
  updated_at?: string;
}

export interface RecurringTransaction {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  merchant: string;
  billing_cycle: 'monthly' | 'yearly' | 'weekly';
  next_due_date: string;
  is_active: boolean;
  created_at?: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'budget_alert' | 'recurring_reminder' | 'weekly_summary' | 'monthly_summary' | 'system';
  is_read: boolean;
  created_at: string;
}

export interface NLPParseResult {
  amount: number;
  type: TransactionType;
  category: string;
  merchant: string;
  payment_method: PaymentMethod;
  date: string;
  description?: string;
  confidence: number;
  parsed_by: string;
}

export interface SMSParseResult {
  amount: number;
  type: TransactionType;
  category: string;
  merchant: string;
  account_last4: string;
  payment_method: PaymentMethod;
  date: string;
  raw_sms: string;
  confidence: number;
  parsed_by: string;
}

export interface AIAssistantResponse {
  answer: string;
  category?: string;
  amount?: number;
  recommendation?: string;
  parsed_by: string;
}
