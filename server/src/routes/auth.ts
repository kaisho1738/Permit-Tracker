import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', AuthController.registerHandler);
router.post('/login', AuthController.loginHandler);

export default router;
