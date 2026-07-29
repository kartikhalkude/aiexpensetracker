import { z } from 'zod';

export const TransactionSchema = z.object({
  amount: z.number().positive('Amount must be greater than 0'),
  type: z.enum(['expense', 'income']),
  category: z.string().min(1, 'Category is required'),
  merchant: z.string().min(1, 'Merchant is required'),
  description: z.string().optional(),
  payment_method: z.enum(['UPI', 'Card', 'Cash', 'Net Banking', 'Others']),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  notes: z.string().optional(),
  receipt_url: z.string().optional(),
  account_last4: z.string().optional(),
  is_recurring: z.boolean().optional()
});

export const BudgetSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  monthly_limit: z.number().positive('Monthly limit must be greater than 0'),
  period_month: z.string().regex(/^\d{4}-\d{2}$/, 'Period month must be YYYY-MM')
});

export const NLPInputSchema = z.object({
  text: z.string().min(2, 'Text prompt must be at least 2 characters')
});

export const SMSInputSchema = z.object({
  sms_text: z.string().min(5, 'SMS text must be at least 5 characters')
});

export const AIAssistantQuerySchema = z.object({
  query: z.string().min(2, 'Query must be at least 2 characters')
});

export const UserRegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  full_name: z.string().optional()
});

export const UserLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});
