import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { UserRegisterSchema, UserLoginSchema } from '@expense-tracker/shared';

export class AuthController {
  
  public static async register(req: Request, res: Response) {
    try {
      const validated = UserRegisterSchema.parse(req.body);
      const { data, error } = await supabase.auth.signUp({
        email: validated.email,
        password: validated.password,
        options: {
          data: {
            full_name: validated.full_name || ''
          }
        }
      });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.status(201).json({
        message: 'Registration successful',
        user: data.user,
        session: data.session
      });
    } catch (err: any) {
      res.status(400).json({ error: err.errors || err.message });
    }
  }

  public static async login(req: Request, res: Response) {
    try {
      const validated = UserLoginSchema.parse(req.body);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: validated.email,
        password: validated.password
      });

      if (error) {
        return res.status(401).json({ error: error.message });
      }

      res.status(200).json({
        message: 'Login successful',
        user: data.user,
        session: data.session
      });
    } catch (err: any) {
      res.status(400).json({ error: err.errors || err.message });
    }
  }

  public static async getProfile(req: any, res: Response) {
    try {
      const userId = req.user?.id;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        return res.status(400).json({ error: error.message });
      }

      res.status(200).json({
        profile: data || { id: userId, email: req.user?.email, currency: 'INR', monthly_budget_target: 50000 }
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
