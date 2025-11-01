import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 4000;
export const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';
export const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
export const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'change-admin-token';
