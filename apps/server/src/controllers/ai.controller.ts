import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { PythonNlpBridge } from '../services/pythonNlpBridge';
import { NLPInputSchema, SMSInputSchema, AIAssistantQuerySchema } from '@expense-tracker/shared';
import { supabase } from '../config/supabase';

export class AIController {

  /**
   * Parse natural language text or voice transcript prompt
   */
  public static async parseNaturalLanguage(req: Request, res: Response) {
    try {
      const validated = NLPInputSchema.parse(req.body);
      const result = await PythonNlpBridge.parseNaturalLanguage(validated.text);
      res.status(200).json({ success: true, result });
    } catch (err: any) {
      res.status(400).json({ error: err.errors || err.message });
    }
  }

  /**
   * Parse Indian Bank SMS text message
   */
  public static async parseSMS(req: Request, res: Response) {
    try {
      const validated = SMSInputSchema.parse(req.body);
      const result = await PythonNlpBridge.parseSms(validated.sms_text);
      res.status(200).json({ success: true, result });
    } catch (err: any) {
      res.status(400).json({ error: err.errors || err.message });
    }
  }

  /**
   * Financial assistant interactive Q&A endpoint
   */
  public static async assistantQuery(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id || 'demo-user';
      const validated = AIAssistantQuerySchema.parse(req.body);

      // Fetch user's recent transactions & budgets for financial context
      const { data: txData } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(30);

      const { data: budgetData } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId);

      const context = {
        transactions: txData || [
          { amount: 250, category: 'Food', type: 'expense' },
          { amount: 1499, category: 'Shopping', type: 'expense' },
          { amount: 450, category: 'Fuel', type: 'expense' },
          { amount: 50000, category: 'Salary', type: 'income' }
        ],
        budgets: budgetData || [
          { category: 'Food', monthly_limit: 10000, spent_amount: 250 }
        ]
      };

      const response = await PythonNlpBridge.queryAssistant(validated.query, context);
      res.status(200).json({ success: true, response });
    } catch (err: any) {
      res.status(400).json({ error: err.errors || err.message });
    }
  }
}
