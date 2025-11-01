import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

const router = Router();
const teamsPath = path.join(process.cwd(), 'src', 'data', 'teams.json');


router.post('/login', (req, res) => {
  const { teamCode } = req.body;
  if (!teamCode) return res.status(400).json({ ok: false, msg: 'teamCode required' });

  const teams = JSON.parse(fs.readFileSync(teamsPath, 'utf-8'));
  const found = teams.find(t => t.teamCode === teamCode);
  if (!found) return res.status(401).json({ ok: false, msg: 'Invalid team code' });

  const token = jwt.sign({ teamCode }, JWT_SECRET, { expiresIn: '8h' });
  return res.json({ ok: true, token, teamCode });
});

export default router;
