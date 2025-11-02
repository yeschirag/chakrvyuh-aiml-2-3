import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { PORT, CORS_ORIGIN } from './config.js';
import { rateLimit } from './middleware/rateLimit.js';

import authRoutes from './routes/auth.js';
import level4Routes from './routes/level4.js';
import adminRoutes from './routes/admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === "production";

const app = express();

// Helmet with CSP adjustments for Vite/React
app.use(helmet({
  contentSecurityPolicy: isProduction ? undefined : false
}));

app.use(morgan('dev'));
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

// CORS - in development, allow requests from Vite dev server
if (!isProduction) {
  app.use(cors({
    origin: CORS_ORIGIN,
    credentials: false
  }));
}

app.use(rateLimit);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/level4', level4Routes);
app.use('/api/admin', adminRoutes);

// Serve static files from React build ONLY in production
if (isProduction) {
  const webDistPath = path.join(__dirname, '../web/dist');
  
  app.use(express.static(webDistPath));
  
  // Handle React routing - send all non-API requests to index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(webDistPath, 'index.html'));
  });
} else {
  // Development: Just API endpoints, frontend runs on Vite dev server
  app.get('/', (_req, res) => res.json({ ok: true, service: 'Level4 API' }));
  
  app.use((req, res) => res.status(404).json({ ok: false, msg: 'Not found' }));
}

app.listen(PORT, () => {
  console.log(`Level4 server running on port ${PORT}`);
  if (!isProduction) {
    console.log(`Frontend dev server should be running on http://localhost:5173`);
  }
});