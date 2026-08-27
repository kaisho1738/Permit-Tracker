import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import permitsRouter from './routes/permits.js';
import authRouter from './routes/auth.js';
import { requireAuth } from './middleware/auth.js';

// Load environment variables from .env.local with fallback to .env
dotenv.config({ path: '.env.local' });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust reverse proxies (important for Vercel, Render, Heroku, Cloudflare)
app.set('trust proxy', 1);

// Global middleware
app.use(cors());
app.use(express.json());

// 1. General rate limiter (e.g. 100 requests per 15 mins per IP across all /api routes)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per window
  standardHeaders: true, // Return standard RateLimit-* headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

// 2. Strict auth rate limiter (e.g. 10 login/register attempts per 15 mins per IP)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many authentication attempts from this IP, please try again after 15 minutes.',
  },
});

// Healthcheck endpoint (excluded from strict limiters)
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes with rate limiting
app.use('/api', generalLimiter);
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/permits', requireAuth, permitsRouter);

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

export default app;


