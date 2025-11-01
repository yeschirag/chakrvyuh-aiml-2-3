import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();
const subsFile = path.join(process.cwd(), 'src', 'data', 'submissions.json');


router.get('/status', requireAdmin, (req, res) => {
  const subs = JSON.parse(fs.readFileSync(subsFile, 'utf-8'));
  res.json({ ok: true, submissions: subs });
});

export default router;
