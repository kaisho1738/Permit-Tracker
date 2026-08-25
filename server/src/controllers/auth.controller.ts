import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export class AuthController {
  static async registerHandler(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const data: any = await AuthService.register(email, password);
      return res.status(201).json({
        message: 'Account created successfully',
        user: data.user,
        session: data.session || null,
      });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Registration failed' });
    }
  }

  static async loginHandler(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const data: any = await AuthService.login(email, password);
      return res.status(200).json({
        message: 'Logged in successfully',
        user: data.user,
        session: data.session || null,
      });
    } catch (err: any) {
      return res.status(401).json({ error: err.message || 'Authentication failed' });
    }
  }

  static async deleteAccountHandler(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: User not found' });
      }
      await AuthService.deleteAccount(userId);
      return res.status(200).json({ message: 'Account deleted successfully' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to delete account' });
    }
  }
}
