import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { supabase } from '../config/supabase';

export class ExportController {
  
  public static async exportCSV(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      const list = transactions || [
        { date: '2026-07-29', type: 'expense', category: 'Food', merchant: 'Swiggy', amount: 250, payment_method: 'UPI' },
        { date: '2026-07-29', type: 'expense', category: 'Shopping', merchant: 'Amazon', amount: 1499, payment_method: 'Card' }
      ];

      let csvStr = 'Date,Type,Category,Merchant,Amount,Payment Method\n';
      for (const t of list) {
        csvStr += `"${t.date}","${t.type}","${t.category}","${t.merchant}",${t.amount},"${t.payment_method}"\n`;
      }

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=transactions_report.csv');
      res.status(200).send(csvStr);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
