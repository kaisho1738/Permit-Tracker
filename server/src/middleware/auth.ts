import { Request, Response, NextFunction } from 'express';
import { supabase } from '../db/supabase.js';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];

    // Verify token using Supabase client
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    }

    req.user = user;
    next();
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal authentication error' });
  }
};
