import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import { PORT, CORS_ORIGIN } from './config.js';
import { rateLimit } from './middleware/rateLimit.js';

import authRoutes from './routes/auth.js';
import level4Routes from './routes/level4.js';
import adminRoutes from './routes/admin.js';

const isProduction = process.env.NODE_ENV === "production";

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(cors({
  origin: isProduction ? undefined : process.env.CORS_ORIGIN,
  credentials: false
}));

app.use(rateLimit);

app.get('/', (_req, res) => res.json({ ok: true, service: 'Level4 API' }));

app.use('/api/auth', authRoutes);
app.use('/api/level4', level4Routes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => res.status(404).json({ ok: false, msg: 'Not found' }));

app.listen(PORT, () => {
  console.log(`Level4 server running on http://localhost:${PORT}`);
});
