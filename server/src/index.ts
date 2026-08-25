import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import permitsRouter from './routes/permits.js';
import authRouter from './routes/auth.js';
import { requireAuth } from './middleware/auth.js';

// Load environment variables from .env.local with fallback to .env
dotenv.config({ path: '.env.local' });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Global middleware
app.use(cors());
app.use(express.json());

// Healthcheck endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/permits', requireAuth, permitsRouter);

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

export default app;

