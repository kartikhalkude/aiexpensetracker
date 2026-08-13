export type CategoryId =
  | 'food'
  | 'grocery'
  | 'petrol'
  | 'bills'
  | 'shopping'
  | 'health'
  | 'income'
  | 'other';

export type PaymentMethod = 'cash' | 'credit_card' | 'debit_card' | 'upi' | 'online';

export interface Expense {
  id: string;
  amount: number;
  description: string; // What in detail
  category: CategoryId;
  paymentMethod: PaymentMethod;
  date: string;
  isVoiceLogged?: boolean;
  createdAt: number;
}

export interface ParsedExpense {
  rawText: string;
  amount: number | null;
  description: string;
  category: CategoryId;
  paymentMethod: PaymentMethod;
  date: string;
}
