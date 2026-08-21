import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import permitsRouter from './routes/permits.js';
import { requireAuth } from './middleware/auth.js';

dotenv.config({ path: '.env.local' });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Healthcheck
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes 
app.use('/api/permits', requireAuth, permitsRouter);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

