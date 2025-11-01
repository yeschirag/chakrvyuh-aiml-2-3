import jwt from 'jsonwebtoken';
import { JWT_SECRET, ADMIN_TOKEN } from '../config.js';

export const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
  if (!token) return res.status(401).json({ ok: false, msg: 'No token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.team = payload; // { teamCode }
    next();
  } catch {
    res.status(401).json({ ok: false, msg: 'Invalid token' });
  }
};

export const requireAdmin = (req, res, next) => {
  const token = req.headers['x-admin-token'];
  if (token && token === ADMIN_TOKEN) return next();
  return res.status(403).json({ ok: false, msg: 'Forbidden' });
};
