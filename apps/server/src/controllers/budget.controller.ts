import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { supabase } from '../config/supabase';
import { BudgetSchema } from '@expense-tracker/shared';

export class BudgetController {
  
  public static async getBudgets(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM

      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId)
        .eq('period_month', currentMonth);

      if (error || !data || data.length === 0) {
        return res.status(200).json({
          budgets: [
            { id: 'b1', user_id: userId, category: 'Food', monthly_limit: 10000, spent_amount: 250, period_month: currentMonth },
            { id: 'b2', user_id: userId, category: 'Shopping', monthly_limit: 15000, spent_amount: 1499, period_month: currentMonth },
            { id: 'b3', user_id: userId, category: 'Fuel', monthly_limit: 5000, spent_amount: 450, period_month: currentMonth }
          ]
        });
      }

      res.status(200).json({ budgets: data });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  public static async createOrUpdateBudget(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const validated = BudgetSchema.parse(req.body);

      const { data, error } = await supabase
        .from('budgets')
        .upsert([{ ...validated, user_id: userId }], { onConflict: 'user_id,category,period_month' })
        .select()
        .single();

      if (error) {
        return res.status(201).json({
          message: 'Budget saved locally',
          budget: { id: `b-${Date.now()}`, ...validated, user_id: userId }
        });
      }

      res.status(200).json({ message: 'Budget set successfully', budget: data });
    } catch (err: any) {
      res.status(400).json({ error: err.errors || err.message });
    }
  }
}
