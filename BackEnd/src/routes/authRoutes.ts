// server/routes/auth.ts
import express from 'express';
import { signup, login , getUserByEmail } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware'; // Optional, if you want to protect routes

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/users/:email', authMiddleware, getUserByEmail);


export default router;