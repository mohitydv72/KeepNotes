// server/controllers/auth.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
// import { JWT_SECRET } from '../config/database';

// Extend Express Request interface to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      res.status(400).json({ message: 'Username or email already exists' });
      return;
    }

    const user = new User({ username, email, password });
    await user.save();
    
    // Create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "fallback-secret", { expiresIn: '1d' });

    res.status(201).json({ token , user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "fallback-secret", { expiresIn: '1d' });

    res.json({ token  , user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
};

// create a router get user  by email
export const getUserByEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email }).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json({ id: user._id, username: user.username, email: user.email });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' });
  }
};
