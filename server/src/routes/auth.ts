import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/register', AuthController.registerHandler);
router.post('/login', AuthController.loginHandler);
router.delete('/me', requireAuth, AuthController.deleteAccountHandler);

export default router;
