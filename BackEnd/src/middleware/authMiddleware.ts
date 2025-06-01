// server/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
// import { JWT_SECRET } from '../config';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authMiddleware =async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) :Promise<void> =>  {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    res.status(401).json({ message: 'Please log in' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};