import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { supabase } from '../config/supabase';

export class CategoryController {
  public static async getCategories(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .or(`is_default.eq.true,user_id.eq.${userId}`);

      if (error || !data || data.length === 0) {
        // Fallback default system categories
        return res.status(200).json({
          categories: [
            { name: 'Food', icon: 'utensils', color: '#FF6B6B' },
            { name: 'Shopping', icon: 'shopping-bag', color: '#4D96FF' },
            { name: 'Travel', icon: 'car', color: '#6BCB77' },
            { name: 'Fuel', icon: 'gas-pump', color: '#FFD93D' },
            { name: 'Entertainment', icon: 'film', color: '#9966FF' },
            { name: 'Medical', icon: 'heart-pulse', color: '#FF6000' },
            { name: 'Education', icon: 'graduation-cap', color: '#36AE7C' },
            { name: 'Salary', icon: 'wallet', color: '#2EB086' },
            { name: 'Investment', icon: 'chart-line', color: '#1890FF' },
            { name: 'Utilities', icon: 'bolt', color: '#F86F03' },
            { name: 'Bills', icon: 'file-invoice-dollar', color: '#E15FED' },
            { name: 'Rent', icon: 'home', color: '#8D72E1' },
            { name: 'Insurance', icon: 'shield-halved', color: '#435585' },
            { name: 'Subscription', icon: 'repeat', color: '#00C49F' },
            { name: 'Others', icon: 'ellipsis-h', color: '#8E8E93' }
          ]
        });
      }

      res.status(200).json({ categories: data });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
