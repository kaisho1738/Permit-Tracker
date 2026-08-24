import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';

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
}
