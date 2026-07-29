import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { supabase } from '../config/supabase';

export class AnalyticsController {

  public static async getSummary(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const todayStr = new Date().toISOString().split('T')[0];
      const monthStr = todayStr.substring(0, 7);

      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId);

      const txList = transactions || [
        { amount: 250, category: 'Food', merchant: 'Swiggy', type: 'expense', date: todayStr },
        { amount: 1499, category: 'Shopping', merchant: 'Amazon', type: 'expense', date: todayStr },
        { amount: 450, category: 'Fuel', merchant: 'Shell', type: 'expense', date: todayStr },
        { amount: 50000, category: 'Salary', merchant: 'Employer', type: 'income', date: todayStr }
      ];

      let income = 0;
      let expense = 0;
      let todaySpending = 0;
      let monthlySpending = 0;
      const categoryBreakdown: Record<string, number> = {};
      const merchantBreakdown: Record<string, number> = {};

      for (const t of txList) {
        const amt = Number(t.amount);
        if (t.type === 'income') {
          income += amt;
        } else {
          expense += amt;
          categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + amt;
          merchantBreakdown[t.merchant] = (merchantBreakdown[t.merchant] || 0) + amt;

          if (t.date === todayStr) todaySpending += amt;
          if (t.date.startsWith(monthStr)) monthlySpending += amt;
        }
      }

      res.status(200).json({
        summary: {
          balance: income - expense,
          income,
          expense,
          today_spending: todaySpending,
          monthly_spending: monthlySpending,
          category_breakdown: categoryBreakdown,
          merchant_breakdown: merchantBreakdown
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
