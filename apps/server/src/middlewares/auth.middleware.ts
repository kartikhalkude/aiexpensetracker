import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

export const authenticateJwt = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // For local dev/demo testing fallback, populate a default demo user id if no header is present
    req.user = { id: '00000000-0000-0000-0000-000000000001', email: 'demo@expensetracker.ai' };
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    }
    req.user = { id: data.user.id, email: data.user.email };
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized authentication failure' });
  }
};
